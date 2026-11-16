'use client'

import { CARD_BORDER, CARD_SHADOW, CardHeader, EASE_OUT, FOREST, HAIRLINE, ON_FOREST_MUTED, SAGE, SAGE_WASH, mockupEntranceStyle, useMockupStart } from '@/components/seo/hjemKit'

/**
 * Animated benchmark card for the madbudget guides (moved from altidmad.dk, 16 Nov 2026): DST
 * household types with bars that grow into view. Every figure is Danmarks Statistik,
 * Forbrugsundersøgelsen tabel FU13 (2024, løbende priser), category "Fødevarer og
 * ikke-alkoholiske drikkevarer", yearly value / 12. No other numbers appear here.
 * Same content and motion as the Altid Mad original, in Altid Hjem's colours.
 */

// kr./month = FU13 yearly figure / 12, rounded to whole kroner.
const ROWS: { key: string; label: string; month: number }[] = [
  { key: 'enlig', label: 'Enlig under 60 uden børn', month: 1811 },
  { key: 'enlig60', label: 'Enlig 60+ uden børn', month: 2071 },
  { key: 'enlig-boern', label: 'Enlige med børn', month: 3214 },
  { key: 'par', label: '2 voksne uden børn', month: 3478 },
  { key: 'par-boern', label: '2 voksne med børn', month: 5481 },
  { key: 'tre-voksne', label: 'Mindst 3 voksne', month: 5953 },
]
const MAX = Math.max(...ROWS.map((r) => r.month))
const AVERAGE_MONTH = 3488

const fmt = (n: number) => n.toLocaleString('da-DK')

export default function MadbudgetBenchmark({ highlight }: { highlight?: string }) {
  const { ref, running, reduced, entered } = useMockupStart()
  // The bars grow while the card is in view (and regrow on the next visit); reduced motion shows
  // them at full length with no transition.
  const grown = running || reduced
  const highlighted = ROWS.find((r) => r.key === highlight)

  return (
    <div
      ref={ref}
      className="w-full max-w-[440px] rounded-[24px] px-5 pt-5 pb-4 hjem-motion-scope"
      style={{ background: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-onest)', ...mockupEntranceStyle(entered, reduced) }}
      role="group"
      aria-label="Danske husstandes gennemsnitlige udgift til mad pr. måned, fordelt på husstandstype"
    >
      <CardHeader eyebrow="Danmarks Statistik · 2024" title="Hvad bruger husstande på mad?" icon="/services/icon-mad.svg" />

      <div className="rounded-2xl overflow-hidden mb-3" style={{ background: '#ffffff', border: `1px solid ${CARD_BORDER}` }}>
        {ROWS.map((r, i) => {
          const isHighlight = r.key === highlight
          return (
            <div
              key={r.key}
              className="px-3.5 py-2.5"
              style={{
                borderBottom: i < ROWS.length - 1 ? `1px solid ${HAIRLINE}` : 'none',
                background: isHighlight ? SAGE_WASH : 'transparent',
              }}
            >
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <span className="min-w-0 truncate font-semibold text-[13px]" style={{ color: 'var(--text-dark)' }}>
                  {r.label}
                </span>
                <span className="shrink-0 text-[12.5px] font-bold tabular-nums" style={{ color: FOREST }}>
                  {fmt(r.month)} kr./md
                </span>
              </div>
              <div className="h-[6px] rounded-full overflow-hidden" style={{ background: HAIRLINE }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(r.month / MAX) * 100}%`,
                    background: isHighlight ? FOREST : 'rgba(26,61,34,0.45)',
                    transform: grown ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: reduced ? 'none' : `transform 900ms ${EASE_OUT} ${i * 80}ms`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-2xl px-4 py-3 flex items-center justify-between gap-3" style={{ background: FOREST }}>
        <div className="min-w-0">
          <p style={{ fontSize: 11, color: ON_FOREST_MUTED, marginBottom: 1 }}>{highlighted ? highlighted.label : 'Gennemsnitshusstand'}</p>
          <p className="font-bold text-[17px] leading-tight text-white">
            <span style={{ color: SAGE }}>{fmt(highlighted ? highlighted.month : AVERAGE_MONTH)} kr.</span> om måneden
          </p>
        </div>
        <span className="shrink-0 font-semibold text-[11px] px-2 py-1" style={{ borderRadius: 8, background: SAGE, color: FOREST }}>
          Benchmark
        </span>
      </div>

      <p className="text-[10px] mt-3 leading-relaxed" style={{ color: 'var(--text-light)' }}>
        Fødevarer og ikke-alkoholiske drikkevarer, kr. pr. måned (årsbeløb delt med 12). Kilde: Danmarks Statistik, Forbrugsundersøgelsen, tabel FU13, 2024.
      </p>
    </div>
  )
}
