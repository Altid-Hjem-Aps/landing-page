'use client'

import { ENERGI_OFFER } from './copy'
import QrMorph from './QrMorph'
import ServiceIcon from './ServiceIcon'

// Altid Energi's first month free, in the Energi card's text under its paragraph, drawn after
// the app's own floating "Bliv kunde" element: a light card turned a little, the bulb in a white
// circle, a round Deep forest button, and a honey badge over the corner. On a phone or a tablet
// the whole element is the link to the signup; on a computer it turns into the signup's QR
// code, with a small link for signing up on this computer.
export default function EnergiOffer() {
  return (
    <div className="ek" data-reveal>
      <QrMorph
        className="ek-offer"
        anchor="bottom-left"
        href={ENERGI_OFFER.href}
        newTab
        qr={{ src: '/site/qr/altid-energi.svg', alt: ENERGI_OFFER.qrAlt, size: 164 }}
        head={ENERGI_OFFER.title}
        caption={ENERGI_OFFER.qr}
        closeLabel={ENERGI_OFFER.close}
        extra={
          <a className="ek-here" href={ENERGI_OFFER.href} target="_blank" rel="noopener noreferrer">
            {ENERGI_OFFER.here}
          </a>
        }
        decor={<span className="ek-badge qm-decor">{ENERGI_OFFER.badge}</span>}
      >
        <span className="ek-mark">
          <ServiceIcon name="energi" size={24} />
        </span>
        <span className="ek-text">
          <span className="ek-title">{ENERGI_OFFER.title}</span>
          <span className="ek-line">{ENERGI_OFFER.line}</span>
        </span>
        <span className="ek-go" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9.5 6 6 6-6 6" />
          </svg>
        </span>
      </QrMorph>
      <p className="ek-fine">{ENERGI_OFFER.fine}</p>
    </div>
  )
}
