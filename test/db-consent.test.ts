import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// mirrorSignup is the consent-store on the signup path: the form sends a
// documented marketing consent, the route forwards it, and this is where it is
// written to Supabase. These tests pin (1) that the consent fields land in the
// upserted row and (2) that a not-yet-migrated column can never break a signup.

const upsertedRows: Record<string, unknown>[] = []
let results: Array<{ data: unknown; error: unknown }> = []
// Capture .update() patches (mergeConsent) + the email they filter on.
const updatePatches: Array<{ patch: Record<string, unknown>; id: unknown }> = []
let updateResults: Array<{ error: unknown }> = []

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      upsert: (row: Record<string, unknown>) => {
        upsertedRows.push(row)
        return {
          select: () => ({
            maybeSingle: () => Promise.resolve(results.shift() ?? { data: null, error: null }),
          }),
        }
      },
      update: (patch: Record<string, unknown>) => ({
        eq: (_col: string, id: unknown) => ({
          select: () => {
            updatePatches.push({ patch, id })
            return Promise.resolve(updateResults.shift() ?? { data: [{ public_id: 'x' }], error: null })
          },
        }),
      }),
    }),
  }),
}))

// getClient() throws without these — set before the module under test loads.
process.env.SUPABASE_URL = 'https://example.supabase.co'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-test-key'

import { mirrorSignup, mergeConsent } from '@/lib/db'

// The Hjem form is a single combined opt-in, so mad and group arrive equal.
const CONSENT = { version: '2026-07-13', mad: true, group: true }

describe('mirrorSignup consent storage', () => {
  beforeEach(() => {
    upsertedRows.length = 0
    results = []
  })
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('writes the documented consent fields into the row', async () => {
    results = [{ data: { unsub_token: 'tok' }, error: null }]

    const token = await mirrorSignup('pub-1', {
      email: 'A@Example.com',
      firstName: 'Ann',
      source: 'organic',
      consent: CONSENT,
    })

    expect(token).toBe('tok')
    const row = upsertedRows[0]
    expect(row.marketing_consent_mad).toBe(true)
    expect(row.marketing_consent_group).toBe(true)
    expect(row.consent_version).toBe('2026-07-13')
    expect(row.consent_at).toBe(row.created_at)
  })

  it('subdivides the combined yes into per-brand EMAIL flags, and never writes SMS', async () => {
    results = [{ data: { unsub_token: 't' }, error: null }]

    await mirrorSignup('pub-brand', { email: 'b@x.dk', consent: CONSENT })

    const row = upsertedRows[0]
    // One tick under SIGNUP_CONSENT_ALL names all four brands — for EMAIL.
    expect(row.consent_mad_email).toBe(true)
    expect(row.consent_hjem_email).toBe(true)
    expect(row.consent_forsikring_email).toBe(true)
    expect(row.consent_mobil_email).toBe(true)
    // No SMS key may ever appear here, at any value: the signup form has no SMS
    // box, and an email consent must never imply an SMS one.
    expect(Object.keys(row).some((k) => k.endsWith('_sms'))).toBe(false)
  })

  it('stores a whitespace-stripped phone and drops the 00000000 sentinel', async () => {
    results = [
      { data: { unsub_token: 't' }, error: null },
      { data: { unsub_token: 't' }, error: null },
    ]

    await mirrorSignup('pub-p1', { email: 'p1@x.dk', phone: '30 48 92 97' })
    await mirrorSignup('pub-p2', { email: 'p2@x.dk', phone: '00000000' })

    expect(upsertedRows[0].phone).toBe('30489297')
    // The sentinel is a bridge value for the upstream API, not a number: storing
    // it would show the person a fake number as if it were theirs.
    expect('phone' in upsertedRows[1]).toBe(false)
  })

  it('records an unticked combined box as no consent on either flag', async () => {
    results = [{ data: { unsub_token: 't' }, error: null }]

    await mirrorSignup('pub-2', { consent: { version: 'v', mad: false, group: false } })

    const row = upsertedRows[0]
    expect(row.marketing_consent_mad).toBe(false)
    expect(row.marketing_consent_group).toBe(false)
  })

  it('omits consent fields entirely when no consent is passed', async () => {
    results = [{ data: { unsub_token: 't' }, error: null }]

    await mirrorSignup('pub-3', { email: 'b@x.dk' })

    const row = upsertedRows[0]
    expect('marketing_consent_mad' in row).toBe(false)
    expect('consent_at' in row).toBe(false)
  })

  it('strips a not-yet-migrated consent column and retries so the signup survives', async () => {
    results = [
      { data: null, error: { code: 'PGRST204', message: "Could not find the 'consent_version' column of 'signup' in the schema cache" } },
      { data: { unsub_token: 'tok-after-retry' }, error: null },
    ]

    const token = await mirrorSignup('pub-4', { consent: CONSENT })

    expect(token).toBe('tok-after-retry')
    expect(upsertedRows).toHaveLength(2)
    expect('consent_version' in upsertedRows[1]).toBe(false)
    expect(upsertedRows[1].marketing_consent_mad).toBe(true)
  })

  it('retries a transient error, then rethrows if it never recovers', async () => {
    // A statement timeout (57014) is transient, so mirrorSignup retries it rather
    // than dropping the consent record on the first blip. If every attempt fails,
    // it still surfaces the error.
    results = Array(4).fill({ data: null, error: { code: '57014', message: 'canceling statement due to statement timeout' } })

    await expect(mirrorSignup('pub-5', { consent: CONSENT })).rejects.toThrow(/timeout/)
    expect(upsertedRows).toHaveLength(4) // initial + 3 retries
  })

  it('recovers when a transient error clears on retry (consent not lost)', async () => {
    results = [
      { data: null, error: { code: '57014', message: 'statement timeout' } },
      { data: { unsub_token: 'tok' }, error: null },
    ]
    const token = await mirrorSignup('pub-6', { consent: CONSENT })
    expect(token).toBe('tok')
    expect(upsertedRows).toHaveLength(2) // failed once, then succeeded on retry
  })
})

