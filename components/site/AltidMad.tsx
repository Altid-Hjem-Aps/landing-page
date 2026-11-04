'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useMotionValueEvent } from 'framer-motion'
import Caption from '@/components/site/primitives/Caption'
import { useTargetProgress } from '@/components/site/primitives/Pin'
import Plate from '@/components/site/primitives/Plate'
import { PLATES, type PlateData } from '@/components/site/plates'
import './altid-mad.css'

function plate(slug: string): PlateData {
  const found = PLATES.find((p) => p.slug === slug)
  if (!found) throw new Error(`no plate ${slug}`)
  return found
}

const MAIN = plate('kylling-i-karry')
// On the ring around the big plate, degrees from straight up, as the reference's seven.
const RING = [
  { dish: plate('stegt-flaesk'), angle: -73.8 },
  { dish: plate('hjemmelavet-pizza'), angle: -49.1 },
  { dish: plate('caesarsalat'), angle: -25 },
  { dish: plate('butter-chicken'), angle: -1.1 },
  { dish: plate('klassiske-tacos'), angle: 25 },
  { dish: plate('burger'), angle: 49.1 },
  { dish: plate('lasagne'), angle: 73.8 },
]
const SMALL_TOP = plate('kyllingewok')
const SMALL_BOTTOM = plate('frikadeller-af-kalv-og-flaesk')

// The ring plates are decoration, so the main plate's alt carries the real dishes.
const ALT = `${MAIN.name}, omgivet af andre retter fra Altid Mad: ${RING.map((r) => r.dish.name).join(', ')}`

function Crop({ name, width, height, sizes }: { name: string; width: number; height: number; sizes: string }) {
  return <Image src={`/site/crops/${name}.webp`} alt="" width={width} height={height} sizes={sizes} />
}

export default function AltidMad() {
  const ref = useRef<HTMLElement>(null)
  // Their ring and plate are played, not scrubbed: the scroll only decides when.
  // Measured at the bottom of the screen, so on a tall screen the big plate is gone
  // before the number row comes into view. 1060 of 1666 at 1440 x 900, 600 of 1251 at 390.
  const passed = useTargetProgress(ref, ['start end', 'end end'])
  const setOn = (v: number) => {
    const at = window.innerWidth < 768 ? 600 / 1251 : 1060 / 1666
    ref.current?.toggleAttribute('data-on', v >= at)
  }
  useMotionValueEvent(passed, 'change', setOn)
  useEffect(() => setOn(passed.get()))

  return (
    <section ref={ref} id="altid-mad" className="gl">
      <span className="gl-bg" aria-hidden />

      <h2 className="gl-head">
        <span>Ikke mere</span> <span className="gl-accent">“hvad skal vi spise?”</span>
      </h2>
      <p className="gl-lead">Få en komplet madplan på få minutter, tilpasset dig og din familie.</p>

      <div className="gl-ring" aria-hidden>
        {RING.map(({ dish, angle }) => (
          <div key={dish.slug} className="gl-arm" style={{ '--gl-angle': `${angle}deg` } as React.CSSProperties}>
            <div className="gl-coin">
              <Plate plate={dish} sizes="(max-width: 767px) 106px, 210px" />
            </div>
          </div>
        ))}
      </div>

      <div className="gl-plate">
        <div className="gl-plate-turn">
          <Image src="/site/crops/kylling-i-karry-disc.webp" alt={ALT} width={1200} height={1200} sizes="(max-width: 767px) 90vw, 1008px" />
        </div>
      </div>

      <div className="gl-chips" aria-hidden>
        <div className="gl-chip gl-chip--row-a">
          <Crop name="mad-today-row" width={1000} height={214} sizes="(max-width: 767px) 60vw, 330px" />
        </div>
        <div className="gl-chip gl-chip--budget">
          <Crop name="mad-budget-bar" width={1075} height={440} sizes="(max-width: 767px) 44vw, 260px" />
        </div>
        <div className="gl-chip gl-chip--people">
          <span className="gl-people">
            <Crop name="mad-household" width={150} height={72} sizes="90px" />
          </span>
          <span className="gl-today">
            <Crop name="mad-today-pill" width={456} height={86} sizes="170px" />
          </span>
        </div>
        <div className="gl-chip gl-chip--small gl-chip--small-top">
          <Plate plate={SMALL_TOP} sizes="(max-width: 767px) 80px, 120px" />
        </div>
        <div className="gl-chip gl-chip--row-b">
          <Crop name="mad-ticked-row" width={1012} height={190} sizes="(max-width: 767px) 56vw, 300px" />
        </div>
        <div className="gl-chip gl-chip--basket">
          <svg viewBox="0 0 58 50">
            <path d="M15 21C17 10 23 4 29 4s12 6 14 17" fill="none" stroke="#fdfaf4" strokeWidth="4" strokeLinecap="round" />
            <path d="M5 19h48a3 3 0 0 1 3 3.7l-5.6 22.6a4 4 0 0 1-3.9 3H11.5a4 4 0 0 1-3.9-3L2 22.7A3 3 0 0 1 5 19z" fill="#fdfaf4" />
          </svg>
        </div>
        <div className="gl-chip gl-chip--trip">
          <Crop name="mad-trip-head" width={1100} height={400} sizes="(max-width: 767px) 44vw, 240px" />
        </div>
        <div className="gl-chip gl-chip--small gl-chip--small-bottom">
          <Plate plate={SMALL_BOTTOM} sizes="(max-width: 767px) 80px, 120px" />
        </div>
      </div>

      <Caption on="pastel" className="gl-caption" />

      <div className="gl-number">
        <p className="gl-spar">Spar</p>
        <div className="gl-row">
          <p className="gl-figure">11.207</p>
          <p className="gl-words">
            kr. om året på dagligvarer* Få en madplan for hele ugen, og find automatisk de{' '}
            <span className="gl-accent-dark">billigste varer</span> i jeres foretrukne butikker.
          </p>
        </div>
        <p className="gl-footnote">
          *Q3-rapporten fra Altid Mad viser, at den samme ugentlige indkøbskurv til en familie på fire koster 21,6 % mindre
          i den billigste kæde end i den midterste af 13 kæder.{' '}
          <a href="https://altidmad.dk/altid-mad-kvartalsrapport-q3.pdf">Læs rapporten</a>
        </p>
      </div>
    </section>
  )
}
