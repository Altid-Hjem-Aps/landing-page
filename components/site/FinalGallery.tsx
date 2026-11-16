'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { FINAL, FINAL_LAYOUT, MAD } from './copy'
import Marquee from './Marquee'
import { QR_CARD_PLACE, type QrCardPlace } from './PillQr'

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
type PhoneSpot = { col: number; span?: number; top: number; h: number; below?: boolean }
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
// Every picture is on the computer wall or in a phone row (or both); none is left unused.
const IN_ROWS = new Set<string>([...FINAL_LAYOUT.rows.top, ...FINAL_LAYOUT.rows.bottom])
for (const entry of FINAL.gallery) {
  if (!CODE_LAYOUT.wall[entry.id] && !IN_ROWS.has(entry.id)) throw new Error(`FINAL_LAYOUT has no place for ${entry.id}`)
}
for (const view of ['wall', 'phone'] as const) {
  for (const id of Object.keys(CODE_LAYOUT[view])) {
    if (!FINAL.gallery.some((entry) => entry.id === id)) throw new Error(`FINAL_LAYOUT.${view} names ${id}, which FINAL.gallery does not have`)
  }
}
for (const [id, spot] of Object.entries(CODE_LAYOUT.phone)) {
  if (spot.col < 1 || spot.col + (spot.span ?? 1) - 1 > COLUMNS) throw new Error(`FINAL_LAYOUT.phone puts ${id} in columns ${spot.col} to ${spot.col + (spot.span ?? 1) - 1}`)
}
const BY_ID = new Map<string, Entry>(FINAL.gallery.map((entry) => [entry.id, entry]))

// How wide each picture is drawn, so the browser fetches a sharp enough copy. A photo fills its
// tile as a crop (a cover on a phone, Thor's crop box on a computer, up to almost three times the
// tile's width), so it is drawn far wider than the tile; a screen or a plate is the tile's width.
const PHOTO_SIZES = '(max-width: 1023px) 110vw, 34vw'
const SIZES = '(max-width: 1023px) 55vw, (max-width: 1440px) 200px, 260px'
const round = (n: number) => Math.round(n * 10) / 10

