'use client'

import type { ReactNode } from 'react'
import { countClick } from '@/components/StoreBadges'
import { storeLink, type Store, type StorePosition } from '@/lib/store-links'

// A store link that isn't a pill, counted the same way as the pills.
export default function StoreLink({ store, position, className, children }: { store: Store; position: StorePosition; className?: string; children: ReactNode }) {
  return (
    <a href={storeLink(store)} className={className} onClick={() => countClick(store, position)}>
      {children}
    </a>
  )
}
