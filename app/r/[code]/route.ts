import { after, NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, recordEnergiReferralEvent } from '@/lib/db'
import {
  clientIp,
  energiRedirectUrl,
  hashIp,
  isLinkPreviewBot,
  isReferralCode,
  looksLikeBot,
  normalizeReferralCode,
  referralIpSalt,
  referralPreviewHtml,
} from '@/lib/referral'

// Personal referral link from the Altid Hjem app (ALT-231 / ALT-286):
// https://altidhjem.dk/r/<code> → Altid Energi's referral signup page.
//
// The redirect is the product; the count is a side effect. So: always 302
// (never 301, so browsers do not cache away our counter), the response is built
// BEFORE any database work and the insert runs in after(), so a slow or dead
// Supabase can never keep the friend from reaching Energi.
//
// One exception (ALT-288): link-preview crawlers get 200 + OG tags instead, so
// the receiver sees the 3-month offer as a card in Beskeder or WhatsApp. Energi's
// signup page carries no OG tags of its own, so following the redirect gives a
// naked link. Crawlers still never reach the counter.

export const dynamic = 'force-dynamic'

/** Inserts per IP per hour before we stop counting (we still redirect). */
const CLICK_LOG_LIMIT_PER_HOUR = 60

function redirectFor(code: string | null): NextResponse {
  const res = NextResponse.redirect(energiRedirectUrl(code), 302)
  res.headers.set('Cache-Control', 'no-store')
  res.headers.set('Vary', 'User-Agent')
  return res
}

// no-store + Vary on purpose: the response depends on the user agent, and a
// shared cache keyed on the URL alone would otherwise hand this HTML to the
// human who taps the link next.
function previewFor(code: string | null): NextResponse {
  return new NextResponse(referralPreviewHtml(code), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      // Belt and braces with the meta robots tag: a crawler that reads headers
      // but not the document still learns not to index a personal referral URL.
      'X-Robots-Tag': 'noindex, nofollow',
      Vary: 'User-Agent',
    },
  })
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  const { code: raw } = await ctx.params
  const code = normalizeReferralCode(raw)
  const valid = isReferralCode(code)

  const ip = clientIp(req.headers)
  const ua = req.headers.get('user-agent')
  const country = req.headers.get('x-vercel-ip-country')

  // Link unfurlers and crawlers are not people: no row either way, and the ones
  // that draw a card get the card.
  if (isLinkPreviewBot(ua)) return previewFor(valid ? code : null)

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
// scanners would then be counted as clicks. Redirect, never log. An unfurler that
// probes with HEAD first must see the same status and content type it will get on
// the GET, or it can decide there is no card to fetch.
export async function HEAD(req: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  const { code: raw } = await ctx.params
  const code = normalizeReferralCode(raw)
  const valid = isReferralCode(code)
  if (isLinkPreviewBot(req.headers.get('user-agent'))) {
    const res = previewFor(valid ? code : null)
    return new NextResponse(null, { status: res.status, headers: res.headers })
  }
  return redirectFor(valid ? code : null)
}
