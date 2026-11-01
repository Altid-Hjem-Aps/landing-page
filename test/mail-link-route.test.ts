import { createHash } from 'node:crypto'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { LINK_CODES, MAIL_CODES } from '@/lib/mail-links'

// The Amplitude client is the boundary: the route must hand it exactly the
// allowlisted values, and it must not matter to the person when it fails.
const tracked: Array<{ event: string; props: Record<string, unknown> }> = []
const trackMock = vi.fn(async (event: string, props: Record<string, unknown>) => {
  tracked.push({ event, props })
})
vi.mock('@/lib/amplitude.server', () => ({
  trackAnonymousServer: (event: string, props: Record<string, unknown>) => trackMock(event, props),
}))

// The rate limit lives in Supabase (our adapter is the boundary).
let limited = false
let limitError: Error | null = null
const rateLimit = vi.fn(async (key: string, max: number, windowSeconds: number) => {
  void key
  void max
  void windowSeconds
  if (limitError) throw limitError
  return limited
})
vi.mock('@/lib/db', () => ({
  checkRateLimitStrict: (key: string, max: number, windowSeconds: number) => rateLimit(key, max, windowSeconds),
}))

// next/server's after() needs a request context we do not have in unit tests.
const afterTasks: Array<Promise<unknown>> = []
vi.mock('next/server', async () => {
  const actual = await vi.importActual<typeof import('next/server')>('next/server')
  return {
    ...actual,
    after: (task: () => Promise<unknown> | unknown) => {
      afterTasks.push(Promise.resolve().then(task))
    },
  }
})

const { GET, HEAD } = await import('@/app/m/[mail]/[link]/route')

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
const ANDROID = 'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36'
const IPAD = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15'

const APP_STORE = 'https://apps.apple.com/dk/app/altid-hjem/id6794330094'
const PLAY = 'https://play.google.com/store/apps/details?id=dk.altidhjem.app'

function appStore(mail: string) {
  return `${APP_STORE}?pt=129212732&ct=ah_1_mail_${mail}&mt=8`
}
function play(mail: string, link: string) {
  const referrer =
    mail === 'invite'
      ? `utm_source=invite&utm_medium=share&utm_campaign=invite&utm_content=${link}`
      : `utm_source=mail_${mail}&utm_medium=email&utm_campaign=ah_1_mail_${mail}&utm_content=${link}`
  return `${PLAY}&referrer=${encodeURIComponent(referrer)}`
}

async function get(
  mail: string,
  link: string,
  ua: string | null = IPHONE,
  method: 'GET' | 'HEAD' = 'GET',
  extra: Record<string, string> = {},
) {
  const headers: Record<string, string> = { 'x-forwarded-for': '203.0.113.7', ...extra, ...(ua ? { 'user-agent': ua } : {}) }
  const req = new NextRequest(`https://www.altidhjem.dk/m/${mail}/${link}`, { method, headers })
  const ctx = { params: Promise.resolve({ mail, link }) }
  const res = method === 'GET' ? await GET(req, ctx) : await HEAD(req, ctx)
  await Promise.all(afterTasks.splice(0))
  return res
}

