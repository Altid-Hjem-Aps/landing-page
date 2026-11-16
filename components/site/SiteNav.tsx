'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { STORE_MARK } from '@/components/StoreBadges'
import { countEvent } from '@/lib/count'
import { pageGroup, sitePage } from '@/lib/site-counts'
import { STORE_ANCHOR } from '@/lib/store-links'
import { NAV } from './copy'
import GetAppButton from './GetAppButton'
import StoreLink from './StoreLink'

// Fixed floating pill. A sibling of main on purpose: backdrop-filter on an ancestor of the
// Altid Mad section's fixed phones would break them. The sheet is a native modal dialog,
// so the browser holds focus inside, closes on Escape and returns focus to the burger.
// The pill is glass: it turns light on the page's dark blocks (data-surface="dark").
// `base` is '' on the front page and '/' elsewhere, so the in-page links lead back to it.
// `getApp` (the front page): on a phone a compact "Hent appen" to the visitor's own store
// fades in once the hero's store button has scrolled up out of view, and stays from there on.
// `storesHere` (the guides): this page has its own store buttons (#hent-appen), so "Hent appen"
// goes to them instead of back to the front page.
/** The menu folding back into the pill (site.css .sheet[data-closing]). */
const SHEET_OUT_MS = 300

export default function SiteNav({ base = '', getApp = false, storesHere = false }: { base?: '' | '/'; getApp?: boolean; storesHere?: boolean }) {
  const at = (href: string) => (href.startsWith('#') ? base + href : href)
  const sheet = useRef<HTMLDialogElement>(null)
  const header = useRef<HTMLElement>(null)
  const [surface, setSurface] = useState<'light' | 'dark'>('light')
  const [heroPassed, setHeroPassed] = useState(false)

  // One cookie-free count per page view (lib/site-counts.ts, Page Visited): the nav is on every
  // page of the new site, so this is the site's full visitor count.
  useEffect(() => {
    const path = window.location.pathname
    countEvent('Page Visited', { page: pageGroup(path), slug: sitePage(path) })
  }, [])

  useEffect(() => {
    if (!getApp) return
    const hero = document.querySelector('[data-hero-store]')
    if (!hero) throw new Error('SiteNav getApp needs the hero store button ([data-hero-store])')
    // Passed means above the top edge; below the screen (a short window) does not count.
    const observer = new IntersectionObserver(([entry]) => setHeroPassed(!entry.isIntersecting && entry.boundingClientRect.top < 0))
    observer.observe(hero)
    return () => observer.disconnect()
  }, [getApp])

  useEffect(() => {
    const bar = header.current as HTMLElement
    let frame = 0
    const read = () => {
      frame = 0
      const pill = bar.firstElementChild as HTMLElement
      const box = pill.getBoundingClientRect()
      // What sits under the middle of the pill, the pill itself left out.
      const under = document
        .elementsFromPoint(box.left + box.width / 2, box.top + box.height / 2)
        .find((el) => !bar.contains(el))
      setSurface(under?.closest('[data-surface]')?.getAttribute('data-surface') === 'dark' ? 'dark' : 'light')
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
  // Closing plays the menu's way out first (Thor 15/11: it had no animation), then closes the
  // dialog; with reduced motion it closes at once. Escape comes through onCancel.
  const closeSheet = () => {
    const dialog = sheet.current
    if (!dialog?.open || dialog.dataset.closing) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return dialog.close()
    dialog.dataset.closing = 'true'
    window.setTimeout(() => {
      delete dialog.dataset.closing
      dialog.close()
    }, SHEET_OUT_MS)
  }
  // Focus on the sheet itself: left to the browser it lands on the close button, and iOS
  // then draws the keyboard ring around it after a finger tap.
  const openSheet = () => {
    sheet.current?.showModal()
    sheet.current?.focus()
  }

  return (
    <>
      <header ref={header} className="nav" data-on={surface}>
        <div className="nav-pill">
          <a href={at('#top')} className="nav-home" aria-label={NAV.home}>
            <Image src="/site/brand/lockup-deep-forest.svg" alt="" width={96} height={30} loading="eager" className="nav-logo-light" />
            <Image src="/site/brand/lockup-white.svg" alt="" width={96} height={30} loading="eager" className="nav-logo-dark" />
          </a>
          {getApp ? (
            <div className="nav-get" data-shown={heroPassed}>
              <StoreLink store="appstore" position="nav" className="nav-cta for-appstore">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d={STORE_MARK.appstore} />
                </svg>
                {NAV.cta}
              </StoreLink>
              <StoreLink store="play" position="nav" className="nav-cta for-play">
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d={STORE_MARK.play} />
                </svg>
                {NAV.cta}
              </StoreLink>
            </div>
          ) : null}
          <nav className="nav-main" aria-label={NAV.ariaMain}>
            <div className="nav-links">
              {NAV.links.map((link) => (
                <a key={link.href} href={at(link.href)}>
                  {link.label}
                </a>
              ))}
            </div>
            <a href={storesHere ? `#${STORE_ANCHOR}` : at(`#${STORE_ANCHOR}`)} className="nav-cta nav-cta-main">
              {/* The label twice: the second rolls in on hover (Thor 15/11), hidden from screen readers. */}
              <span className="sp-roll">
                <span className="sp-a">{NAV.cta}</span>
                <span className="sp-b" aria-hidden="true">
                  {NAV.cta}
                </span>
              </span>
            </a>
          </nav>
          <button type="button" className="nav-burger" aria-label={NAV.open} aria-haspopup="dialog" onClick={openSheet}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M3 6.5h18M8 12h13M3 17.5h18" />
            </svg>
          </button>
        </div>
      </header>

      <dialog
        ref={sheet}
        className="sheet"
        tabIndex={-1}
        aria-label={NAV.ariaMenu}
        onClick={(e) => e.target === e.currentTarget && closeSheet()}
        onCancel={(e) => {
          e.preventDefault()
          closeSheet()
        }}
      >
        <div className="sheet-body">
          <div className="sheet-top">
            <Image src="/site/brand/lockup-deep-forest.svg" alt="Altid Hjem" width={96} height={30} />
            <button type="button" className="sheet-close" aria-label={NAV.close} onClick={closeSheet}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav aria-label={NAV.ariaMenu}>
            <ul className="sheet-links">
              {NAV.sheet.map((link, i) => (
                <li key={link.href} style={{ '--i': i } as CSSProperties}>
                  <a href={at(link.href)} onClick={closeSheet}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {/* One button to the visitor's own store, not the two pills (Thor 15/11). */}
          <GetAppButton position="nav" />
        </div>
      </dialog>
    </>
  )
}
