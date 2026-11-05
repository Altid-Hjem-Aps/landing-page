import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const sdk = vi.hoisted(() => ({ init: vi.fn(), setOptOut: vi.fn() }))
vi.mock('@amplitude/analytics-browser', () => sdk)

beforeEach(() => {
  vi.resetModules()
  sdk.init.mockClear()
  sdk.setOptOut.mockClear()
  vi.stubEnv('NEXT_PUBLIC_AMPLITUDE_API_KEY', 'test-key')
  window.localStorage.setItem('ah-cookie-consent', JSON.stringify({ choice: 'all', at: Date.now() }))
})
afterEach(() => {
  vi.unstubAllEnvs()
  window.localStorage.clear()
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim()
    if (name) document.cookie = `${name}=; Max-Age=0; Path=/`
  })
})

describe('analytics loader', () => {
  it('initialises Amplitude once, against the EU endpoint', async () => {
    const { startAnalytics } = await import('@/lib/analytics')
    startAnalytics()
    startAnalytics()
    await vi.waitFor(() => expect(sdk.init).toHaveBeenCalled())
    expect(sdk.init).toHaveBeenCalledTimes(1)
    expect(sdk.init.mock.calls[0][0]).toBe('test-key')
    expect(sdk.init.mock.calls[0][1].serverUrl).toBe('https://api.eu.amplitude.com/2/httpapi')
  })

  it('does nothing without an API key', async () => {
    vi.stubEnv('NEXT_PUBLIC_AMPLITUDE_API_KEY', '')
    const { startAnalytics } = await import('@/lib/analytics')
    startAnalytics()
    await vi.dynamicImportSettled()
    expect(sdk.init).not.toHaveBeenCalled()
  })

  it('does not initialise when the visitor withdraws while the SDK is loading', async () => {
    const { startAnalytics, stopAnalytics } = await import('@/lib/analytics')
    startAnalytics()
    stopAnalytics()
    await vi.dynamicImportSettled()
    expect(sdk.init).not.toHaveBeenCalled()
    expect(sdk.setOptOut).not.toHaveBeenCalled()
  })

  it('does not initialise when another tab withdrew while the SDK was loading', async () => {
    const { startAnalytics } = await import('@/lib/analytics')
    startAnalytics()
    window.localStorage.setItem('ah-cookie-consent', JSON.stringify({ choice: 'necessary', at: Date.now() }))
    await vi.dynamicImportSettled()
    expect(sdk.init).not.toHaveBeenCalled()
  })

  it('initialises once when consent is withdrawn and given again while the SDK is loading', async () => {
    const { startAnalytics, stopAnalytics } = await import('@/lib/analytics')
    startAnalytics()
    stopAnalytics()
    startAnalytics()
    await vi.waitFor(() => expect(sdk.init).toHaveBeenCalled())
    expect(sdk.init).toHaveBeenCalledTimes(1)
    expect(sdk.setOptOut).not.toHaveBeenCalled()
  })

  it('stopping opts out and removes Amplitude cookies and storage, leaving the rest', async () => {
    const { startAnalytics, stopAnalytics } = await import('@/lib/analytics')
    startAnalytics()
    await vi.waitFor(() => expect(sdk.init).toHaveBeenCalled())
    // The real SDK writes its identifiers back when it opts out.
    sdk.setOptOut.mockImplementationOnce(() => {
      document.cookie = 'AMP_abc123=device; Path=/'
    })
    document.cookie = 'AMP_abc123=device; Path=/'
    document.cookie = 'AMP_MKTG_abc123=utm; Path=/'
    document.cookie = 'am_confirm=keep; Path=/'
    window.localStorage.setItem('AMP_unsent_abc123', '[]')
    window.localStorage.setItem('ah-cookie-consent', 'keep')
    stopAnalytics()
    await vi.waitFor(() => expect(sdk.setOptOut).toHaveBeenCalledWith(true))
    expect(document.cookie).not.toContain('AMP_')
    expect(document.cookie).toContain('am_confirm=keep')
    expect(window.localStorage.getItem('AMP_unsent_abc123')).toBeNull()
    expect(window.localStorage.getItem('ah-cookie-consent')).toBe('keep')
  })

  it('stopping without a started SDK still cleans up and never opts in', async () => {
    const { stopAnalytics } = await import('@/lib/analytics')
    document.cookie = 'AMP_abc123=device; Path=/'
    stopAnalytics()
    await vi.dynamicImportSettled()
    expect(sdk.setOptOut).not.toHaveBeenCalled()
    expect(document.cookie).not.toContain('AMP_')
  })
})
