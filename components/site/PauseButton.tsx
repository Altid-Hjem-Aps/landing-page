'use client'

import { NAV } from './copy'
import { useMotionPrefs } from './MotionPrefs'

// One small round button, fixed bottom left, for everything on the page that runs by
// itself. It steps aside while nothing that runs is on screen, and with reduced motion
// nothing runs at all.
export default function PauseButton() {
  const { paused, reduced, onScreen, togglePaused } = useMotionPrefs()
  if (reduced) return null
  return (
    <button type="button" onClick={togglePaused} aria-label={paused ? NAV.play : NAV.pause} className="pause" data-idle={onScreen === 0}>
      <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
        {paused ? (
          <path d="M4.5 2.6v10.8c0 .5.5.8 1 .5l8-5.4a.6.6 0 0 0 0-1l-8-5.4c-.5-.3-1 0-1 .5z" />
        ) : (
          <>
            <rect x="3.5" y="2.5" width="3" height="11" rx="1" />
            <rect x="9.5" y="2.5" width="3" height="11" rx="1" />
          </>
        )}
      </svg>
    </button>
  )
}
