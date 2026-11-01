import { NextRequest, NextResponse } from 'next/server'

// www.altidhjem.dk/app: the short link people share from /del and from the
// welcome mail (ALT-605). It hands over to the tracked store link
// /m/invite/header, which counts the tap and sends iPhone to the App Store and
// Android to Google Play with the invite campaign (lib/mail-links.ts).
//
// 307, never cached, and nothing from the request is carried over: the target
// is the same for everyone. This URL sits in shared messages; do not remove it.

export const dynamic = 'force-dynamic'

const INVITE_TARGET = '/m/invite/header'

function redirect(req: NextRequest): NextResponse {
  const res = NextResponse.redirect(new URL(INVITE_TARGET, req.nextUrl.origin), 307)
  res.headers.set('Cache-Control', 'no-store')
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return res
}

export function GET(req: NextRequest) {
  return redirect(req)
}

export function HEAD(req: NextRequest) {
  const res = redirect(req)
  return new NextResponse(null, { status: res.status, headers: res.headers })
}
