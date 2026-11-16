import { after, NextRequest, NextResponse } from 'next/server'
import { trackAnonymousServer } from '@/lib/amplitude.server'
import { isPrefetch, overHourlyLimit } from '@/lib/anonymous-count.server'
import { ipRateKey } from '@/lib/mail-links'
import { detectPlatform, type Platform } from '@/lib/platform'
import { clientIp, looksLikeBot } from '@/lib/referral'
import { QR_SOURCES, STORE_ANCHOR, storeLink, type QrSource } from '@/lib/store-links'

// www.altidhjem.dk/qr: the site's one QR code (public/site/qr/app*.svg). An iPhone or iPad goes
// to the App Store, an Android phone to Google Play, both with the site's own campaign, and
// anything else (a computer) to the store buttons at the bottom of the front page. Not /app:
// that short link is ALT-605's shared invite link, counted under its own campaign.
//
// Each place on the site that shows the code has its own image with ?src=<place> (QR_SOURCES),
// so each scan is counted as "QR Code Scanned" {src, platform}, the way the mail links count
// their taps (app/m/[mail]/[link]/route.ts): anonymous, a fresh device id per event, the IP
// never reaches Amplitude. The redirect is the product and the count a side effect: the 302 is
// built first and the event sent in after(), so a slow or failing Amplitude never keeps anyone
// from the store. A code without a known src (the first app.svg) counts as "none".
//
// The QR code is printed on the page, so this URL must keep working: do not rename it.
// Always 302 and never cached, because the answer depends on the phone.

export const dynamic = 'force-dynamic'

const QR_SCAN_EVENT = 'QR Code Scanned'

/** Counted scans per IP and hour. Past it the person still gets the redirect; the scan is just
 * not counted. The rate-limit table only sees a keyed hash of the IP (ipRateKey). */
const SCANS_PER_IP_PER_HOUR = 60

/** Counted scans per hour for the whole site, so rotating IPs cannot inflate the count. */
const SCANS_PER_HOUR_GLOBAL = 1000

/** Where a computer lands: the final block's store buttons. */
const DESKTOP_TARGET = `/#${STORE_ANCHOR}`

function sourceOf(req: NextRequest): QrSource | 'none' {
  const src = req.nextUrl.searchParams.get('src')
  return QR_SOURCES.includes(src as QrSource) ? (src as QrSource) : 'none'
}

function respond(req: NextRequest): { res: NextResponse; platform: Platform } {
  // The server has no touch count, so an iPad that reports a Mac user agent counts as a computer.
  const platform = detectPlatform(req.headers.get('user-agent') ?? '', 0)
  const location =
    platform === 'ios' ? storeLink('appstore') : platform === 'android' ? storeLink('play') : new URL(DESKTOP_TARGET, req.nextUrl.origin)
  const res = NextResponse.redirect(location, 302)
  res.headers.set('Cache-Control', 'no-store')
  res.headers.set('Vary', 'User-Agent')
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return { res, platform }
}

export function GET(req: NextRequest) {
  const { res, platform } = respond(req)

  // Crawlers, link unfurlers, scripts (curl included) and prefetches are not people scanning.
  if (!looksLikeBot(req.headers.get('user-agent')) && !isPrefetch(req.headers)) {
    const src = sourceOf(req)
    const ip = clientIp(req.headers)
    after(async () => {
      try {
        // Throws without REFERRAL_IP_SALT: logged below, never counted without a limit.
        if (await overHourlyLimit(ipRateKey('qr-scan', ip, process.env.REFERRAL_IP_SALT), SCANS_PER_IP_PER_HOUR)) {
          console.warn('QR scan not counted: over the per-IP limit')
          return
        }
        if (await overHourlyLimit('qr-scan:global', SCANS_PER_HOUR_GLOBAL)) {
          console.warn('QR scan not counted: over the global limit')
          return
        }
        await trackAnonymousServer(QR_SCAN_EVENT, { src, platform })
      } catch (e) {
        console.error('QR scan not recorded', e instanceof Error ? e.message : e)
      }
    })
  }

  return res
}

// Without a HEAD handler Next answers HEAD through GET, and health checks or link scanners
// would be counted. Redirect, never count.
export function HEAD(req: NextRequest) {
  const { res } = respond(req)
  return new NextResponse(null, { status: res.status, headers: res.headers })
}
