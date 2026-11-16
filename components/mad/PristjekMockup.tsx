'use client'

import { CARD_BORDER, CARD_SHADOW, CardHeader, DUR_FAST, DUR_MED, EASE_OVERSHOOT, EASE_STANDARD, FOREST, HAIRLINE, ON_FOREST_MUTED, SAGE, SAGE_WASH, mockupEntranceStyle, revealPanelStyle, staggerDelay, usePhaseLoop, type PhaseStep, AMBER } from '@/components/seo/hjemKit'

/**
 * Animated app-UI card for /billigste-supermarked (moved from altidmad.dk, 16/11): the app
 * scans the week's basket across the 13 chains, highlights the cheapest and dearest, and lands
 * on the yearly saving. Same content and sequence as the altidmad.dk card, on hjemKit.
 *
 * Numbers are the verified Q3 figures only: the intermediate chains show a checkmark, never an
 * invented price.
 */

// Verified basket results: only Lidl (cheapest) and Min Købmand (dearest) carry numbers; the
// other chains were scanned but their totals are not published. icon = a chain logo under
// /mad/ where one exists; initials otherwise.
const CHAINS: { name: string; icon?: string; initials?: string; result?: 'cheapest' | 'dearest' }[] = [
  { name: 'Lidl', icon: '/mad/logos/lidl.png', result: 'cheapest' },
  { name: 'Rema 1000', icon: '/mad/logos/rema.png' },
  { name: 'Netto', icon: '/mad/supermarkets/netto-disc.svg' },
  { name: '365discount', initials: '365' },
  { name: 'Meny', icon: '/mad/logos/meny.png' },
  { name: 'Bilka', icon: '/mad/logos/bilka.png' },
  { name: 'Kvickly', initials: 'K' },
  { name: 'Super Brugsen', initials: 'SB' },
  { name: 'Føtex', icon: '/mad/logos/foetex.png' },
  { name: 'Brugsen', initials: 'B' },
  { name: 'Nemlig.com', initials: 'N' },
  { name: 'Spar', icon: '/mad/logos/spar.png' },
  { name: 'Min Købmand', initials: 'MK', result: 'dearest' },
]

// The altidmad.dk timing: one chain every 550 ms, 500 ms after the last one the cheapest and
// dearest light up, 1800 ms later the saving, held for 5200 ms before the loop starts over.
type Phase = `scan-${number}` | 'highlight' | 'saving'
const SCAN_MS = 550
const SEQ: readonly PhaseStep<Phase>[] = [
  ...CHAINS.map((_, i): PhaseStep<Phase> => ({ p: `scan-${i}`, ms: SCAN_MS })),
  { p: `scan-${CHAINS.length}`, ms: 500 },
  { p: 'highlight', ms: 1800 },
  { p: 'saving', ms: 5200 },
]

export default function PristjekMockup() {
  const { ref, phase, at, reduced, entered } = usePhaseLoop(SEQ)
  const scannedCount = CHAINS.filter((_, i) => at(`scan-${i + 1}`)).length
  const highlight = at('highlight')
  const saving = phase === 'saving'
  // During the wrap back to phase 0 every keyed animation is suppressed so the card snaps clean.
  const animate = phase !== SEQ[0].p && !reduced

  return (
    <div
      ref={ref}
      className="w-full max-w-[400px] rounded-[24px] px-5 pt-5 pb-4 hjem-motion-scope"
      style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-onest)', ...mockupEntranceStyle(entered, reduced) }}
      role="img"
      aria-label="Eksempel: Altid Mad sammenligner ugens kurv på tværs af kæderne"
    >
      <CardHeader eyebrow="Ugens pristjek" title="Samme kurv · 23 varer · 13 kæder" icon="/services/icon-mad.svg" />

      <div className="rounded-2xl overflow-hidden mb-3" style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}` }}>
        {CHAINS.map((c, i) => {
          const scanned = i < scannedCount
          const isCheapest = c.result === 'cheapest' && highlight
          const isDearest = c.result === 'dearest' && highlight
          return (
            <div
              key={c.name}
              className="flex items-center gap-2.5 px-3.5 py-2.5"
              style={{
                borderBottom: i < CHAINS.length - 1 ? `1px solid ${HAIRLINE}` : 'none',
                backgroundColor: isCheapest ? SAGE_WASH : isDearest ? AMBER.wash : 'transparent',
                opacity: scanned ? 1 : 0.35,
                transition: `background-color ${DUR_MED}ms ${EASE_STANDARD}, opacity ${DUR_MED}ms ${EASE_STANDARD}`,
              }}
            >
              {c.icon ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={c.icon} alt="" width={24} height={24} className="shrink-0 object-contain" style={{ width: 24, height: 24, borderRadius: 7 }} />
              ) : (
                <span className="shrink-0 grid place-items-center font-bold" style={{ width: 24, height: 24, borderRadius: 7, fontSize: 10, backgroundColor: SAGE_WASH, color: FOREST }}>
                  {c.initials}
                </span>
              )}
              <span className="flex-1 min-w-0 truncate font-semibold text-[13.5px]" style={{ color: 'var(--text-dark)' }}>
                {c.name}
              </span>
              {isCheapest ? (
                <span className="shrink-0 font-semibold text-[11px] px-2 py-1" style={{ borderRadius: 6, backgroundColor: SAGE, color: FOREST, animation: animate ? `hjem-pop-in ${DUR_FAST}ms ${EASE_OVERSHOOT} both` : 'none' }}>
                  Billigst · 782,70 kr.
                </span>
              ) : isDearest ? (
                <span className="shrink-0 font-semibold text-[11px] px-2 py-1" style={{ borderRadius: 6, backgroundColor: AMBER.wash, color: AMBER.ink, animation: animate ? `hjem-pop-in ${DUR_FAST}ms ${EASE_OVERSHOOT} both` : 'none' }}>
                  Dyrest · 1.313,94 kr.
                </span>
              ) : (
                <span className="shrink-0 text-[12px] tabular-nums" style={{ color: scanned ? FOREST : 'var(--text-light)' }}>
                  <span
                    key={scanned ? 'on' : 'off'}
                    style={{ display: 'inline-block', animation: animate && scanned ? `hjem-glyph-in ${DUR_FAST}ms ${EASE_OVERSHOOT} both` : 'none', animationDelay: staggerDelay(1, animate) }}
                  >
                    {scanned ? '✓' : '· · ·'}
                  </span>
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="rounded-2xl px-4 py-3 flex items-center justify-between gap-3" style={{ backgroundColor: FOREST, ...revealPanelStyle(saving) }} aria-hidden={!saving}>
        <div className="min-w-0">
          <p style={{ fontSize: 11, color: ON_FOREST_MUTED, marginBottom: 1 }}>Forskel på samme kurv · 531,24 kr. pr. uge</p>
          <p className="font-bold text-[17px] leading-tight text-white">
            Op til <span style={{ color: SAGE }}>27.624 kr.</span> om året
          </p>
        </div>
        <span className="shrink-0 font-semibold text-[11px] px-2 py-1" style={{ borderRadius: 8, backgroundColor: SAGE, color: FOREST }}>
          Ugens besparelse
        </span>
      </div>
    </div>
  )
}
