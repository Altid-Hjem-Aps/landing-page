'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { QR } from './copy'

// Computers only (CSS): the one QR code on the hero's old dark card, bottom right, with the new
// simple text (Thor 13/11). There from the moment the page opens (at this size it stays clear
// of the hero's notifications), it fades out before the testimonials' slider comes up into the
// bottom of the window and fades back in when the visitor scrolls up above it.

/** The slider whose arrival hides the card. */
const SLIDER = '[data-b="proof"] .v'
/** The window reaching endlessly far up and 40 px below its bottom: the slider "intersects" once
 * its top is less than 40 px below the window, and stays so however far up it goes, so a jump
 * straight past it (a menu link) still counts. */
const ARRIVED = '100000px 0px 40px 0px'

export default function GetAppSticky() {
  const [sliderHere, setSliderHere] = useState(false)

  useEffect(() => {
    const slider = document.querySelector(SLIDER)
    if (!slider) throw new Error(`GetAppSticky needs ${SLIDER} on the page`)
    const observer = new IntersectionObserver(([entry]) => setSliderHere(entry.isIntersecting), { rootMargin: ARRIVED })
    observer.observe(slider)
    return () => observer.disconnect()
  }, [])

  return (
    <aside className="gs" data-shown={!sliderHere} aria-label={QR.title}>
      <span className="gs-tile">
        <Image src="/site/qr/app.svg" alt={QR.alt} width={74} height={74} />
      </span>
      <span className="gs-text">
        <span className="gs-title">{QR.title}</span>
        <span className="gs-line">{QR.line}</span>
      </span>
    </aside>
  )
}
