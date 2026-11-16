import { NextRequest, NextResponse } from 'next/server'
import { trackAnonymousServer } from '@/lib/amplitude.server'
import { overHourlyLimit, readCappedBody } from '@/lib/anonymous-count.server'
import { ipRateKey } from '@/lib/mail-links'
import { clientIp } from '@/lib/referral'
import { STORES, STORE_POSITIONS, type Store, type StorePosition } from '@/lib/store-links'

// A store badge click on the front page, counted from our server:
// POST {store, position}, sent by components/StoreBadges.tsx with sendBeacon.
//
// The browser SDK only starts after the visitor accepts cookies, and the click
// leaves the page, so a click from anyone who did not accept was never seen.
// Here the event goes out like a /del share (app/api/del/share/route.ts):
// anonymous, a fresh device id per event, no cookie read or set, and the
// person's IP never reaches Amplitude. Same limits as the share route.

export const dynamic = 'force-dynamic'

const CLICK_EVENT = 'Store Badge Clicked'

/** Counted clicks per IP and hour. Past it the click is answered 429 and not
 * counted. The rate-limit table only sees a keyed hash of the IP. */
const CLICKS_PER_IP_PER_HOUR = 60

/** Counted clicks per hour for the whole site, so rotating IPs cannot inflate
 * the count or Amplitude's volume without a ceiling. */
const CLICKS_PER_HOUR_GLOBAL = 1000

/** {"store":"appstore","position":"bottom"} is about 40 bytes. */
const MAX_BODY_BYTES = 512

function answer(status: number, extra: Record<string, string> = {}): NextResponse {
  return new NextResponse(null, { status, headers: { 'Cache-Control': 'no-store', ...extra } })
}

/** A refused request is logged, so a page that sends what the route no longer
 * accepts shows up in the logs instead of dropping clicks without a trace. */
function refuse(status: number, reason: string): NextResponse {
  console.warn(`store click refused (${status}): ${reason}`)
  return answer(status)
}

function parseClick(text: string): { store: Store; position: StorePosition } | null {
  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    return null
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return null
  const { store, position } = body as Record<string, unknown>
  if (!STORES.includes(store as Store)) return null
  if (!STORE_POSITIONS.includes(position as StorePosition)) return null
  return { store: store as Store, position: position as StorePosition }
}

export async function POST(req: NextRequest) {
  // JSON only: a cross-site form cannot send it without a CORS preflight,
  // which this route does not grant. sendBeacon with a JSON Blob sends this
  // type from our own origin.
  const type = (req.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase()
  if (type !== 'application/json') return refuse(415, `content-type ${type || 'missing'}`)

  if (Number(req.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) return refuse(413, 'declared body too large')
  const text = await readCappedBody(req, MAX_BODY_BYTES)
  if (text === null) return refuse(413, 'body too large')

  const click = parseClick(text)
  if (!click) return refuse(400, 'not {store: appstore|play, position: one of STORE_POSITIONS}')

  // Throws without REFERRAL_IP_SALT: a 500, not a click counted unlimited.
  const rateKey = ipRateKey('forside-store-click', clientIp(req.headers), process.env.REFERRAL_IP_SALT)
  try {
    if (await overHourlyLimit(rateKey, CLICKS_PER_IP_PER_HOUR)) return refuse(429, 'over the per-IP limit')
    if (await overHourlyLimit('forside-store-click:global', CLICKS_PER_HOUR_GLOBAL)) return refuse(429, 'over the global limit')
    await trackAnonymousServer(CLICK_EVENT, click)
  } catch (e) {
    // Supabase or Amplitude failed or timed out: the click is not counted.
    console.error('store click not recorded', e instanceof Error ? e.message : e)
    return answer(502)
  }
  return answer(204)
}

// Only POST counts. Explicit, so a GET or HEAD (a link scanner, a prefetch)
// can never be routed into a count.
export function GET() {
  return answer(405, { Allow: 'POST' })
}

export function HEAD() {
  return answer(405, { Allow: 'POST' })
}
