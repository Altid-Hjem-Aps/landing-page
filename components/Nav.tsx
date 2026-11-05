'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import * as amplitude from '@amplitude/analytics-browser'
import { Logo } from '@/components/Logo'

const HIDE_THRESHOLD = 80
// The campaign banner is hidden at the top and only slides in once the user
// starts scrolling (≈ a small distance down, so it doesn't flicker).
const BANNER_REVEAL = 8
// Larger delta on touch UAs absorbs the iOS Safari URL-bar collapse jump,
// which can fire ~30px of phantom scrollY without a real user gesture.
const SCROLL_DELTA_DESKTOP = 6
const SCROLL_DELTA_TOUCH = 30
// An anchor jump (/#altid-forsikring from a mail, a nav link, Hent appen)
// counts as settled once no scroll event has come for this long.
const ANCHOR_SETTLE_MS = 150

// The navigation lists the four live services of the Altid Hjem app, each an
// anchor on the front page (the ids are a contract: mails and shared links
// point at them too). On the front page the links stay in the document
// (#id); elsewhere they lead to the front page (/#id).
interface NavLink {
  label: string
  id: string
}
const NAV_LINKS: NavLink[] = [
  { label: 'Økonomi', id: 'okonomi' },
  { label: 'Altid Mad', id: 'altid-mad' },
  { label: 'Altid Energi', id: 'altid-energi' },
  { label: 'Altid Forsikring', id: 'altid-forsikring' },
]
// The hero's store badges.
const GET_APP_ID = 'hent-appen'
const GET_APP_LABEL = 'Hent appen'

interface BannerConfig {
  /** Long lead-in — only shown from md (768px), where it fits on one line. */
  longPrefix: string
  /** Short lead-in for narrow screens. */
  shortPrefix: string
  /** Amplitude source for banner clicks, e.g. 'spiir-banner'. */
  source: string
  /** Banner CTA text; falls back to the get-the-app label. */
  cta?: string
}

interface NavProps {
  /** Show the Spiir campaign banner above the menu (only on /spiir-alternativ). */
  spiirBanner?: boolean
  /** Generic campaign banner above the menu — same look as the Spiir banner. */
  banner?: BannerConfig
}

const SPIIR_BANNER: BannerConfig = {
  longPrefix: 'Spiir er lukket. Mist ikke overblikket over dine faste udgifter. ',
  shortPrefix: 'Brugte du Spiir? ',
  source: 'spiir-banner',
}

// Colours from the CVI frame (node 45:6428)
// The app palette tokens (app/globals.css).
const FOREST = 'var(--app-forest)'
const SIGNAL = 'var(--app-signal)'
const BRAND_GREEN = 'var(--app-brand-green)'

