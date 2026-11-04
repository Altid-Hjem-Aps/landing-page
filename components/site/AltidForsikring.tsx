'use client'

import { backOut, motion, useTransform, type MotionStyle, type MotionValue } from 'framer-motion'
import Caption from '@/components/site/primitives/Caption'
import Phone from '@/components/site/primitives/Phone'
import Pin from '@/components/site/primitives/Pin'
import { SCREENS } from '@/components/site/screens'
import './forsikring.css'

// The four blocks lie loose on the table and snap into the phone's own grid, one
// by one. They land on the real tiles of the screen, then fade so the real screen
// is what stays. Where they lie comes from forsikring.css (per screen size); this
// only drives --t, 1 loose and 0 landed. Icons are the app's own (assets/svg).

const BLOCKS = [
  {
    name: 'Indbo',
    className: 'fs-block--indbo',
    land: [0.04, 0.46],
    icon: [
      'M5.5 11.4V8a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v3.4',
      'M3.5 11.5a1.5 1.5 0 0 1 3 0V13h11v-1.5a1.5 1.5 0 0 1 3 0V17a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-5.5Z',
      'M6 18v1.6M18 18v1.6',
    ],
  },
  {
    name: 'Hus',
    className: 'fs-block--hus',
    land: [0.0, 0.4],
    icon: [
      'M4 10.6 12 4.1l8 6.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8.4Z',
      'M10.2 20v-3.4a1.8 1.8 0 0 1 3.6 0V20',
    ],
  },
  {
    name: 'Bil',
    className: 'fs-block--bil',
    land: [0.1, 0.56],
    icon: [
      'M4.9 16.5H3.2A1.2 1.2 0 0 1 2 15.3V13a1.5 1.5 0 0 1 1.5-1.5H6l2.2-3.6A2.2 2.2 0 0 1 9.9 7h4.7a2.2 2.2 0 0 1 1.6.8l2.8 3.7h1.5A1.5 1.5 0 0 1 22 13v2.3a1.2 1.2 0 0 1-1.2 1.2h-1.7',
      'M10.1 16.5h3.8',
      'M6 11.5h13.2M12.2 11.5V7.4',
      'M9.7 16.5a2.2 2.2 0 1 1-4.4 0 2.2 2.2 0 0 1 4.4 0Z',
      'M18.7 16.5a2.2 2.2 0 1 1-4.4 0 2.2 2.2 0 0 1 4.4 0Z',
    ],
  },
  {
    name: 'Ulykke',
    className: 'fs-block--ulykke',
    land: [0.16, 0.62],
    icon: [
      'M12 20 4.9 13a4.93 4.93 0 0 1 7.1-6.4 4.93 4.93 0 0 1 7.1 6.4L12 20Z',
    ],
  },
] as const

function Block({ block, progress }: { block: (typeof BLOCKS)[number]; progress: MotionValue<number> }) {
  const t = useTransform(progress, [...block.land], [1, 0], { ease: backOut })
  const opacity = useTransform(progress, [0.74, 0.86], [1, 0])
  return (
    <motion.div
      className={`fs-block ah-m ${block.className}`}
      style={{ '--t': t, opacity } as MotionStyle}
    >
      <span className="fs-block-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {block.icon.map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
      </span>
      {block.name}
    </motion.div>
  )
}

function Scene({ progress }: { progress: MotionValue<number> }) {
  const secondOpacity = useTransform(progress, [0.7, 0.86], [0, 1])
  const secondX = useTransform(progress, [0.7, 0.96], ['9vw', '0vw'])
  const secondY = useTransform(progress, [0.7, 0.96], ['7svh', '0svh'])
  return (
    <div className="fs-stage">
      <div className="fs-text">
        <h2 className="ah-h2">Alle jeres forsikringer samlet ét sted</h2>
        <p className="ah-body mt-5">Se, hvad I betaler, og få snart nye tilbud. Helt gratis og uforpligtende.</p>
      </div>
      <div className="fs-phones">
        <div className="fs-one">
          {/* The phone next to them names all four; these only draw them. */}
          <div className="fs-blocks" aria-hidden>
            {BLOCKS.map((block) => (
              <Block key={block.name} block={block} progress={progress} />
            ))}
          </div>
          <Phone screen={SCREENS.forsikringChosen} className="fs-phone" sizes="(max-width: 767px) 46vw, 360px" />
        </div>
        <motion.div className="fs-two ah-m" style={{ opacity: secondOpacity, x: secondX, y: secondY }}>
          <Phone screen={SCREENS.forsikringWaiting} className="fs-phone" sizes="(max-width: 767px) 46vw, 360px" />
        </motion.div>
      </div>
      <Caption on="pastel" className="fs-caption" />
    </div>
  )
}

export default function AltidForsikring() {
  return (
    <section id="altid-forsikring" className="ah-bg-rose">
      {/* 200 is the pin's whole height: one screen standing, one screen of scroll. */}
      <Pin vh={200} mobileVh={null} className="ah-bg-rose">
        {(progress) => <Scene progress={progress} />}
      </Pin>
    </section>
  )
}
