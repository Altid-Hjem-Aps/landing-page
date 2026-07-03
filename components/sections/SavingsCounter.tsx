'use client'

import { useEffect, useRef, useState } from 'react'
import { liveSavings } from '@/lib/liveSavings'
import { H2, EYEBROW, BODY } from '@/lib/typography'

// FAST_END = altidenergi.dk's live value at page load, from the exact formula
// (nothing hard-coded — it's whatever liveSavings() returns right now).
//
// Two phases:
//   1. reveal — fast slot-reel spin landing COUNTUP_GAP below the live value
//   2. bursts — random jumps that each roll the changed digits up to a CLEAN
//               whole number, then rest. The jump targets follow a schedule
//               that catches up to the STILL-RISING live value over
//               ~PHASE2_DURATION (10 min), so the number looks like it just
//               keeps growing, then stops on live.
const FAST_DURATION = 780
const FAST_SPEED = 0.5
const STOP_DURATION = 480
const STOP_STAGGER = 240
// Phase 2 pacing. A burst roughly every BURST_EVERY, of a random amount, reaching
// the live value in ~PHASE2_DURATION. COUNTUP_GAP (how far below live phase 1
// lands) is DERIVED from these three so the maths always adds up — nothing
// hard-coded, and the start point is live − COUNTUP_GAP at page load.
const PHASE2_DURATION = 10 * 60 * 1000 // ~10 min to catch up to the live value
const BURST_EVERY = 2500               // ms between bursts (≈ 2–3s apart)
const AVG_BURST = 200                  // mean kr added per burst
const COUNTUP_GAP = Math.round((PHASE2_DURATION / BURST_EVERY) * AVG_BURST) // ≈ 48 000
const SETTLE_MIN = 1400                // ms the clean number rests …
const SETTLE_RANGE = 900               // … + random up to this (→ ~2–3s incl. the roll)
const BURST_ROLL = 190                 // base ms for a burst roll (scales with distance)
const SPRING = 'cubic-bezier(0.34, 1.2, 0.64, 1)'

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function fmt(n: number) {
  return n.toLocaleString('da-DK')
}

function getDigitValues(n: number): number[] {
  return fmt(n).split('').filter(c => /\d/.test(c)).map(Number)
}

// Layout derived from the live value — computed per MOUNT (not module scope,
// which would freeze the clock read into the build's static HTML) so the
// digit count and targets always reflect the actual visit time.
function computeLayout() {
  const FAST_END = liveSavings()
  const TARGET_CHARS = fmt(FAST_END).split('')
  let ri = 0
  const REEL_FOR_CHAR = TARGET_CHARS.map(c => (/\d/.test(c) ? ri++ : null))
  const NUM_REELS = ri
  // Where phase 1 lands (real value minus the count-up headroom). Guarded so it
  // keeps the same digit count as the live value; otherwise skip straight to it.
  const nearRaw = Math.round((FAST_END - COUNTUP_GAP) / 100) * 100
  const NEAR_END = getDigitValues(nearRaw).length === NUM_REELS ? nearRaw : FAST_END
  const NEAR_DIGIT_VALUES = getDigitValues(NEAR_END)
  return { TARGET_CHARS, REEL_FOR_CHAR, NUM_REELS, NEAR_END, NEAR_DIGIT_VALUES }
}

