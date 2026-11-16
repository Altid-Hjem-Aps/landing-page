'use client'

import { CARD_BORDER, CARD_SHADOW, CardHeader, DUR_FAST, DUR_MED, EASE_OVERSHOOT, EASE_STANDARD, FOREST, HAIRLINE, SAGE, SAGE_WASH, mockupEntranceStyle, revealPanelStyle, staggerDelay, usePhaseLoop, type PhaseStep } from '@/components/seo/hjemKit'

/**
 * Animated app-UI card for /spar-penge-paa-dagligvarer (moved from altidmad.dk, 16/11): the five
 * habits from the guide tick themselves off as a weekly plan, and the card lands on "ugens plan
 * er lagt". Qualitative on purpose: no numbers. Same content and sequence as the altidmad.dk
 * card, on hjemKit.
 */

const HABITS = [
  'Vælg hovedbutik efter jeres samlede kurv',
  'Læg madplanen efter ugens tilbud',
  'Skriv indkøbslisten, før I går hjemmefra',
  'Handl stort ind én gang om ugen',
  'Planlæg en resterdag i ugen',
]

// The altidmad.dk timing: one habit every 800 ms, 1300 ms after the last one the plan is laid,
// held for 5200 ms before the loop starts over.
type Phase = `check-${number}` | 'done'
const STEP_MS = 800
const SEQ: readonly PhaseStep<Phase>[] = [
  ...HABITS.map((_, i): PhaseStep<Phase> => ({ p: `check-${i}`, ms: STEP_MS })),
  { p: `check-${HABITS.length}`, ms: 1300 },
  { p: 'done', ms: 5200 },
]

export default function SparVanerMockup() {
  const { ref, phase, at, reduced, entered } = usePhaseLoop(SEQ)
  const checkedCount = HABITS.filter((_, i) => at(`check-${i + 1}`)).length
  const done = phase === 'done'
  // During the wrap back to phase 0 every keyed animation is suppressed so the card snaps clean.
  const animate = phase !== SEQ[0].p && !reduced

  return (
    <div
      ref={ref}
      className="w-full max-w-[400px] rounded-[24px] px-5 pt-5 pb-4 hjem-motion-scope"
      style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-onest)', ...mockupEntranceStyle(entered, reduced) }}
      role="img"
      aria-label="Eksempel: ugens fem sparevaner sat op som en plan"
    >
      <CardHeader eyebrow="Ugens sparevaner" title="Fem vaner, én plan" icon="/services/icon-mad.svg" />

      <div className="rounded-2xl overflow-hidden mb-3" style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}` }}>
        {HABITS.map((habit, i) => {
          const checked = i < checkedCount
          return (
            <div
              key={habit}
              className="flex items-center gap-2.5 px-3.5 py-2.5"
              style={{
                borderBottom: i < HABITS.length - 1 ? `1px solid ${HAIRLINE}` : 'none',
                backgroundColor: checked ? SAGE_WASH : 'transparent',
                opacity: checked ? 1 : 0.45,
                transition: `background-color ${DUR_MED}ms ${EASE_STANDARD}, opacity ${DUR_MED}ms ${EASE_STANDARD}`,
              }}
            >
              <span
                className="shrink-0 grid place-items-center font-bold"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 7,
                  fontSize: 12,
                  backgroundColor: checked ? SAGE : SAGE_WASH,
                  color: FOREST,
                  transition: `background-color ${DUR_MED}ms ${EASE_STANDARD}`,
                }}
              >
                <span
                  key={checked ? 'on' : 'off'}
                  style={{ display: 'inline-block', animation: animate && checked ? `hjem-glyph-in ${DUR_FAST}ms ${EASE_OVERSHOOT} both` : 'none', animationDelay: staggerDelay(1, animate) }}
                >
                  {checked ? '✓' : i + 1}
                </span>
              </span>
              <span className="flex-1 min-w-0 font-semibold text-[13.5px]" style={{ color: 'var(--text-dark)' }}>
                {habit}
              </span>
            </div>
          )
        })}
      </div>

      <div className="rounded-2xl px-4 py-3 flex items-center justify-between gap-3" style={{ backgroundColor: FOREST, ...revealPanelStyle(done) }} aria-hidden={!done}>
        <div className="min-w-0">
          <p style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: SAGE, marginBottom: 2 }}>Klar til ugen</p>
          <p className="font-bold text-[15px] leading-tight text-white">
            Ugens plan er lagt <span style={{ color: SAGE }}>✓</span>
          </p>
        </div>
        <span className="shrink-0 font-semibold text-[11px] px-2 py-1" style={{ borderRadius: 8, backgroundColor: SAGE, color: FOREST }}>
          5 vaner
        </span>
      </div>
    </div>
  )
}
