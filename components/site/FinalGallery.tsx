'use client'

import Image from 'next/image'
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { FINAL, MAD } from './copy'
import { useMotionPrefs } from './MotionPrefs'

// The final block's collage, in the style of the old "Lavet med omhu til danske hjem" block
// (Thor 13/11): close columns of rounded tiles in the site's tones around the block's text:
// candid photos, app screens each on a toned card, the coast painting, the coin stack, two
// dishes and the assistant's notification on a tile of its own. What goes where is
// FINAL.gallery in copy.ts, in order; this file holds the columns.
//
// Computers (from 1024 px, CSS): a 1440 design px wide stage (growing to 1800 with the window)
// in three bands around the text, which keeps a calm space of 72 design px on every side.
// Columns beside the text are placed from its middle; columns above it end over the calm
// space; columns below it start under it, either side of the middle, which stays free for the
// QR card the store pills open into. Everything sits inside the block with room to spare for
// the drift: as the block passes, the columns move up to 16 px at their own speeds (transform
// only), and each tile rises in the first time it is seen (data-reveal). Neither with reduced
// motion. Phones and tablets: three columns of two under the text, still.

type Entry = (typeof FINAL.gallery)[number]
type Band = 'above' | 'beside' | 'below'
/** A screen tile is never taller than its screen at the tile's width (150 wide: 300 high), so
 * the screen is only cut at the bottom. x: the left edge from the stage's left, in design px. y: above, the gap under the column
 * beyond the calm space; beside, the top from the text's middle; below, the gap over the
 * column beyond the calm space. Above and below, the calm space is 72 plus the most a column
 * drifts towards the text, 16 (CSS). Heights of the column's tiles in design px. */
type Column = { band: Band; x: number; y: number; w: number; tiles: number[]; speed: number }

const COLUMNS: Column[] = [
  { band: 'beside', x: 12, y: -330, w: 150, tiles: [250, 300], speed: -0.8 },
  { band: 'beside', x: 178, y: -230, w: 150, tiles: [170, 200, 240], speed: 0.6 },
  { band: 'above', x: 396, y: 0, w: 150, tiles: [210], speed: -0.4 },
  { band: 'below', x: 396, y: 0, w: 150, tiles: [240], speed: 0.5 },
  { band: 'above', x: 562, y: 20, w: 316, tiles: [150], speed: 0.3 },
  { band: 'above', x: 894, y: 10, w: 150, tiles: [170], speed: -0.6 },
  { band: 'below', x: 894, y: 0, w: 150, tiles: [260], speed: 0.6 },
  { band: 'beside', x: 1112, y: -360, w: 150, tiles: [260, 300], speed: -0.6 },
  { band: 'beside', x: 1278, y: -140, w: 150, tiles: [170, 260], speed: 0.8 },
]
/** The phone's three columns: the top offset and the tiles' heights, in design px of 390. */
const PHONE: { y: number; tiles: number[] }[] = [
  { y: 0, tiles: [155, 220] },
  { y: 40, tiles: [130, 155] },
  { y: 16, tiles: [220, 155] },
]

/** The most a column drifts, in px, at speed 1. */
const DRIFT = 16

const wallTiles = COLUMNS.reduce((sum, column) => sum + column.tiles.length, 0)
const phoneTiles = PHONE.reduce((sum, column) => sum + column.tiles.length, 0)
const phoneEntries = FINAL.gallery.filter((entry) => entry.phone)
if (FINAL.gallery.length !== wallTiles) throw new Error(`FINAL.gallery needs ${wallTiles} entries for the collage, it has ${FINAL.gallery.length}`)
if (phoneEntries.length !== phoneTiles) throw new Error(`FINAL.gallery needs ${phoneTiles} entries marked phone, it has ${phoneEntries.length}`)

// Each column with its entries and their heights, in the gallery's order.
function fill<C extends { tiles: number[] }>(columns: C[], entries: readonly Entry[]) {
  let next = 0
  return columns.map((column) => ({ ...column, entries: column.tiles.map((h) => ({ entry: entries[next++], h })) }))
}
const wall = fill(COLUMNS, FINAL.gallery)
const phone = fill(PHONE, phoneEntries)

function Tile({ entry, h, delay, sizes }: { entry: Entry; h: number; delay: number; sizes: string }) {
  const style = { '--h': h, '--rd': `${delay}ms` } as CSSProperties
  switch (entry.kind) {
    case 'photo':
      return (
        <div className="e-tile e-cover" data-reveal style={style}>
          <Image src={entry.src} alt={entry.alt} fill sizes={sizes} style={{ objectFit: 'cover', objectPosition: entry.focus }} />
        </div>
      )
    case 'screen':
      // On its own toned card, with room all round, as the screens lived before.
      return (
        <div className="e-tile e-screen" data-tone={entry.tone} data-reveal style={style}>
          <span className="e-screen-in">
            <Image src={entry.src} alt={entry.alt} fill sizes={sizes} style={{ objectFit: 'cover', objectPosition: '50% 0%' }} />
          </span>
        </div>
      )
    case 'art':
      return (
        <div className={`e-tile ${entry.cover ? 'e-cover' : 'e-art'}`} data-tone={entry.tone} data-reveal style={style}>
          <Image src={entry.src} alt={entry.alt} fill sizes={sizes} style={{ objectFit: entry.cover ? 'cover' : 'contain', objectPosition: entry.focus }} />
        </div>
      )
    case 'plate':
      return (
        <div className="e-tile e-plate" data-tone={entry.tone} data-reveal style={style}>
          <Image src={MAD.plates[entry.plate].src} alt={MAD.plates[entry.plate].name} width={143} height={143} sizes={sizes} />
        </div>
      )
    case 'note':
      // The assistant's notification as in the hero, on a tile of its own; decoration.
      return (
        <div className="e-tile e-note-tile" data-tone={entry.tone} data-reveal style={style} aria-hidden="true">
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
        </div>
      )
    default:
      throw new Error(`No tile for ${(entry as Entry).kind}`)
  }
}

export default function FinalGallery({ children }: { children: ReactNode }) {
  const { reduced } = useMotionPrefs()
  const stage = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = stage.current as HTMLDivElement
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

  const bands: Band[] = ['above', 'beside', 'below']
  return (
    <>
      <div ref={stage} className="e-wall">
        {children}
        {bands.map((band) => (
          <div key={band} className="e-band" data-band={band}>
            {wall.map((column, c) =>
              column.band === band ? (
                <div key={c} className="e-col" data-speed={column.speed} style={{ '--x': column.x, '--y': column.y, '--w': column.w } as CSSProperties}>
                  {column.entries.map(({ entry, h }, t) => (
                    <Tile key={t} entry={entry} h={h} delay={(c % 4) * 80 + t * 110} sizes={column.w > 200 ? '(min-width: 1024px) 24vw, 1px' : '(min-width: 1024px) 13vw, 1px'} />
                  ))}
                </div>
              ) : null,
            )}
          </div>
        ))}
      </div>
      <div className="e-few">
        {phone.map((column, c) => (
          <div key={c} className="e-few-col" style={{ '--y': column.y } as CSSProperties}>
            {column.entries.map(({ entry, h }, t) => (
              <Tile key={t} entry={entry} h={h} delay={c * 90 + t * 120} sizes="(max-width: 1023px) 32vw, 1px" />
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
