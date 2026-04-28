'use client'

import { useRef } from 'react'
import { motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { ChaosCard } from './why/ChaosCard'
import { VictoriousCard } from './why/VictoriousCard'
import { CHAOS_BILLS, CHAOS_BILLS_MOBILE } from './why/cards'

function scrollToWaitlist() {
  const el = document.getElementById('venteliste')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('expand-waitlist'))
  }, 450)
}

// === Connector arrow between chaos and resolution ===
// Desktop: rightward arrow with sage glow.
// Mobile: rotated 90° to point downward.
function FlowArrow({ vertical = false }: { vertical?: boolean }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        transform: vertical ? 'rotate(90deg)' : undefined,
        width: vertical ? 60 : 80,
        height: vertical ? 60 : 80,
      }}
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

  // One-time entrance progress — drives chaos fade-in stagger, arrow pulse,
  // victorious card scale, and the 935 kr. counter. After this completes
  // the section is fully static.
  const entranceProgress = useMotionValue(prefersReducedMotion ? 1 : 0)
  if (typeof window !== 'undefined' && inView && entranceProgress.get() === 0 && !prefersReducedMotion) {
    const start = performance.now()
    const DURATION = 1400
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1)
      entranceProgress.set(t)
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 px-6 sm:px-10 lg:px-12"
      style={{ background: 'var(--cream-dark)' }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-4" style={{ color: 'var(--text-light)' }}>
            Hvorfor det giver mening
          </p>
          <h2
            className="font-extrabold leading-[1.05] tracking-tight"
            style={{ fontSize: 'clamp(32px, 5vw, 64px)', color: 'var(--forest)' }}
          >
            Ét hjem.{' '}
            <span style={{ color: 'rgba(15,55,30,0.5)' }} className="block sm:inline">
              For mange regninger.
            </span>
          </h2>
        </div>

        {/* DESKTOP: side-by-side */}
        <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] gap-8 items-center">
          <ChaosColumn progress={entranceProgress} />
          <ArrowSlot progress={entranceProgress} />
          <VictoriousColumn progress={entranceProgress} />
        </div>

        {/* MOBILE / TABLET: stacked */}
        <div className="lg:hidden flex flex-col items-center gap-6">
          <ChaosColumn progress={entranceProgress} mobile />
          <ArrowSlot progress={entranceProgress} vertical />
          <VictoriousColumn progress={entranceProgress} mobile />
        </div>

        {/* Comparison block — Better Stack–style stark two-row table.
            Count-focused (vendors, bills), not pricing. Sits as the
            rational supporting evidence under the emotional visual above. */}
        <ComparisonBlock progress={entranceProgress} />

        {/* Closing copy — Alex-approved */}
        <div className="text-center max-w-2xl mx-auto mt-14 sm:mt-20">
          <p
            className="font-extrabold leading-[1.1] tracking-tight mb-3"
            style={{ fontSize: 'clamp(22px, 2.6vw, 32px)', color: 'var(--forest)' }}
          >
            Indtil <span style={{ color: 'var(--sage-dark, #2e7d52)' }}>alt</span> samles ét sted.
          </p>
          <p
            className="font-semibold tracking-tight"
            style={{ fontSize: 'clamp(16px, 1.6vw, 20px)', color: 'rgba(15,55,30,0.65)' }}
          >
            Én app. Én regning. <span style={{ color: 'var(--sage-dark, #2e7d52)' }}>Fuldt overblik.</span>
          </p>
        </div>

      </div>
    </section>
  )
}

// === Chaos column — pile of bills under "Uden Altid Hjem" tag ===
function ChaosColumn({ progress, mobile = false }: { progress: ReturnType<typeof useMotionValue<number>>, mobile?: boolean }) {
  const bills = mobile ? CHAOS_BILLS_MOBILE : CHAOS_BILLS
  const scaleFactor = mobile ? 0.55 : 1

  return (
    <div className={mobile ? 'w-full' : ''}>
      <p
        className="text-[11px] font-bold tracking-[0.18em] uppercase mb-4 text-center lg:text-left"
        style={{ color: 'rgba(46,125,82,0.55)' }}
      >
        Uden Altid Hjem
      </p>
      <div
        className="relative overflow-hidden rounded-2xl mx-auto"
        style={{
          height: mobile ? 360 : 460,
          maxWidth: mobile ? 360 : undefined,
          background: 'linear-gradient(160deg, #f0e8d8 0%, #e6dcc8 100%)',
          border: '1px solid rgba(46,125,82,0.08)',
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
              mobileOffsetScale={mobile ? 0.55 : 1}
            />
          )
        })}
      </div>
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
  // Cards fade in from a small offset to their resting position.
  const opacity = useTransform(progress, (p) => {
    if (p <= start) return 0
    if (p >= end) return 1
    return (p - start) / (end - start)
  })
  const yOffset = useTransform(progress, (p) => {
    if (p <= start) return 14
    if (p >= end) return 0
    return 14 * (1 - (p - start) / (end - start))
  })

  return (
    <motion.div
      className="absolute top-1/2 left-1/2"
      style={{
        opacity,
        x: bill.x * mobileOffsetScale,
        y: yOffset,
        rotate: bill.rotate,
        scale: scaleFactor,
        translateX: '-50%',
        translateY: '-50%',
        zIndex: bill.z,
      }}
    >
      <ChaosCard bill={bill} style={{ transform: `translateY(${bill.y * mobileOffsetScale}px)` }} />
    </motion.div>
  )
}

