import { describe, it, expect, vi, beforeEach } from 'vitest'

// The rules under test are the ones where a bug means marketing without consent,
// or a consent silently dropped. They are all enforced in setConsentByToken,
// server-side, because the browser is not a security boundary.

const updateSpy = vi.fn()
const insertSpy = vi.fn()

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: (table: string) => ({
      update: (patch: Record<string, unknown>) => {
        updateSpy(patch)
        return {
          eq: () => ({
            select: () => Promise.resolve({ data: [{ public_id: 'p1', email: 'a@b.dk' }], error: null }),
          }),
        }
      },
      insert: (row: Record<string, unknown>) => {
        insertSpy(table, row)
        return Promise.resolve({ error: null })
      },
      select: () => ({
        eq: () => ({ maybeSingle: () => Promise.resolve({ data: null, error: null }) }),
      }),
    }),
  }),
}))

process.env.SUPABASE_URL = 'https://example.supabase.co'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key'

const { setConsentByToken, unsubscribeAllByToken, EMPTY_CONSENT } = await import('@/lib/db')

const ALL_ON = {
  hjemEmail: true,
  hjemSms: true,
  madEmail: true,
  madSms: true,
  forsikringEmail: true,
  forsikringSms: true,
  mobilEmail: true,
  mobilSms: true,
}

beforeEach(() => {
  updateSpy.mockClear()
  insertSpy.mockClear()
})

describe('setConsentByToken — SMS requires a real number', () => {
  it('drops every SMS flag when no phone is supplied', async () => {
    await setConsentByToken('tok', { version: 'v1', matrix: ALL_ON, phone: null })
    const patch = updateSpy.mock.calls[0][0]
    expect(patch.consent_hjem_sms).toBe(false)
    expect(patch.consent_mad_sms).toBe(false)
    expect(patch.consent_forsikring_sms).toBe(false)
    expect(patch.consent_mobil_sms).toBe(false)
    // Email is untouched — the channels are independent.
    expect(patch.consent_mad_email).toBe(true)
    expect(patch.consent_hjem_email).toBe(true)
  })

  it('drops SMS when the phone is the 00000000 sentinel', async () => {
    await setConsentByToken('tok', { version: 'v1', matrix: ALL_ON, phone: '00000000' })
    const patch = updateSpy.mock.calls[0][0]
    expect(patch.consent_mad_sms).toBe(false)
    expect(patch.phone).toBeNull()
  })

  it('drops SMS when the phone is malformed', async () => {
    await setConsentByToken('tok', { version: 'v1', matrix: ALL_ON, phone: '123' })
    const patch = updateSpy.mock.calls[0][0]
    expect(patch.consent_mad_sms).toBe(false)
    expect(patch.phone).toBeNull()
  })

  it('keeps SMS when a real number is supplied', async () => {
    await setConsentByToken('tok', { version: 'v1', matrix: ALL_ON, phone: '30 48 92 97' })
    const patch = updateSpy.mock.calls[0][0]
    expect(patch.consent_mad_sms).toBe(true)
    expect(patch.phone).toBe('30489297')
  })
})

describe('setConsentByToken — the number never outlives the consent', () => {
  it('does not store a number when no SMS box is ticked', async () => {
    await setConsentByToken('tok', {
      version: 'v1',
      matrix: { ...EMPTY_CONSENT, madEmail: true },
      phone: '30489297',
    })
    const patch = updateSpy.mock.calls[0][0]
    // A number with no SMS consent has no disclosed purpose (art. 5(1)(c)).
    expect(patch.phone).toBeNull()
    expect(patch.consent_mad_email).toBe(true)
  })
})

describe('setConsentByToken — legacy flags stay conservative', () => {
  it('marketing_consent_group is true only when ALL three brands are true', async () => {
    await setConsentByToken('tok', {
      version: 'v1',
      matrix: { ...EMPTY_CONSENT, hjemEmail: true },
      phone: null,
    })
    // Only Hjem ticked: a legacy send-gate reading marketing_consent_group must
    // NOT mail this person about Forsikring or Mobil.
    expect(updateSpy.mock.calls[0][0].marketing_consent_group).toBe(false)
  })

  it('marketing_consent_group stays false when two of three are ticked', async () => {
    // Regression guard: an implementation that dropped one operand (e.g.
    // hjemEmail && forsikringEmail) would pass the one-ticked and all-three
    // tests, yet mail someone about Altid Mobil who never consented to it.
    await setConsentByToken('tok', {
      version: 'v1',
      matrix: { ...EMPTY_CONSENT, hjemEmail: true, forsikringEmail: true },
      phone: null,
    })
    expect(updateSpy.mock.calls[0][0].marketing_consent_group).toBe(false)
  })

  it('marketing_consent_group is true when all three are true', async () => {
    await setConsentByToken('tok', {
      version: 'v1',
      matrix: { ...EMPTY_CONSENT, hjemEmail: true, forsikringEmail: true, mobilEmail: true },
      phone: null,
    })
    expect(updateSpy.mock.calls[0][0].marketing_consent_group).toBe(true)
  })

  it('marketing_consent_mad tracks the Mad email flag', async () => {
    await setConsentByToken('tok', {
      version: 'v1',
      matrix: { ...EMPTY_CONSENT, madEmail: true },
      phone: null,
    })
    expect(updateSpy.mock.calls[0][0].marketing_consent_mad).toBe(true)
  })
})

