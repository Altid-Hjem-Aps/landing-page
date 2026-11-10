'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useMotionPrefs } from './MotionPrefs'

// Holds the story and the FAQ. Out of view it is scaled down to the width of the privacy panel
// above, corners rounded; as it scrolls in it grows to the full window, edge to edge, and it
// shrinks again as it scrolls out towards the blog. The whole block scales, so nothing is cut
// off. With reduced motion it simply stays edge to edge.
export default function Zoomer({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { reduced } = useMotionPrefs()

  useEffect(() => {
    const el = ref.current as HTMLDivElement
    if (reduced) {
      el.style.transform = 'none'
      el.style.borderRadius = '0px'
      return
    }
    let frame = 0
    const draw = () => {
      frame = 0
      const vh = window.innerHeight
      const vw = document.documentElement.clientWidth
      // The privacy panel: min(100% - 64u, 1376u) wide on a computer, 356u of 390 on a phone.
      const phone = window.innerWidth < 768
      const u = phone ? vw / 390 : Math.min(vw, 1440) / 1440
      const panel = phone ? 356 * u : Math.min(vw - 64 * u, 1376 * u)
      const rest = (vw - panel) / 2
      // Its unscaled box: the scale is about the centre, so the centre does not move.
      const rect = el.getBoundingClientRect()
      const middle = rect.top + rect.height / 2
      const top = middle - el.offsetHeight / 2
      const bottom = middle + el.offsetHeight / 2
      const into = Math.min(1, Math.max(0, (vh - top) / (vh * 0.6)))
      const outOf = Math.min(1, Math.max(0, bottom / (vh * 0.6)))
      const open = Math.min(into, outOf)
      const eased = open * open * (3 - 2 * open)
      // Scale the whole block, so it shrinks to the panel's width and grows to the window's
      // without cutting anything off; the corners round as it shrinks.
      const scale = 1 - ((1 - eased) * rest * 2) / vw
      el.style.transform = `scale(${scale.toFixed(4)})`
      el.style.borderRadius = `${(((1 - eased) * 24) / scale).toFixed(1)}px`
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [reduced])

  return (
    <div ref={ref} className="zoomer">
      {children}
    </div>
  )
}
