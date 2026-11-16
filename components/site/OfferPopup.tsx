'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { STORE_MARK } from '@/components/StoreBadges'
import { trackEvent } from '@/lib/analytics'
import { hasCookieChoice } from '@/lib/cookie-consent'
import { countEvent } from '@/lib/count'
import type { Store } from '@/lib/store-links'
import { keepBrands } from './brand'
import { HERO, LEAVE, OFFER_POPUP, QR } from './copy'
import QrImage from './QrImage'
import StoreLink from './StoreLink'

// The Altid Energi offer as a pop-up (Thor 15/11): download Altid Hjem, become an Altid Energi
// customer in the app, the first month free. On the front page and the guides.
//
// When (research 15/11; our own data and the popup studies are in the PR):
// - not before the visitor has answered the cookie banner, so it never stacks on it;
// - at least 10 s on the page (our visitors pressed a button after a median 13 s; the studies'
//   most cited delay is 6 to 10 s), and
// - scrolled `after` of the way down (the studies' sweet spot on long pages is 35 to 50 %; the
//   front page passes its Energi block at about 30 %, a guide's article is read by half way);
// - once per visit, never in the same visit as the leave pop-up (they share the rule), and not
//   again for 7 days once it has been closed.
// On a computer it is a dialog with the QR code, in the leave pop-up's spirit. On a phone it is a
// small card at the bottom that leaves the page readable: Google demotes phone pages that cover
// their content with a pop-up for visitors from search, which is where the guides' visitors
// come from.

const MIN_TIME_MS = 10_000
const COMPUTER = '(min-width: 1024px) and (hover: hover) and (pointer: fine)'
const SHOWN_KEY = 'ah-offer-popup-shown'
const LEAVE_SHOWN_KEY = 'ah-leave-popup-shown'
const CLOSED_KEY = 'ah-offer-popup-closed'
const QUIET_DAYS = 7

function read(store: 'session' | 'local', key: string): string | null {
  try {
    return (store === 'session' ? window.sessionStorage : window.localStorage).getItem(key)
  } catch {
    return null
  }
}

function write(store: 'session' | 'local', key: string, value: string) {
  try {
    ;(store === 'session' ? window.sessionStorage : window.localStorage).setItem(key, value)
  } catch {
    // No storage: the component's own state still holds it to once on this page.
  }
}

function mayShow(): boolean {
  if (read('session', SHOWN_KEY) === '1' || read('session', LEAVE_SHOWN_KEY) === '1') return false
  const closed = Number(read('local', CLOSED_KEY) ?? 0)
  return Date.now() - closed > QUIET_DAYS * 24 * 60 * 60 * 1000
}

type Mode = 'computer' | 'phone'

// As the leave pop-up: counted by our server for every visitor ("Popup Shown" {popup: offer}),
// and in the browser for visitors who accepted statistics. Its conversions: on a phone a store
// button ("Store Badge Clicked" {position: popup}, and "Energi Offer Converted" in the browser),
// on a computer a scan of its code ("QR Code Scanned" {src: offer}).
function track(event: 'Energi Offer Shown' | 'Energi Offer Dismissed', mode: Mode) {
  countEvent(event === 'Energi Offer Shown' ? 'Popup Shown' : 'Popup Dismissed', { popup: 'offer', mode })
  trackEvent(event, { path: window.location.pathname, mode })
}

function converted(store: Store) {
  trackEvent('Energi Offer Converted', { path: window.location.pathname, mode: 'phone', store }, { leaving: true })
}

