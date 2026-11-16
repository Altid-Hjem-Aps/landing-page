'use client'

import { CARD_BORDER, CARD_SHADOW, CardHeader, DUR_MED, EASE_STANDARD, FOREST, HAIRLINE, SAGE, SAGE_WASH, mockupEntranceStyle, revealPanelStyle, usePhaseLoop } from '@/components/seo/hjemKit'

/**
 * Animated app-UI card for /jul-paa-budget (moved from altidmad.dk, 16 Nov 2026): the
 * christmas shopping spreads itself over the weeks up to christmas instead of one expensive
 * December week, offer-tagged where a plan would catch julevarer in the aviser. Same content
 * and timing as the altidmad.dk card, on Altid Hjem's kit. Qualitative on purpose: no prices.
 */

const WEEKS: { week: string; item: string; tilbud?: boolean }[] = [
  { week: 'U 46', item: 'And og flæskesteg til fryseren', tilbud: true },
  { week: 'U 47', item: 'Rødkål, glas og konserves', tilbud: true },
  { week: 'U 48', item: 'Julebag: mel, smør, krydderier' },
  { week: 'U 49', item: 'Godter og kalenderlys', tilbud: true },
  { week: 'U 51', item: 'Kun det friske: kartofler og grønt' },
]

type Phase = 'empty' | 'fill-1' | 'fill-2' | 'fill-3' | 'fill-4' | 'fill-5' | 'done'

// The altidmad.dk timing: a week every 800 ms, the receipt 1,300 ms after the last week, held
// for 5,200 ms before the plan starts over.
const SEQ: { p: Phase; ms: number }[] = [
  { p: 'empty', ms: 800 },
  { p: 'fill-1', ms: 800 },
  { p: 'fill-2', ms: 800 },
  { p: 'fill-3', ms: 800 },
  { p: 'fill-4', ms: 800 },
  { p: 'fill-5', ms: 1300 },
  { p: 'done', ms: 5200 },
]

const FADE = `${DUR_MED}ms ${EASE_STANDARD}`

export default function JulekurvMockup() {
  const { ref, phase, at, reduced, entered } = usePhaseLoop(SEQ)
  const done = phase === 'done'

  return (
    <div
      ref={ref}
      className="w-full max-w-[400px] rounded-[24px] px-5 pt-5 pb-4 hjem-motion-scope"
      style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-onest)', ...mockupEntranceStyle(entered, reduced) }}
      role="img"
      aria-label="Eksempel: juleindkøbene spredt ud over ugerne op til jul"
    >
      <CardHeader eyebrow="Julen, planlagt" title="Spred indkøbene, ikke budgettet" icon="/services/icon-mad.svg" />

      <div className="rounded-2xl overflow-hidden mb-3" style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}` }}>
        {WEEKS.map((w, i) => {
          const filled = at(SEQ[i + 1].p)
          return (
            <div
              key={w.week}
              className="flex items-center gap-2.5 px-3.5 py-2.5"
              style={{
                borderBottom: i < WEEKS.length - 1 ? `1px solid ${HAIRLINE}` : 'none',
                backgroundColor: filled && w.tilbud ? SAGE_WASH : 'transparent',
                opacity: filled ? 1 : 0.35,
                transition: `background-color ${FADE}, opacity ${FADE}`,
              }}
            >
              <span
                className="shrink-0 grid place-items-center font-bold uppercase"
                style={{ width: 34, height: 24, borderRadius: 7, fontSize: 9.5, backgroundColor: SAGE_WASH, color: FOREST }}
              >
                {w.week}
              </span>
              <span
                className="flex-1 min-w-0 truncate font-semibold text-[13.5px]"
                style={{ color: 'var(--text-dark)', opacity: filled ? 1 : 0, transition: `opacity ${FADE}` }}
              >
                {w.item}
              </span>
              {w.tilbud && (
                <span
                  className="shrink-0 font-semibold text-[10px] uppercase px-2 py-1"
                  style={{ borderRadius: 6, backgroundColor: SAGE, color: FOREST, letterSpacing: '0.4px', opacity: filled ? 1 : 0, transition: `opacity ${FADE}` }}
                >
                  På tilbud
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div
        className="rounded-2xl px-4 py-3 flex items-center justify-between gap-3"
        style={{ backgroundColor: 'var(--forest)', ...revealPanelStyle(done) }}
        aria-hidden={!done}
      >
        <div className="min-w-0">
          <p style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: SAGE, marginBottom: 2 }}>
            Automatisk
          </p>
          <p className="font-bold text-[15px] leading-tight text-white">
            Julen er delt over 5 uger <span style={{ color: SAGE }}>✓</span>
          </p>
        </div>
        <span className="shrink-0 font-semibold text-[11px] px-2 py-1" style={{ borderRadius: 8, backgroundColor: SAGE, color: FOREST }}>
          Ingen panik-uge
        </span>
      </div>
    </div>
  )
}
