import { after, NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, recordEnergiReferralEvent } from '@/lib/db'
import {
  clientIp,
  energiRedirectUrl,
  hashIp,
  isReferralCode,
  looksLikeBot,
  normalizeReferralCode,
  referralIpSalt,
} from '@/lib/referral'

// Personal referral link from the Altid Hjem app (ALT-231 / ALT-286):
// https://altidhjem.dk/r/<code> → Altid Energi's referral signup page.
//
// The redirect is the product; the count is a side effect. So: always 302
// (never 301, so browsers do not cache away our counter), the response is built
// BEFORE any database work and the insert runs in after(), so a slow or dead
// Supabase can never keep the friend from reaching Energi.

export const dynamic = 'force-dynamic'

/** Inserts per IP per hour before we stop counting (we still redirect). */
const CLICK_LOG_LIMIT_PER_HOUR = 60

function redirectFor(code: string | null): NextResponse {
  const res = NextResponse.redirect(energiRedirectUrl(code), 302)
  res.headers.set('Cache-Control', 'no-store')
  return res
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  const { code: raw } = await ctx.params
  const code = normalizeReferralCode(raw)
  const valid = isReferralCode(code)

  const ip = clientIp(req.headers)
  const ua = req.headers.get('user-agent')
  const country = req.headers.get('x-vercel-ip-country')

  // Link unfurlers and crawlers get the redirect but no row: they are not people.
  if (!looksLikeBot(ua)) {
    after(async () => {
      try {
        if (await checkRateLimit(`referral-click:${ip ?? 'unknown'}`, CLICK_LOG_LIMIT_PER_HOUR, 3600)) return
        await recordEnergiReferralEvent({
          code: valid ? code : code.slice(0, 32),
          kind: 'click',
          valid,
          ipHash: hashIp(ip, referralIpSalt()),
          ua,
          country,
        })
      } catch (e) {
        console.error('referral click not recorded', e instanceof Error ? e.message : e)
      }
    })
  }

  return redirectFor(valid ? code : null)
}

// Next serves HEAD via GET when no HEAD handler exists; health checks and link
// scanners would then be counted as clicks. Redirect, never log.
export async function HEAD(_req: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  const { code: raw } = await ctx.params
  const code = normalizeReferralCode(raw)
  return redirectFor(isReferralCode(code) ? code : null)
}
