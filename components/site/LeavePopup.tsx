'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { readCookieChoice } from '@/lib/cookie-consent'
import { LEAVE, QR } from './copy'

// Computers only: when the mouse leaves the window through the top, headed for the tab bar,
// the QR codes once more, once per browser session. The trigger is the old site's waitlist
// popup (ExitIntentModal): armed after a few seconds, the top zone or a fast upward flick,
// never on top of another dialog. A native modal dialog, so the browser holds focus inside
// and Escape closes it; a click on the backdrop closes it too.
const ARM_DELAY_MS = 5000
// Browsers sample the pointer, so a fast move to the tab bar reports its exit inside the page.
const EXIT_TOP_ZONE_PX = 50
const EXIT_UPPER_FRACTION = 0.4
const EXIT_MIN_UPWARD_PX = 10
const DESKTOP = '(min-width: 1024px) and (hover: hover) and (pointer: fine)'
const SHOWN_KEY = 'ah-leave-popup-shown'

function shownThisSession() {
  try {
    return window.sessionStorage.getItem(SHOWN_KEY) === '1'
  } catch {
    return false
  }
}

function rememberShown() {
  try {
    window.sessionStorage.setItem(SHOWN_KEY, '1')
  } catch {
    // No storage: the page-load flag in the component still holds it to once.
  }
}

// As the old popup: Amplitude in the browser, only after "Accepter alle" (lib/analytics.ts
// starts it then). The SDK is loaded on demand, so it stays out of the page's own script.
function track(event: 'Exit Intent Shown' | 'Exit Intent Dismissed') {
  if (readCookieChoice() !== 'all') return
  void import('@amplitude/analytics-browser').then((amplitude) => amplitude.track(event, { path: window.location.pathname }))
}

export default function LeavePopup() {
  const dialog = useRef<HTMLDialogElement>(null)
  const restore = useRef<HTMLElement | null>(null)
  const pressOnBackdrop = useRef(false)

  useEffect(() => {
    let armed = false
    let shown = false
    let lastMoveY = -Infinity
    const arm = window.setTimeout(() => {
      armed = true
    }, ARM_DELAY_MS)

    const maybeOpen = (e: MouseEvent) => {
      if (!armed || shown) return
      const inTopZone = e.clientY <= EXIT_TOP_ZONE_PX
      const upwardFlick = e.clientY < window.innerHeight * EXIT_UPPER_FRACTION && lastMoveY - e.clientY > EXIT_MIN_UPWARD_PX
      if (!inTopZone && !upwardFlick) return
      if (!window.matchMedia(DESKTOP).matches) return
      // Not on top of the menu sheet, the cookie banner or a fullscreen video.
      if (document.fullscreenElement || document.querySelector('dialog[open], [role="dialog"]')) return
      if (shownThisSession()) return
      shown = true
      rememberShown()
      teardown()
      restore.current = document.activeElement as HTMLElement | null
      const element = dialog.current as HTMLDialogElement
      element.showModal()
      element.focus()
      track('Exit Intent Shown')
    }
    const onMouseMove = (e: MouseEvent) => {
      lastMoveY = e.clientY
    }
    // relatedTarget is null when the pointer leaves the document itself.
    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) maybeOpen(e)
    }
    // Safari is unreliable with mouseout on leaving the window; mouseleave on the root covers it.
    const root = document.documentElement
    const teardown = () => {
      document.removeEventListener('mouseout', onMouseOut)
      root.removeEventListener('mouseleave', maybeOpen)
      document.removeEventListener('mousemove', onMouseMove)
    }
    document.addEventListener('mouseout', onMouseOut)
    root.addEventListener('mouseleave', maybeOpen)
    document.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => {
      window.clearTimeout(arm)
      teardown()
    }
  }, [])

  // Every way out (Escape, the button, the backdrop) ends in the dialog's close event.
  const onClose = () => {
    track('Exit Intent Dismissed')
    restore.current?.focus?.()
  }
  const close = () => dialog.current?.close()

  return (
    <dialog
      ref={dialog}
      className="leave"
      tabIndex={-1}
      aria-labelledby="leave-title"
      onClose={onClose}
      onPointerDown={(e) => {
        pressOnBackdrop.current = e.target === e.currentTarget
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && pressOnBackdrop.current) close()
      }}
    >
      <div className="leave-card">
        <button type="button" className="leave-close" aria-label={LEAVE.close} onClick={close}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <h2 id="leave-title" className="leave-title">
          {LEAVE.title}
        </h2>
        <p className="leave-body">{LEAVE.body}</p>
        <div className="leave-codes">
          <figure>
            <Image src="/site/qr/app-store.svg" alt={QR.appStoreAlt} width={57} height={57} loading="lazy" />
            <figcaption>{QR.appStore}</figcaption>
          </figure>
          <figure>
            <Image src="/site/qr/google-play.svg" alt={QR.googlePlayAlt} width={57} height={57} loading="lazy" />
            <figcaption>{QR.googlePlay}</figcaption>
          </figure>
        </div>
      </div>
    </dialog>
  )
}
