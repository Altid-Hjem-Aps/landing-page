'use client'

import { useRef } from 'react'
import { STORE_MARK } from '@/components/StoreBadges'
import type { StorePosition } from '@/lib/store-links'
import { HERO } from './copy'
import StoreLink from './StoreLink'
import { usePillEntrance } from './usePillEntrance'

// Phones only (CSS): one wide button to the visitor's own store in place of the two store
// pills. Android sees the Google Play one, everyone else the App Store one (data-platform).
// Only the one button (Thor 15/11): the small link to the other store under it is gone.
// A client component because STORE_MARK lives in a client module, whose plain values a
// server component cannot read.
// It comes in as the computer's pills do (usePillEntrance): the icon pops in and the label rolls
// up, and it squeezes a little when pressed (Thor 15/11).
export default function GetAppButton({ position }: { position: StorePosition }) {
  const row = useRef<HTMLDivElement>(null)
  usePillEntrance(row, true)
  return (
    <div ref={row} className="get">
      <StoreLink store="appstore" position={position} className="get-btn for-appstore">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="sp-ic">
          <path d={STORE_MARK.appstore} />
        </svg>
        <span className="get-roll">
          <span className="sp-a">{HERO.getApp}</span>
        </span>
      </StoreLink>
      <StoreLink store="play" position={position} className="get-btn for-play">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="sp-ic">
          <path d={STORE_MARK.play} />
        </svg>
        <span className="get-roll">
          <span className="sp-a">{HERO.getApp}</span>
        </span>
      </StoreLink>
    </div>
  )
}
