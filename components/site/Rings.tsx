'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import { useMotionPrefs } from './MotionPrefs'

// Two concentric rings of icon tiles behind the Altid Forsikring phone: 19 positions each,
// 18 degrees apart, tiles tilted along the ring. As the section scrolls past, the rings
// grow by 6 % and turn a few degrees.
const ICONS = ['insurance', 'housing', 'transport', 'health', 'holidays', 'children', 'groceries', 'leisure', 'restaurants', 'shopping', 'clothing', 'gifts', 'other', 'incoming']
const RING_POSITIONS = 19
const STEP = 18

function ring(offset: number) {
  return Array.from({ length: RING_POSITIONS }, (_, i) => ({ angle: i * STEP, icon: ICONS[(i + offset) % ICONS.length] }))
}

export default function Rings() {
  const { reduced } = useMotionPrefs()
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = root.current as HTMLDivElement
    if (reduced) {
      element.style.setProperty('--ring-p', '0.5')
      return
    }
    let frame = 0
    const draw = () => {
      const box = (element.parentElement as HTMLElement).getBoundingClientRect()
      const p = Math.max(0, Math.min(1, 1 - (box.top + box.height) / (window.innerHeight + box.height)))
      element.style.setProperty('--ring-p', p.toFixed(3))
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
  }, [reduced])

  return (
    <div ref={root} className="rings" aria-hidden="true">
      {[0, 7].map((offset, r) => (
        <div key={offset} className={`ring ring-${r}`}>
          {ring(offset).map(({ angle, icon }) => (
            <span key={angle} className="ring-spoke" style={{ transform: `rotate(${angle - 90}deg)` }}>
              <span className="ring-tile" style={{ '--icon': `url(/site/icons/${icon}.svg)` } as CSSProperties} />
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
