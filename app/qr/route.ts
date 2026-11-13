import { NextRequest, NextResponse } from 'next/server'
import { detectPlatform } from '@/lib/platform'
import { STORE_ANCHOR, storeLink } from '@/lib/store-links'

// www.altidhjem.dk/qr: the one QR code on the front page (public/site/qr/app.svg). An iPhone
// or iPad goes to the App Store, an Android phone to Google Play, both with the site's own
// campaign, and anything else (a computer) to the store buttons at the bottom of the front
// page. Not /app: that short link is ALT-605's shared invite link, counted under its own
// campaign. Nothing is counted here.
//
// The QR code is printed on the page, so this URL must keep working: do not rename it.
// Always 302 and never cached, because the answer depends on the phone.

export const dynamic = 'force-dynamic'

/** Where a computer lands: the final block's store buttons. */
const DESKTOP_TARGET = `/#${STORE_ANCHOR}`

function respond(req: NextRequest): NextResponse {
  // The server has no touch count, so an iPad that reports a Mac user agent counts as a computer.
  const platform = detectPlatform(req.headers.get('user-agent') ?? '', 0)
  const location =
    platform === 'ios' ? storeLink('appstore') : platform === 'android' ? storeLink('play') : new URL(DESKTOP_TARGET, req.nextUrl.origin)
  const res = NextResponse.redirect(location, 302)
  res.headers.set('Cache-Control', 'no-store')
  res.headers.set('Vary', 'User-Agent')
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return res
}

export function GET(req: NextRequest) {
  return respond(req)
}

export function HEAD(req: NextRequest) {
  const res = respond(req)
  return new NextResponse(null, { status: res.status, headers: res.headers })
}
