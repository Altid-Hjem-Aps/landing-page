'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import Caption from '@/components/site/primitives/Caption'
import Phone from '@/components/site/primitives/Phone'
import Pin, { useTargetProgress } from '@/components/site/primitives/Pin'
import Plate from '@/components/site/primitives/Plate'
import { PLATES, type PlateData } from '@/components/site/plates'
import { SCREENS } from '@/components/site/screens'
import './altid-mad.css'

function plate(slug: string): PlateData {
  const found = PLATES.find((p) => p.slug === slug)
  if (!found) throw new Error(`no plate ${slug}`)
  return found
}

const MAIN = plate('kylling-i-karry')
const ORBIT = [
  'hjemmelavet-pizza',
  'caesarsalat',
  'stegt-flaesk',
  'amerikanske-pandekager',
  'klassiske-tacos',
  'gulerodssuppe',
  'burger',
  'kyllingewok',
  'butter-chicken',
  'lasagne',
  'frikadeller-af-kalv-og-flaesk',
  'svamperisotto',
].map(plate)

// The orbit plates are decoration, so the main plate's alt carries the real dishes.
const MAIN_WITH_DISHES: PlateData = {
  ...MAIN,
  name: `${MAIN.name}, omgivet af andre retter fra Altid Mad: ${ORBIT.map((p) => p.name).join(', ')}`,
}

const TURN = Math.PI * 1.7
const PULL_FROM = 0.78
const PULL_TO = 0.92
const round = (n: number) => n.toFixed(3)

/** Near plates are bigger; the sine of the angle is the depth on the tilted ellipse. */
const depthOf = (angle: number) => 0.62 + 0.48 * ((Math.sin(angle) + 1) / 2)

// One plate on the orbit. Its resting place is left and top, so it stands on the
// ellipse without JS, with reduced motion and at 390 px, where .ah-m cancels the
// transforms. Those transforms only add what scrolling changes. Radii come from
// CSS (--am-rx, --am-ry), so they follow the screen without a measure in JS.
function OrbitPlate({ data, index, progress }: { data: PlateData; index: number; progress: MotionValue<number> }) {
  const home = (index / ORBIT.length) * Math.PI * 2 + 0.26
  // The orbit stops as the plates pull aside, so none changes side on its way out.
  const angleAt = (p: number) => home + Math.min(p, PULL_FROM) * TURN
  const pullAt = (p: number) => Math.max(0, Math.min(1, (p - PULL_FROM) / (PULL_TO - PULL_FROM)))

  const x = useTransform(progress, (p) => {
    const cos = Math.cos(angleAt(p))
    return `calc(var(--am-rx) * ${round(cos + Math.sign(cos) * pullAt(p) * 1.9 - Math.cos(home))})`
  })
  const y = useTransform(progress, (p) => `calc(var(--am-ry) * ${round(Math.sin(angleAt(p)) - Math.sin(home))})`)
  const scale = useTransform(progress, (p) => depthOf(angleAt(p)) / depthOf(home))
  const zIndex = useTransform(progress, (p) => (Math.sin(angleAt(p)) > 0 ? 3 : 1))

  return (
    <motion.div
      className="am-plate ah-m"
      style={{
        left: `calc(50% + var(--am-rx) * ${round(Math.cos(home))})`,
        top: `calc(var(--am-cy) + var(--am-ry) * ${round(Math.sin(home))})`,
        x,
        y,
        scale,
        zIndex,
      }}
    >
      <div className="am-plate-depth" style={{ transform: `scale(${round(depthOf(home))})` }}>
        <div className="am-plate-bob" style={{ animationDelay: `${-index * 1.7}s` }}>
          <Plate plate={data} sizes="(max-width: 767px) 28vw, 240px" />
        </div>
      </div>
    </motion.div>
  )
}

