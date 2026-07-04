'use client'

import { useEffect, useRef, useState } from 'react'
import { liveSavings } from '@/lib/liveSavings'
import { subscribeSavings, TICKER_GAP } from '@/lib/savingsTicker'

// The hero's savings stat. The VALUE comes from the shared ticker
// (lib/savingsTicker.ts) so it is always the same number as the big
// SavingsCounter further down the page — this component only animates the
// sub-second transition between the ticker's landed values.
export default function LiveSavingsStat() {
  const [value, setValue] = useState<number | null>(null)
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Reduced motion: show the exact live number once, no burst animation.
    if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(Math.round(liveSavings()))
      return
    }

    let raf = 0
    let displayed: number | null = null
    let unsubscribe: (() => void) | null = null

    const start = () => {
      if (unsubscribe) return
      unsubscribe = subscribeSavings(target => {
        if (displayed === null) {
          // First value — show it instantly, no roll-up from 0.
          displayed = target
          setValue(target)
          return
        }
        if (target <= displayed) return
        // Ease the short hop to the new landed value (the ticker emits every
        // ~2-3 s; the hop itself is cosmetic and lands on the shared number).
        cancelAnimationFrame(raf)
        const from = displayed
        const t0 = performance.now()
        const dur = 420
        const step = (now: number) => {
          const k = Math.min((now - t0) / dur, 1)
          const eased = 1 - Math.pow(1 - k, 3)
          displayed = Math.round(from + (target - from) * eased)
          setValue(displayed)
          if (k < 1) raf = requestAnimationFrame(step)
        }
        raf = requestAnimationFrame(step)
      })
    }
    const stop = () => {
      unsubscribe?.()
      unsubscribe = null
      cancelAnimationFrame(raf)
    }

    // Only burn the ticker clock + rAF hops while the stat is actually on
    // screen — the ticker stops entirely when its last subscriber leaves, and
    // re-subscribing on return snaps straight to the shared value.
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

  // SSR/pre-hydration fallback derives from the same formula + gap the ticker
  // starts from (a literal here would silently drift by 6.750 kr/day);
  // suppressHydrationWarning covers the server/client delta.
  return <span ref={spanRef} suppressHydrationWarning>{(value ?? Math.round(liveSavings()) - TICKER_GAP).toLocaleString('da-DK')} kr.</span>
}
