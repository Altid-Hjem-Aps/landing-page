'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion'
import { ChaosCard, Envelope, CHAOS_W, CHAOS_H, ENVELOPE_W, ENVELOPE_H } from './ChaosCard'
import { AppIcon } from './AppIcons'
import AppFrame, { decodeFrame } from '@/components/AppFrame'
import PhoneShell, { PHONE_SCREEN_WIDTH } from '@/components/iphone/PhoneShell'
import { SCREENS, STORY_LABEL, STORY_SCENES, type Region } from '@/lib/screen-captures'
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
  sceneOpacities,
  sceneRest,
  liftAmount,
  introFade,
  flapOpen,
  LOOP_PAUSE,
  LOOP_FADE,
  INTRO_FADE_END,
  T,
  type Bill,
} from './cards'

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

// The full "Ét hjem" story on one self-running clock (storyboard in cards.ts:
// sources opened and removed one by one → the pile is collected into the
// Altid Hjem app icon → the icon is pressed and the phone opens → real frames of
// the app cross-fade, ending on "Du er 3.000 kr. foran", pause, loop).
//
// The stage fills its parent box and scales the composition to the box's own
// width — the same component drives the homepage WhatIs section and the
// exit-intent dialog. The clock only runs while the stage is in view.

// Sources sit under the bills; the app icons stay ON TOP of the flying bills
// (Thor: e-Boks must never be covered). New bills land on TOP of the pile, so
// each bill's z is simply its emission order.
const Z_ENVELOPE = 5
const Z_BILL_BASE = 30
const Z_ICON = 60

/** Where bill i starts its life (offset from the pile centre). */
const srcPos = (item: Bill) =>
  item.source === 'letter' ? ENVELOPES[item.envIndex ?? 0] : ICON_POS[item.source]

