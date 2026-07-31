'use client'

import { CARD_BORDER, CARD_SHADOW, CardHeader, DUR_FAST, DUR_MED, DUR_POP, EASE_OUT, EASE_OVERSHOOT, EASE_STANDARD, FOREST, HAIRLINE, ON_FOREST_MUTED, RED, RED_WASH, SAGE, SAGE_WASH, mockupEntranceStyle, revealPanelStyle, staggerDelay, usePhaseLoop } from '@/components/seo/hjemKit'

/**
 * Animated app-UI card for /hvad-koster-indboforsikring: the household's
 * coverages are reviewed one by one, a possible overlap is flagged in red
 * (rejsegods covered twice), resolved, and the card lands on the finished
 * overview. Qualitative on purpose — no prices, no insurer names.
 */

type Phase = 'scan-1' | 'scan-2' | 'scan-3' | 'scan-4' | 'flag' | 'resolve' | 'done'

const SEQ: { p: Phase; ms: number }[] = [
  { p: 'scan-1', ms: 1900 },
  { p: 'scan-2', ms: 1900 },
  { p: 'scan-3', ms: 1900 },
  { p: 'scan-4', ms: 1900 },
  { p: 'flag', ms: 2600 },
  { p: 'resolve', ms: 2400 },
  { p: 'done', ms: 8000 },
]


const ROWS = [
  { name: 'Indbo og løsøre' },
  { name: 'Ansvar' },
  { name: 'Retshjælp' },
  { name: 'Rejsegods', overlap: true },
]

export default function IndboTjekMockup() {
  const { ref, phase, at, reduced, entered } = usePhaseLoop(SEQ)
  // During the wrap back to phase 0 every delay and keyed animation is
  // suppressed so the card snaps clean instead of unwinding row by row.
  const animate = phase !== SEQ[0].p && !reduced
  const status = at('resolve')
    ? 'Overblikket er klar'
    : at('flag')
      ? 'Muligt overlap fundet'
      : 'Gennemgår dækninger …'

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Eksempel: husstandens indbodækninger gennemgås, og et muligt overlap markeres"
      className="w-full max-w-[400px] rounded-[24px] px-5 pt-5 pb-4 hjem-motion-scope"
      style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-onest)', ...mockupEntranceStyle(entered, reduced) }}
    >
      <CardHeader eyebrow="Forsikringsoverblik" title="Tjek af jeres dækning" icon="/services/icon-forsikring.svg" />

      <div className="rounded-2xl px-3.5 py-2.5 mb-3" style={{ backgroundColor: SAGE_WASH, border: `1px solid ${CARD_BORDER}` }}>
        <span className="text-[11.5px] font-semibold" style={{ color: FOREST }}>
          <span key={status} style={{ display: 'inline-block', animation: animate ? `hjem-value-in ${DUR_MED}ms ${EASE_OUT} both` : 'none' }}>
            {status}
          </span>
        </span>
      </div>

      <div className="rounded-2xl overflow-hidden mb-3" style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}` }}>
        {ROWS.map((r, i) => {
          const scanned = at(SEQ[i].p)
          const flagged = r.overlap && at('flag') && !at('resolve')
          const resolved = r.overlap && at('resolve')
          return (
            <div
              key={r.name}
              className="flex items-center gap-2.5 px-3.5 py-2.5"
              style={{
                borderBottom: i < ROWS.length - 1 ? `1px solid ${HAIRLINE}` : 'none',
                backgroundColor: flagged ? RED_WASH : resolved ? SAGE_WASH : 'transparent',
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
                  Muligt overlap
                </span>
              )}
              {resolved && (
                <span
                  className="shrink-0 font-semibold text-[10px] uppercase px-2 py-1"
                  style={{ borderRadius: 6, backgroundColor: SAGE, color: FOREST, letterSpacing: '0.4px', animation: animate ? `hjem-pop-in ${DUR_POP}ms ${EASE_OVERSHOOT} both` : 'none', animationDelay: staggerDelay(2, animate) }}
                >
                  Gennemgået
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
            Overblikket er klar <span style={{ color: SAGE }}>✓</span>
          </p>
          <p style={{ fontSize: 11, color: ON_FOREST_MUTED, marginTop: 2 }}>
            Dækningerne er gennemgået, et muligt overlap er markeret
          </p>
        </div>
        <span className="shrink-0 font-semibold text-[11px] px-2 py-1" style={{ borderRadius: 8, backgroundColor: SAGE, color: FOREST }}>
          Tjek gennemført
        </span>
      </div>
    </div>
  )
}
