import { createHmac } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

// The site's anonymous counts (pop-ups shown and dismissed, QR cards opened). Amplitude and the
// Supabase rate limit are the boundaries. A count must reach Amplitude once with exactly the
// allowed values; anything else, or anything over a limit, must not be counted at all.
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

const { GET, POST } = await import('@/app/api/forside/count/route')

const IP = '203.0.113.44'
const SALT = 'test-only-salt'
const ipKey = `forside-count:${createHmac('sha256', SALT).update(IP).digest('hex').slice(0, 32)}`

const post = (body: unknown, type = 'application/json') =>
  POST(
    new NextRequest('https://www.altidhjem.dk/api/forside/count', {
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body),
      headers: { 'content-type': type, 'x-forwarded-for': IP },
    }),
  )

beforeEach(() => {
  vi.stubEnv('REFERRAL_IP_SALT', SALT)
  trackMock.mockReset()
  rateLimit.mockClear()
  limitedKey = () => false
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('POST /api/forside/count', () => {
  it('counts each allowed event once with exactly its values', async () => {
    const counts = [
      { event: 'Popup Shown', props: { popup: 'leave', mode: 'computer' } },
      { event: 'Popup Dismissed', props: { popup: 'offer', mode: 'phone' } },
      { event: 'QR Card Opened', props: { code: 'appstore', position: 'hero', slug: 'front' } },
      { event: 'QR Card Opened', props: { code: 'app', position: 'energi', slug: 'hvad-koster-forsikring' } },
      // From a tab opened before the page name came (16 Nov): still counted, without one.
      { event: 'QR Card Opened', props: { code: 'play', position: 'bottom' } },
    ]
    for (const count of counts) {
      expect((await post(count)).status).toBe(204)
    }
    expect(trackMock.mock.calls).toEqual(counts.map(({ event, props }) => [event, props]))
  })

  it('refuses unknown events, unknown values, extra or missing properties, and anything not JSON', async () => {
    const refused: Array<[unknown, string?]> = [
      [{ event: 'Store Badge Clicked', props: { store: 'play', position: 'hero' } }],
      [{ event: 'Popup Shown', props: { popup: 'newsletter', mode: 'computer' } }],
      [{ event: 'Popup Shown', props: { popup: 'leave', mode: 'computer', email: 'someone@example.com' } }],
      [{ event: 'Popup Shown', props: { popup: 'leave' } }],
      [{ event: 'Popup Shown', props: { popup: 'leave', mode: 1 } }],
      [{ event: 'toString', props: {} }],
      [{ event: 'Popup Shown' }],
      [[{ event: 'Popup Shown', props: { popup: 'leave', mode: 'computer' } }]],
      ['not json'],
      [{ event: 'Popup Shown', props: { popup: 'leave', mode: 'computer' } }, 'text/plain'],
    ]
    for (const [body, type] of refused) {
      const res = await post(body, type)
      expect(res.status, JSON.stringify(body)).toBeGreaterThanOrEqual(400)
      expect(res.status).toBeLessThan(500)
    }
    expect(trackMock).not.toHaveBeenCalled()
  })

  it('refuses a body over the cap without counting it', async () => {
    const res = await post({ event: 'Popup Shown', props: { popup: 'leave', mode: 'computer' }, pad: 'x'.repeat(600) })
    expect(res.status).toBe(413)
    expect(trackMock).not.toHaveBeenCalled()
  })

  it('rate-limits on a keyed hash of the IP, then on the whole site', async () => {
    await post({ event: 'Popup Shown', props: { popup: 'leave', mode: 'computer' } })
    expect(rateLimit.mock.calls.map(([key]) => key)).toEqual([ipKey, 'forside-count:global'])
    expect(JSON.stringify(rateLimit.mock.calls)).not.toContain(IP)
    for (const blocked of [ipKey, 'forside-count:global']) {
      trackMock.mockReset()
      limitedKey = (key) => key === blocked
      expect((await post({ event: 'Popup Shown', props: { popup: 'leave', mode: 'computer' } })).status).toBe(429)
      expect(trackMock).not.toHaveBeenCalled()
    }
  })

  it('answers 502 when Amplitude refuses, so the failure is visible', async () => {
    trackMock.mockRejectedValueOnce(new Error('Amplitude answered 400'))
    expect((await post({ event: 'Popup Shown', props: { popup: 'offer', mode: 'phone' } })).status).toBe(502)
    expect(console.error).toHaveBeenCalledWith('site count not recorded', 'Amplitude answered 400')
  })

  it('never counts a GET', () => {
    expect(GET().status).toBe(405)
  })
})

// Page views have limits of their own (a busy day of visits must not use up the pop-up and QR
// counts' limits, nor the other way round).
describe('POST /api/forside/count, page views', () => {
  const visitKey = `forside-visit:${createHmac('sha256', SALT).update(IP).digest('hex').slice(0, 32)}`

  it('counts a page view on its own per-IP and site-wide limits', async () => {
    const res = await post({ event: 'Page Visited', props: { page: 'front', slug: 'front' } })
    expect(res.status).toBe(204)
    expect(trackMock).toHaveBeenCalledWith('Page Visited', { page: 'front', slug: 'front' })
    expect(rateLimit).toHaveBeenCalledWith(visitKey, 120, 3600)
    expect(rateLimit).toHaveBeenCalledWith('forside-visit:global', 5000, 3600)
    expect(rateLimit).not.toHaveBeenCalledWith(ipKey, expect.anything(), expect.anything())
  })

  it('is not stopped by the other counts’ limits, and does not stop them', async () => {
    limitedKey = (key) => key.startsWith('forside-count')
    expect((await post({ event: 'Page Visited', props: { page: 'guide', slug: 'madbudget' } })).status).toBe(204)
    limitedKey = (key) => key.startsWith('forside-visit')
    expect((await post({ event: 'Popup Shown', props: { popup: 'leave', mode: 'computer' } })).status).toBe(204)
  })
})