export default function EtHjemStage({ compact = false }: {
  /** Force the phone-width composition (the 390px squeeze factors) no matter
   *  how wide the box is — for narrow hosts like the exit-intent dialog. */
  compact?: boolean
}) {
  // Read after mount, like the hero: the server cannot know it, and the dots it
  // adds must not differ between the server's HTML and the first client render.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setPrefersReducedMotion(mql.matches)
    sync()
    mql.addEventListener('change', sync)
    return () => mql.removeEventListener('change', sync)
  }, [])
  const stageRef = useRef<HTMLDivElement>(null)
  // Live (not once:true): the effect below tears the rAF clock down when the
  // stage scrolls out of view — otherwise the 38s loop runs for the rest of
  // the session — and restarts the story when it comes back.
  const inView = useInView(stageRef, { amount: 0.25 })

  // Everything happens around one point: the centre of the stage. The sources
  // scene, the imploding pile, the app icon and the opened interface all share
  // this anchor — on EVERY breakpoint (mobile is the same stacked composition,
  // just compressed). kx/ky squeeze the scatter offsets into the available
  // width, sk shrinks the paper elements themselves.
  const [fly, setFly] = useState<{ px: number; py: number; kx: number; ky: number; sk: number } | null>(null)
  useEffect(() => {
    const m = stageRef.current
    if (!m) return
    let raf = 0
    let lastW = -1
    let lastH = -1
    const measure = () => {
      // offsetWidth/Height, NOT getBoundingClientRect: the exit-intent dialog
      // scales its panel down during the letter intro, and rects are measured
      // post-transform — the stage would anchor to the shrunken box.
      const w = m.offsetWidth
      const h = m.offsetHeight
      // Equality bail: ResizeObserver + window resizes fire in bursts, and
      // every setFly re-renders the whole scenery subtree.
      if (w === lastW && h === lastH) return
      lastW = w
      lastH = h
      const kx = compact ? 0.3 : Math.min(1, Math.max(0.3, 0.3 + ((w - 390) / (1152 - 390)) * 0.7))
      setFly({
        px: w / 2,
        py: h / 2,
        kx,
        ky: Math.min(1, kx + 0.25),
        sk: Math.min(1, 0.55 + kx * 0.45),
      })
    }
    measure()
    // ResizeObserver, not window resize: the stage's box can change without a
    // window resize (the dialog's form column grows/shrinks per view swap).
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    })
    ro.observe(m)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [compact])

  // The RESTING frame: sources fully faded in (introFade completes at 0.015),
  // no bill emitted yet — the physical letters, Mail and e-Boks icons simply
  // sit there. The stage renders this frame from first paint, and the clock
  // only starts on scroll-in — starting the story FROM the resting frame, so
  // there is no visible snap from the finished phone back to the beginning.
  const SOURCES_READY = INTRO_FADE_END
  const entranceProgress = useMotionValue(SOURCES_READY)
  const stageOpacity = useMotionValue(1)
  // Which frames can be shown, one bit per scene. Asked for when the stage comes
  // into view, and again next time for any that failed: a failed frame stays out
  // meanwhile, and the phone keeps the one before it.
  const readyMask = useMotionValue(0)
  const decodingRef = useRef(new Set<number>())
  useEffect(() => {
    if (!inView) return
    STORY_SCENES.forEach((scene, i) => {
      if (readyMask.get() & (1 << i) || decodingRef.current.has(i)) return
      decodingRef.current.add(i)
      void decodeFrame(scene.id).then((ok) => {
        decodingRef.current.delete(i)
        if (ok) readyMask.set(readyMask.get() | (1 << i))
      })
    })
  }, [inView, readyMask])

  // No animation: the last frame, at rest. Dots step through the others, and
  // scrolling away and back leaves the frame the visitor chose.
  useEffect(() => {
    if (prefersReducedMotion) entranceProgress.set(1)
  }, [prefersReducedMotion, entranceProgress])

  useEffect(() => {
    if (prefersReducedMotion) return
    if (!inView) return
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
    // The clock always advances at the same speed; `from` lets the first run
    // start at the resting frame while loop restarts replay the intro fade
    // from 0 (the stage is faded to black-out during the loop's crossfade,
    // so the 0-start is never visible as a jump).
    const play = (from: number) => {
      entranceProgress.set(from)
      let t = from
      let last = performance.now()
      const tick = (now: number) => {
        // requestAnimationFrame stops on a hidden tab: the clamp makes the story
        // carry on from where it stopped instead of jumping ahead.
        t = Math.min(t + Math.min(now - last, 100) / DURATION, 1)
        last = now
        entranceProgress.set(t)
        if (t < 1) clockRaf = requestAnimationFrame(tick)
        else
          timer = setTimeout(() => {
            fade(1, 0, () => {
              fade(0, 1)
              play(0)
            })
          }, LOOP_PAUSE)
      }
      clockRaf = requestAnimationFrame(tick)
    }
    stageOpacity.set(1)
    if (entranceProgress.get() <= SOURCES_READY + 0.0001) {
      // First start (or restart from rest) — begin directly, no fade needed.
      play(SOURCES_READY)
    } else {
      // Re-entering mid-story (user scrolled away and back): crossfade the
      // frozen frame back to the resting scene instead of hard-cutting.
      fade(1, 0, () => {
        entranceProgress.set(SOURCES_READY)
        fade(0, 1)
        play(SOURCES_READY)
      })
    }
    return () => {
      cancelAnimationFrame(clockRaf)
      cancelAnimationFrame(fadeRaf)
      if (timer) clearTimeout(timer)
    }
  }, [inView, prefersReducedMotion, entranceProgress, stageOpacity])

  return (
    <div ref={stageRef} className="relative w-full h-full">
      {/* The loop fades this whole stage out at the end and back in at the top */}
      <motion.div className="absolute inset-0" style={{ opacity: stageOpacity }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <CardStage progress={entranceProgress} readyMask={readyMask} stepByHand={prefersReducedMotion} />
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
  )
}

