'use client'

import type { ReactNode } from 'react'
import { useMotionPiece, useMotionPrefs } from './MotionPrefs'

// A slow right-to-left loop while in view. The list is drawn twice for the loop: the
// second copy is aria-hidden, so a screen reader and the tab key meet every item once.
// With reduced motion it is a plain scroller; `scrollsByKey` makes one with no links in it
// reachable from the keyboard.
export default function Marquee({ label, className, first, second, scrollsByKey = false }: { label: string; className: string; first: ReactNode; second: ReactNode; scrollsByKey?: boolean }) {
  const { ref, running } = useMotionPiece<HTMLDivElement>()
  const { reduced } = useMotionPrefs()
  return (
    <div ref={ref} className={`mq ${className}`} data-running={running} role="group" aria-label={label} tabIndex={scrollsByKey && reduced ? 0 : undefined}>
      <div className="mq-track">
        <ul className="mq-list">{first}</ul>
        <ul className="mq-list" aria-hidden="true">
          {second}
        </ul>
      </div>
    </div>
  )
}
