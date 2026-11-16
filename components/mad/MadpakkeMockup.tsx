'use client'

import { CARD_BORDER, CARD_SHADOW, CardHeader, DUR_MED, EASE_STANDARD, FOREST, HAIRLINE, ON_FOREST_MUTED, SAGE, SAGE_WASH, mockupEntranceStyle, revealPanelStyle, usePhaseLoop } from '@/components/seo/hjemKit'

/**
 * Animated app-UI card for /madpakker-paa-budget (moved from altidmad.dk, 16 Nov 2026): the
 * week's lunchboxes fill in day by day, tilbud-tagged where the plan caught an offer, and the
 * card lands on "indkøbslisten er skrevet". Same content and timing as the altidmad.dk card,
 * on Altid Hjem's kit. No prices anywhere: the offer tags are qualitative on purpose.
 */

const DAYS: { day: string; item: string; tilbud?: boolean }[] = [
  { day: 'Man', item: 'Pastasalat med grønt', tilbud: true },
  { day: 'Tir', item: 'Rugbrød med æg og agurk' },
  { day: 'Ons', item: 'Wrap med kylling fra aftensmaden', tilbud: true },
  { day: 'Tor', item: 'Mini-sandwich med ost og grønt' },
  { day: 'Fre', item: 'Boller med ost + frugt', tilbud: true },
]

type Phase = 'empty' | 'fill-1' | 'fill-2' | 'fill-3' | 'fill-4' | 'fill-5' | 'done'

// The altidmad.dk timing: a day every 900 ms, the receipt 1,400 ms after the last day, held
// for 5,200 ms before the week starts over.
const SEQ: { p: Phase; ms: number }[] = [
  { p: 'empty', ms: 900 },
  { p: 'fill-1', ms: 900 },
  { p: 'fill-2', ms: 900 },
  { p: 'fill-3', ms: 900 },
  { p: 'fill-4', ms: 900 },
  { p: 'fill-5', ms: 1400 },
  { p: 'done', ms: 5200 },
]

const FADE = `${DUR_MED}ms ${EASE_STANDARD}`

export default function MadpakkeMockup() {
  const { ref, phase, at, reduced, entered } = usePhaseLoop(SEQ)
  const done = phase === 'done'

  return (
    <div
      ref={ref}
      className="w-full max-w-[400px] rounded-[24px] px-5 pt-5 pb-4 hjem-motion-scope"
      style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-onest)', ...mockupEntranceStyle(entered, reduced) }}
      role="img"
      aria-label="Eksempel: Altid Mad planlægger ugens madpakker efter tilbud"
    >
      <CardHeader eyebrow="Ugens madpakker" title="Planlagt efter ugens tilbud" icon="/services/icon-mad.svg" />

      <div className="rounded-2xl overflow-hidden mb-3" style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}` }}>
        {DAYS.map((d, i) => {
          const filled = at(SEQ[i + 1].p)
          return (
            <div
              key={d.day}
              className="flex items-center gap-2.5 px-3.5 py-2.5"
              style={{
                borderBottom: i < DAYS.length - 1 ? `1px solid ${HAIRLINE}` : 'none',
                backgroundColor: filled && d.tilbud ? SAGE_WASH : 'transparent',
                opacity: filled ? 1 : 0.35,
                transition: `background-color ${FADE}, opacity ${FADE}`,
              }}
            >
              <span
                className="shrink-0 grid place-items-center font-bold uppercase"
                style={{ width: 30, height: 24, borderRadius: 7, fontSize: 9.5, backgroundColor: SAGE_WASH, color: FOREST }}
              >
                {d.day}
              </span>
              <span
                className="flex-1 min-w-0 truncate font-semibold text-[13.5px]"
                style={{ color: 'var(--text-dark)', opacity: filled ? 1 : 0, transition: `opacity ${FADE}` }}
              >
                {d.item}
              </span>
              {d.tilbud && (
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
            Indkøbslisten er skrevet <span style={{ color: SAGE }}>✓</span>
          </p>
          <p style={{ fontSize: 11, color: ON_FOREST_MUTED, marginTop: 2 }}>
            Ugens 5 madpakker er planlagt
          </p>
        </div>
        <span className="shrink-0 font-semibold text-[11px] px-2 py-1" style={{ borderRadius: 8, backgroundColor: SAGE, color: FOREST }}>
          Klar til ugen
        </span>
      </div>
    </div>
  )
}
