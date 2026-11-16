'use client'

import { usePathname } from 'next/navigation'
import { useRef } from 'react'
import { trackEvent } from '@/lib/analytics'
import { PILL_QR } from '@/components/site/copy'
import PillQr from '@/components/site/PillQr'
import { useComputer } from '@/components/site/useComputer'
import { usePillEntrance } from '@/components/site/usePillEntrance'
import { guideSlug, sitePage } from '@/lib/site-counts'
import { guideQrImage, storeLink, type Store, type StorePosition } from '@/lib/store-links'

// The site's own store pills as tracked links (lib/store-links.ts): the look of
// the pre-launch ComingSoonStores pill, now with "Hent i" and a link. Thor chose
// these over the official store badges on 4 Nov 2026. Apple's and Google's brand
// rules on showing their marks this way were not checked. The official badges
// stay in use on /invitation only (components/StoreButtons.tsx).
//
// App Store comes first; on Android the data-platform attribute (app/layout.tsx)
// moves Google Play first via CSS (.store-badge-play). Together the pills need
// 339px on a phone (8px gap): side by side at 390px, wrapped at 375px and below.
// 44px is the minimum touch target.

// The click is counted by our server (app/api/forside/store-click), not by the
// browser SDK: the SDK only runs after cookie consent, and the click leaves the
// page. sendBeacon outlives the navigation, which goes ahead untouched.
/** A visitor who accepted statistics tapped a store link (the site's main step): the browser
 * event the old vs new conversion panel divides by visitors (drafts/site-conversion-old-vs-new-
 * plan-16nov.html, D5: the same method on both sides, cookie-accepting visitors only). It goes
 * out at once with beacon, because the tap leaves the page. Nothing without consent. */
export function trackStoreTap(store: Store, position: StorePosition) {
  trackEvent(APP_INTENT, { kind: 'store_tap', store, position }, { leaving: true })
}

/** The browser event for the site's main step: a store tap or a QR card opened. */
export const APP_INTENT = 'App Intent'

/** Counts a store tap with the page it came from (ALT-1713): a guide by its own name. */
export function countClick(store: Store, position: StorePosition) {
  const slug = sitePage(window.location.pathname)
  navigator.sendBeacon?.(
    '/api/forside/store-click',
    new Blob([JSON.stringify({ store, position, slug })], { type: 'application/json' }),
  )
}

/** The guide this page is, or null (ALT-1713). */
export function useGuide() {
  return guideSlug(usePathname())
}

/** The store link for this page: a guide's links carry the guide's own campaign. */
export function useStoreLink(): (store: Store) => string {
  const guide = useGuide()
  return (store) => storeLink(store, guide)
}

const PILL = 'inline-flex shrink-0 items-center gap-2 border py-3 leading-none whitespace-nowrap transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-[3px]'
// `motion` (the new site, Thor 15/11): version B of drafts/ALT-1420-cta-animations.html. The
// pills grow in from their icon the first time they are seen, fill Signal green from the
// bottom with the label rolling over on hover, and squeeze a little when pressed (.sp in
// app/site.css), so no fade on hover.
const PILL_MOTION = 'sp inline-flex shrink-0 items-center gap-2 border py-3 leading-none whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-[3px]'
const SIZES = {
  md: 'min-h-[44px] rounded-[20px] px-3 sm:px-4 text-sm',
  // 48 px on a phone, 52 from sm: the front page's hero and sheet.
  lg: 'site-pill min-h-[48px] sm:min-h-[52px] rounded-full px-[11px] sm:px-5 text-[14px] sm:text-[17px]',
}

