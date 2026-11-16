'use client'

import { useSyncExternalStore } from 'react'

// From 1024 px with a fine pointer: where a QR code makes sense instead of a store link.
const COMPUTER = '(min-width: 1024px) and (hover: hover) and (pointer: fine)'

function subscribe(onChange: () => void) {
  const query = window.matchMedia(COMPUTER)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
const read = () => window.matchMedia(COMPUTER).matches
const onServer = () => false

export function useComputer(): boolean {
  return useSyncExternalStore(subscribe, read, onServer)
}