describe('mergeConsent (409 re-signup path)', () => {
  beforeEach(() => {
    updatePatches.length = 0
    updateResults = []
  })
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('flags newly-consented brands on the existing row (by email) without downgrading', async () => {
    updateResults = [{ data: [{ public_id: 'p1' }], error: null }]
    await mergeConsent('A@Example.com', { version: '2026-07-13', mad: true, group: true })

    expect(updatePatches).toHaveLength(1)
    const { patch, id } = updatePatches[0]
    expect(id).toBe('a@example.com') // lower-cased, keyed on email
    expect(patch.marketing_consent_mad).toBe(true)
    expect(patch.marketing_consent_group).toBe(true)
    expect(patch.consent_version).toBe('2026-07-13')
    expect(typeof patch.consent_at).toBe('string')
  })

  it('only writes the true flags — never sets a flag to false', async () => {
    updateResults = [{ data: [{ public_id: 'p1' }], error: null }]
    await mergeConsent('b@x.dk', { version: 'v', mad: false, group: true })

    const { patch } = updatePatches[0]
    expect('marketing_consent_mad' in patch).toBe(false) // false is not written (no downgrade)
    expect(patch.marketing_consent_group).toBe(true)
  })

  it('writes the per-brand EMAIL subdivision alongside each legacy flag', async () => {
    // Regression (review 31/7): without this, every consent confirmed via
    // /bekraeft after the one-time migration backfill was invisible to the
    // matrix model — the preference centre showed the person all-unticked
    // minutes after they confirmed.
    updateResults = [{ data: [{ public_id: 'p1' }], error: null }]
    await mergeConsent('b@x.dk', { version: 'v', mad: true, group: true })

    const { patch } = updatePatches[0]
    expect(patch.consent_mad_email).toBe(true)
    expect(patch.consent_hjem_email).toBe(true)
    expect(patch.consent_forsikring_email).toBe(true)
    expect(patch.consent_mobil_email).toBe(true)
    // Never SMS: no double-opt-in wording has ever mentioned SMS.
    expect(Object.keys(patch).some((k) => k.endsWith('_sms'))).toBe(false)
  })

  it('group-only consent writes the three group brands but not Mad', async () => {
    updateResults = [{ data: [{ public_id: 'p1' }], error: null }]
    await mergeConsent('b@x.dk', { version: 'v', mad: false, group: true })

    const { patch } = updatePatches[0]
    expect('consent_mad_email' in patch).toBe(false)
    expect(patch.consent_hjem_email).toBe(true)
  })

  it('is a no-op when nothing is affirmatively consented', async () => {
    await mergeConsent('c@x.dk', { version: 'v', mad: false, group: false })
    expect(updatePatches).toHaveLength(0)
  })

  it('is a no-op when no consent object is passed', async () => {
    await mergeConsent('d@x.dk', undefined)
    expect(updatePatches).toHaveLength(0)
  })

  it('strips a not-yet-migrated column and retries', async () => {
    updateResults = [
      { data: null, error: { code: 'PGRST204', message: "Could not find the 'consent_version' column of 'signup' in the schema cache" } },
      { data: [{ public_id: 'p1' }], error: null },
    ]
    await mergeConsent('e@x.dk', { version: '2026-07-13', mad: true, group: false })

    expect(updatePatches).toHaveLength(2)
    expect('consent_version' in updatePatches[1].patch).toBe(false)
    expect(updatePatches[1].patch.marketing_consent_mad).toBe(true)
  })

  it('rethrows a non-column error', async () => {
    updateResults = [{ data: null, error: { code: '57014', message: 'canceling statement due to statement timeout' } }]
    await expect(mergeConsent('f@x.dk', { mad: true })).rejects.toThrow(/timeout/)
  })

  it('warns (does not throw) when no signup row matches the email', async () => {
    // Person is in the upstream waitlist (409) but not mirrored into Supabase.
    updateResults = [{ data: [], error: null }]
    const warn = vi.spyOn(console, 'error').mockImplementation(() => {})
    await mergeConsent('missing@x.dk', { mad: true, group: true })
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/no Supabase signup row matched/))
    warn.mockRestore()
  })
})
