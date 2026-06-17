'use client'

import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react'

/**
 * Animeret app-UI-kort (uden telefon-ramme) til forsikring-siden.
 * Topbaren er "Altid Assistent", der arbejder (spinner + status). Rolig,
 * trinvis loop: finder 3 dobbeltdækninger → fjerner Maries dobbelte forsikringer
 * ÉN ad gangen (Indbo → Ulykke → Rejse) → besparelsen tæller op nederst under
 * Lukas, et fast beløb pr. fjernet forsikring. Tidsstyret via setTimeout (ikke
 * rAF), så den også kører i headless preview.
 */

type Phase = 'detect' | 'rm-indbo' | 'rm-ulykke' | 'rm-rejse' | 'done' | 'total'

const SEQ: { p: Phase; ms: number }[] = [
  { p: 'detect', ms: 3000 },
  { p: 'rm-indbo', ms: 1900 },
  { p: 'rm-ulykke', ms: 1900 },
  { p: 'rm-rejse', ms: 2400 },
  { p: 'done', ms: 2400 },
  { p: 'total', ms: 7000 },
]

const OVERLAP = ['Indbo', 'Ulykke', 'Rejse']
const AMOUNT: Record<string, number> = { Indbo: 120, Ulykke: 130, Rejse: 40 }

const REMOVED: Record<Phase, string[]> = {
  detect: [],
  'rm-indbo': ['Indbo'],
  'rm-ulykke': ['Indbo', 'Ulykke'],
  'rm-rejse': ['Indbo', 'Ulykke', 'Rejse'],
  done: ['Indbo', 'Ulykke', 'Rejse'],
  total: ['Indbo', 'Ulykke', 'Rejse'],
}
const JUST_ADDED: Record<Phase, number | null> = {
  detect: null,
  'rm-indbo': AMOUNT.Indbo,
  'rm-ulykke': AMOUNT.Ulykke,
  'rm-rejse': AMOUNT.Rejse,
  done: null,
  total: null,
}
const STATUS: Record<Phase, string> = {
  detect: 'Fandt 3 dobbeltdækninger',
  'rm-indbo': 'Fjerner dobbelt indboforsikring',
  'rm-ulykke': 'Fjerner dobbelt ulykkesforsikring',
  'rm-rejse': 'Fjerner dobbelt rejseforsikring',
  done: 'Færdig – husstanden er optimeret',
  total: 'Færdig – husstanden er optimeret',
}

type Member = { name: string; role: 'adult' | 'child'; covers: string[]; childNote?: string }
const MEMBERS: Member[] = [
  { name: 'Dig', role: 'adult', covers: ['Indbo', 'Ulykke', 'Rejse'] },
  { name: 'Marie', role: 'adult', covers: ['Indbo', 'Ulykke', 'Rejse'] },
  { name: 'Lukas', role: 'child', covers: [], childNote: 'Dækket af husstandens indbo' },
]

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

/** Topbar: Altid Assistent — viser at den arbejder (spinner) eller er færdig (✓). */
function AssistantBar({ phase }: { phase: Phase }) {
  const working = phase !== 'total' && phase !== 'done'
  return (
    <div className="flex items-center gap-2.5 rounded-2xl mb-3" style={{ background: 'var(--forest)', padding: '10px 12px' }}>
      <span
        className="shrink-0 flex items-center justify-center rounded-full"
        style={{ width: 26, height: 26, background: 'var(--sage)' }}
      >
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
        <span
          className="shrink-0 animate-spin"
          style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }}
        />
      ) : (
        <span
          className="shrink-0 flex items-center justify-center rounded-full"
          style={{ width: 16, height: 16, background: 'var(--sage)', color: 'var(--forest)', fontSize: 10, fontWeight: 800 }}
        >
          ✓
        </span>
      )}
    </div>
  )
}

const BILL_ITEMS = [
  { label: 'Dobbelt indboforsikring', amt: AMOUNT.Indbo },
  { label: 'Dobbelt ulykkesforsikring', amt: AMOUNT.Ulykke },
  { label: 'Dobbelt rejseforsikring', amt: AMOUNT.Rejse },
]
const TOTAL_MONTH = BILL_ITEMS.reduce((s, i) => s + i.amt, 0)
const TOTAL_YEAR_NUM = TOTAL_MONTH * 12

