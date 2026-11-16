import type { NextRequest } from 'next/server'
import { checkRateLimitStrict } from '@/lib/db'

// The pieces the site's anonymous counts share (app/api/forside/count, app/api/forside/store-click,
// app/qr). The older count routes (del/share, the mail links) still carry their own copies.

/** How long a rate-limit check may take before the count is given up, so a hung Supabase call
 * cannot hold the function. */
export const RATE_LIMIT_TIMEOUT_MS = 3000

/** True when `key` has passed `max` counts this hour. Rejects when Supabase fails or does not
 * answer within RATE_LIMIT_TIMEOUT_MS. */
export async function overHourlyLimit(key: string, max: number): Promise<boolean> {
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

/** The body as text, or null once it passes `maxBytes`. Reads the stream itself, so a body
 * without (or with a false) content-length is cut off at the cap instead of being buffered whole. */
export async function readCappedBody(req: NextRequest, maxBytes: number): Promise<string | null> {
  if (!req.body) return ''
  const reader = req.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > maxBytes) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }
  return Buffer.concat(chunks).toString('utf8')
}

/** A browser fetching a page ahead of a tap (Chrome, Safari) says so. */
export function isPrefetch(headers: Headers): boolean {
  const purpose = `${headers.get('sec-purpose') ?? ''} ${headers.get('purpose') ?? ''}`.toLowerCase()
  return purpose.includes('prefetch') || purpose.includes('prerender')
}