describe('setConsentByToken — EMPTY_CONSENT clears everything', () => {
  it('unsubscribe-all leaves no channel open and no number behind', async () => {
    await setConsentByToken('tok', { version: 'v1', matrix: EMPTY_CONSENT, phone: null })
    const patch = updateSpy.mock.calls[0][0]
    // Every consent BOOLEAN must be false. consent_version / consent_at are
    // metadata about the change, not consents, so they are excluded by type.
    const flags = Object.entries(patch).filter(([, v]) => typeof v === 'boolean')
    expect(flags.length).toBeGreaterThan(0)
    for (const [k, v] of flags) {
      expect(v, `${k} should be false after unsubscribe-all`).toBe(false)
    }
    expect(patch.phone).toBeNull()
  })
})

describe('setConsentByToken — returns what was ENFORCED, not what was asked', () => {
  // Regression: the caller writes consent_event from this return value, and
  // consent_event is the evidence for "did you hold this consent when you sent
  // that mail?". Returning only the ids let the route log its own unsanitised
  // input, so the audit trail could claim an SMS consent the row had refused.
  it('returns SMS false when the phone was rejected, matching what was stored', async () => {
    const saved = await setConsentByToken('tok', { version: 'v1', matrix: ALL_ON, phone: '+4512345678' })
    expect(saved).not.toBeNull()
    expect(saved!.matrix.madSms).toBe(false)
    expect(saved!.matrix.hjemSms).toBe(false)
    expect(saved!.phone).toBeNull()
    // The returned matrix must equal what actually went into the row.
    const patch = updateSpy.mock.calls[0][0]
    expect(saved!.matrix.madSms).toBe(patch.consent_mad_sms)
    expect(saved!.matrix.madEmail).toBe(patch.consent_mad_email)
    expect(saved!.phone).toBe(patch.phone)
  })

  it('returns SMS true when the phone is valid', async () => {
    const saved = await setConsentByToken('tok', { version: 'v1', matrix: ALL_ON, phone: '30489297' })
    expect(saved!.matrix.madSms).toBe(true)
    expect(saved!.phone).toBe('30489297')
  })
})

describe('setConsentByToken — a save ends an unsubscribed state atomically', () => {
  it('writes unsubscribed=false in the SAME update as the consents', async () => {
    // Regression: with unsubscribed untouched, a preference save racing an
    // unsubscribe (two tabs) could leave "unsubscribed AND consented" at once —
    // and whichever of the two a send-gate reads would decide the mail. Writing
    // it in the same UPDATE means whichever write lands last is coherent.
    await setConsentByToken('tok', { version: 'v1', matrix: ALL_ON, phone: '30489297' })
    const patch = updateSpy.mock.calls[0][0]
    expect(patch.unsubscribed).toBe(false)
    expect(patch.unsubscribed_at).toBeNull()
  })
})

describe('unsubscribeAllByToken — one atomic UPDATE, everything off', () => {
  it('clears every consent boolean, the phone, and sets unsubscribed in one patch', async () => {
    await unsubscribeAllByToken('tok', 'v1')
    expect(updateSpy).toHaveBeenCalledTimes(1)
    const patch = updateSpy.mock.calls[0][0]
    // Every consent column false, SMS included: "alt" has to mean alt.
    for (const k of Object.keys(patch).filter((k) => k.startsWith('consent_') && typeof patch[k] === 'boolean')) {
      expect(patch[k], `${k} must be false`).toBe(false)
    }
    expect(patch.marketing_consent_mad).toBe(false)
    expect(patch.marketing_consent_group).toBe(false)
    expect(patch.phone).toBeNull()
    expect(patch.unsubscribed).toBe(true)
    expect(typeof patch.unsubscribed_at).toBe('string')
  })

  it('returns null for a blank token without touching the database', async () => {
    expect(await unsubscribeAllByToken('  ', 'v1')).toBeNull()
    expect(updateSpy).not.toHaveBeenCalled()
  })
})

describe('setConsentByToken — idempotence', () => {
  it('the same state submitted twice produces the same patch', async () => {
    const args = { version: 'v1', matrix: ALL_ON, phone: '30489297' } as const
    await setConsentByToken('tok', args)
    await setConsentByToken('tok', args)
    const a = { ...updateSpy.mock.calls[0][0] }
    const b = { ...updateSpy.mock.calls[1][0] }
    // consent_at is a timestamp and is expected to move; nothing else may.
    delete a.consent_at
    delete b.consent_at
    expect(a).toEqual(b)
  })
})
