'use client'

import { useEffect, useRef, useState } from 'react'

const CAP = 5_309_132
const FAST_START = 5_000_000
const FAST_END = 5_280_000
const FAST_DURATION = 3000
const SPRING = 'cubic-bezier(0.34, 1.2, 0.64, 1)'

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function fmt(n: number) {
  return n.toLocaleString('da-DK')
}

function CharSlot({ from, to, rolling, duration = `0.85s ${SPRING}` }: {
  from: string; to: string; rolling: boolean; duration?: string
}) {
  const animates = rolling && from !== to
  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', height: '1em', verticalAlign: 'middle' }}>
      <span style={{
        display: 'flex',
        flexDirection: 'column',
        transform: animates ? 'translateY(-50%)' : 'translateY(0%)',
        transition: animates ? `transform ${duration}` : 'none',
      }}>
        <span style={{ height: '1em', display: 'flex', alignItems: 'center' }}>{from}</span>
        <span style={{ height: '1em', display: 'flex', alignItems: 'center' }}>{to}</span>
      </span>
    </span>
  )
}

export default function SavingsCounter() {
  const [count, setCount] = useState(FAST_START)
  const [prevCount, setPrevCount] = useState(FAST_START)
  const [rolling, setRolling] = useState(false)
  const [phase, setPhase] = useState<'waiting' | 'fast' | 'slow'>('waiting')
  const [visible, setVisible] = useState(false)

  const sectionRef = useRef<HTMLDivElement>(null)
  const startedRef = useRef(false)
  const rafRef = useRef<number>(0)
  const tickRef = useRef<ReturnType<typeof setInterval>>(undefined)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const slowCountRef = useRef(FAST_END)
  const lastFrameRef = useRef(0)

  useEffect(() => {
    // Reset so React Strict Mode's double-mount doesn't permanently block the animation
    startedRef.current = false

    const el = sectionRef.current
    if (!el) return

    // Fallback: always reveal content after 1.5s regardless of IntersectionObserver
    const revealFallback = setTimeout(() => setVisible(true), 1500)

    let entranceTimer: ReturnType<typeof setTimeout>

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return
        startedRef.current = true
        setVisible(true)

        // Let entrance animation settle before counting
        entranceTimer = setTimeout(() => {
          setPhase('fast')
          const startTime = performance.now()
          let prevFastVal = FAST_START

          const frame = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / FAST_DURATION, 1)

            // Throttle DOM writes to ~30fps so digits stay readable
            if (now - lastFrameRef.current >= 33 || progress === 1) {
              lastFrameRef.current = now
              const val = Math.round(FAST_START + (FAST_END - FAST_START) * easeOut(progress))
              setPrevCount(prevFastVal)
              setCount(val)
              setRolling(true)
              prevFastVal = val
            }

            if (progress < 1) {
              rafRef.current = requestAnimationFrame(frame)
            } else {
              slowCountRef.current = FAST_END

              const startSlow = () => {
                setPhase('slow')
                tickRef.current = setInterval(() => {
                  const prev = slowCountRef.current
                  const next = Math.min(prev + Math.floor(Math.random() * 3) + 1, CAP)
                  slowCountRef.current = next

                  setPrevCount(prev)
                  setCount(next)
                  setRolling(true)

                  clearTimeout(resetTimerRef.current)
                  resetTimerRef.current = setTimeout(() => {
                    setRolling(false)
                    setPrevCount(slowCountRef.current)
                  }, 950)

                  if (next >= CAP) clearInterval(tickRef.current)
                }, 1500)
              }

              // Bridge: decelerate with exponentially growing delays before handing off to slow phase
              const bridge = (delay: number, increment: number) => {
                if (delay >= 1500) { startSlow(); return }
                resetTimerRef.current = setTimeout(() => {
                  const prev = slowCountRef.current
                  const next = Math.min(prev + increment, CAP)
                  slowCountRef.current = next
                  setCount(next)
                  setPrevCount(next)
                  if (next >= CAP) { startSlow(); return }
                  bridge(delay * 2.3, Math.max(Math.round(increment * 0.7), 1))
                }, delay)
              }

              bridge(60, 30)
            }
          }

          rafRef.current = requestAnimationFrame(frame)
        }, 400)
      },
      { threshold: 0 }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      clearTimeout(revealFallback)
      clearTimeout(entranceTimer)
      cancelAnimationFrame(rafRef.current)
      clearInterval(tickRef.current)
      clearTimeout(resetTimerRef.current)
    }
  }, [])

  const prevStr = fmt(prevCount)
  const currStr = fmt(count)

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
            {currStr.split('').map((char, i) => (
              <CharSlot
                key={i}
                from={prevStr[i] ?? char}
                to={char}
                rolling={rolling}
                duration={phase === 'fast' ? '0.025s linear' : `0.85s ${SPRING}`}
              />
            ))}
            <span style={{ marginLeft: '0.3em' }}>DKK</span>
          </div>
        </div>

        <div style={{
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          opacity: visible ? 1 : 0,
          transition: `transform 0.7s ${SPRING} 0.25s, opacity 0.55s ease 0.25s`,
        }}>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)', maxWidth: 440, margin: '0 auto' }}>
            Besparelsen er opgjort blandt kunder hos Altid Energi — vores søsterprodukt. Med Altid Hjem får du den samme gennemsigtighed på tværs af strøm, mobil og forsikring.
            <br />
            <span className="block mt-1">Visse kunder sparer langt over 1.000 kr. årligt.</span>
          </p>
        </div>

      </div>
    </section>
  )
}
