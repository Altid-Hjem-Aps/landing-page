import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

// POST /api/waitlist {source: 'newsletter'}, through the route. Boundaries faked:
// Supabase, Resend, the SMS gateway, the upstream API (fetch), Amplitude and
// after(). The handler's own logic runs for real.

type Row = Record<string, unknown>

const db = {
  signupRows: [] as Row[],
  events: [] as Row[],
  limited: new Set<string>(),
  released: [] as string[],
  rpcKeys: [] as string[],
  limiterFails: false,
  limiterFailsFor: null as string | null,
  lookup: 'ok' as 'ok' | 'error' | 'hang',
  insertFails: false,
  eventFails: false,
  countFilters: [] as string[],
}

function selectBuilder() {
  const b = {
    or: (filter: string) => {
      db.countFilters.push(filter)
      return b
    },
    order: () => b,
    range: () => Promise.resolve({ data: [{ created_at: '2026-11-04T10:00:00Z' }], error: null }),
    eq: () => ({
      order: () => ({
        limit: () => ({
          maybeSingle: () => {
            if (db.lookup === 'hang') return new Promise(() => {})
            if (db.lookup === 'error') return Promise.resolve({ data: null, error: { message: 'boom' } })
            return Promise.resolve({ data: db.signupRows[0] ?? null, error: null })
          },
        }),
      }),
    }),
  }
  return b
}

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    rpc: (_fn: string, args: { p_key: string; p_max: number }) => {
      db.rpcKeys.push(args.p_key)
      if (db.limiterFails || db.limiterFailsFor === args.p_key) return Promise.resolve({ data: null, error: { message: 'limiter down' } })
      return Promise.resolve({ data: db.limited.has(args.p_key), error: null })
    },
    from: (table: string) => {
      if (table === 'consent_event') {
        return {
          insert: (row: Row) => {
            if (db.eventFails) return Promise.resolve({ error: { message: 'event failed' } })
            db.events.push(row)
            return Promise.resolve({ error: null })
          },
        }
      }
      if (table === 'rate_limit') {
        return {
          delete: () => ({
            eq: (_col: string, key: string) => {
              db.released.push(key)
              return Promise.resolve({ error: null })
            },
          }),
        }
      }
      return {
        select: selectBuilder,
        upsert: (row: Row, opts: { onConflict: string; ignoreDuplicates: boolean }) => {
          if (db.insertFails) return Promise.resolve({ error: { message: 'insert failed' } })
          const duplicate = db.signupRows.some((r) => r.public_id === row.public_id)
          if (!duplicate || !opts.ignoreDuplicates) db.signupRows.push(row)
          return Promise.resolve({ error: null })
        },
      }
    },
  }),
}))

const sendConsentConfirmation = vi.fn(async (vars: unknown): Promise<{ error: { message: string } | null }> => {
  void vars
  return { error: null }
})
const otherMail = vi.fn(async () => {})
vi.mock('@/lib/send-email', () => ({
  sendConsentConfirmation: (vars: unknown) => sendConsentConfirmation(vars),
  sendWaitlistConfirmation: otherMail,
  sendReferralWelcome: otherMail,
  scheduleReleaseEmail: otherMail,
  sendReferralProgress: otherMail,
}))
const sms = vi.fn(async () => {})
vi.mock('@/lib/send-sms', () => ({ sendWaitlistConfirmationSms: sms }))
const audience = vi.fn(async () => {})
vi.mock('@/lib/resend', () => ({ addAudienceContact: audience, syncContactTags: audience }))
const track = vi.fn(async (event: string, props: unknown) => {
  void event
  void props
})
vi.mock('@/lib/amplitude.server', () => ({
  trackAnonymousServer: (event: string, props: unknown) => track(event, props),
  trackServer: vi.fn(),
  identifyServer: vi.fn(),
}))

const afterTasks: Array<Promise<unknown>> = []
vi.mock('next/server', async () => {
  const actual = await vi.importActual<typeof import('next/server')>('next/server')
  return {
    ...actual,
    after: (task: () => Promise<unknown>) => {
      afterTasks.push(Promise.resolve().then(task))
    },
  }
})

const { POST } = await import('@/app/api/waitlist/route')
const { getSignupCounts } = await import('@/lib/db')
const { newsletterPublicId } = await import('@/lib/newsletter')
const { verifyConfirmToken } = await import('@/lib/consent-token')

