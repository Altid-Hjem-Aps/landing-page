'use client'

import { CARD_BORDER, CARD_SHADOW, CardHeader, FOREST, HAIRLINE, ON_FOREST_MUTED, SAGE, SAGE_WASH, usePhaseLoop } from '@/components/seo/hjemKit'

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
  'Opsig den gamle police',
]

export default function SkiftTjeklisteMockup() {
  const { ref, phase, at } = usePhaseLoop(SEQ)
  const doneCount = STEPS.filter((_, i) => at(SEQ[i].p)).length
  const status = phase === 'done' ? 'Skiftet er på plads' : doneCount >= 4 ? 'Næsten i mål' : 'Gennemgår trin …'

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Eksempel: de fem trin i et sikkert forsikringsskift gennemføres i rækkefølge"
      className="w-full max-w-[400px] rounded-[24px] px-5 pt-5 pb-4"
      style={{ background: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-onest)' }}
    >
      <CardHeader eyebrow="Skiftet trin for trin" title="Dit sikre forsikringsskift" icon="/services/icon-forsikring.svg" />

      <div className="rounded-2xl px-3.5 py-2.5 mb-3 flex items-center justify-between gap-3" style={{ background: SAGE_WASH, border: `1px solid ${CARD_BORDER}` }}>
        <span className="text-[11.5px] font-semibold" style={{ color: FOREST }}>
          {status}
        </span>
        <span className="text-[11px] font-bold tabular-nums" style={{ color: FOREST }}>
          {doneCount}/5
        </span>
      </div>

      <div className="rounded-2xl overflow-hidden mb-3" style={{ background: '#ffffff', border: `1px solid ${CARD_BORDER}` }}>
        {STEPS.map((s, i) => {
          const done = at(SEQ[i].p)
          return (
            <div
              key={s}
              className="flex items-center gap-2.5 px-3.5 py-2.5"
              style={{
                borderBottom: i < STEPS.length - 1 ? `1px solid ${HAIRLINE}` : 'none',
                background: done ? SAGE_WASH : 'transparent',
                opacity: done ? 1 : 0.45,
                transition: 'background 0.5s ease, opacity 0.5s ease',
              }}
            >
              <span
                className="shrink-0 grid place-items-center text-[11px] font-bold"
                style={{ width: 24, height: 24, borderRadius: '50%', background: done ? 'var(--forest)' : 'rgba(26,61,34,0.12)', color: done ? '#fff' : 'var(--forest)', transition: 'background 0.5s ease, color 0.5s ease' }}
              >
                {done ? '✓' : i + 1}
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
          background: 'var(--forest)',
          opacity: phase === 'done' ? 1 : 0,
          transform: phase === 'done' ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
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
        <span className="shrink-0 font-semibold text-[11px] px-2 py-1" style={{ borderRadius: 8, background: SAGE, color: FOREST }}>
          Skift gennemført
        </span>
      </div>
    </div>
  )
}
