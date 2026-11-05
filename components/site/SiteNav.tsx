'use client'

import Image from 'next/image'
import { useRef } from 'react'
import StoreBadges from '@/components/StoreBadges'
import { STORE_ANCHOR } from '@/lib/store-links'
import { NAV } from './copy'

// Fixed floating pill. A sibling of main on purpose: backdrop-filter on an ancestor of the
// Altid Mad section's fixed phones would break them. The sheet is a native modal dialog,
// so the browser holds focus inside, closes on Escape and returns focus to the burger.
export default function SiteNav() {
  const sheet = useRef<HTMLDialogElement>(null)
  const closeSheet = () => sheet.current?.close()

  return (
    <>
      <header className="nav">
        <div className="nav-pill">
          <a href="#top" className="nav-home" aria-label={NAV.home}>
            <Image src="/site/brand/lockup-deep-forest.svg" alt="" width={86} height={27} loading="eager" />
          </a>
          <nav className="nav-main" aria-label={NAV.ariaMain}>
            <div className="nav-links">
              {NAV.links.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
            <a href={`#${STORE_ANCHOR}`} className="nav-cta">
              {NAV.cta}
            </a>
          </nav>
          <button type="button" className="nav-burger" aria-label={NAV.open} aria-haspopup="dialog" onClick={() => sheet.current?.showModal()}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M3 6.5h18M8 12h13M3 17.5h18" />
            </svg>
          </button>
        </div>
      </header>

      <dialog ref={sheet} className="sheet" aria-label={NAV.ariaMenu} onClick={(e) => e.target === e.currentTarget && closeSheet()}>
        <div className="sheet-body">
          <div className="sheet-top">
            <Image src="/site/brand/lockup-deep-forest.svg" alt="Altid Hjem" width={86} height={27} />
            <button type="button" className="sheet-close" aria-label={NAV.close} onClick={closeSheet}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav aria-label={NAV.ariaMenu}>
            <ul className="sheet-links">
              {NAV.sheet.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={closeSheet}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <StoreBadges position="nav" variant="cream" size="lg" />
        </div>
      </dialog>
    </>
  )
}
