'use client'

import { useEffect } from 'react'

// MOTION_SCRIPT puts class js on <html> before first paint, and the server's
// className does not have it. If React ever regenerates the root (a hydration
// error recovers that way) the class goes, and every pin on the page goes with it.
export default function KeepJsClass() {
  useEffect(() => {
    document.documentElement.classList.add('js')
  }, [])
  return null
}
