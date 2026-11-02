'use client'

import { storeLink, type Store, type StorePosition } from '@/lib/store-links'
import { STORE_BADGES } from '@/lib/forside-copy'

// The official store badges as tracked links (lib/store-links.ts). Badges are
// drawn unmodified (public/store-badges/README.md) at the sizes
// components/StoreButtons.tsx uses: the Google PNG carries its own clear space
// (192 of 250 px is badge), so it is drawn at 250/192 of the App Store badge
// height to make both look equally tall. Together they need 318px: side by
// side on a 390px phone, and the Play badge wraps under the App Store badge on
// narrower screens. App Store comes first; on Android the data-platform
// attribute (app/layout.tsx) moves Google Play first via CSS.

// The click is counted by our server (app/api/forside/store-click), not by the
// browser SDK: the SDK only runs after cookie consent, and the click leaves the
// page. sendBeacon outlives the navigation, which goes ahead untouched.
function countClick(store: Store, position: StorePosition) {
  navigator.sendBeacon(
    '/api/forside/store-click',
    new Blob([JSON.stringify({ store, position })], { type: 'application/json' }),
  )
}

export default function StoreBadges({ position, className = '' }: { position: StorePosition; className?: string }) {
  return (
    <div className={`flex flex-row flex-wrap items-center gap-x-3 gap-y-3 ${className}`}>
      <a href={storeLink('appstore')} onClick={() => countClick('appstore', position)} className="block shrink-0 rounded-[10px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/store-badges/app-store-da.svg"
          alt={STORE_BADGES.appStoreAlt}
          width={144}
          height={48}
          style={{ display: 'block', height: 48, width: 'auto' }}
        />
      </a>
      <a href={storeLink('play')} onClick={() => countClick('play', position)} className="store-badge-play block shrink-0 rounded-[10px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/store-badges/google-play-da.png"
          alt={STORE_BADGES.playAlt}
          width={163}
          height={63}
          style={{ display: 'block', height: 62.5, width: 'auto' }}
        />
      </a>
    </div>
  )
}
