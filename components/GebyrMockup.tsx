'use client'

import { CARD_BORDER, CARD_SHADOW, CardHeader, DUR_FAST, DUR_MED, EASE_OUT, EASE_OVERSHOOT, EASE_STANDARD, FOREST, HAIRLINE, ON_FOREST_MUTED, RED, RED_WASH, SAGE, SAGE_WASH, mockupEntranceStyle, revealPanelStyle, staggerDelay, usePhaseLoop } from '@/components/seo/hjemKit'

/**
 * Animated app-UI card for /billigste-elselskab: an electricity bill's
 * lines are reviewed one by one; the two fee lines are flagged in red and
 * then collapse to 0 kr. (the gebyrfri story). The only amount shown is
 * "0 kr." on the fee lines — a verifiable product fact for Altid Energi.
 */

type Phase = 'scan-1' | 'scan-2' | 'scan-3' | 'scan-4' | 'flag' | 'collapse' | 'done'

const SEQ: { p: Phase; ms: number }[] = [
  { p: 'scan-1', ms: 1800 },
  { p: 'scan-2', ms: 1800 },
  { p: 'scan-3', ms: 1800 },
  { p: 'scan-4', ms: 1800 },
  { p: 'flag', ms: 2600 },
  { p: 'collapse', ms: 2600 },
  { p: 'done', ms: 8500 },
]

const INKFADE = 'rgba(26,61,34,0.35)'


const LINES = [
  { name: 'Spotpris', fee: false },
  { name: 'Nettariffer og elafgift', fee: false },
  { name: 'Fast abonnement', fee: true },
  { name: 'Gebyrer og tillæg', fee: true },
]

export default function GebyrMockup() {
  const { ref, phase, at, reduced, entered } = usePhaseLoop(SEQ)
  // During the wrap back to phase 0 every delay and keyed animation is
  // suppressed so the card snaps clean instead of unwinding row by row.
  const animate = phase !== SEQ[0].p && !reduced
  const status = at('collapse')
    ? 'Gebyrfrit = 0 kr.'
    : at('flag')
      ? 'Gebyrer fundet'
      : 'Gennemgår regningen …'

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Eksempel: elregningens gebyrlinjer findes og falder til nul kroner hos et gebyrfrit elselskab"
      className="w-full max-w-[400px] rounded-[24px] px-5 pt-5 pb-4 hjem-motion-scope"
      style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-onest)', ...mockupEntranceStyle(entered, reduced) }}
    >
      <CardHeader eyebrow="Gebyrtjek" title="Tjek af din elregning" icon="/services/icon-strom.svg" />

      <div className="rounded-2xl px-3.5 py-2.5 mb-3" style={{ backgroundColor: SAGE_WASH, border: `1px solid ${CARD_BORDER}` }}>
        <span className="text-[11.5px] font-semibold" style={{ color: FOREST }}>
          <span key={status} style={{ display: 'inline-block', animation: animate ? `hjem-value-in ${DUR_MED}ms ${EASE_OUT} both` : 'none' }}>
            {status}
          </span>
        </span>
      </div>

      <div className="rounded-2xl overflow-hidden mb-3" style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}` }}>
        {LINES.map((l, i) => {
          const scanned = at(SEQ[i].p)
          const flagged = l.fee && at('flag') && !at('collapse')
          const collapsed = l.fee && at('collapse')
          // The fee rows change in the same phase; each later fee row's
          // content trails one extra beat so it reads as a sweep, while the
          // washes change together. Derived from LINES so reordering is safe.
          const feeBeat = l.fee ? LINES.slice(0, i).filter(x => x.fee).length : 0
          return (
            <div
              key={l.name}
              className="flex items-center gap-2.5 px-3.5 py-2.5"
              style={{
                borderBottom: i < LINES.length - 1 ? `1px solid ${HAIRLINE}` : 'none',
                backgroundColor: flagged ? RED_WASH : collapsed ? SAGE_WASH : 'transparent',
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
                  style={{ display: 'inline-block', animation: animate ? `hjem-glyph-in ${DUR_FAST}ms ${EASE_OVERSHOOT} both` : 'none', animationDelay: staggerDelay(1 + feeBeat, animate) }}
                >
                  {flagged ? '!' : scanned ? '✓' : '·'}
                </span>
              </span>
              <span
                className="flex-1 min-w-0 truncate font-semibold text-[13.5px]"
                style={{
                  color: 'var(--text-dark)',
                  textDecorationLine: collapsed ? 'line-through' : 'none',
                  textDecorationColor: 'rgba(26,61,34,0.4)',
                  transition: `color ${DUR_MED}ms ${EASE_STANDARD}`,
                }}
              >
                {l.name}
              </span>
              {l.fee ? (
                <span
                  className="shrink-0 font-semibold text-[10px] uppercase px-2 py-1"
                  style={{
                    borderRadius: 6,
                    backgroundColor: flagged ? RED : collapsed ? SAGE : 'rgba(26,61,34,0.08)',
                    color: flagged ? '#fff' : FOREST,
                    letterSpacing: '0.4px',
                    opacity: scanned ? 1 : 0.6,
                    transition: `background-color ${DUR_MED}ms ${EASE_STANDARD}, opacity ${DUR_MED}ms ${EASE_STANDARD}`,
                  }}
                >
                  <span
                    key={collapsed ? '0 kr.' : 'Gebyr'}
                    className="tabular-nums"
                    style={{ display: 'inline-block', animation: animate ? `hjem-value-in ${DUR_MED}ms ${EASE_OUT} both` : 'none', animationDelay: staggerDelay(2 + feeBeat, animate) }}
                  >
                    {collapsed ? '0 kr.' : 'Gebyr'}
                  </span>
                </span>
              ) : (
                <span className="shrink-0 text-[12px]" style={{ color: scanned ? FOREST : INKFADE, transition: `color ${DUR_MED}ms ${EASE_STANDARD}` }}>
                  <span
                    key={scanned ? 'check' : 'dots'}
                    style={{ display: 'inline-block', animation: animate ? `hjem-glyph-in ${DUR_FAST}ms ${EASE_OVERSHOOT} both` : 'none', animationDelay: staggerDelay(1, animate) }}
                  >
                    {scanned ? '✓' : '· · ·'}
                  </span>
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
            Gebyrfrit
          </p>
          <p className="font-bold text-[15px] leading-tight text-white">
            Faste gebyrer hos Altid Energi: <span style={{ color: SAGE }}>0 kr.</span>
          </p>
          <p style={{ fontSize: 11, color: ON_FOREST_MUTED, marginTop: 2 }}>
            Ingen faste gebyrer, intet abonnement
          </p>
        </div>
        <span className="shrink-0 font-semibold text-[11px] px-2 py-1" style={{ borderRadius: 8, backgroundColor: SAGE, color: FOREST }}>
          Gebyrfrit
        </span>
      </div>
    </div>
  )
}
