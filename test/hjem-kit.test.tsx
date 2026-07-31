import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render } from '@testing-library/react'
import { mockupEntranceStyle, staggerDelay, usePhaseLoop } from '@/components/seo/hjemKit'

const SEQ = [
  { p: 'one', ms: 1000 },
  { p: 'two', ms: 1000 },
  { p: 'three', ms: 5000 },
] as const

/* Media stub that captures the change handler so tests can flip
 * prefers-reduced-motion mid-flight. */
let mediaHandler: (() => void) | null = null
let mediaMatches = false
function stubMedia(reduced: boolean) {
  mediaMatches = reduced
  mediaHandler = null
  window.matchMedia = vi.fn().mockImplementation(() => ({
    get matches() {
      return mediaMatches
    },
    addEventListener: (_: string, h: () => void) => {
      mediaHandler = h
    },
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia
}

/* IO stub that does NOT auto-fire: tests drive intersection explicitly,
 * mirroring the real API where the callback carries intersectionRatio. */
class IOStub {
  cb: (entries: { isIntersecting: boolean; intersectionRatio: number }[]) => void
  static latest: IOStub | null = null
  constructor(cb: IOStub['cb']) {
    this.cb = cb
    IOStub.latest = this
  }
  observe() {}
  disconnect() {}
  fire(isIntersecting: boolean, ratio: number) {
    this.cb([{ isIntersecting, intersectionRatio: ratio }])
  }
}

function setVisibility(state: 'visible' | 'hidden') {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state })
  document.dispatchEvent(new Event('visibilitychange'))
}

function LoopProbe() {
  const { ref, phase, at, running, reduced, entered } = usePhaseLoop(SEQ)
  return (
    <div
      ref={ref}
      data-testid="probe"
      data-phase={phase}
      data-running={String(running)}
      data-reduced={String(reduced)}
      data-entered={String(entered)}
      data-at-two={String(at('two'))}
    />
  )
}

function mountProbe() {
  const { getByTestId } = render(<LoopProbe />)
  return getByTestId('probe')
}

beforeEach(() => {
  vi.useFakeTimers()
  stubMedia(false)
  ;(globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = IOStub as unknown as typeof IntersectionObserver
})

afterEach(() => {
  cleanup()
  setVisibility('visible')
  vi.useRealTimers()
})

describe('staggerDelay', () => {
  it('steps 60ms per index', () => {
    expect(staggerDelay(0)).toBe('0ms')
    expect(staggerDelay(1)).toBe('60ms')
    expect(staggerDelay(2)).toBe('120ms')
  })

  it('returns 0ms when inactive (loop-wrap reset)', () => {
    expect(staggerDelay(2, false)).toBe('0ms')
  })

  it('clamps negative index and step to zero', () => {
    expect(staggerDelay(-1)).toBe('0ms')
    expect(staggerDelay(2, true, -60)).toBe('0ms')
  })

  it('honours a custom step', () => {
    expect(staggerDelay(2, true, 100)).toBe('200ms')
  })
})

describe('mockupEntranceStyle', () => {
  it('hides pre-entrance and reveals with the ease-out curve', () => {
    const before = mockupEntranceStyle(false, false)
    expect(before.opacity).toBe(0)
    expect(before.transform).toBe('translateY(12px)')
    expect(String(before.transition)).toContain('cubic-bezier(0.22, 1, 0.36, 1)')
    const after = mockupEntranceStyle(true, false)
    expect(after.opacity).toBe(1)
    expect(after.transform).toBe('translateY(0)')
  })

  it('renders the final state with no transition under reduced motion', () => {
    const style = mockupEntranceStyle(false, true)
    expect(style.opacity).toBe(1)
    expect(style.transition).toBe('none')
  })
})

describe('usePhaseLoop', () => {
  it('latches entered on any intersection but only runs at ≥30%', () => {
    const probe = mountProbe()
    expect(probe.dataset.entered).toBe('false')
    expect(probe.dataset.running).toBe('false')
    // 1px visible: the entrance latches (a card taller than the viewport may
    // never reach 30%) but the narrative loop stays paused
    act(() => IOStub.latest!.fire(true, 0.1))
    expect(probe.dataset.entered).toBe('true')
    expect(probe.dataset.running).toBe('false')
    act(() => IOStub.latest!.fire(true, 1))
    expect(probe.dataset.running).toBe('true')
    expect(probe.dataset.phase).toBe('one')
  })

  it('treats a ratio a float-rounding hair below the 0.3 threshold as visible', () => {
    const probe = mountProbe()
    act(() => IOStub.latest!.fire(true, 0.295))
    expect(probe.dataset.entered).toBe('true')
    expect(probe.dataset.running).toBe('true')
  })

  it('uses only the newest entry when a batch contains an enter+exit pair', () => {
    const probe = mountProbe()
    act(() =>
      IOStub.latest!.cb([
        { isIntersecting: true, intersectionRatio: 1 },
        { isIntersecting: false, intersectionRatio: 0 },
      ])
    )
    expect(probe.dataset.running).toBe('false')
    expect(probe.dataset.entered).toBe('true')
  })

  it('advances on its timings and wraps via modulo', () => {
    const probe = mountProbe()
    act(() => IOStub.latest!.fire(true, 1))
    act(() => vi.advanceTimersByTime(1000))
    expect(probe.dataset.phase).toBe('two')
    expect(probe.dataset.atTwo).toBe('true')
    act(() => vi.advanceTimersByTime(1000))
    expect(probe.dataset.phase).toBe('three')
    act(() => vi.advanceTimersByTime(5000))
    expect(probe.dataset.phase).toBe('one')
    expect(probe.dataset.atTwo).toBe('false')
  })

  it('pauses on exit but keeps entered latched, and resumes from the same phase', () => {
    const probe = mountProbe()
    act(() => IOStub.latest!.fire(true, 1))
    act(() => vi.advanceTimersByTime(1000))
    expect(probe.dataset.phase).toBe('two')
    act(() => IOStub.latest!.fire(false, 0))
    expect(probe.dataset.running).toBe('false')
    expect(probe.dataset.entered).toBe('true')
    // paused: time passing must not advance the phase
    act(() => vi.advanceTimersByTime(10000))
    expect(probe.dataset.phase).toBe('two')
    act(() => IOStub.latest!.fire(true, 1))
    expect(probe.dataset.running).toBe('true')
    expect(probe.dataset.phase).toBe('two')
    act(() => vi.advanceTimersByTime(1000))
    expect(probe.dataset.phase).toBe('three')
  })

  it('restarts the full hold time on resume, not the remaining time', () => {
    const probe = mountProbe()
    act(() => IOStub.latest!.fire(true, 1))
    act(() => vi.advanceTimersByTime(600))
    act(() => IOStub.latest!.fire(false, 0))
    act(() => IOStub.latest!.fire(true, 1))
    // documented semantics: the phase's FULL hold restarts on resume
    act(() => vi.advanceTimersByTime(600))
    expect(probe.dataset.phase).toBe('one')
    act(() => vi.advanceTimersByTime(400))
    expect(probe.dataset.phase).toBe('two')
  })

  it('falls back to the deprecated addListener media API (Safari <14)', () => {
    let legacyHandler: (() => void) | null = null
    const removeListener = vi.fn()
    window.matchMedia = vi.fn().mockImplementation(() => ({
      get matches() {
        return mediaMatches
      },
      addListener: (h: () => void) => {
        legacyHandler = h
      },
      removeListener,
    })) as unknown as typeof window.matchMedia
    const probe = mountProbe()
    act(() => IOStub.latest!.fire(true, 1))
    expect(probe.dataset.reduced).toBe('false')
    act(() => {
      mediaMatches = true
      legacyHandler?.()
    })
    expect(probe.dataset.reduced).toBe('true')
    expect(probe.dataset.phase).toBe('three')
    cleanup()
    expect(removeListener).toHaveBeenCalled()
  })

  it('pauses in a hidden tab and resumes on return', () => {
    const probe = mountProbe()
    act(() => IOStub.latest!.fire(true, 1))
    act(() => setVisibility('hidden'))
    expect(probe.dataset.running).toBe('false')
    act(() => vi.advanceTimersByTime(10000))
    expect(probe.dataset.phase).toBe('one')
    act(() => setVisibility('visible'))
    expect(probe.dataset.running).toBe('true')
    act(() => vi.advanceTimersByTime(1000))
    expect(probe.dataset.phase).toBe('two')
  })

  it('pins the final phase and reports entered under prefers-reduced-motion', () => {
    stubMedia(true)
    const probe = mountProbe()
    expect(probe.dataset.phase).toBe('three')
    expect(probe.dataset.reduced).toBe('true')
    expect(probe.dataset.entered).toBe('true')
    expect(probe.dataset.running).toBe('false')
    act(() => vi.advanceTimersByTime(20000))
    expect(probe.dataset.phase).toBe('three')
  })

  it('reacts to a live media-query flip', () => {
    const probe = mountProbe()
    act(() => IOStub.latest!.fire(true, 1))
    expect(probe.dataset.phase).toBe('one')
    act(() => {
      mediaMatches = true
      mediaHandler?.()
    })
    expect(probe.dataset.phase).toBe('three')
    expect(probe.dataset.running).toBe('false')
  })

  it('reveals and runs on the next tick when IntersectionObserver is unavailable', () => {
    delete (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver
    const probe = mountProbe()
    act(() => vi.advanceTimersByTime(0))
    expect(probe.dataset.entered).toBe('true')
    expect(probe.dataset.running).toBe('true')
    act(() => vi.advanceTimersByTime(1000))
    expect(probe.dataset.phase).toBe('two')
  })
})
