import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const analytics = vi.hoisted(() => ({ startAnalytics: vi.fn() }))
const consent = vi.hoisted(() => ({ readCookieChoice: vi.fn() }))

vi.mock('@/lib/analytics', () => analytics)
vi.mock('@/lib/cookie-consent', () => consent)

beforeEach(() => {
  vi.resetModules()
  analytics.startAnalytics.mockReset()
  consent.readCookieChoice.mockReset().mockReturnValue('all')
  delete window.__altiPartnerInviteFallback
})

afterEach(() => {
  window.history.replaceState(null, '', '/')
  delete window.__altiPartnerInviteFallback
  vi.clearAllMocks()
})

describe('partner invitation token privacy', () => {
  it('removes the fragment before initializing analytics and keeps the waitlist query', async () => {
    let urlAtAnalyticsStart = ''
    analytics.startAnalytics.mockImplementation(() => {
      urlAtAnalyticsStart = window.location.href
    })
    window.history.replaceState(null, '', '/inviter?ref=waitlist-ref#private-invite-token')

    await import('@/instrumentation-client')

    expect(analytics.startAnalytics).toHaveBeenCalledOnce()
    expect(urlAtAnalyticsStart).toBe(`${window.location.origin}/inviter?ref=waitlist-ref`)
    expect(urlAtAnalyticsStart).not.toContain('private-invite-token')
    expect(window.location.hash).toBe('')
    expect(window.__altiPartnerInviteFallback).toBe(true)
  })

  it('leaves unrelated page fragments alone', async () => {
    let urlAtAnalyticsStart = ''
    analytics.startAnalytics.mockImplementation(() => {
      urlAtAnalyticsStart = window.location.href
    })
    window.history.replaceState(null, '', '/faq#questions')

    await import('@/instrumentation-client')

    expect(urlAtAnalyticsStart).toBe(`${window.location.origin}/faq#questions`)
    expect(window.location.hash).toBe('#questions')
    expect(window.__altiPartnerInviteFallback).toBeUndefined()
  })
})
