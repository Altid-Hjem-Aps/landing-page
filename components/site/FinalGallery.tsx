'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { FINAL, FINAL_LAYOUT, MAD } from './copy'
import { useMotionPrefs } from './MotionPrefs'

// The final block's collage, in the style of the old "Lavet med omhu til danske hjem" block
// (Thor 13/11): rounded tiles in the site's tones around the block's text. What the tiles are is
// FINAL.gallery; where they sit is FINAL_LAYOUT, both in copy.ts, so a layout is just numbers.
//
// Computers (from 1024 px, CSS): a stage 1440 x 960 design px (growing to 1800 wide with the
// window) with the text in its middle, the heading and line scaled with it. As the block passes,
// the tiles drift up to 16 px at their own speeds (transform only), and each rises in the first
// time it is seen (data-reveal); neither with reduced motion. Phones and tablets: the text, then
// a stage 390 x 410 with the tiles the phone layout lists, still.
//
// Arrange mode, for Thor: open the page with ?arrange. Every tile can be dragged (mouse or
// trackpad) and the layout is kept in this browser (localStorage), so a reload keeps it; a small
// panel copies the layout as JSON for FINAL_LAYOUT, resets it to the one in the code, and
// switches between the computer's and the phone's stage. No drift and no entrance meanwhile.
// Without ?arrange nothing of this is there.

type Entry = (typeof FINAL.gallery)[number]
type Spot = { x: number; y: number; w: number; h: number }
type View = 'wall' | 'phone'
type Layout = Record<View, Record<string, Spot>>

/** The stages' size in design px. */
const STAGE: Record<View, { w: number; h: number }> = { wall: { w: 1440, h: 960 }, phone: { w: 390, h: 410 } }
/** The most a tile drifts, in px, at speed 1. */
const DRIFT = 16
const SAVED = 'altid-final-layout'

const CODE_LAYOUT: Layout = FINAL_LAYOUT
for (const entry of FINAL.gallery) {
  if (!CODE_LAYOUT.wall[entry.id]) throw new Error(`FINAL_LAYOUT.wall has no place for ${entry.id}`)
}
for (const id of [...Object.keys(CODE_LAYOUT.wall), ...Object.keys(CODE_LAYOUT.phone)]) {
  if (!FINAL.gallery.some((entry) => entry.id === id)) throw new Error(`FINAL_LAYOUT names ${id}, which FINAL.gallery does not have`)
}

/** Each tile's own drift speed, between -0.8 and 0.8, the same on every visit. */
const speedOf = (i: number) => ((i * 7) % 5) / 2.5 - 0.8
const round = (n: number) => Math.round(n * 10) / 10

function TileBody({ entry, sizes, arrange }: { entry: Entry; sizes: string; arrange: boolean }) {
  const drag = arrange ? { draggable: false } : {}
  switch (entry.kind) {
    case 'photo':
      return <Image src={entry.src} alt={entry.alt} fill sizes={sizes} style={{ objectFit: 'cover', objectPosition: entry.focus }} {...drag} />
    case 'screen':
      // On its own toned card, with room all round, as the screens lived before.
      return (
        <span className="e-screen-in">
          <Image src={entry.src} alt={entry.alt} fill sizes={sizes} style={{ objectFit: 'cover', objectPosition: '50% 0%' }} {...drag} />
        </span>
      )
    case 'art':
      return <Image src={entry.src} alt={entry.alt} fill sizes={sizes} style={{ objectFit: entry.cover ? 'cover' : 'contain', objectPosition: entry.focus }} {...drag} />
    case 'plate':
      return <Image src={MAD.plates[entry.plate].src} alt={MAD.plates[entry.plate].name} width={143} height={143} sizes={sizes} {...drag} />
    case 'note':
      // The assistant's notification as in the hero, on a tile of its own; decoration.
      return (
        <div className="hl-note e-note-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/app-badge.png" alt="" width={36} height={36} {...drag} />
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
    default:
      throw new Error(`No tile for ${(entry as Entry).kind}`)
  }
}

const KIND_CLASS: Record<Entry['kind'], string> = { photo: 'e-cover', screen: 'e-screen', art: '', plate: 'e-plate', note: 'e-note-tile' }

function Stage({ view, layout, arrange, onMove, children }: { view: View; layout: Layout; arrange: boolean; onMove: (view: View, id: string, spot: Spot) => void; children?: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null)
  const drag = useRef<{ id: string; x: number; y: number; start: Spot } | null>(null)

  const onDown = (id: string) => (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!arrange) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { id, x: event.clientX, y: event.clientY, start: layout[view][id] }
  }
  const onDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    const box = (stage.current as HTMLDivElement).getBoundingClientRect()
    onMove(view, d.id, { ...d.start, x: round(d.start.x + ((event.clientX - d.x) / box.width) * 100), y: round(d.start.y + ((event.clientY - d.y) / box.height) * 100) })
  }
  const onUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    event.currentTarget.releasePointerCapture(event.pointerId)
    drag.current = null
  }

  const sizes = view === 'wall' ? '(min-width: 1024px) 14vw, 1px' : '(max-width: 1023px) 32vw, 1px'
  return (
    <div ref={stage} className={view === 'wall' ? 'e-wall' : 'e-few'} style={{ '--sw': STAGE[view].w, '--sh': STAGE[view].h } as CSSProperties}>
      {children}
      {FINAL.gallery.map((entry, i) => {
        const spot = layout[view][entry.id]
        if (!spot) return null
        const style = { '--x': spot.x, '--y': spot.y, '--w': spot.w, '--h': spot.h, '--rd': `${(i % 5) * 80}ms` } as CSSProperties
        return (
          <div
            key={entry.id}
            className={`e-tile ${entry.kind === 'art' ? (entry.cover ? 'e-cover' : 'e-art') : KIND_CLASS[entry.kind]}`}
            data-tile={entry.id}
            data-tone={'tone' in entry ? entry.tone : undefined}
            data-speed={view === 'wall' ? speedOf(i) : undefined}
            data-reveal={arrange ? undefined : ''}
            aria-hidden={entry.kind === 'note' ? 'true' : undefined}
            style={style}
            onPointerDown={onDown(entry.id)}
            onPointerMove={onDrag}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <TileBody entry={entry} sizes={sizes} arrange={arrange} />
          </div>
        )
      })}
    </div>
  )
}

