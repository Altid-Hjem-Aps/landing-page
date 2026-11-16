'use client'

import type { ReactNode } from 'react'
import { countClick, trackStoreTap } from '@/components/StoreBadges'
import { storeLink, type Store, type StorePosition } from '@/lib/store-links'

// A store link that isn't a pill, counted the same way as the pills. `onClick` runs after the
// count, for a caller with its own event (the offer pop-up's conversion).
export default function StoreLink({
  store,
  position,
  className,
  onClick,
  children,
}: {
  store: Store
  position: StorePosition
  className?: string
  onClick?: () => void
  children: ReactNode
}) {
  return (
    <a
      href={storeLink(store)}
      className={className}
      onClick={() => {
        countClick(store, position)
        trackStoreTap(store, position)
        onClick?.()
      }}
    >
      {children}
    </a>
  )
}
