'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ENERGI_OFFER, QR } from './copy'
import ServiceIcon from './ServiceIcon'

// Altid Energi's first month free as a slim card on the right (Thor 13/11), with the app's one
// QR code, since the offer is had by becoming a customer through Altid Hjem. It comes in as the
// Energi card's floating "Bliv kunde" offer starts to leave the top of the window, and goes as
// soon as the "Hent appen" buttons in the steps come up into view, and so also once the reader
// is past them. Computers only, and only in the free strip right of the colour blocks (CSS), so
// it never covers them. All its words are the offer's and the QR card's own.

/** The floating offer. It sits in the Energi card's fixed phone and is seen through that card's
 * clip, so it starts to leave the window when the card's bottom edge passes its own bottom. */
const OFFER = '.ek'
const CARD = '#energi'
/** The steps' store buttons whose arrival sends it away. */
const BUTTONS = '[data-b="steps"] .st-pills'

export default function EnergiSticky() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const offer = document.querySelector(OFFER)
    const card = document.querySelector(CARD)
    const buttons = document.querySelector(BUTTONS)
    if (!offer) throw new Error(`EnergiSticky needs ${OFFER} on the page`)
    if (!card) throw new Error(`EnergiSticky needs ${CARD} on the page`)
    if (!buttons) throw new Error(`EnergiSticky needs ${BUTTONS} on the page`)
    let frame = 0
    const read = () => {
      frame = 0
      const leaving = card.getBoundingClientRect().bottom < offer.getBoundingClientRect().bottom
      const buttonsReached = buttons.getBoundingClientRect().top < window.innerHeight
      setShown(leaving && !buttonsReached)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <aside className="es" data-shown={shown} aria-label={ENERGI_OFFER.title}>
      <span className="es-badge">{ENERGI_OFFER.badge}</span>
      <span className="es-mark">
        <ServiceIcon name="energi" size={20} />
      </span>
      <span className="es-title">{ENERGI_OFFER.title}</span>
      <span className="es-line">{ENERGI_OFFER.line}</span>
      <span className="es-tile">
        <Image src="/site/qr/app.svg" alt={QR.alt} width={74} height={74} />
      </span>
      <span className="es-scan">{QR.title}</span>
    </aside>
  )
}
