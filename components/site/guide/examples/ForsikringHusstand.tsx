'use client'

import { useEffect, useRef, useState } from 'react'
import { useMotionPrefs } from '@/components/site/MotionPrefs'

// The household's insurances as one overview, member by member: the illustration from the old
// /hvad-koster-forsikring (components/ForsikringHusstandMockup.tsx), in the new site's type and
// colours. It says the same and no more: no amounts, no assistant, no clean-up. The reader
// spots for themselves that Indbo appears twice. An illustration, never a phone: the guide
// draws it under the label "Eksempel".
//
// It runs by the page's one motion state (MotionPrefs): only while at least 30 % of it is on
// screen, the tab is visible and nobody pressed pause. With reduced motion, and before the
// page's script has run, it shows the finished card.

// How long each step holds: the empty card, Dig, Marie, Lukas, the closing line.
const HOLD = [900, 1300, 1300, 1300, 8000]
const LAST = HOLD.length - 1
const IN_VIEW = 0.3

const MEMBERS = [
  { name: 'Dig', role: 'voksen', tone: 'honey', child: false, covers: ['Indbo', 'Rejse', 'Ulykke'] },
  { name: 'Marie', role: 'voksen', tone: 'sky', child: false, covers: ['Indbo', 'Rejse', 'Ulykke'] },
  { name: 'Lukas', role: 'barn', tone: 'mint', child: true, covers: ['Børneulykke'] },
] as const

const COVER_COUNT = MEMBERS.reduce((n, m) => n + m.covers.length, 0)

function PersonIcon({ child }: { child: boolean }) {
  const s = child ? 17 : 21
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy={child ? 9 : 8} r={child ? 3.1 : 4} />
      <path d={child ? 'M6.5 19c0-3 2.5-5.2 5.5-5.2s5.5 2.2 5.5 5.2Z' : 'M3.5 20.5c0-4 3.8-7 8.5-7s8.5 3 8.5 7Z'} />
    </svg>
  )
}

export default function ForsikringHusstand() {
  const { paused, reduced, hidden, countOnScreen } = useMotionPrefs()
  const card = useRef<HTMLDivElement>(null)
  const [onScreen, setOnScreen] = useState(false)
  // null until the page's script has run: the finished card.
  const [step, setStep] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1]
        // The reported ratio can sit a rounding hair under the threshold as it is crossed.
        setOnScreen(entry.isIntersecting && entry.intersectionRatio >= IN_VIEW - 0.01)
        // The observer's first report comes right after hydration, normally with the card far
        // below the fold: that is when it empties, so the story starts when it is scrolled to.
        setStep((s) => s ?? 0)
      },
      { threshold: [0, IN_VIEW] },
    )
    observer.observe(card.current as HTMLDivElement)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!onScreen) return
    countOnScreen(1)
    return () => countOnScreen(-1)
  }, [onScreen, countOnScreen])

  const running = onScreen && !paused && !reduced && !hidden && step !== null
  useEffect(() => {
    if (!running) return
    const timer = setTimeout(() => setStep((s) => ((s as number) + 1) % HOLD.length), HOLD[step as number])
    return () => clearTimeout(timer)
  }, [running, step])

  const shown = reduced || step === null ? LAST : step

  return (
    <div
      ref={card}
      className="gx"
      role="img"
      // The wrap back to the empty card snaps instead of fading out row by row.
      data-snap={shown === 0 ? 'true' : undefined}
      aria-label="Eksempel: husstandens forsikringer samlet i ét overblik. Du og Marie har indbo, rejse og ulykke, og Lukas har børneulykke."
    >
      <p className="gx-title">Min husstand</p>
      <p className="gx-sub">
        3 medlemmer · {COVER_COUNT} forsikringer
      </p>
      <div className="gx-rows">
        {MEMBERS.map((member, i) => (
          <div key={member.name} className="gx-row" data-on={shown > i ? 'true' : undefined}>
            <span className="gx-face" data-tone={member.tone}>
              <PersonIcon child={member.child} />
            </span>
            <div>
              <p className="gx-name">
                {member.name}
                <span> · {member.role}</span>
              </p>
              <p className="gx-chips">
                {member.covers.map((cover) => (
                  <span key={cover}>{cover}</span>
                ))}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="gx-done" data-on={shown === LAST ? 'true' : undefined}>
        <p className="gx-eyebrow">Ét overblik</p>
        <p className="gx-line">Alle forsikringer ét sted</p>
        <p className="gx-small">Se, hvem der har hvilken forsikring</p>
      </div>
    </div>
  )
}
