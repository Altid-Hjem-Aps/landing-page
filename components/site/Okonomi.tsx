'use client'

import { useEffect, useRef, type RefObject } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion'
import Phone from '@/components/site/primitives/Phone'
import Pin from '@/components/site/primitives/Pin'
import Caption from '@/components/site/primitives/Caption'
import { HJEM_HERO_CROP, PAINTING, SCREENS } from '@/components/site/screens'
import './okonomi.css'

// All numbers below are scroll positions and sizes of the page at 1440 x 900, where
// the stage starts at 6120 and is released at 8100. Pin gives 0 to 1 over that span.
const START = 6120
const RELEASE = 8100
const designY = (p: number) => START + (RELEASE - START) * p

const lerp = (y: number, y0: number, y1: number, a: number, b: number) =>
  a + (b - a) * Math.min(1, Math.max(0, (y - y0) / (y1 - y0)))

/** The rounded area and what stands on its bottom edge, for one scroll position. */
function area(y: number, vw: number, vh: number) {
  const u = Math.min(vw, 1920) / 1440
  const fullW = vw - 40 * u
  // On a tall tablet the area keeps its proportions and stands in the middle.
  const fullH = Math.min(vh - 40 * u, 860 * u)
  // 302 x 388 until 6300, then straight to the full 1400 x 860.
  const w = (lerp(y, 6300, RELEASE, 302, 1400) / 1400) * fullW
  const h = (lerp(y, 6300, RELEASE, 388, 860) / 860) * fullH
  const insetX = (fullW - w) / 2
  const insetY = (fullH - h) / 2
  return {
    clip: `inset(${insetY}px ${insetX}px ${insetY}px ${insetX}px round ${31.68 * u}px)`,
    // Scene and words stay on the bottom edge. The scene fits its height until 742 high.
    lift: -insetY,
    sceneScale: Math.min(1, h / (742 * u)),
  }
}

// One entry per slot: the tiles pop in turn, the slots a little after each other.
const TILES = [
  { name: 'Transport', className: 'ok-tile--sky', icon: 'bus' },
  { name: 'Restaurant og takeaway', className: 'ok-tile--lavender', icon: 'fork' },
  { name: 'Tøj', className: 'ok-tile--rose', icon: 'shirt' },
  { name: 'Andet', className: 'ok-tile--sand', icon: 'dots' },
  { name: 'Drømme', className: 'ok-tile--painting', icon: 'painting' },
] as const

function TileFace({ icon }: { icon: (typeof TILES)[number]['icon'] }) {
  if (icon === 'painting') {
    return <Image src={PAINTING.colour.src} alt="" width={PAINTING.colour.width} height={PAINTING.colour.height} sizes="130px" />
  }
  const paths = {
    bus: (
      <>
        <rect x="6" y="5" width="20" height="18" rx="4" />
        <path d="M6 15h20M11 23v4M21 23v4" />
        <circle cx="11" cy="19" r="1" />
        <circle cx="21" cy="19" r="1" />
      </>
    ),
    fork: <path d="M10 4v8a3 3 0 0 0 6 0V4M13 4v24M23 4c-3 2-4 6-4 10 0 2 1 3 4 3zM23 4v24" />,
    shirt: <path d="M11 5 4 10l3 5 3-2v14h12V13l3 2 3-5-7-5c-1 3-3 4-5 4s-4-1-5-4z" />,
    dots: (
      <>
        <circle cx="8" cy="16" r="2.4" />
        <circle cx="16" cy="16" r="2.4" />
        <circle cx="24" cy="16" r="2.4" />
      </>
    ),
  }
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[icon]}
    </svg>
  )
}

function Table() {
  return (
    <svg className="ok-table" viewBox="0 0 1440 742" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="ok-surface" x1="0" y1="1" x2="1" y2="0.2">
          <stop offset="0" stopColor="#8E8A79" />
          <stop offset="0.14" stopColor="#D5CFBF" />
          <stop offset="0.34" stopColor="#F1ECE0" />
          <stop offset="0.62" stopColor="#D9D3C4" />
          <stop offset="1" stopColor="#C9C3B3" />
        </linearGradient>
        <linearGradient id="ok-front" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#F4EFE3" />
          <stop offset="1" stopColor="#DFD9C9" />
        </linearGradient>
      </defs>
      <polygon points="0,587 1440,369 1440,592 470,742 0,742" fill="url(#ok-surface)" />
      <polygon points="470,742 1440,592 1440,742" fill="url(#ok-front)" />
    </svg>
  )
}

function Scene() {
  return (
    <>
      <Table />
      <span className="ok-beam" aria-hidden />
      <span className="ok-specks" aria-hidden />
      <span className="ok-contact" aria-hidden />
      <div className="ok-reflection" aria-hidden>
        <Phone screen={SCREENS.okonomiTop} sizes="(max-width: 767px) 66vw, 320px" />
      </div>
      <Phone className="ok-phone" screen={SCREENS.okonomiTop} sizes="(max-width: 767px) 66vw, 320px" />
    </>
  )
}