const VALID = { source: 'newsletter', scope: 'hjem', email: 'Ny@Example.dk', consent: true }

const SAME_SITE = {
  'content-type': 'application/json',
  'x-forwarded-for': '203.0.113.7',
  host: 'www.altidhjem.dk',
  origin: 'https://www.altidhjem.dk',
}

async function post(body: unknown, headers: Record<string, string> = SAME_SITE) {
  const res = await POST(
    new NextRequest('https://www.altidhjem.dk/api/waitlist', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    }),
  )
  await Promise.all(afterTasks.splice(0))
  return res
}

const fetchMock = vi.fn()

beforeEach(() => {
  Object.assign(db, {
    signupRows: [],
    events: [],
    limited: new Set<string>(),
    released: [],
    rpcKeys: [],
    limiterFails: false,
    limiterFailsFor: null,
    lookup: 'ok',
    insertFails: false,
    eventFails: false,
    countFilters: [],
  })
  vi.stubEnv('CONSENT_TOKEN_SECRET', 'test-only-consent-secret')
  vi.stubEnv('REFERRAL_IP_SALT', 'test-only-salt')
  vi.stubEnv('SUPABASE_URL', 'http://localhost:1')
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-only-key')
  vi.stubGlobal('fetch', fetchMock)
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.clearAllMocks()
})

function existingRow(over: Row = {}): Row {
  return {
    public_id: 'existing-id',
    first_name: null,
    unsub_token: 'unsub-token',
    unsubscribed: false,
    marketing_consent_mad: false,
    marketing_consent_group: false,
    ...over,
  }
}

describe('new address', () => {
  it('stores one row with both flags and evidence, and contacts nobody', async () => {
    const res = await post(VALID)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })

    expect(db.signupRows).toHaveLength(1)
    const row = db.signupRows[0]
    expect(row).toMatchObject({
      email: 'ny@example.dk',
      signup_source: 'newsletter',
      marketing_consent_mad: true,
      marketing_consent_group: true,
      consent_version: expect.stringMatching(/-hjem$/),
    })
    expect(row.consent_at).toEqual(expect.any(String))
    // consent_event.public_id is a uuid column; anything else breaks unsubscribe.
    expect(row.public_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    expect(db.events).toEqual([
      {
        public_id: row.public_id,
        method: 'newsletter-form',
        consent_version: row.consent_version,
        marketing_consent_mad: true,
        marketing_consent_group: true,
      },
    ])

    expect(fetchMock).not.toHaveBeenCalled() // the upstream waitlist API
    expect(sendConsentConfirmation).not.toHaveBeenCalled()
    expect(otherMail).not.toHaveBeenCalled()
    expect(sms).not.toHaveBeenCalled()
    expect(audience).not.toHaveBeenCalled()
    // No address in the event.
    expect(track.mock.calls).toEqual([['Newsletter Signup', { scope: 'hjem' }]])
  })

  it('derives the id from the lowercased address, so a racing double submit is one row', async () => {
    expect(newsletterPublicId('NY@example.dk')).toBe(newsletterPublicId('ny@example.dk'))
    expect(newsletterPublicId('ny@example.dk')).not.toBe(newsletterPublicId('anden@example.dk'))
  })

  it('still answers success when Amplitude fails', async () => {
    track.mockRejectedValueOnce(new Error('amplitude down'))
    const res = await post(VALID)
    expect(res.status).toBe(200)
    expect(db.signupRows).toHaveLength(1)
  })
})

describe('refused input stores nothing', () => {
  it.each([
    ['another website', { ...SAME_SITE, origin: 'https://evil.example' }],
    ['no Origin', { 'content-type': 'application/json', host: 'www.altidhjem.dk' }],
    ['a no-cors text/plain post', { ...SAME_SITE, 'content-type': 'text/plain' }],
  ])('%s answers 403', async (_name, headers) => {
    const res = await post(VALID, headers as Record<string, string>)
    expect(res.status).toBe(403)
    expect(db.signupRows).toHaveLength(0)
    expect(db.events).toHaveLength(0)
  })

  it.each([
    ['no tick', { ...VALID, consent: false }],
    ['tick as a string', { ...VALID, consent: 'true' }],
    ['bad address', { ...VALID, email: 'ikke-en-mail' }],
    ['address not a string', { ...VALID, email: { a: 1 } }],
    ['address too long', { ...VALID, email: `${'a'.repeat(250)}@example.dk` }],
    ['another site', { ...VALID, scope: 'mad' }],
  ])('%s answers 400', async (_name, body) => {
    const res = await post(body)
    expect(res.status).toBe(400)
    expect(db.signupRows).toHaveLength(0)
    expect(db.events).toHaveLength(0)
    expect(db.rpcKeys).toHaveLength(0)
  })
})

