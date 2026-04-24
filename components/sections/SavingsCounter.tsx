'use client'

import { useEffect, useRef, useState } from 'react'

const CAP = 5_309_132
const FAST_END = 5_280_000
const FAST_DURATION = 780   // ms of spinning before reveal starts
const FAST_SPEED = 0.5      // digit positions per rAF frame (~30 digits/sec at 60fps)
const STOP_DURATION = 320   // ms for each reel to ease to its target digit
const STOP_STAGGER = 240    // ms between consecutive reel stops (left → right)
const SPRING = 'cubic-bezier(0.34, 1.2, 0.64, 1)'

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function fmt(n: number) {
  return n.toLocaleString('da-DK')
}

// Pre-compute structure from FAST_END so it's stable across renders
const TARGET_STR = fmt(FAST_END)          // e.g. "5.280.000"
const TARGET_CHARS = TARGET_STR.split('')
let _ri = 0
const REEL_FOR_CHAR = TARGET_CHARS.map(c => (/\d/.test(c) ? _ri++ : null))
const NUM_REELS = _ri
const TARGET_DIGIT_VALUES = TARGET_CHARS.filter(c => /\d/.test(c)).map(Number)

// Reel: a 20-digit column (0-9 twice) scrolled via direct DOM transform at 60fps.
// The two-cycle layout means the 9→0 wrap is always seamless — position % 10
// always lands within the visible 20em range.
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

// Used only during slow phase
function CharSlot({ from, to, rolling }: { from: string; to: string; rolling: boolean }) {
  const animates = rolling && from !== to
  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', height: '1em', verticalAlign: 'middle' }}>
      <span style={{
        display: 'flex',
        flexDirection: 'column',
        transform: animates ? 'translateY(-50%)' : 'translateY(0%)',
        transition: animates ? `transform 0.85s ${SPRING}` : 'none',
      }}>
        <span style={{ height: '1em', display: 'flex', alignItems: 'center' }}>{from}</span>
        <span style={{ height: '1em', display: 'flex', alignItems: 'center' }}>{to}</span>
      </span>
    </span>
  )
}

