'use client'

import { useEffect, useRef, useState } from 'react'
import { liveSavings } from '@/lib/liveSavings'

// The hero's savings stat — the big SavingsCounter's phase-2 "burst" maths in
// miniature. liveSavings() itself only rises ~0.08 kr/s, far too slow to see,
// so (exactly like the big counter) we start a small deliberate gap BEHIND the
// live value and catch up in random-looking, self-correcting bursts that land
// on the exact number after ~PHASE_DURATION. No intro count-up.
const PHASE_DURATION = 8 * 60_000
const BURST_EVERY = 2_500
const AVG_BURST = 35
const GAP = Math.round((PHASE_DURATION / BURST_EVERY) * AVG_BURST) // ≈ 6.720

export default function LiveSavingsStat() {
  const [value, setValue] = useState<number | null>(null)
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let raf = 0
    let timer: ReturnType<typeof setTimeout> | null = null
    let current = Math.round(liveSavings()) - GAP
    const deadline = performance.now() + PHASE_DURATION
    setValue(current)

    // Reduced motion: show the exact live number once, no burst animation.
    if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(Math.round(liveSavings()))
      return
    }

    const burst = () => {
      const target = Math.round(liveSavings())
      if (current < target) {
        const burstsLeft = Math.max(1, (deadline - performance.now()) / BURST_EVERY)
        const baseInc = (target - current) / burstsLeft
        const factor = 0.2 + Math.random() * Math.random() * 2.4
        const inc = Math.min(target - current, Math.max(1, Math.round(baseInc * factor)))
        const from = current
        const t0 = performance.now()
        const dur = 420
        const step = (now: number) => {
          const k = Math.min((now - t0) / dur, 1)
          const eased = 1 - Math.pow(1 - k, 3)
          current = Math.round(from + inc * eased)
          setValue(current)
          if (k < 1) raf = requestAnimationFrame(step)
        }
        raf = requestAnimationFrame(step)
      }
      timer = setTimeout(burst, 1_600 + Math.random() * 1_800)
    }

    // Only burn timers while the stat is actually on screen.
    const start = () => {
      if (timer) return
      timer = setTimeout(burst, 900 + Math.random() * 700)
    }
    const stop = () => {
      if (timer) clearTimeout(timer)
      timer = null
      cancelAnimationFrame(raf)
    }
    let io: IntersectionObserver | null = null
    if (typeof IntersectionObserver === 'function' && spanRef.current) {
      io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 })
      io.observe(spanRef.current)
    } else {
      start()
    }

    return () => {
      io?.disconnect()
      stop()
    }
  }, [])

  // SSR/pre-hydration fallback derives from the same formula (a literal here
  // would silently drift by 6.750 kr/day); suppressHydrationWarning covers the
  // server/client delta.
  return <span ref={spanRef} suppressHydrationWarning>{(value ?? Math.round(liveSavings()) - GAP).toLocaleString('da-DK')} kr.</span>
}
