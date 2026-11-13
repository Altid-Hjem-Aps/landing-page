import { ENERGI_OFFER } from './copy'
import Float from './Float'
import ServiceIcon from './ServiceIcon'

// Altid Energi's first month free, over the Energi card's phone where the app's own floating
// "Bliv kunde" element sits in the screenshot, covering it (Thor 13/11): a light sky card turned
// a little over a paler one, the bulb in a white circle, a round Deep forest button, a honey
// badge over the corner and the offer's fine print. It floats gently while on screen (Float).
// On every device it is one link to the signup, in a new tab. MadDark puts it in the phone's
// group, so it moves with the phone.
export default function EnergiOffer() {
  return (
    <div className="ek">
      <Float className="ek-float">
        <div className="ek-offer">
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
