'use client'

import { useSyncExternalStore } from 'react'
import { MOTION_STORAGE_KEY } from '@/lib/platform'

// Stops every loop on the page (WCAG 2.2.2). html[data-motion="paused"] does the
// stopping in CSS, set before first paint by MOTION_SCRIPT when the visitor chose
// it earlier. Scroll-linked scenes follow the visitor's own scrolling and stay on.

const CHANGED = 'ah-motion-change'

const subscribe = (notify: () => void) => {
  window.addEventListener(CHANGED, notify)
  return () => window.removeEventListener(CHANGED, notify)
}
const isPaused = () => document.documentElement.dataset.motion === 'paused'
const notPausedOnServer = () => false

function setPaused(paused: boolean) {
  const root = document.documentElement
  if (paused) root.dataset.motion = 'paused'
  else delete root.dataset.motion
  // The choice works for this visit even where storage is blocked.
  try {
    if (paused) localStorage.setItem(MOTION_STORAGE_KEY, 'paused')
    else localStorage.removeItem(MOTION_STORAGE_KEY)
  } catch {}
  window.dispatchEvent(new Event(CHANGED))
}

export default function PauseMotion() {
  const paused = useSyncExternalStore(subscribe, isPaused, notPausedOnServer)
  const label = paused ? 'Start bevægelse' : 'Stop bevægelse'
  return (
    <button type="button" className="ah-pause" aria-pressed={paused} onClick={() => setPaused(!paused)}>
      <span className="ah-pause-icon" aria-hidden>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          {paused ? (
            <path d="M4 2.5v11a.5.5 0 0 0 .76.43l9-5.5a.5.5 0 0 0 0-.86l-9-5.5A.5.5 0 0 0 4 2.5Z" />
          ) : (
            <path d="M3.5 2h3a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5Zm6 0h3a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5Z" />
          )}
        </svg>
      </span>
      <span className="ah-pause-label">{label}</span>
    </button>
  )
}
