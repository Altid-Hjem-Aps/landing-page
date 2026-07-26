'use client'

import { CARD_BORDER, CARD_SHADOW, CardHeader, FOREST, HAIRLINE, ON_FOREST_MUTED, SAGE, SAGE_WASH, usePhaseLoop } from '@/components/seo/hjemKit'

/**
 * Animated comparison card for /bedste-budget-app: the two approaches fill
 * in row by row — a budget app (looking backwards at spending) next to a
 * gathered overview of the fixed agreements (looking forward) — and the
 * card closes on the honest both-can-have-value line.
 */

type Phase = 'a-1' | 'a-2' | 'a-3' | 'b-1' | 'b-2' | 'b-3' | 'done'

const SEQ: { p: Phase; ms: number }[] = [
  { p: 'a-1', ms: 1500 },
  { p: 'a-2', ms: 1500 },
  { p: 'a-3', ms: 1500 },
  { p: 'b-1', ms: 1500 },
  { p: 'b-2', ms: 1500 },
  { p: 'b-3', ms: 1500 },
  { p: 'done', ms: 8000 },
]


const COL_A = { label: 'Budget-app', rows: ['Viser tidligere køb', 'Kategoriserer forbrug', 'Finder forbrugsvaner'] }
const COL_B = { label: 'Samlet overblik', rows: ['Samler faste aftaler', 'Viser leverandører', 'Hjælper jer fremad'] }

function Column({ col, prefix, at }: { col: typeof COL_A; prefix: 'a' | 'b'; at: (t: Phase) => boolean }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: `1px solid ${CARD_BORDER}` }}>
      <p
        className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider"
        style={{ color: FOREST, background: SAGE_WASH, borderBottom: `1px solid ${HAIRLINE}`, letterSpacing: '0.06em' }}
      >
        {col.label}
      </p>
      {col.rows.map((r, i) => {
        const on = at(`${prefix}-${i + 1}` as Phase)
        return (
          <div
            key={r}
            className="flex items-center gap-2 px-3 py-2.5"
            style={{
              borderBottom: i < col.rows.length - 1 ? `1px solid ${HAIRLINE}` : 'none',
              opacity: on ? 1 : 0.35,
              transition: 'opacity 0.5s ease',
            }}
          >
            <span
              className="shrink-0 grid place-items-center text-[10px] font-bold"
              style={{ width: 20, height: 20, borderRadius: '50%', background: on ? 'var(--forest)' : 'rgba(26,61,34,0.15)', color: '#fff', transition: 'background 0.5s ease' }}
            >
              {on ? '✓' : ''}
            </span>
            <span className="min-w-0 font-semibold text-[12px] leading-snug" style={{ color: 'var(--text-dark)' }}>
              {r}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function BudgetAppSammenligning() {
  const { ref, phase, at } = usePhaseLoop(SEQ)

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Sammenligning: en budget-app viser forbruget bagud, et samlet overblik samler de faste aftaler"
      className="w-full max-w-[440px] rounded-[24px] px-5 pt-5 pb-4"
      style={{ background: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-onest)' }}
    >
      <CardHeader eyebrow="Sammenlign behovet" title="To veje til overblik" icon="/app-badge.png" />

      <div className="grid grid-cols-2 gap-3 mb-3">
        <Column col={COL_A} prefix="a" at={at} />
        <Column col={COL_B} prefix="b" at={at} />
      </div>

      <div
        className="rounded-2xl px-4 py-3"
        style={{
          background: 'var(--forest)',
          opacity: phase === 'done' ? 1 : 0,
          transform: phase === 'done' ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
        aria-hidden={phase !== 'done'}
      >
        <p style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: SAGE, marginBottom: 2 }}>
          Ærligt svar
        </p>
        <p className="font-bold text-[15px] leading-tight text-white">
          Begge kan have værdi i jeres økonomi
        </p>
        <p style={{ fontSize: 11, color: ON_FOREST_MUTED, marginTop: 2 }}>
          De løser to forskellige opgaver
        </p>
      </div>
    </div>
  )
}
