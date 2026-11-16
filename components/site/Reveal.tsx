'use client'

import { useEffect } from 'react'

// Elements marked data-reveal fade in and rise as they scroll into view, once, as on the old
// site (its Services cards and carousels). What is already on screen when the page loads is
// left as it is, so nothing blinks; the rest waits until it is clear of the bottom of the
// window. The hidden state is switched on from here, so without scripting, and with reduced
// motion, everything is simply visible.
//
// On a phone the blocks get the same entrance too (Thor 15/11): a phone has none of the
// computer's fixed phones that change as the colour blocks pass, so the blocks, their phones
// (a beat after the text), the steps, the story, the questions, the blog and the gallery rows
// fade in and rise instead. Anything already marked, or inside something marked, is left alone.
const PHONE = '(max-width: 767px)'
const PHONE_REVEAL: [selector: string, delayMs: number][] = [
  ['.v', 0],
  ['.d-card', 0],
  ['.d-card .d-fixed', 150],
  ['.st-step', 0],
  ['.sy-quote', 0],
  ['.sy-logo', 0],
  ['.sy-title', 0],
  ['.sy-body', 100],
  ['.q-item', 0],
  ['.zoom-wrap + section .snap-x', 0],
  ['.e-row', 0],
]
const MARKED = '[data-reveal], [data-rise], [data-fade]'

export default function Reveal() {
  useEffect(() => {
    const site = document.querySelector<HTMLElement>('.site')
    if (!site) throw new Error('Reveal needs the .site wrapper')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const added: HTMLElement[] = []
    if (window.matchMedia(PHONE).matches) {
      // Chosen before any is marked, so a block and its phone can both be picked.
      const picks = PHONE_REVEAL.flatMap(([selector, delay]) =>
        [...site.querySelectorAll<HTMLElement>(selector)].filter((el) => !el.closest(MARKED)).map((el) => [el, delay] as const),
      )
      for (const [el, delay] of picks) {
        el.setAttribute('data-reveal', '')
        if (delay) el.style.setProperty('--rd', `${delay}ms`)
        added.push(el)
      }
    }
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
      for (const el of added) {
        el.removeAttribute('data-reveal')
        el.style.removeProperty('--rd')
      }
    }
  }, [])
  return null
}
