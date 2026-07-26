'use client'

import { CARD_BORDER, CARD_SHADOW, CardHeader, FOREST, HAIRLINE, ON_FOREST_MUTED, SAGE, useMockupStart } from '@/components/seo/hjemKit'

/**
 * Animated benchmark card for /gennemsnitligt-elforbrug: typical yearly
 * electricity consumption per household type, bars growing into view.
 * Figures are the verified 2026 guidance levels (Energistyrelsen and the
 * el companies' own statistics), excluding EVs and electric heating —
 * exactly the numbers used in the page copy, nothing else.
 */

const ROWS: { label: string; range: string; mid: number }[] = [
  { label: 'Lejlighed, 1 person', range: '1.500-2.000 kWh', mid: 1750 },
  { label: 'Lejlighed, 2 personer', range: 'ca. 2.100 kWh', mid: 2100 },
  { label: 'Familielejlighed', range: 'ca. 2.600 kWh', mid: 2600 },
  { label: 'Hus, 2 personer', range: 'ca. 3.700 kWh', mid: 3700 },
  { label: 'Familie på 4 i hus', range: '4.500-5.000 kWh', mid: 4750 },
]
const MAX = Math.max(...ROWS.map(r => r.mid))

export default function ElforbrugBenchmark() {
  const { ref, running, reduced } = useMockupStart()
  const grown = running || reduced

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Typisk elforbrug pr. år fordelt på boligtype, vejledende niveauer"
      className="w-full max-w-[440px] rounded-[24px] px-5 pt-5 pb-4"
      style={{ background: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-onest)' }}
    >
      <CardHeader eyebrow="Sammenlign jeres hjem" title="Typisk elforbrug" icon="/services/icon-strom.svg" />

      <div className="rounded-2xl overflow-hidden mb-3" style={{ background: '#ffffff', border: `1px solid ${CARD_BORDER}` }}>
        {ROWS.map((r, i) => (
          <div
            key={r.label}
            className="px-3.5 py-2.5"
            style={{ borderBottom: i < ROWS.length - 1 ? `1px solid ${HAIRLINE}` : 'none' }}
          >
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="min-w-0 truncate font-semibold text-[13px]" style={{ color: 'var(--text-dark)' }}>
                {r.label}
              </span>
              <span className="shrink-0 text-[12px] font-bold tabular-nums" style={{ color: FOREST }}>
                {r.range}
              </span>
            </div>
            <div className="h-[6px] rounded-full overflow-hidden" style={{ background: 'rgba(26,61,34,0.08)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(r.mid / MAX) * 100}%`,
                  background: i === ROWS.length - 1 ? 'var(--forest)' : 'rgba(26,61,34,0.45)',
                  transform: grown ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: reduced ? 'none' : `transform 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl px-4 py-3 flex items-center justify-between gap-3" style={{ background: 'var(--forest)' }}>
        <div className="min-w-0">
          <p style={{ fontSize: 11, color: ON_FOREST_MUTED, marginBottom: 1 }}>
            Familie i hus, vejledende niveau
          </p>
          <p className="font-bold text-[17px] leading-tight text-white">
            <span style={{ color: SAGE }}>4.500-5.000 kWh</span> om året
          </p>
        </div>
        <span className="shrink-0 font-semibold text-[11px] px-2 py-1" style={{ borderRadius: 8, background: SAGE, color: FOREST }}>
          Benchmark
        </span>
      </div>

      <p className="text-[11px] mt-3 leading-relaxed" style={{ color: 'rgba(26,61,34,0.55)' }}>
        Vejledende 2026-niveauer fra Energistyrelsen og elselskaber, uden elbil og elvarme.
      </p>
    </div>
  )
}