export default function FinalGallery({ children }: { children: ReactNode }) {
  const { reduced } = useMotionPrefs()
  const [arrange, setArrange] = useState(false)
  const [layout, setLayout] = useState<Layout>(CODE_LAYOUT)
  const [view, setView] = useState<View | null>(null)
  const [copied, setCopied] = useState(false)
  const wall = useRef<HTMLDivElement>(null)

  // Arrange mode only with ?arrange, read in the browser; a saved layout comes with it.
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('arrange')) return
    const saved = window.localStorage.getItem(SAVED)
    /* eslint-disable react-hooks/set-state-in-effect -- the address is only known in the browser */
    if (saved) setLayout(JSON.parse(saved) as Layout)
    setView(window.matchMedia('(min-width: 1024px)').matches ? 'wall' : 'phone')
    setArrange(true)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  // The drift, on a computer, never while arranging.
  useEffect(() => {
    const element = wall.current?.querySelector('.e-wall') as HTMLDivElement
    const tiles = Array.from(element.querySelectorAll<HTMLElement>('[data-speed]'))
    if (reduced || arrange) {
      for (const tile of tiles) tile.style.translate = ''
      return
    }
    const computer = window.matchMedia('(min-width: 1024px)')
    let frame = 0
    const draw = () => {
      frame = 0
      if (!computer.matches) return
      const box = element.getBoundingClientRect()
      const p = Math.max(-1, Math.min(1, (box.top + box.height / 2 - window.innerHeight / 2) / window.innerHeight))
      for (const tile of tiles) tile.style.translate = `0 ${(p * Number(tile.dataset.speed) * DRIFT).toFixed(1)}px`
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
  }, [reduced, arrange])

  // A move updates the layout live, and every moved layout is kept in this browser.
  const moved = useRef(false)
  const onMove = (stageView: View, id: string, spot: Spot) => {
    moved.current = true
    setLayout((now) => ({ ...now, [stageView]: { ...now[stageView], [id]: spot } }))
  }
  useEffect(() => {
    if (moved.current) window.localStorage.setItem(SAVED, JSON.stringify(layout))
  }, [layout])
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
    <div ref={wall} className="e-gallery" data-arrange={arrange ? 'true' : undefined} data-view={view ?? undefined}>
      <Stage view="wall" layout={layout} arrange={arrange} onMove={onMove}>
        {children}
      </Stage>
      <Stage view="phone" layout={layout} arrange={arrange} onMove={onMove} />
      {arrange ? (
        <div className="e-arrange" role="group" aria-label={FINAL.arrange.title}>
          <b>{FINAL.arrange.title}</b>
          <button type="button" onClick={copy}>
            {copied ? FINAL.arrange.copied : FINAL.arrange.copy}
          </button>
          <button type="button" onClick={reset}>
            {FINAL.arrange.reset}
          </button>
          <button type="button" onClick={() => setView(view === 'wall' ? 'phone' : 'wall')} aria-pressed={view === 'phone'}>
            {view === 'wall' ? FINAL.arrange.phone : FINAL.arrange.wall}
          </button>
        </div>
      ) : null}
    </div>
  )
}