// Reel is always rendered for the full lifetime of the component.
// Position is driven directly via ref — no React re-renders during animation.
function Reel({ setRef }: { setRef: (el: HTMLSpanElement | null) => void }) {
  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', height: '1em', verticalAlign: 'middle' }}>
      <span ref={setRef} style={{ display: 'flex', flexDirection: 'column', willChange: 'transform' }}>
        {Array.from({ length: 20 }, (_, i) => (
          <span key={i} style={{ height: '1em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {i % 10}
          </span>
        ))}
      </span>
    </span>
  )
}

export default function SavingsCounter() {
  // Initialize visible=true so the section content (headline + counter +
  // description) ALWAYS renders on first paint, even if IntersectionObserver
  // never fires or the JS effect throws on iOS Safari. The intro fade-up
  // animation downgrades to "no animation" in that case, which is still
  // miles better than a fully empty dark-green slab.
  const [visible, setVisible] = useState(true)

  // Reel layout is derived from the clock at first client render; until the
  // mount effect flips to 'reels' (or when reduced motion is on) the number
  // renders as plain static text — also what no-JS visitors keep.
  const [L] = useState(computeLayout)
  const { NUM_REELS, NEAR_END, NEAR_DIGIT_VALUES } = L
  const [display, setDisplay] = useState<'static' | 'reels'>('static')
  const [staticValue, setStaticValue] = useState<string | null>(null)

  const sectionRef = useRef<HTMLDivElement>(null)
  const startedRef = useRef(false)
  // Drives which phase the rAF loop is running. 'done' = landed, animation over.
  const modeRef = useRef<'reveal' | 'bursting' | 'done'>('reveal')
  const currentValRef = useRef(NEAR_END) // whole-kr value the last burst landed on

  // Phase 2 — the current burst: each reel rolls from its digit to a clean
  // target digit, then holds a random settle before the next burst.
  const phase2StartRef = useRef(0) // when bursting began (for the PHASE2_DURATION schedule)
  const finalRef = useRef(false)   // is the current burst the last one (landing on live)?
  const burstSubRef = useRef<'rolling' | 'settling'>('rolling')
  const burstFromArr = useRef<number[]>(Array(NUM_REELS).fill(0))
  const burstToArr = useRef<number[]>(Array(NUM_REELS).fill(0))
  const burstRollStartRef = useRef(0)
  const burstRollDurRef = useRef(BURST_ROLL)
  const settleUntilRef = useRef(0)

  const rafRef = useRef<number>(0)

  const reelRefs = useRef<(HTMLSpanElement | null)[]>(Array(NUM_REELS).fill(null))

  // Positions init to NEAR digits so the static display before spinning matches
  // where the fast reveal will land.
  const positions = useRef<number[]>([...NEAR_DIGIT_VALUES])

  type RPhase = 'spinning' | 'stopping' | 'idle'
  const rPhases = useRef<RPhase[]>(Array(NUM_REELS).fill('idle' as RPhase))

  const stopTarget = useRef<number[]>(Array(NUM_REELS).fill(0))
  const stopStartTime = useRef<number[]>(Array(NUM_REELS).fill(0))
  const stopStartPos = useRef<number[]>(Array(NUM_REELS).fill(0))

  useEffect(() => {
    // Reduced motion: show the exact live value as static text, no animation.
    if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStaticValue(fmt(liveSavings()))
      return
    }
    setDisplay('reels')
    startedRef.current = false
    modeRef.current = 'reveal'
    burstSubRef.current = 'rolling'
    finalRef.current = false
    currentValRef.current = NEAR_END
    const el = sectionRef.current
    if (!el) return

    let entranceTimer: ReturnType<typeof setTimeout>
    const stopTimers: ReturnType<typeof setTimeout>[] = []

    const applyReel = (i: number) => {
      const ref = reelRefs.current[i]
      if (!ref) return
      ref.style.transform = `translateY(${-(positions.current[i] % 10)}em)`
    }

    const startReveal = () => {
      if (startedRef.current) return
      startedRef.current = true
      setVisible(true)
      entranceTimer = setTimeout(() => {
        for (let i = 0; i < NUM_REELS; i++) rPhases.current[i] = 'spinning'
        rafRef.current = requestAnimationFrame(loop)
        stopTimers.push(setTimeout(() => {
          for (let i = 0; i < NUM_REELS; i++) {
            scheduleStop(i, i * STOP_STAGGER + i * i * 8)
          }
        }, FAST_DURATION))
      }, 400)
    }

    const scheduleStop = (i: number, delay: number) => {
      stopTimers.push(setTimeout(() => {
        const pos = positions.current[i]
        const td = NEAR_DIGIT_VALUES[i]
        let target = Math.floor(pos / 10) * 10 + td
        if (target - pos < 0.5) target += 10
        stopTarget.current[i] = target
        stopStartTime.current[i] = performance.now()
        stopStartPos.current[i] = pos
        rPhases.current[i] = 'stopping'
      }, delay))
    }

    // Phase 2 — set up one burst. Add a RANDOM amount, sized so we still reach the
    // (rising) live value at ~PHASE2_DURATION: baseInc = what's left / how many
    // bursts are left, then multiplied by a hard random factor so each jump is a
    // different-looking number. Self-correcting, so the randomness never derails
    // the deadline. The last burst lands exactly on live.
    const startBurst = (now: number) => {
      const live = liveSavings()
      const elapsed = now - phase2StartRef.current
      let newVal: number
      if (live - currentValRef.current <= 0 || elapsed >= PHASE2_DURATION) {
        newVal = live
        finalRef.current = true
      } else {
        const remaining = live - currentValRef.current
        const burstsLeft = Math.max(1, (PHASE2_DURATION - elapsed) / BURST_EVERY)
        const baseInc = remaining / burstsLeft
        const factor = 0.2 + Math.random() * Math.random() * 2.4 // skewed 0.2–2.6
        const inc = Math.max(1, Math.round(baseInc * factor))
        newVal = currentValRef.current + inc
        finalRef.current = newVal >= live
        if (finalRef.current) newVal = live
      }

      let maxDist = 0
      for (let i = 0; i < NUM_REELS; i++) {
        const power = NUM_REELS - 1 - i
        const digit = Math.floor(newVal / Math.pow(10, power)) % 10
        const from = positions.current[i]
        let to = Math.floor(from / 10) * 10 + digit
        if (to < from) to += 10 // always roll forward to the target digit
        burstFromArr.current[i] = from
        burstToArr.current[i] = to
        if (to - from > maxDist) maxDist = to - from
      }

      currentValRef.current = newVal
      burstRollStartRef.current = now
      burstRollDurRef.current = Math.min(650, BURST_ROLL + maxDist * 45)
      burstSubRef.current = 'rolling'
    }

    const loop = (now: number) => {
      // Landed — animation is finished, stop requesting frames.
      if (modeRef.current === 'done') return

      // Phase 2 — bursts: roll to a clean number, settle ~3s, jump again.
      if (modeRef.current === 'bursting') {
        if (burstSubRef.current === 'rolling') {
          const t = Math.min((now - burstRollStartRef.current) / burstRollDurRef.current, 1)
          const e = easeOut(t)
          for (let i = 0; i < NUM_REELS; i++) {
            positions.current[i] = burstFromArr.current[i] + (burstToArr.current[i] - burstFromArr.current[i]) * e
            applyReel(i)
          }
          if (t >= 1) {
            // Snap onto the clean target digits.
            for (let i = 0; i < NUM_REELS; i++) {
              positions.current[i] = burstToArr.current[i] % 10
              applyReel(i)
            }
            if (finalRef.current) {
              modeRef.current = 'done' // caught up to live — animation over
              return
            }
            burstSubRef.current = 'settling'
            settleUntilRef.current = now + SETTLE_MIN + Math.random() * SETTLE_RANGE
          }
        } else if (now >= settleUntilRef.current) {
          startBurst(now)
        }
        rafRef.current = requestAnimationFrame(loop)
        return
      }

      // Phase 1 — reveal: fast spin, then staggered stop onto the NEAR digits.
      let revealComplete = true

      for (let i = 0; i < NUM_REELS; i++) {
        const rp = rPhases.current[i]

        if (rp === 'spinning') {
          revealComplete = false
          positions.current[i] += FAST_SPEED
          if (positions.current[i] >= 10) positions.current[i] -= 10
        } else if (rp === 'stopping') {
          revealComplete = false
          const elapsed = now - stopStartTime.current[i]
          const t = Math.min(elapsed / STOP_DURATION, 1)
          positions.current[i] = stopStartPos.current[i] +
            (stopTarget.current[i] - stopStartPos.current[i]) * easeOut(t)
          if (t >= 1) {
            positions.current[i] = stopTarget.current[i] % 10
            rPhases.current[i] = 'idle'
          }
        }

        applyReel(i)
      }

      // All reels settled on NEAR → start the bursts.
      if (revealComplete) {
        modeRef.current = 'bursting'
        currentValRef.current = NEAR_END
        phase2StartRef.current = now
        startBurst(now)
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    // Only start once the section is actually scrolled into view. (Fallback to an
    // immediate start only where IntersectionObserver isn't supported.)
    let observer: IntersectionObserver | undefined
    if (typeof IntersectionObserver === 'undefined') {
      startReveal()
    } else {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) startReveal()
      }, { threshold: 0 })
      observer.observe(el)
    }
    return () => {
      observer?.disconnect()
      clearTimeout(entranceTimer)
      cancelAnimationFrame(rafRef.current)
      stopTimers.forEach(clearTimeout)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28 px-6 sm:px-10"
      style={{ background: '#fdfaf4' }}
    >
      <div className="max-w-[1120px] mx-auto text-center">

        {/* Eyebrow, heading and the number box share one fit-content column, so the
            green box is exactly as wide as the heading text (on desktop, where the
            heading is one line; it wraps + goes full-width on narrow screens). */}
        <div className="mx-auto" style={{ width: 'fit-content', maxWidth: '100%' }}>
          <div style={{
            transform: visible ? 'translateY(0)' : 'translateY(28px)',
            opacity: visible ? 1 : 0,
            transition: `transform 0.7s ${SPRING}, opacity 0.55s ease`,
          }}>
            <p className={`${EYEBROW} mb-5`} style={{ color: '#163223' }}>
              Indtil videre
            </p>
            <h2 className={`${H2} mb-9 whitespace-normal md:whitespace-nowrap`} style={{ color: '#163223' }}>
              Vores Altid Energi-kunder har allerede sparet
            </h2>
          </div>

          <div style={{
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(36px) scale(0.94)',
            opacity: visible ? 1 : 0,
            transition: `transform 0.85s ${SPRING} 0.12s, opacity 0.55s ease 0.12s`,
          }}>
            <div
              className="w-full flex items-center justify-center rounded-[30px] py-4 sm:py-5 px-6 font-normal tabular-nums text-[clamp(40px,calc(29.8px+2.61vw),80px)]"
              style={{
                background: '#90ff7c',
                color: '#163223',
                letterSpacing: '-0.01em',
                lineHeight: 1,
              }}
            >
              {display === 'reels' ? (
                L.TARGET_CHARS.map((c, ci) => {
                  const ri = L.REEL_FOR_CHAR[ci]
                  if (ri !== null) {
                    return (
                      <Reel
                        key={ci}
                        setRef={el => {
                          reelRefs.current[ri] = el
                          // Show the NEAR digits from the moment the reel exists.
                          if (el) el.style.transform = `translateY(${-(positions.current[ri] % 10)}em)`
                        }}
                      />
                    )
                  }
                  return <span key={ci}>{c}</span>
                })
              ) : (
                <span suppressHydrationWarning>{staticValue ?? fmt(NEAR_END)}</span>
              )}
              <span style={{ marginLeft: '0.25em' }}>kr.</span>
            </div>
          </div>
          {/* width:0 + minWidth:100% → fills the box/heading width without letting
              its long text expand the fit-content wrapper. */}
          <div style={{
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            opacity: visible ? 1 : 0,
            transition: `transform 0.7s ${SPRING} 0.25s, opacity 0.55s ease 0.25s`,
            width: 0,
            minWidth: '100%',
          }}>
            <p className={`mt-9 ${BODY} mx-auto`} style={{ color: '#6f6a61', maxWidth: 700 }}>
              Baseret på kunder hos Altid Energi. <span style={{ color: '#163223' }}>Er du ikke kunde endnu, kan du blive det via Altid Hjem, når du downloader app&apos;en.</span> Med Altid Hjem får du samme gennemsigtighed på bl.a. strøm, mobil, forsikring, og mange sparer langt over 1.000 kr. årligt.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
