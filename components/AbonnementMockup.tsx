'use client'

import { CARD_BORDER, CARD_SHADOW, CardHeader, FOREST, HAIRLINE, ON_FOREST_MUTED, RED, RED_WASH, SAGE, SAGE_WASH, usePhaseLoop } from '@/components/seo/hjemKit'

/**
 * Animated app-UI card for /opsig-abonnementer: the household's running
 * subscriptions are reviewed one by one, the unused ones are flagged in
 * red and cancelled, and the card lands on the finished yearly review.
 * Qualitative on purpose — no brand names, no amounts.
 */

type Phase = 'scan-1' | 'scan-2' | 'scan-3' | 'scan-4' | 'scan-5' | 'fix-1' | 'fix-2' | 'done'

const SEQ: { p: Phase; ms: number }[] = [
  { p: 'scan-1', ms: 1700 },
  { p: 'scan-2', ms: 1700 },
  { p: 'scan-3', ms: 2200 },
  { p: 'scan-4', ms: 1700 },
  { p: 'scan-5', ms: 2200 },
  { p: 'fix-1', ms: 2600 },
  { p: 'fix-2', ms: 2600 },
  { p: 'done', ms: 8000 },
]


const ROWS = [
  { name: 'Streaming · film', unused: false },
  { name: 'Streaming · musik', unused: false },
  { name: 'Fitness', unused: true, flaggedAt: 'scan-3' as Phase, fixedAt: 'fix-1' as Phase },
  { name: 'Nyhedsapp', unused: false },
  { name: 'Gammel cloud-lagring', unused: true, flaggedAt: 'scan-5' as Phase, fixedAt: 'fix-2' as Phase },
]

export default function AbonnementMockup() {
  const { ref, phase, at } = usePhaseLoop(SEQ)
  const status = at('fix-1')
    ? 'Ryddet op'
    : at('scan-3')
      ? 'Ubrugte fundet'
      : 'Gennemgår aftaler …'

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Eksempel: husstandens abonnementer gennemgås, og ubrugte aftaler opsiges"
      className="w-full max-w-[400px] rounded-[24px] px-5 pt-5 pb-4"
      style={{ background: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-onest)' }}
    >
      <CardHeader eyebrow="Årligt abonnementstjek" title="Tjek jeres abonnementer" icon="/app-badge.png" />

      <div className="rounded-2xl px-3.5 py-2.5 mb-3" style={{ background: SAGE_WASH, border: `1px solid ${CARD_BORDER}` }}>
        <span className="text-[11.5px] font-semibold" style={{ color: FOREST }}>
          {status}
        </span>
      </div>

      <div className="rounded-2xl overflow-hidden mb-3" style={{ background: '#ffffff', border: `1px solid ${CARD_BORDER}` }}>
        {ROWS.map((r, i) => {
          const scanned = at(SEQ[i].p)
          const flagged = r.unused && r.flaggedAt && at(r.flaggedAt) && !(r.fixedAt && at(r.fixedAt))
          const cancelled = r.fixedAt && at(r.fixedAt)
          return (
            <div
              key={r.name}
              className="flex items-center gap-2.5 px-3.5 py-2.5"
              style={{
                borderBottom: i < ROWS.length - 1 ? `1px solid ${HAIRLINE}` : 'none',
                background: flagged ? RED_WASH : cancelled ? SAGE_WASH : 'transparent',
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
                  textDecoration: cancelled ? 'line-through' : 'none',
                  textDecorationColor: 'rgba(26,61,34,0.4)',
                }}
              >
                {r.name}
              </span>
              {flagged && (
                <span className="shrink-0 font-semibold text-[10px] uppercase px-2 py-1" style={{ borderRadius: 6, background: RED, color: '#fff', letterSpacing: '0.4px' }}>
                  Ikke brugt
                </span>
              )}
              {cancelled && (
                <span className="shrink-0 font-semibold text-[10px] uppercase px-2 py-1" style={{ borderRadius: 6, background: SAGE, color: FOREST, letterSpacing: '0.4px' }}>
                  Opsagt
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
            Ét overblik
          </p>
          <p className="font-bold text-[15px] leading-tight text-white">
            Gennemgangen er færdig <span style={{ color: SAGE }}>✓</span>
          </p>
          <p style={{ fontSize: 11, color: ON_FOREST_MUTED, marginTop: 2 }}>
            To ubrugte aftaler er opsagt
          </p>
        </div>
        <span className="shrink-0 font-semibold text-[11px] px-2 py-1" style={{ borderRadius: 8, background: SAGE, color: FOREST }}>
          3 aktive aftaler
        </span>
      </div>
    </div>
  )
}
