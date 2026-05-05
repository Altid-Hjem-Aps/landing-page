'use client'

import { useEffect, useRef, useState } from 'react'
import * as amplitude from '@amplitude/unified'
import { Logo } from '@/components/Logo'

const HIDE_THRESHOLD = 80
// Larger delta on touch UAs absorbs the iOS Safari URL-bar collapse jump,
// which can fire ~30px of phantom scrollY without a real user gesture.
const SCROLL_DELTA_DESKTOP = 6
const SCROLL_DELTA_TOUCH = 30

export default function Nav() {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY
    const isTouch =
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: none) and (pointer: coarse)').matches
    const delta = isTouch ? SCROLL_DELTA_TOUCH : SCROLL_DELTA_DESKTOP

    function onScroll() {
      const y = window.scrollY
      const dy = y - lastY.current

      if (Math.abs(dy) < delta) return

      if (y < HIDE_THRESHOLD) {
        setHidden(false)
      } else if (dy > 0) {
        setHidden(true)
      } else {
        setHidden(false)
      }

      lastY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleCTA() {
    amplitude.track('Waitlist CTA Clicked', { source: 'nav' })
    window.dispatchEvent(new CustomEvent('expand-waitlist'))
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 lg:px-12 py-5"
      style={{
        background: 'rgba(245,240,232,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(46,125,82,0.08)',
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 300ms ease',
        willChange: 'transform',
      }}
    >
      <a href="/">
        <Logo className="h-11 w-auto" variant="dark" />
      </a>
      <button
        type="button"
        onClick={handleCTA}
        className="text-xs sm:text-sm font-semibold px-3.5 sm:px-5 py-2.5 rounded-full transition-opacity hover:opacity-90 whitespace-nowrap"
        style={{
          background: 'var(--sage)',
          color: 'var(--forest)',
          // Lift onto its own compositor layer + opt out of iOS tap delay.
          // iOS Safari has dead tap zones inside fixed parents with
          // backdrop-filter; both lines below mitigate that.
          transform: 'translateZ(0)',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          cursor: 'pointer',
        }}
      >
        Skriv dig på ventelisten →
      </button>
    </nav>
  )
}
