'use client'

import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react'

/**
 * Animeret app-UI-kort (uden telefon-ramme) til forsikring-siden.
 * Topbaren er "Altid Assistent", der arbejder. Loop (afspilles én gang, når
 * kortet er rullet ind i billedet):
 *   1. detect  — finder 2 MULIGE dobbeltdækninger (highlighter Indbo + Rejse,
 *      som begge dækker hele husstanden)
 *   2-3. rm-*  — fjerner Maries dobbelte HUSSTANDS-dækninger én ad gangen.
 *      Ulykkesforsikring er PERSONLIG og beholdes på begge voksne — det er
 *      faktuelt korrekt og viser, at assistenten kender forskellen.
 *   4. done    — "Færdig – husstanden er optimeret"
 *   5. total   — kvittering + årlig besparelse (tæller op)
 * Tidsstyret via setTimeout (ikke rAF), så den også kører i headless preview.
 */

type Phase = 'detect' | 'rm-indbo' | 'rm-rejse' | 'done' | 'total'

const SEQ: { p: Phase; ms: number }[] = [
  { p: 'detect', ms: 3000 },
  { p: 'rm-indbo', ms: 2100 },
  { p: 'rm-rejse', ms: 2100 },
  { p: 'done', ms: 2400 },
  { p: 'total', ms: 7000 },
]

// Kun husstands-dækninger kan være dobbelte. Ulykke er personlig → aldrig highlightet.
const OVERLAP = ['Indbo', 'Rejse']
const AMOUNT: Record<string, number> = { Indbo: 150, Rejse: 50 }

const REMOVED: Record<Phase, string[]> = {
  detect: [],
  'rm-indbo': ['Indbo'],
  'rm-rejse': ['Indbo', 'Rejse'],
  done: ['Indbo', 'Rejse'],
  total: ['Indbo', 'Rejse'],
}
const JUST_ADDED: Record<Phase, number | null> = {
  detect: null,
  'rm-indbo': AMOUNT.Indbo,
  'rm-rejse': AMOUNT.Rejse,
  done: null,
  total: null,
}
const STATUS: Record<Phase, string> = {
  detect: 'Fandt 2 mulige dobbeltdækninger',
  'rm-indbo': 'Fjerner dobbelt indboforsikring',
  'rm-rejse': 'Fjerner dobbelt rejseforsikring',
  done: 'Færdig – husstanden er optimeret',
  total: 'Færdig – husstanden er optimeret',
}

const BILL_ITEMS = [
  { label: 'Dobbelt indboforsikring', amt: AMOUNT.Indbo },
  { label: 'Dobbelt rejseforsikring', amt: AMOUNT.Rejse },
]
const TOTAL_MONTH = BILL_ITEMS.reduce((s, i) => s + i.amt, 0)
const TOTAL_YEAR_NUM = TOTAL_MONTH * 12
// Trin i kvitteringens afsløring: hver linje + total-rækken + årskortet.
const REVEAL_MAX = BILL_ITEMS.length + 2

type Member = { name: string; role: 'adult' | 'child'; covers: string[]; childNote?: string }
const MEMBERS: Member[] = [
  { name: 'Dig', role: 'adult', covers: ['Indbo', 'Rejse', 'Ulykke'] },
  { name: 'Marie', role: 'adult', covers: ['Indbo', 'Rejse', 'Ulykke'] },
  { name: 'Lukas', role: 'child', covers: [], childNote: 'Dækket af husstandens indbo' },
]
// Maries dobbelte husstands-dækninger ryddes op; hendes personlige ulykke beholdes.
const MARIE_REMOVABLE = ['Indbo', 'Rejse']

function PersonIcon({ child = false }: { child?: boolean }) {
  const s = child ? 15 : 19
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy={child ? 9 : 8} r={child ? 3.1 : 4} fill="var(--forest)" />
      <path d={child ? 'M6.5 19c0-3 2.5-5.2 5.5-5.2s5.5 2.2 5.5 5.2Z' : 'M3.5 20.5c0-4 3.8-7 8.5-7s8.5 3 8.5 7Z'} fill="var(--forest)" />
    </svg>
  )
}

function Tag({ label, hot }: { label: string; hot?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full"
      style={{
        fontSize: 9,
        padding: '2px 7px',
        background: hot ? 'var(--sage)' : 'rgba(26,61,34,0.06)',
        color: hot ? 'var(--forest)' : 'rgba(26,61,34,0.6)',
        fontWeight: hot ? 700 : 400,
        border: hot ? '1px solid rgba(26,61,34,0.25)' : '1px solid transparent',
        boxShadow: hot ? '0 0 0 3px rgba(168,224,99,0.25)' : 'none',
        transition: 'background 0.4s ease, box-shadow 0.4s ease, color 0.4s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {hot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--forest)' }} />}
      {label}
    </span>
  )
}

