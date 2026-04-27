'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { ChaosCard } from './why/ChaosCard'
import { VictoriousCard } from './why/VictoriousCard'
import { FloatingStat } from './why/FloatingStat'
import { CHAOS_BILLS, CHAOS_BILLS_MOBILE } from './why/cards'
import type { ChaosBill } from './why/cards'

function scrollToWaitlist() {
  const el = document.getElementById('venteliste')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('expand-waitlist'))
  }, 450)
}

// === Helpers — explicit clamp because framer-motion's useTransform
// with multi-keyframe ranges doesn't clamp outside the input range
// as the docs imply. ===
function ramp(p: number, inStart: number, inEnd: number, outStart = 0, outEnd = 1) {
  if (p <= inStart) return outStart
  if (p >= inEnd) return outEnd
  const t = (p - inStart) / (inEnd - inStart)
  return outStart + (outEnd - outStart) * t
}
function pulse(p: number, fadeIn: [number, number], fadeOut: [number, number]) {
  if (p < fadeIn[0]) return 0
  if (p < fadeIn[1]) return ramp(p, fadeIn[0], fadeIn[1])
  if (p < fadeOut[0]) return 1
  if (p < fadeOut[1]) return ramp(p, fadeOut[0], fadeOut[1], 1, 0)
  return 0
}

// === Animated chaos card ===
// Each card has its own progress range so the collapse staggers.
// Cards 1-8 begin collapsing at 0.50, end 0.78 (stagger 0.035 apart).
function AnimatedChaosCard({
  bill,
  index,
  progress,
}: {
  bill: ChaosBill
  index: number
  progress: MotionValue<number>
}) {
  const start = 0.50 + index * 0.035
  const end = start + 0.18

  // Cards travel from scattered position to center (0,0), rotate to 0, shrink to 0.4, fade out.
  const x = useTransform(progress, (p) => ramp(p, start, end, bill.x, 0))
  const y = useTransform(progress, (p) => ramp(p, start, end, bill.y, 0))
  const rotate = useTransform(progress, (p) => ramp(p, start, end, bill.rotate, 0))
  const scale = useTransform(progress, (p) => ramp(p, start, end, 1, 0.4))
  const opacity = useTransform(progress, (p) => ramp(p, end - 0.04, end, 1, 0))

  return (
    <motion.div
      className="absolute top-1/2 left-1/2"
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        translateX: '-50%',
        translateY: '-50%',
        zIndex: bill.z,
      }}
    >
      <ChaosCard bill={bill} />
    </motion.div>
  )
}

// === Sticky animated canvas (desktop) ===
function AnimatedCanvas() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Floating stats fade out as resolution arrives
  const stat1Opacity = useTransform(scrollYProgress, (p) => pulse(p, [0.05, 0.18], [0.6, 0.7]))
  const stat2Opacity = useTransform(scrollYProgress, (p) => pulse(p, [0.25, 0.4], [0.6, 0.7]))

  // Victorious card emerges from center
  const victoriousOpacity = useTransform(scrollYProgress, (p) => ramp(p, 0.72, 0.88))
  const victoriousScale = useTransform(scrollYProgress, (p) => ramp(p, 0.72, 0.95, 0.78, 1))
  const victoriousY = useTransform(scrollYProgress, (p) => ramp(p, 0.72, 0.95, 20, 0))

  // Background warms to forest as we resolve
  const bgOpacity = useTransform(scrollYProgress, (p) => ramp(p, 0.7, 0.95))

  // Left-column copy: three acts cross-fade
  const act1Opacity = useTransform(scrollYProgress, (p) => pulse(p, [0, 0], [0.22, 0.34]))
  const act2Opacity = useTransform(scrollYProgress, (p) => pulse(p, [0.32, 0.46], [0.6, 0.7]))
  const act3Opacity = useTransform(scrollYProgress, (p) => ramp(p, 0.68, 0.82))

  return (
    <div ref={sectionRef} style={{ height: '260vh', position: 'relative' }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left column — copy that cross-fades through three acts */}
          <div className="relative min-h-[280px]">
            <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-4" style={{ color: 'var(--text-light)' }}>
              Hvorfor det giver mening
            </p>

            {/* Act 1 copy */}
            <motion.div style={{ opacity: act1Opacity }} className="absolute inset-0 mt-8">
              <h2
                className="font-extrabold leading-[1.05] tracking-tight mb-5"
                style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', color: 'var(--forest)' }}
              >
                Ét hjem.<br />
                <span style={{ color: 'rgba(15,55,30,0.55)' }}>For mange regninger.</span>
              </h2>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-mid)' }}>
                Strøm hos én, mobil hos en anden, forsikring hos en tredje. Spredt på mail, e-Boks og papir — uden noget samlet overblik.
              </p>
            </motion.div>

            {/* Act 2 copy */}
            <motion.div style={{ opacity: act2Opacity }} className="absolute inset-0 mt-8">
              <h2
                className="font-extrabold leading-[1.05] tracking-tight mb-5"
                style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', color: 'var(--forest)' }}
              >
                Det stopper ikke<br />
                <span style={{ color: 'rgba(15,55,30,0.55)' }}>ved tre.</span>
              </h2>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-mid)' }}>
                Den gennemsnitlige husstand jonglerer 5–8 leverandører og modtager 40–50 regninger om året. Hver eneste skal du selv huske, sammenligne og betale.
              </p>
            </motion.div>

            {/* Act 3 copy */}
            <motion.div style={{ opacity: act3Opacity }} className="absolute inset-0 mt-8">
              <h2
                className="font-extrabold leading-[1.05] tracking-tight mb-5"
                style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', color: 'var(--forest)' }}
              >
                Indtil <span style={{ color: 'var(--sage-dark, #2e7d52)' }}>alt</span><br />
                samles ét sted.
              </h2>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-mid)' }}>
                Én app. Én regning. Ét login. Du får overblik over alt det du betaler for, og adgang til de bedste priser uden skjulte gebyrer.
              </p>
            </motion.div>
          </div>

          {/* Right column — animated canvas */}
          <div
            className="relative rounded-2xl"
            style={{
              height: 540,
              background: 'linear-gradient(160deg, #f0e8d8 0%, #e6dcc8 100%)',
              border: '1px solid rgba(46,125,82,0.08)',
              overflow: 'hidden',
            }}
          >
            {/* Background gradient that warms to forest as we resolve */}
            <motion.div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(160deg, var(--forest) 0%, #0f3a26 100%)',
                opacity: bgOpacity,
              }}
            />

            {/* Floating stats over chaos */}
            <motion.div style={{ opacity: stat1Opacity, position: 'absolute', top: 20, left: 20, zIndex: 0 }}>
              <FloatingStat number="5–8" label="leverandører" />
            </motion.div>
            <motion.div style={{ opacity: stat2Opacity, position: 'absolute', bottom: 20, right: 20, zIndex: 0, textAlign: 'right' }}>
              <FloatingStat number="40–50" label="regninger om året" />
            </motion.div>

            {/* Chaos cards — animated */}
            <div className="absolute inset-0 z-10">
              {CHAOS_BILLS.map((bill, i) => (
                <AnimatedChaosCard key={bill.type} bill={bill} index={i} progress={scrollYProgress} />
              ))}
            </div>

            {/* Victorious card — emerges from center */}
            <motion.div
              className="absolute top-1/2 left-1/2 z-20"
              style={{
                opacity: victoriousOpacity,
                scale: victoriousScale,
                y: victoriousY,
                translateX: '-50%',
                translateY: '-50%',
              }}
            >
              <VictoriousCard onCtaClick={scrollToWaitlist} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

