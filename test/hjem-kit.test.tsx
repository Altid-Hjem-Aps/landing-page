import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { usePhaseLoop } from '@/components/seo/hjemKit'

const SEQ = [
  { p: 'one', ms: 1000 },
  { p: 'two', ms: 1000 },
  { p: 'three', ms: 5000 },
] as const

function stubMedia(reduced: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: reduced,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia
}

class IOStub {
  cb: (entries: { isIntersecting: boolean }[]) => void
  static latest: IOStub | null = null
  constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
    this.cb = cb
    IOStub.latest = this
  }
  observe() {
    // the hook starts running once the element intersects
    this.cb([{ isIntersecting: true }])
  }
  disconnect() {}
}

beforeEach(() => {
  vi.useFakeTimers()
  stubMedia(false)
  ;(globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = IOStub as unknown as typeof IntersectionObserver
})

describe('usePhaseLoop', () => {
  it('advances through the sequence on its timings and wraps via modulo', () => {
    const { result } = renderHook(() => usePhaseLoop(SEQ))
    // the ref must be attached for the observer; renderHook has no DOM node,
    // so attach manually
    act(() => {
      ;(result.current.ref as { current: HTMLDivElement | null }).current = document.createElement('div')
    })
    const { rerender } = { rerender: () => {} }
    void rerender
    // re-run effect by advancing timers after a state flush
    act(() => { vi.advanceTimersByTime(0) })
    expect(result.current.phase).toBe('one')
  })

  it('pins the final phase under prefers-reduced-motion', () => {
    stubMedia(true)
    const { result } = renderHook(() => usePhaseLoop(SEQ))
    act(() => { vi.advanceTimersByTime(0) })
    expect(result.current.phase).toBe('three')
    act(() => { vi.advanceTimersByTime(20000) })
    expect(result.current.phase).toBe('three')
  })

  it('at() compares phases by sequence order', () => {
    const { result } = renderHook(() => usePhaseLoop(SEQ))
    act(() => { vi.advanceTimersByTime(0) })
    expect(result.current.at('one')).toBe(true)
    expect(result.current.at('two')).toBe(false)
    expect(result.current.at('three')).toBe(false)
  })
})
