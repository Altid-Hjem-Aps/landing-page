import { createHmac } from 'node:crypto'
import { NextRequest, NextResponse, after } from 'next/server'
import { trackAnonymousServer } from '@/lib/amplitude.server'
import {
  checkRateLimit,
  checkRateLimitStrict,
  getSignupByEmailStrict,
  insertNewsletterSignup,
  releaseRateLimit,
  type SignupLookup,
} from '@/lib/db'
import { assertConsentTokenConfigured, signConfirmToken } from '@/lib/consent-token'
import { CONFIRM_SENDS_PER_HOUR, CONSENT_VERSION, LOOKUP_FAILED_ERROR } from '@/lib/copy'
import { ipRateKey } from '@/lib/mail-links'
import { clientIp } from '@/lib/referral'
import { sendConsentConfirmation } from '@/lib/send-email'

// The newsletter signup on altidhjem.dk: one address, one tick, nothing sent.
//
// Stores the address with its consent in `signup` (signup_source 'newsletter').
// No mail, SMS, Resend audience, release mail, upstream API or referral. The one
// exception is an address we already hold that lacks the consent: an anonymous
// form may not write consent onto someone's address, so that person gets the
// existing double opt-in mail instead.
//
// Every outcome that is not a refusal of the input itself gives the same answer.

const SCOPE = 'hjem'
const MAX_EMAIL_LENGTH = 254
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WINDOW_SECONDS = 60 * 60
const ATTEMPTS_PER_IP_PER_HOUR = 5
const ATTEMPTS_PER_ADDRESS_PER_HOUR = 1
const SUBMITS_PER_HOUR = 500
// A confirmation link lives 7 days (lib/consent-token.ts), so one mail per link is
// enough. Stops a stranger mailing someone on file every hour from our domain.
const CONFIRMATION_WINDOW_SECONDS = 7 * 24 * 60 * 60

// Pinned, not req.nextUrl.origin: the confirmation link carries a consent token,
// and its host should not be derived from a request header.
const SITE_ORIGIN = 'https://altidhjem.dk'

function success() {
  return NextResponse.json({ success: true })
}

/** A browser always sends Origin on a POST and a page cannot forge it, so this
 * stops another website from writing consent from its visitors' browsers. JSON,
 * because a cross-site form or no-cors fetch cannot send that type. */