const VARIANTS = {
  light: {
    focus: 'focus-visible:outline-[#163223]',
    pill: { borderColor: 'rgba(26, 61, 34, 0.18)', color: 'var(--text-mid)' },
    name: 'var(--text-dark)',
  },
  // On the forest sections. Border as the newsletter button in the same sections.
  dark: {
    focus: 'focus-visible:outline-[#90ff7c]',
    pill: { borderColor: 'rgba(255, 255, 255, 0.6)', color: '#fff' },
    name: '#fff',
  },
  // The new front page (ALT-1420), the mail breaker's fills. Alex asked on 1 Nov for
  // the CTA to pop. On Deep forest: Signal green and Cream. On Cream: Deep forest and
  // an outline.
  forest: {
    focus: 'focus-visible:outline-[#90ff7c]',
    pill: { background: '#90ff7c', borderColor: '#90ff7c', color: '#003c16' },
    play: { background: '#fdfaf4', borderColor: '#fdfaf4', color: '#003c16' },
    name: '#003c16',
  },
  cream: {
    focus: 'focus-visible:outline-[#003c16]',
    pill: { background: '#003c16', borderColor: '#003c16', color: '#fdfaf4' },
    play: { background: 'transparent', borderColor: 'rgba(0, 60, 22, 0.4)', color: '#003c16' },
    name: 'inherit',
  },
} satisfies Record<string, { focus: string; pill: React.CSSProperties; play?: React.CSSProperties; name: string }>

// The stores' small marks, also used by the front page's single phone button (GetAppButton).
export const STORE_MARK: Record<Store, string> = {
  appstore:
    'M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09v-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z',
  play: 'M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.61-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1.001 1.001 0 010 1.73l-2.808 1.626L15.117 12l2.581-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z',
}

const STORES: { store: Store; name: string; className?: string }[] = [
  { store: 'appstore', name: 'App Store', className: 'store-badge-appstore' },
  { store: 'play', name: 'Google Play', className: 'store-badge-play' },
]

export default function StoreBadges({
  position,
  className = '',
  variant = 'light',
  size = 'md',
  motion = false,
  qr = false,
}: {
  position: StorePosition
  className?: string
  variant?: keyof typeof VARIANTS
  size?: keyof typeof SIZES
  /** The new site's pill motion (see PILL_MOTION). */
  motion?: boolean
  /** On a computer each pill opens into its own store's QR code instead of linking (PillQr). */
  qr?: boolean
}) {
  const look: { focus: string; pill: React.CSSProperties; play?: React.CSSProperties; name: string } = VARIANTS[variant]
  const row = useRef<HTMLDivElement>(null)
  usePillEntrance(row, motion)
  const computer = useComputer()
  const hrefFor = useStoreLink()
  const guide = useGuide()
  return (
    <div ref={row} className={`flex flex-row flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-3 ${motion ? 'sp-row' : ''} ${className}`}>
      {STORES.map((s, i) => {
        const pill = {
          className: `${motion ? PILL_MOTION : PILL} ${SIZES[size]} ${look.focus} ${s.className ?? ''}`,
          'data-variant': variant,
          style: s.store === 'play' && look.play ? look.play : look.pill,
        }
        const label = (
          <>
            Hent i{' '}
            <span className={size === 'lg' ? 'font-semibold' : 'font-medium'} style={{ color: look.name }}>
              {s.name}
            </span>
          </>
        )
        const face = (
          <>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="sp-ic h-4 w-4 shrink-0" fill="currentColor">
              <path d={STORE_MARK[s.store]} />
            </svg>
            {motion ? (
              // The label twice: the second rolls in from below on hover, hidden from screen readers.
              <span className="sp-roll">
                <span className="sp-a">{label}</span>
                <span className="sp-b" aria-hidden="true">
                  {label}
                </span>
              </span>
            ) : (
              <span>{label}</span>
            )}
          </>
        )
        const link = (key?: string) => (
          <a key={key} href={hrefFor(s.store)} onClick={() => {
            countClick(s.store, position)
            trackStoreTap(s.store, position)
          }} {...pill}>
            {face}
          </a>
        )
        if (!motion && !qr) return link(s.store)
        // A slot per pill: the same element whether it holds the link or (on a computer) the QR
        // button, so it can hold the pill's full width while the pill grows in and its
        // neighbour stays put, and the QR card grows out of it.
        return (
          <span key={s.store} className="sp-slot">
            {qr && computer ? (
              <PillQr
                code={{ src: guide ? guideQrImage(guide, s.store) : `/site/qr/${s.store}.svg`, alt: PILL_QR.alt(s.name), title: s.name, label: PILL_QR.label(s.name), link: hrefFor(s.store), store: { store: s.store, position } }}
                variant={variant}
                className={pill.className}
                style={pill.style}
                anchor={i === 0 ? 'end' : 'start'}
              >
                {face}
              </PillQr>
            ) : (
              link()
            )}
          </span>
        )
      })}
    </div>
  )
}
