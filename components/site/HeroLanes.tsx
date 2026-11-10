'use client'

import { HERO } from './copy'
import { useEffect, useRef } from 'react'
import { useMotionPrefs } from './MotionPrefs'

// Paper bills fly in from the left as the page scrolls and slip behind the phones; a moment later each
// comes out on the right as a notification from the app's assistant, saying what it took care
// of or found. Driven by scroll, not time: each card travels from x -481 to +481 inside its
// side's box, easing its scale and tilt on the way, and the phones sit on top. Sample data from
// the app's captures; the wording is in copy.ts (HERO.lanes).

type Lane = {
  side: 'left' | 'right'
  item: number
  start: number
  length: number
  from: [scale: number, tilt: number, y: number]
  to: [scale: number, tilt: number, y: number]
}

// Bill i on the left, its notification on the right, starting as the bill reaches the phones.
const LANES: Lane[] = [
  { side: 'left', item: 0, start: -160, length: 520, from: [1, 10, -200], to: [0.82, 2, -20] },
  { side: 'left', item: 1, start: -90, length: 520, from: [1, -14, 220], to: [0.82, -2, 40] },
  { side: 'left', item: 2, start: -20, length: 520, from: [1, 6, 30], to: [0.82, 1, 0] },
  { side: 'left', item: 3, start: 50, length: 520, from: [1, -10, -120], to: [0.82, -2, -10] },
  // Out on the right, low: they leave the phones from their lower half and drift down.
  { side: 'right', item: 0, start: 140, length: 520, from: [0.82, -2, 40], to: [1, -5, 130] },
  { side: 'right', item: 1, start: 230, length: 520, from: [0.82, 2, 210], to: [1, 4, 330] },
  { side: 'right', item: 2, start: 320, length: 520, from: [0.82, -1, 70], to: [1, -3, 160] },
  { side: 'right', item: 3, start: 410, length: 520, from: [0.82, 2, 230], to: [1, 5, 320] },
]

const REST_SCROLL = 520
const FADE = 0.14

const ease = (t: number) => t * t * (3 - 2 * t)

function Bill({ index }: { index: number }) {
  const bill = HERO.lanes[index].bill
  return (
    <div className="hl-paper">
      <span className="hl-paper-top">
        {bill.mail ? <span className="hl-mail">Mail</span> : <span />}
        <span>{bill.date}</span>
      </span>
      <span className="hl-faktura">Faktura</span>
      <b>{bill.title}</b>
      <small>{bill.from}</small>
      <span className="hl-lines" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="hl-paper-foot">
        <span>Pr. måned</span>
        <b>{bill.amount}</b>
      </span>
    </div>
  )
}

function Note({ index }: { index: number }) {
  return (
    <div className="hl-note">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/app-badge.png" alt="" width={36} height={36} />
      <span className="hl-text">
        <span className="hl-note-top">
          <b>Altid Hjem</b>
          <small>nu</small>
        </span>
        <span className="hl-note-body">{HERO.lanes[index].note}</span>
      </span>
    </div>
  )
}

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
        // No box cuts them: on a wide window a hard edge would show mid-page, so each card
        // fades in and out over the first and last stretch of its travel.
        card.style.opacity = Math.min(1, p / FADE, (1 - p) / FADE).toFixed(3)
      })
    }
    // Reduced motion: the cards rest where a scrolling visitor would see them.
    const position = () => (reduced ? REST_SCROLL : window.scrollY)
    const onChange = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => draw(position()))
    }
    draw(position())
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
                style={{ transform: 'translate3d(-481px, 0, 0)', opacity: 0 }}
              >
                {lane.side === 'left' ? <Bill index={lane.item} /> : <Note index={lane.item} />}
              </div>
            ) : null,
          )}
        </div>
      ))}
    </div>
  )
}
