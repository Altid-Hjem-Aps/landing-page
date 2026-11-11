'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from 'react'

// One effective motion state for everything on the page that runs by itself: it runs
// only when nobody pressed pause, nobody asked for reduced motion, the tab is visible
// and the piece itself is on screen. CSS still handles the first paint (the media
// query), so nothing moves for a reduced-motion visitor before this has hydrated.

const REDUCED = '(prefers-reduced-motion: reduce)'

function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia(REDUCED)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange)
  return () => document.removeEventListener('visibilitychange', onChange)
}

const readReduced = () => window.matchMedia(REDUCED).matches
const readHidden = () => document.visibilityState === 'hidden'
const onServer = () => false

type MotionState = { paused: boolean; reduced: boolean; hidden: boolean; onScreen: number; countOnScreen: (change: number) => void; togglePaused: () => void }

const MotionContext = createContext<MotionState | null>(null)

export function MotionPrefs({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false)
  const reduced = useSyncExternalStore(subscribeReduced, readReduced, onServer)
  const hidden = useSyncExternalStore(subscribeVisibility, readHidden, onServer)
  const [onScreen, setOnScreen] = useState(0)
  const countOnScreen = useCallback((change: number) => setOnScreen((count) => count + change), [])
  const togglePaused = useCallback(() => setPaused((p) => !p), [])
  const value = useMemo(() => ({ paused, reduced, hidden, onScreen, countOnScreen, togglePaused }), [paused, reduced, hidden, onScreen, countOnScreen, togglePaused])
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}

export function useMotionPrefs(): MotionState {
  const state = useContext(MotionContext)
  if (!state) throw new Error('useMotionPrefs needs a MotionPrefs above it')
  return state
}

/** One moving piece: attach `ref` to it and write `running` to its data-running. */
export function useMotionPiece<T extends Element>(): { ref: RefObject<T | null>; running: boolean } {
  const { paused, reduced, hidden, countOnScreen } = useMotionPrefs()
  const ref = useRef<T>(null)
  const [onScreen, setOnScreen] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting))
    observer.observe(ref.current as T)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!onScreen) return
    countOnScreen(1)
    return () => countOnScreen(-1)
  }, [onScreen, countOnScreen])

  return { ref, running: !paused && !reduced && !hidden && onScreen }
}
