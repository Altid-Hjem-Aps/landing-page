'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

// How far a visitor reads, for visitors who accepted statistics (lib/analytics.ts): "Section
// Reached" {section, path} the first time a block (its data-b name) comes into the top half of
// the window, and "Page Scrolled" {percent, path} at 25, 50, 75 and 100 % of the page. Each once
// per page view. Time on the site is Amplitude's own session length (sessions autocapture); these
// events also mark activity in a visit that has no click. An event not sent because the visitor
// had not accepted yet goes out once it is reached again after accepting.

const DEPTHS = [25, 50, 75, 100] as const
/** The bottom of the page is never reached to the pixel on some phones. */
const BOTTOM_SLACK_PX = 40

export default function EngagementTracker() {
  useEffect(() => {
    const path = window.location.pathname
    const sections = new Set<string>()
    const depths = new Set<number>()

    // One observer per block, so each knows its own name.
    const observers = Array.from(document.querySelectorAll<HTMLElement>('[data-b]'), (el) => {
      const section = el.dataset.b as string
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || sections.has(section)) return
          if (trackEvent('Section Reached', { section, path })) sections.add(section)
        },
        { rootMargin: '0px 0px -50% 0px' },
      )
      observer.observe(el)
      return observer
    })

    let frame = 0
    const read = () => {
      frame = 0
      const page = document.documentElement.scrollHeight
      const seen = window.scrollY + window.innerHeight
      for (const percent of DEPTHS) {
        if (depths.has(percent)) continue
        const reached = percent === 100 ? seen >= page - BOTTOM_SLACK_PX : seen >= (page * percent) / 100
        if (reached && trackEvent('Page Scrolled', { percent, path })) depths.add(percent)
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      observers.forEach((observer) => observer.disconnect())
      window.removeEventListener('scroll', schedule)
    }
  }, [])

  return null
}
