'use client'

import { CARD_BORDER, CARD_SHADOW, CardHeader, FOREST, HAIRLINE, ON_FOREST_MUTED, RED, RED_WASH, SAGE, SAGE_WASH, usePhaseLoop } from '@/components/seo/hjemKit'

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
  { name: 'Transport og afgifter', fee: false },
  { name: 'Fast abonnement', fee: true },
  { name: 'Gebyrer og tillæg', fee: true },
]

export default function GebyrMockup() {
  const { ref, phase, at } = usePhaseLoop(SEQ)
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
      className="w-full max-w-[400px] rounded-[24px] px-5 pt-5 pb-4"
      style={{ background: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-onest)' }}
    >
      <CardHeader eyebrow="Gebyrtjek" title="Tjek af din elregning" icon="/services/icon-strom.svg" />

      <div className="rounded-2xl px-3.5 py-2.5 mb-3" style={{ background: SAGE_WASH, border: `1px solid ${CARD_BORDER}` }}>
        <span className="text-[11.5px] font-semibold" style={{ color: FOREST }}>
          {status}
        </span>
      </div>

      <div className="rounded-2xl overflow-hidden mb-3" style={{ background: '#ffffff', border: `1px solid ${CARD_BORDER}` }}>
        {LINES.map((l, i) => {
          const scanned = at(SEQ[i].p)
          const flagged = l.fee && at('flag') && !at('collapse')
          const collapsed = l.fee && at('collapse')
          return (
            <div
              key={l.name}
              className="flex items-center gap-2.5 px-3.5 py-2.5"
              style={{
                borderBottom: i < LINES.length - 1 ? `1px solid ${HAIRLINE}` : 'none',
                background: flagged ? RED_WASH : collapsed ? SAGE_WASH : 'transparent',
                opacity: scanned ? 1 : 0.4,
                transition: 'background 0.5s ease, opacity 0.5s ease',
              }}
            >
              <span
                className="shrink-0 grid place-items-center text-[11px] font-bold"
                style={{ width: 24, height: 24, borderRadius: '50%', background: flagged ? RED : 'var(--forest)', color: '#fff', transition: 'background 0.5s ease' }}
              >
                {flagged ? '!' : scanned ? '✓' : '·'}
              </span>
              <span
                className="flex-1 min-w-0 truncate font-semibold text-[13.5px]"
                style={{
                  color: 'var(--text-dark)',
                  textDecoration: collapsed ? 'line-through' : 'none',
                  textDecorationColor: 'rgba(26,61,34,0.4)',
                  transition: 'color 0.5s ease',
                }}
              >
                {l.name}
              </span>
              {l.fee ? (
                <span
                  className="shrink-0 font-semibold text-[10px] uppercase px-2 py-1"
                  style={{
                    borderRadius: 6,
                    background: flagged ? RED : collapsed ? SAGE : 'rgba(26,61,34,0.08)',
                    color: flagged ? '#fff' : FOREST,
                    letterSpacing: '0.4px',
                    opacity: scanned ? 1 : 0.6,
                    transition: 'background 0.5s ease',
                  }}
                >
                  {collapsed ? '0 kr.' : 'Gebyr'}
                </span>
              ) : (
                <span className="shrink-0 text-[12px]" style={{ color: scanned ? FOREST : INKFADE, transition: 'color 0.5s ease' }}>
                  {scanned ? '✓' : '· · ·'}
                </span>
              )}
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
            Gebyrfrit
          </p>
          <p className="font-bold text-[15px] leading-tight text-white">
            Gebyrdelen hos Altid Energi: <span style={{ color: SAGE }}>0 kr.</span>
          </p>
          <p style={{ fontSize: 11, color: ON_FOREST_MUTED, marginTop: 2 }}>
            Ingen faste gebyrer, intet abonnement
          </p>
        </div>
        <span className="shrink-0 font-semibold text-[11px] px-2 py-1" style={{ borderRadius: 8, background: SAGE, color: FOREST }}>
          Gebyrfrit
        </span>
      </div>
    </div>
  )
}
