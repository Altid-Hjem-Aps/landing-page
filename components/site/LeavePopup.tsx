'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { readCookieChoice } from '@/lib/cookie-consent'

// Computers only: when the mouse leaves the window through the top, headed for the tab bar,
// the QR code once more, once per browser session. The trigger is the old site's signup
// popup (ExitIntentModal): armed after a few seconds, the top zone or a fast upward flick,
// never on top of another dialog. The popup itself (LeaveDialog) loads only when it is needed.
const LeaveDialog = dynamic(() => import('./LeaveDialog'), { ssr: false })

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

export default function LeavePopup({ proof }: { proof: string }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let armed = false
    let shown = false
    let lastMoveY = -Infinity
    const arm = window.setTimeout(() => {
      armed = true
      // A computer that may see the popup: fetch its script now, so the letter opens at once.
      if (window.matchMedia(DESKTOP).matches && !shownThisSession()) void import('./LeaveDialog')
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
      setOpen(true)
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

  if (!open) return null
  return (
    <LeaveDialog
      proof={proof}
      onClose={() => {
        track('Exit Intent Dismissed')
        setOpen(false)
      }}
    />
  )
}