function Front() {
  return (
    <>
      <div className="ok-wallet" aria-hidden>
        <div className="ok-card">
          <span className="ok-card-face">
            <Image
              src={HJEM_HERO_CROP.src}
              alt=""
              width={HJEM_HERO_CROP.width}
              height={HJEM_HERO_CROP.height}
              sizes="(max-width: 767px) 80vw, 560px"
            />
          </span>
        </div>
        <div className="ok-pocket">
          <svg viewBox="0 0 410 197" preserveAspectRatio="none">
            <defs>
              <linearGradient id="ok-pocket" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0A3219" />
                <stop offset="1" stopColor="#00260E" />
              </linearGradient>
            </defs>
            <path
              d="M18 0H110C150 0 165 22 206 22S262 0 302 0H392A18 18 0 0 1 410 18V179A18 18 0 0 1 392 197H18A18 18 0 0 1 0 179V18A18 18 0 0 1 18 0Z"
              fill="url(#ok-pocket)"
              stroke="#B7F2A7"
              strokeOpacity="0.2"
            />
            <path d="M170 197C178 178 232 178 240 197" fill="none" stroke="#B7F2A7" strokeOpacity="0.2" />
          </svg>
          <p className="ok-sum">
            8.166 kr.
            <span>tilbage</span>
          </p>
        </div>
      </div>

      <div className="ok-banner">
        <h3>Forbind banken sikkert med MitID.</h3>
        <p>
          <span>Se, hvordan pengene bliver brugt.</span> <span>Appen kan kun læse.</span>
        </p>
      </div>

      <div className="ok-slots" aria-hidden>
        {[0, 1, 2].map((slot) => (
          <div key={slot} className={`ok-slot ok-slot--${slot}`}>
            {TILES.map((tile, i) => (
              <span
                key={tile.name}
                className={`ok-tile ${tile.className}`}
                style={{ '--ok-at': (i + slot * 2) % TILES.length, '--ok-slot': slot } as React.CSSProperties}
              >
                <TileFace icon={tile.icon} />
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="sr-only">I kan se forbruget på Transport, Restaurant og takeaway, Tøj og Andet.</p>
    </>
  )
}

type View = { vw: number; vh: number }

function useDesign<T>(progress: MotionValue<number>, resized: MotionValue<number>, view: RefObject<View>, fn: (y: number, v: View) => T) {
  return useTransform<number, T>([progress, resized], ([p]) => fn(designY(p), view.current))
}

function Stage({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null)
  const view = useRef<View>({ vw: 1440, vh: 900 })
  // Bumped on resize, so the stage repaints without a scroll.
  const resized = useMotionValue(0)

  useEffect(() => {
    const read = () => {
      view.current = { vw: window.innerWidth, vh: window.innerHeight }
      resized.set(resized.get() + 1)
    }
    read()
    window.addEventListener('resize', read)
    return () => window.removeEventListener('resize', read)
  }, [resized])

  const clipPath = useDesign(progress, resized, view, (y, v) => area(y, v.vw, v.vh).clip)
  const lift = useDesign(progress, resized, view, (y, v) => area(y, v.vw, v.vh).lift)
  const sceneScale = useDesign(progress, resized, view, (y, v) => area(y, v.vw, v.vh).sceneScale)
  // Grows, untilts and fades in while the last card of the hero leaves.
  const scale = useTransform(progress, (p) => lerp(designY(p), 6150, 6633, 0.637, 1))
  const rotate = useTransform(progress, (p) => lerp(designY(p), 6150, 6670, -7.7, 0))
  const opacity = useTransform(progress, (p) => lerp(designY(p), 6120, 6620, 0, 1))
  // The page under the stage: dark, then a cream block overtakes it from below.
  const dark = useTransform(progress, (p) => (designY(p) < 6302 ? 0 : 1))
  const stripes = useTransform(progress, (p) => lerp(designY(p), 6600, 7150, 1, 0.2))
  const stripesY = useDesign(progress, resized, view, (y, v) => (-Math.max(0, y - 7200) / 900) * v.vh)
  // 900 down at 7112, 90 above the top at 7950, where it stays until it scrolls away.
  const blockY = useDesign(progress, resized, view, (y, v) => (lerp(y, 7112, 7950, 900, -90) / 900) * v.vh)
  const captionOpacity = useTransform(progress, (p) => lerp(designY(p), 7950, 8040, 0, 1))

  // The words, the wallet and the tiles are played once the stage is big enough,
  // not scrubbed: scrolling only decides when.
  const setOn = (p: number) => {
    ref.current?.toggleAttribute('data-on', designY(p) >= 7400)
  }
  useMotionValueEvent(progress, 'change', setOn)
  useEffect(() => setOn(progress.get()))

  return (
    <div ref={ref} className="ok-stage">
      <motion.div className="ok-dark ah-m" style={{ opacity: dark }} aria-hidden>
        <motion.span className="ok-stripes ah-m" style={{ opacity: stripes, y: stripesY }} />
      </motion.div>
      <motion.div className="ok-block ah-m" style={{ y: blockY }} aria-hidden />

      <motion.div className="ok-tilt ah-m" style={{ scale, rotate, opacity }}>
        <motion.div className="ok-area" style={{ clipPath }}>
          <motion.div className="ok-scene ah-m" style={{ y: lift, scale: sceneScale }}>
            <Scene />
          </motion.div>
          <motion.div className="ok-words ah-m" style={{ y: lift }}>
            <h2 className="ok-title">
              <span className="ok-word ok-word--a">Alle konti.</span>{' '}
              <span className="ok-word ok-word--b">Ét overblik.</span>
            </h2>
          </motion.div>
          <motion.div className="ok-front ah-m" style={{ y: lift }}>
            <Front />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div className="ok-caption ah-m" style={{ opacity: captionOpacity }}>
        <Caption />
      </motion.div>
    </div>
  )
}

export default function Okonomi() {
  return (
    <section id="okonomi" className="ok">
      <Pin vh={320} mobileVh={null}>
        {(progress) => <Stage progress={progress} />}
      </Pin>
    </section>
  )
}
