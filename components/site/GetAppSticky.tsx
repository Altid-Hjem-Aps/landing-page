'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { QR } from './copy'

// Computers only (CSS): the one QR code bottom right from the moment the page opens (/qr picks
// the visitor's store), no button in front of it (Thor 13/11: "should just be a QR code"). It
// stays put while the page scrolls, fades away once Ekstra Bladet's card in the hero has
// scrolled up past the top of the window, and comes back when the visitor scrolls up to it.

/** The element whose passing the top of the window hides the code. Move it here. */
const GONE_PAST = '.h-press'
// The window counted as reaching endlessly far down, so the mark only stops "intersecting" once
// it is wholly above the window, and a jump straight past it (a menu link) still counts.
const ABOVE_ONLY = '0px 0px 100000px 0px'

export default function GetAppSticky() {
  const [past, setPast] = useState(false)

  useEffect(() => {
    const mark = document.querySelector(GONE_PAST)
    if (!mark) throw new Error(`GetAppSticky needs ${GONE_PAST} on the page`)
    const observer = new IntersectionObserver(([entry]) => setPast(!entry.isIntersecting), { rootMargin: ABOVE_ONLY })
    observer.observe(mark)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="gs" data-shown={!past}>
      <div className="gs-card">
        <p className="gs-title">{QR.title}</p>
        <span className="gs-tile">
          <Image src="/site/qr/app.svg" alt={QR.alt} width={148} height={148} />
        </span>
        <p className="gs-line">{QR.line}</p>
      </div>
    </div>
  )
}
