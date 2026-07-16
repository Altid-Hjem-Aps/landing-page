import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Route-level pins for the preference centre POST handler. The DB rules have
// their own unit tests; these cover the wiring the unit tests cannot see:
// the RFC 8058 body-less default, the legacy-form mapping, and that the audit
// event and the saved-page reflect the ENFORCED state, not the requested one.

const EMPTY = {
  hjemEmail: false,
  hjemSms: false,
  madEmail: false,
  madSms: false,
  forsikringEmail: false,
  forsikringSms: false,
  mobilEmail: false,
  mobilSms: false,
}

const setConsentByToken = vi.fn()
const unsubscribeAllByToken = vi.fn()
const setUnsubscribedByToken = vi.fn()
const getSignupByUnsubToken = vi.fn()
const recordConsentEvent = vi.fn()
const setResendSubscription = vi.fn()

vi.mock('@/lib/db', async () => {
  const actual = await vi.importActual<typeof import('@/lib/db')>('@/lib/db')
  return {
    ...actual,
    setConsentByToken: (...a: unknown[]) => setConsentByToken(...a),
    unsubscribeAllByToken: (...a: unknown[]) => unsubscribeAllByToken(...a),
    setUnsubscribedByToken: (...a: unknown[]) => setUnsubscribedByToken(...a),
    getSignupByUnsubToken: (...a: unknown[]) => getSignupByUnsubToken(...a),
    recordConsentEvent: (...a: unknown[]) => recordConsentEvent(...a),
  }
})
vi.mock('@/lib/resend', () => ({
  setResendSubscription: (...a: unknown[]) => setResendSubscription(...a),
}))

process.env.SUPABASE_URL = 'https://example.supabase.co'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key'

const { POST } = await import('@/app/api/unsubscribe/route')
const { PREF_SMS_NOT_SAVED } = await import('@/lib/copy')

function post(body?: FormData) {
  return new NextRequest('http://localhost/api/unsubscribe?token=tok', {
    method: 'POST',
    ...(body ? { body } : {}),
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  unsubscribeAllByToken.mockResolvedValue({ publicId: 'p1', email: 'a@b.dk' })
  setUnsubscribedByToken.mockResolvedValue({ publicId: 'p1', email: 'a@b.dk' })
  recordConsentEvent.mockResolvedValue(undefined)
  setResendSubscription.mockResolvedValue(undefined)
})

describe('RFC 8058 one-click (body-less POST)', () => {
  it('defaults to full unsubscribe via the atomic path', async () => {
    const res = await POST(post())
    expect(res.status).toBe(200)
    // The whole point of the default: Gmail/Apple Mail's native button must
    // land on "everything off", through the single atomic UPDATE.
    expect(unsubscribeAllByToken).toHaveBeenCalledTimes(1)
    expect(setConsentByToken).not.toHaveBeenCalled()
    expect(recordConsentEvent).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'unsubscribe-all', mad: false, group: false, matrix: EMPTY }),
    )
    expect(setResendSubscription).toHaveBeenCalledWith('a@b.dk', true)
  })
})

describe('legacy form values (pre-grid preference page in a stale tab)', () => {
  it("maps 'mad'/'group' to their brands and preserves current SMS + phone", async () => {
    // The old form knew nothing of SMS or the phone field. A stale-tab save
    // must not read those absences as withdrawals.
    getSignupByUnsubToken.mockResolvedValue({
      publicId: 'p1',
      email: 'a@b.dk',
      unsubscribed: false,
      consentMad: true,
      consentGroup: true,
      phone: '30489297',
      matrix: { ...EMPTY, madEmail: true, madSms: true },
    })
    setConsentByToken.mockImplementation(async (_t, c) => ({
      publicId: 'p1',
      email: 'a@b.dk',
      matrix: c.matrix,
      phone: c.phone,
    }))

    const fd = new FormData()
    fd.set('action', 'preferences')
    fd.append('consent', 'mad')
    fd.append('consent', 'group')
    const res = await POST(post(fd))
    expect(res.status).toBe(200)

    const arg = setConsentByToken.mock.calls[0][1] as { matrix: typeof EMPTY; phone: string | null }
    expect(arg.matrix.madEmail).toBe(true)
    expect(arg.matrix.hjemEmail).toBe(true)
    expect(arg.matrix.forsikringEmail).toBe(true)
    expect(arg.matrix.mobilEmail).toBe(true)
    // Carried through from the row, not wiped:
    expect(arg.matrix.madSms).toBe(true)
    expect(arg.phone).toBe('30489297')
  })

  it("a legacy save with nothing ticked still clears email consents (it was a real untick)", async () => {
    getSignupByUnsubToken.mockResolvedValue({
      publicId: 'p1',
      email: 'a@b.dk',
      unsubscribed: false,
      consentMad: true,
      consentGroup: false,
      phone: null,
      matrix: { ...EMPTY, madEmail: true },
    })
    setConsentByToken.mockImplementation(async (_t, c) => ({
      publicId: 'p1',
      email: 'a@b.dk',
      matrix: c.matrix,
      phone: c.phone,
    }))

    const fd = new FormData()
    fd.set('action', 'preferences')
    // No consent values at all: on the OLD form this meant "untick everything",
    // and with no legacy names present the mapping must NOT kick in.
    await POST(post(fd))
    const arg = setConsentByToken.mock.calls[0][1] as { matrix: typeof EMPTY }
    expect(arg.matrix.madEmail).toBe(false)
  })
})

describe('the saved-page never claims a dropped SMS choice was saved', () => {
  it('appends the SMS-not-saved notice when the server refused SMS', async () => {
    // Requested SMS, server enforced it away (no valid number): the enforced
    // matrix comes back without SMS, and the page must say so.
    setConsentByToken.mockResolvedValue({
      publicId: 'p1',
      email: 'a@b.dk',
      matrix: { ...EMPTY, madEmail: true },
      phone: null,
    })
    const fd = new FormData()
    fd.set('action', 'preferences')
    fd.append('consent', 'mad_email')
    fd.append('consent', 'mad_sms')
    const res = await POST(post(fd))
    const html = await res.text()
    expect(html).toContain(PREF_SMS_NOT_SAVED)
  })

  it('omits the notice when no SMS was requested', async () => {
    setConsentByToken.mockResolvedValue({
      publicId: 'p1',
      email: 'a@b.dk',
      matrix: { ...EMPTY, madEmail: true },
      phone: null,
    })
    const fd = new FormData()
    fd.set('action', 'preferences')
    fd.append('consent', 'mad_email')
    const res = await POST(post(fd))
    expect(await res.text()).not.toContain(PREF_SMS_NOT_SAVED)
  })
})

describe('the audit event records the ENFORCED state', () => {
  it('writes consent_event from what setConsentByToken stored, not the raw form', async () => {
    setConsentByToken.mockResolvedValue({
      publicId: 'p1',
      email: 'a@b.dk',
      // Server refused SMS; only the email flag survived.
      matrix: { ...EMPTY, madEmail: true },
      phone: null,
    })
    const fd = new FormData()
    fd.set('action', 'preferences')
    fd.append('consent', 'mad_email')
    fd.append('consent', 'mad_sms')
    await POST(post(fd))
    const event = recordConsentEvent.mock.calls[0][0] as { matrix: typeof EMPTY; mad: boolean; group: boolean }
    expect(event.matrix.madSms).toBe(false)
    expect(event.matrix.madEmail).toBe(true)
    expect(event.mad).toBe(true)
    expect(event.group).toBe(false)
  })
})
