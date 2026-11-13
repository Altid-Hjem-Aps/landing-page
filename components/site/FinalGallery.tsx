'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { FINAL, FINAL_LAYOUT, MAD } from './copy'

// The final block's gallery as Thor laid it out by hand in Figma ("Galleri · 1440", 10945:3):
// on a computer (from 1024 px) a 1440 x 921 stage that scales with the window (to 1800 wide),
// every tile at his x, y, width and height, in his order, the photos cropped as in his frame,
// the screens on their toned cards without the "beta" badge (copies of the screens with his
// cover patches applied), the heading, line and store pills where he put them. A phone keeps
// bevel.health's grid from before: the middle four columns over the heading and a second row
// under the button. What the tiles are is FINAL.gallery; where they sit is FINAL_LAYOUT
// (copy.ts). Each tile rises in the first time it is seen (data-reveal); nothing else moves.
//
// Arrange mode, for Thor: open the page with ?arrange. Every tile can be dragged (mouse,
// trackpad or finger). On a computer it moves freely in the stage's design px; on a phone it
// snaps to a column sideways and moves in px up and down. The layout is kept in this browser
// (localStorage), so a reload keeps it; a small panel copies the layout as JSON for FINAL_LAYOUT
// and resets it to the one in the code. Without ?arrange nothing of this is there.

type Entry = (typeof FINAL.gallery)[number]
type WallSpot = { x: number; y: number; w: number; h: number }
type PhoneSpot = { col: number; top: number; h: number; below?: boolean }
type Layout = { wall: Record<string, WallSpot>; phone: Record<string, PhoneSpot> }
type View = keyof Layout

/** The computer's stage, in design px (Thor's frame). */
const STAGE_W = 1440
/** The phone's grid: eight columns, 16 px apart, as bevel's. */
const COLUMNS = 8
const GAP = 16
/** Where arrange mode keeps a layout in the browser; a new name for every new layout. */
const SAVED = 'altid-final-layout-figma'

const CODE_LAYOUT: Layout = FINAL_LAYOUT
for (const entry of FINAL.gallery) {
  if (!CODE_LAYOUT.wall[entry.id]) throw new Error(`FINAL_LAYOUT.wall has no place for ${entry.id}`)
}
for (const view of ['wall', 'phone'] as const) {
  for (const id of Object.keys(CODE_LAYOUT[view])) {
    if (!FINAL.gallery.some((entry) => entry.id === id)) throw new Error(`FINAL_LAYOUT.${view} names ${id}, which FINAL.gallery does not have`)
  }
}
for (const [id, spot] of Object.entries(CODE_LAYOUT.phone)) {
  if (spot.col < 1 || spot.col > COLUMNS) throw new Error(`FINAL_LAYOUT.phone puts ${id} in column ${spot.col}`)
}
const BY_ID = new Map<string, Entry>(FINAL.gallery.map((entry) => [entry.id, entry]))

const SIZES = '(max-width: 767px) 100px, (max-width: 1440px) 200px, 260px'
const round = (n: number) => Math.round(n * 10) / 10

