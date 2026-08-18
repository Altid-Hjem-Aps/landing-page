import { describe, expect, it, vi, beforeEach } from 'vitest'

// recordEnergiReferralEvent is the only writer to energi_referral_event. Pin
// the column mapping and the truncations, and that a Supabase error surfaces
// as a thrown Error (the routes decide what to do with it).

const inserted: Array<{ table: string; row: Record<string, unknown> }> = []
let insertResult: { error: null | { message: string } } = { error: null }

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: (table: string) => ({
      insert: (row: Record<string, unknown>) => {
        inserted.push({ table, row })
        return Promise.resolve(insertResult)
      },
    }),
  }),
}))

process.env.SUPABASE_URL = 'https://example.supabase.co'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key'

const { recordEnergiReferralEvent } = await import('@/lib/db')

beforeEach(() => {
  inserted.length = 0
  insertResult = { error: null }
})

describe('recordEnergiReferralEvent', () => {
  it('maps to the energi_referral_event columns and truncates free-text fields', async () => {
    await recordEnergiReferralEvent({
      code: 'X'.repeat(40),
      kind: 'click',
      valid: false,
      ipHash: 'h',
      ua: 'U'.repeat(300),
      country: 'DENMARK-XX',
    })
    expect(inserted).toHaveLength(1)
    expect(inserted[0].table).toBe('energi_referral_event')
    expect(inserted[0].row).toEqual({
      code: 'X'.repeat(32),
      kind: 'click',
      valid: false,
      ip_hash: 'h',
      ua: 'U'.repeat(256),
      country: 'DENMARK-',
    })
  })

  it('stores nulls as nulls', async () => {
    await recordEnergiReferralEvent({ code: 'A', kind: 'share', valid: true, ipHash: null, ua: null, country: null })
    expect(inserted[0].row).toEqual({ code: 'A', kind: 'share', valid: true, ip_hash: null, ua: null, country: null })
  })

  it('throws when Supabase reports an error', async () => {
    insertResult = { error: { message: 'boom' } }
    await expect(
      recordEnergiReferralEvent({ code: 'A', kind: 'copy', valid: true, ipHash: null, ua: null, country: null }),
    ).rejects.toThrow('boom')
  })
})