describe('failures say retry and never read as a new person', () => {
  it('a failed lookup answers 503 with no write', async () => {
    db.lookup = 'error'
    const res = await post(VALID)
    expect(res.status).toBe(503)
    expect(db.signupRows).toHaveLength(0)
    expect(db.events).toHaveLength(0)
  })

  it('a lookup that does not answer in time answers 503 with no write', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    db.lookup = 'hang'
    const pending = post(VALID)
    await vi.advanceTimersByTimeAsync(2100)
    const res = await pending
    vi.useRealTimers()
    expect(res.status).toBe(503)
    expect(db.signupRows).toHaveLength(0)
  })

  it('a failed insert answers 503, and the retry stores the row although the address limit is used', async () => {
    db.insertFails = true
    expect((await post(VALID)).status).toBe(503)
    expect(db.signupRows).toHaveLength(0)

    db.insertFails = false
    db.limited.add('newsletter-address:ny@example.dk')
    expect((await post(VALID)).status).toBe(200)
    expect(db.signupRows).toHaveLength(1)
  })

  it('over the ceiling answers 503 for a new and a known address alike, so it reveals neither', async () => {
    db.limited.add('newsletter:submits')
    expect((await post(VALID)).status).toBe(503)
    expect(db.signupRows).toHaveLength(0)
    expect(db.events).toHaveLength(0)

    db.signupRows = [existingRow()]
    expect((await post(VALID)).status).toBe(503)
  })

  it('failed evidence answers 503 and leaves no row without evidence', async () => {
    db.eventFails = true
    expect((await post(VALID)).status).toBe(503)
    expect(db.signupRows).toHaveLength(0)
  })

  it('an unavailable address limit answers 503 with no write', async () => {
    db.limiterFails = true
    expect((await post(VALID)).status).toBe(503)
    expect(db.signupRows).toHaveLength(0)
  })

  it('over the IP limit answers 429 with no write', async () => {
    const ipKey = (await import('@/lib/mail-links')).ipRateKey('newsletter', '203.0.113.7', 'test-only-salt')
    db.limited.add(ipKey)
    expect((await post(VALID)).status).toBe(429)
    expect(db.signupRows).toHaveLength(0)
  })
})

