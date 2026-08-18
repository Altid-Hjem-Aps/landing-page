import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import {
  energiRedirectUrl,
  hashIp,
  isReferralCode,
  clientIp,
  looksLikeBot,
  normalizeReferralCode,
  ENERGI_REFERRAL_SIGNUP_URL,
} from '@/lib/referral'

const recordEnergiReferralEvent = vi.fn()
const checkRateLimit = vi.fn()

vi.mock('@/lib/db', () => ({
  recordEnergiReferralEvent: (...a: unknown[]) => recordEnergiReferralEvent(...a),
  checkRateLimit: (...a: unknown[]) => checkRateLimit(...a),
}))

// next/server's after() needs a request context we do not have in unit tests.
// Run the callback immediately and await it, so assertions see the insert.
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

const { GET, HEAD } = await import('@/app/r/[code]/route')
const { POST } = await import('@/app/api/referral/event/route')

const VALID = '4CV9K4RK'
const ENERGI = 'https://tilmeld.altidenergi.dk/signup/henvisning-app'
const HUMAN_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) Safari/605.1'

async function get(code: string, headers: Record<string, string> = {}) {
  const req = new NextRequest(`https://altidhjem.dk/r/${encodeURIComponent(code)}`, {
    headers: { 'user-agent': HUMAN_UA, ...headers },
  })
  const res = await GET(req, { params: Promise.resolve({ code }) })
  await Promise.all(afterTasks.splice(0))
  return res
}

function post(body: unknown, headers: Record<string, string> = {}) {
  const payload = typeof body === 'string' ? body : body === undefined ? undefined : JSON.stringify(body)
  return POST(
    new NextRequest('https://altidhjem.dk/api/referral/event', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: payload,
    }),
  )
}

const originalSalt = process.env.REFERRAL_IP_SALT

beforeEach(() => {
  recordEnergiReferralEvent.mockReset().mockResolvedValue(undefined)
  checkRateLimit.mockReset().mockResolvedValue(false)
  process.env.REFERRAL_IP_SALT = 'test-salt'
})

afterEach(() => {
  if (originalSalt === undefined) delete process.env.REFERRAL_IP_SALT
  else process.env.REFERRAL_IP_SALT = originalSalt
})

describe('lib/referral', () => {
  it('accepts only the 8-char app alphabet', () => {
    expect(isReferralCode(VALID)).toBe(true)
    expect(isReferralCode('4cv9k4rk')).toBe(false) // normalised by the route, not here
    expect(isReferralCode('4CV9K4R')).toBe(false)
    expect(isReferralCode('4CV9K4RK1')).toBe(false)
    expect(isReferralCode('4CV9K4R0')).toBe(false) // 0 not in alphabet
    expect(isReferralCode('4CV9K4RA')).toBe(false) // vowels not in alphabet
  })

  it('normalises case and strips trailing chat-app punctuation', () => {
    expect(normalizeReferralCode('4cv9k4rk')).toBe(VALID)
    expect(normalizeReferralCode('4CV9K4RK.')).toBe(VALID)
    expect(normalizeReferralCode('4CV9K4RK)')).toBe(VALID)
    expect(normalizeReferralCode(' 4CV9K4RK?! ')).toBe(VALID)
    expect(normalizeReferralCode(null)).toBe('')
    expect(normalizeReferralCode('4CV9-K4RK')).toBe('4CV9-K4RK') // inner punctuation stays, still invalid
  })

  it('builds the Energi URL Michael gave us, with ref + UTM, or UTM only', () => {
    expect(ENERGI_REFERRAL_SIGNUP_URL).toBe(ENERGI)
    const u = new URL(energiRedirectUrl(VALID))
    expect(u.origin + u.pathname).toBe(ENERGI)
    expect(u.searchParams.get('ref')).toBe(VALID)
    expect(u.searchParams.get('utm_source')).toBe('altidhjem')
    expect(u.searchParams.get('utm_medium')).toBe('referral')
    expect(u.searchParams.get('utm_campaign')).toBe('ah_referral')
    const v = new URL(energiRedirectUrl(null))
    expect(v.searchParams.has('ref')).toBe(false)
    expect(v.searchParams.get('utm_source')).toBe('altidhjem')
  })

  it('hashes IPs with a daily salt and never returns the raw IP', () => {
    const d1 = new Date('2026-08-18T10:00:00Z')
    const d2 = new Date('2026-08-19T10:00:00Z')
    const h1 = hashIp('1.2.3.4', 's', d1)
    expect(h1).toMatch(/^[a-f0-9]{64}$/)
    expect(h1).not.toContain('1.2.3.4')
    expect(hashIp('1.2.3.4', 's', d1)).toBe(h1)
    expect(hashIp('1.2.3.4', 's', d2)).not.toBe(h1)
    expect(hashIp(null, 's', d1)).toBeNull()
    expect(hashIp('1.2.3.4', undefined, d1)).toBeNull()
  })

  it('reads the first x-forwarded-for hop', () => {
    expect(clientIp(new Headers({ 'x-forwarded-for': '9.9.9.9, 10.0.0.1' }))).toBe('9.9.9.9')
    expect(clientIp(new Headers({ 'x-real-ip': '8.8.8.8' }))).toBe('8.8.8.8')
    expect(clientIp(new Headers())).toBeNull()
  })

  it('recognises unfurlers and crawlers, and treats a missing UA as a bot', () => {
    expect(looksLikeBot(HUMAN_UA)).toBe(false)
    expect(looksLikeBot('facebookexternalhit/1.1')).toBe(true)
    expect(looksLikeBot('WhatsApp/2.23.20.0')).toBe(true)
    expect(looksLikeBot('Slackbot-LinkExpanding 1.0')).toBe(true)
    expect(looksLikeBot('curl/8.4.0')).toBe(true)
    expect(looksLikeBot(null)).toBe(true)
  })
})

