'use client'

import { useRef } from 'react'
import { motion, useTransform } from 'framer-motion'
import { countClick } from '@/components/StoreBadges'
import IconBeam from '@/components/site/primitives/IconBeam'
import Phone from '@/components/site/primitives/Phone'
import { useTargetProgress } from '@/components/site/primitives/Pin'
import { QR_CODES, SCREENS } from '@/components/site/screens'
import { storeLink, type Store } from '@/lib/store-links'

const QR: { store: Store; name: string; code: { src: string; alt: string } }[] = [
  { store: 'appstore', name: 'App Store', code: QR_CODES.appstore },
  { store: 'play', name: 'Google Play', code: QR_CODES.play },
]

// Hidden on phones by velkommen.css. A click counts as 'qr'; a scan cannot be counted.
export function QrCards() {
  return (
    <div className="vk-qr">
      {QR.map(({ store, name, code }) => (
        <a key={store} href={storeLink(store)} onClick={() => countClick(store, 'qr')} className="vk-qr-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={code.src} alt={code.alt} width={112} height={112} />
          <span aria-hidden>{name}</span>
        </a>
      ))}
    </div>
  )
}

// The page ends on the object it started with: three phones rising from behind
// the footer, as in the M0 mail hero. Tilts are CSS, the parallax only ever
// offsets a phone from the resting place it has without JS.
export function VelkommenFan() {
  const ref = useRef<HTMLDivElement>(null)
  const progress = useTargetProgress(ref, ['start end', 'end end'])
  const centre = useTransform(progress, [0, 1], [130, 0])
  const sides = useTransform(progress, [0, 1], [70, 0])
  return (
    <div ref={ref} className="vk-fan">
      <motion.div className="vk-phone vk-phone--left ah-m" style={{ y: sides }}>
        <Phone screen={SCREENS.hjemTop} sizes="(max-width: 767px) 54vw, 360px" />
      </motion.div>
      <motion.div className="vk-phone vk-phone--right ah-m" style={{ y: sides }}>
        <Phone screen={SCREENS.madHome} sizes="(max-width: 767px) 54vw, 360px" />
      </motion.div>
      <motion.div className="vk-phone vk-phone--centre ah-m" style={{ y: centre }}>
        <Phone screen={SCREENS.okonomiTop} sizes="(max-width: 767px) 62vw, 400px" />
      </motion.div>
      <IconBeam icon="strom" direction={20} length={2.4} delay={-2} className="vk-icon vk-icon--strom" />
      <IconBeam icon="madplan" direction={-20} length={2.2} delay={-5} className="vk-icon vk-icon--madplan" />
      <IconBeam icon="okonomi" direction={165} length={2.4} delay={-7} className="vk-icon vk-icon--okonomi" />
      <IconBeam icon="forsikring" direction={200} length={2.2} delay={-1} className="vk-icon vk-icon--forsikring" />
    </div>
  )
}
