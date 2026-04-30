'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import PhoneShell from './iphone/PhoneShell'
import HomeScreen from './iphone/HomeScreen'
import SubbrandsScreen from './iphone/SubbrandsScreen'
import SmartTipsScreen from './iphone/SmartTipsScreen'

const SCREEN_COUNT = 3
const AUTO_ADVANCE_MS = 3000
const RESUME_AFTER_MS = 5000
const SWIPE_THRESHOLD = 40

export default function IPhoneMockup() {
  const [hovered, setHovered] = useState(false)
  const [showSidePhones, setShowSidePhones] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartX = useRef<number | null>(null)
  const hoverCountRef = useRef(0)
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // JS-driven md+ gate — prevents side phones leaking into mobile DOM
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia('(min-width: 768px)')
    const sync = () => setShowSidePhones(mql.matches)
    sync()
    mql.addEventListener('change', sync)
    return () => mql.removeEventListener('change', sync)
  }, [])

  // Drive `hovered` from scroll visibility — single threshold avoids
  // old iOS Safari bugs with threshold arrays; 1.5s fallback fires if IO never fires.
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

  // Carousel autoplay — mobile only
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    autoPlayRef.current = setInterval(() => {
      setCarouselIndex(i => (i + 1) % SCREEN_COUNT)
    }, AUTO_ADVANCE_MS)
  }, [])

  const pauseAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    autoPlayRef.current = null
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(startAutoPlay, RESUME_AFTER_MS)
  }, [startAutoPlay])

  useEffect(() => {
    if (showSidePhones) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
      return
    }
    if (hovered) {
      startAutoPlay()
    } else {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [hovered, showSidePhones, startAutoPlay])

  useEffect(() => {
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    }
  }, [])

  // Per-phone desktop hover — only fires when cursor is over an actual phone shape
  function onPhoneEnter() {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current)
    hoverCountRef.current++
    setHovered(true)
  }
  function onPhoneLeave() {
    hoverCountRef.current--
    leaveTimerRef.current = setTimeout(() => {
      if (hoverCountRef.current <= 0) {
        hoverCountRef.current = 0
        setHovered(false)
      }
    }, 50)
  }

  // Swipe handlers
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    pauseAutoPlay()
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < SWIPE_THRESHOLD) return
    setCarouselIndex(i =>
      delta < 0 ? Math.min(i + 1, SCREEN_COUNT - 1) : Math.max(i - 1, 0),
    )
  }

  function goToSlide(i: number) {
    setCarouselIndex(i)
    pauseAutoPlay()
  }

  const screens = [
    (active: boolean) => <HomeScreen hovered={active} />,
    (active: boolean) => <SubbrandsScreen hovered={active} />,
    (active: boolean) => <SmartTipsScreen hovered={active} />,
  ]

  return (
    <div ref={containerRef} className="flex justify-center w-full">
      {showSidePhones ? (
        /* Desktop: three phones fan out on hover */
        <div
          className="relative w-[580px]"
          style={{ height: 580 }}
          onTouchStart={() => setHovered(true)}
          onTouchEnd={() => {
            if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
            resetTimerRef.current = setTimeout(() => setHovered(false), 2800)
          }}
        >
          {/* Back-left: Subbrands */}
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
            onMouseEnter={onPhoneEnter}
            onMouseLeave={onPhoneLeave}
          >
            <PhoneShell variant="back" hovered={hovered}>
              <SubbrandsScreen hovered={hovered} />
            </PhoneShell>
          </div>

          {/* Back-right: Smart tips */}
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
            onMouseEnter={onPhoneEnter}
            onMouseLeave={onPhoneLeave}
          >
            <PhoneShell variant="back" hovered={hovered}>
              <SmartTipsScreen hovered={hovered} />
            </PhoneShell>
          </div>

          {/* Foreground: Hjem */}
          <div
            className="absolute"
            style={{
              left: '50%',
              top: 0,
              transform: hovered
                ? 'translateX(-50%) translateY(-10px)'
                : 'translateX(-50%) translateY(0)',
              zIndex: 2,
              transition: hovered
                ? 'transform 0.7s cubic-bezier(0.34, 1.2, 0.64, 1)'
                : 'transform 0.5s ease',
            }}
            onMouseEnter={onPhoneEnter}
            onMouseLeave={onPhoneLeave}
          >
            <PhoneShell hovered={hovered}>
              <HomeScreen hovered={hovered} />
            </PhoneShell>
          </div>
        </div>
      ) : (
        /* Mobile: single phone, screens slide inside */
        <div className="flex flex-col items-center">
          <PhoneShell hovered={hovered}>
            <div
              style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                style={{
                  display: 'flex',
                  height: '100%',
                  width: `${SCREEN_COUNT * 100}%`,
                  transform: `translateX(${-carouselIndex * (100 / SCREEN_COUNT)}%)`,
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {screens.map((renderScreen, i) => (
                  <div
                    key={i}
                    style={{
                      width: `${100 / SCREEN_COUNT}%`,
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                  >
                    {renderScreen(hovered && carouselIndex === i)}
                  </div>
                ))}
              </div>
            </div>
          </PhoneShell>

          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            {Array.from({ length: SCREEN_COUNT }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Skærm ${i + 1}`}
                style={{
                  width: carouselIndex === i ? 18 : 6,
                  height: 6,
                  borderRadius: 999,
                  background:
                    carouselIndex === i ? 'var(--forest)' : 'rgba(26,61,34,0.2)',
                  transition: 'width 0.3s ease, background 0.3s ease',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
