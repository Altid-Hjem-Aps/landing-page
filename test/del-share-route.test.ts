import { createHmac } from 'node:crypto'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// Amplitude and the Supabase rate limit are the boundaries. The route must
// hand Amplitude exactly the page's old event, count nothing it cannot
// validate, and never look at cookies.
const trackMock = vi.fn(async (event: string, props: Record<string, unknown>) => {
  void event
  void props
})
vi.mock('@/lib/amplitude.server', () => ({
  trackAnonymousServer: (event: string, props: Record<string, unknown>) => trackMock(event, props),
}))

let limitedKey: (key: string) => boolean = () => false
let limitError: Error | null = null
let limitHangs = false
const rateLimit = vi.fn(async (key: string, max: number, windowSeconds: number) => {
  void max
  void windowSeconds
  if (limitHangs) return new Promise<boolean>(() => {})
  if (limitError) throw limitError
  return limitedKey(key)
})
vi.mock('@/lib/db', () => ({
  checkRateLimitStrict: (key: string, max: number, windowSeconds: number) => rateLimit(key, max, windowSeconds),
}))

const { POST, GET, HEAD } = await import('@/app/api/del/share/route')

const IP = '203.0.113.7'
const SALT = 'test-only-salt'
const keyOf = (ip: string) => `del-share:${createHmac('sha256', SALT).update(ip).digest('hex').slice(0, 32)}`

function request(body: string, headers: Record<string, string> = {}) {
  return new NextRequest('https://www.altidhjem.dk/api/del/share', {
    method: 'POST',
    body,
    headers: { 'content-type': 'application/json', 'x-forwarded-for': IP, ...headers },
  })
}

const post = (body: unknown, headers?: Record<string, string>) =>
  POST(request(typeof body === 'string' ? body : JSON.stringify(body), headers))

