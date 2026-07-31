'use client'

import { CARD_BORDER, CARD_SHADOW, CardHeader, DUR_FAST, DUR_MED, EASE_OUT, EASE_OVERSHOOT, EASE_STANDARD, FOREST, HAIRLINE, ON_FOREST_MUTED, SAGE, SAGE_WASH, mockupEntranceStyle, revealPanelStyle, staggerDelay, usePhaseLoop } from '@/components/seo/hjemKit'

/**
 * Animated checklist card for /skift-forsikringsselskab: the five steps of
 * a safe insurance switch tick off in the protective order (new policy
 * confirmed BEFORE the old one is cancelled), landing on the completed
 * switch. Qualitative on purpose — no insurer names, no prices.
 */

type Phase = 'step-1' | 'step-2' | 'step-3' | 'step-4' | 'step-5' | 'done'

const SEQ: { p: Phase; ms: number }[] = [
  { p: 'step-1', ms: 1800 },
  { p: 'step-2', ms: 1800 },
  { p: 'step-3', ms: 1800 },
  { p: 'step-4', ms: 2200 },
  { p: 'step-5', ms: 2200 },
  { p: 'done', ms: 8000 },
]


const STEPS = [
  'Saml nuværende policer',
  'Sammenlign dækningen',
  'Vælg det nye selskab',
  'Bekræft den nye police',
  'Opsig den gamle forsikring',
]

export default function SkiftTjeklisteMockup() {
  const { ref, phase, at, reduced, entered } = usePhaseLoop(SEQ)
  const doneCount = STEPS.filter((_, i) => at(SEQ[i].p)).length
  // During the wrap back to phase 0 every delay and keyed animation is
  // suppressed so the card snaps clean instead of unwinding row by row.
  const animate = phase !== SEQ[0].p && !reduced
  const status = phase === 'done' ? 'Skiftet er på plads' : doneCount >= 4 ? 'Næsten i mål' : 'Gennemgår trin …'

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Eksempel: de fem trin i et sikkert forsikringsskift gennemgås i rækkefølge"
      className="w-full max-w-[400px] rounded-[24px] px-5 pt-5 pb-4 hjem-motion-scope"
      style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-onest)', ...mockupEntranceStyle(entered, reduced) }}
    >
      <CardHeader eyebrow="Skiftet trin for trin" title="Dit sikre forsikringsskift" icon="/services/icon-forsikring.svg" />

      <div className="rounded-2xl px-3.5 py-2.5 mb-3 flex items-center justify-between gap-3" style={{ backgroundColor: SAGE_WASH, border: `1px solid ${CARD_BORDER}` }}>
        <span className="text-[11.5px] font-semibold" style={{ color: FOREST }}>
          <span key={status} style={{ display: 'inline-block', animation: animate ? `hjem-value-in ${DUR_MED}ms ${EASE_OUT} both` : 'none' }}>
            {status}
          </span>
        </span>
        <span className="text-[11px] font-bold tabular-nums" style={{ color: FOREST }}>
          <span key={doneCount} style={{ display: 'inline-block', animation: animate ? `hjem-value-in ${DUR_MED}ms ${EASE_OUT} both` : 'none' }}>
            {doneCount}/5
          </span>
        </span>
      </div>

      <div className="rounded-2xl overflow-hidden mb-3" style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}` }}>
        {STEPS.map((s, i) => {
          const done = at(SEQ[i].p)
          return (
            <div
              key={s}
              className="flex items-center gap-2.5 px-3.5 py-2.5"
              style={{
                borderBottom: i < STEPS.length - 1 ? `1px solid ${HAIRLINE}` : 'none',
                backgroundColor: done ? SAGE_WASH : 'transparent',
                opacity: done ? 1 : 0.45,
                transition: `background-color ${DUR_MED}ms ${EASE_STANDARD}, opacity ${DUR_MED}ms ${EASE_STANDARD}`,
              }}
            >
              <span
                className="shrink-0 grid place-items-center text-[11px] font-bold"
                style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: done ? 'var(--forest)' : 'rgba(26,61,34,0.12)', color: done ? '#fff' : 'var(--forest)', transition: `background-color ${DUR_MED}ms ${EASE_STANDARD}, color ${DUR_MED}ms ${EASE_STANDARD}` }}
              >
                <span
                  key={done ? 'check' : 'num'}
                  style={{ display: 'inline-block', animation: animate ? `hjem-glyph-in ${DUR_FAST}ms ${EASE_OVERSHOOT} both` : 'none', animationDelay: staggerDelay(1, animate) }}
                >
                  {done ? '✓' : i + 1}
                </span>
              </span>
              <span className="flex-1 min-w-0 truncate font-semibold text-[13.5px]" style={{ color: 'var(--text-dark)' }}>
                {s}
              </span>
            </div>
          )
        })}
      </div>

      <div
        className="rounded-2xl px-4 py-3 flex items-center justify-between gap-3"
        style={{
          backgroundColor: 'var(--forest)',
          ...revealPanelStyle(phase === 'done'),
        }}
        aria-hidden={phase !== 'done'}
      >
        <div className="min-w-0">
          <p style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: SAGE, marginBottom: 2 }}>
            Uden huller i dækningen
          </p>
          <p className="font-bold text-[15px] leading-tight text-white">
            Skiftet er på plads <span style={{ color: SAGE }}>✓</span>
          </p>
          <p style={{ fontSize: 11, color: ON_FOREST_MUTED, marginTop: 2 }}>
            Ny police bekræftet, før den gamle blev opsagt
          </p>
        </div>
        <span className="shrink-0 font-semibold text-[11px] px-2 py-1" style={{ borderRadius: 8, backgroundColor: SAGE, color: FOREST }}>
          Skift gennemført
        </span>
      </div>
    </div>
  )
}
