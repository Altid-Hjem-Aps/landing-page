import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// analytics-node is the boundary. The helper must give every event its own
// random device id (Amplitude drops an event with no user and no device), and
// must only resolve once Amplitude has accepted the event.
const calls: Array<{ event: string; props: unknown; options: Record<string, unknown> }> = []
let answer: { code: number; message: string } = { code: 200, message: 'Event tracked successfully' }
const flush = vi.fn(() => ({ promise: Promise.resolve() }))
vi.mock('@amplitude/analytics-node', () => ({
  init: vi.fn(),
  track: (event: string, props: unknown, options: Record<string, unknown>) => {
    calls.push({ event, props, options })
    return { promise: Promise.resolve(answer) }
  },
  flush: () => flush(),
  identify: vi.fn(),
  Identify: class {},
}))

const { trackAnonymousServer } = await import('@/lib/amplitude.server')

beforeEach(() => {
  calls.length = 0
  flush.mockClear()
  answer = { code: 200, message: 'Event tracked successfully' }
  vi.stubEnv('NEXT_PUBLIC_AMPLITUDE_API_KEY', 'test-key')
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('trackAnonymousServer', () => {
  it('sends each event under its own random device id and no user id, then flushes', async () => {
    await trackAnonymousServer('Launch Mail Link Clicked', { mail: 'a1a' })
    await trackAnonymousServer('Launch Mail Link Clicked', { mail: 'a1a' })
    expect(calls).toHaveLength(2)
    const [first, second] = calls.map((call) => call.options)
    expect(first.device_id).toMatch(/^[0-9a-f-]{36}$/)
    expect(second.device_id).not.toBe(first.device_id)
    expect(first.user_id).toBeUndefined()
    expect(flush).toHaveBeenCalledTimes(2)
  })

  it('rejects when Amplitude refuses the event', async () => {
    answer = { code: 400, message: 'Invalid event' }
    await expect(trackAnonymousServer('Launch Mail Link Clicked', {})).rejects.toThrow('Amplitude answered 400: Invalid event')
  })

  it('rejects without an API key instead of sending nowhere', async () => {
    vi.stubEnv('NEXT_PUBLIC_AMPLITUDE_API_KEY', '')
    await expect(trackAnonymousServer('Launch Mail Link Clicked', {})).rejects.toThrow('NEXT_PUBLIC_AMPLITUDE_API_KEY is not set')
    expect(calls).toHaveLength(0)
  })
})
