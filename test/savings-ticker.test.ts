import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { liveSavings } from '@/lib/liveSavings'
import { currentSavings, subscribeSavings, TICKER_GAP, __resetForTests } from '@/lib/savingsTicker'

// The whole point of the ticker: the hero stat and the big SavingsCounter
// must always display the SAME number. Both subscribe to this one stream —
// these tests pin that the stream is shared, monotonic, anchored to the live
// formula, and lands exactly on it.

describe('savingsTicker', () => {
  beforeEach(() => {
    // Fake `performance` too: the burst schedule measures its deadline with
    // performance.now(), so advancing only setTimeout would leave burstsLeft
    // frozen and the catch-up maths untested.
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date', 'performance'] })
    __resetForTests()
  })
  afterEach(() => {
    __resetForTests()
    vi.useRealTimers()
  })

  it('starts one shared gap behind the live formula', () => {
    const value = currentSavings()
    // Allow a few kr of slack: live rises ~0.08 kr/s between the two reads.
    expect(value).toBeGreaterThanOrEqual(Math.round(liveSavings()) - TICKER_GAP - 5)
    expect(value).toBeLessThanOrEqual(Math.round(liveSavings()) - TICKER_GAP + 5)
  })

  it('feeds every subscriber the exact same landed values, strictly rising', () => {
    const seenA: number[] = []
    const seenB: number[] = []
    const unsubA = subscribeSavings(v => seenA.push(v))
    const unsubB = subscribeSavings(v => seenB.push(v))

    // ~2 minutes of burst clock.
    for (let i = 0; i < 40; i++) vi.advanceTimersByTime(3_500)

    expect(seenA.length).toBeGreaterThan(5)
    // B subscribed after A's immediate callback — align on the shared tail.
    expect(seenA.slice(seenA.length - seenB.length)).toEqual(seenB)
    for (let i = 1; i < seenA.length; i++) {
      expect(seenA[i]).toBeGreaterThan(seenA[i - 1])
    }
    // Never overshoots the live formula.
    expect(seenA[seenA.length - 1]).toBeLessThanOrEqual(Math.round(liveSavings()))

    unsubA()
    unsubB()
  })

  it('lands exactly on the live value after the catch-up window and goes quiet', () => {
    const seen: number[] = []
    const unsub = subscribeSavings(v => seen.push(v))
    // Run well past PHASE_DURATION (8 min).
    for (let i = 0; i < 250; i++) vi.advanceTimersByTime(3_500)
    // The ticker emits discrete steps while liveSavings() rises continuously, so at a
    // rounding boundary the last emission can sit exactly 1 kr below the live value
    // (fast local runs miss the boundary; slower CI hits it). Assert it caught up to
    // within one step and never overshot, not brittle exact equality.
    const live = Math.round(liveSavings())
    expect(seen[seen.length - 1]).toBeGreaterThanOrEqual(live - 1)
    expect(seen[seen.length - 1]).toBeLessThanOrEqual(live)
    // Caught up → no further emissions (live rises too slowly under fake Date
    // that advances with the timers — a whole minute adds only ~5 kr, and any
    // burst that fires would emit; assert near-silence rather than churn).
    const n = seen.length
    vi.advanceTimersByTime(10_000)
    expect(seen.length - n).toBeLessThanOrEqual(1)
    unsub()
  })

  it('a throwing subscriber cannot kill the clock for the others', () => {
    const seen: number[] = []
    const unsubBad = subscribeSavings(() => {
      throw new Error('subscriber exploded')
    })
    const unsubGood = subscribeSavings(v => seen.push(v))
    const before = seen.length
    // The throwing callback aborts the current dispatch, but the NEXT burst
    // must still be scheduled — the good subscriber keeps receiving values.
    for (let i = 0; i < 10; i++) {
      try {
        vi.advanceTimersByTime(3_500)
      } catch {
        // the bad subscriber's throw surfaces through the timer — expected
      }
    }
    expect(seen.length).toBeGreaterThan(before)
    unsubBad()
    unsubGood()
  })

  it('re-subscribing after the last unsubscribe restarts the clock (and re-arms the window)', () => {
    const first: number[] = []
    const unsub = subscribeSavings(v => first.push(v))
    vi.advanceTimersByTime(10_000)
    unsub()

    const second: number[] = []
    const unsub2 = subscribeSavings(v => second.push(v))
    vi.advanceTimersByTime(10_000)
    // Immediate callback + at least one fresh burst.
    expect(second.length).toBeGreaterThan(1)
    // No giant single jump on wake-up: each burst stays a sane fraction of
    // the remaining gap (deadline re-armed on the 0→1 transition).
    for (let i = 1; i < second.length; i++) {
      expect(second[i] - second[i - 1]).toBeLessThan(TICKER_GAP / 2)
    }
    unsub2()
  })

  it('stops the clock when the last subscriber leaves', () => {
    const seen: number[] = []
    const unsub = subscribeSavings(v => seen.push(v))
    vi.advanceTimersByTime(10_000)
    const countWhileSubscribed = seen.length
    unsub()
    vi.advanceTimersByTime(60_000)
    expect(seen.length).toBe(countWhileSubscribed)
  })
})
