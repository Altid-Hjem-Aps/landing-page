import { NextRequest } from 'next/server'
import { paymentReturnRedirect } from '@/lib/payment-return'

export const dynamic = 'force-dynamic'

// FBS will not accept api.altidhjem.dk as an "ekstern redirect URL". The API
// therefore sends accept/decline here. We 302 to the app scheme so
// flutter_web_auth_2 can close the payment window. NextResponse.redirect
// rejects non-http(s) destinations — a raw Location header does not.

export function GET(req: NextRequest): Response {
  const { searchParams } = req.nextUrl
  return paymentReturnRedirect(
    searchParams.get('method'),
    searchParams.get('result'),
  )
}

export function HEAD(req: NextRequest): Response {
  return GET(req)
}