// === Arrow slot — pulses when victorious card emerges ===
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

// === Victorious column — single resolution card under "Med Altid Hjem" tag ===
function VictoriousColumn({
  progress,
  mobile = false,
}: {
  progress: ReturnType<typeof useMotionValue<number>>
  mobile?: boolean
}) {
  const opacity = useTransform(progress, (p) => (p < 0.55 ? 0 : Math.min((p - 0.55) / 0.25, 1)))
  const scale = useTransform(progress, (p) =>
    p < 0.55 ? 0.92 : 0.92 + Math.min((p - 0.55) / 0.25, 1) * 0.08
  )

  return (
    <div className={mobile ? 'w-full' : ''}>
      <p
        className="text-[11px] font-bold tracking-[0.18em] uppercase mb-4 text-center lg:text-left"
        style={{ color: 'var(--sage-dark, #2e7d52)' }}
      >
        Med Altid Hjem
      </p>
      <motion.div
        className="relative flex items-center justify-center rounded-2xl mx-auto"
        style={{
          opacity,
          scale,
          height: mobile ? 'auto' : 460,
          padding: mobile ? '24px 0' : 0,
          maxWidth: mobile ? 360 : undefined,
          background: mobile
            ? 'linear-gradient(160deg, var(--forest) 0%, #0f3a26 100%)'
            : 'linear-gradient(160deg, var(--forest) 0%, #0f3a26 100%)',
          border: '1px solid rgba(168,224,99,0.18)',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(168,224,99,0.14) 0%, rgba(168,224,99,0) 60%)',
          }}
        />
        <VictoriousCard
          onCtaClick={scrollToWaitlist}
          countProgress={progress}
          countRange={[0.6, 0.95]}
        />
      </motion.div>
    </div>
  )
}

// === Comparison block — Better Stack–style stark two-row table ===
// Count-focused: 8 leverandører → 1 app, 45+ regninger → 1 regning.
// Both rows render the same metric columns so the eye reads top-to-bottom
// and the difference lands instantly without prose.
function ComparisonBlock({ progress }: { progress: ReturnType<typeof useMotionValue<number>> }) {
  // Block fades in after the visual above has resolved (progress > 0.7).
  const opacity = useTransform(progress, (p) => (p < 0.7 ? 0 : Math.min((p - 0.7) / 0.2, 1)))
  const y = useTransform(progress, (p) => (p < 0.7 ? 16 : 16 - 16 * Math.min((p - 0.7) / 0.2, 1)))

  return (
    <motion.div
      className="max-w-4xl mx-auto mt-14 sm:mt-20"
      style={{ opacity, y }}
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(46,125,82,0.12)' }}
      >
        {/* Row 1 — Uden Altid Hjem (problem state) */}
        <div
          className="grid grid-cols-1 sm:grid-cols-[180px_1fr_1fr] items-center"
          style={{
            background: 'linear-gradient(160deg, #f0e8d8 0%, #e6dcc8 100%)',
            borderBottom: '1px solid rgba(46,125,82,0.12)',
          }}
        >
          <div
            className="px-6 py-5 sm:py-6 text-[11px] font-bold tracking-[0.18em] uppercase text-center sm:text-left border-b sm:border-b-0 sm:border-r"
            style={{ color: 'rgba(46,125,82,0.55)', borderColor: 'rgba(46,125,82,0.12)' }}
          >
            Uden Altid Hjem
          </div>
          <CompareCell number="8" label="leverandører" tone="muted" border />
          <CompareCell number="45+" label="regninger om året" tone="muted" />
        </div>

        {/* Row 2 — Med Altid Hjem (resolution state) */}
        <div
          className="grid grid-cols-1 sm:grid-cols-[180px_1fr_1fr] items-center"
          style={{ background: 'var(--forest)' }}
        >
          <div
            className="px-6 py-5 sm:py-6 text-[11px] font-bold tracking-[0.18em] uppercase text-center sm:text-left border-b sm:border-b-0 sm:border-r"
            style={{ color: 'var(--sage)', borderColor: 'rgba(168,224,99,0.18)' }}
          >
            Med Altid Hjem
          </div>
          <CompareCell number="1" label="app, én regning" tone="resolved" border />
          <CompareCell number="12" label="regninger om året" tone="resolved" />
        </div>
      </div>
    </motion.div>
  )
}

function CompareCell({
  number,
  label,
  tone,
  border = false,
}: {
  number: string
  label: string
  tone: 'muted' | 'resolved'
  border?: boolean
}) {
  const isMuted = tone === 'muted'
  return (
    <div
      className={[
        'px-6 py-5 sm:py-6 text-center sm:text-left',
        border ? 'border-b sm:border-b-0 sm:border-r' : '',
      ].join(' ')}
      style={{
        borderColor: isMuted ? 'rgba(46,125,82,0.12)' : 'rgba(168,224,99,0.18)',
      }}
    >
      <p
        className="font-extrabold leading-none tabular-nums tracking-tight"
        style={{
          fontSize: 'clamp(36px, 4.4vw, 56px)',
          color: isMuted ? 'rgba(15,55,30,0.78)' : 'var(--sage)',
          letterSpacing: '-0.02em',
        }}
      >
        {number}
      </p>
      <p
        className="text-xs sm:text-sm leading-relaxed mt-2"
        style={{ color: isMuted ? 'rgba(15,55,30,0.55)' : 'rgba(255,255,255,0.7)' }}
      >
        {label}
      </p>
    </div>
  )
}
