'use client'

import Image from 'next/image'
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { FINAL } from './copy'
import { useMotionPrefs } from './MotionPrefs'

// The final block's collage (Thor 13/11, after Apple's "Crafted with Care" pages): app screens
// on coloured cards and candid photos in staggered columns, with the block's text in the
// middle on a cream ground, the tiles around it and partly behind it. What goes where is
// FINAL.gallery in copy.ts; this file holds the places.
//
// Computers (from 1024 px, CSS): seven columns on a grid of three bands, above the text, the
// text, below it. A column either runs through all three bands, held at its own height, or
// has a tile above and or below the text. Below the middle stays free for the QR card the
// store pills open into. As the block passes, the columns drift at their own speeds, a few
// dozen pixels at most (transform only, one read and the writes per frame). Each tile rises
// in the first time it is seen (data-reveal). Neither with reduced motion.
// Phones and tablets: three staggered columns of two under the text, still.

type Entry = (typeof FINAL.gallery)[number]

/** Grid column, band, offset in design px (down is positive), drift speed, and how many tiles. */
const WALL = [
  { col: 1, band: 'span', y: 40, speed: -0.9, tiles: 2 },
  { col: 2, band: 'span', y: -60, speed: 0.6, tiles: 2 },
  { col: 3, band: 'above', y: -24, speed: -0.5, tiles: 1 },
  { col: 3, band: 'below', y: 0, speed: -0.5, tiles: 1 },
  { col: 4, band: 'above', y: 16, speed: 0.35, tiles: 1 },
  { col: 5, band: 'above', y: -12, speed: -0.4, tiles: 1 },
  { col: 5, band: 'below', y: 24, speed: -0.4, tiles: 1 },
  { col: 6, band: 'span', y: 130, speed: 0.7, tiles: 1 },
  { col: 7, band: 'span', y: -40, speed: -1, tiles: 2 },
] as const
const WALL_TILES = WALL.reduce((sum, piece) => sum + piece.tiles, 0)
const PHONE_COLUMNS = 3
const PHONE_TILES = 6
/** The most a column drifts, in px, at speed 1. */
const DRIFT = 36

const phoneEntries = FINAL.gallery.filter((entry) => entry.phone)
if (FINAL.gallery.length !== WALL_TILES) throw new Error(`FINAL.gallery needs ${WALL_TILES} entries for the collage, it has ${FINAL.gallery.length}`)
if (phoneEntries.length !== PHONE_TILES) throw new Error(`FINAL.gallery needs ${PHONE_TILES} entries marked phone, it has ${phoneEntries.length}`)

// The wall's pieces with their entries, in the gallery's order.
const pieces = WALL.map((piece, i) => {
  const first = WALL.slice(0, i).reduce((sum, p) => sum + p.tiles, 0)
  return { ...piece, entries: FINAL.gallery.slice(first, first + piece.tiles) }
})

function Tile({ entry, delay, sizes }: { entry: Entry; delay: number; sizes: string }) {
  const style = { '--rd': `${delay}ms` } as CSSProperties
  if (entry.kind === 'photo') {
    return (
      <div className="e-tile e-photo" data-reveal style={style}>
        <Image src={entry.src} alt={entry.alt} fill sizes={sizes} style={{ objectPosition: entry.focus }} />
      </div>
    )
  }
  return (
    <div className="e-tile e-shot" data-tone={entry.tone} data-reveal style={style}>
      <Image src={entry.src} alt={entry.alt} width={900} height={1951} sizes={sizes} />
    </div>
  )
}

export default function FinalGallery({ children }: { children: ReactNode }) {
  const { reduced } = useMotionPrefs()
  const wall = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = wall.current as HTMLDivElement
    const columns = Array.from(element.querySelectorAll<HTMLElement>('[data-speed]'))
    if (reduced) {
      for (const column of columns) column.style.translate = ''
      return
    }
    const computer = window.matchMedia('(min-width: 1024px)')
    let frame = 0
    const draw = () => {
      frame = 0
      if (!computer.matches) return
      const box = element.getBoundingClientRect()
      const p = Math.max(-1, Math.min(1, (box.top + box.height / 2 - window.innerHeight / 2) / window.innerHeight))
      for (const column of columns) column.style.translate = `0 ${(p * Number(column.dataset.speed) * DRIFT).toFixed(1)}px`
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

  return (
    <>
      <div ref={wall} className="e-wall">
        {children}
        {pieces.map((piece) => (
          <div
            key={`${piece.col}-${piece.band}`}
            className="e-col"
            data-band={piece.band}
            data-speed={piece.speed}
            style={{ gridColumn: piece.col, '--y': piece.y } as CSSProperties}
          >
            {piece.entries.map((entry, i) => (
              <Tile key={entry.src} entry={entry} delay={(piece.col - 1) * 70 + i * 120} sizes="(min-width: 1024px) 15vw, 1px" />
            ))}
          </div>
        ))}
      </div>
      <div className="e-few">
        {Array.from({ length: PHONE_COLUMNS }, (_, col) => (
          <div key={col} className="e-few-col">
            {phoneEntries.slice(col * 2, col * 2 + 2).map((entry, i) => (
              <Tile key={entry.src} entry={entry} delay={col * 90 + i * 120} sizes="(max-width: 1023px) 34vw, 1px" />
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