beforeEach(() => {
  vi.stubEnv('REFERRAL_IP_SALT', 'test-only-salt')
  tracked.length = 0
  trackMock.mockClear()
  rateLimit.mockClear()
  limited = false
  limitError = null
  vi.stubEnv('VERCEL_ENV', 'production')
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('/m/<mail>/<link>', () => {
  it('sends every known code to its store with that mail campaign', async () => {
    for (const mail of MAIL_CODES) {
      for (const link of LINK_CODES) {
        const res = await get(mail, link, IPHONE)
        expect(res.status).toBe(302)
        expect(res.headers.get('x-altid-mail-link')).toBe('valid')
        const expected = link.includes('play') ? play(mail, link) : appStore(mail)
        expect(res.headers.get('location'), `${mail}/${link}`).toBe(expected)
      }
    }
  })

  it('gives the Altid Forsikring follow-up (m2f) its own campaign on both stores', async () => {
    const iphone = await get('m2f', 'intro-appstore')
    expect(iphone.headers.get('location')).toBe('https://apps.apple.com/dk/app/altid-hjem/id6794330094?pt=129212732&ct=ah_1_mail_m2f&mt=8')
    expect(iphone.headers.get('x-altid-mail-link')).toBe('valid')
    expect((await get('m2f', 'qr-play')).headers.get('location')).toBe(play('m2f', 'qr-play'))
  })

  it('gives the Altid Forsikring mail its own App Store campaign, and keeps the dropped notice codes working', async () => {
    expect((await get('a1f', 'intro-appstore')).headers.get('location')).toBe(
      'https://apps.apple.com/dk/app/altid-hjem/id6794330094?pt=129212732&ct=ah_1_mail_a1f&mt=8',
    )
    for (const old of ['a1b', 'a1d']) {
      const res = await get(old, 'qr-play', ANDROID)
      expect(res.headers.get('x-altid-mail-link')).toBe('valid')
      expect(res.headers.get('location')).toBe(play(old, 'qr-play'))
    }
  })

  it('sends a shared invite (/app -> invite/header) to the store of the phone with the invite campaign', async () => {
    const iphone = await get('invite', 'header', IPHONE)
    expect(iphone.headers.get('location')).toBe(`${APP_STORE}?pt=129212732&ct=ah_1_mail_invite&mt=8`)
    expect(iphone.headers.get('x-altid-mail-link')).toBe('valid')
    const android = await get('invite', 'header', ANDROID)
    // A share, not an email: Play must not file it under utm_medium=email.
    expect(android.headers.get('location')).toBe(
      `${PLAY}&referrer=${encodeURIComponent('utm_source=invite&utm_medium=share&utm_campaign=invite&utm_content=header')}`,
    )
  })

  it('encodes the Play referrer once, so the store reads utm_content back', async () => {
    const res = await get('a1c', 'intro-play-wide', ANDROID)
    const location = new URL(res.headers.get('location')!)
    const referrer = new URLSearchParams(location.searchParams.get('referrer')!)
    expect(Object.fromEntries(referrer)).toEqual({
      utm_source: 'mail_a1c',
      utm_medium: 'email',
      utm_campaign: 'ah_1_mail_a1c',
      utm_content: 'intro-play-wide',
    })
  })

  it('sends the header image to the store of the phone', async () => {
    expect((await get('a1a', 'header', ANDROID)).headers.get('location')).toBe(play('a1a', 'header'))
    expect((await get('a1a', 'header', IPHONE)).headers.get('location')).toBe(appStore('a1a'))
    expect((await get('a1a', 'header', IPAD)).headers.get('location')).toBe(appStore('a1a'))
  })

  it('still sends a person to a store on an unknown code, and counts it as invalid with no raw text', async () => {
    const res = await get('peter@example.com', 'intro-appstor', ANDROID)
    expect(res.status).toBe(302)
    expect(res.headers.get('x-altid-mail-link')).toBe('invalid')
    expect(res.headers.get('location')).toBe(play('unknown', 'unknown'))
    expect(tracked).toEqual([
      {
        event: 'Launch Mail Link Clicked',
        props: {
          campaign: 'alt605',
          mail: 'unknown',
          link: 'unknown',
          mail_link: 'unknown/unknown',
          store: 'play',
          valid: false,
          env: 'production',
        },
      },
    ])
  })

  it('counts a tap by a person with exactly the allowlisted values', async () => {
    await get('m2h', 'qr-play', IPHONE)
    expect(tracked).toEqual([
      {
        event: 'Launch Mail Link Clicked',
        props: {
          campaign: 'alt605',
          mail: 'm2h',
          link: 'qr-play',
          mail_link: 'm2h/qr-play',
          store: 'play',
          valid: true,
          env: 'production',
        },
      },
    ])
  })

  it('tells preview clicks apart from production ones', async () => {
    vi.stubEnv('VERCEL_ENV', 'preview')
    await get('a1a', 'intro-appstore', IPHONE)
    expect(tracked[0].props.env).toBe('preview')
  })

  it('does not count bots, scripts or a missing user agent, and still redirects them', async () => {
    for (const ua of ['Slackbot-LinkExpanding 1.0', 'curl/8.7.1', null]) {
      const res = await get('a1a', 'intro-appstore', ua)
      expect(res.status).toBe(302)
    }
    expect(trackMock).not.toHaveBeenCalled()
  })

  it('never counts a HEAD request, and answers it like the GET', async () => {
    const res = await get('a1b', 'end-play', IPHONE, 'HEAD')
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe(play('a1b', 'end-play'))
    expect(res.headers.get('x-altid-mail-link')).toBe('valid')
    expect(trackMock).not.toHaveBeenCalled()
  })

  it('redirects even when Amplitude fails', async () => {
    trackMock.mockRejectedValueOnce(new Error('Amplitude answered 400'))
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await get('a1d', 'qr-appstore', IPHONE)
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe(appStore('a1d'))
    expect(error).toHaveBeenCalledWith('mail link click not recorded', 'Amplitude answered 400')
    error.mockRestore()
  })

  it('counts a tap per IP up to the hourly limit, and still redirects past it', async () => {
    await get('a1a', 'intro-appstore', IPHONE)
    const [key, max, windowSeconds] = rateLimit.mock.calls[0]
    expect([max, windowSeconds]).toEqual([120, 3600])
    expect(trackMock).toHaveBeenCalledTimes(1)
    // A keyed hash, the same for the same IP, never the IP itself.
    expect(key).toMatch(/^mail-link:[0-9a-f]{32}$/)
    expect(key).not.toContain('203.0.113.7')
    expect(key).not.toBe(`mail-link:${createHash('sha256').update('203.0.113.7').digest('hex').slice(0, 32)}`)
    await get('a1c', 'qr-play', IPHONE)
    expect(rateLimit.mock.calls[1][0]).toBe(key)
    await get('a1c', 'qr-play', IPHONE, 'GET', { 'x-forwarded-for': '198.51.100.9' })
    expect(rateLimit.mock.calls[2][0]).not.toBe(key)
    trackMock.mockClear()
    limited = true
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const res = await get('a1a', 'intro-appstore', IPHONE)
    expect(res.status).toBe(302)
    expect(trackMock).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it('does not count a tap when the rate limit cannot be checked, and says so', async () => {
    limitError = new Error('rate limit unavailable: boom')
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await get('a1a', 'intro-appstore', IPHONE)
    expect(res.status).toBe(302)
    expect(trackMock).not.toHaveBeenCalled()
    expect(error).toHaveBeenCalledWith('mail link click not recorded', 'rate limit unavailable: boom')
    error.mockRestore()
  })

  it('does not count a tap without the IP secret, rather than store an unkeyed IP hash', async () => {
    vi.stubEnv('REFERRAL_IP_SALT', '')
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await get('a1a', 'intro-appstore', IPHONE)
    expect(res.status).toBe(302)
    expect(rateLimit).not.toHaveBeenCalled()
    expect(trackMock).not.toHaveBeenCalled()
    expect(error).toHaveBeenCalledWith(
      'mail link click not recorded',
      'REFERRAL_IP_SALT is not set: will not rate-limit on an unkeyed IP',
    )
    error.mockRestore()
  })

  it('gives a hung rate-limit check up after 3 s and counts nothing', async () => {
    vi.useFakeTimers()
    rateLimit.mockImplementationOnce(() => new Promise(() => {}))
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const req = new NextRequest('https://www.altidhjem.dk/m/a1a/intro-appstore', {
      headers: { 'user-agent': IPHONE, 'x-forwarded-for': '203.0.113.7' },
    })
    const res = await GET(req, { params: Promise.resolve({ mail: 'a1a', link: 'intro-appstore' }) })
    expect(res.status).toBe(302)
    const done = Promise.all(afterTasks.splice(0))
    await vi.advanceTimersByTimeAsync(3000)
    await done
    expect(trackMock).not.toHaveBeenCalled()
    expect(error).toHaveBeenCalledWith('mail link click not recorded', 'rate limit check did not answer within 3000 ms')
    error.mockRestore()
    vi.useRealTimers()
  })

  it('does not count a browser prefetch', async () => {
    await get('a1a', 'intro-appstore', IPHONE, 'GET', { 'sec-purpose': 'prefetch' })
    await get('a1a', 'intro-appstore', IPHONE, 'GET', { purpose: 'prefetch' })
    expect(trackMock).not.toHaveBeenCalled()
  })

  it('reads a code that a mail program capitalised or glued a full stop onto', async () => {
    const res = await get('A1A', 'qr-play).', IPHONE)
    expect(res.headers.get('x-altid-mail-link')).toBe('valid')
    expect(res.headers.get('location')).toBe(play('a1a', 'qr-play'))
    expect(tracked[0].props.mail_link).toBe('a1a/qr-play')
  })

  it('is never cached, so every tap reaches the counter', async () => {
    const res = await get('a1a', 'intro-appstore', IPHONE)
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(res.headers.get('vary')).toBe('User-Agent')
  })
})
