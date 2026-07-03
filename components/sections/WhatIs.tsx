'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from 'framer-motion'
import { ChaosCard, Envelope, CHAOS_W, CHAOS_H, ENVELOPE_W, ENVELOPE_H } from './why/ChaosCard'
import { AppIcon } from './why/AppIcons'
import { HouseholdScreen } from './why/HouseholdCard'
import PhoneShell, { TabBar, HomeIndicator } from '@/components/iphone/PhoneShell'
import {
  ITEMS,
  ENVELOPES,
  ICON_POS,
  DURATION,
  collectLocal,
  itemEmit,
  itemFly,
  sourceGone,
  iconAppear,
  iconAppearOpacity,
  iconPress,
  openReveal,
  introFade,
  flapOpen,
  LOOP_PAUSE,
  LOOP_FADE,
  type Bill,
} from './why/cards'
import { H2, EYEBROW, BODY, FINE_PRINT } from '@/lib/typography'

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

// The full storyboard lives in why/cards.ts (sources opened and removed one by
// one → the pile is collected into the Altid Hjem app icon → the icon is
// pressed and the interface opens → the assistant optimises the household);
// this component runs the clock and stages the scenery.

// Sources sit under the bills; the app icons stay ON TOP of the flying bills
// (Thor: e-Boks must never be covered). New bills land on TOP of the pile, so
// each bill's z is simply its emission order.
const Z_ENVELOPE = 5
const Z_BILL_BASE = 30
const Z_ICON = 60

/** Where bill i starts its life (offset from the pile centre). */
const srcPos = (item: Bill) =>
  item.source === 'letter' ? ENVELOPES[item.envIndex ?? 0] : ICON_POS[item.source]

