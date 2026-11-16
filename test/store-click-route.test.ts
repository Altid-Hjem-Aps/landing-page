import { STORE_POSITIONS } from '@/lib/store-links'
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
  // ALT-1713: the page the tap came from, a guide by its own name.
  it('counts the page a tap came from when it is on the fixed list', async () => {
    expect((await post({ store: 'appstore', position: 'bottom', slug: 'hvad-koster-forsikring' })).status).toBe(204)
    expect(trackMock).toHaveBeenCalledWith('Store Badge Clicked', { store: 'appstore', position: 'bottom', slug: 'hvad-koster-forsikring' })
  })

  it('refuses a page name that is not on the list, so nothing typed reaches Amplitude', async () => {
    for (const slug of ['/hvad-koster-forsikring', 'en-side-vi-ikke-har', 42]) {
      expect((await post({ store: 'appstore', position: 'bottom', slug })).status).toBe(400)
    }
    expect(trackMock).not.toHaveBeenCalled()
  })

  it('counts a badge click once with its store and position', async () => {
    const res = await post({ store: 'play', position: 'hero', email: 'someone@example.com' })
    expect(res.status).toBe(204)
    expect(trackMock).toHaveBeenCalledTimes(1)
    expect(trackMock).toHaveBeenCalledWith('Store Badge Clicked', { store: 'play', position: 'hero' })
    // Rate-limited on the keyed IP hash, never the IP itself.
    expect(rateLimit).toHaveBeenCalledWith(ipKey, 60, 3600)
  })

  it.each(STORE_POSITIONS)('accepts the position %s', async (position) => {
    const res = await post({ store: 'appstore', position })
    expect(res.status).toBeLessThan(300)
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

// Review 16/11: the route's refusals and failure path, which only the valid, 400 and 429 cases
// covered before.
describe('POST /api/forside/store-click refusals', () => {
  const raw = (body: string, headers: Record<string, string>) =>
    POST(new NextRequest('https://www.altidhjem.dk/api/forside/store-click', { method: 'POST', body, headers: { 'x-forwarded-for': IP, ...headers } }))

  it('refuses anything but JSON with 415, so a cross-site form cannot count', async () => {
    const res = await raw(JSON.stringify({ store: 'play', position: 'hero' }), { 'content-type': 'text/plain' })
    expect(res.status).toBe(415)
    expect(trackMock).not.toHaveBeenCalled()
  })

  it.each([
    ['declared too large', { 'content-length': '10000' }],
    ['too large when read', {}],
  ])('refuses a body %s with 413', async (_, headers) => {
    const res = await raw(JSON.stringify({ store: 'play', position: 'hero', pad: 'x'.repeat(600) }), { 'content-type': 'application/json', ...headers })
    expect(res.status).toBe(413)
    expect(trackMock).not.toHaveBeenCalled()
  })

  it('answers 502 and logs when Amplitude refuses, so a lost click shows up', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    trackMock.mockRejectedValueOnce(new Error('amplitude down'))
    const res = await post({ store: 'play', position: 'hero' })
    expect(res.status).toBe(502)
    expect(error).toHaveBeenCalledWith('store click not recorded', 'amplitude down')
  })
})

