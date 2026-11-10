'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { OKONOMI } from './copy'
import { useMotionPiece, useMotionPrefs } from './MotionPrefs'

// The app's front page, large: what is left until payday, one bar per day, the days gone in
// green, today in white and the rest as outlines down to payday, with the dashed line of an
// even pace. Mine and Fælles take turns, as the switch in the app does; a click picks one.
// The numbers and the two messages are the sample data in the captures (hjem-top, hjem-faelles).
const DAYS = 30
const SWITCH_MS = 5000
const COUNT_MS = 900
const format = new Intl.NumberFormat('da-DK')

const even = (i: number) => 1 - (i / (DAYS - 1)) * 0.9

function bars(today: number, ahead: number) {
  const now = Math.min(1, even(today) + ahead)
  return Array.from({ length: DAYS }, (_, i) => {
    if (i <= today) return Math.min(1, even(i) + ahead * (i / today))
    return now - (now - 0.05) * ((i - today) / (DAYS - 1 - today))
  })
}

const VIEWS = OKONOMI.pace.views.map((view) => ({ ...view, bars: bars(view.today, view.ahead) }))

export default function PaydayPace() {
  const { ref, running } = useMotionPiece<HTMLDivElement>()
  const { reduced } = useMotionPrefs()
  const [view, setView] = useState(0)
  const [picked, setPicked] = useState(false)
  const [shown, setShown] = useState(false)
  const [amount, setAmount] = useState(0)
  const from = useRef(0)

  // The bars grow the first time the block is on screen; with reduced motion they are just there.
  useEffect(() => {
    if (running || reduced) setShown(true)
  }, [running, reduced])

  useEffect(() => {
    if (!running || picked) return
    const timer = window.setInterval(() => setView((v) => (v + 1) % VIEWS.length), SWITCH_MS)
    return () => window.clearInterval(timer)
  }, [running, picked])

  // The amount counts to its new value, as the bars move.
  useEffect(() => {
    if (!shown) return
    const target = VIEWS[view].amount
    if (reduced) {
      from.current = target
      setAmount(target)
      return
    }
    const start = performance.now()
    const begin = from.current
    let frame = requestAnimationFrame(function step(now) {
      const t = Math.min(1, (now - start) / COUNT_MS)
      const value = Math.round(begin + (target - begin) * (1 - (1 - t) ** 3))
      from.current = value
      setAmount(value)
      if (t < 1) frame = requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(frame)
  }, [view, shown, reduced])

  const current = VIEWS[view]
  const pill = { '--x': (current.today + 0.5) / DAYS, '--h': shown ? current.bars[current.today] : 0 } as CSSProperties

  return (
    <div ref={ref} className="pp" data-staged="true">
      <div className="pp-switch" role="group" aria-label={OKONOMI.pace.switchLabel}>
        {VIEWS.map((v, i) => (
          <button
            key={v.label}
            type="button"
            aria-pressed={i === view}
            onClick={() => {
              setPicked(true)
              setView(i)
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
      <p className="pp-amount">
        <span className="pp-number">{format.format(amount)} kr.</span> <span className="pp-left">{OKONOMI.pace.left}</span>
      </p>
      <p className="sr-only">{current.summary}</p>
      <div className="pp-chart" aria-hidden="true">
        <div className="pp-bars">
          {current.bars.map((h, i) => (
            <span
              key={i}
              className="pp-bar"
              data-kind={i < current.today ? 'past' : i === current.today ? 'today' : 'future'}
              style={{ '--h': shown ? h : 0.03, '--i': i } as CSSProperties}
            />
          ))}
          <svg className="pp-even" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1={(1 - even(0)) * 100} x2="100" y2={(1 - even(DAYS - 1)) * 100} vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="pp-pill" style={pill}>
            {OKONOMI.pace.ahead}
          </span>
        </div>
        <div className="pp-payday">
          <span>{OKONOMI.pace.payday}</span>
          <span className="pp-coins" />
        </div>
      </div>
      <div className="pp-note-row" aria-hidden="true">
        <span className="pp-app" />
        {VIEWS.map((v, i) => (
          <p key={v.label} className="pp-note" data-shown={shown && i === view ? 'true' : undefined}>
            {v.note}
          </p>
        ))}
      </div>
    </div>
  )
}
