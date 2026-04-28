'use client'

import { useEffect, useRef, useState } from 'react'
import PhoneShell from './iphone/PhoneShell'
import HomeScreen from './iphone/HomeScreen'
import SubbrandsScreen from './iphone/SubbrandsScreen'
import SmartTipsScreen from './iphone/SmartTipsScreen'

export default function IPhoneMockup() {
  const [hovered, setHovered] = useState(false)
  // JS-driven md+ gate. Tailwind's `hidden md:block` was leaking the
  // back phones onto phone-width iOS Safari in dev (CSS class order /
  // HMR injection inconsistency). Hard-gate the render in JS so the
  // side phones simply do not exist in the DOM under 768px.
  const [showSidePhones, setShowSidePhones] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia('(min-width: 768px)')
    const sync = () => setShowSidePhones(mql.matches)
    sync()
    mql.addEventListener('change', sync)
    return () => mql.removeEventListener('change', sync)
  }, [])

  // Drive `hovered` from scroll visibility: the only natural "interaction"
  // available on touch devices when the mockup enters the viewport.
  // Hover/tap still override on desktop and mobile respectively.
  // Single-threshold IntersectionObserver (some old iOS Safari builds
  // mishandle threshold arrays) plus a 1.5s fallback that flips hovered
  // on if IO never fires — better degraded animation than no animation.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let ioFired = false
    const fallback = setTimeout(() => {
      if (!ioFired) setHovered(true)
    }, 1500)

    if (typeof IntersectionObserver === 'undefined') {
      return () => clearTimeout(fallback)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        ioFired = true
        setHovered(entry.isIntersecting)
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => {
      clearTimeout(fallback)
      observer.disconnect()
    }
  }, [])

  function onEnter() {
    setHovered(true)
  }
  function onLeave() {
    setHovered(false)
  }

  return (
    <div className="flex justify-center w-full">
      <div
        ref={containerRef}
        className="relative w-[270px] md:w-[580px]"
        style={{
          height: 580,
        }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onTouchStart={onEnter}
        onTouchEnd={() => {
          if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
          resetTimerRef.current = setTimeout(onLeave, 2800)
        }}
      >
        {/* Back-left: Subbrands — md+ only, JS-gated */}
        {showSidePhones && (
          <div
            className="absolute"
            style={{
              left: '50%',
              top: 30,
              transform: hovered
                ? 'translateX(-50%) translateX(-185px) translateY(-6px) rotate(-11deg) scale(0.85)'
                : 'translateX(-50%) translateX(-175px) translateY(0) rotate(-10deg) scale(0.85)',
              transformOrigin: 'center bottom',
              zIndex: 1,
              opacity: 0.94,
              filter: 'saturate(0.92)',
              transition: 'transform 0.6s cubic-bezier(0.34, 1.2, 0.64, 1)',
            }}
          >
            <PhoneShell variant="back" hovered={hovered}>
              <SubbrandsScreen hovered={hovered} />
            </PhoneShell>
          </div>
        )}

        {/* Back-right: Smart tips — md+ only, JS-gated */}
        {showSidePhones && (
          <div
            className="absolute"
            style={{
              left: '50%',
              top: 30,
              transform: hovered
                ? 'translateX(-50%) translateX(185px) translateY(-6px) rotate(11deg) scale(0.85)'
                : 'translateX(-50%) translateX(175px) translateY(0) rotate(10deg) scale(0.85)',
              transformOrigin: 'center bottom',
              zIndex: 1,
              opacity: 0.94,
              filter: 'saturate(0.92)',
              transition: 'transform 0.6s cubic-bezier(0.34, 1.2, 0.64, 1)',
            }}
          >
            <PhoneShell variant="back" hovered={hovered}>
              <SmartTipsScreen hovered={hovered} />
            </PhoneShell>
          </div>
        )}

        {/* Foreground: Hjem — always visible, lifts on hover */}
        <div
          className="absolute"
          style={{
            left: '50%',
            top: 0,
            transform: hovered ? 'translateX(-50%) translateY(-10px)' : 'translateX(-50%) translateY(0)',
            zIndex: 2,
            transition: hovered
              ? 'transform 0.7s cubic-bezier(0.34, 1.2, 0.64, 1)'
              : 'transform 0.5s ease',
          }}
        >
          <PhoneShell hovered={hovered}>
            <HomeScreen hovered={hovered} />
          </PhoneShell>
        </div>
      </div>
    </div>
  )
}