/** Slut-fasen: en "kvittering" over de opsagte dobbeltforsikringer + årlig besparelse. */
function Bill({ reveal, instant }: { reveal: number; instant: boolean }) {
  // Tæl årsbesparelsen op til slutbeløbet, når sage-kortet vises (reveal ≥ 5).
  const [year, setYear] = useState(0)
  const yearlyShown = reveal >= 5
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
    <div
      className="flex items-center justify-between"
      style={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(6px)', transition: 'opacity 0.4s ease, transform 0.4s ease', ...style }}
    >
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

      <div style={{ borderTop: '1px dashed rgba(26,61,34,0.25)', margin: '10px 0', opacity: reveal > 3 ? 1 : 0, transition: 'opacity 0.4s ease' }} />

      <Row show={reveal > 3}>
        <span style={{ fontSize: 11, fontWeight: 700 }}>I sparer</span>
        <span style={{ fontSize: 13, fontWeight: 800 }}>{TOTAL_MONTH} kr./md.</span>
      </Row>

      <div
        className="rounded-2xl text-center"
        style={{
          marginTop: 12,
          padding: '12px 10px',
          background: 'var(--sage)',
          opacity: reveal > 4 ? 1 : 0,
          transform: reveal > 4 ? 'scale(1)' : 'scale(0.96)',
          transition: 'opacity 0.45s ease, transform 0.45s ease',
        }}
      >
        <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(26,61,34,0.7)' }}>I sparer nu</p>
        <p style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.1, color: 'var(--forest)' }}>{year.toLocaleString('da-DK')} kr.</p>
        <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(26,61,34,0.7)' }}>om året</p>
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

  // Reduced motion: spring direkte til slutresultatet.
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true)
      setIdx(SEQ.length - 1)
    }
  }, [])

  // Start først animationen, når kortet er rullet ind i billedet — og kun én gang.
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

  // Trinvis afsløring af kvitteringens linjer i slut-fasen.
  useEffect(() => {
    if (phase !== 'total') {
      setReveal(0)
      return
    }
    if (reduced) {
      setReveal(6)
      return
    }
    let n = 0
    const id = setInterval(() => {
      n += 1
      setReveal(n)
      if (n >= 6) clearInterval(id)
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
      style={{
        maxWidth: 300,
        background: '#fff',
        border: '1px solid rgba(26,61,34,0.1)',
        boxShadow: '0 18px 40px -12px rgba(26,61,34,0.22)',
        padding: 16,
        color: 'var(--forest)',
      }}
    >
      <p style={{ fontSize: 16, fontWeight: 700 }}>Min husstand</p>
      <p style={{ fontSize: 10, color: 'rgba(26,61,34,0.5)', marginBottom: 12 }}>3 medlemmer · {count} forsikringer</p>

      <AssistantBar phase={phase} />

      {phase === 'total' ? (
        <Bill reveal={reveal} instant={reduced} />
      ) : (
      <>
      <div className="flex flex-col gap-2">
        {MEMBERS.map((m) => {
          const mineRemoved = m.name === 'Marie' ? removed : []
          const allMineGone = m.covers.length > 0 && m.covers.every((c) => mineRemoved.includes(c))
          const showNote = m.role === 'child' || allMineGone
          const noteText = m.role === 'child' ? m.childNote : 'Dækket af husstanden'
          return (
            <div
              key={m.name}
              className="rounded-2xl flex items-center gap-2.5"
              style={{ background: 'var(--cream)', border: '1px solid rgba(26,61,34,0.08)', padding: '9px 11px' }}
            >
              <span
                className="shrink-0 flex items-center justify-center rounded-full"
                style={{
                  width: m.role === 'adult' ? 30 : 24,
                  height: m.role === 'adult' ? 30 : 24,
                  background: m.role === 'adult' ? 'rgba(26,61,34,0.08)' : 'rgba(168,224,99,0.25)',
                }}
              >
                <PersonIcon child={m.role === 'child'} />
              </span>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 11, fontWeight: 600 }}>
                  {m.name}
                  <span style={{ fontSize: 9, fontWeight: 400, color: 'rgba(26,61,34,0.4)' }}>
                    {m.role === 'adult' ? ' · voksen' : ' · barn'}
                  </span>
                </p>
                <div className="flex flex-wrap items-center gap-1" style={{ marginTop: 3 }}>
                  {showNote && (
                    <span style={{ fontSize: 9, fontWeight: allMineGone ? 600 : 400, color: allMineGone ? 'var(--forest)' : 'rgba(26,61,34,0.5)' }}>
                      {allMineGone ? '✓ ' : ''}{noteText}
                    </span>
                  )}
                  {m.covers.map((c) => {
                    const collapsing = mineRemoved.includes(c)
                    return (
                      <span
                        key={c}
                        style={{
                          display: 'inline-flex',
                          overflow: 'hidden',
                          maxWidth: collapsing ? 0 : 70,
                          opacity: collapsing ? 0 : 1,
                          transition: 'max-width 0.55s ease, opacity 0.45s ease',
                        }}
                      >
                        <Tag label={c} hot={isHot(m, c)} />
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Besparelse — tæller op under Lukas, et fast beløb pr. fjernet forsikring. */}
      <div className="flex items-center justify-between" style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(26,61,34,0.1)' }}>
        <div>
          <p style={{ fontSize: 10, color: 'rgba(26,61,34,0.55)' }}>Sparet i alt</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="rounded-full"
            style={{
              fontSize: 9,
              fontWeight: 700,
              padding: '2px 7px',
              background: 'var(--sage)',
              color: 'var(--forest)',
              opacity: justAdded != null ? 1 : 0,
              transform: justAdded != null ? 'translateY(0)' : 'translateY(4px)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}
          >
            +{justAdded ?? 0} kr.
          </span>
          <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--forest)' }}>{saved} kr./md.</span>
        </div>
      </div>
      </>
      )}
    </div>
  )
}
