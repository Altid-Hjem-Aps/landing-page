import { createHash } from 'node:crypto'

// Altid Energi referral link plumbing (ALT-231 / ALT-286).
//
// The app builds https://altidhjem.dk/r/<code>; /r/<code> sends the friend on to
// Altid Energi's own referral signup page, which grants the 3-month reward. The
// only thing we add is the code (so Energi could attribute later) and UTM tags.
// Everything here is pure so the routes stay unit-testable.

/** Same alphabet + length as the app (lib/features/profile/state/referral_link.dart). */
export const REFERRAL_CODE_RE = /^[23456789BCDFGHJKMNPQRSTVWXZ]{8}$/

/** Michael's link, verbatim (18 Aug 2026). Do not change without Altid Energi. */
export const ENERGI_REFERRAL_SIGNUP_URL = 'https://tilmeld.altidenergi.dk/signup/henvisning-app'

export type ReferralEventKind = 'click' | 'share' | 'copy'
export const REFERRAL_EVENT_KINDS: readonly ReferralEventKind[] = ['click', 'share', 'copy']

export function isReferralCode(value: string): boolean {
  return REFERRAL_CODE_RE.test(value)
}

/**
 * What arrives in the URL is not always the bare code: chat apps like to glue
 * trailing punctuation onto pasted links ("…/r/ABCDEFGH." or ")"). Strip that
 * and upper-case before validating, so a friend still gets attributed.
 */
export function normalizeReferralCode(raw: string | null | undefined): string {
  return String(raw ?? '')
    .trim()
    .replace(/[.,;:!?)\]}>'"]+$/u, '')
    .toUpperCase()
}

/**
 * Where the friend ends up. Valid code → Energi page with ref + UTM.
 * Invalid code → same page, UTM only, so a typo never dead-ends anyone.
 */
export function energiRedirectUrl(code: string | null): string {
  const url = new URL(ENERGI_REFERRAL_SIGNUP_URL)
  if (code) url.searchParams.set('ref', code)
  url.searchParams.set('utm_source', 'altidhjem')
  url.searchParams.set('utm_medium', 'referral')
  url.searchParams.set('utm_campaign', 'ah_referral')
  return url.toString()
}

/**
 * Daily-salted, one-way hash of the visitor IP. Good enough to dedupe repeat
 * clicks within a day (the stats view calls it unique_ip_days for that reason),
 * useless for re-identifying anyone across days. Returns null when no IP or no
 * salt is available rather than hashing a guessable value.
 */
export function hashIp(ip: string | null, salt: string | undefined, now: Date = new Date()): string | null {
  if (!ip || !salt) return null
  const day = now.toISOString().slice(0, 10)
  return createHash('sha256').update(`${salt}|${day}|${ip}`).digest('hex')
}

let warnedMissingSalt = false
/**
 * REFERRAL_IP_SALT is what makes ip_hash mean anything. Without it every row
 * gets ip_hash = null and unique_ip_days is silently 0 forever, so shout once
 * per process instead of degrading quietly.
 */
export function referralIpSalt(): string | undefined {
  const salt = process.env.REFERRAL_IP_SALT
  if (!salt && !warnedMissingSalt) {
    warnedMissingSalt = true
    console.error('REFERRAL_IP_SALT is not set: referral ip_hash will be null and unique_ip_days will not count')
  }
  return salt
}

/** First hop of x-forwarded-for, or x-real-ip. Vercel sets both. */
export function clientIp(headers: Headers): string | null {
  const xff = headers.get('x-forwarded-for')
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    if (first) return first
  }
  return headers.get('x-real-ip')
}

/**
 * Link-preview fetchers hit /r/<code> the moment a link is pasted into a chat,
 * long before any human taps it. Those are not clicks. Match on the well-known
 * unfurl/crawler UA tokens; anything else counts as a person.
 */
const BOT_UA_RE =
  /bot|crawler|spider|preview|headless|facebookexternalhit|facebookcatalog|whatsapp|slack|telegram|discord|twitter|linkedin|skype|imessage|snapchat|pinterest|embedly|quora|vkshare|outbrain|w3c_validator|curl\/|wget\/|python-requests|go-http-client|okhttp/i

export function looksLikeBot(userAgent: string | null): boolean {
  if (!userAgent) return true
  return BOT_UA_RE.test(userAgent)
}
