'use client'

import { CARD_BORDER, CARD_SHADOW, CardHeader, FOREST, HAIRLINE, ON_FOREST_MUTED, SAGE, SAGE_WASH, usePhaseLoop } from '@/components/seo/hjemKit'

/**
 * Animated app-UI card for /hvad-koster-en-tyverialarm: the home's five
 * sensors arm one by one at a calm pace, and the card lands on "hjemmet er
 * sikret". Qualitative on purpose — no prices, no vendor names.
 */

type Phase = 'arm-1' | 'arm-2' | 'arm-3' | 'arm-4' | 'arm-5' | 'all-active' | 'secured'

const SEQ: { p: Phase; ms: number }[] = [
  { p: 'arm-1', ms: 1700 },
  { p: 'arm-2', ms: 1700 },
  { p: 'arm-3', ms: 1700 },
  { p: 'arm-4', ms: 1700 },
  { p: 'arm-5', ms: 1700 },
  { p: 'all-active', ms: 2200 },
  { p: 'secured', ms: 8000 },
]


const SENSORS = ['Fordør', 'Vinduer i stuen', 'Røgalarm', 'Bevægelse i gang', 'Udendørs kamera']

export default function AlarmStatusMockup() {
  const { ref, phase, at } = usePhaseLoop(SEQ)
  const armedCount = SENSORS.filter((_, i) => at(SEQ[i].p)).length

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Eksempel: hjemmets alarmsensorer aktiveres, og hjemmet meldes sikret"
      className="w-full max-w-[400px] rounded-[24px] px-5 pt-5 pb-4"
      style={{ background: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-onest)' }}
    >
      <CardHeader eyebrow="Alarmstatus" title="Hjemmet sikres" icon="/services/icon-alarm.svg" />

      <div className="rounded-2xl px-3.5 py-2.5 mb-3 flex items-center justify-between gap-3" style={{ background: SAGE_WASH, border: `1px solid ${CARD_BORDER}` }}>
        <span className="text-[11.5px] font-semibold" style={{ color: FOREST }}>
          {phase === 'secured' ? 'Hjemmet er sikret' : phase === 'all-active' ? 'Alle sensorer aktive' : 'Aktiverer …'}
        </span>
        <span className="text-[11px] font-bold tabular-nums" style={{ color: FOREST }}>
          {Math.min(armedCount, 5)}/5
        </span>
      </div>

      <div className="rounded-2xl overflow-hidden mb-3" style={{ background: '#ffffff', border: `1px solid ${CARD_BORDER}` }}>
        {SENSORS.map((s, i) => {
          const armed = at(SEQ[i].p)
          return (
            <div
              key={s}
              className="flex items-center gap-2.5 px-3.5 py-2.5"
              style={{
                borderBottom: i < SENSORS.length - 1 ? `1px solid ${HAIRLINE}` : 'none',
                background: armed ? SAGE_WASH : 'transparent',
                opacity: armed ? 1 : 0.4,
                transition: 'background 0.5s ease, opacity 0.5s ease',
              }}
            >
              <span
                className="shrink-0 grid place-items-center text-[11px] font-bold"
                style={{ width: 24, height: 24, borderRadius: '50%', background: armed ? 'var(--forest)' : 'rgba(26,61,34,0.15)', color: '#fff', transition: 'background 0.5s ease' }}
              >
                {armed ? '✓' : ''}
              </span>
              <span className="flex-1 min-w-0 truncate font-semibold text-[13.5px]" style={{ color: 'var(--text-dark)' }}>
                {s}
              </span>
              <span
                className="shrink-0 font-semibold text-[10px] uppercase px-2 py-1"
                style={{ borderRadius: 6, background: armed ? SAGE : 'rgba(26,61,34,0.08)', color: FOREST, letterSpacing: '0.4px', opacity: armed ? 1 : 0.6, transition: 'background 0.5s ease' }}
              >
                {armed ? 'Aktiv' : 'Klar'}
              </span>
            </div>
          )
        })}
      </div>

      <div
        className="rounded-2xl px-4 py-3 flex items-center justify-between gap-3"
        style={{
          background: 'var(--forest)',
          opacity: phase === 'secured' ? 1 : 0,
          transform: phase === 'secured' ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
        aria-hidden={phase !== 'secured'}
      >
        <div className="min-w-0">
          <p style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: SAGE, marginBottom: 2 }}>
            Alarmstatus
          </p>
          <p className="font-bold text-[15px] leading-tight text-white">
            Hjemmet er sikret <span style={{ color: SAGE }}>✓</span>
          </p>
          <p style={{ fontSize: 11, color: ON_FOREST_MUTED, marginTop: 2 }}>
            Alle fem sensorer er aktive
          </p>
        </div>
        <span className="shrink-0 font-semibold text-[11px] px-2 py-1" style={{ borderRadius: 8, background: SAGE, color: FOREST }}>
          Alt er aktivt
        </span>
      </div>
    </div>
  )
}
