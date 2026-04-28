'use client'

import { useEffect, useRef, useState } from 'react'

const CAP = 5_309_132
const FAST_END = 5_299_990
const FAST_DURATION = 780
const FAST_SPEED = 0.5
const STOP_DURATION = 480
const STOP_STAGGER = 240
const SLOW_MOVE_DURATION = 650
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

const TARGET_STR = fmt(FAST_END)
const TARGET_CHARS = TARGET_STR.split('')
let _ri = 0
const REEL_FOR_CHAR = TARGET_CHARS.map(c => (/\d/.test(c) ? _ri++ : null))
const NUM_REELS = _ri
const TARGET_DIGIT_VALUES = getDigitValues(FAST_END)

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
  const [visible, setVisible] = useState(false)

  const sectionRef = useRef<HTMLDivElement>(null)
  const startedRef = useRef(false)
  const slowStartedRef = useRef(false)
  const rafRef = useRef<number>(0)
  const tickRef = useRef<ReturnType<typeof setInterval>>(undefined)
  const slowCountRef = useRef(FAST_END)

  const reelRefs = useRef<(HTMLSpanElement | null)[]>(Array(NUM_REELS).fill(null))

  // Positions init to FAST_END digits so the static display before spinning looks correct
  const positions = useRef<number[]>([...TARGET_DIGIT_VALUES])

  type RPhase = 'spinning' | 'stopping' | 'idle' | 'slow-moving'
  const rPhases = useRef<RPhase[]>(Array(NUM_REELS).fill('idle' as RPhase))

  const stopTarget = useRef<number[]>(Array(NUM_REELS).fill(0))
  const stopStartTime = useRef<number[]>(Array(NUM_REELS).fill(0))
  const stopStartPos = useRef<number[]>(Array(NUM_REELS).fill(0))

  const slowMoveTarget = useRef<number[]>(Array(NUM_REELS).fill(0))
  const slowMoveStartTime = useRef<number[]>(Array(NUM_REELS).fill(0))
  const slowMoveStartPos = useRef<number[]>(Array(NUM_REELS).fill(0))

  useEffect(() => {
    startedRef.current = false
    slowStartedRef.current = false
    const el = sectionRef.current
    if (!el) return

    const revealFallback = setTimeout(() => setVisible(true), 1500)
    let entranceTimer: ReturnType<typeof setTimeout>
    const stopTimers: ReturnType<typeof setTimeout>[] = []

    const applyReel = (i: number) => {
      const ref = reelRefs.current[i]
      if (!ref) return
      ref.style.transform = `translateY(${-(positions.current[i] % 10)}em)`
    }

    // Apply initial positions (shows FAST_END digits before animation starts)
    for (let i = 0; i < NUM_REELS; i++) applyReel(i)

    const scheduleStop = (i: number, delay: number) => {
      stopTimers.push(setTimeout(() => {
        const pos = positions.current[i]
        const td = TARGET_DIGIT_VALUES[i]
        let target = Math.floor(pos / 10) * 10 + td
        if (target - pos < 0.5) target += 10
        stopTarget.current[i] = target
        stopStartTime.current[i] = performance.now()
        stopStartPos.current[i] = pos
        rPhases.current[i] = 'stopping'
      }, delay))
    }

    const startSlow = () => {
      const tick = () => {
        const prev = slowCountRef.current
        const next = Math.min(prev + (Math.floor(Math.random() * 3) + 1) * 3, CAP)
        slowCountRef.current = next

        const prevDigits = getDigitValues(prev)
        const nextDigits = getDigitValues(next)

        for (let i = 0; i < NUM_REELS; i++) {
          if (nextDigits[i] !== prevDigits[i]) {
            const pos = positions.current[i]
            const td = nextDigits[i]
            let target = Math.floor(pos / 10) * 10 + td
            if (target - pos < 0.1) target += 10
            slowMoveTarget.current[i] = target
            slowMoveStartTime.current[i] = performance.now()
            slowMoveStartPos.current[i] = pos
            rPhases.current[i] = 'slow-moving'
          }
        }

        if (next >= CAP) clearInterval(tickRef.current)
      }

      tick()
      tickRef.current = setInterval(tick, 1100)
    }

    const loop = (now: number) => {
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
        } else if (rp === 'slow-moving') {
          const elapsed = now - slowMoveStartTime.current[i]
          const t = Math.min(elapsed / SLOW_MOVE_DURATION, 1)
          positions.current[i] = slowMoveStartPos.current[i] +
            (slowMoveTarget.current[i] - slowMoveStartPos.current[i]) * easeOut(t)
          if (t >= 1) {
            positions.current[i] = slowMoveTarget.current[i] % 10
            rPhases.current[i] = 'idle'
          }
        }

        applyReel(i)
      }

      if (revealComplete && !slowStartedRef.current) {
        slowStartedRef.current = true
        startSlow()
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || startedRef.current) return
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
    }, { threshold: 0 })

    observer.observe(el)
    return () => {
      observer.disconnect()
      clearTimeout(revealFallback)
      clearTimeout(entranceTimer)
      cancelAnimationFrame(rafRef.current)
      clearInterval(tickRef.current)
      stopTimers.forEach(clearTimeout)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-24 px-6 sm:px-10 lg:px-12"
      style={{ background: 'var(--forest)' }}
    >
      <div className="max-w-3xl mx-auto text-center">

        <div style={{
          transform: visible ? 'translateY(0)' : 'translateY(28px)',
          opacity: visible ? 1 : 0,
          transition: `transform 0.7s ${SPRING}, opacity 0.55s ease`,
        }}>
          <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-4" style={{ color: 'rgba(168,224,99,0.7)' }}>
            Altid Energi · Dokumenteret besparelse
          </p>
          <h2 className="font-extrabold leading-tight tracking-tight mb-8 text-white" style={{ fontSize: 'clamp(22px, 3vw, 36px)' }}>
            Vores Altid Energi-kunder har allerede sparet
          </h2>
        </div>

        <div style={{
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(36px) scale(0.94)',
          opacity: visible ? 1 : 0,
          transition: `transform 0.85s ${SPRING} 0.12s, opacity 0.55s ease 0.12s`,
        }}>
          <div
            className="inline-flex items-center px-8 py-5 rounded-2xl mb-8 font-extrabold tabular-nums"
            style={{
              background: 'var(--accent-yellow)',
              fontSize: 'clamp(36px, 6vw, 68px)',
              color: 'var(--forest)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            {TARGET_CHARS.map((c, ci) => {
              const ri = REEL_FOR_CHAR[ci]
              if (ri !== null) {
                return <Reel key={ci} setRef={el => { reelRefs.current[ri] = el }} />
              }
              return <span key={ci}>{c}</span>
            })}
            <span style={{ marginLeft: '0.3em' }}>DKK</span>
          </div>
        </div>

        <div style={{
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          opacity: visible ? 1 : 0,
          transition: `transform 0.7s ${SPRING} 0.25s, opacity 0.55s ease 0.25s`,
        }}>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)', maxWidth: 440, margin: '0 auto' }}>
            Baseret på kunder hos Altid Energi. Med Altid Hjem får du samme gennemsigtighed på strøm, mobil og forsikring — og mange sparer langt over 1.000 kr. årligt.
          </p>
        </div>

      </div>
    </section>
  )
}