// === Mobile fallback (no animation, static side-by-side) ===
// Phase D will replace this with an IntersectionObserver one-shot.
function StaticMobile() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-3" style={{ color: 'var(--text-light)' }}>
          Hvorfor det giver mening
        </p>
        <h2
          className="font-extrabold leading-[1.1] tracking-tight mb-4"
          style={{ fontSize: 'clamp(28px, 7vw, 40px)', color: 'var(--forest)' }}
        >
          Ét hjem. For mange regninger.
        </h2>
        <p className="text-base leading-relaxed" style={{ color: 'var(--text-mid)' }}>
          Strøm hos én, mobil hos en anden, forsikring hos en tredje — uden samlet overblik.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div>
          <p className="text-[11px] font-bold tracking-[0.15em] uppercase mb-3" style={{ color: 'rgba(46,125,82,0.55)' }}>
            Uden Altid Hjem
          </p>
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              height: 360,
              background: 'linear-gradient(160deg, #f0e8d8 0%, #e6dcc8 100%)',
              border: '1px solid rgba(46,125,82,0.08)',
            }}
          >
            <FloatingStat
              number="5–8"
              label="leverandører"
              style={{ position: 'absolute', top: 16, left: 16, zIndex: 0 }}
            />
            <div className="absolute inset-0 z-10">
              {CHAOS_BILLS_MOBILE.map((bill, i) => (
                <div
                  key={bill.type}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    transform: `translate(-50%, -50%) translate(${bill.x * 0.55}px, ${bill.y * 0.55}px) rotate(${bill.rotate}deg) scale(0.78)`,
                    zIndex: i + 1,
                  }}
                >
                  <ChaosCard bill={bill} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold tracking-[0.15em] uppercase mb-3" style={{ color: 'var(--sage-dark, #2e7d52)' }}>
            Med Altid Hjem
          </p>
          <div
            className="relative rounded-2xl flex items-center justify-center py-8"
            style={{
              background: 'linear-gradient(160deg, var(--forest) 0%, #0f3a26 100%)',
              border: '1px solid rgba(168,224,99,0.18)',
            }}
          >
            <VictoriousCard onCtaClick={scrollToWaitlist} />
          </div>
        </div>
      </div>

      <p
        className="mt-10 text-center font-semibold tracking-tight"
        style={{ fontSize: 'clamp(18px, 4.5vw, 24px)', color: 'var(--forest)' }}
      >
        1 regning. Ét login. <span style={{ color: 'var(--sage-dark, #2e7d52)' }}>Fuldt overblik.</span>
      </p>
    </div>
  )
}

export default function Why() {
  return (
    <section className="relative" style={{ background: 'var(--cream-dark)' }}>
      {/* Desktop — sticky scroll-driven canvas */}
      <div className="hidden lg:block">
        <AnimatedCanvas />
      </div>

      {/* Mobile / tablet — static side-by-side */}
      <div className="lg:hidden py-12">
        <StaticMobile />
      </div>
    </section>
  )
}
