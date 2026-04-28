'use client'

import { useRef } from 'react'
import { motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { ChaosCard } from './why/ChaosCard'
import { VictoriousCard } from './why/VictoriousCard'
import { CHAOS_BILLS, CHAOS_BILLS_MOBILE } from './why/cards'
import { AltidMark } from '@/components/AltidMark'

// === Connector arrow between chaos and resolution ===
// Desktop: rightward. Mobile: rotated 90° downward.
function FlowArrow({ vertical = false }: { vertical?: boolean }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{ transform: vertical ? 'rotate(90deg)' : undefined }}
      aria-hidden
    >
      <div
        className="relative flex items-center justify-center"
        style={{
          width: 56,
          height: 56,
          borderRadius: 999,
          background: 'rgba(168,224,99,0.18)',
          border: '1px solid rgba(168,224,99,0.45)',
          boxShadow: '0 0 24px rgba(168,224,99,0.25)',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12h14M13 5l7 7-7 7"
            stroke="var(--sage-dark, #2e7d52)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

export default function Why() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.25 })

  // entranceProgress starts at 1 so the chaos cards, arrow, and victorious
  // card render fully visible on first paint. If `inView` later becomes
  // observable AND we haven't already played, we replay 0→1 for the
  // entrance animation. Trade-off: users who reach the section before JS
  // finishes hydrating just see the static end-state. Better than blank.
  const entranceProgress = useMotionValue(1)
  if (typeof window !== 'undefined' && inView && !prefersReducedMotion) {
    const tag = '__altidWhyAnimated' as const
    type WindowWithTag = Window & Record<typeof tag, boolean | undefined>
    const w = window as unknown as WindowWithTag
    if (!w[tag]) {
      w[tag] = true
      entranceProgress.set(0)
      const start = performance.now()
      const DURATION = 1400
      const tick = (now: number) => {
        const t = Math.min((now - start) / DURATION, 1)
        entranceProgress.set(t)
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 px-3 sm:px-10 lg:px-12"
      style={{ background: 'var(--cream-dark)' }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Heading + subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-14 sm:mb-20">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-4" style={{ color: 'var(--text-light)' }}>
            Derfor giver det mening
          </p>
          <h2
            className="font-extrabold leading-[1.05] tracking-tight whitespace-nowrap mb-6"
            style={{ fontSize: 'clamp(20px, 4.6vw, 56px)', color: 'var(--forest)' }}
          >
            Ét hjem. For mange regninger.
          </h2>
          <p
            className="leading-relaxed mx-auto"
            style={{
              fontSize: 'clamp(15px, 1.4vw, 18px)',
              color: 'var(--text-mid)',
              maxWidth: 880,
            }}
          >
            Strøm hos én leverandør, mobil hos en anden, forsikring hos en tredje. Forskellige vilkår og regninger spredt på mail, papir og i e-Boks - uden noget samlet overblik. Det ændrer Altid Hjem. Én app. Én regning. Fuldt overblik. <AltidMark />
          </p>
        </div>

        {/* DESKTOP: chaos pile · arrow · resolution card — no wrapper boxes,
            elements float directly on the section's cream-dark background. */}
        <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] gap-8 items-center">
          <ChaosPile progress={entranceProgress} />
          <ArrowSlot progress={entranceProgress} />
          <ResolutionSlot progress={entranceProgress} />
        </div>

        {/* MOBILE / TABLET: stacked, same no-box treatment */}
        <div className="lg:hidden flex flex-col items-center gap-10">
          <ChaosPile progress={entranceProgress} mobile />
          <ArrowSlot progress={entranceProgress} vertical />
          <ResolutionSlot progress={entranceProgress} mobile />
        </div>

      </div>
    </section>
  )
}

// === Chaos pile — bills floating directly on the section background ===
// No wrapper box, no border, no UDEN-tag. Positioning container is
// transparent and only exists to anchor the absolutely-positioned cards.
function ChaosPile({ progress, mobile = false }: { progress: ReturnType<typeof useMotionValue<number>>, mobile?: boolean }) {
  const bills = mobile ? CHAOS_BILLS_MOBILE : CHAOS_BILLS
  // Cards were 0.55 on mobile (220x130 → 121x71) — too small to read as
  // bills. Bump to 0.82 (180x107) so the categories and amounts are legible
  // on a 375px iPhone. Offset scale stays tighter to keep the pile compact.
  const scaleFactor = mobile ? 0.82 : 1
  const mobileOffsetScale = mobile ? 0.65 : 1

  return (
    <div
      className="relative mx-auto"
      style={{
        height: mobile ? 380 : 460,
        width: '100%',
        maxWidth: mobile ? 360 : undefined,
      }}
    >
      {bills.map((bill, i) => {
        const start = 0.05 + i * 0.06
        const end = Math.min(start + 0.18, 0.85)
        return (
          <ChaosCardEntry
            key={bill.type}
            bill={bill}
            start={start}
            end={end}
            progress={progress}
            scaleFactor={scaleFactor}
            mobileOffsetScale={mobileOffsetScale}
          />
        )
      })}
    </div>
  )
}

function ChaosCardEntry({
  bill,
  start,
  end,
  progress,
  scaleFactor,
  mobileOffsetScale,
}: {
  bill: typeof CHAOS_BILLS[number]
  start: number
  end: number
  progress: ReturnType<typeof useMotionValue<number>>
  scaleFactor: number
  mobileOffsetScale: number
}) {
  const opacity = useTransform(progress, (p) => {
    if (p <= start) return 0
    if (p >= end) return 1
    return (p - start) / (end - start)
  })
  // Combine entrance settle (14 → 0) with the bill's static y offset so the
  // child ChaosCard is free to use its own transform for hover lift.
  const baseY = bill.y * mobileOffsetScale
  const y = useTransform(progress, (p) => {
    const settle = p <= start ? 14 : p >= end ? 0 : 14 * (1 - (p - start) / (end - start))
    return baseY + settle
  })

  return (
    <motion.div
      className="absolute top-1/2 left-1/2"
      style={{
        opacity,
        x: bill.x * mobileOffsetScale,
        y,
        rotate: bill.rotate,
        scale: scaleFactor,
        translateX: '-50%',
        translateY: '-50%',
        zIndex: bill.z,
      }}
    >
      <ChaosCard bill={bill} />
    </motion.div>
  )
}

// === Arrow ===
function ArrowSlot({
  progress,
  vertical = false,
}: {
  progress: ReturnType<typeof useMotionValue<number>>
  vertical?: boolean
}) {
  const opacity = useTransform(progress, (p) => (p < 0.5 ? 0 : Math.min((p - 0.5) / 0.2, 1)))
  const scale = useTransform(progress, (p) => (p < 0.5 ? 0.6 : 0.6 + Math.min((p - 0.5) / 0.2, 1) * 0.4))

  return (
    <motion.div style={{ opacity, scale }}>
      <FlowArrow vertical={vertical} />
    </motion.div>
  )
}

// === Resolution slot — Altid Hjem card sits directly on section bg ===
// VictoriousCard already styles itself as a forest card. No outer wrapper,
// no MED-tag, no extra padding box.
function ResolutionSlot({
  progress,
}: {
  progress: ReturnType<typeof useMotionValue<number>>
  mobile?: boolean
}) {
  const opacity = useTransform(progress, (p) => (p < 0.55 ? 0 : Math.min((p - 0.55) / 0.25, 1)))
  const scale = useTransform(progress, (p) =>
    p < 0.55 ? 0.92 : 0.92 + Math.min((p - 0.55) / 0.25, 1) * 0.08
  )

  return (
    <motion.div
      className="flex justify-center"
      style={{ opacity, scale }}
    >
      <VictoriousCard
        countProgress={progress}
        countRange={[0.6, 0.95]}
      />
    </motion.div>
  )
}
