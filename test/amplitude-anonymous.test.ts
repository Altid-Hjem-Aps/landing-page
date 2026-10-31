import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// analytics-node is the boundary. The helper must give every event its own
// random device id (Amplitude drops an event with no user and no device), use
// a client of its own (never a batch shared with other routes), only resolve
// once Amplitude has accepted the event, and give up when it does not answer.
const calls: Array<{ event: string; props: unknown; options: Record<string, unknown> }> = []
let answer: Promise<{ code: number; message: string }>
const flush = vi.fn(() => ({ promise: Promise.resolve() }))
const init = vi.fn(() => ({ promise: Promise.resolve() }))
const sharedTrack = vi.fn()
let instances = 0
vi.mock('@amplitude/analytics-node', () => ({
  init: vi.fn(),
  track: (...args: unknown[]) => sharedTrack(...args),
  flush: vi.fn(),
  identify: vi.fn(),
  Identify: class {},
  createInstance: () => (instances++, {
    init,
    track: (event: string, props: unknown, options: Record<string, unknown>) => {
      calls.push({ event, props, options })
      return { promise: answer }
    },
    flush,
  }),
}))

const { trackAnonymousServer, ANONYMOUS_SEND_TIMEOUT_MS } = await import('@/lib/amplitude.server')

beforeEach(() => {
  calls.length = 0
  flush.mockClear()
  sharedTrack.mockClear()
  answer = Promise.resolve({ code: 200, message: 'Event tracked successfully' })
  vi.stubEnv('NEXT_PUBLIC_AMPLITUDE_API_KEY', 'test-key')
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.useRealTimers()
})

describe('trackAnonymousServer', () => {
  it('sends each event on its own client under its own random device id and no user id, then flushes', async () => {
    await trackAnonymousServer('Launch Mail Link Clicked', { mail: 'a1a' })
    await trackAnonymousServer('Launch Mail Link Clicked', { mail: 'a1a' })
    expect(calls).toHaveLength(2)
    const [first, second] = calls.map((call) => call.options)
    expect(first.device_id).toMatch(/^[0-9a-f-]{36}$/)
    expect(second.device_id).not.toBe(first.device_id)
    expect(first.user_id).toBeUndefined()
    expect(flush).toHaveBeenCalledTimes(2)
    expect(sharedTrack).not.toHaveBeenCalled()
    expect(init).toHaveBeenCalledTimes(1)
  })

  it('rejects when Amplitude refuses the event', async () => {
    answer = Promise.resolve({ code: 400, message: 'Invalid event' })
    await expect(trackAnonymousServer('Launch Mail Link Clicked', {})).rejects.toThrow('Amplitude answered 400: Invalid event')
  })

  it('gives up when Amplitude does not answer', async () => {
    vi.useFakeTimers()
    answer = new Promise(() => {})
    const sent = trackAnonymousServer('Launch Mail Link Clicked', {})
    const settled = expect(sent).rejects.toThrow(`Amplitude did not answer within ${ANONYMOUS_SEND_TIMEOUT_MS} ms`)
    await vi.advanceTimersByTimeAsync(ANONYMOUS_SEND_TIMEOUT_MS)
    await settled
    // The next tap does not queue behind the stalled request.
    const before = instances
    answer = Promise.resolve({ code: 200, message: 'Event tracked successfully' })
    await trackAnonymousServer('Launch Mail Link Clicked', {})
    expect(instances).toBe(before + 1)
  })

  it('rejects without an API key instead of sending nowhere', async () => {
    vi.stubEnv('NEXT_PUBLIC_AMPLITUDE_API_KEY', '')
    await expect(trackAnonymousServer('Launch Mail Link Clicked', {})).rejects.toThrow('NEXT_PUBLIC_AMPLITUDE_API_KEY is not set')
    expect(calls).toHaveLength(0)
  })
})
