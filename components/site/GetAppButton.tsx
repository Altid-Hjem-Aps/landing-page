'use client'

import { STORE_MARK } from '@/components/StoreBadges'
import type { StorePosition } from '@/lib/store-links'
import { HERO } from './copy'
import StoreLink from './StoreLink'

// Phones only (CSS): one wide button to the visitor's own store in place of the two store
// pills. Android sees the Google Play one, everyone else the App Store one (data-platform).
// Under it a small link to the other store, so a phone we read wrong, or someone fetching the
// app for a partner on the other platform, is never left without their store (Thor 13/11).
// A client component because STORE_MARK lives in a client module, whose plain values a
// server component cannot read.
export default function GetAppButton({ position }: { position: StorePosition }) {
  return (
    <div className="get">
      <StoreLink store="appstore" position={position} className="get-btn for-appstore">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d={STORE_MARK.appstore} />
        </svg>
        {HERO.getApp}
      </StoreLink>
      <StoreLink store="play" position={position} className="get-btn for-play">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d={STORE_MARK.play} />
        </svg>
        {HERO.getApp}
      </StoreLink>
      <StoreLink store="play" position={position} className="get-other for-appstore">
        {HERO.otherStore.play}
      </StoreLink>
      <StoreLink store="appstore" position={position} className="get-other for-play">
        {HERO.otherStore.appstore}
      </StoreLink>
    </div>
  )
}
