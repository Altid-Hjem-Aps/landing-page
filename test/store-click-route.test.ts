import { createHmac } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Amplitude and the Supabase rate limit are the boundaries. A badge click must
// reach Amplitude once with exactly {store, position}; anything the route
// cannot validate, or anything over the limit, must not be counted.
const trackMock = vi.fn(async (event: string, props: Record<string, unknown>) => {
  void event
  void props
})
vi.mock('@/lib/amplitude.server', () => ({
  trackAnonymousServer: (event: string, props: Record<string, unknown>) => trackMock(event, props),
}))

let limitedKey: (key: string) => boolean = () => false
const rateLimit = vi.fn(async (key: string, max: number, windowSeconds: number) => {
  void max
  void windowSeconds
  return limitedKey(key)
})
vi.mock('@/lib/db', () => ({
  checkRateLimitStrict: (key: string, max: number, windowSeconds: number) => rateLimit(key, max, windowSeconds),
}))

const { POST } = await import('@/app/api/forside/store-click/route')

const IP = '203.0.113.9'
const SALT = 'test-only-salt'
const ipKey = `forside-store-click:${createHmac('sha256', SALT).update(IP).digest('hex').slice(0, 32)}`

const post = (body: unknown) =>
  POST(
    new NextRequest('https://www.altidhjem.dk/api/forside/store-click', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json', 'x-forwarded-for': IP },
    }),
  )

beforeEach(() => {
  vi.stubEnv('REFERRAL_IP_SALT', SALT)
  trackMock.mockReset()
  rateLimit.mockClear()
  limitedKey = () => false
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('POST /api/forside/store-click', () => {
  it('counts a badge click once with its store and position', async () => {
    const res = await post({ store: 'play', position: 'hero', email: 'someone@example.com' })
    expect(res.status).toBe(204)
    expect(trackMock).toHaveBeenCalledTimes(1)
    expect(trackMock).toHaveBeenCalledWith('Store Badge Clicked', { store: 'play', position: 'hero' })
    // Rate-limited on the keyed IP hash, never the IP itself.
    expect(rateLimit).toHaveBeenCalledWith(ipKey, 60, 3600)
  })

  // A position missing from the list drops that CTA's clicks without a trace.
  it.each(['nav', 'hero', 'final', 'faq'])('counts a click from the front page position %s', async (position) => {
    const res = await post({ store: 'appstore', position })
    expect(res.status).toBe(204)
    expect(trackMock).toHaveBeenCalledWith('Store Badge Clicked', { store: 'appstore', position })
  })

  it.each([
    ['an unknown store', { store: 'huawei', position: 'hero' }],
    ['an unknown position', { store: 'appstore', position: 'sidebar' }],
    ['a missing position', { store: 'appstore' }],
  ])('rejects %s with 400 and counts nothing', async (_, body) => {
    const res = await post(body)
    expect(res.status).toBe(400)
    expect(trackMock).not.toHaveBeenCalled()
  })

  it.each([
    ['the per-IP limit', (key: string) => key === ipKey],
    ['the global limit', (key: string) => key === 'forside-store-click:global'],
  ])('answers 429 over %s and counts nothing', async (_, limited) => {
    limitedKey = limited
    const res = await post({ store: 'appstore', position: 'bottom' })
    expect(res.status).toBe(429)
    expect(trackMock).not.toHaveBeenCalled()
  })
})
