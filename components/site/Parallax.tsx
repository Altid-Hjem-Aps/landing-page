'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useMotionPrefs } from './MotionPrefs'

// Moves a floating piece by up to +-`range` px as it crosses the viewport. Transform on
// the piece itself only: never on an ancestor of a fixed phone.
export default function Parallax({ range, className = '', children }: { range: number; className?: string; children: ReactNode }) {
  const { reduced } = useMotionPrefs()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current as HTMLDivElement
    if (reduced) {
      element.style.transform = ''
      return
    }
    const anchor = element.closest('article') as HTMLElement
    let frame = 0
    const draw = () => {
      const box = anchor.getBoundingClientRect()
      const middle = box.top + box.height / 2
      const p = Math.max(-1, Math.min(1, (middle - window.innerHeight / 2) / window.innerHeight))
      element.style.transform = `translate3d(0, ${(p * range).toFixed(1)}px, 0)`
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [range, reduced])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
