'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useMotionPrefs } from './MotionPrefs'

// A screen pans slowly once when it comes into view, then rests. CSS holds the finished
// state, so nothing waits for JavaScript and reduced motion simply stays there.
export default function ScrollPan({ className = '', children }: { className?: string; children: ReactNode }) {
  const { reduced } = useMotionPrefs()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current as HTMLDivElement
    if (reduced) {
      element.removeAttribute('data-pan')
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.setAttribute('data-pan', 'go')
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [reduced])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