export default function SavingsCounter() {
  const [visible, setVisible] = useState(false)
  const [phase, setPhase] = useState<'waiting' | 'spinning' | 'slow'>('waiting')

  // Slow-phase display state
  const [slowCount, setSlowCount] = useState(FAST_END)
  const [prevSlowCount, setPrevSlowCount] = useState(FAST_END)
  const [slowRolling, setSlowRolling] = useState(false)

  const sectionRef = useRef<HTMLDivElement>(null)
  const startedRef = useRef(false)
  const rafRef = useRef<number>(0)
  const tickRef = useRef<ReturnType<typeof setInterval>>(undefined)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const slowCountRef = useRef(FAST_END)

  // Inner span refs for each reel — updated directly in the rAF loop
  const reelRefs = useRef<(HTMLSpanElement | null)[]>(Array(NUM_REELS).fill(null))

  // All animation state lives in refs (no React re-renders during rAF loop)
  const positions = useRef<number[]>(Array(NUM_REELS).fill(0))
  type RPhase = 'spinning' | 'stopping' | 'stopped'
  const rPhases = useRef<RPhase[]>(Array(NUM_REELS).fill('spinning' as RPhase))
  const stopTarget = useRef<number[]>(Array(NUM_REELS).fill(0))
  const stopStartTime = useRef<number[]>(Array(NUM_REELS).fill(0))
  const stopStartPos = useRef<number[]>(Array(NUM_REELS).fill(0))

  useEffect(() => {
    startedRef.current = false
    const el = sectionRef.current
    if (!el) return

    const revealFallback = setTimeout(() => setVisible(true), 1500)
    let entranceTimer: ReturnType<typeof setTimeout>
    const stopTimers: ReturnType<typeof setTimeout>[] = []

    const applyReel = (i: number) => {
      const ref = reelRefs.current[i]
      if (!ref) return
      // pos % 10 maps any accumulated position into the 20-digit column seamlessly
      ref.style.transform = `translateY(${-(positions.current[i] % 10)}em)`
    }

    const scheduleStop = (i: number, delay: number) => {
      stopTimers.push(setTimeout(() => {
        const pos = positions.current[i]
        const td = TARGET_DIGIT_VALUES[i]
        // Find the next occurrence of td that is at least 0.5 ahead of current pos
        let target = Math.floor(pos / 10) * 10 + td
        if (target - pos < 0.5) target += 10
        stopTarget.current[i] = target
        stopStartTime.current[i] = performance.now()
        stopStartPos.current[i] = pos
        rPhases.current[i] = 'stopping'
      }, delay))
    }

    const startSlow = () => {
      setPhase('slow')

      const tick = () => {
        const prev = slowCountRef.current
        const next = Math.min(prev + Math.floor(Math.random() * 3) + 1, CAP)
        slowCountRef.current = next
        setPrevSlowCount(prev)
        setSlowCount(next)
        setSlowRolling(true)
        clearTimeout(resetTimerRef.current)
        resetTimerRef.current = setTimeout(() => {
          setSlowRolling(false)
          setPrevSlowCount(slowCountRef.current)
        }, 950)
        if (next >= CAP) clearInterval(tickRef.current)
      }

      tick() // fire immediately so there's no dead wait after reels stop
      tickRef.current = setInterval(tick, 1500)
    }

    const loop = (now: number) => {
      let allStopped = true

      for (let i = 0; i < NUM_REELS; i++) {
        const rp = rPhases.current[i]

        if (rp === 'spinning') {
          allStopped = false
          positions.current[i] += FAST_SPEED
          // Keep position in [0, 10) during spin so stop-target math stays simple
          if (positions.current[i] >= 10) positions.current[i] -= 10
        } else if (rp === 'stopping') {
          allStopped = false
          const elapsed = now - stopStartTime.current[i]
          const t = Math.min(elapsed / STOP_DURATION, 1)
          positions.current[i] = stopStartPos.current[i] +
            (stopTarget.current[i] - stopStartPos.current[i]) * easeOut(t)
          if (t >= 1) {
            positions.current[i] = stopTarget.current[i]
            rPhases.current[i] = 'stopped'
          }
        }
        // 'stopped': no position update

        applyReel(i)
      }

      if (allStopped) {
        startSlow()
        return // don't request another frame
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || startedRef.current) return
      startedRef.current = true
      setVisible(true)

      entranceTimer = setTimeout(() => {
        // Reset all reels
        for (let i = 0; i < NUM_REELS; i++) {
          positions.current[i] = 0
          rPhases.current[i] = 'spinning'
          applyReel(i)
        }
        setPhase('spinning')
        rafRef.current = requestAnimationFrame(loop)

        // After fast spin, stagger-stop each reel left → right
        stopTimers.push(setTimeout(() => {
          for (let i = 0; i < NUM_REELS; i++) {
            scheduleStop(i, i * STOP_STAGGER)
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
      clearTimeout(resetTimerRef.current)
      stopTimers.forEach(clearTimeout)
    }
  }, [])

  const prevStr = fmt(prevSlowCount)
  const currStr = fmt(slowCount)

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
            Dokumenteret besparelse
          </p>
          <h2 className="font-extrabold leading-tight tracking-tight mb-8 text-white" style={{ fontSize: 'clamp(22px, 3vw, 36px)' }}>
            Vores Altid Energi kunder har allerede sparet
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
            {phase === 'slow' ? (
              currStr.split('').map((char, i) => (
                <CharSlot key={i} from={prevStr[i] ?? char} to={char} rolling={slowRolling} />
              ))
            ) : (
              TARGET_CHARS.map((c, ci) => {
                const ri = REEL_FOR_CHAR[ci]
                if (ri !== null) {
                  return <Reel key={ci} setRef={el => { reelRefs.current[ri] = el }} />
                }
                return <span key={ci}>{c}</span>
              })
            )}
            <span style={{ marginLeft: '0.3em' }}>DKK</span>
          </div>
        </div>

        <div style={{
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          opacity: visible ? 1 : 0,
          transition: `transform 0.7s ${SPRING} 0.25s, opacity 0.55s ease 0.25s`,
        }}>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)', maxWidth: 440, margin: '0 auto' }}>
            Besparelsen er opgjort blandt kunder hos os i Altid Energi. Med Altid Hjem får du den samme gennemsigtighed på tværs af strøm, mobil og forsikring.
            <br />
            <span className="block mt-1">Visse kunder sparer langt over 1.000 kr. årligt.</span>
          </p>
        </div>

      </div>
    </section>
  )
}
