'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import * as amplitude from '@amplitude/analytics-browser'
import { Logo } from '@/components/Logo'

const HIDE_THRESHOLD = 80
// Larger delta on touch UAs absorbs the iOS Safari URL-bar collapse jump,
// which can fire ~30px of phantom scrollY without a real user gesture.
const SCROLL_DELTA_DESKTOP = 6
const SCROLL_DELTA_TOUCH = 30

interface BannerConfig {
  /** Lang indledning — vises kun fra md (768px), hvor den kan stå på én linje. */
  longPrefix: string
  /** Kort indledning til smalle skærme. */
  shortPrefix: string
  /** Amplitude-source for klik på banneret, fx 'spiir-banner'. */
  source: string
  /** CTA-tekst i banneret — falder tilbage til 'Skriv dig på ventelisten →'. */
  cta?: string
}

interface NavProps {
  /** Vis Spiir-kampagnebanneret over menuen (kun på /spiir-alternativ). */
  spiirBanner?: boolean
  /** Generelt kampagnebanner over menuen — samme udseende som Spiir-banneret. */
  banner?: BannerConfig
}

const SPIIR_BANNER: BannerConfig = {
  longPrefix: 'Spiir er lukket — mist ikke overblikket over dine faste udgifter. ',
  shortPrefix: 'Brugte du Spiir? ',
  source: 'spiir-banner',
}

export default function Nav({ spiirBanner = false, banner }: NavProps) {
  const router = useRouter()
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

  function handleCTA(source: string) {
    amplitude.track('Waitlist CTA Clicked', { source })
    // Har siden sin egen tilmeldingsformular (fx /spiir-alternativ's BottomCta,
    // id 'venteliste2'), så scroll til den — det bevarer sidens signup_source.
    // Ellers: forsidens hero-formular (kun på '/' findes 'expand-waitlist'-
    // lytteren; alle andre steder navigeres hjem med #venteliste-hash).
    const onPageForm = document.getElementById('venteliste2')
    if (onPageForm) {
      onPageForm.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    if (window.location.pathname !== '/') {
      router.push('/#venteliste')
      return
    }
    window.dispatchEvent(new CustomEvent('expand-waitlist'))
  }

  const navInner = (
    <>
      <a href="/">
        <Logo className="h-11 w-auto" variant="dark" />
      </a>
      <button
        type="button"
        onClick={() => handleCTA('nav')}
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
    </>
  )

  // Spiir-banneret er blot en fast konfiguration af det generelle banner.
  const bannerConfig = banner ?? (spiirBanner ? SPIIR_BANNER : null)

  // Uden banner: PRÆCIS den oprindelige struktur — fixed + transform +
  // backdrop-filter direkte på <nav>. Forsiden må ikke ændre sig, og
  // backdrop-filter under en transformeret forælder er kendt WebKit-bøvl,
  // så den kombination undgås helt her.
  if (!bannerConfig) {
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
        {navInner}
      </nav>
    )
  }

  // Med banner: banner + nav glider op/ned som én enhed.
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 300ms ease',
        willChange: 'transform',
      }}
    >
      {/* Kampagnebanner (~36px — ændres højden, skal sidernes pt-32 følge med).
          Den lange tekst først fra md (768px) — på smallere skærme ville den
          ombrydes til to linjer og skubbe indholdet under sidens pt-32. */}
      <button
        type="button"
        onClick={() => handleCTA(bannerConfig.source)}
        className="block w-full text-center px-4 py-2 text-[12.5px] sm:text-[13px] font-medium"
        style={{
          background: 'var(--forest)',
          color: 'rgba(255,255,255,0.85)',
          transform: 'translateZ(0)',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          cursor: 'pointer',
        }}
      >
        <span
          className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle"
          style={{ background: 'var(--sage)' }}
        />
        <span className="hidden md:inline">{bannerConfig.longPrefix}</span>
        <span className="md:hidden">{bannerConfig.shortPrefix}</span>
        <span className="font-semibold" style={{ color: 'var(--sage)' }}>
          {bannerConfig.cta ?? 'Skriv dig på ventelisten →'}
        </span>
      </button>
      <nav
        className="flex items-center justify-between px-5 sm:px-8 lg:px-12 py-5"
        style={{
          background: 'rgba(245,240,232,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(46,125,82,0.08)',
        }}
      >
        {navInner}
      </nav>
    </div>
  )
}