function AssistantBar({ phase }: { phase: Phase }) {
  const working = phase !== 'total' && phase !== 'done'
  return (
    <div className="flex items-center gap-2.5 rounded-2xl mb-3" style={{ background: 'var(--forest)', padding: '10px 12px' }}>
      <span className="shrink-0 flex items-center justify-center rounded-full" style={{ width: 26, height: 26, background: 'var(--sage)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2z" fill="var(--forest)" />
          <circle cx="18.5" cy="17.5" r="2" fill="var(--forest)" />
        </svg>
      </span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Altid Assistent</p>
        <p style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.72)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {STATUS[phase]}
          {working ? ' …' : ''}
        </p>
      </div>
      {working ? (
        <span className="shrink-0 animate-spin" style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
      ) : (
        <span className="shrink-0 flex items-center justify-center rounded-full" style={{ width: 16, height: 16, background: 'var(--sage)', color: 'var(--forest)', fontSize: 10, fontWeight: 800 }}>✓</span>
      )}
    </div>
  )
}

function Bill({ reveal, instant }: { reveal: number; instant: boolean }) {
  const [year, setYear] = useState(0)
  const yearlyShown = reveal > BILL_ITEMS.length + 1
  useEffect(() => {
    if (!yearlyShown) {
      setYear(0)
      return
    }
    if (instant) {
      setYear(TOTAL_YEAR_NUM)
      return
    }
    const steps = 34
    let i = 0
    const id = setInterval(() => {
      i += 1
      setYear(i >= steps ? TOTAL_YEAR_NUM : Math.round((TOTAL_YEAR_NUM * i) / steps))
      if (i >= steps) clearInterval(id)
    }, 35)
    return () => clearInterval(id)
  }, [yearlyShown, instant])

  const Row = ({ show, children, style }: { show: boolean; children: ReactNode; style?: CSSProperties }) => (
    <div className="flex items-center justify-between" style={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(6px)', transition: 'opacity 0.4s ease, transform 0.4s ease', ...style }}>
      {children}
    </div>
  )

  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, marginBottom: 8 }}>Det ryddede vi op</p>
      <div className="flex flex-col gap-2">
        {BILL_ITEMS.map((it, i) => (
          <Row key={it.label} show={reveal > i}>
            <span style={{ fontSize: 10.5, color: 'rgba(26,61,34,0.7)' }}>
              <span style={{ color: 'var(--forest)', fontWeight: 700, marginRight: 4 }}>✕</span>
              {it.label}
            </span>
            <span style={{ fontSize: 10.5, textDecoration: 'line-through', color: 'rgba(26,61,34,0.4)' }}>{it.amt} kr./md.</span>
          </Row>
        ))}
      </div>

      <div style={{ borderTop: '1px dashed rgba(26,61,34,0.25)', margin: '10px 0', opacity: reveal > BILL_ITEMS.length ? 1 : 0, transition: 'opacity 0.4s ease' }} />

      <Row show={reveal > BILL_ITEMS.length}>
        <span style={{ fontSize: 11, fontWeight: 700 }}>I sparer</span>
        <span style={{ fontSize: 13, fontWeight: 800 }}>{TOTAL_MONTH} kr./md.</span>
      </Row>

      <div
        className="rounded-2xl text-center"
        style={{
          marginTop: 12,
          padding: '12px 10px',
          background: 'var(--sage)',
          opacity: yearlyShown ? 1 : 0,
          transform: yearlyShown ? 'scale(1)' : 'scale(0.96)',
          transition: 'opacity 0.45s ease, transform 0.45s ease',
        }}
      >
        <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(26,61,34,0.7)' }}>I sparer nu</p>
        <p style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.1, color: 'var(--forest)' }}>{year.toLocaleString('da-DK')} kr.</p>
        <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(26,61,34,0.7)' }}>om året (estimeret)</p>
      </div>
    </div>
  )
}

