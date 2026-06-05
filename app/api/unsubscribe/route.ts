import { NextRequest, NextResponse } from 'next/server'
import { setUnsubscribed } from '@/lib/db'

function confirmationPage(title: string, body: string, status = 200) {
  const html = `<!doctype html>
<html lang="da"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Altid Hjem</title>
</head>
<body style="margin:0;background:#f4f4f4;font-family:'Inter','Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="min-height:100vh;">
    <tr><td align="center" valign="middle" style="padding:40px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background:#ffffff;border-radius:18px;overflow:hidden;">
        <tr><td style="background:#EDE9DE;padding:24px 28px;">
          <img src="https://www.altidhjem.dk/altid-hjem-logo-dark.svg" alt="Altid Hjem" width="120" height="64" style="display:block;border:0;outline:none;"/>
        </td></tr>
        <tr><td style="padding:36px 32px 40px;">
          <p style="font-size:24px;line-height:1.2;font-weight:800;color:#003c16;margin:0 0 12px;">${title}</p>
          <p style="font-size:16px;line-height:1.6;color:#003c16;margin:0;">${body}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
  return new NextResponse(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

// In-body "Afmeld" link (and ?resubscribe=1 to opt back in)
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id') ?? ''
  const resubscribe = req.nextUrl.searchParams.get('resubscribe') === '1'
  if (!id) return confirmationPage('Ugyldigt link', 'Linket mangler oplysninger. Prøv at klikke på linket i mailen igen.', 400)
  try {
    const matched = await setUnsubscribed(id, !resubscribe)
    if (!matched) return confirmationPage('Vi kunne ikke finde dig', 'Linket er måske udløbet. Kontakt os på hej@altidhjem.dk hvis du har brug for hjælp.', 404)
    return resubscribe
      ? confirmationPage('Du er tilmeldt igen 🎉', 'Du modtager nu igen opdateringer om din plads i køen.')
      : confirmationPage('Du er afmeldt', 'Du modtager ikke flere markedsføringsmails fra Altid Hjem. Du kan til enhver tid tilmelde dig igen.')
  } catch (e) {
    console.error('unsubscribe failed', e)
    return confirmationPage('Noget gik galt', 'Prøv igen om lidt, eller skriv til hej@altidhjem.dk.', 500)
  }
}

// One-click unsubscribe (RFC 8058) — mail apps POST here automatically.
export async function POST(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id') ?? ''
  if (id) {
    try {
      await setUnsubscribed(id, true)
    } catch (e) {
      console.error('one-click unsubscribe failed', e)
    }
  }
  return new NextResponse(null, { status: 200 })
}