/** `proof`: how many have the app, filled in from the live count (OFFER_POPUP.proof). */
export default function OfferPopup({ after, proof }: { after: number; proof: string }) {
  const [mode, setMode] = useState<Mode | null>(null)

  useEffect(() => {
    if (!mayShow()) return
    const start = Date.now()
    let frame = 0
    let done = false
    const check = () => {
      frame = 0
      if (done || Date.now() - start < MIN_TIME_MS || !hasCookieChoice()) return
      const room = document.documentElement.scrollHeight - window.innerHeight
      if (room <= 0 || window.scrollY / room < after) return
      // Not on top of the menu sheet, another dialog or a fullscreen video.
      if (document.fullscreenElement || document.querySelector('dialog[open]')) return
      if (!mayShow()) return
      done = true
      write('session', SHOWN_KEY, '1')
      stop()
      const shownAs: Mode = window.matchMedia(COMPUTER).matches ? 'computer' : 'phone'
      setMode(shownAs)
      track('Energi Offer Shown', shownAs)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }
    // The time can run out while the visitor reads without scrolling, so check once a second too.
    const tick = window.setInterval(schedule, 1000)
    const stop = () => {
      window.clearInterval(tick)
      window.removeEventListener('scroll', schedule)
    }
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      stop()
    }
  }, [after])

  const close = () => {
    write('local', CLOSED_KEY, String(Date.now()))
    if (mode) track('Energi Offer Dismissed', mode)
    setMode(null)
  }

  if (mode === 'computer') return <OfferDialog proof={proof} onClose={close} />
  if (mode === 'phone') return <OfferSheet proof={proof} onClose={close} />
  return null
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  )
}

// A computer: a native modal dialog (focus held inside, Escape closes), the text and the QR code
// on the left, the photo on the right.
function OfferDialog({ proof, onClose }: { proof: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const restore = useRef<HTMLElement | null>(null)
  const pressOnBackdrop = useRef(false)

  useEffect(() => {
    restore.current = document.activeElement as HTMLElement | null
    dialog.current?.showModal()
  }, [])

  return (
    <dialog
      ref={dialog}
      className="op"
      aria-labelledby="op-title"
      onClose={() => {
        restore.current?.focus?.()
        onClose()
      }}
      onPointerDown={(e) => {
        pressOnBackdrop.current = e.target === e.currentTarget
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && pressOnBackdrop.current) dialog.current?.close()
      }}
    >
      <div className="op-card">
        <button type="button" className="op-close" aria-label={LEAVE.close} onClick={() => dialog.current?.close()}>
          <CloseIcon />
        </button>
        <div className="op-text">
          <h2 id="op-title" className="op-title">
            {keepBrands(OFFER_POPUP.title)}
          </h2>
          <p className="op-body">{OFFER_POPUP.body}</p>
          <div className="op-get">
            <span className="op-tile">
              <QrImage source="offer" size={148} />
            </span>
            <p className="op-scan">{QR.line}</p>
          </div>
          <p className="op-proof">{proof}</p>
        </div>
        <div className="op-photo">
          <Image src="/site/gallery/galleri-elbil.webp" alt="" fill sizes="380px" quality={85} style={{ objectFit: 'cover', objectPosition: '40% 50%' }} />
        </div>
      </div>
    </dialog>
  )
}

// A phone: a small card at the bottom, the page stays readable and scrollable behind it. One
// button to the visitor's own store (Android Google Play, others the App Store, data-platform).
function OfferSheet({ proof, onClose }: { proof: string; onClose: () => void }) {
  return (
    <aside className="op-sheet" aria-labelledby="op-sheet-title">
      <button type="button" className="op-close" aria-label={LEAVE.close} onClick={onClose}>
        <CloseIcon />
      </button>
      <div className="op-sheet-head">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/app-badge.png" alt="" width={44} height={44} />
        <div>
          <p id="op-sheet-title" className="op-sheet-title">
            {keepBrands(OFFER_POPUP.title)}
          </p>
          <p className="op-sheet-body">{OFFER_POPUP.body}</p>
        </div>
      </div>
      <StoreLink store="appstore" position="popup" className="op-btn for-appstore" onClick={() => converted('appstore')}>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d={STORE_MARK.appstore} />
        </svg>
        {HERO.getApp}
      </StoreLink>
      <StoreLink store="play" position="popup" className="op-btn for-play" onClick={() => converted('play')}>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d={STORE_MARK.play} />
        </svg>
        {HERO.getApp}
      </StoreLink>
      <p className="op-sheet-proof">{proof}</p>
    </aside>
  )
}
