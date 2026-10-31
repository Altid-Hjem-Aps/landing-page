import { after, NextRequest, NextResponse } from 'next/server'
import { trackAnonymousServer } from '@/lib/amplitude.server'
import { MAIL_LINK_EVENT, mailLinkRateKey, resolveMailLink, type MailLink } from '@/lib/mail-links'
import { checkRateLimitStrict } from '@/lib/db'
import { clientIp, looksLikeBot } from '@/lib/referral'

// Store links in the launch mails (ALT-605):
// https://www.altidhjem.dk/m/<mail>/<link> → App Store or Google Play, with
// the store's campaign data for that mail.
//
// The redirect is the product; the count is a side effect (the same rule as
// /r/<code>). The 302 is built before anything else and the Amplitude event is
// sent in after(), so a slow or failing Amplitude never keeps anyone from the
// store. Always 302, never 301: a cached redirect would skip the count.
//
// These URLs sit in sent mails for years. Do not remove or rename the route.

export const dynamic = 'force-dynamic'

/** Counted taps per IP and hour. Past it the person still gets the redirect;
 * the tap is just not counted. Generous, because a whole office or a mobile
 * network can share one IP. The rate-limit table only ever sees a keyed hash
 * of the IP (mailLinkRateKey), never the IP, and Amplitude sees neither. */
const MAIL_LINK_TAPS_PER_IP_PER_HOUR = 120

/** How long the rate-limit check may take before the tap is given up
 * uncounted, so a hung Supabase call cannot hold after() to maxDuration. */
const RATE_LIMIT_TIMEOUT_MS = 3000

async function overLimit(key: string): Promise<boolean> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      checkRateLimitStrict(key, MAIL_LINK_TAPS_PER_IP_PER_HOUR, 3600),
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`rate limit check did not answer within ${RATE_LIMIT_TIMEOUT_MS} ms`)),
          RATE_LIMIT_TIMEOUT_MS,
        )
      }),
    ])
  } finally {
    clearTimeout(timer)
  }
}

/** A browser fetching the page ahead of a tap (Chrome, Safari) says so. */
function isPrefetch(headers: Headers): boolean {
  const purpose = `${headers.get('sec-purpose') ?? ''} ${headers.get('purpose') ?? ''}`.toLowerCase()
  return purpose.includes('prefetch') || purpose.includes('prerender')
}

function redirectFor(target: MailLink): NextResponse {
  const res = NextResponse.redirect(target.location, 302)
  res.headers.set('Cache-Control', 'no-store')
  // The header image and unknown codes go to the store of the phone.
  res.headers.set('Vary', 'User-Agent')
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  // Read by the send script's preflight: a misspelt code still reaches a
  // store, so the status alone cannot tell it from a good one.
  res.headers.set('X-Altid-Mail-Link', target.valid ? 'valid' : 'invalid')
  return res
}

async function resolve(req: NextRequest, ctx: { params: Promise<{ mail: string; link: string }> }) {
  const { mail, link } = await ctx.params
  return resolveMailLink(mail, link, req.headers.get('user-agent'))
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ mail: string; link: string }> }) {
  const target = await resolve(req, ctx)

  // Crawlers, link unfurlers, scripts (curl included) and prefetches are not
  // people tapping.
  if (!looksLikeBot(req.headers.get('user-agent')) && !isPrefetch(req.headers)) {
    const ip = clientIp(req.headers)
    after(async () => {
      try {
        if (await overLimit(mailLinkRateKey(ip, process.env.REFERRAL_IP_SALT))) {
          console.warn('mail link tap not counted: over the per-IP limit')
          return
        }
        await trackAnonymousServer(MAIL_LINK_EVENT, {
          campaign: 'alt605',
          mail: target.mail,
          link: target.link,
          mail_link: `${target.mail}/${target.link}`,
          store: target.store,
          valid: target.valid,
          env: process.env.VERCEL_ENV ?? 'development',
        })
      } catch (e) {
        console.error('mail link click not recorded', e instanceof Error ? e.message : e)
      }
    })
  }

  return redirectFor(target)
}

// Without a HEAD handler Next answers HEAD through GET, and health checks or
// link scanners would be counted. Redirect, never count.
export async function HEAD(req: NextRequest, ctx: { params: Promise<{ mail: string; link: string }> }) {
  const res = redirectFor(await resolve(req, ctx))
  return new NextResponse(null, { status: res.status, headers: res.headers })
}