// === The Altid Hjem app icon: appears at the centre while the pile fades
//     into it, gets pressed — and the PHONE opens from it, on frames of the app. ===
function CardStage({ progress, readyMask, stepByHand }: {
  progress: MotionValue<number>
  readyMask: MotionValue<number>
  stepByHand: boolean
}) {
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
    <div className="relative">
      <div style={{ display: 'grid', placeItems: 'center' }}>
        <motion.div
          role="img"
          aria-label={STORY_LABEL}
          style={{ gridArea: '1 / 1', scale: shellScale, opacity: shellOpacity }}
        >
          <PhoneShell sheen={false}>
            {STORY_SCENES.map((scene, i) => (
              <StoryFrame key={scene.id} index={i} progress={progress} readyMask={readyMask} />
            ))}
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
      {stepByHand && <StoryDots progress={progress} />}
    </div>
  )
}

const SCENE_FROMS = STORY_SCENES.map((scene) => scene.from)
const readyFlags = (mask: number) => STORY_SCENES.map((_, i) => (mask & (1 << i)) !== 0)

function StoryFrame({ index, progress, readyMask }: {
  index: number
  progress: MotionValue<number>
  readyMask: MotionValue<number>
}) {
  const scene = STORY_SCENES[index]
  const opacity = useTransform([progress, readyMask], ([p, mask]: number[]) =>
    sceneOpacities(p, SCENE_FROMS, readyFlags(mask))[index],
  )
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <AppFrame id={scene.id} />
      {scene.lift && <LiftedPart scene={scene.id} region={scene.lift} from={scene.from} progress={progress} />}
    </motion.div>
  )
}

// The same picture, clipped to one part of it and exactly on top of it, so it
// lines up with the frame until it comes forward.
function LiftedPart({ scene, region, from, progress }: {
  scene: (typeof STORY_SCENES)[number]['id']
  region: Region
  from: number
  progress: MotionValue<number>
}) {
  const k = PHONE_SCREEN_WIDTH / SCREENS[scene].width
  const y = useTransform(progress, (p) => -1.5 * liftAmount(p, from))
  const scale = useTransform(progress, (p) => 1 + 0.06 * liftAmount(p, from))
  const shadow = useTransform(progress, (p) => `0 10px 24px rgba(0,0,0,${0.4 * liftAmount(p, from)})`)
  return (
    <motion.div
      className="absolute overflow-hidden"
      style={{
        left: region.x * k,
        top: region.y * k,
        width: region.width * k,
        height: region.height * k,
        borderRadius: region.radius * k,
        y,
        scale,
        boxShadow: shadow,
      }}
    >
      <div className="absolute" style={{ left: -region.x * k, top: -region.y * k, width: PHONE_SCREEN_WIDTH }}>
        <AppFrame id={scene} />
      </div>
    </motion.div>
  )
}

// Reduced motion: the story does not play, and these step through its frames.
function StoryDots({ progress }: { progress: MotionValue<number> }) {
  const [current, setCurrent] = useState(STORY_SCENES.length - 1)
  return (
    <div className="absolute left-0 right-0 top-full flex justify-center">
      {STORY_SCENES.map((scene, i) => (
        <button
          key={scene.id}
          type="button"
          aria-label={`Skærm ${i + 1}`}
          aria-current={current === i}
          onClick={() => {
            setCurrent(i)
            // The last frame's rest is the end of the clock, with its lift.
            progress.set(i === STORY_SCENES.length - 1 ? 1 : sceneRest(Math.max(scene.from, T.openEnd)))
          }}
          className="flex items-center justify-center"
          style={{ width: 44, height: 44 }}
        >
          <span
            className="block rounded-full"
            style={{ width: current === i ? 11 : 8, height: current === i ? 11 : 8, background: current === i ? '#163223' : 'rgba(22,50,35,0.55)' }}
          />
        </button>
      ))}
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
