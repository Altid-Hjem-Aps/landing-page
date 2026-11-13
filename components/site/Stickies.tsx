'use client'

import { useEffect, useState } from 'react'
import EnergiOffer from './EnergiOffer'
import GetAppSticky from './GetAppSticky'

// The two things that sit fixed at the bottom of the screen, never both at once.
// The QR code (computers): from the moment the page opens until the testimonials' slider is
// about to come up into the bottom of the window, and back when the visitor scrolls up above
// it again. Altid Energi's offer: while the Energi card is in the middle band of the window.
// While the offer shows, the QR code does not.

/** The slider whose arrival hides the QR code. Move it here. */
const SLIDER = '[data-b="proof"] .v'
/** The window reaching endlessly far up and 40 px below its bottom: the slider "intersects" once
 * its top is less than 40 px below the window, and stays so however far up it goes, so a jump
 * straight past it (a menu link) still counts. */
const ARRIVED = '100000px 0px 40px 0px'
/** The middle band of the window the Energi card must be in. */
const BAND = '-20% 0px -20% 0px'

export default function Stickies() {
  const [sliderHere, setSliderHere] = useState(false)
  const [energi, setEnergi] = useState(false)

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

  return (
    <>
      <GetAppSticky shown={!sliderHere && !energi} />
      <EnergiOffer shown={energi} />
    </>
  )
}
