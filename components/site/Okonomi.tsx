'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import Phone from '@/components/site/primitives/Phone'
import Pin, { useTargetProgress } from '@/components/site/primitives/Pin'
import Caption from '@/components/site/primitives/Caption'
import { PAINTING, SCREENS } from '@/components/site/screens'
import './okonomi.css'

// The screen's own tiles, drawn again so they can leave the phone. x and y take
// each tile from its place on the screen to where it rests; in cqw of the phone.
const TILES = [
  { name: 'Transport', amount: '410 kr.', className: 'ah-oko-tile--transport', x: 5.8, y: 1.4 },
  { name: 'Restaurant og takeaway', amount: '250 kr.', className: 'ah-oko-tile--takeaway', x: -8, y: 0.8 },
  { name: 'Tøj', amount: '224 kr.', className: 'ah-oko-tile--toj', x: 6.4, y: -2.05 },
  { name: 'Andet', amount: '192 kr.', className: 'ah-oko-tile--andet', x: -6.8, y: -2.55 },
]

// One timeline for both pins. The rectangle starts growing while it scrolls in, so
// the short phone pin (20 svh of travel) still gets a real scale-up. On a phone the
// pin starts at 83 % of the scroll, and by then the stage is full size.
const PHONE_WIDTH = '(max-width: 767.98px)'
function timeline(scrolled: number) {
  if (typeof window === 'undefined' || !window.matchMedia(PHONE_WIDTH).matches) return scrolled
  return scrolled < 5 / 6 ? (scrolled / (5 / 6)) * 0.7 : 0.7 + ((scrolled - 5 / 6) / (1 / 6)) * 0.3
}

function Tile({ tile, time }: { tile: (typeof TILES)[number]; time: MotionValue<number> }) {
  const out = useTransform(time, [0.62, 0.85], [0, 1])
  const x = useTransform(out, (v) => `${tile.x * (1 - v)}cqw`)
  const y = useTransform(out, (v) => `${tile.y * (1 - v)}cqw`)
  const scale = useTransform(out, [0, 1], [0.8, 1])
  const opacity = useTransform(time, [0.6, 0.63], [0, 1])
  return (
    <motion.li className={`ah-oko-tile ah-m ${tile.className}`} style={{ x, y, scale, opacity }}>
      <span className="ah-oko-tile-name">{tile.name} ›</span>
      <span className="ah-oko-tile-amount">{tile.amount}</span>
    </motion.li>
  )
}

function Stage({ scrolled }: { scrolled: MotionValue<number> }) {
  const time = useTransform(scrolled, timeline)
  const scale = useTransform(time, [0.2, 0.7], [0.26, 1])
  const cream = useTransform(time, [0.9, 1], [0, 1])
  const words = useTransform(time, [0.52, 0.68], [0, 1])
  const wordsY = useTransform(time, [0.52, 0.68], [28, 0])

  return (
    <>
      <motion.div className="ah-oko-page ah-m" style={{ opacity: cream }} aria-hidden />
      <motion.div className="ah-oko-stage ah-m" style={{ scale }}>
        <div className="ah-oko-table" aria-hidden />
        <motion.div className="ah-oko-words ah-m" style={{ opacity: words, y: wordsY }}>
          <h2 className="ah-h2 ah-hang">“Bruger vi for meget på takeaway?”</h2>
          <p className="ah-body">Forbind banken sikkert med MitID, og se hvordan pengene bliver brugt.</p>
          <p className="ah-oko-trust">
            <span>Appen kan kun læse.</span> <span>Den kan aldrig flytte penge.</span>
          </p>
        </motion.div>
        <div className="ah-oko-stand">
          <span className="ah-oko-contact" aria-hidden />
          <Phone screen={SCREENS.okonomiTop} sizes="(max-width: 767px) 62vw, 420px" style={{ '--ah-phone-w': '100%' } as React.CSSProperties} />
          <ul className="ah-oko-tiles">
            {TILES.map((tile) => (
              <Tile key={tile.name} tile={tile} time={time} />
            ))}
          </ul>
        </div>
        <div className="ah-oko-captions">
          <Caption on="pastel" />
          <Caption kind="illustration" on="pastel" />
        </div>
      </motion.div>
    </>
  )
}

// The one moment: the painting from the app starts as a line drawing, and colour
// rises through it from the sea as you scroll.
function Dream() {
  const painting = useRef<HTMLDivElement>(null)
  const progress = useTargetProgress(painting, ['start 0.8', 'start 0.1'])
  const clipPath = useTransform(progress, (v) => `inset(${(1 - v) * 100}% 0 0 0)`)

  return (
    <div className="ah-oko-dream-sec">
      <div className="ah-oko-dream ah-bg-honey">
        <div className="ah-oko-art">
          <div ref={painting} className="ah-oko-painting">
            <Image
              src={PAINTING.line.src}
              alt=""
              width={PAINTING.line.width}
              height={PAINTING.line.height}
              sizes="(max-width: 767px) 88vw, 50vw"
            />
            <motion.div className="ah-oko-colour" style={{ clipPath }}>
              <Image
                src={PAINTING.colour.src}
                alt={PAINTING.alt}
                width={PAINTING.colour.width}
                height={PAINTING.colour.height}
                sizes="(max-width: 767px) 88vw, 50vw"
              />
            </motion.div>
          </div>
          <span className="ah-oko-chip">62 %</span>
          <Phone
            screen={SCREENS.droemmeDetail}
            className="ah-oko-dream-phone"
            sizes="(max-width: 767px) 34vw, 260px"
          />
        </div>
        <div className="ah-oko-dream-words">
          <h3 className="ah-oko-dream-line ah-hang">“Skat, hvornår skal vi på ferie igen?”</h3>
          <p className="ah-body">
            Spar op til det, som er vigtigst for jer. Sæt et mål, og se hver måned, hvor langt I er nået.
          </p>
          <Caption on="pastel" className="ah-oko-dream-caption" />
        </div>
      </div>
    </div>
  )
}

export default function Okonomi() {
  const stage = useRef<HTMLDivElement>(null)
  const scrolled = useTargetProgress(stage, ['start end', 'end end'])

  return (
    <section id="okonomi" className="ah-oko">
      <div ref={stage}>
        <Pin vh={200} mobileVh={120} className="ah-bg-forest">
          {() => <Stage scrolled={scrolled} />}
        </Pin>
      </div>
      <Dream />
    </section>
  )
}
