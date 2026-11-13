'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { FINAL, FINAL_LAYOUT, MAD } from './copy'

// The final block's gallery, rebuilt 1:1 on bevel.health's "Crafted with Care" (Thor 13/11,
// measured at 1440, 1920, 1024 and 390): eight columns of rounded tiles, 16 px apart, the
// middle four standing over the heading and the outer four running down beside it; the tiles
// keep their heights at every width and the columns share the width (143 px each at 1440). Our
// heading, line and store pills take the place of theirs, with the room under the pills for the
// QR card. On a phone only the middle four columns are on the screen, as on bevel's phone, so a
// second row under the button carries the two lower areas. What the tiles are is FINAL.gallery;
// where they sit is FINAL_LAYOUT (copy.ts). Each tile rises in the first time it is seen
// (data-reveal), column after column; bevel's gallery does not otherwise move, so neither does
// this one.
//
// Arrange mode, for Thor: open the page with ?arrange. Every tile can be dragged (mouse, trackpad
// or finger): sideways it snaps to a column, up and down it moves in px. A computer arranges the
// computer's layout, a phone the phone's. The layout is kept in this browser (localStorage), so
// a reload keeps it; a small panel copies the layout as JSON for FINAL_LAYOUT and resets it to
// the one in the code. Without ?arrange nothing of this is there.

type Entry = (typeof FINAL.gallery)[number]
type Spot = { col: number; top: number; h: number; below?: boolean }
type View = 'wall' | 'phone'
type Layout = Record<View, Record<string, Spot>>

const COLUMNS = 8
/** The space between columns, as bevel's. */
const GAP = 16
/** Where arrange mode keeps a layout in the browser; a new name for every new grid. */
const SAVED = 'altid-final-layout-bevel'

const CODE_LAYOUT: Layout = FINAL_LAYOUT
for (const entry of FINAL.gallery) {
  if (!CODE_LAYOUT.wall[entry.id]) throw new Error(`FINAL_LAYOUT.wall has no place for ${entry.id}`)
}
for (const view of ['wall', 'phone'] as const) {
  for (const [id, spot] of Object.entries(CODE_LAYOUT[view])) {
    if (!FINAL.gallery.some((entry) => entry.id === id)) throw new Error(`FINAL_LAYOUT.${view} names ${id}, which FINAL.gallery does not have`)
    if (spot.col < 1 || spot.col > COLUMNS) throw new Error(`FINAL_LAYOUT.${view} puts ${id} in column ${spot.col}`)
  }
}
const BY_ID = new Map<string, Entry>(FINAL.gallery.map((entry) => [entry.id, entry]))

const SIZES = '(max-width: 767px) 100px, 160px'

function TileBody({ entry, arrange }: { entry: Entry; arrange: boolean }) {
  const drag = arrange ? { draggable: false } : {}
  switch (entry.kind) {
    case 'photo':
    case 'art':
      return <Image src={entry.src} alt={entry.alt} fill sizes={SIZES} style={{ objectFit: 'cover', objectPosition: entry.focus }} {...drag} />
    case 'screen':
      // The whole width of the screen on its toned card, from the top.
      return (
        <span className="e-screen-in">
          <Image src={entry.src} alt={entry.alt} width={900} height={1951} sizes={SIZES} {...drag} />
        </span>
      )
    case 'plate':
      return <Image src={MAD.plates[entry.plate].src} alt={MAD.plates[entry.plate].name} width={143} height={143} sizes={SIZES} {...drag} />
    case 'note':
      // The assistant's notification as in the hero, upright to fit a column; decoration.
      return (
        <div className="hl-note e-note-card">
          <span className="hl-note-top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/app-badge.png" alt="" width={36} height={36} {...drag} />
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
        </div>
      )
    case 'price':
      // The electricity price as the app's Energi screen shows it; decoration.
      return (
        <div className="e-price">
          <span className="e-price-value">
            <b>{entry.value}</b> {entry.unit}
          </span>
          <span className="e-price-row">
            <span className="e-price-tag">{entry.tag}</span>
            <small>{entry.line}</small>
          </span>
        </div>
      )
    default:
      throw new Error(`No tile for ${(entry as Entry).kind}`)
  }
}

