'use client'

import type { CSSProperties } from 'react'
import { useMotionPiece } from './MotionPrefs'

// Five Signal dots between the two logos, brightening from Altid Energi towards Altid Hjem, a
// highlight running along them: the old site's dots, same sizes and timing. In a row between
// the logos on a computer; `vertical` is the column that runs down across the seam on a phone.
// They stop with the page's pause button and off screen.
const DOT_MAX = [0.2, 0.4, 0.6, 0.8, 1]

export default function StoryDots({ vertical = false }: { vertical?: boolean }) {
  const { ref, running } = useMotionPiece<HTMLSpanElement>()
  return (
    <span ref={ref} className="sy-dots" data-vertical={vertical ? 'true' : undefined} data-running={running ? 'true' : 'false'} aria-hidden="true">
      {DOT_MAX.map((max, i) => (
        <span key={i} style={{ '--dot-max': max, '--i': i } as CSSProperties} />
      ))}
    </span>
  )
}