// `clone`: the sliding row's second copy, which a screen reader skips (empty alt texts).
function TileBody({ entry, view, arrange, clone = false }: { entry: Entry; view: View | 'row'; arrange: boolean; clone?: boolean }) {
  const drag = arrange ? { draggable: false } : {}
  switch (entry.kind) {
    case 'photo': {
      // On a computer the picture's own box from Thor's frame; on a phone a cover with a focus.
      const crop = entry.crop
      const box: CSSProperties | undefined = view === 'wall' ? { left: `${crop.x}%`, top: `${crop.y}%`, width: `${crop.w}%`, height: `${crop.h}%` } : undefined
      return (
        <span className="e-crop" style={box}>
          <Image src={entry.src} alt={clone ? '' : entry.alt} fill sizes={PHOTO_SIZES} style={{ objectFit: 'cover', objectPosition: view === 'wall' ? '50% 50%' : entry.focus }} {...drag} />
        </span>
      )
    }
    case 'screen':
      // The whole width of the screen on its toned card, from the top.
      return (
        <span className="e-screen-in">
          <Image src={entry.src} alt={clone ? '' : entry.alt} width={900} height={1951} sizes={SIZES} {...drag} />
        </span>
      )
    case 'plate':
      return <Image src={MAD.plates[entry.plate].src} alt={clone ? '' : MAD.plates[entry.plate].name} width={694} height={694} sizes={SIZES} {...drag} />
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

// A phone (Thor 15/11): every picture of the gallery in two slow sliding rows, two tiles on the
// screen at a time in each, the top row moving left above the text and the bottom row moving
// right under it. The notification stays on the computer wall: it is words, not a picture.
const ROWS = {
  top: FINAL_LAYOUT.rows.top.map((id) => BY_ID.get(id) as Entry),
  bottom: FINAL_LAYOUT.rows.bottom.map((id) => BY_ID.get(id) as Entry),
}
for (const [row, entries] of Object.entries(ROWS)) {
  entries.forEach((entry, i) => {
    if (!entry) throw new Error(`FINAL_LAYOUT.rows.${row}[${i}] names no gallery picture`)
  })
}

function SlideRow({ row }: { row: keyof typeof ROWS }) {
  const items = (copy: boolean) =>
    ROWS[row].map((entry, i) => (
      <li key={`${entry.id}-${i}-${copy}`} className={`e-slide ${KIND_CLASS[entry.kind]}`} data-view="row" data-tone={'tone' in entry ? entry.tone : undefined}>
        <TileBody entry={entry} view="row" arrange={false} clone={copy} />
      </li>
    ))
  return <Marquee label={FINAL.arrange.title} className={`e-row e-row-${row}`} first={items(false)} second={items(true)} swipe reverse={row === 'bottom'} />
}

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

  // A store pill's QR card pushes the wall's tiles it hits fully out of its way while it grows,
  // and a pushed tile that hits another pushes that one on, a chain through the wall (Thor 15/11:
  // "if a image in the gallery hits another ... a chain effect of the images all moving"). Solved
  // afresh from the layout each frame the card moves: every tile the card covers goes out the
  // shortest way, then every pair that now overlaps is pulled apart, the tile that has moved less
  // giving way, a few rounds over. Tiles that overlap in the layout itself are left as they are.
  // The reveal's springy transform transition carries each move. Not while arranging.
  useEffect(() => {
    const wall = stage.current
    if (!wall || arrange) return
    const ROOM = 18
    const GAP = 10
    const ROUNDS = 16
    type Box = { el: HTMLElement; x: number; y: number; w: number; h: number; dx: number; dy: number }
    const tiles = () => [...wall.querySelectorAll<HTMLElement>(".e-tile[data-view='wall']")].filter((t) => t.offsetParent !== null)
    const overlap = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }, room: number) =>
      a.x < b.x + b.w + room && b.x < a.x + a.w + room && a.y < b.y + b.h + room && b.y < a.y + a.h + room
    // The shortest way to move `a` out of `b` (with room), as [dx, dy].
    const out = (a: Box, b: { x: number; y: number; w: number; h: number }, room: number): [number, number] => {
      const ax = a.x + a.dx
      const ay = a.y + a.dy
      const ways: [number, number][] = [
        [b.x - room - (ax + a.w), 0],
        [b.x + b.w + room - ax, 0],
        [0, b.y - room - (ay + a.h)],
        [0, b.y + b.h + room - ay],
      ]
      return ways.reduce((best, way) => (Math.hypot(...way) < Math.hypot(...best) ? way : best))
    }
    const reset = () => {
      for (const tile of tiles()) tile.style.transform = ''
    }
    const onPlace = (event: Event) => {
      const { rect } = (event as CustomEvent<QrCardPlace>).detail
      if (!rect) return reset()
      const origin = wall.getBoundingClientRect()
      const boxes: Box[] = tiles().map((el) => ({ el, x: origin.left + el.offsetLeft, y: origin.top + el.offsetTop, w: el.offsetWidth, h: el.offsetHeight, dx: 0, dy: 0 }))
      const card = { x: rect.left, y: rect.top, w: rect.width, h: rect.height }
      const together = new Set<string>()
      boxes.forEach((a, i) => boxes.forEach((b, j) => i < j && overlap(a, b, 0) && together.add(`${i}-${j}`)))
      const at = (b: Box) => ({ x: b.x + b.dx, y: b.y + b.dy, w: b.w, h: b.h })
      for (let round = 0; round < ROUNDS; round++) {
        let moved = false
        for (const box of boxes) {
          if (!overlap(at(box), card, ROOM)) continue
          const [x, y] = out(box, card, ROOM)
          box.dx += x
          box.dy += y
          moved = true
        }
        boxes.forEach((a, i) =>
          boxes.forEach((b, j) => {
            if (i >= j || together.has(`${i}-${j}`) || !overlap(at(a), at(b), GAP)) return
            const [mover, still] = Math.hypot(a.dx, a.dy) >= Math.hypot(b.dx, b.dy) ? [b, a] : [a, b]
            const [x, y] = out(mover, at(still), GAP)
            mover.dx += x
            mover.dy += y
            moved = true
          }),
        )
        if (!moved) break
      }
      for (const box of boxes) {
        box.el.style.transitionDelay = '0s'
        box.el.style.transform = box.dx || box.dy ? `translate(${box.dx.toFixed(1)}px, ${box.dy.toFixed(1)}px)` : ''
      }
    }
    window.addEventListener(QR_CARD_PLACE, onPlace)
    return () => {
      window.removeEventListener(QR_CARD_PLACE, onPlace)
      for (const tile of tiles()) {
        tile.style.transform = ''
        tile.style.transitionDelay = ''
      }
    }
  }, [arrange])

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
      <SlideRow row="top" />
      {children}
      <SlideRow row="bottom" />
      {/* Each layout shown at its own widths (CSS), in the layout's order. */}
      {Object.entries(layout.wall).map(([id, s], i) => tile('wall', id, { '--x': s.x, '--y': s.y, '--w': s.w, '--h': s.h, '--rd': `${(i % 4) * 80}ms`, '--fd': `${5.4 + (i % 4) * 0.7}s`, '--fdel': `-${((i * 1.3) % 5).toFixed(1)}s` } as CSSProperties))}
      {Object.entries(layout.phone).map(([id, s]) => tile('phone', id, { '--col': s.col, '--span': s.span ?? 1, '--top': s.top, '--h': s.h, '--rd': `${(s.col - 1) * 60}ms` } as CSSProperties, s.below))}
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