const KIND_CLASS: Record<Entry['kind'], string> = { photo: 'e-cover', art: 'e-cover', screen: 'e-screen', plate: 'e-plate', note: 'e-note-tile', price: 'e-price-tile' }
const DRAWN: Entry['kind'][] = ['note', 'price']

export default function FinalGallery({ children }: { children: ReactNode }) {
  const [arrange, setArrange] = useState(false)
  const [layout, setLayout] = useState<Layout>(CODE_LAYOUT)
  const [copied, setCopied] = useState(false)
  const drag = useRef<{ view: View; id: string; x: number; y: number; start: Spot; step: number } | null>(null)
  const moved = useRef(false)

  // Arrange mode only with ?arrange, read in the browser; a saved layout comes with it.
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('arrange')) return
    const saved = window.localStorage.getItem(SAVED)
    /* eslint-disable react-hooks/set-state-in-effect -- the address is only known in the browser */
    if (saved) setLayout(JSON.parse(saved) as Layout)
    setArrange(true)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  // Every moved layout is kept in this browser.
  useEffect(() => {
    if (moved.current) window.localStorage.setItem(SAVED, JSON.stringify(layout))
  }, [layout])

  const onDown = (view: View, id: string) => (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!arrange) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    // One column and its gap, in px: the tile's own width and the 16 px between columns.
    const step = event.currentTarget.getBoundingClientRect().width + GAP
    drag.current = { view, id, x: event.clientX, y: event.clientY, start: layout[view][id], step }
  }
  const onDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    moved.current = true
    const col = Math.min(COLUMNS, Math.max(1, d.start.col + Math.round((event.clientX - d.x) / d.step)))
    const top = Math.round(d.start.top + event.clientY - d.y)
    setLayout((now) => ({ ...now, [d.view]: { ...now[d.view], [d.id]: { ...d.start, col, top } } }))
  }
  const onUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    event.currentTarget.releasePointerCapture(event.pointerId)
    drag.current = null
  }
  const copy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(layout, null, 2))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }
  const reset = () => {
    moved.current = false
    window.localStorage.removeItem(SAVED)
    setLayout(CODE_LAYOUT)
  }

  return (
    <div className="e-wall" data-arrange={arrange ? 'true' : undefined}>
      {children}
      {/* Both layouts, each shown at its own widths (CSS), in the layout's order, so a tile listed
          later lies on top. */}
      {(['wall', 'phone'] as const).flatMap((view) =>
        Object.entries(layout[view]).map(([id, spot]) => {
          const entry = BY_ID.get(id) as Entry
          const style = { '--col': spot.col, '--top': spot.top, '--h': spot.h, '--rd': `${(spot.col - 1) * 60}ms` } as CSSProperties
          return (
            <div
              key={`${view}-${id}`}
              className={`e-tile ${KIND_CLASS[entry.kind]}`}
              data-view={view}
              data-below={spot.below ? 'true' : undefined}
              data-tile={id}
              data-tone={'tone' in entry ? entry.tone : undefined}
              data-reveal={arrange ? undefined : ''}
              aria-hidden={DRAWN.includes(entry.kind) ? 'true' : undefined}
              style={style}
              onPointerDown={onDown(view, id)}
              onPointerMove={onDrag}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            >
              <TileBody entry={entry} arrange={arrange} />
            </div>
          )
        }),
      )}
      {arrange ? (
        <div className="e-arrange" role="group" aria-label={FINAL.arrange.title}>
          <b>{FINAL.arrange.title}</b>
          <button type="button" onClick={copy}>
            {copied ? FINAL.arrange.copied : FINAL.arrange.copy}
          </button>
          <button type="button" onClick={reset}>
            {FINAL.arrange.reset}
          </button>
        </div>
      ) : null}
    </div>
  )
}
