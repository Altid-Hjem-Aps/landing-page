'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useMotionPrefs } from './MotionPrefs'

// Small cards cut from the real captures. Driven by scroll, not time: each travels from
// x -481 to +481 inside its side's box, easing its scale and tilt on the way, and the
// phones sit on top. The reference timeline runs over 4,000 px of scroll; here it is compressed
// to the hero's own range, keeping the stagger between the lanes.

type Lane = {
  side: 'left' | 'right'
  src: string
  width: number
  height: number
  start: number
  length: number
  from: [scale: number, tilt: number, y: number]
  to: [scale: number, tilt: number, y: number]
}

const LANES: Lane[] = [
  { side: 'left', src: '/site/app/crop-foran-card.webp', width: 248, height: 77, start: 40, length: 1000, from: [1, 12, -212], to: [0.8, 2, 0] },
  { side: 'left', src: '/site/app/piece-bars.webp', width: 256, height: 70, start: 60, length: 1150, from: [1, -21, 230], to: [0.8, -2, 0] },
  { side: 'left', src: '/site/plates/butter-chicken.webp', width: 118, height: 118, start: 260, length: 1300, from: [1.2, -3, 73], to: [1, -1, 0] },
  { side: 'left', src: '/site/app/piece-148.webp', width: 204, height: 51, start: 480, length: 1200, from: [1, 12, -212], to: [0.8, 2, 0] },
  { side: 'left', src: '/site/app/piece-bilka.webp', width: 190, height: 38, start: 620, length: 1200, from: [1, -12, 230], to: [0.8, -2, 0] },
  { side: 'right', src: '/site/app/piece-1076.webp', width: 230, height: 60, start: 100, length: 1300, from: [1, -13, 0], to: [0.83, -2, -154] },
  { side: 'right', src: '/site/brand/umbrella.webp', width: 96, height: 96, start: 240, length: 1350, from: [0.8, 2, 0], to: [1, 12, 230] },
  { side: 'right', src: '/site/app/crop-foran-card.webp', width: 248, height: 77, start: 400, length: 1350, from: [0.8, 0, 0], to: [1, 6, 40] },
  { side: 'right', src: '/site/plates/pizza.webp', width: 118, height: 118, start: 560, length: 1350, from: [0.8, -3, 73], to: [1, -12, -212] },
]

const REST_SCROLL = 700

const ease = (t: number) => t * t * (3 - 2 * t)

export default function HeroLanes() {
  const { reduced } = useMotionPrefs()
  const cards = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    let frame = 0
    const draw = (scroll: number) => {
      const unit = Math.min(window.innerWidth, 1440) / 1440
      LANES.forEach((lane, i) => {
        // The frame can still fire after the refs are cleared on leaving the page.
        const card = cards.current[i]
        if (!card) return
        const p = ease(Math.min(1, Math.max(0, (scroll - lane.start) / lane.length)))
        const mix = (a: number, b: number) => a + (b - a) * p
        const x = (-481 + 962 * p) * unit
        const y = mix(lane.from[2], lane.to[2]) * unit
        card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${mix(lane.from[1], lane.to[1]).toFixed(2)}deg) scale(${mix(lane.from[0], lane.to[0]).toFixed(3)})`
      })
    }
    // Reduced motion: the cards rest where a scrolling visitor would see them.
    const position = () => (reduced ? REST_SCROLL : window.scrollY)
    const onChange = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => draw(position()))
    }
    draw(position())
    // Clipped until they slide in, so a lazy image would pop in late. The lanes only show
    // from 768 px, and a phone should not pay for them.
    if (window.matchMedia('(min-width: 768px)').matches) {
      for (const card of cards.current) card?.querySelector('img')?.setAttribute('loading', 'eager')
    }
    window.addEventListener('resize', onChange)
    if (!reduced) window.addEventListener('scroll', onChange, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onChange)
      window.removeEventListener('scroll', onChange)
    }
  }, [reduced])

  return (
    <div className="h-lanes" aria-hidden="true">
      {(['left', 'right'] as const).map((side) => (
        <div key={side} className={`h-lane-clip h-lane-${side}`}>
          {LANES.map((lane, i) =>
            lane.side === side ? (
              <div
                key={`${side}-${i}`}
                ref={(el) => {
                  cards.current[i] = el
                }}
                className="h-lane-card"
                style={{ transform: 'translate3d(-481px, 0, 0)' }}
              >
                <Image src={lane.src} alt="" width={lane.width} height={lane.height} sizes={`${lane.width}px`} loading="lazy" style={{ width: `calc(var(--u) * ${lane.width})` }} />
              </div>
            ) : null,
          )}
        </div>
      ))}
    </div>
  )
}
