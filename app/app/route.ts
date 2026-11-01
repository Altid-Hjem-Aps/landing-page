import { NextRequest, NextResponse } from 'next/server'
import { isLinkPreviewBot } from '@/lib/referral'

// www.altidhjem.dk/app: the short link people share from /del and from the
// welcome mail (ALT-605). It hands over to the tracked store link
// /m/invite/header, which counts the tap and sends iPhone to the App Store and
// Android to Google Play with the invite campaign (lib/mail-links.ts).
//
// 307, never cached, and nothing from the request is carried over: the target
// is the same for everyone. This URL sits in shared messages; do not remove it,
// and never roll production back to a deployment without it.

export const dynamic = 'force-dynamic'

const INVITE_TARGET = '/m/invite/header'

// Link previews (WhatsApp, iMessage, Slack, ...) would otherwise follow the
// redirect and draw Apple's App Store card for every recipient, Android too.
// They get an Altid Hjem card instead (the same pattern as /r, ALT-288). A
// human never sees this page; if one does, it leads to the front page.
const PREVIEW_TITLE = 'Prøv Altid Hjem'
const PREVIEW_DESCRIPTION = 'Mad, strøm, forsikring og økonomi i ét overblik. Det er gratis at komme i gang.'
const PREVIEW_IMAGE = 'https://www.altidhjem.dk/opengraph-image.png'
const PREVIEW_HTML = `<!doctype html>
<html lang="da">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${PREVIEW_TITLE}</title>
<meta name="description" content="${PREVIEW_DESCRIPTION}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Altid Hjem">
<meta property="og:locale" content="da_DK">
<meta property="og:url" content="https://www.altidhjem.dk/app">
<meta property="og:title" content="${PREVIEW_TITLE}">
<meta property="og:description" content="${PREVIEW_DESCRIPTION}">
<meta property="og:image" content="${PREVIEW_IMAGE}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${PREVIEW_TITLE}">
<meta name="twitter:description" content="${PREVIEW_DESCRIPTION}">
<meta name="twitter:image" content="${PREVIEW_IMAGE}">
<meta http-equiv="refresh" content="0; url=https://www.altidhjem.dk/">
</head>
<body>
<p><a href="https://www.altidhjem.dk/">${PREVIEW_TITLE}</a></p>
</body>
</html>
`

// no-store + Vary: the answer depends on the user agent, so no cache may hand
// the preview page to the person who taps next.
const HEADERS = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow', Vary: 'User-Agent' }

function respond(req: NextRequest): NextResponse {
  if (isLinkPreviewBot(req.headers.get('user-agent'))) {
    return new NextResponse(PREVIEW_HTML, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', ...HEADERS } })
  }
  const res = NextResponse.redirect(new URL(INVITE_TARGET, req.nextUrl.origin), 307)
  for (const [k, v] of Object.entries(HEADERS)) res.headers.set(k, v)
  return res
}

export function GET(req: NextRequest) {
  return respond(req)
}

export function HEAD(req: NextRequest) {
  const res = respond(req)
  return new NextResponse(null, { status: res.status, headers: res.headers })
}
