import { NextRequest, NextResponse } from 'next/server'
import { trackAnonymousServer } from '@/lib/amplitude.server'
import { checkRateLimitStrict } from '@/lib/db'
import { ipRateKey } from '@/lib/mail-links'
import { clientIp } from '@/lib/referral'
import { sanitizeVia } from '@/lib/share-page'

// A share from /del (ALT-605), counted from our server: POST {method, via}.
//
// The page used to send "Share Page Shared" with the browser SDK, which only
// starts after the visitor accepts cookies (lib/analytics.ts). A share from
// anyone who did not accept sat in the SDK's queue and never left the browser,
// so Amplitude never saw one. Here the event goes out like a mail-link tap
// (app/m/[mail]/[link]/route.ts): anonymous, a fresh device id per event, no
// cookie read or set, and the person's IP never reaches Amplitude.
//
// Event name and properties are the page's old ones, so the admin's reader
// keeps working. The page fires this and forgets it: the share never waits.

export const dynamic = 'force-dynamic'

const SHARE_EVENT = 'Share Page Shared'
const METHODS = ['native', 'copy'] as const
type Method = (typeof METHODS)[number]

/** Counted shares per IP and hour. Past it the share is answered 429 and not
 * counted. Generous, because a whole office or a mobile network can share one
 * IP, but a person shares a few times at most. The rate-limit table only sees
 * a keyed hash of the IP (ipRateKey), never the IP. */
const SHARES_PER_IP_PER_HOUR = 60

/** Counted shares per hour for the whole site, so rotating IPs (a botnet, an
 * IPv6 /64) cannot inflate the count or Amplitude's volume without a ceiling.
 * Far above what a launch can bring; past it every share gets 429. */
const SHARES_PER_HOUR_GLOBAL = 1000

/** {"method":"native","via":"<32 chars>"} is about 50 bytes. */
const MAX_BODY_BYTES = 512

/** How long the rate-limit check may take before the share is given up
 * uncounted, so a hung Supabase call cannot hold the function. */
const RATE_LIMIT_TIMEOUT_MS = 3000

async function overLimit(key: string, max: number): Promise<boolean> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      checkRateLimitStrict(key, max, 3600),
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`rate limit check did not answer within ${RATE_LIMIT_TIMEOUT_MS} ms`)),
          RATE_LIMIT_TIMEOUT_MS,
        )
      }),
    ])
  } finally {
    clearTimeout(timer)
  }
}

function answer(status: number, extra: Record<string, string> = {}): NextResponse {
  return new NextResponse(null, { status, headers: { 'Cache-Control': 'no-store', ...extra } })
}

/** A refused request is logged, so a page that sends what the route no longer
 * accepts shows up in the logs instead of dropping shares without a trace. */
function refuse(status: number, reason: string): NextResponse {
  console.warn(`del share refused (${status}): ${reason}`)
  return answer(status)
}

/** The body as text, or null once it passes MAX_BODY_BYTES. Reads the stream
 * itself, so a body without (or with a false) content-length is cut off at the
 * cap instead of being buffered whole. */
async function readCapped(req: NextRequest): Promise<string | null> {
  if (!req.body) return ''
  const reader = req.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > MAX_BODY_BYTES) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }
  return Buffer.concat(chunks).toString('utf8')
}

function parseShare(text: string): { method: Method; via: string } | null {
  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    return null
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return null
  const { method, via } = body as Record<string, unknown>
  if (!METHODS.includes(method as Method)) return null
  return { method: method as Method, via: sanitizeVia(via) }
}

export async function POST(req: NextRequest) {
  // JSON only: a cross-site form cannot send it without a CORS preflight,
  // which this route does not grant.
  const type = (req.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase()
  if (type !== 'application/json') return refuse(415, `content-type ${type || 'missing'}`)

  if (Number(req.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) return refuse(413, 'declared body too large')
  const text = await readCapped(req)
  if (text === null) return refuse(413, 'body too large')

  const share = parseShare(text)
  if (!share) return refuse(400, 'not {method: native|copy}')

  // Throws without REFERRAL_IP_SALT: a 500, not a share counted unlimited.
  const rateKey = ipRateKey('del-share', clientIp(req.headers), process.env.REFERRAL_IP_SALT)
  try {
    if (await overLimit(rateKey, SHARES_PER_IP_PER_HOUR)) return refuse(429, 'over the per-IP limit')
    if (await overLimit('del-share:global', SHARES_PER_HOUR_GLOBAL)) return refuse(429, 'over the global limit')
    await trackAnonymousServer(SHARE_EVENT, share)
  } catch (e) {
    // Supabase or Amplitude failed or timed out: the share is not counted.
    console.error('del share not recorded', e instanceof Error ? e.message : e)
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
