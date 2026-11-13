'use client'

import { useEffect, useRef } from 'react'
import { ENERGI_OFFER } from './copy'
import Float from './Float'
import { useMotionPrefs } from './MotionPrefs'
import ServiceIcon from './ServiceIcon'

// Altid Energi's first month free, over the Energi card's phone where the app's own floating
// "Bliv kunde" element sits in the screenshot, covering it (Thor 13/11): a light sky card turned
// a little over a paler one, the bulb in a white circle, a round Deep forest button, a honey
// badge over the corner and the offer's fine print. It floats gently while on screen (Float),
// and grows as the card scrolls up through the window (Thor 13/11): SMALL as the card comes in
// at the bottom, LARGE once the card's middle has reached the upper third, then it holds. One
// frame per scroll, the scale property only (it composes with the tilt and the float). With
// reduced motion it stays at its own size. On every device it is one link to the signup, in a
// new tab. MadDark puts it in the phone's group, so it moves with the phone.

/** Its own size: the smallest that still covers the screenshot's own element, so that never
 * shows. LARGE keeps the growth asked for (0.85 to 1.12 is about a third) from there. */
const SMALL = 1
const LARGE = 1.3

export default function EnergiOffer() {
  const { reduced } = useMotionPrefs()
  const offer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = offer.current as HTMLDivElement
    if (reduced) {
      element.style.scale = ''
      return
    }
    const card = element.closest('.d-card')
    if (!card) throw new Error('EnergiOffer needs to sit in a .d-card')
    let frame = 0
    const draw = () => {
      frame = 0
      const box = card.getBoundingClientRect()
      const h = window.innerHeight
      // 0 when the card's top is at the bottom of the window, 1 when its middle is at a third.
      const start = h
      const end = h / 3 - box.height / 2
      const p = Math.max(0, Math.min(1, (start - box.top) / (start - end)))
      element.style.scale = (SMALL + (LARGE - SMALL) * p).toFixed(3)
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
    <div className="ek">
      <Float className="ek-float">
        <div ref={offer} className="ek-offer">
          <a className="ek-link" href={ENERGI_OFFER.href} target="_blank" rel="noopener noreferrer">
            <span className="ek-mark">
              <ServiceIcon name="energi" size={24} />
            </span>
            <span className="ek-text">
              <span className="ek-title">{ENERGI_OFFER.title}</span>
              <span className="ek-line">{ENERGI_OFFER.line}</span>
              <span className="ek-fine">{ENERGI_OFFER.fine}</span>
            </span>
            <span className="ek-go" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9.5 6 6 6-6 6" />
              </svg>
            </span>
            <span className="ek-badge">{ENERGI_OFFER.badge}</span>
          </a>
        </div>
      </Float>
    </div>
  )
}
