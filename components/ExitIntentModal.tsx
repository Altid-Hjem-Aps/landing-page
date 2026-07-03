'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import * as amplitude from '@amplitude/analytics-browser'
import { hasJoinedWaitlist } from '@/lib/waitlist-joined'

// Exit-intent trigger (pattern from altidenergi.dk): when the cursor leaves
// the viewport through the top edge — headed for the tab bar / URL field —
// offer the waitlist one last time before the visitor is gone.
//
// This component is deliberately TINY: it lives in the root layout, so it
// must not pull framer-motion or the animation stage into every page's
// initial JS. The dialog body (ExitIntentDialog) is code-split and only
// loads when exit intent actually fires (prefetched on idle once armed).
const ExitIntentDialog = dynamic(() => import('@/components/ExitIntentDialog'), { ssr: false })

// Utility pages where a signup pitch would be wrong (account deletion, legal,
// the referral share page). New SEO pages get the dialog automatically.
// Matched on exact path or path segment, so /kontakt-os would NOT be excluded.
const EXCLUDED_PATHS = ['/slet-konto', '/privatlivspolitik', '/inviter', '/kontakt', '/preview']

// Ignore exit intent right after load: a cursor passing through the viewport
// while the page is still settling is navigation noise, not an exit.
const ARM_DELAY_MS = 3000

// Browsers sample the pointer, so a fast move toward the tab bar reports the
// exit several px INSIDE the viewport — a strict 0 misses most real exits.
// relatedTarget is already null (the cursor truly left the document), so this
// only decides whether the exit counts as "through the top".
const EXIT_TOP_ZONE_PX = 50

const SESSION_KEY = 'ah-exit-intent-shown'

// sessionStorage ACCESS throws SecurityError when cookies are blocked or the
// page runs in a sandboxed iframe — and an uncaught throw in a root-layout
// effect unmounts the whole tree. Degrade to "no guard" instead.
function safeSessionGet(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key)
  } catch {
    return null
  }
}
function safeSessionSet(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    // Guard unavailable — the dialog may show again next page load. Harmless.
  }
}

export default function ExitIntentModal() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const excluded = EXCLUDED_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))

  // Client-side navigation must not carry an open dialog onto the next page
  // (Back can land on an excluded page with the scroll lock still held).
  const prevPathname = useRef(pathname)
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname
      setOpen(false)
    }
  }, [pathname])

  useEffect(() => {
    if (excluded || open) return
    // Mouse-driven devices only — there is no exit intent to read on touch.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (safeSessionGet(SESSION_KEY)) return
    // Already on the waitlist (this browser signed up, or the API said "du
    // er allerede skrevet op") — never pitch the popup again.
    if (hasJoinedWaitlist()) return

    let armed = false
    const armTimer = setTimeout(() => {
      armed = true
      // The visitor qualifies (desktop, not shown yet) — warm the dialog
      // chunk off the critical path so the letter intro is instant on fire.
      const warm = () => { import('@/components/ExitIntentDialog') }
      if ('requestIdleCallback' in window) window.requestIdleCallback(warm)
      else setTimeout(warm, 2000)
    }, ARM_DELAY_MS)

    function onMouseOut(e: MouseEvent) {
      // Only a real exit through the TOP of the viewport (toward close/back/
      // URL bar) — relatedTarget is null when the cursor leaves the document.
      if (!armed || e.relatedTarget || e.clientY > EXIT_TOP_ZONE_PX) return
      // In fullscreen (e.g. the founder video) the dialog would render
      // invisibly behind the fullscreen element and burn its one showing.
      if (document.fullscreenElement) return
      if (safeSessionGet(SESSION_KEY)) return
      safeSessionSet(SESSION_KEY, '1')
      // One purpose served — stop listening for the rest of the session.
      document.removeEventListener('mouseout', onMouseOut)
      setOpen(true)
      amplitude.track('Exit Intent Shown', { path: window.location.pathname })
    }

    document.addEventListener('mouseout', onMouseOut)
    return () => {
      clearTimeout(armTimer)
      document.removeEventListener('mouseout', onMouseOut)
    }
  }, [excluded, open])

  if (!open) return null

  return <ExitIntentDialog onClose={() => setOpen(false)} />
}
