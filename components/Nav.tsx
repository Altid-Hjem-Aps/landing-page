'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as amplitude from '@amplitude/analytics-browser'
import { Logo } from '@/components/Logo'
import { GetAppLink } from '@/components/site/primitives/StorePills'
import PauseMotion from '@/components/site/primitives/PauseMotion'
import { STORE_ANCHOR } from '@/lib/store-links'

// One opaque Cream pill floating at the top, on every page and over every
// section: the same colours everywhere, and "Hent appen" always in reach.

const NAV_LINKS = [
  { label: 'Økonomi', href: '/#okonomi' },
  { label: 'Altid Mad', href: '/#altid-mad' },
  { label: 'Altid Energi', href: '/#altid-energi' },
  { label: 'Altid Forsikring', href: '/#altid-forsikring' },
  { label: 'Spørgsmål', href: '/#spoergsmaal' },
]

// The campaign banner is hidden at the top and only slides in once the user
// starts scrolling (a small distance down, so it doesn't flicker).
const BANNER_REVEAL = 8

interface BannerConfig {
  /** Long lead-in: only shown from md (768px), where it fits on one line. */
  longPrefix: string
  /** Short lead-in for narrow screens. */
  shortPrefix: string
  /** Amplitude source for banner clicks, e.g. 'spiir-banner'. */
  source: string
  /** Banner CTA text: falls back to "Hent appen". */
  cta?: string
}

interface NavProps {
  /** Show the Spiir campaign banner above the menu (only on /spiir-alternativ). */
  spiirBanner?: boolean
  /** Generic campaign banner above the menu: same look as the Spiir banner. */
  banner?: BannerConfig
  /** The control that stops the page's loops. Only the front page has loops. */
  motionControl?: boolean
}

const SPIIR_BANNER: BannerConfig = {
  longPrefix: 'Spiir er lukket. Mist ikke overblikket over dine faste udgifter. ',
  shortPrefix: 'Brugte du Spiir? ',
  source: 'spiir-banner',
}

function Pill({ motionControl = false }: { motionControl?: boolean }) {
  return (
    <nav
      aria-label="Hovedmenu"
      className="pointer-events-auto flex h-[60px] w-full max-w-[560px] items-center justify-between gap-6 rounded-full border pl-5 pr-1.5 md:h-16 md:pl-6 md:pr-2.5 min-[960px]:w-auto min-[960px]:max-w-none"
      style={{ background: 'var(--ah-cream)', borderColor: 'rgb(22 50 35 / 0.12)', color: 'var(--ah-dark-forest)' }}
    >
      {/* 96 px is the wordmark's minimum width in the logo pack. */}
      <Link href="/" aria-label="Altid Hjem forside" className="shrink-0">
        <Logo className="h-auto w-24" variant="dark" />
      </Link>
      <ul className="hidden min-[960px]:flex items-center gap-0.5">
        {NAV_LINKS.map(({ label, href }) => (
          <li key={href}>
            <a
              href={href}
              className="inline-flex min-h-[44px] items-center rounded-full px-3.5 text-[15px] font-medium whitespace-nowrap transition-colors hover:bg-[var(--ah-sand)]"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
      <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
        {motionControl && <PauseMotion />}
        <GetAppLink
          className="inline-flex min-h-[44px] shrink-0 items-center rounded-full px-4 text-[14px] font-medium whitespace-nowrap transition-opacity hover:opacity-90 md:min-h-[48px] md:px-5 md:text-[15px]"
          style={{ background: 'var(--ah-deep-forest)', color: 'var(--ah-cream)' }}
        />
      </div>
    </nav>
  )
}

// With a banner: the pill "morphs" into the slim banner strip as soon as the user
// leaves the top. The strip carries its own "Hent appen"; the pill only returns
// once back at the very top.
function BannerNav({ config }: { config: BannerConfig }) {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > BANNER_REVEAL)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleCTA() {
    amplitude.track('Get App CTA Clicked', { source: config.source })
    // Scroll to the store pills on this page. A page without pills goes to the
    // front page's: router.push, not a full load, so the tracked event isn't dropped.
    const pills = document.getElementById(STORE_ANCHOR)
    if (pills) {
      pills.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    router.push(`/#${STORE_ANCHOR}`)
  }

  return (
    <div className="ah-chrome fixed top-0 left-0 right-0 z-[100] pointer-events-none">
      {/* Campaign banner (~36px: if the height changes, the pages' pt-32 must
          follow). The long text only from md (768px): on narrower screens it would
          wrap to two lines and push content under the page's pt-32. */}
      <div
        className="relative z-10 pointer-events-auto"
        style={{
          overflow: 'hidden',
          maxHeight: scrolled ? '60px' : '0',
          opacity: scrolled ? 1 : 0,
          transition: 'max-height 300ms ease, opacity 300ms ease',
        }}
      >
        <button
          type="button"
          onClick={handleCTA}
          tabIndex={scrolled ? 0 : -1}
          aria-hidden={!scrolled}
          className="block w-full text-center px-4 py-2 text-[12.5px] sm:text-[13px] font-medium"
          style={{
            background: 'var(--ah-cream)',
            color: 'var(--ah-dark-forest)',
            borderBottom: '1px solid rgb(22 50 35 / 0.12)',
            touchAction: 'manipulation',
            cursor: 'pointer',
          }}
        >
          <span className="hidden md:inline align-middle">{config.longPrefix}</span>
          <span className="md:hidden align-middle">{config.shortPrefix}</span>
          <span
            className="inline-block align-middle ml-2 px-3 py-1 rounded-full font-medium"
            style={{ background: 'var(--ah-deep-forest)', color: 'var(--ah-cream)' }}
          >
            {(config.cta ?? 'Hent appen').replace(/\s*→\s*$/, '')}
          </span>
        </button>
      </div>
      <div
        className="absolute inset-x-0 top-3 flex justify-center px-3"
        inert={scrolled}
        style={{
          transform: scrolled ? 'translateY(-140%)' : 'translateY(0)',
          transition: 'transform 300ms ease',
        }}
      >
        <Pill />
      </div>
    </div>
  )
}

export default function Nav({ spiirBanner = false, banner, motionControl = false }: NavProps) {
  // The Spiir banner is just a fixed configuration of the generic banner.
  const bannerConfig = banner ?? (spiirBanner ? SPIIR_BANNER : null)
  if (bannerConfig) return <BannerNav config={bannerConfig} />
  return (
    <div className="ah-chrome fixed inset-x-0 top-3 z-[100] flex justify-center px-3 pointer-events-none">
      <Pill motionControl={motionControl} />
    </div>
  )
}
