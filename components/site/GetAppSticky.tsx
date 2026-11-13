'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { QR } from './copy'
import QrMorph from './QrMorph'

// Computers only (CSS): "Hent appen" bottom right from the moment the page opens. Pressed, it
// turns into the one QR code (/qr picks the visitor's store). It stays put while the page
// scrolls and fades away once Ekstra Bladet's card in the hero has scrolled up past the top of
// the window, and comes back when the visitor scrolls up to it again. While it is open as a QR
// card it stays until it is closed.

/** The element whose passing the top of the window hides the button. Move it here. */
const GONE_PAST = '.h-press'
// The window counted as reaching endlessly far down, so the mark only stops "intersecting" once
// it is wholly above the window, and a jump straight past it (a menu link) still counts.
const ABOVE_ONLY = '0px 0px 100000px 0px'

export default function GetAppSticky() {
  const [past, setPast] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const mark = document.querySelector(GONE_PAST)
    if (!mark) throw new Error(`GetAppSticky needs ${GONE_PAST} on the page`)
    const observer = new IntersectionObserver(([entry]) => setPast(!entry.isIntersecting), { rootMargin: ABOVE_ONLY })
    observer.observe(mark)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="gs" data-shown={open || !past}>
      <QrMorph
        className="gs-get"
        anchor="bottom-right"
        href="/qr"
        qr={{ src: '/site/qr/app.svg', alt: QR.alt, size: 148 }}
        head={QR.title}
        caption={QR.line}
        closeLabel={QR.close}
        onOpenChange={setOpen}
      >
        <Image className="gs-icon" src="/app-badge.png" alt="" width={40} height={40} />
        <span className="gs-text">
          <span className="gs-title">{QR.title}</span>
          <span className="gs-line">{QR.sticky}</span>
        </span>
      </QrMorph>
    </div>
  )
}
