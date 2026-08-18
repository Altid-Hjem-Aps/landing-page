import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, recordEnergiReferralEvent } from '@/lib/db'
import {
  clientIp,
  hashIp,
  isReferralCode,
  REFERRAL_EVENT_KINDS,
  referralIpSalt,
  type ReferralEventKind,
} from '@/lib/referral'

// The app reports share/copy taps here (ALT-286). Advisory counts only: no
// auth (native app, no altidhjem.dk session), rate-limited per IP+code so one
// carrier-grade NAT egress cannot starve unrelated customers, and a failure
// here must never affect the user, so the app fires and forgets. Anyone who
// knows a code can inflate its share count; acceptable while nothing is paid
// out or ranked on these numbers. If that changes, this needs app-side auth.

export const dynamic = 'force-dynamic'

const EVENTS_PER_IP_CODE_PER_HOUR = 60

function fail(status: number, error: string) {
  return NextResponse.json({ success: false, error }, { status })
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return fail(400, 'invalid_json')
  }
  if (!body || typeof body !== 'object') return fail(400, 'invalid_body')
  const { code, kind } = body as { code?: unknown; kind?: unknown }
  if (typeof code !== 'string' || !isReferralCode(code)) return fail(400, 'invalid_code')
  if (typeof kind !== 'string' || kind === 'click' || !REFERRAL_EVENT_KINDS.includes(kind as ReferralEventKind)) {
    return fail(400, 'invalid_kind')
  }

  const ip = clientIp(req.headers)
  if (await checkRateLimit(`referral-event:${ip ?? 'unknown'}:${code}`, EVENTS_PER_IP_CODE_PER_HOUR, 3600)) {
    return fail(429, 'rate_limited')
  }

  try {
    await recordEnergiReferralEvent({
      code,
      kind: kind as ReferralEventKind,
      valid: true,
      ipHash: hashIp(ip, referralIpSalt()),
      ua: req.headers.get('user-agent'),
      country: req.headers.get('x-vercel-ip-country'),
    })
  } catch (e) {
    console.error('referral event not recorded', e instanceof Error ? e.message : e)
    return fail(500, 'not_recorded')
  }
  return new NextResponse(null, { status: 204 })
}
