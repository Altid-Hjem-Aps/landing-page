'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useTransform, type MotionStyle, type MotionValue } from 'framer-motion'
import Phone from '@/components/site/primitives/Phone'
import Pin from '@/components/site/primitives/Pin'
import StorePills from '@/components/site/primitives/StorePills'
import IconBeam from '@/components/site/primitives/IconBeam'
import WordFade from '@/components/site/primitives/WordFade'
import Caption from '@/components/site/primitives/Caption'
import { HJEM_HERO_CROP, SCREENS, type Screen } from '@/components/site/screens'
import './hero.css'

// Sections 1, 1b and 1c are one pinned scene. All positions live in hero.css, so
// the first paint is right without JS and the static flow is plain CSS. The one
// thing CSS cannot give is the ratio between two lengths, so the phone's landing
// is measured: it is laid out at its giant size and scaled down onto .ah-hero-slot.

const STEPS = [
  { word: 'Forbind.', caption: 'Forbind banken sikkert med MitID.', screen: SCREENS.okonomiTop, range: [0.2, 0.23, 0.355, 0.385] },
  { word: 'Se.', caption: 'Se regningerne, før de bliver trukket.', screen: SCREENS.regningerTop, range: [0.355, 0.385, 0.5, 0.53] },
  { word: 'Slap af.', caption: 'Så ved I, hvad der er tilbage.', screen: SCREENS.hjemTop, range: [0.5, 0.53, 0.98, 1] },
] as const

const PHONE_SIZES = '(max-width: 767px) 80vw, 340px'
const SCENE_FADE = [0.74, 0.78]

const ICONS = [
  { icon: 'strom', direction: 14, delay: -1 },
  { icon: 'madplan', direction: 346, delay: -5 },
  { icon: 'okonomi', direction: 168, delay: -3 },
  { icon: 'forsikring', direction: 194, delay: -7 },
] as const

function smooth(t: number) {
  const c = Math.min(1, Math.max(0, t))
  return c * c * (3 - 2 * c)
}

