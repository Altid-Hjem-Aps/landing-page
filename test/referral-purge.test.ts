import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const purgeEnergiReferralEvents = vi.fn()
vi.mock('@/lib/db', () => ({ purgeEnergiReferralEvents: (...a: unknown[]) => purgeEnergiReferralEvents(...a) }))

const { GET, REFERRAL_EVENT_RETENTION_DAYS } = await import('@/app/api/cron/referral-purge/route')

function get(auth?: string) {
  return GET(new NextRequest('https://altidhjem.dk/api/cron/referral-purge', { headers: auth ? { authorization: auth } : {} }))
}

beforeEach(() => {
  purgeEnergiReferralEvents.mockReset().mockResolvedValue(3)
  process.env.CRON_SECRET = 'cron-secret'
})

describe('GET /api/cron/referral-purge', () => {
  it('rejects calls without the cron secret', async () => {
    expect((await get()).status).toBe(401)
    expect((await get('Bearer wrong')).status).toBe(401)
    expect(purgeEnergiReferralEvents).not.toHaveBeenCalled()
  })

  it('purges 90 days back and reports the count', async () => {
    const res = await get('Bearer cron-secret')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true, deleted: 3, retentionDays: 90 })
    expect(REFERRAL_EVENT_RETENTION_DAYS).toBe(90)
    expect(purgeEnergiReferralEvents).toHaveBeenCalledWith(90)
  })

  it('500s (and logs) when the purge fails', async () => {
    purgeEnergiReferralEvents.mockRejectedValueOnce(new Error('db down'))
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await get('Bearer cron-secret')
    expect(res.status).toBe(500)
    spy.mockRestore()
  })
})
