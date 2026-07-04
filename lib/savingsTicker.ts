import { liveSavings } from './liveSavings'

// ONE shared "displayed savings" value for every counter on the page.
//
// The hero stat and the big SavingsCounter used to run their own catch-up
// animations from different gaps (≈6.7k vs ≈48k behind live), so scrolling
// between them showed two different numbers. This module owns the single
// displayed value: it starts one deliberate gap behind live and catches up in
// random-looking, self-correcting bursts landing on the exact live value
// after ~PHASE_DURATION — subscribers all receive the same landed values and
// only differ in how they animate the sub-second transition.
//
// Client-only state by design: components must NOT read the ticker during
// render (SSR would freeze a stale value into the server module); they render
// the pure-formula fallback and subscribe from an effect.
const PHASE_DURATION = 8 * 60_000
const BURST_EVERY = 2_500
const AVG_BURST = 35
export const TICKER_GAP = Math.round((PHASE_DURATION / BURST_EVERY) * AVG_BURST) // ≈ 6.720

let current: number | null = null
let deadline = 0
let timer: ReturnType<typeof setTimeout> | null = null
const subscribers = new Set<(value: number) => void>()

function ensureStarted() {
  if (current !== null) return
  current = Math.round(liveSavings()) - TICKER_GAP
  deadline = performance.now() + PHASE_DURATION
}

function burst() {
  // Clear + reschedule BEFORE dispatching: if a subscriber callback throws,
  // a stale timer id would otherwise block scheduleNext forever and freeze
  // every counter for the rest of the session.
  timer = null
  scheduleNext()
  const target = Math.round(liveSavings())
  if (current !== null && current < target) {
    // Sized so the remaining distance is covered by the bursts left before
    // the deadline; the random factor keeps each jump different-looking
    // while the self-correcting base keeps the schedule on track.
    const burstsLeft = Math.max(1, (deadline - performance.now()) / BURST_EVERY)
    const baseInc = (target - current) / burstsLeft
    const factor = 0.2 + Math.random() * Math.random() * 2.4
    current += Math.min(target - current, Math.max(1, Math.round(baseInc * factor)))
    subscribers.forEach(cb => {
      // Per-callback isolation: one broken subscriber must not starve the
      // others (nor, combined with the timer ordering above, kill the clock).
      try {
        cb(current!)
      } catch {}
    })
  }
}

function scheduleNext() {
  if (timer || subscribers.size === 0) return
  timer = setTimeout(burst, 1_600 + Math.random() * 1_800)
}

/** Latest landed value — exposed for tests; production code subscribes. */
export function currentSavings(): number {
  ensureStarted()
  return current!
}

/**
 * Subscribe to landed values; the callback fires immediately with the current
 * value and then on every burst. The burst clock only runs while at least one
 * subscriber exists. Returns an unsubscribe function.
 */
export function subscribeSavings(cb: (value: number) => void): () => void {
  ensureStarted()
  // Waking from idle (soft navigation away and back, all counters unmounted):
  // re-arm the catch-up window. Without this, an expired deadline makes the
  // very next burst cover the ENTIRE remaining gap in one giant visible jump.
  if (subscribers.size === 0) {
    deadline = Math.max(deadline, performance.now() + PHASE_DURATION / 2)
  }
  subscribers.add(cb)
  try {
    cb(current!)
  } catch {}
  scheduleNext()
  return () => {
    subscribers.delete(cb)
    if (subscribers.size === 0 && timer) {
      clearTimeout(timer)
      timer = null
    }
  }
}

/** Test-only: wipe the module singleton so each test starts fresh. */
export function __resetForTests() {
  if (timer) clearTimeout(timer)
  timer = null
  current = null
  deadline = 0
  subscribers.clear()
}
