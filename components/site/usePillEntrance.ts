'use client'

import { useEffect, type RefObject } from 'react'

/** The longest entrance (the second pill's label) is over by then; see site.css. */
const ENTRANCE_MS = 1600

// The store buttons' entrance (Thor 15/11, version B of drafts/ALT-1420-cta-animations.html):
// the first time a row of buttons is well in view, each grows out of its store icon, the icon
// pops in and the label rolls up into place (CSS on [data-enter] in site.css). Until the
// script runs, and with reduced motion, the buttons are simply there.
export function usePillEntrance(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const element = ref.current
    if (!element) throw new Error('usePillEntrance needs its element')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Each pill's slot keeps the pill's full width while the pill grows inside it, so the row
    // never shifts (Thor 15/11: they pushed each other). Measured when the entrance starts, at
    // full size for that moment, since a row in the closed menu has no size before. Released
    // once they have come in.
    const slots = [...element.querySelectorAll<HTMLElement>(':scope > .sp-slot')]
    const hold = () => {
      for (const slot of slots) slot.style.width = `${slot.offsetWidth}px`
    }
    const release = () => {
      for (const slot of slots) slot.style.width = ''
    }
    // A row already laid out holds its widths from the start, so even unseen it never shifts.
    if (slots.every((slot) => slot.offsetWidth > 0)) hold()
    element.dataset.enter = 'wait'
    let done = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        release()
        delete element.dataset.enter
        hold()
        element.dataset.enter = 'go'
        observer.disconnect()
        done = window.setTimeout(release, ENTRANCE_MS)
      },
      { threshold: 0.6 },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      window.clearTimeout(done)
      release()
      delete element.dataset.enter
    }
  }, [ref, enabled])
}
