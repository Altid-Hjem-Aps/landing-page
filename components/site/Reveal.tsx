'use client'

import { useEffect } from 'react'

// Elements marked data-reveal fade in and rise as they scroll into view, once, as on the old
// site (its Services cards and carousels). What is already on screen when the page loads is
// left as it is, so nothing blinks; the rest waits until it is clear of the bottom of the
// window. The hidden state is switched on from here, so without scripting, and with reduced
// motion, everything is simply visible.
export default function Reveal() {
  useEffect(() => {
    const site = document.querySelector<HTMLElement>('.site')
    if (!site) throw new Error('Reveal needs the .site wrapper')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-revealed', '')
          io.unobserve(entry.target)
        }
      },
      // The element must rise out of the bottom of the window before it shows.
      { rootMargin: '0px 0px -12% 0px' },
    )
    const height = window.innerHeight
    for (const el of site.querySelectorAll<HTMLElement>('[data-reveal]')) {
      if (el.getBoundingClientRect().top < height) el.setAttribute('data-revealed', '')
      else io.observe(el)
    }
    site.setAttribute('data-reveal-on', '')
    return () => {
      io.disconnect()
      site.removeAttribute('data-reveal-on')
    }
  }, [])
  return null
}
