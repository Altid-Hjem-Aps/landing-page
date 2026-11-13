'use client'

import Image from 'next/image'
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { FINAL } from './copy'
import { Bill } from './HeroLanes'
import { useMotionPrefs } from './MotionPrefs'
import ServiceIcon from './ServiceIcon'

// The final block's collage (Thor 13/11, after Apple's "Crafted with Care" pages): candid
// photos, a few app screens on coloured cards, and pieces of the app drawn in HTML (the
// assistant's notification, a bill, the service marks, the menu's rows), scattered around the
// block's text with a calm space of at least 80 design px around it. What goes where is
// FINAL.gallery in copy.ts, in order; this file holds the places.
//
// Computers (from 1024 px, CSS): three bands around the text, above it, beside it and below
// it. A place is the left edge from the middle of the window, the top from the start of its
// band (beside: from the text's middle), and a width, in design px (--u, 1440 wide, growing
// to 1800). Below the middle of the text stays free for the QR card the store pills open into.
// As the block passes, the pieces drift at their own speeds, a few dozen px at most (transform
// only, one read and the writes per frame), and each rises in the first time it is seen
// (data-reveal). Neither with reduced motion. The drawn pieces turn a little (a fixed angle
// per place), photos and screens stay straight.
// Phones and tablets: one stage of eight pieces under the text, 390 design px wide, still.

type Entry = (typeof FINAL.gallery)[number]
type Band = 'above' | 'beside' | 'below'
type Place = { band: Band; x: number; y: number; w: number; rot: number; speed: number }

const WALL: Place[] = [
  { band: 'above', x: -700, y: 40, w: 210, rot: 0, speed: -0.8 },
  { band: 'above', x: -455, y: 214, w: 320, rot: -3, speed: 0.5 },
  { band: 'above', x: -392, y: 52, w: 84, rot: 0, speed: -0.4 },
  { band: 'above', x: -100, y: 0, w: 176, rot: 0, speed: 0.3 },
  { band: 'above', x: 132, y: 92, w: 296, rot: 2.5, speed: -0.6 },
  { band: 'above', x: 480, y: 24, w: 210, rot: 0, speed: 0.7 },
  { band: 'above', x: 236, y: 232, w: 72, rot: 0, speed: -0.3 },
  { band: 'beside', x: -700, y: -120, w: 210, rot: -4, speed: 0.6 },
  { band: 'beside', x: 432, y: -110, w: 252, rot: 3, speed: -0.5 },
  { band: 'beside', x: -478, y: 70, w: 70, rot: 0, speed: 0.4 },
  { band: 'beside', x: 506, y: 40, w: 176, rot: 0, speed: -0.7 },
  { band: 'below', x: -700, y: 150, w: 200, rot: 0, speed: 0.8 },
  { band: 'below', x: -470, y: 96, w: 286, rot: -2, speed: -0.4 },
  { band: 'below', x: -350, y: 236, w: 164, rot: 0, speed: 0.5 },
  { band: 'below', x: 196, y: 120, w: 190, rot: 0, speed: -0.6 },
  { band: 'below', x: -150, y: 340, w: 300, rot: 1.5, speed: 0.3 },
  { band: 'below', x: 140, y: 470, w: 300, rot: -3, speed: -0.5 },
  { band: 'below', x: 420, y: 236, w: 76, rot: 0, speed: 0.6 },
  { band: 'below', x: 500, y: 320, w: 200, rot: 0, speed: -0.8 },
]

/** The phone stage: left and top in design px of a 390 wide stage. */
const PHONE: Omit<Place, 'band' | 'speed'>[] = [
  { x: 16, y: 0, w: 168, rot: 0 },
  { x: 16, y: 250, w: 200, rot: -3 },
  { x: 196, y: 8, w: 52, rot: 0 },
  { x: 222, y: 64, w: 152, rot: 0 },
  { x: 112, y: 396, w: 262, rot: 2 },
  { x: 150, y: 196, w: 46, rot: 0 },
  { x: 222, y: 492, w: 152, rot: 0 },
  { x: 16, y: 494, w: 168, rot: 0 },
]
/** The stage's height in design px. */
const PHONE_HEIGHT = 820

/** The most a piece drifts, in px, at speed 1. */
const DRIFT = 36

const phoneEntries = FINAL.gallery.filter((entry) => entry.phone)
if (FINAL.gallery.length !== WALL.length) throw new Error(`FINAL.gallery needs ${WALL.length} entries for the collage, it has ${FINAL.gallery.length}`)
if (phoneEntries.length !== PHONE.length) throw new Error(`FINAL.gallery needs ${PHONE.length} entries marked phone, it has ${phoneEntries.length}`)