function offsetTopIn(el: HTMLElement, stage: HTMLElement) {
  let top = 0
  let node: HTMLElement | null = el
  while (node && node !== stage) {
    top += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return top
}

function Step({ step, progress }: { step: (typeof STEPS)[number]; progress: MotionValue<number> }) {
  const active = useTransform(progress, [...step.range], [0, 1, 1, 0])
  return (
    <li className="ah-hero-step">
      <motion.p className="ah-hero-word ah-m" style={{ '--ah-active': active } as MotionStyle}>
        {step.word}
      </motion.p>
      <motion.p className="ah-hero-step-caption ah-m" style={{ opacity: active }}>
        {step.caption}
      </motion.p>
      <Phone screen={step.screen} sizes={PHONE_SIZES} className="ah-hero-step-phone" />
    </li>
  )
}

// A screen fades in over the one before it, with a tiny slide.
function ScreenLayer({ screen, at, progress }: { screen: Screen; at: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [at, at + 0.03], [0, 1])
  const y = useTransform(progress, [at, at + 0.03], ['1.6%', '0%'])
  return (
    <motion.div className="ah-hero-layer ah-m" style={{ opacity, y }}>
      <Image src={screen.src} alt={screen.alt} fill sizes={PHONE_SIZES} />
    </motion.div>
  )
}

function Scene({ progress }: { progress: MotionValue<number> }) {
  const stage = useRef<HTMLDivElement>(null)
  const phone = useRef<HTMLDivElement>(null)
  const slot = useRef<HTMLDivElement>(null)
  const landingScale = useMotionValue(1)
  const landingY = useMotionValue(0)

  useEffect(() => {
    const [s, p, l] = [stage.current!, phone.current!, slot.current!]
    const measure = () => {
      landingScale.set(l.offsetWidth / p.offsetWidth)
      landingY.set(offsetTopIn(l, s) - offsetTopIn(p, s))
    }
    measure()
    window.addEventListener('resize', measure)
    // The intro's height moves the phone on a small screen, once the fonts are in.
    window.addEventListener('load', measure)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('load', measure)
    }
  }, [landingScale, landingY])

  const pull = useTransform(progress, (p) => smooth((p - 0.07) / 0.15))
  const phoneScale = useTransform([pull, landingScale], ([t, s]: number[]) => 1 + (s - 1) * t)
  const phoneY = useTransform([pull, landingY], ([t, y]: number[]) => y * t)
  const phoneOpacity = useTransform(progress, [0.58, 0.63, SCENE_FADE[0], SCENE_FADE[1]], [1, 0.5, 0.5, 0])

  const introOpacity = useTransform(progress, [0.07, 0.13], [1, 0])
  const introY = useTransform(progress, [0.07, 0.15], [0, -36])
  const introVisibility = useTransform(introOpacity, (o) => (o > 0 ? 'visible' : 'hidden'))
  const iconsOpacity = useTransform(progress, [0.08, 0.16], [1, 0])
  const iconsLeft = useTransform(progress, [0.07, 0.18], [0, -90])
  const iconsRight = useTransform(progress, [0.07, 0.18], [0, 90])
  const lightOpacity = useTransform(progress, [0.1, 0.22], [1, 0])
  const haloOpacity = useTransform(progress, [0.14, 0.24, SCENE_FADE[0], SCENE_FADE[1]], [0, 1, 1, 0])
  const stepsOpacity = useTransform(progress, [0.16, 0.21, SCENE_FADE[0], SCENE_FADE[1]], [0, 1, 1, 0])

  const firstScreen = useTransform(progress, [0.17, 0.21], [1, 0])
  const cardOpacity = useTransform(progress, [0.56, 0.585, SCENE_FADE[0], SCENE_FADE[1]], [0, 1, 1, 0])
  const cardScale = useTransform(progress, [0.56, 0.615, 0.65], [0.62, 1.035, 1])
  const statementOpacity = useTransform(progress, [0.775, 0.8], [0, 1])

  return (
    <div ref={stage} className="ah-hero-stage">
      <motion.div className="ah-hero-halo ah-m" style={{ opacity: haloOpacity }} aria-hidden />

      <motion.div
        className="ah-hero-intro ah-m"
        style={{ opacity: introOpacity, y: introY, '--ah-intro-visibility': introVisibility } as MotionStyle}
      >
        <div className="ah-hero-settle">
          <h1 className="ah-h1 ah-hero-title">Hele hjemmet i én app</h1>
          <p className="ah-hero-sub">
            Få overblik over jeres mad, strøm, forsikring og økonomi.{' '}
            <span className="ah-hero-sub-tail">Hent Altid Hjem gratis i dag.</span>
          </p>
          <StorePills position="hero" variant="dark" className="ah-hero-pills" />
          <p className="ah-hero-trust">Kan kun læse. Aldrig flytte penge.</p>
        </div>
      </motion.div>

      <div className="ah-hero-figure">
        {/* Same box and same motion as the phone, but under the circles. */}
        <motion.div className="ah-hero-light-anchor ah-m" style={{ scale: phoneScale, y: phoneY }} aria-hidden>
          <motion.div className="ah-hero-light ah-m" style={{ opacity: lightOpacity }}>
            <span className="ah-hero-light-open" />
          </motion.div>
        </motion.div>

        {ICONS.map(({ icon, direction, delay }, i) => (
          <motion.div
            key={icon}
            className={`ah-hero-icon ah-hero-icon--${icon} ah-m`}
            style={{ opacity: iconsOpacity, x: i < 2 ? iconsLeft : iconsRight }}
          >
            <IconBeam icon={icon} direction={direction} delay={delay} />
          </motion.div>
        ))}

        <motion.div ref={phone} className="ah-hero-phone ah-m" style={{ scale: phoneScale, y: phoneY, opacity: phoneOpacity }}>
          <div className="ah-hero-rise">
            <Phone empty>
              <ScreenLayer screen={SCREENS.okonomiTop} at={0.15} progress={progress} />
              <ScreenLayer screen={SCREENS.regningerTop} at={0.355} progress={progress} />
              <ScreenLayer screen={SCREENS.hjemTop} at={0.5} progress={progress} />
              {/* The phone's first screen under 768 px and in the static flow. */}
              <motion.div className="ah-hero-layer ah-hero-layer--first ah-m" style={{ opacity: firstScreen }}>
                <Image src={SCREENS.hjemTop.src} alt={SCREENS.hjemTop.alt} fill sizes={PHONE_SIZES} preload />
              </motion.div>
            </Phone>
          </div>
        </motion.div>
      </div>

      <div ref={slot} className="ah-hero-slot">
        <motion.ol className="ah-hero-steps ah-m" style={{ opacity: stepsOpacity }}>
          {STEPS.map((step) => (
            <Step key={step.word} step={step} progress={progress} />
          ))}
        </motion.ol>
        <motion.div className="ah-hero-card ah-m" style={{ opacity: cardOpacity, scale: cardScale }}>
          <Image
            src={HJEM_HERO_CROP.src}
            alt={HJEM_HERO_CROP.alt}
            width={HJEM_HERO_CROP.width}
            height={HJEM_HERO_CROP.height}
            sizes="(max-width: 767px) 92vw, 560px"
          />
        </motion.div>
      </div>

      <motion.div className="ah-hero-screens-caption ah-m" style={{ opacity: stepsOpacity }}>
        <Caption on="forest" />
      </motion.div>

      <motion.div className="ah-hero-statement ah-m" style={{ opacity: statementOpacity }}>
        <WordFade
          as="h2"
          text="Ét overblik. Ét login. Hele hjemmet."
          progress={progress}
          range={[0.79, 0.96]}
          accentFrom={4}
          className="ah-h2 ah-hero-statement-text"
        />
      </motion.div>
    </div>
  )
}

export default function Hero() {
  return (
    <section id="top" className="ah-hero">
      <Pin vh={300} mobileVh={220} className="ah-bg-forest">
        {(progress) => <Scene progress={progress} />}
      </Pin>
    </section>
  )
}
