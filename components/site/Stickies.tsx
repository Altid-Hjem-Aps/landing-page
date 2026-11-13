'use client'

import { useEffect, useRef, useState } from 'react'
import EnergiOffer from './EnergiOffer'
import GetAppSticky from './GetAppSticky'

// The two things fixed on the screen's edge, never both at once, fading the same way.
// The QR code (computers): from the moment the page opens until the testimonials' slider is
// about to come up into the bottom of the window, and back when the visitor scrolls up above
// it again. Altid Energi's offer (bottom left): while the Energi card is in the middle band of
// the window, and gone before the next card's heading ("Alle jeres forsikringer samlet ét
// sted") reaches it: once that heading's top is within the offer's own height plus 40 px of
// the offer's top edge. While the offer shows, the QR code does not.

/** The slider whose arrival hides the QR code. Move it here. */
const SLIDER = '[data-b="proof"] .v'
/** The window reaching endlessly far up and 40 px below its bottom: the slider "intersects" once
 * its top is less than 40 px below the window, and stays so however far up it goes, so a jump
 * straight past it (a menu link) still counts. */
const ARRIVED = '100000px 0px 40px 0px'
/** The middle band of the window the Energi card must be in. */
const BAND = '-20% 0px -20% 0px'
/** The heading the offer must be gone before. Move it here. */
const NEXT_HEADING = '#forsikring .d-card-title'
/** How far below the offer's bottom edge the heading may come before the offer goes. */
const CLEAR = 40

export default function Stickies() {
  const [sliderHere, setSliderHere] = useState(false)
  const [energi, setEnergi] = useState(false)
  const [headingNear, setHeadingNear] = useState(false)
  const offer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const slider = document.querySelector(SLIDER)
    if (!slider) throw new Error(`Stickies needs ${SLIDER} on the page`)
    const observer = new IntersectionObserver(([entry]) => setSliderHere(entry.isIntersecting), { rootMargin: ARRIVED })
    observer.observe(slider)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const card = document.getElementById('energi')
    if (!card) throw new Error('Stickies needs the #energi card on the page')
    const observer = new IntersectionObserver(([entry]) => setEnergi(entry.isIntersecting), { rootMargin: BAND })
    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  // The heading's top against the offer's place: heading top - offer top < offer height + 40,
  // that is, the heading is less than 40 px below the offer's bottom edge (or above it). The
  // offer's place is its resting one (its CSS bottom), so its own slide does not count.
  useEffect(() => {
    const heading = document.querySelector(NEXT_HEADING)
    if (!heading) throw new Error(`Stickies needs ${NEXT_HEADING} on the page`)
    const element = offer.current as HTMLDivElement
    let frame = 0
    let restingBottom = 0
    const measure = () => {
      restingBottom = window.innerHeight - parseFloat(getComputedStyle(element).bottom)
    }
    const check = () => {
      frame = 0
      setHeadingNear(heading.getBoundingClientRect().top < restingBottom + CLEAR)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }
    const onResize = () => {
      measure()
      schedule()
    }
    measure()
    check()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const offerShown = energi && !headingNear
  return (
    <>
      <GetAppSticky shown={!sliderHere && !offerShown} />
      <EnergiOffer ref={offer} shown={offerShown} />
    </>
  )
}