describe('same answer whatever is on file', () => {
  it('on file and over the address limit: the success answer and nothing happens', async () => {
    db.signupRows = [existingRow()]
    db.limited.add('newsletter-address:ny@example.dk')
    const res = await post(VALID)
    expect(await res.json()).toEqual({ success: true })
    expect(db.signupRows).toEqual([existingRow()])
    expect(db.events).toHaveLength(0)
    expect(sendConsentConfirmation).not.toHaveBeenCalled()
  })

  it('on file without consent: one confirmation mail, empty name allowed, no consent written', async () => {
    db.signupRows = [existingRow()]
    const res = await post(VALID)
    expect(await res.json()).toEqual({ success: true })

    expect(db.signupRows).toEqual([existingRow()])
    expect(db.events).toHaveLength(0)
    expect(sendConsentConfirmation).toHaveBeenCalledTimes(1)
    const mail = sendConsentConfirmation.mock.calls[0][0] as {
      name: string
      email: string
      confirmUrl: string
      unsubscribeUrl: string
      pending: { mad: boolean; group: boolean }
    }
    expect(mail).toMatchObject({
      name: '',
      email: 'ny@example.dk',
      unsubscribeUrl: 'https://altidhjem.dk/api/unsubscribe?token=unsub-token',
      pending: { mad: true, group: true },
    })
    // The link names this row and exactly what is outstanding.
    const token = new URL(mail.confirmUrl).searchParams.get('t')
    expect(verifyConfirmToken(token, Date.now() / 1000)).toEqual({
      publicId: 'existing-id',
      consent: { mad: true, group: true },
    })
  })

  it('on file with one consent: the mail asks only for the other', async () => {
    db.signupRows = [existingRow({ marketing_consent_mad: true })]
    await post(VALID)
    expect(sendConsentConfirmation.mock.calls[0][0]).toMatchObject({ pending: { mad: false, group: true } })
  })

  it.each([
    ['already has the consent', { marketing_consent_mad: true, marketing_consent_group: true }],
    ['has unsubscribed', { unsubscribed: true }],
  ])('on file and %s: nothing is written or sent', async (_name, over) => {
    db.signupRows = [existingRow(over)]
    const res = await post(VALID)
    expect(await res.json()).toEqual({ success: true })
    expect(db.signupRows).toEqual([existingRow(over)])
    expect(db.events).toHaveLength(0)
    expect(sendConsentConfirmation).not.toHaveBeenCalled()
  })

  it.each(['newsletter-confirm:ny@example.dk', 'consent-confirm:ny@example.dk'])('checks the global mail limit only after %s passed', async (key) => {
    db.signupRows = [existingRow()]
    db.limited.add(key)
    const res = await post(VALID)
    expect(await res.json()).toEqual({ success: true })
    expect(db.rpcKeys).not.toContain('consent-confirm:global')
    expect(sendConsentConfirmation).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalled()
  })

  it('a global mail limit or a Resend failure is logged, and the answer does not change', async () => {
    db.signupRows = [existingRow()]
    db.limited.add('consent-confirm:global')
    expect(await (await post(VALID)).json()).toEqual({ success: true })
    expect(sendConsentConfirmation).not.toHaveBeenCalled()

    db.limited.clear()
    sendConsentConfirmation.mockRejectedValueOnce(new Error('resend down'))
    expect(await (await post({ ...VALID, email: 'anden@example.dk' })).json()).toEqual({ success: true })
    expect(console.error).toHaveBeenCalled()
  })

  it('a refusal Resend returns instead of throwing is logged', async () => {
    db.signupRows = [existingRow()]
    sendConsentConfirmation.mockResolvedValueOnce({ error: { message: 'daily quota' } })
    expect(await (await post(VALID)).json()).toEqual({ success: true })
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('confirmation not sent'), expect.any(Error))
  })

  it.each([
    ['a global limit', () => db.limited.add('consent-confirm:global')],
    ['a Resend refusal', () => sendConsentConfirmation.mockResolvedValueOnce({ error: { message: 'daily quota' } })],
  ])('%s gives the week back, so the next attempt can still mail', async (_name, arrange) => {
    db.signupRows = [existingRow()]
    arrange()
    await post(VALID)
    expect(db.released).toEqual(['newsletter-confirm:ny@example.dk'])
  })

  it('a failed week check gives nothing back: the week may belong to a mail already sent', async () => {
    db.signupRows = [existingRow()]
    db.limiterFailsFor = 'newsletter-confirm:ny@example.dk'
    await post(VALID)
    expect(sendConsentConfirmation).not.toHaveBeenCalled()
    expect(db.released).toEqual([])
  })

  it('a mail that went out keeps the week, and a repeat that week does not give it back', async () => {
    db.signupRows = [existingRow()]
    await post(VALID)
    expect(sendConsentConfirmation).toHaveBeenCalledTimes(1)
    expect(db.released).toEqual([])

    db.limited.add('newsletter-confirm:ny@example.dk')
    await post(VALID)
    expect(sendConsentConfirmation).toHaveBeenCalledTimes(1)
    expect(db.released).toEqual([])
  })
})

describe('step 1 for an address already on file', () => {
  it('greets with the name on file, never the words a stranger typed', async () => {
    vi.stubEnv('SURVEY_TOKEN_SECRET', 'test-only-survey-secret')
    fetchMock.mockResolvedValue({ status: 409, ok: false, json: async () => ({}) })
    db.signupRows = [existingRow()]
    await post({ step: 1, email: 'ny@example.dk', name: 'Vind en bil på evil.example', consent: { mad: true, group: true } })
    expect(sendConsentConfirmation).toHaveBeenCalledTimes(1)
    expect(sendConsentConfirmation.mock.calls[0][0]).toMatchObject({ name: '' })
  })
})

describe('the waitlist count in Slack', () => {
  it('leaves newsletter rows out and keeps old rows without a source', async () => {
    await getSignupCounts()
    expect(db.countFilters).toEqual(['signup_source.is.null,signup_source.neq.newsletter'])
  })
})
