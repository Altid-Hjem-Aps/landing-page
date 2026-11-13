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
      // Its unscaled box, from layout (transforms don't move offsetTop).
      let docTop = 0
      for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) docTop += node.offsetTop
      const top = docTop - window.scrollY
      const bottom = top + el.offsetHeight
      // Coming in, it grows from the moment its top enters the window until the middle of the
      // first block (the story, the blue and green panels) reaches the middle of the window, so
      // it is fully open as their text is about centred (Thor 13/11: it opened too early).
      const first = el.firstElementChild as HTMLElement
      const openAt = vh / 2 - (first.offsetTop + first.offsetHeight / 2)
      const into = Math.min(1, Math.max(0, (vh - top) / Math.max(vh - openAt, vh * 0.3)))
      const outOf = Math.min(1, Math.max(0, bottom / (vh * 0.6)))
      const open = Math.min(into, outOf)
      const eased = open * open * (3 - 2 * open)
      // Scale the whole block, so it shrinks to the panel's width and grows to the window's
      // without cutting anything off; the corners round as it shrinks.
      const scale = 1 - ((1 - eased) * rest * 2) / vw
      // Coming in it shrinks towards its top edge, going out towards its bottom edge, so the
      // edge in view stays put and no strip of page shows between it and its neighbour.
      el.style.transformOrigin = into < outOf ? '50% 0' : '50% 100%'
      el.style.transform = `scale(${scale.toFixed(4)})`
      // The privacy panel's 24 px corners, held until it is nearly open, then easing to square.
      const round = 24 * Math.min(1, (1 - eased) * 4)
      el.style.borderRadius = `${(round / scale).toFixed(1)}px`
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
    <div className="zoom-wrap">
      <div ref={ref} className="zoomer">
        {children}
      </div>
    </div>
  )
}