describe('GET /r/[code]', () => {
  it('302s a valid code to Energi with ref + UTM, no-store, and records a valid click', async () => {
    const res = await get(VALID, { 'x-forwarded-for': '1.2.3.4', 'x-vercel-ip-country': 'DK' })
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe(energiRedirectUrl(VALID))
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(checkRateLimit).toHaveBeenCalledWith('referral-click:1.2.3.4', 60, 3600)
    expect(recordEnergiReferralEvent).toHaveBeenCalledTimes(1)
    const row = recordEnergiReferralEvent.mock.calls[0][0]
    expect(row).toMatchObject({ code: VALID, kind: 'click', valid: true, ua: HUMAN_UA, country: 'DK' })
    expect(row.ipHash).toMatch(/^[a-f0-9]{64}$/)
  })

  it('normalises lowercase and trailing punctuation so the friend keeps the ref', async () => {
    const res = await get('4cv9k4rk.')
    expect(res.headers.get('location')).toBe(energiRedirectUrl(VALID))
    expect(recordEnergiReferralEvent.mock.calls[0][0]).toMatchObject({ code: VALID, valid: true })
  })

  it('still sends an invalid code to Energi (without ref) and records valid=false, truncated', async () => {
    const res = await get('Z'.repeat(100))
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe(energiRedirectUrl(null))
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(recordEnergiReferralEvent.mock.calls[0][0]).toMatchObject({ code: 'Z'.repeat(32), kind: 'click', valid: false })
  })

  it('redirects bots and unfurlers without logging anything', async () => {
    const res = await get(VALID, { 'user-agent': 'facebookexternalhit/1.1' })
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe(energiRedirectUrl(VALID))
    expect(checkRateLimit).not.toHaveBeenCalled()
    expect(recordEnergiReferralEvent).not.toHaveBeenCalled()
  })

  it('stops logging (but still redirects) when one IP is over the click cap', async () => {
    checkRateLimit.mockResolvedValueOnce(true)
    const res = await get(VALID, { 'x-forwarded-for': '5.5.5.5' })
    expect(res.status).toBe(302)
    expect(recordEnergiReferralEvent).not.toHaveBeenCalled()
  })

  it('still redirects when the database is down or slow to fail', async () => {
    recordEnergiReferralEvent.mockRejectedValueOnce(new Error('db down'))
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await get(VALID)
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe(energiRedirectUrl(VALID))
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('records ip_hash null (and warns) when REFERRAL_IP_SALT is unset', async () => {
    delete process.env.REFERRAL_IP_SALT
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await get(VALID, { 'x-forwarded-for': '1.2.3.4' })
    expect(res.status).toBe(302)
    expect(recordEnergiReferralEvent.mock.calls[0][0]).toMatchObject({ ipHash: null })
    spy.mockRestore()
  })

  it('HEAD redirects identically and never logs', async () => {
    const req = new NextRequest(`https://altidhjem.dk/r/${VALID}`, { method: 'HEAD', headers: { 'user-agent': HUMAN_UA } })
    const res = await HEAD(req, { params: Promise.resolve({ code: VALID }) })
    await Promise.all(afterTasks.splice(0))
    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe(energiRedirectUrl(VALID))
    expect(recordEnergiReferralEvent).not.toHaveBeenCalled()
  })
})

describe('POST /api/referral/event', () => {
  it('records share and copy, 204', async () => {
    expect((await post({ code: VALID, kind: 'share' })).status).toBe(204)
    expect((await post({ code: VALID, kind: 'copy' })).status).toBe(204)
    expect(recordEnergiReferralEvent).toHaveBeenCalledTimes(2)
    expect(recordEnergiReferralEvent.mock.calls[0][0]).toMatchObject({ code: VALID, kind: 'share', valid: true })
    expect(recordEnergiReferralEvent.mock.calls[1][0]).toMatchObject({ code: VALID, kind: 'copy', valid: true })
  })

  it('rejects bad input with 400 + JSON error and records nothing', async () => {
    const r1 = await post('{not json')
    expect(r1.status).toBe(400)
    expect(await r1.json()).toEqual({ success: false, error: 'invalid_json' })
    expect((await post({ code: 'nope', kind: 'share' })).status).toBe(400)
    expect((await post({ code: VALID, kind: 'click' })).status).toBe(400)
    expect((await post({ code: VALID, kind: 'delete' })).status).toBe(400)
    expect((await post({ kind: 'share' })).status).toBe(400)
    expect(recordEnergiReferralEvent).not.toHaveBeenCalled()
  })

  it('rate-limits per IP+code and 429s', async () => {
    checkRateLimit.mockResolvedValueOnce(true)
    const res = await post({ code: VALID, kind: 'share' }, { 'x-forwarded-for': '5.5.5.5' })
    expect(res.status).toBe(429)
    expect(checkRateLimit).toHaveBeenCalledWith(`referral-event:5.5.5.5:${VALID}`, 60, 3600)
    expect(recordEnergiReferralEvent).not.toHaveBeenCalled()
  })

  it('uses the unknown bucket without an IP header', async () => {
    await post({ code: VALID, kind: 'share' })
    expect(checkRateLimit).toHaveBeenCalledWith(`referral-event:unknown:${VALID}`, 60, 3600)
  })

  it('500s (and does not throw) when the insert fails', async () => {
    recordEnergiReferralEvent.mockRejectedValueOnce(new Error('db down'))
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await post({ code: VALID, kind: 'share' })
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ success: false, error: 'not_recorded' })
    spy.mockRestore()
  })
})
