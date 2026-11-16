'use client'

import type { ReactNode } from 'react'
import { countClick, trackStoreTap, useStoreLink } from '@/components/StoreBadges'
import type { Store, StorePosition } from '@/lib/store-links'

// A store link that isn't a pill, counted the same way as the pills; on a guide it carries the
// guide's own campaign (useStoreLink). `onClick` runs after the
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
  const link = useStoreLink()
  return (
    <a
      href={link(store)}
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
