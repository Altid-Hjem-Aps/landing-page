import { NextRequest, NextResponse } from 'next/server'
import { trackAnonymousServer } from '@/lib/amplitude.server'
import { overHourlyLimit, readCappedBody } from '@/lib/anonymous-count.server'
import { ipRateKey } from '@/lib/mail-links'
import { clientIp } from '@/lib/referral'
import { parseSiteCount } from '@/lib/site-counts'

// An anonymous count from the site's pages: POST {event, props}, sent by lib/count.ts with
// sendBeacon. Only the events and values in lib/site-counts.ts are accepted. The event goes out
// as a store click does (app/api/forside/store-click): a fresh device id per event, no cookie
// read or set, and the person's IP never reaches Amplitude. Same limits as the store clicks.

export const dynamic = 'force-dynamic'

/** Counted events per IP and hour. A visitor sees each pop-up once per visit. */
const COUNTS_PER_IP_PER_HOUR = 60

/** Counted events per hour for the whole site, so rotating IPs cannot inflate the counts. */
const COUNTS_PER_HOUR_GLOBAL = 1000

/** Page views (Page Visited) have limits of their own, so a busy day of visits can never use up
 * the limits the pop-up and QR counts share, and the other way round. A visitor reads a few pages
 * an hour; the site-wide ceiling is far above today's traffic and still caps an inflated count. */
const VISITS_PER_IP_PER_HOUR = 120
const VISITS_PER_HOUR_GLOBAL = 5000

/** {"event":"QR Card Opened","props":{"code":"appstore","position":"how-it-works","slug":"hvornar-er-strommen-billigst"}} is about 125 bytes. */
const MAX_BODY_BYTES = 512

function answer(status: number, extra: Record<string, string> = {}): NextResponse {
  return new NextResponse(null, { status, headers: { 'Cache-Control': 'no-store', ...extra } })
}

/** A refused request is logged, so a page sending what the route does not accept shows up. */
function refuse(status: number, reason: string): NextResponse {
  console.warn(`site count refused (${status}): ${reason}`)
  return answer(status)
}

export async function POST(req: NextRequest) {
  // JSON only: a cross-site form cannot send it without a CORS preflight, which this route
  // does not grant.
  const type = (req.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase()
  if (type !== 'application/json') return refuse(415, `content-type ${type || 'missing'}`)

  if (Number(req.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) return refuse(413, 'declared body too large')
  const text = await readCappedBody(req, MAX_BODY_BYTES)
  if (text === null) return refuse(413, 'body too large')

  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    return refuse(400, 'not JSON')
  }
  const count = parseSiteCount(body)
  if (!count) return refuse(400, 'not one of the counts in lib/site-counts.ts')

  // Throws without REFERRAL_IP_SALT: a 500, not a count without a limit.
  const visit = count.event === 'Page Visited'
  const family = visit ? 'forside-visit' : 'forside-count'
  const rateKey = ipRateKey(family, clientIp(req.headers), process.env.REFERRAL_IP_SALT)
  try {
    if (await overHourlyLimit(rateKey, visit ? VISITS_PER_IP_PER_HOUR : COUNTS_PER_IP_PER_HOUR)) return refuse(429, 'over the per-IP limit')
    if (await overHourlyLimit(`${family}:global`, visit ? VISITS_PER_HOUR_GLOBAL : COUNTS_PER_HOUR_GLOBAL)) return refuse(429, 'over the global limit')
    await trackAnonymousServer(count.event, count.props)
  } catch (e) {
    // Supabase or Amplitude failed or timed out: the event is not counted.
    console.error('site count not recorded', e instanceof Error ? e.message : e)
    return answer(502)
  }
  return answer(204)
}

// Only POST counts, so a link scanner or a prefetch can never be counted.
export function GET() {
  return answer(405, { Allow: 'POST' })
}

export function HEAD() {
  return answer(405, { Allow: 'POST' })
}