export default function WhatIs() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)
  const mockupRef = useRef<HTMLDivElement>(null)
  // Live (not once:true): the effect below tears the rAF clock down when the
  // section scrolls out of view — otherwise the 38s loop runs for the rest of
  // the session — and restarts the story when it comes back.
  const inView = useInView(sectionRef, { amount: 0.25 })

  // Everything happens around one point: the centre of the stage. The sources
  // scene, the imploding pile, the app icon and the opened interface all share
  // this anchor — on EVERY breakpoint (mobile is the same stacked composition,
  // just compressed). kx/ky squeeze the scatter offsets into the available
  // width, sk shrinks the paper elements themselves.
  const [fly, setFly] = useState<{ px: number; py: number; kx: number; ky: number; sk: number } | null>(null)
  useEffect(() => {
    const measure = () => {
      const m = mockupRef.current
      if (!m) return
      const mr = m.getBoundingClientRect()
      const kx = Math.min(1, Math.max(0.3, 0.3 + ((mr.width - 390) / (1152 - 390)) * 0.7))
      setFly({
        px: mr.width / 2,
        py: mr.height / 2,
        kx,
        ky: Math.min(1, kx + 0.25),
        sk: Math.min(1, 0.55 + kx * 0.45),
      })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // entranceProgress starts at 1 so the mockup renders in its optimised
  // end-state on first paint; on scroll-in we replay 0→1 for the full story,
  // hold the finished receipt for LOOP_PAUSE, fade the stage out, and loop —
  // the sources scene fades back in (introFade) for a seamless restart.
  // Kicked off from an effect — setting the value during render would trigger
  // setState in progress subscribers (HouseholdScreen's view switch) mid-render.
  const entranceProgress = useMotionValue(1)
  const stageOpacity = useMotionValue(1)
  useEffect(() => {
    if (!inView || prefersReducedMotion) return
    let clockRaf = 0
    let fadeRaf = 0
    let timer: ReturnType<typeof setTimeout> | null = null
    const fade = (from: number, to: number, then?: () => void) => {
      const t0 = performance.now()
      const step = (now: number) => {
        const k = Math.min((now - t0) / LOOP_FADE, 1)
        stageOpacity.set(from + (to - from) * k)
        if (k < 1) fadeRaf = requestAnimationFrame(step)
        else then?.()
      }
      fadeRaf = requestAnimationFrame(step)
    }
    const play = () => {
      entranceProgress.set(0)
      const startT = performance.now()
      const tick = (now: number) => {
        const t = Math.min((now - startT) / DURATION, 1)
        entranceProgress.set(t)
        if (t < 1) clockRaf = requestAnimationFrame(tick)
        else
          timer = setTimeout(() => {
            fade(1, 0, () => {
              fade(0, 1)
              play()
            })
          }, LOOP_PAUSE)
      }
      clockRaf = requestAnimationFrame(tick)
    }
    // Reset opacity in case the previous run was torn down mid-fade.
    stageOpacity.set(1)
    play()
    return () => {
      cancelAnimationFrame(clockRaf)
      cancelAnimationFrame(fadeRaf)
      if (timer) clearTimeout(timer)
    }
  }, [inView, prefersReducedMotion, entranceProgress, stageOpacity])

  return (
    <section
      ref={sectionRef}
      className="relative pt-20 sm:pt-28 pb-8 sm:pb-10 px-3 sm:px-10 lg:px-12"
      style={{ background: '#ffffff' }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Heading + body */}
        <div className="text-center mx-auto mb-8 sm:mb-10" style={{ maxWidth: 1040 }}>
          <p className={`${EYEBROW} mb-4`} style={{ color: '#6f6a61' }}>
            Problematikken, vi alle kender
          </p>
          <h2 className={`${H2} mb-6`} style={{ color: '#163223' }}>
            Ét hjem. Alt for mange regninger.
          </h2>
          {/* Body width = the heading's rendered text width (15.26 × the H2
              font-size, which is one line at every breakpoint) so the block
              reads as one column. Mirrors the H2 clamp in lib/typography.ts. */}
          <p className={`mx-auto max-lg:text-left ${BODY}`} style={{ color: '#6f6a61', maxWidth: 'calc(15.26 * clamp(28px, 22.4px + 1.44vw, 50px))' }}>
            Strøm hos én leverandør, mobil hos en anden, forsikring hos en tredje. Forskellige vilkår, forskellige regninger og information spredt på mail, papir og i e-Boks. Uden ét samlet overblik. Og med skjulte gebyrer, der stille og roligt vokser sig større. <span style={{ color: '#163223' }}>Det ændrer vi nu med Altid Hjem. Altid Hjem samler hjemmets faste udgifter ét sted og optimerer dem løbende, så du kun betaler for det, du faktisk har behov for.</span>
          </p>
        </div>

        {/* ALL BREAKPOINTS: one CENTERED stage — the sources scene plays
            around the centre, the pile implodes into that centre, the app
            icon appears in the same spot and the phone opens over it. On
            mobile the same composition is stacked/compressed, not split.
            The negative margins eat part of the stage's built-in headroom
            (content is centred in the box) so the scene sits near the text
            above and the section below. */}
        <div ref={mockupRef} className="relative mx-auto -mt-4 sm:-mt-10 -mb-4 sm:-mb-10" style={{ height: 'clamp(620px,calc(595px + 6.5vw),720px)' }}>
          {/* The loop fades this whole stage out at the end and back in at the top */}
          <motion.div className="absolute inset-0" style={{ opacity: stageOpacity }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <CardStage progress={entranceProgress} />
            </div>

            {/* Scenery + flying bills overlay (all positioned from the stage centre) */}
            {fly && (
              <>
                {ENVELOPES.map((env, i) => (
                  <SceneEnvelope key={i} index={i} x={fly.px + env.x * fly.kx} y={fly.py + env.y * fly.ky} rotate={env.rotate} k={fly.sk} progress={entranceProgress} />
                ))}
                <SceneIcon kind="mail" x={fly.px + ICON_POS.mail.x * fly.kx} y={fly.py + ICON_POS.mail.y * fly.ky} delay={0.4} k={fly.sk} progress={entranceProgress} />
                <SceneIcon kind="eboks" x={fly.px + ICON_POS.eboks.x * fly.kx} y={fly.py + ICON_POS.eboks.y * fly.ky} delay={1.6} k={fly.sk} progress={entranceProgress} />
                {ITEMS.map((item, i) => (
                  <FlyingBill key={`${item.name}-${i}`} item={item} index={i} entranceProgress={entranceProgress} fly={fly} />
                ))}
              </>
            )}
          </motion.div>
        </div>

        {/* The mt offsets the stage's negative bottom margin above. */}
        <p className={`${FINE_PRINT} text-center mx-auto mt-8 sm:mt-14 max-w-[560px]`} style={{ color: '#8a857c' }}>
          Eksempelberegning. Den viste besparelse er vejledende og baseret på antagelser. Faktisk besparelse afhænger af husstandens forbrug, aftaler og gældende priser.
        </p>

      </div>
    </section>
  )
}

// === The Altid Hjem app icon: appears at the centre while the pile fades
//     into it, gets pressed — and the PHONE opens from it. The "Min husstand"
//     screen plays inside and the story ends on its yearly-saving receipt. ===
function CardStage({ progress }: { progress: MotionValue<number> }) {
  const shellScale = useTransform(progress, (p) => 0.3 + 0.7 * openReveal(p))
  const shellOpacity = useTransform(progress, (p) => openReveal(p))
  // The icon is there from before the bills arrive, takes the press, then
  // hands over to the opening phone.
  const iconOpacity = useTransform(progress, (p) => Math.min(iconAppearOpacity(p), 1 - openReveal(p)))
  const iconScale = useTransform(progress, (p) =>
    iconAppear(p) * (1 - 0.12 * iconPress(p)) * (1 - 0.25 * openReveal(p)),
  )

  // Grid stack: phone and icon share the same centre.
  return (
    <div style={{ display: 'grid', placeItems: 'center' }}>
      <motion.div style={{ gridArea: '1 / 1', scale: shellScale, opacity: shellOpacity }}>
        <PhoneShell hovered sheen={false}>
          <div className="flex flex-col" style={{ position: 'relative', flex: 1, minHeight: 0 }}>
            <HouseholdScreen progress={progress} />
          </div>
          <TabBar active="hjem" />
          <HomeIndicator />
        </PhoneShell>
      </motion.div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src="/app-badge.png"
        alt=""
        className="pointer-events-none"
        style={{ gridArea: '1 / 1', width: 110, height: 110, opacity: iconOpacity, scale: iconScale, filter: 'drop-shadow(0 16px 32px rgba(15,55,30,0.25))' }}
      />
    </div>
  )
}

// === A closed physical letter — wiggles while its bill slides out, then the
//     letters are removed as the first emptied source ===
function SceneEnvelope({
  index,
  x,
  y,
  rotate,
  k,
  progress,
}: {
  index: number
  x: number
  y: number
  rotate: number
  k: number
  progress: MotionValue<number>
}) {
  // The envelope reacts to its own bill's exit flight — the flap swings open
  // just before the bill slides out.
  const billIndex = ITEMS.findIndex((it) => it.source === 'letter' && it.envIndex === index)
  const flap = useTransform(progress, (p) => flapOpen(p, billIndex))
  const scale = useTransform(progress, (p) => {
    const pulse = 1 + 0.07 * Math.sin(Math.PI * Math.min(1, itemEmit(p, billIndex) * 1.6))
    return k * pulse * (1 - 0.2 * sourceGone(p, 'letter'))
  })
  const opacity = useTransform(progress, (p) => {
    // Fades in with the scene, dims once its own bill is out, then the whole
    // source is removed.
    const emptied = clamp01((itemEmit(p, billIndex) - 0.9) / 0.1)
    return introFade(p) * (1 - 0.45 * emptied) * (1 - sourceGone(p, 'letter'))
  })

  return (
    <motion.div
      className="absolute top-0 left-0 pointer-events-none"
      style={{ x, y, scale, opacity, transformOrigin: '0px 0px', zIndex: Z_ENVELOPE }}
    >
      <div
        style={{
          marginLeft: -ENVELOPE_W / 2,
          marginTop: -ENVELOPE_H / 2,
          transform: `rotate(${rotate}deg)`,
          animation: `chaos-bob 4.4s ease-in-out ${(index * 0.9) % 3}s infinite`,
        }}
      >
        <Envelope flap={flap} />
      </div>
    </motion.div>
  )
}

// === The two inbox icons — always ON TOP of the bills; each is removed once
//     its inbox has been emptied ===
function SceneIcon({
  kind,
  x,
  y,
  delay,
  k,
  progress,
}: {
  kind: 'mail' | 'eboks'
  x: number
  y: number
  delay: number
  k: number
  progress: MotionValue<number>
}) {
  const opacity = useTransform(progress, (p) => introFade(p) * (1 - sourceGone(p, kind)))
  // The icons shrink less than the paper on small stages — they stay landmarks.
  const scale = useTransform(progress, (p) => Math.min(1, k + 0.15) * (1 - 0.2 * sourceGone(p, kind)))

  return (
    <motion.div
      className="absolute top-0 left-0 pointer-events-none"
      style={{ x, y, opacity, scale, transformOrigin: '0px 0px', zIndex: kind === 'eboks' ? Z_ICON + 1 : Z_ICON }}
    >
      <div style={{ marginLeft: -43, marginTop: -43, animation: `chaos-bob 4.2s ease-in-out ${delay}s infinite` }}>
        <AppIcon kind={kind} progress={progress} />
      </div>
    </motion.div>
  )
}

// === One bill: slides out of its source onto the top of the pile, hovers,
//     then flies into the app icon ===
function FlyingBill({
  item,
  index,
  entranceProgress,
  fly,
}: {
  item: Bill
  index: number
  entranceProgress: MotionValue<number>
  fly: { px: number; py: number; kx: number; ky: number; sk: number }
}) {
  const from = srcPos(item)
  const sx = fly.px + from.x * fly.kx
  const sy = fly.py + from.y * fly.ky
  const px = fly.px + item.x * fly.kx
  const py = fly.py + item.y * fly.ky

  // Two flight legs on the same clock: emit (source → pile) and collect
  // (the whole pile implodes into the stage centre).
  const emitLeg = (p: number) => easeInOut(itemEmit(p, index))
  const collectLeg = (p: number) => easeInOut(itemFly(collectLocal(p), index))

  const x = useTransform(entranceProgress, (p) => {
    const e = emitLeg(p), c = collectLeg(p)
    return c > 0 ? px + (fly.px - px) * c : sx + (px - sx) * e
  })
  // Emit pops gently up and out of the source; collect gets a small lift while
  // being sucked into the centre.
  const y = useTransform(entranceProgress, (p) => {
    const e = emitLeg(p), c = collectLeg(p)
    return c > 0
      ? py + (fly.py - py) * c - 36 * fly.ky * Math.sin(Math.PI * c)
      : sy + (py - sy) * e - 46 * fly.ky * Math.sin(Math.PI * e)
  })
  const scale = useTransform(entranceProgress, (p) => {
    const e = emitLeg(p), c = collectLeg(p)
    return fly.sk * (c > 0 ? 1 - 0.85 * c : 0.3 + 0.7 * e)
  })
  const rotate = useTransform(entranceProgress, (p) => item.rotate * emitLeg(p) * (1 - collectLeg(p)))
  const opacity = useTransform(entranceProgress, (p) => {
    const appear = clamp01(emitLeg(p) / 0.25)
    // Solid until the bill has all but reached the icon (90% of the flight,
    // where the arc has also flattened out), THEN dissolve — earlier fades
    // made bills vanish 30–60px off the icon's centre.
    const gone = clamp01((collectLeg(p) - 0.9) / 0.1)
    return appear * (1 - gone)
  })

  // The idle bob (CSS) only runs while the bill hovers in the pile; it has to
  // stop the moment a flight starts, otherwise it fights the fly transform.
  const [inPile, setInPile] = useState(false)
  useMotionValueEvent(entranceProgress, 'change', (p) => {
    const hovering = itemEmit(p, index) >= 1 && itemFly(collectLocal(p), index) <= 0
    if (hovering !== inPile) setInPile(hovering)
  })

  return (
    <motion.div
      className="absolute top-0 left-0 pointer-events-none"
      style={{ x, y, scale, rotate, opacity, transformOrigin: '0px 0px', zIndex: Z_BILL_BASE + index }}
    >
      <div
        style={{
          marginLeft: -CHAOS_W / 2,
          marginTop: -CHAOS_H / 2,
          animation: inPile ? `chaos-bob 3.6s ease-in-out ${(index * 0.55) % 2.8}s infinite` : 'none',
        }}
      >
        <ChaosCard name={item.name} provider={item.provider} amount={item.price} dueDay={item.dueDay} source={item.source} />
      </div>
    </motion.div>
  )
}
