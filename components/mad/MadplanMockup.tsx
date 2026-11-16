'use client'

import { CARD_BORDER, CARD_SHADOW, CardHeader, DUR_MED, EASE_STANDARD, FOREST, HAIRLINE, ON_FOREST_MUTED, SAGE, SAGE_WASH, mockupEntranceStyle, revealPanelStyle, usePhaseLoop, type PhaseStep } from '@/components/seo/hjemKit'

/**
 * Animated app-UI card for /madplan-efter-tilbud (moved from altidmad.dk, 16/11): the app reads
 * the week's tilbudsaviser, the five dinners fill in with offer tags, and the plan lands as a
 * ready grocery list. No prices anywhere: the offer tags are qualitative on purpose. Same
 * content, food photos and sequence as the altidmad.dk card, on hjemKit.
 */

const PAPERS = [
  { name: 'Rema 1000', icon: '/mad/logos/rema.png' },
  { name: 'Netto', icon: '/mad/supermarkets/netto-disc.svg' },
  { name: 'Bilka', icon: '/mad/logos/bilka.png' },
  { name: 'Føtex', icon: '/mad/logos/foetex.png' },
]

// Same week as the altidmad.dk hero's MealPlanScreen: dishes and photos match.
const DAYS: { day: string; dish: string; img: string; offer?: boolean; tag?: string }[] = [
  { day: 'Man', dish: 'Kylling i karry', img: '/mad/food/kylling-karry.jpg', offer: true },
  { day: 'Tir', dish: 'Pasta med grønt', img: '/mad/food/pasta-groent.jpg', offer: true },
  { day: 'Ons', dish: 'Laksewok', img: '/mad/food/laksewok.jpg', offer: true },
  { day: 'Tor', dish: 'Vegetarlasagne', img: '/mad/food/lasagne.jpg', tag: 'Mindre kød' },
  { day: 'Fre', dish: 'Pizzafredag', img: '/mad/food/pizzafredag.jpg', tag: 'Favorit' },
]

// The altidmad.dk timing: one paper every 420 ms, then one dinner every 750 ms, 1200 ms after
// the last dinner the plan is ready, held for 5200 ms before the loop starts over.
type Phase = `scan-${number}` | `fill-${number}` | 'done'
const SCAN_MS = 420
const STEP_MS = 750
const SEQ: readonly PhaseStep<Phase>[] = [
  ...PAPERS.map((_, i): PhaseStep<Phase> => ({ p: `scan-${i}`, ms: SCAN_MS })),
  { p: `scan-${PAPERS.length}`, ms: STEP_MS },
  ...DAYS.slice(1).map((_, i): PhaseStep<Phase> => ({ p: `fill-${i + 1}`, ms: STEP_MS })),
  { p: `fill-${DAYS.length}`, ms: 1200 },
  { p: 'done', ms: 5200 },
]

export default function MadplanMockup() {
  const { ref, phase, at, reduced, entered } = usePhaseLoop(SEQ)
  const scannedCount = PAPERS.filter((_, i) => at(`scan-${i + 1}`)).length
  const filledCount = DAYS.filter((_, i) => at(`fill-${i + 1}`)).length
  const done = phase === 'done'
  const allScanned = scannedCount === PAPERS.length
  const fade = `opacity ${DUR_MED}ms ${EASE_STANDARD}`

  return (
    <div
      ref={ref}
      className="w-full max-w-[400px] rounded-[24px] px-5 pt-5 pb-4 hjem-motion-scope"
      style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, fontFamily: 'var(--font-onest)', ...mockupEntranceStyle(entered, reduced) }}
      role="img"
      aria-label="Eksempel: Altid Mad bygger ugens madplan efter tilbudsaviserne"
    >
      <CardHeader eyebrow="Ugens madplan" title="Planlagt efter ugens tilbud" icon="/services/icon-mad.svg" />

      {/* The tilbudsaviser being read, chain by chain */}
      <div className="rounded-2xl px-3.5 py-2.5 mb-3 flex items-center gap-2.5" style={{ backgroundColor: SAGE_WASH, border: `1px solid ${CARD_BORDER}` }}>
        <span className="flex-1 min-w-0 truncate text-[11.5px] font-semibold" style={{ color: FOREST }}>
          {allScanned ? 'Tilbudsaviserne er læst' : 'Læser tilbudsaviserne …'}
        </span>
        <span className="flex items-center gap-1.5">
          {PAPERS.map((p, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={p.name}
              src={p.icon}
              alt=""
              width={20}
              height={20}
              className="object-contain"
              style={{ width: 20, height: 20, borderRadius: 6, opacity: i < scannedCount ? 1 : 0.25, transition: fade }}
            />
          ))}
        </span>
      </div>

      {/* The five dinners */}
      <div className="rounded-2xl overflow-hidden mb-3" style={{ backgroundColor: '#ffffff', border: `1px solid ${CARD_BORDER}` }}>
        {DAYS.map((d, i) => {
          const filled = i < filledCount
          return (
            <div
              key={d.day}
              className="flex items-center gap-2.5 px-3.5 py-2.5"
              style={{
                borderBottom: i < DAYS.length - 1 ? `1px solid ${HAIRLINE}` : 'none',
                backgroundColor: filled && d.offer ? SAGE_WASH : 'transparent',
                opacity: filled ? 1 : 0.35,
                transition: `background-color ${DUR_MED}ms ${EASE_STANDARD}, ${fade}`,
              }}
            >
              <span className="shrink-0 grid place-items-center font-bold uppercase" style={{ width: 30, height: 24, borderRadius: 7, fontSize: 9.5, backgroundColor: SAGE_WASH, color: FOREST }}>
                {d.day}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.img} alt="" width={24} height={24} className="shrink-0 object-cover" style={{ width: 24, height: 24, borderRadius: 7, opacity: filled ? 1 : 0, transition: fade }} />
              <span className="flex-1 min-w-0 truncate font-semibold text-[13.5px]" style={{ color: 'var(--text-dark)', opacity: filled ? 1 : 0, transition: fade }}>
                {d.dish}
              </span>
              {d.offer && (
                <span
                  className="shrink-0 font-semibold text-[10px] uppercase px-2 py-1"
                  style={{ borderRadius: 6, backgroundColor: SAGE, color: FOREST, letterSpacing: '0.4px', opacity: filled ? 1 : 0, transition: fade }}
                >
                  Tilbud
                </span>
              )}
              {d.tag && (
                <span className="shrink-0 font-semibold text-[10px] px-2 py-1" style={{ borderRadius: 6, backgroundColor: 'rgba(26,61,34,0.08)', color: FOREST, opacity: filled ? 1 : 0, transition: fade }}>
                  {d.tag}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Status card: the plan turns into a ready grocery list */}
      <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: FOREST, ...revealPanelStyle(done) }} aria-hidden={!done}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: SAGE, marginBottom: 2 }}>Automatisk</p>
            <p className="font-bold text-[15px] leading-tight text-white">Madplanen er klar</p>
            <p style={{ fontSize: 11, color: ON_FOREST_MUTED, marginTop: 2 }}>Indkøbslisten er skrevet efter ugens tilbud</p>
          </div>
          <span className="shrink-0 font-semibold text-[11px] px-2 py-1" style={{ borderRadius: 8, backgroundColor: SAGE, color: FOREST }}>
            3 retter på tilbud
          </span>
        </div>
        <p style={{ fontSize: 11, fontWeight: 600, color: SAGE, marginTop: 6 }}>Se indkøbslisten →</p>
      </div>
    </div>
  )
}