function TileBody({ entry, view, arrange }: { entry: Entry; view: View; arrange: boolean }) {
  const drag = arrange ? { draggable: false } : {}
  switch (entry.kind) {
    case 'photo': {
      // On a computer the picture's own box from Thor's frame; on a phone a cover with a focus.
      const crop = entry.crop
      const box: CSSProperties | undefined = view === 'wall' ? { left: `${crop.x}%`, top: `${crop.y}%`, width: `${crop.w}%`, height: `${crop.h}%` } : undefined
      return (
        <span className="e-crop" style={box}>
          <Image src={entry.src} alt={entry.alt} fill sizes={SIZES} style={{ objectFit: 'cover', objectPosition: view === 'wall' ? '50% 50%' : entry.focus }} {...drag} />
        </span>
      )
    }
    case 'screen':
      // The whole width of the screen on its toned card, from the top.
      return (
        <span className="e-screen-in">
          <Image src={entry.src} alt={entry.alt} width={900} height={1951} sizes={SIZES} {...drag} />
        </span>
      )
    case 'plate':
      return <Image src={MAD.plates[entry.plate].src} alt={MAD.plates[entry.plate].name} width={694} height={694} sizes={SIZES} {...drag} />
    case 'note':
      // The assistant's notification as in Thor's frame; decoration.
      return (
        <div className="e-note-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="e-note-icon" src="/app-badge.png" alt="" width={32} height={32} {...drag} />
          <span className="e-note-text">
            <span className="e-note-top">
              <b>{entry.title}</b>
              <small>{entry.time}</small>
            </span>
            <span className="e-note-body">{entry.body}</span>
            <span className="e-note-action">
              <svg viewBox="0 0 12.8 12.8" width="13" height="13" fill="none">
                <path d="M2.8 6.8l2.4 2.4 4.8-5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {entry.action}
            </span>
          </span>
        </div>
      )
    default:
      throw new Error(`No tile for ${(entry as Entry).kind}`)
  }
}

const KIND_CLASS: Record<Entry['kind'], string> = { photo: 'e-cover', screen: 'e-screen', plate: 'e-plate', note: 'e-note-tile' }

export default function FinalGallery({ children }: { children: ReactNode }) {
  const [arrange, setArrange] = useState(false)
  const [layout, setLayout] = useState<Layout>(CODE_LAYOUT)
  const [copied, setCopied] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const drag = useRef<{ view: View; id: string; x: number; y: number; start: WallSpot | PhoneSpot; step: number } | null>(null)
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
    // A computer: px on screen per design px of the stage. A phone: one column and its gap.
    const step = view === 'wall' ? (stage.current as HTMLDivElement).getBoundingClientRect().width / STAGE_W : event.currentTarget.getBoundingClientRect().width + GAP
    drag.current = { view, id, x: event.clientX, y: event.clientY, start: layout[view][id], step }
  }
  const onDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    moved.current = true
    const dx = event.clientX - d.x
    const dy = event.clientY - d.y
    if (d.view === 'wall') {
      const start = d.start as WallSpot
      const spot = { ...start, x: round(start.x + dx / d.step), y: round(start.y + dy / d.step) }
      setLayout((now) => ({ ...now, wall: { ...now.wall, [d.id]: spot } }))
    } else {
      const start = d.start as PhoneSpot
      const spot = { ...start, col: Math.min(COLUMNS, Math.max(1, start.col + Math.round(dx / d.step))), top: Math.round(start.top + dy) }
      setLayout((now) => ({ ...now, phone: { ...now.phone, [d.id]: spot } }))
    }
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

  const tile = (view: View, id: string, place: CSSProperties, below?: boolean) => {
    const entry = BY_ID.get(id) as Entry
    return (
      <div
        key={`${view}-${id}`}
        className={`e-tile ${'plain' in entry ? '' : KIND_CLASS[entry.kind]}`}
        data-view={view}
        data-below={below ? 'true' : undefined}
        data-tile={id}
        data-tone={'tone' in entry ? entry.tone : undefined}
        data-reveal={arrange ? undefined : ''}
        aria-hidden={entry.kind === 'note' ? 'true' : undefined}
        style={place}
        onPointerDown={onDown(view, id)}
        onPointerMove={onDrag}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <TileBody entry={entry} view={view} arrange={arrange} />
      </div>
    )
  }

  return (
    <div ref={stage} className="e-wall" data-arrange={arrange ? 'true' : undefined}>
      {children}
      {/* Each layout shown at its own widths (CSS), in the layout's order. */}
      {Object.entries(layout.wall).map(([id, s], i) => tile('wall', id, { '--x': s.x, '--y': s.y, '--w': s.w, '--h': s.h, '--rd': `${(i % 4) * 80}ms` } as CSSProperties))}
      {Object.entries(layout.phone).map(([id, s]) => tile('phone', id, { '--col': s.col, '--top': s.top, '--h': s.h, '--rd': `${(s.col - 1) * 60}ms` } as CSSProperties, s.below))}
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
