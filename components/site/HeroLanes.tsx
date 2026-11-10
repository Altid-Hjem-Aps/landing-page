'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { HERO } from './copy'
import { useMotionPiece } from './MotionPrefs'

// One story at a time, on a timer: three paper bills slide in from the left, one after another,
// and go into the phones; the app's assistant then comes out on the right, clear of the phones,
// with a notification about the first bill and an action. It stays a moment, the action is
// tapped, the notification turns into what was done, and it leaves before the next bills come.
// It stops with the pause button and off screen; with reduced motion the first notification
// simply rests in its done state. Sample data and wording in copy.ts (HERO.lanes).

type Phase = 'bill' | 'note' | 'tap' | 'done' | 'leave'

// How long each phase lasts, in ms.
// The bills phase ends as the last bill goes into the phones (0.7 s apart, 3.4 s each).
const TIMES: Record<Phase, number> = { bill: 4500, note: 2800, tap: 600, done: 2600, leave: 900 }
const NEXT: Record<Phase, Phase> = { bill: 'note', note: 'tap', tap: 'done', done: 'leave', leave: 'bill' }

function Bill({ index }: { index: number }) {
  const bill = HERO.lanes[index].bill
  return (
    <div className="hl-paper">
      <span className="hl-paper-top">
        {bill.mail ? <span className="hl-mail">Mail</span> : <span />}
        <span>{bill.date}</span>
      </span>
      <span className="hl-faktura">Faktura</span>
      <b>{bill.title}</b>
      <small>{bill.from}</small>
      <span className="hl-lines" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="hl-paper-foot">
        <span>Pr. måned</span>
        <b>{bill.amount}</b>
      </span>
    </div>
  )
}

function Note({ index, phase }: { index: number; phase: Phase }) {
  const lane = HERO.lanes[index]
  const done = phase === 'done' || phase === 'leave'
  return (
    <div className="hl-note" data-done={done ? 'true' : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/app-badge.png" alt="" width={36} height={36} />
      <span className="hl-text">
        <span className="hl-note-top">
          <b>Altid Hjem</b>
          <small>nu</small>
        </span>
        <span className="hl-note-body">{done ? lane.done : lane.note}</span>
        {done ? (
          <span className="hl-done">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Klaret
          </span>
        ) : (
          <span className="hl-actions">
            <span className="hl-action" data-pressed={phase === 'tap' ? 'true' : undefined}>
              {lane.action}
            </span>
            <span className="hl-action hl-action-quiet">Senere</span>
          </span>
        )}
      </span>
    </div>
  )
}

export default function HeroLanes() {
  const { ref, running } = useMotionPiece<HTMLDivElement>()
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('bill')

  useEffect(() => {
    if (!running) return
    const timer = window.setTimeout(() => {
      if (phase === 'leave') setIndex((i) => (i + 1) % HERO.lanes.length)
      setPhase(NEXT[phase])
    }, TIMES[phase])
    return () => window.clearTimeout(timer)
  }, [running, phase])

  // Paused or reduced motion before it ever ran: show the first notification, done.
  const still = !running && phase === 'bill' && index === 0
  const shown: Phase = still ? 'done' : phase

  return (
    <div ref={ref} className="h-lanes" data-running={running ? 'true' : 'false'} aria-hidden="true">
      {shown === 'bill'
        ? // Three bills go in, one after another; the note is about the first.
          [0, 1, 2].map((k) => (
            <div key={`bill-${index}-${k}`} className="hl-bill-fly" style={{ '--k': k } as CSSProperties}>
              <Bill index={(index + k) % HERO.lanes.length} />
            </div>
          ))
        : null}
      {shown !== 'bill' ? (
        <div key={`note-${index}`} className="hl-note-fly" data-phase={shown}>
          <Note index={index} phase={shown} />
        </div>
      ) : null}
    </div>
  )
}
