'use client'

import { useState } from 'react'
import Caption from '@/components/site/primitives/Caption'
import Phone from '@/components/site/primitives/Phone'
import { ALTID_ENERGI_LOGO, APP_ICON, SCREENS } from '@/components/site/screens'
import './proof.css'

// The dark bento. The tall tile's toggle is real: Mine shows the Økonomi screen,
// Fælles the Regninger screen, both as the app draws them with that side chosen.
const LENSES = [
  { id: 'mine', label: 'Mine', screen: SCREENS.okonomiTop },
  { id: 'shared', label: 'Fælles', screen: SCREENS.regningerTop },
] as const

function Padlock() {
  return (
    <svg className="pf-padlock" viewBox="0 0 320 400" aria-hidden>
      <path d="M78 190V112a82 82 0 0 1 164 0v78" fill="none" stroke="var(--ah-cream)" strokeWidth="34" />
      <rect x="24" y="170" width="272" height="222" rx="50" fill="var(--ah-mint)" />
      <circle cx="160" cy="262" r="30" fill="var(--ah-deep-forest)" />
      <rect x="146" y="268" width="28" height="66" rx="14" fill="var(--ah-deep-forest)" />
    </svg>
  )
}

export default function Proof() {
  const [lens, setLens] = useState<(typeof LENSES)[number]['id']>('mine')
  return (
    <section id="tryghed" className="ah-sec ah-bg-forest">
      <div className="ah-wrap">
        <h2 className="ah-h2">Hvorfor stole på os?</h2>

        <div className="pf-grid">
          <div className="pf-tile pf-lock">
            <span className="pf-ray" aria-hidden />
            <Padlock />
            <div className="pf-lock-text">
              <h3 className="pf-lock-title">Appen kan kun læse. Den kan aldrig flytte penge.</h3>
              <p className="ah-body mt-4">I logger ind med MitID, og I bestemmer selv, hvad I forbinder.</p>
            </div>
          </div>

          <div className="pf-tile pf-lens">
            <div className="pf-toggle" role="group" aria-label="Vis Mine eller Fælles">
              {LENSES.map(({ id, label }) => (
                <button key={id} type="button" aria-pressed={lens === id} onClick={() => setLens(id)}>
                  {label}
                </button>
              ))}
            </div>
            <p className="ah-h3 pf-lens-line">Se jeres egne penge og det, I deler.</p>
            <div className="pf-lens-stack">
              {LENSES.map(({ id, screen }) => (
                <div key={id} className="pf-lens-screen" data-on={lens === id} aria-hidden={lens !== id}>
                  <Phone screen={screen} crop={0.8} sizes="(max-width: 767px) 72vw, 340px" />
                </div>
              ))}
            </div>
          </div>

          <div className="pf-tile pf-bills">
            <p className="ah-h3">Se regningerne, før de bliver trukket.</p>
            <Phone screen={SCREENS.regningerTop} crop={0.66} className="pf-bills-phone" sizes="(max-width: 767px) 70vw, 300px" />
          </div>

          <div className="pf-tile pf-login">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={APP_ICON} alt="" className="pf-app-icon" />
            <p className="ah-h3">Mad, strøm, forsikring og økonomi. Ét login.</p>
          </div>

          <div className="pf-tile pf-team">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ALTID_ENERGI_LOGO} alt="Altid Energi" className="pf-energi-logo" />
            <p className="ah-h3">Fra holdet bag Altid Energi.</p>
          </div>
        </div>

        <Caption on="forest" className="mt-6" />
      </div>
    </section>
  )
}