// The pieces drawn in HTML: small round marks for the "Kommer snart" row.
const SOON_ICONS: Record<string, ReactNode> = {
  Opladning: <path d="M9 3v4M15 3v4M7 7h10v4a5 5 0 0 1-10 0V7ZM12 16v5" />,
  Alarm: <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16ZM10 20.5a2 2 0 0 0 4 0" />,
  Mobil: <path d="M8 3h8a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 16 21H8a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 8 3ZM11 18h2" />,
}

function Drawn({ entry }: { entry: Entry }) {
  switch (entry.kind) {
    case 'note':
      return (
        <div className="hl-note e-note-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/app-badge.png" alt="" width={36} height={36} />
          <span className="hl-text">
            <span className="hl-note-top">
              <b>{entry.title}</b>
              <small>{entry.time}</small>
            </span>
            <span className="hl-note-body">{entry.body}</span>
            <span className="hl-done">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {entry.done}
            </span>
          </span>
        </div>
      )
    case 'bill':
      return <Bill bill={entry.bill} />
    case 'orb':
      return (
        <div className="e-orb" data-tone={entry.tone}>
          <ServiceIcon name={entry.service} size={28} />
        </div>
      )
    case 'soon':
      return (
        <div className="e-soon">
          <p className="e-soon-title">{entry.title}</p>
          <div className="e-soon-row">
            {entry.items.map((item) => (
              <span key={item} className="e-soon-item">
                <span className="e-soon-mark">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {SOON_ICONS[item]}
                  </svg>
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>
      )
    case 'row':
      return (
        <div className="e-row">
          <span className="e-row-mark" data-tone={entry.tone}>
            <ServiceIcon name={entry.service} size={20} />
          </span>
          <span className="e-row-text">
            <b>{entry.title}</b>
            <small data-offer={entry.offer ? 'true' : undefined}>{entry.line}</small>
          </span>
          <svg className="e-row-go" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9.5 6 6 6-6 6" />
          </svg>
        </div>
      )
    default:
      throw new Error(`No drawing for ${entry.kind}`)
  }
}

function Piece({ entry, place, delay, sizes }: { entry: Entry; place: Omit<Place, 'speed'> & { speed?: number }; delay: number; sizes: string }) {
  const style = { '--x': place.x, '--y': place.y, '--w': place.w } as CSSProperties
  const inner = { '--rd': `${delay}ms`, '--r': `${place.rot}deg` } as CSSProperties
  let body: ReactNode
  if (entry.kind === 'photo') {
    body = (
      <div className="e-photo">
        <Image src={entry.src} alt={entry.alt} fill sizes={sizes} style={{ objectPosition: entry.focus }} />
      </div>
    )
  } else if (entry.kind === 'screen') {
    body = (
      <div className="e-shot" data-tone={entry.tone}>
        <Image src={entry.src} alt={entry.alt} width={900} height={1951} sizes={sizes} />
      </div>
    )
  } else {
    body = <Drawn entry={entry} />
  }
  const drawn = entry.kind !== 'photo' && entry.kind !== 'screen'
  return (
    <div className="e-piece" data-band={place.band} data-kind={entry.kind} data-speed={place.speed} style={style}>
      <div className="e-piece-in" data-reveal style={inner} aria-hidden={drawn ? 'true' : undefined}>
        {body}
      </div>
    </div>
  )
}

export default function FinalGallery({ children }: { children: ReactNode }) {
  const { reduced } = useMotionPrefs()
  const wall = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = wall.current as HTMLDivElement
    const pieces = Array.from(element.querySelectorAll<HTMLElement>('[data-speed]'))
    if (reduced) {
      for (const piece of pieces) piece.style.translate = ''
      return
    }
    const computer = window.matchMedia('(min-width: 1024px)')
    let frame = 0
    const draw = () => {
      frame = 0
      if (!computer.matches) return
      const box = element.getBoundingClientRect()
      const p = Math.max(-1, Math.min(1, (box.top + box.height / 2 - window.innerHeight / 2) / window.innerHeight))
      for (const piece of pieces) piece.style.translate = `0 ${(p * Number(piece.dataset.speed) * DRIFT).toFixed(1)}px`
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [reduced])

  const bands: Band[] = ['above', 'beside', 'below']
  return (
    <>
      <div ref={wall} className="e-wall">
        {children}
        {bands.map((band) => (
          <div key={band} className="e-band" data-band={band}>
            {WALL.map((place, i) =>
              place.band === band ? <Piece key={i} entry={FINAL.gallery[i]} place={place} delay={(i % 5) * 70} sizes="(min-width: 1024px) 16vw, 1px" /> : null,
            )}
          </div>
        ))}
      </div>
      <div className="e-stage" style={{ '--h': PHONE_HEIGHT } as CSSProperties}>
        {phoneEntries.map((entry, i) => (
          <Piece key={entry.kind + i} entry={entry} place={{ band: 'below', ...PHONE[i] }} delay={(i % 4) * 80} sizes="(max-width: 1023px) 45vw, 1px" />
        ))}
      </div>
    </>
  )
}
