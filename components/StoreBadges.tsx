'use client'

import { storeLink, type Store, type StorePosition } from '@/lib/store-links'

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
export function countClick(store: Store, position: StorePosition) {
  navigator.sendBeacon(
    '/api/forside/store-click',
    new Blob([JSON.stringify({ store, position })], { type: 'application/json' }),
  )
}

const PILL = 'inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-[20px] border py-3 px-3 sm:px-4 text-sm leading-none whitespace-nowrap transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-[3px]'

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
  // On a pastel, where the thin border is too weak to hold its own.
  solid: {
    focus: 'focus-visible:outline-[#003c16]',
    pill: { borderColor: '#003c16', borderWidth: '1.5px', background: '#fdfaf4', color: '#003c16' },
    name: '#003c16',
  },
}

const STORES: { store: Store; name: string; className?: string; path: string }[] = [
  {
    store: 'appstore',
    name: 'App Store',
    path: 'M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09v-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z',
  },
  {
    store: 'play',
    name: 'Google Play',
    className: 'store-badge-play',
    path: 'M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.61-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1.001 1.001 0 010 1.73l-2.808 1.626L15.117 12l2.581-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z',
  },
]

export default function StoreBadges({
  position,
  className = '',
  variant = 'light',
}: {
  position: StorePosition
  className?: string
  variant?: keyof typeof VARIANTS
}) {
  const look = VARIANTS[variant]
  return (
    <div className={`flex flex-row flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-3 ${className}`}>
      {STORES.map(s => (
        <a
          key={s.store}
          href={storeLink(s.store)}
          onClick={() => countClick(s.store, position)}
          className={`${PILL} ${look.focus} ${s.className ?? ''}`}
          style={look.pill}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0" fill="currentColor">
            <path d={s.path} />
          </svg>
          <span>
            Hent i{' '}
            <span className="font-medium" style={{ color: look.name }}>
              {s.name}
            </span>
          </span>
        </a>
      ))}
    </div>
  )
}
