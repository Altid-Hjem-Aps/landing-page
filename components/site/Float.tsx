'use client'

import type { ReactNode } from 'react'
import { useMotionPiece } from './MotionPrefs'

// A gentle up-and-down float for a small card, stopped by the pause button, off screen and
// with reduced motion (CSS .float[data-running]).
export default function Float({ className = '', children }: { className?: string; children: ReactNode }) {
  const { ref, running } = useMotionPiece<HTMLDivElement>()
  return (
    <div ref={ref} className={`float ${className}`} data-running={running ? 'true' : 'false'}>
      {children}
    </div>
  )
}