function Scene({ progress }: { progress: MotionValue<number> }) {
  // Rises from below, then moves up beside the heading to leave the stage to the number.
  const planetY = useTransform(progress, [0.2, 0.68, 0.8, 0.97], [34, 0, 0, -53])
  const planetX = useTransform(progress, [0.8, 0.97], [0, 31])
  const planetScale = useTransform(progress, [0.8, 0.97], [1, 0.46])
  const planetTurn = useTransform(progress, [0, 1], [-24, 24])
  const y = useTransform(planetY, (v) => `${v}cqh`)
  const x = useTransform(planetX, (v) => `${v}cqw`)

  const numberOpacity = useTransform(progress, [0.84, 0.93], [0, 1])
  const numberY = useTransform(progress, [0.84, 0.97], [40, 0])
  const numberScale = useTransform(progress, [0.84, 0.97], [0.94, 1])
  const wordsOpacity = useTransform(progress, [0.89, 0.97], [0, 1])

  return (
    <div className="am-stage">
      <header className="am-head">
        <div className="ah-wrap">
          <h2 className="ah-h2">
            <span className="block">Ikke mere</span>{' '}
            <span className="block ah-hang">“hvad skal vi spise?”</span>
          </h2>
          <p className="am-lead">Få en komplet madplan på få minutter, tilpasset dig og din familie.</p>
        </div>
      </header>

      <div className="am-orbit ah-frame">
        {ORBIT.map((p, i) => (
          <div key={p.slug} aria-hidden>
            <OrbitPlate data={p} index={i} progress={progress} />
          </div>
        ))}
        <motion.div className="am-planet ah-m" style={{ x, y, scale: planetScale }}>
          <motion.div className="am-planet-plate ah-m" style={{ rotate: planetTurn }}>
            <Plate plate={MAIN_WITH_DISHES} large sizes="(max-width: 767px) 80vw, 900px" />
          </motion.div>
        </motion.div>
      </div>

      <div className="am-number ah-frame">
        <div className="ah-wrap am-number-wrap">
          <motion.p
            className="ah-num am-figure ah-m"
            style={{ opacity: numberOpacity, y: numberY, scale: numberScale }}
          >
            11.207 <span className="ah-unit">kr.</span>
          </motion.p>
          <motion.div className="ah-m" style={{ opacity: wordsOpacity }}>
            <p className="ah-h3 am-spar">Spar 11.207 kr. om året på dagligvarer*</p>
            <p className="am-footnote">
              *Altid Mad Q3-rapporten viser, at den samme ugentlige indkøbskurv til en familie på fire koster 21,6 %
              mindre i den billigste kæde end i den midterste af 13 kæder.{' '}
              <a href="https://altidmad.dk/altid-mad-kvartalsrapport-q3.pdf">Læs rapporten</a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// A real crop of a row in mad.trip.in_progress (780 x 1691), lifted off the screen
// to sit over the row it was cut from.
function ShoppingRow({ top, className }: { top: number; className: string }) {
  const { src, width, height } = SCREENS.madTripInProgress
  const ROW = { left: 52, width: 676, height: 132 }
  return (
    <div className={`am-row ${className}`} aria-hidden>
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        sizes="(max-width: 767px) 90vw, 420px"
        style={{
          width: `${(width / ROW.width) * 100}%`,
          left: `${(-ROW.left / ROW.width) * 100}%`,
          top: `${(-top / ROW.height) * 100}%`,
        }}
      />
    </div>
  )
}

export default function AltidMad() {
  const ref = useRef<HTMLDivElement>(null)
  // From the moment the stage enters the screen, not only while it is pinned, so
  // the plates are already turning as it comes up.
  const progress = useTargetProgress(ref, ['start end', 'end end'])

  return (
    <section id="altid-mad" className="am-sec">
      <div ref={ref}>
        <Pin vh={150} mobileVh={null}>
          {() => <Scene progress={progress} />}
        </Pin>
      </div>

      <div className="ah-wrap am-lower">
        <div className="am-sand ah-bg-sand">
          <div className="am-sand-copy">
            <h3 className="ah-hang am-sand-title">“Hvor handler vi billigst ind?”</h3>
            <p className="am-sand-body">Appen finder automatisk de billigste varer på tværs af de butikker, I handler i.</p>
            <Caption kind="screens" on="pastel" className="am-caption" />
          </div>
          <div className="am-sand-phone">
            <Phone screen={SCREENS.madTripInProgress} crop={0.81} sizes="(max-width: 767px) 72vw, 340px" />
            <ShoppingRow top={1040} className="am-row--ticked" />
            <ShoppingRow top={1176} className="am-row--open" />
          </div>
        </div>

        <div className="am-home">
          <Caption kind="screens" on="pastel" />
          <div className="am-home-phone">
            <Phone screen={SCREENS.madHome} crop={0.62} sizes="(max-width: 767px) 66vw, 320px" />
            {/* The same dish as today's plate on the screen, out in the room. */}
            <div className="am-home-plate" aria-hidden>
              <Plate plate={MAIN} sizes="(max-width: 767px) 38vw, 220px" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