export default function ForsikringHusstandMockup() {
  const [idx, setIdx] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [reveal, setReveal] = useState(0)
  const [started, setStarted] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true)
      setIdx(SEQ.length - 1)
    }
  }, [])

  // Start først, når kortet er rullet ind i billedet — og kun én gang.
  useEffect(() => {
    const el = cardRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setStarted(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          obs.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Afspil sekvensen én gang; stop på den sidste fase (kvitteringen).
  useEffect(() => {
    if (reduced || !started || idx >= SEQ.length - 1) return
    const t = setTimeout(() => setIdx((v) => v + 1), SEQ[idx].ms)
    return () => clearTimeout(t)
  }, [idx, started, reduced])

  const phase = reduced ? 'total' : SEQ[idx].p

  useEffect(() => {
    if (phase !== 'total') {
      setReveal(0)
      return
    }
    if (reduced) {
      setReveal(REVEAL_MAX)
      return
    }
    let n = 0
    const id = setInterval(() => {
      n += 1
      setReveal(n)
      if (n >= REVEAL_MAX) clearInterval(id)
    }, 700)
    return () => clearInterval(id)
  }, [phase, reduced])

  const removed = REMOVED[phase]
  const saved = removed.reduce((s, c) => s + (AMOUNT[c] || 0), 0)
  const justAdded = JUST_ADDED[phase]
  const count = MEMBERS.reduce(
    (n, m) => n + (m.name === 'Marie' ? m.covers.filter((c) => !removed.includes(c)).length : m.covers.length),
    0,
  )

  function isHot(member: Member, tag: string) {
    if (phase === 'total' || phase === 'done' || !OVERLAP.includes(tag)) return false
    if (phase === 'detect') return true
    return member.name === 'Marie' && !removed.includes(tag)
  }

  return (
    <div
      ref={cardRef}
      className="rounded-3xl w-full"
      style={{ maxWidth: 300, background: '#fff', border: '1px solid rgba(26,61,34,0.1)', boxShadow: '0 18px 40px -12px rgba(26,61,34,0.22)', padding: 16, color: 'var(--forest)' }}
    >
      <p style={{ fontSize: 16, fontWeight: 700 }}>Min husstand</p>
      <p style={{ fontSize: 10, color: 'rgba(26,61,34,0.5)', marginBottom: 12 }}>3 medlemmer · {count} forsikringer</p>

      <AssistantBar phase={phase} />

      {phase === 'total' ? (
        <Bill reveal={reveal} instant={reduced} />
      ) : (
        <div className="flex flex-col gap-2">
          {MEMBERS.map((m) => {
            const mineRemoved = m.name === 'Marie' ? removed.filter((c) => MARIE_REMOVABLE.includes(c)) : []
            const showNote = m.role === 'child'
            return (
              <div key={m.name} className="rounded-2xl flex items-center gap-2.5" style={{ background: 'var(--cream)', border: '1px solid rgba(26,61,34,0.08)', padding: '9px 11px' }}>
                <span
                  className="shrink-0 flex items-center justify-center rounded-full"
                  style={{ width: m.role === 'adult' ? 30 : 24, height: m.role === 'adult' ? 30 : 24, background: m.role === 'adult' ? 'rgba(26,61,34,0.08)' : 'rgba(168,224,99,0.25)' }}
                >
                  <PersonIcon child={m.role === 'child'} />
                </span>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 600 }}>
                    {m.name}
                    <span style={{ fontSize: 9, fontWeight: 400, color: 'rgba(26,61,34,0.4)' }}>{m.role === 'adult' ? ' · voksen' : ' · barn'}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-1" style={{ marginTop: 3 }}>
                    {showNote && <span style={{ fontSize: 9, color: 'rgba(26,61,34,0.5)' }}>{m.childNote}</span>}
                    {m.covers.map((c) => {
                      const collapsing = mineRemoved.includes(c)
                      return (
                        <span key={c} style={{ display: 'inline-flex', overflow: 'hidden', maxWidth: collapsing ? 0 : 70, opacity: collapsing ? 0 : 1, transition: 'max-width 0.55s ease, opacity 0.45s ease' }}>
                          <Tag label={c} hot={isHot(m, c)} />
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Besparelse tæller op under Lukas, et fast beløb pr. fjernet forsikring. */}
          <div className="flex items-center justify-between" style={{ marginTop: 4, paddingTop: 12, borderTop: '1px solid rgba(26,61,34,0.1)' }}>
            <p style={{ fontSize: 10, color: 'rgba(26,61,34,0.55)' }}>Sparet i alt</p>
            <div className="flex items-center gap-2">
              <span
                className="rounded-full"
                style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', background: 'var(--sage)', color: 'var(--forest)', opacity: justAdded != null ? 1 : 0, transform: justAdded != null ? 'translateY(0)' : 'translateY(4px)', transition: 'opacity 0.35s ease, transform 0.35s ease' }}
              >
                +{justAdded ?? 0} kr.
              </span>
              <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--forest)' }}>{saved} kr./md.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