export default function Nav({ spiirBanner = false, banner }: NavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastY = useRef(0)

  // Close the burger menu on page navigation.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    lastY.current = window.scrollY
    setScrolled(window.scrollY > BANNER_REVEAL)
    const isTouch =
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: none) and (pointer: coarse)').matches
    const delta = isTouch ? SCROLL_DELTA_TOUCH : SCROLL_DELTA_DESKTOP

    // A jump to a section scrolls down without the visitor scrolling. While it
    // runs (smooth scrolling sends many events) the nav stays visible and only
    // follows the position, so the section lands under a visible nav instead
    // of under the gap the hidden nav leaves.
    let anchorJump = false
    let settle: ReturnType<typeof setTimeout> | undefined
    function armSettle() {
      clearTimeout(settle)
      settle = setTimeout(() => {
        anchorJump = false
        lastY.current = window.scrollY
      }, ANCHOR_SETTLE_MS)
    }
    function holdForAnchorJump() {
      anchorJump = true
      lastY.current = window.scrollY
      setHidden(false)
      armSettle()
    }
    // A click on a link to a section of this page. Covers the case hashchange
    // misses: the link to the section already in the URL scrolls again but
    // fires no hashchange.
    function onClick(e: MouseEvent) {
      const link = e.target instanceof Element ? e.target.closest('a') : null
      if (link && link.hash && link.pathname === window.location.pathname) holdForAnchorJump()
    }
    // Loaded with a hash: the browser's jump may still be on its way.
    if (window.location.hash) {
      anchorJump = true
      armSettle()
    }

    function onScroll() {
      const y = window.scrollY

      // The banner reveal must not wait for the delta gate: it has to react
      // to the very first scrolled pixel.
      setScrolled(y > BANNER_REVEAL)

      if (anchorJump) {
        lastY.current = y
        armSettle()
        return
      }

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
    window.addEventListener('hashchange', holdForAnchorJump)
    document.addEventListener('click', onClick, true)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('hashchange', holdForAnchorJump)
      document.removeEventListener('click', onClick, true)
      clearTimeout(settle)
    }
  }, [])

  function handleCTA(source: string) {
    amplitude.track('Get App CTA Clicked', { source })
    // The page's own store badges (the SEO pages' BottomCta) when it has them,
    // otherwise the store badges on the front page.
    const onPageBadges = document.getElementById(GET_APP_ID)
    if (onPageBadges) {
      onPageBadges.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    router.push(`/#${GET_APP_ID}`)
  }

  // The three Hent appen controls lead to the hero's store badges. The badge
  // click itself is the counted conversion; this only tells which control
  // brought the visitor there (consent-gated browser SDK, the page stays).
  function onGetApp(source: 'nav' | 'nav-pill' | 'nav-panel') {
    setMenuOpen(false)
    amplitude.track('Get App CTA Clicked', { source })
  }

  // Same document on the front page, the front page's anchor elsewhere.
  const onFrontPage = pathname === '/'
  const anchor = (id: string) => (onFrontPage ? `#${id}` : `/#${id}`)

  // Right-aligned desktop menu: links + CTA in ONE flex with a shared gap, so
  // the spacing between the words = the spacing between the last link and the
  // CTA button (per Figma). The gap is tighter than the old six short labels
  // had, so the four brand names and the CTA fit at 1280px.
  const desktopMenu = (
    <div className="hidden xl:flex items-center gap-[clamp(28px,3vw,64px)]">
      {NAV_LINKS.map(({ label, id }) => (
        <a
          key={id}
          href={anchor(id)}
          className="text-[16px] font-medium text-white transition-opacity hover:opacity-80 whitespace-nowrap"
        >
          {label}
        </a>
      ))}
      <a
        href={anchor(GET_APP_ID)}
        onClick={() => onGetApp('nav')}
        className="inline-flex items-center justify-center font-medium rounded-[20px] transition-opacity hover:opacity-90 whitespace-nowrap text-[16px] leading-tight w-[clamp(180px,12vw,240px)] py-[23px]"
        style={{
          background: SIGNAL,
          color: BRAND_GREEN,
          transform: 'translateZ(0)',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {GET_APP_LABEL}
      </a>
    </div>
  )

  // Below xl: a compact store pill next to the burger, so the phone nav
  // always shows the way to the app.
  const mobilePill = (
    <a
      href={anchor(GET_APP_ID)}
      onClick={() => onGetApp('nav-pill')}
      className="xl:hidden ml-auto inline-flex h-11 items-center rounded-[20px] px-4 text-[14px] font-medium whitespace-nowrap"
      style={{ background: SIGNAL, color: BRAND_GREEN, touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
    >
      {GET_APP_LABEL}
    </a>
  )

  // Burger button, only below the xl breakpoint. Toggles between hamburger and cross.
  const burger = (
    <button
      type="button"
      aria-label={menuOpen ? 'Luk menu' : 'Åbn menu'}
      aria-expanded={menuOpen}
      onClick={() => setMenuOpen(o => !o)}
      className="xl:hidden shrink-0 flex items-center justify-center w-10 h-10 -mr-1"
      style={{ color: '#fff', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {menuOpen ? (
          <>
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </>
        ) : (
          <>
            <line x1="3" y1="7" x2="21" y2="7" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="17" x2="21" y2="17" />
          </>
        )}
      </svg>
    </button>
  )

  // Drop-down panel with all links, shown while the burger is open (below xl only).
  const mobilePanel = menuOpen && (
    <div
      className="xl:hidden absolute top-full left-0 right-0 overflow-hidden"
      style={{
        background: FOREST,
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 18px 40px rgba(0,0,0,0.28)',
        animation: 'slide-down-fade 0.2s ease',
      }}
    >
      <ul className="flex flex-col px-5 sm:px-8 pt-2">
        {NAV_LINKS.map(({ label, id }) => (
          <li key={id}>
            <a
              href={anchor(id)}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 py-3.5 text-[17px] font-medium text-white"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
      <div className="px-5 sm:px-8 py-4">
        <a
          href={anchor(GET_APP_ID)}
          onClick={() => onGetApp('nav-panel')}
          className="block w-full text-center text-base font-medium py-3.5 rounded-[20px]"
          style={{ background: SIGNAL, color: BRAND_GREEN, touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        >
          {GET_APP_LABEL}
        </a>
      </div>
    </div>
  )

  const navInner = (
    <>
      <a href="/" aria-label="Altid Hjem forside" className="shrink-0">
        <Logo className="h-11 w-auto" variant="forest" />
      </a>
      {desktopMenu}
      {mobilePill}
      {burger}
      {mobilePanel}
    </>
  )

  // The Spiir banner is just a fixed configuration of the generic banner.
  const bannerConfig = banner ?? (spiirBanner ? SPIIR_BANNER : null)

  // Without a banner: fixed forest bar that hides on scroll down and returns
  // on scroll up.
  if (!bannerConfig) {
    return (
      <nav
        className="focus-ring-dark fixed top-0 left-0 right-0 z-[100] px-5 sm:px-8 lg:px-9 py-5"
        style={{
          background: FOREST,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 300ms ease',
          willChange: 'transform',
        }}
      >
        <div className="max-w-[1848px] mx-auto flex items-center justify-between gap-3 sm:gap-6">
          {navInner}
        </div>
      </nav>
    )
  }

  // With a banner: the nav "morphs" into the slim beige banner strip as soon
  // as the user leaves the top — the full nav slides up behind the banner and
  // the banner slides in. The nav only returns once back at the very top.
  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      {/* Campaign banner (~36px — if the height changes, the pages' pt-32 must
          follow). Hidden at the top (maxHeight 0), slides in on scroll and
          stays pinned. Higher z than the nav so the nav can hide behind it.
          The long text only from md (768px) — on narrower screens it would
          wrap to two lines and push content under the page's pt-32. */}
      <div
        className="relative z-10"
        style={{
          overflow: 'hidden',
          maxHeight: scrolled ? '60px' : '0',
          opacity: scrolled ? 1 : 0,
          transition: 'max-height 300ms ease, opacity 300ms ease',
        }}
      >
        <button
          type="button"
          onClick={() => handleCTA(bannerConfig.source)}
          tabIndex={scrolled ? 0 : -1}
          aria-hidden={!scrolled}
          className="block w-full text-center px-4 py-2 text-[12.5px] sm:text-[13px] font-medium"
          style={{
            background: 'var(--cream)',
            color: FOREST,
            borderBottom: '1px solid rgba(26,61,34,0.10)',
            transform: 'translateZ(0)',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            cursor: 'pointer',
          }}
        >
          <span className="hidden md:inline align-middle">{bannerConfig.longPrefix}</span>
          <span className="md:hidden align-middle">{bannerConfig.shortPrefix}</span>
          <span
            className="inline-block align-middle ml-2 px-3 py-1 rounded-full font-medium"
            style={{ background: SIGNAL, color: BRAND_GREEN }}
          >
            {(bannerConfig.cta ?? GET_APP_LABEL).replace(/\s*→\s*$/, '')}
          </span>
        </button>
      </div>
      <nav
        className="focus-ring-dark relative z-0 px-5 sm:px-8 lg:px-9 py-5"
        style={{
          background: FOREST,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          transform: scrolled ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 300ms ease',
          willChange: 'transform',
        }}
      >
        <div className="max-w-[1848px] mx-auto flex items-center justify-between gap-3 sm:gap-6">
          {navInner}
        </div>
      </nav>
    </div>
  )
}
