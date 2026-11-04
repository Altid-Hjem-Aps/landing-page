'use client'

import { CARD_BORDER, CARD_SHADOW, DUR_MED, EASE_OUT, FOREST, HAIRLINE, INK_MUTED, ON_FOREST_MUTED, SAGE, mockupEntranceStyle, revealPanelStyle, usePhaseLoop } from '@/components/seo/hjemKit'

/**
 * Animated card for /hvad-koster-forsikring: the household's insurances as one
 * overview, member by member. That is all the card says, on purpose. It used to
 * run a scan by an "Altid Assistent" that ended in "I sparer nu 2.880 kr.": an
 * invented saving and a product the app does not have. No amounts, no assistant,
 * no clean-up here. The reader spots for themselves that Indbo appears twice.
 */

type Phase = 'start' | 'dig' | 'marie' | 'lukas' | 'done'

const SEQ: { p: Phase; ms: number }[] = [
  { p: 'start', ms: 900 },
  { p: 'dig', ms: 1300 },
  { p: 'marie', ms: 1300 },
  { p: 'lukas', ms: 1300 },
  { p: 'done', ms: 8000 },
]

type Member = { phase: Phase; name: string; role: string; child?: boolean; covers: string[] }

const MEMBERS: Member[] = [
  { phase: 'dig', name: 'Dig', role: 'voksen', covers: ['Indbo', 'Rejse', 'Ulykke'] },
  { phase: 'marie', name: 'Marie', role: 'voksen', covers: ['Indbo', 'Rejse', 'Ulykke'] },
  { phase: 'lukas', name: 'Lukas', role: 'barn', child: true, covers: ['Børneulykke'] },
]

const COVER_COUNT = MEMBERS.reduce((n, m) => n + m.covers.length, 0)

function PersonIcon({ child = false }: { child?: boolean }) {
  const s = child ? 15 : 19
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy={child ? 9 : 8} r={child ? 3.1 : 4} fill={FOREST} />
      <path d={child ? 'M6.5 19c0-3 2.5-5.2 5.5-5.2s5.5 2.2 5.5 5.2Z' : 'M3.5 20.5c0-4 3.8-7 8.5-7s8.5 3 8.5 7Z'} fill={FOREST} />
    </svg>
  )
}

export default function ForsikringHusstandMockup() {
  const { ref, phase, at, reduced, entered } = usePhaseLoop(SEQ)
  // During the wrap back to phase 0 the rows snap clean instead of fading out.
  const animate = phase !== SEQ[0].p && !reduced

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Eksempel: husstandens forsikringer samlet i ét overblik. Du og Marie har indbo, rejse og ulykke, og Lukas har børneulykke."
      className="w-full max-w-[340px] rounded-[24px] px-5 pt-5 pb-4 hjem-motion-scope"
      style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-dm-sans)', color: FOREST, ...mockupEntranceStyle(entered, reduced) }}
    >
      <p style={{ fontSize: 17, fontWeight: 700 }}>Min husstand</p>
      <p style={{ fontSize: 11, color: INK_MUTED, marginBottom: 12 }}>3 medlemmer · {COVER_COUNT} forsikringer</p>

      <div className="flex flex-col gap-2 mb-3">
        {MEMBERS.map((m) => {
          const shown = at(m.phase)
          return (
            <div
              key={m.name}
              className="rounded-2xl flex items-center gap-2.5"
              style={{
                border: `1px solid ${HAIRLINE}`,
                padding: '9px 11px',
                opacity: shown ? 1 : 0,
                transform: shown ? 'translateY(0)' : 'translateY(6px)',
                transition: animate ? `opacity ${DUR_MED}ms ${EASE_OUT}, transform ${DUR_MED}ms ${EASE_OUT}` : 'none',
              }}
            >
              <span className="shrink-0 flex items-center justify-center rounded-full" style={{ width: 30, height: 30, background: 'rgba(22,50,35,0.08)' }}>
                <PersonIcon child={m.child} />
              </span>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600 }}>
                  {m.name}
                  <span style={{ fontSize: 10, fontWeight: 400, color: INK_MUTED }}> · {m.role}</span>
                </p>
                <div className="flex flex-wrap items-center gap-1" style={{ marginTop: 3 }}>
                  {m.covers.map((cover) => (
                    <span key={cover} className="rounded-full" style={{ fontSize: 10, padding: '2px 7px', background: 'rgba(22,50,35,0.06)', color: 'rgba(22,50,35,0.7)', whiteSpace: 'nowrap' }}>
                      {cover}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div
        className="rounded-2xl px-4 py-3"
        style={{ backgroundColor: FOREST, ...revealPanelStyle(phase === 'done') }}
        aria-hidden={phase !== 'done'}
      >
        <p style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: SAGE, marginBottom: 2 }}>
          Ét overblik
        </p>
        <p className="font-bold text-[15px] leading-tight text-white">
          Alle forsikringer ét sted <span style={{ color: SAGE }}>✓</span>
        </p>
        <p style={{ fontSize: 11, color: ON_FOREST_MUTED, marginTop: 2 }}>
          Se, hvem der har hvilken forsikring
        </p>
      </div>
    </div>
  )
}