function isSameOriginJson(req: NextRequest): boolean {
  const type = (req.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase()
  if (type !== 'application/json') return false
  const origin = req.headers.get('origin')
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  if (!origin || !host) return false
  return URL.canParse(origin) && new URL(origin).host === host
}

function refuse(status: number, error: string) {
  return NextResponse.json({ success: false, error }, { status })
}

/**
 * A uuid-shaped id derived from the address, so a double submit lands on one row
 * on a table without a unique index on email. Domain separated, so it can never
 * collide with another use of the secret, and it does not reveal the address:
 * public_id is public, it doubles as a referral code.
 */
export function newsletterPublicId(email: string): string {
  const secret = process.env.CONSENT_TOKEN_SECRET
  if (!secret) throw new Error('newsletter: CONSENT_TOKEN_SECRET must be set')
  const hex = createHmac('sha256', secret).update(`newsletter-public-id:${email.toLowerCase()}`).digest('hex')
  // Version 8 ("custom") and the RFC 9562 variant, so it is a real uuid to Postgres
  // (consent_event.public_id is a uuid column).
  const variant = ((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16)
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-8${hex.slice(13, 16)}-${variant}${hex.slice(17, 20)}-${hex.slice(20, 32)}`
}

/** Mail the double opt-in link to an address on file. Runs in after(): no timing
 * difference, and a Resend failure cannot turn into a 500 that reveals the branch. */
async function sendConfirmation(email: string, existing: SignupLookup) {
  const pending = { mad: !existing.consentMad, group: !existing.consentGroup }
  if (!existing.unsubToken) {
    console.error(`newsletter: no unsub token on ${existing.publicId}, confirmation not sent`)
    return
  }
  // All limiters fail closed. The week first, so repeats for one address do not
  // use up the global budget.
  const weekKey = `newsletter-confirm:${email}`
  let sent = false
  try {
    if (await checkRateLimitStrict(weekKey, 1, CONFIRMATION_WINDOW_SECONDS)) {
      console.error(`newsletter: confirmation refused for ${existing.publicId}, already mailed this week`)
      sent = true // That earlier mail stands: nothing to give back.
      return
    }
    if (await checkRateLimitStrict(`consent-confirm:${email}`, 1, WINDOW_SECONDS)) {
      console.error(`newsletter: confirmation refused for ${existing.publicId}, address limit reached`)
      return
    }
    if (await checkRateLimitStrict('consent-confirm:global', CONFIRM_SENDS_PER_HOUR, WINDOW_SECONDS)) {
      console.error(`newsletter: confirmation refused for ${existing.publicId}, global limit reached`)
      return
    }
    const token = signConfirmToken(existing.publicId, pending, Date.now() / 1000)
    // Resend reports a refusal (quota, validation) in the result, it does not throw.
    const { error } = await sendConsentConfirmation({
      name: existing.firstName ?? '',
      email,
      confirmUrl: `${SITE_ORIGIN}/api/bekraeft?t=${encodeURIComponent(token)}`,
      unsubscribeUrl: `${SITE_ORIGIN}/api/unsubscribe?token=${encodeURIComponent(existing.unsubToken)}`,
      pending,
    })
    if (error) throw new Error(`resend refused: ${error.message}`)
    sent = true
  } catch (e) {
    console.error(`newsletter: confirmation not sent for ${existing.publicId}`, e)
  } finally {
    // No mail went out, so the week must not count: the next attempt may send it.
    if (!sent) await releaseRateLimit(weekKey).catch((e) => console.error('newsletter: week limit not released', e))
  }
}

export async function handleNewsletter(req: NextRequest, body: Record<string, unknown>): Promise<NextResponse> {
  if (!isSameOriginJson(req)) return refuse(403, 'Ugyldig anmodning')

  const raw = body.email
  if (typeof raw !== 'string' || raw.length > MAX_EMAIL_LENGTH) return refuse(400, 'Ugyldig e-mail')
  const email = raw.toLowerCase().trim()
  if (!EMAIL_RE.test(email)) return refuse(400, 'Ugyldig e-mail')
  if (body.scope !== SCOPE) return refuse(400, 'Ugyldig anmodning')
  if (body.consent !== true) return refuse(400, 'Samtykke mangler')

  assertConsentTokenConfigured()

  const ipKey = ipRateKey('newsletter', clientIp(req.headers), process.env.REFERRAL_IP_SALT)
  if (await checkRateLimit(ipKey, ATTEMPTS_PER_IP_PER_HOUR, WINDOW_SECONDS)) {
    return refuse(429, 'For mange forsøg. Prøv igen senere.')
  }

  // A person over the limit still gets the lookup: their earlier attempt may have
  // answered 503 and been told to retry. So no row means store it, and only a
  // row on file means there is nothing more to do this hour.
  let overAddressLimit: boolean
  let existing: SignupLookup | null
  try {
    overAddressLimit = await checkRateLimitStrict(
      `newsletter-address:${email}`,
      ATTEMPTS_PER_ADDRESS_PER_HOUR,
      WINDOW_SECONDS,
    )
    // Checked for every address, known or not: refusing only new ones would tell
    // whoever exhausts the ceiling which addresses are on file. Evidence is
    // append-only, so a flood from rotating IPs could never be removed.
    if (await checkRateLimitStrict('newsletter:submits', SUBMITS_PER_HOUR, WINDOW_SECONDS)) {
      console.error('newsletter: ceiling reached, not processed')
      return refuse(503, LOOKUP_FAILED_ERROR)
    }
    existing = await getSignupByEmailStrict(email)
    if (!existing) {
      await insertNewsletterSignup({ publicId: newsletterPublicId(email), email, version: CONSENT_VERSION })
    }
  } catch (e) {
    console.error('newsletter: not stored', e)
    return refuse(503, LOOKUP_FAILED_ERROR)
  }

  if (overAddressLimit && existing) return success()

  const needsConfirmation =
    existing !== null && !existing.unsubscribed && (!existing.consentMad || !existing.consentGroup)

  after(async () => {
    if (needsConfirmation) await sendConfirmation(email, existing as SignupLookup)
    await trackAnonymousServer('Newsletter Signup', { scope: SCOPE }).catch((e) =>
      console.error('newsletter: event not sent', e),
    )
  })

  return success()
}
