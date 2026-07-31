'use client'

import { CARD_BORDER, CARD_SHADOW, CardHeader, DUR_FAST, DUR_MED, DUR_POP, EASE_OUT, EASE_OVERSHOOT, EASE_STANDARD, FOREST, HAIRLINE, ON_FOREST_MUTED, RED, RED_WASH, SAGE, SAGE_WASH, mockupEntranceStyle, revealPanelStyle, staggerDelay, usePhaseLoop } from '@/components/seo/hjemKit'

/**
 * Animated app-UI card for /billigste-mobilabonnement: the household's four
 * mobile subscriptions are reviewed one by one, two problems are flagged in
 * red (an old overpriced plan, an unused big data pack), then fixed, and
 * the card lands on the reviewed-household receipt. Qualitative on purpose:
 * no telco names, no invented amounts.
 */

type Phase =
  | 'scan-start' | 'scan-1' | 'scan-2' | 'scan-3' | 'scan-4'
  | 'fix-far' | 'fix-freja' | 'done'

const SEQ: { p: Phase; ms: number }[] = [
  { p: 'scan-start', ms: 1500 },
  { p: 'scan-1', ms: 1800 },
  { p: 'scan-2', ms: 2200 },
  { p: 'scan-3', ms: 2200 },
  { p: 'scan-4', ms: 1800 },
  { p: 'fix-far', ms: 2600 },
  { p: 'fix-freja', ms: 2600 },
  { p: 'done', ms: 8000 },
]


const ROWS = [
  { name: 'Mor · fri tale', issue: null },
  { name: 'Far · gammelt abonnement', issue: 'Overpris', scannedAt: 'scan-2' as Phase, fixedAt: 'fix-far' as Phase, fixed: 'Gennemgået' },
  { name: 'Freja · stor datapakke', issue: 'Ubrugt data', scannedAt: 'scan-3' as Phase, fixedAt: 'fix-freja' as Phase, fixed: 'Gennemgået' },
  { name: 'Emil · 30 GB', issue: null },
]

const STATUS: Record<Phase, string> = {
  'scan-start': 'Gennemgår abonnementer …',
  'scan-1': 'Gennemgår abonnementer …',
  'scan-2': 'Mulige problemer fundet',
  'scan-3': 'Mulige problemer fundet',
  'scan-4': 'Mulige problemer fundet',
  'fix-far': 'Aftalerne er gennemgået',
  'fix-freja': 'Aftalerne er gennemgået',
  done: 'Aftalerne er gennemgået',
}

export default function MobilOverblikMockup() {
  const { ref, phase, at, reduced, entered } = usePhaseLoop(SEQ)
  // During the wrap back to phase 0 every delay and keyed animation is
  // suppressed so the card snaps clean instead of unwinding row by row.
  const animate = phase !== SEQ[0].p && !reduced

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Eksempel: husstandens mobilabonnementer gennemgås, og en mulig overpris markeres"
      className="w-full max-w-[400px] rounded-[24px] px-5 pt-5 pb-4 hjem-motion-scope"
      style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-onest)', ...mockupEntranceStyle(entered, reduced) }}
    >
      <CardHeader eyebrow="Aftaletjek" title="Husstandens mobilabonnementer" icon="/services/icon-mobil.svg" />

      <div
        className="rounded-2xl px-3.5 py-2.5 mb-3"
        style={{ backgroundColor: SAGE_WASH, border: `1px solid ${CARD_BORDER}` }}
      >
        <span className="text-[11.5px] font-semibold" style={{ color: FOREST }}>
          <span key={STATUS[phase]} style={{ display: 'inline-block', animation: animate ? `hjem-value-in ${DUR_MED}ms ${EASE_OUT} both` : 'none' }}>
            {STATUS[phase]}
          </span>
        </span>
      </div>

      <div className="rounded-2xl overflow-hidden mb-3" style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}` }}>
        {ROWS.map((r, i) => {
          const scanned = at((['scan-1', 'scan-2', 'scan-3', 'scan-4'] as Phase[])[i])
          const flagged = r.issue && r.scannedAt && at(r.scannedAt) && !(r.fixedAt && at(r.fixedAt))
          const fixed = r.fixedAt && at(r.fixedAt)
          return (
            <div
              key={r.name}
              className="flex items-center gap-2.5 px-3.5 py-2.5"
              style={{
                borderBottom: i < ROWS.length - 1 ? `1px solid ${HAIRLINE}` : 'none',
                backgroundColor: flagged ? RED_WASH : fixed ? SAGE_WASH : 'transparent',
                opacity: scanned ? 1 : 0.4,
                transition: `background-color ${DUR_MED}ms ${EASE_STANDARD}, opacity ${DUR_MED}ms ${EASE_STANDARD}`,
              }}
            >
              <span
                className="shrink-0 grid place-items-center text-[11px] font-bold"
                style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: flagged ? RED : 'var(--forest)', color: '#fff', transition: `background-color ${DUR_MED}ms ${EASE_STANDARD}` }}
              >
                <span
                  key={flagged ? '!' : scanned ? 'check' : 'dot'}
                  style={{ display: 'inline-block', animation: animate ? `hjem-glyph-in ${DUR_FAST}ms ${EASE_OVERSHOOT} both` : 'none', animationDelay: staggerDelay(1, animate) }}
                >
                  {flagged ? '!' : scanned ? '✓' : '·'}
                </span>
              </span>
              <span className="flex-1 min-w-0 truncate font-semibold text-[13.5px]" style={{ color: 'var(--text-dark)' }}>
                {r.name}
              </span>
              {flagged && (
                <span
                  className="shrink-0 font-semibold text-[10px] uppercase px-2 py-1"
                  style={{ borderRadius: 6, backgroundColor: RED, color: '#fff', letterSpacing: '0.4px', animation: animate ? `hjem-pop-in ${DUR_POP}ms ${EASE_OVERSHOOT} both` : 'none', animationDelay: staggerDelay(2, animate) }}
                >
                  {r.issue}
                </span>
              )}
              {fixed && (
                <span
                  className="shrink-0 font-semibold text-[10px] uppercase px-2 py-1"
                  style={{ borderRadius: 6, backgroundColor: SAGE, color: FOREST, letterSpacing: '0.4px', animation: animate ? `hjem-pop-in ${DUR_POP}ms ${EASE_OVERSHOOT} both` : 'none', animationDelay: staggerDelay(2, animate) }}
                >
                  {r.fixed}
                </span>
              )}
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
            Ét overblik
          </p>
          <p className="font-bold text-[15px] leading-tight text-white">
            Alle mobilaftaler er gennemgået <span style={{ color: SAGE }}>✓</span>
          </p>
          <p style={{ fontSize: 11, color: ON_FOREST_MUTED, marginTop: 2 }}>
            Husstandens fire aftaler samlet ét sted
          </p>
        </div>
        <span className="shrink-0 font-semibold text-[11px] px-2 py-1" style={{ borderRadius: 8, backgroundColor: SAGE, color: FOREST }}>
          4 aftaler
        </span>
      </div>
    </div>
  )
}
