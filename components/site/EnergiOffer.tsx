'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ENERGI_OFFER } from './copy'
import ServiceIcon from './ServiceIcon'

// Altid Energi's first month free, while the Energi card (#energi in MadDark) is on screen. A
// computer (from 1024 px, fine pointer, CSS) gets a card in the hero QR card's corner, with a
// QR code for the phone and the heading as a link for this computer. A phone (under 768 px) gets
// a pill at the bottom of the screen. One IntersectionObserver sets data-shown; CSS fades and
// slides, and with reduced motion it only shows and hides.
const BAND = '-20% 0px -20% 0px'

export default function EnergiOffer() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const card = document.getElementById('energi')
    if (!card) throw new Error('EnergiOffer needs the #energi card on the page')
    const observer = new IntersectionObserver(([entry]) => setShown(entry.isIntersecting), { rootMargin: BAND })
    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <aside className="eo" data-shown={shown} aria-label={ENERGI_OFFER.title}>
        <figure className="eo-code">
          <Image src="/site/qr/altid-energi.svg" alt={ENERGI_OFFER.qrAlt} width={82} height={82} />
          <figcaption>{ENERGI_OFFER.qr}</figcaption>
        </figure>
        <div className="eo-text">
          <p className="eo-badge">{ENERGI_OFFER.badge}</p>
          <p className="eo-title">
            <a href={ENERGI_OFFER.href} target="_blank" rel="noopener noreferrer">
              {ENERGI_OFFER.title}
            </a>
          </p>
          <p className="eo-line">{ENERGI_OFFER.line}</p>
          <p className="eo-fine">{ENERGI_OFFER.fine}</p>
        </div>
      </aside>
      <a className="eo-pill" data-shown={shown} href={ENERGI_OFFER.href} target="_blank" rel="noopener noreferrer">
        <span className="eo-mark">
          <ServiceIcon name="energi" size={20} />
        </span>
        <span className="eo-pill-text">{ENERGI_OFFER.phone}</span>
        <svg className="eo-chevron" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m9 6 6 6-6 6" />
        </svg>
      </a>
    </>
  )
}
