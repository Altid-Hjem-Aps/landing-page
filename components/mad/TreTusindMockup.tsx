'use client'

import { CARD_BORDER, CARD_SHADOW, CardHeader, EASE_OUT, FOREST, HAIRLINE, ON_FOREST_MUTED, SAGE, mockupEntranceStyle, useMockupStart, AMBER } from '@/components/seo/hjemKit'

/**
 * The regneeksempel card on /mad-for-3000-om-maaneden (moved from altidmad.dk, 16 Nov 2026):
 * 3.000 kr./md as a weekly figure held against the verified cheapest basket for a 2+2 household.
 * All figures are either transparent arithmetic on the goal (3.000 × 12 / 52 ≈ 692) or the
 * verified Q3 basket number, nothing else. Same content and motion as the Altid Mad original, in
 * Altid Hjem's colours.
 */

// 3.000 kr./md × 12 / 52 = 692,31 kr./uge; basket 782,70 - 692,31 = 90,39.
const GOAL_WEEK = 692
const BASKET_WEEK = 782.7
const GAP_WEEK = 90

const ROWS = [
  { label: 'Målet: 3.000 kr. pr. måned', value: `${GOAL_WEEK} kr. pr. uge`, width: (GOAL_WEEK / BASKET_WEEK) * 100, bar: 'rgba(26,61,34,0.45)' },
  { label: 'Billigste testkurv, 2 voksne + 2 teenagere', value: '782,70 kr. pr. uge', width: 100, bar: FOREST },
]

export default function TreTusindMockup() {
  const { ref, running, reduced, entered } = useMockupStart()
  // The bars grow while the card is in view (and regrow on the next visit); reduced motion shows
  // them at full length with no transition.
  const grown = running || reduced

  return (
    <div
      ref={ref}
      className="w-full max-w-[440px] rounded-[24px] px-5 pt-5 pb-4 hjem-motion-scope"
      style={{ background: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-onest)', ...mockupEntranceStyle(entered, reduced) }}
      role="img"
      aria-label="Regneeksempel: 3.000 kr. om måneden sammenlignet med den billigste testkurv"
    >
      <CardHeader eyebrow="Regneeksempel" title="Hvor langt rækker 3.000 kr.?" icon="/services/icon-mad.svg" />

      <div className="rounded-2xl overflow-hidden mb-3" style={{ background: '#ffffff', border: `1px solid ${CARD_BORDER}` }}>
        {ROWS.map((r, i) => (
          <div key={r.label} className="px-3.5 py-2.5" style={{ borderBottom: i < ROWS.length - 1 ? `1px solid ${HAIRLINE}` : 'none' }}>
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="min-w-0 truncate font-semibold text-[13px]" style={{ color: 'var(--text-dark)' }}>
                {r.label}
              </span>
              <span className="shrink-0 text-[12.5px] font-bold tabular-nums" style={{ color: FOREST }}>
                {r.value}
              </span>
            </div>
            <div className="h-[6px] rounded-full overflow-hidden" style={{ background: HAIRLINE }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${r.width}%`,
                  background: r.bar,
                  transform: grown ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: reduced ? 'none' : `transform 900ms ${EASE_OUT} ${i * 120}ms`,
                }}
              />
            </div>
          </div>
        ))}
        <div className="px-3.5 py-2.5 flex items-center justify-between gap-3" style={{ background: AMBER.wash }}>
          <span className="min-w-0 font-semibold text-[13px]" style={{ color: AMBER.ink }}>
            Gab i regneeksemplet
          </span>
          <span className="shrink-0 font-semibold text-[11px] px-2 py-1" style={{ borderRadius: 6, background: '#ffffff', color: AMBER.ink }}>
            Ca. {GAP_WEEK} kr. pr. uge
          </span>
        </div>
      </div>

      <div className="rounded-2xl px-4 py-3" style={{ background: FOREST }}>
        <p style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: SAGE, marginBottom: 2 }}>Ærligt svar</p>
        <p className="font-bold text-[15px] leading-tight text-white">Ambitiøst for en familie, muligt for mindre husstande</p>
        <p style={{ fontSize: 11, color: ON_FOREST_MUTED, marginTop: 2 }}>Selv den billigste kæde i testen ligger over målet for en 2+2-husstand</p>
      </div>

      <p className="text-[10px] mt-3 leading-relaxed" style={{ color: 'var(--text-light)' }}>
        Regneeksempel: 3.000 kr. pr. måned svarer til ca. 692 kr. pr. uge (× 12 ÷ 52). Kurvtallet er fra vores Q3-pristjek af samme kurv med 23 varer hos 13 kæder.
      </p>
    </div>
  )
}
