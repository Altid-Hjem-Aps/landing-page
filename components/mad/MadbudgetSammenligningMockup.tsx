'use client'

import { CARD_BORDER, CARD_SHADOW, CardHeader, DUR_MED, EASE_STANDARD, FOREST, HAIRLINE, ON_FOREST_MUTED, SAGE, SAGE_WASH, mockupEntranceStyle, revealPanelStyle, usePhaseLoop } from '@/components/seo/hjemKit'

/**
 * Animated app-UI card for /madbudget (from the old /beregn-dit-madbudget on altidmad.dk, merged
 * into /madbudget 16 Nov 2026): a household's own monthly spend is held up against the Danmarks
 * Statistik average for the same household type, the gap is highlighted, and the card lands on
 * the possible saving. Same content, phases and timing as the Altid Mad original, in Altid Hjem's
 * colours.
 *
 * Numbers are the verified ones only: 5.481 kr./md is DST FU13 2024 for "2 voksne med børn"
 * (65.775 kr./year / 12) and 40,4 pct. is the Q3 basket gap. The 6.200 kr. is labelled as an
 * example household, and the saving stays "op til" with its condition, never a promised amount.
 */

type Phase = 'husstand' | 'forbrug' | 'gennemsnit' | 'forskel' | 'done'

const SEQ: { p: Phase; ms: number }[] = [
  { p: 'husstand', ms: 1900 },
  { p: 'forbrug', ms: 2100 },
  { p: 'gennemsnit', ms: 2100 },
  { p: 'forskel', ms: 2600 },
  { p: 'done', ms: 7000 },
]

const STATUS: Record<Phase, string> = {
  husstand: 'Husstanden er valgt',
  forbrug: 'Jeres forbrug vises',
  gennemsnit: 'Sammenligner med gennemsnittet',
  forskel: 'Forskellen er beregnet',
  done: 'Forskellen er beregnet',
}

const ROWS: { at: Phase; label: string; value: string; highlight?: boolean }[] = [
  { at: 'husstand', label: 'Husstand', value: '2 voksne, 2 børn' },
  { at: 'forbrug', label: 'Jeres forbrug, eksempel', value: '6.200 kr./md.' },
  { at: 'gennemsnit', label: 'Gennemsnit', value: '5.481 kr./md.' },
  { at: 'forskel', label: 'Over gennemsnittet', value: '719 kr./md.', highlight: true },
]

export default function MadbudgetSammenligningMockup() {
  // Reduced motion pins the finished state ('done') so the card still reads as a whole.
  const { ref, phase, at, reduced, entered } = usePhaseLoop(SEQ)

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Eksempel: En husstand med 2 voksne og 2 børn bruger 6.200 kr. om måneden, 719 kr. mere end gennemsnittet på 5.481 kr., og kan spare op til 40,4 pct., hvis indkøbene ligner testkurven."
      className="w-full max-w-[440px] rounded-[24px] px-5 pt-5 pb-4 hjem-motion-scope"
      style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-onest)', ...mockupEntranceStyle(entered, reduced) }}
    >
      <CardHeader eyebrow="Madbudget" title="Hvordan ligger jeres forbrug?" icon="/services/icon-mad.svg" />

      <div className="rounded-2xl px-3.5 py-2.5 mb-3" style={{ backgroundColor: SAGE_WASH, border: `1px solid ${CARD_BORDER}` }}>
        <span className="text-[11.5px] font-semibold" style={{ color: FOREST }}>
          {STATUS[phase]}
        </span>
      </div>

      <div className="rounded-2xl overflow-hidden mb-3" style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}` }}>
        {ROWS.map((r, i) => {
          const shown = at(r.at)
          const lit = r.highlight && shown
          return (
            <div
              key={r.label}
              className="flex items-center justify-between gap-3 px-3.5 py-2.5"
              style={{
                borderBottom: i < ROWS.length - 1 ? `1px solid ${HAIRLINE}` : 'none',
                backgroundColor: lit ? SAGE_WASH : 'transparent',
                opacity: shown ? 1 : 0.35,
                transition: reduced ? 'none' : `background-color ${DUR_MED}ms ${EASE_STANDARD}, opacity ${DUR_MED}ms ${EASE_STANDARD}`,
              }}
            >
              <span className="min-w-0 truncate text-[13px]" style={{ color: 'var(--text-light)' }}>
                {r.label}
              </span>
              <span className="shrink-0 font-semibold text-[13.5px] tabular-nums" style={{ color: lit ? FOREST : 'var(--text-dark)' }}>
                {shown ? r.value : '· · ·'}
              </span>
            </div>
          )
        })}
      </div>

      <div
        className="rounded-2xl px-4 py-3 flex items-center justify-between gap-3"
        style={{ backgroundColor: FOREST, ...revealPanelStyle(phase === 'done'), ...(reduced ? { transition: 'none' } : {}) }}
        aria-hidden={phase !== 'done'}
      >
        <div className="min-w-0">
          <p style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: SAGE, marginBottom: 2 }}>Mulig besparelse</p>
          <p className="font-bold text-[17px] leading-tight text-white">
            Op til <span style={{ color: SAGE }}>40,4 pct.</span> at spare
          </p>
          <p style={{ fontSize: 11, color: ON_FOREST_MUTED, marginTop: 2 }}>Hvis jeres indkøb ligner testkurven</p>
        </div>
        <span className="shrink-0 font-semibold text-[11px] px-2 py-1" style={{ borderRadius: 8, backgroundColor: SAGE, color: FOREST }}>
          Sparemulighed
        </span>
      </div>
    </div>
  )
}
