import { createHmac } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { QR_SOURCES } from '@/lib/store-links'

// www.altidhjem.dk/qr is the site's one QR code. Risk: a phone lands in the wrong store, a
// computer is sent to a store it cannot install from, the redirect is cached so the next phone
// gets the previous phone's store, or the scan count per place is wrong: a bot or a HEAD
// counted, a place lost, anything about the person sent, or a failing count keeping someone
// from the store.

// Amplitude and the Supabase rate limit are the boundaries.
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

// next/server's after() needs a request context we do not have in unit tests.
let afterTasks: Array<Promise<unknown>> = []
vi.mock('next/server', async () => {
  const actual = await vi.importActual<typeof import('next/server')>('next/server')
  return {
    ...actual,
    after: (task: () => Promise<unknown> | unknown) => {
      afterTasks.push(Promise.resolve().then(task))
    },
  }
})
const settled = () => Promise.all(afterTasks)

const { GET, HEAD } = await import('@/app/qr/route')

const IP = '203.0.113.21'
const SALT = 'test-only-salt'
const ipKey = `qr-scan:${createHmac('sha256', SALT).update(IP).digest('hex').slice(0, 32)}`

beforeEach(() => {
  vi.stubEnv('REFERRAL_IP_SALT', SALT)
  trackMock.mockReset()
  rateLimit.mockClear()
  limitedKey = () => false
  afterTasks = []
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

// Literal on purpose, not built from lib/store-links.
const APP_STORE = 'https://apps.apple.com/dk/app/altid-hjem/id6794330094?pt=129212732&ct=ah_1_altidhjem_dk&mt=8'
const PLAY =
  'https://play.google.com/store/apps/details?id=dk.altidhjem.app&referrer=utm_source%3Daltidhjem_dk%26utm_campaign%3Dah_1_altidhjem_dk'

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
const ANDROID = 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36'
const DESKTOP = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
const IPAD = 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
// iPadOS Safari asks for the desktop site by default and then sends a Mac user agent.
const IPAD_DESKTOP_MODE = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15'

const get = (userAgent?: string) =>
  GET(new NextRequest('https://www.altidhjem.dk/qr', { headers: userAgent ? { 'user-agent': userAgent } : {} }))

describe('/qr', () => {
  it('sends an iPhone to the App Store with the site campaign', () => {
    const res = get(IPHONE)
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe(APP_STORE)
  })

  it('sends an Android phone to Google Play with the site campaign', () => {
    const res = get(ANDROID)
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe(PLAY)
  })

  it('sends a computer, or a request with no user agent, to the store buttons on the front page', () => {
    for (const userAgent of [DESKTOP, undefined]) {
      const res = get(userAgent)
      expect(res.status).toBe(302)
      expect(res.headers.get('location')).toBe('https://www.altidhjem.dk/#hent-appen')
    }
  })

  it('sends an iPad that says it is an iPad to the App Store', () => {
    const res = get(IPAD)
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe(APP_STORE)
  })

  it('sends an iPad in desktop mode to the store buttons, as a computer: the server sees no touch screen', () => {
    const res = get(IPAD_DESKTOP_MODE)
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe('https://www.altidhjem.dk/#hent-appen')
  })

  it('keeps the redirect out of search engines', () => {
    for (const userAgent of [IPHONE, ANDROID, DESKTOP, undefined]) {
      expect(get(userAgent).headers.get('x-robots-tag')).toBe('noindex, nofollow')
    }
    const head = HEAD(new NextRequest('https://www.altidhjem.dk/qr', { method: 'HEAD', headers: { 'user-agent': IPHONE } }))
    expect(head.headers.get('x-robots-tag')).toBe('noindex, nofollow')
  })

  it('is never cached, and says the answer depends on the user agent', () => {
    for (const userAgent of [IPHONE, ANDROID, DESKTOP]) {
      const res = get(userAgent)
      expect(res.headers.get('cache-control')).toBe('no-store')
      expect(res.headers.get('vary')).toBe('User-Agent')
    }
  })

  it('answers HEAD with the same redirect and no body', () => {
    const res = HEAD(new NextRequest('https://www.altidhjem.dk/qr', { method: 'HEAD', headers: { 'user-agent': ANDROID } }))
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe(PLAY)
    expect(res.body).toBeNull()
  })
})

const scan = (path: string, userAgent: string | null, extra: Record<string, string> = {}) =>
  GET(
    new NextRequest(`https://www.altidhjem.dk${path}`, {
      headers: { 'x-forwarded-for': IP, ...(userAgent ? { 'user-agent': userAgent } : {}), ...extra },
    }),
  )

describe('/qr counts each scan by place', () => {
  it('counts a scan once with its place and the phone type, and nothing else', async () => {
    const res = scan('/qr?src=leave', IPHONE)
    expect(res.headers.get('location')).toBe(APP_STORE)
    await settled()
    expect(trackMock).toHaveBeenCalledTimes(1)
    expect(trackMock).toHaveBeenCalledWith('QR Code Scanned', { src: 'leave', platform: 'ios' })
  })

  it('knows every place on the site, and still redirects with ?src= in the link', async () => {
    for (const src of QR_SOURCES) {
      expect(scan(`/qr?src=${src}`, ANDROID).headers.get('location')).toBe(PLAY)
    }
    await settled()
    expect(trackMock.mock.calls.map(([, props]) => props.src)).toEqual([...QR_SOURCES])
    expect(trackMock.mock.calls.every(([, props]) => props.platform === 'android')).toBe(true)
  })

  it('counts the first code, without a place, and an unknown place as "none"', async () => {
    scan('/qr', DESKTOP)
    scan('/qr?src=someone@example.com', DESKTOP)
    await settled()
    expect(trackMock.mock.calls).toEqual([
      ['QR Code Scanned', { src: 'none', platform: 'desktop' }],
      ['QR Code Scanned', { src: 'none', platform: 'desktop' }],
    ])
  })

  it('does not count bots, link scanners, a missing user agent, prefetches or HEAD', async () => {
    scan('/qr?src=sticky', 'curl/8.7.1')
    scan('/qr?src=sticky', 'WhatsApp/2.23.20.0')
    scan('/qr?src=sticky', null)
    scan('/qr?src=sticky', IPHONE, { 'sec-purpose': 'prefetch' })
    HEAD(new NextRequest('https://www.altidhjem.dk/qr?src=sticky', { method: 'HEAD', headers: { 'user-agent': IPHONE } }))
    await settled()
    expect(trackMock).not.toHaveBeenCalled()
  })

  it('rate-limits on a keyed hash of the IP and on the whole site, and counts nothing past either', async () => {
    scan('/qr?src=offer', IPHONE)
    await settled()
    expect(rateLimit.mock.calls.map(([key]) => key)).toEqual([ipKey, 'qr-scan:global'])
    expect(JSON.stringify(rateLimit.mock.calls)).not.toContain(IP)

    for (const blocked of [ipKey, 'qr-scan:global']) {
      trackMock.mockReset()
      afterTasks = []
      limitedKey = (key) => key === blocked
      const res = scan('/qr?src=offer', IPHONE)
      expect(res.status).toBe(302)
      await settled()
      expect(trackMock).not.toHaveBeenCalled()
    }
  })

  it('still redirects, and logs, when the count fails', async () => {
    trackMock.mockRejectedValueOnce(new Error('Amplitude answered 400'))
    const res = scan('/qr?src=energi', ANDROID)
    expect(res.headers.get('location')).toBe(PLAY)
    await settled()
    expect(console.error).toHaveBeenCalledWith('QR scan not recorded', 'Amplitude answered 400')
  })

  it('never counts without the IP salt, and says so in the log', async () => {
    vi.stubEnv('REFERRAL_IP_SALT', '')
    expect(scan('/qr?src=energi', ANDROID).status).toBe(302)
    await settled()
    expect(trackMock).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith('QR scan not recorded', expect.stringContaining('REFERRAL_IP_SALT'))
  })
})