beforeEach(() => {
  vi.stubEnv('REFERRAL_IP_SALT', SALT)
  trackMock.mockReset()
  rateLimit.mockClear()
  limitedKey = () => false
  limitError = null
  limitHangs = false
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('POST /api/del/share', () => {
  it.each(['native', 'copy'])('counts a %s share as the page event and answers 204 no-store', async (method) => {
    const res = await post({ method, via: 'hjem-welcome' })
    expect(res.status).toBe(204)
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(trackMock).toHaveBeenCalledTimes(1)
    expect(trackMock).toHaveBeenCalledWith('Share Page Shared', { method, via: 'hjem-welcome' })
  })

  it.each([
    ['an invalid via', { method: 'copy', via: 'NOT valid' }],
    ['a missing via', { method: 'copy' }],
    ['a non-string via', { method: 'copy', via: 42 }],
  ])('counts %s as del, and only method and via reach Amplitude', async (_, body) => {
    const res = await post({ ...body, email: 'someone@example.com' })
    expect(res.status).toBe(204)
    expect(trackMock).toHaveBeenCalledWith('Share Page Shared', { method: 'copy', via: 'del' })
  })

  it.each([
    ['an unknown method', { method: 'x', via: 'del' }],
    ['no method', { via: 'del' }],
    ['broken JSON', '{"method":'],
    ['a JSON array', '["copy"]'],
    ['JSON null', 'null'],
    ['an empty body', ''],
  ])('answers 400 to %s and counts nothing', async (_, body) => {
    const res = await post(body)
    expect(res.status).toBe(400)
    expect(trackMock).not.toHaveBeenCalled()
    expect(rateLimit).not.toHaveBeenCalled()
    // Refused, but not silently: a page sending the wrong body shows in the logs.
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('del share refused (400)'))
  })

  it('accepts application/json with a charset', async () => {
    const res = await post({ method: 'copy', via: 'del' }, { 'content-type': 'application/json; charset=utf-8' })
    expect(res.status).toBe(204)
  })

  it('answers 415 to a body that is not JSON (a cross-site form post)', async () => {
    const res = await post('method=copy&via=del', { 'content-type': 'application/x-www-form-urlencoded' })
    expect(res.status).toBe(415)
    expect(trackMock).not.toHaveBeenCalled()
  })

  it('takes a body of exactly 512 bytes and answers 413 from 513, counting nothing', async () => {
    const sized = (bytes: number) => {
      const base = JSON.stringify({ method: 'copy', via: 'del', pad: '' })
      return JSON.stringify({ method: 'copy', via: 'del', pad: 'x'.repeat(bytes - base.length) })
    }
    expect(sized(512)).toHaveLength(512)
    expect((await post(sized(512))).status).toBe(204)
    trackMock.mockClear()
    rateLimit.mockClear()
    expect((await post(sized(513))).status).toBe(413)
    expect(trackMock).not.toHaveBeenCalled()
    expect(rateLimit).not.toHaveBeenCalled()
  })

  it('answers 413 when the declared content-length is over the cap, before reading the body', async () => {
    const res = await post({ method: 'copy', via: 'del' }, { 'content-length': '9999' })
    expect(res.status).toBe(413)
    expect(rateLimit).not.toHaveBeenCalled()
  })

  it('rate-limits each caller on its own keyed IP hash, 60 an hour, and answers 429 past it', async () => {
    limitedKey = (key) => key === keyOf(IP)
    const res = await post({ method: 'copy', via: 'del' })
    expect(res.status).toBe(429)
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(trackMock).not.toHaveBeenCalled()
    expect(rateLimit).toHaveBeenCalledWith(keyOf(IP), 60, 3600)

    // Another IP has its own bucket and is still counted.
    expect((await post({ method: 'copy', via: 'del' }, { 'x-forwarded-for': '198.51.100.9' })).status).toBe(204)
    expect(rateLimit).toHaveBeenCalledWith(keyOf('198.51.100.9'), 60, 3600)
  })

  it('caps the whole site at 1000 counted shares an hour, whatever the IP', async () => {
    limitedKey = (key) => key === 'del-share:global'
    const res = await post({ method: 'copy', via: 'del' })
    expect(res.status).toBe(429)
    expect(rateLimit).toHaveBeenCalledWith('del-share:global', 1000, 3600)
    expect(trackMock).not.toHaveBeenCalled()
  })

  it('answers 502 when the rate limit does not answer within 3 seconds', async () => {
    vi.useFakeTimers()
    limitHangs = true
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const pending = post({ method: 'copy', via: 'del' })
    await vi.advanceTimersByTimeAsync(3000)
    expect((await pending).status).toBe(502)
    expect(trackMock).not.toHaveBeenCalled()
  })

  it('answers 502 and counts nothing when the rate limit is unavailable', async () => {
    limitError = new Error('rate limit unavailable: boom')
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await post({ method: 'copy', via: 'del' })
    expect(res.status).toBe(502)
    expect(trackMock).not.toHaveBeenCalled()
  })

  it('answers 502 when Amplitude refuses the event', async () => {
    trackMock.mockRejectedValueOnce(new Error('Amplitude answered 400: bad'))
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await post({ method: 'native', via: 'del' })
    expect(res.status).toBe(502)
  })

  it('refuses to run without REFERRAL_IP_SALT instead of counting unlimited', async () => {
    vi.stubEnv('REFERRAL_IP_SALT', '')
    await expect(post({ method: 'copy', via: 'del' })).rejects.toThrow('REFERRAL_IP_SALT is not set')
    expect(trackMock).not.toHaveBeenCalled()
  })

  it('never reads or sets a cookie', async () => {
    const req = request(JSON.stringify({ method: 'copy', via: 'del' }), { cookie: 'AMP_abc=1; consent=all' })
    const headerGet = vi.spyOn(req.headers, 'get')
    const cookieGet = vi.spyOn(req.cookies, 'get')
    const cookieGetAll = vi.spyOn(req.cookies, 'getAll')
    const cookieHas = vi.spyOn(req.cookies, 'has')
    const res = await POST(req)
    expect(res.status).toBe(204)
    expect(headerGet.mock.calls.map(([name]) => name.toLowerCase())).not.toContain('cookie')
    expect(cookieGet).not.toHaveBeenCalled()
    expect(cookieGetAll).not.toHaveBeenCalled()
    expect(cookieHas).not.toHaveBeenCalled()
    expect(res.headers.get('set-cookie')).toBeNull()
  })
})

describe('GET and HEAD /api/del/share', () => {
  it.each([
    ['GET', GET],
    ['HEAD', HEAD],
  ])('%s answers 405 with Allow: POST and counts nothing', async (_, handler) => {
    const res = handler()
    expect(res.status).toBe(405)
    expect(res.headers.get('allow')).toBe('POST')
    expect(trackMock).not.toHaveBeenCalled()
  })
})
