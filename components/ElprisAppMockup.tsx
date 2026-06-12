'use client'

import * as amplitude from '@amplitude/analytics-browser'
import { hourSpan, priceWith, type ElpriserData } from '@/lib/elpriser'

/**
 * App-smagsprøve til elpris-siden /hvornar-er-strommen-billigst: to fritsvævende kort — en
 * notifikation med et konkret råd og en mini-prisgraf — der bruger DAGENS
 * RIGTIGE priser (Øst/Radius, fuld pris inkl. transport, afgifter og moms),
 * så rådet altid passer: billigste time, og hvor meget billigere den er end
 * dagens dyreste. Ikon = Energi-ikonet fra forsidens Services-sektion.
 * CTA'en ruller ned til BottomCta-formularen (id "venteliste2").
 */

interface Props {
  data: ElpriserData | null
}

const ALLE_KOMPONENTER = { elafgift: true, transmission: true, moms: true } as const

/** Fuld forbrugerpris pr. time for Øst (Radius) — samme prisformel som grafen (lib/elpriser). */
function fuldePriser(data: ElpriserData): { hour: number; price: number }[] {
  return data.hours.flatMap((h) =>
    h.dk2 === null
      ? []
      : [
          {
            hour: h.hour,
            price: priceWith(h.dk2, h.dk2Tax ?? 0, h.dk2Trans ?? 0, h.dk2Dist ?? 0, ALLE_KOMPONENTER),
          },
        ],
  )
}

// Energi-ikonet fra forsidens Services-sektion (pære med stik).
function EnergiIkon() {
  return (
    <svg className="w-9 h-9 shrink-0" viewBox="0 0 34.44 34.44" aria-hidden="true">
      <circle cx="17.22" cy="17.22" r="17.22" fill="#8fccff" />
      <path
        fill="#003c16"
        d="M20.83,25.03c0,.16-.06.31-.18.42-.11.11-.27.18-.42.18h-6.01c-.16,0-.31-.06-.42-.18-.11-.11-.18-.27-.18-.42s.06-.31.18-.42c.11-.11.27-.18.42-.18h6.01c.16,0,.31.06.42.18.11.11.18.27.18.42ZM23.83,15.42c0,1-.22,1.99-.66,2.89-.44.9-1.08,1.69-1.87,2.31-.15.11-.27.26-.35.43-.08.17-.13.35-.13.54v.45c0,.32-.13.62-.35.85-.23.23-.53.35-.85.35h-4.81c-.32,0-.62-.13-.85-.35-.23-.23-.35-.53-.35-.85v-.45c0-.18-.04-.36-.12-.53-.08-.16-.2-.31-.34-.42-.79-.61-1.42-1.4-1.86-2.29-.44-.9-.67-1.88-.67-2.88-.02-3.58,2.87-6.56,6.45-6.65.88-.02,1.76.13,2.58.46.82.32,1.57.81,2.2,1.42.63.62,1.13,1.35,1.47,2.16.34.81.52,1.69.52,2.57ZM22.63,15.42c0-.72-.14-1.44-.42-2.1-.28-.66-.69-1.27-1.21-1.77-.52-.5-1.13-.9-1.8-1.16-.67-.26-1.39-.39-2.11-.37-2.93.07-5.29,2.51-5.28,5.44,0,.82.19,1.62.55,2.35.36.73.88,1.37,1.53,1.88.29.23.52.51.68.84.16.33.24.69.24,1.06v.45h1.8v-3.36l-2.23-2.23c-.11-.11-.18-.27-.18-.43s.06-.31.18-.43.27-.18.43-.18.31.06.43.18l1.98,1.98,1.98-1.98c.06-.06.12-.1.2-.13.07-.03.15-.05.23-.05s.16.02.23.05c.07.03.14.07.2.13.06.06.1.12.13.2.03.07.05.15.05.23s-.02.16-.05.23c-.03.07-.07.14-.13.2l-2.23,2.23v3.36h1.8v-.45c0-.37.09-.73.25-1.06.16-.33.4-.62.69-.84.65-.5,1.17-1.15,1.53-1.89.36-.74.54-1.55.54-2.37Z"
      />
    </svg>
  )
}

export default function ElprisAppMockup({ data }: Props) {
  function handleCTA() {
    amplitude.track('Waitlist CTA Clicked', { source: 'elpris-mockup' })
    document.getElementById('venteliste2')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // Dagens rigtige tal. Mangler data — eller giver negative priser meningsløse
  // procenter (det sker på meget blæsende dage) — viser kortene generisk tekst
  // i stedet for at OPDIGTE konkrete timer og besparelser.
  const priser = data ? fuldePriser(data) : []
  const harData = priser.length > 0
  const billigst = harData ? priser.reduce((a, b) => (b.price < a.price ? b : a)) : null
  const dyrest = harData ? priser.reduce((a, b) => (b.price > a.price ? b : a)) : null
  const visTal = billigst !== null && dyrest !== null && dyrest.price > 0 && billigst.price > 0
  const pctBilligere = visTal ? Math.round((1 - billigst.price / dyrest.price) * 100) : 0
  const maxPris = visTal ? dyrest.price : 1

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-10">
      {/* Tekst + CTA */}
      <div className="flex-1">
        <p className="mb-3">
          Det kræver tid at holde øje med elprisen hver dag. Det er netop én af de ting, vi
          bygger Altid Hjem-appen til. Appen følger elprisen for dig og giver konkrete råd.
        </p>
        <p className="mb-3">
          Samtidig samler Altid Hjem hjemmets faste udgifter ét sted, så du får bedre overblik
          over strøm, mobil, forsikring, mad og mere.
        </p>
        <p className="mb-5">
          Skriv dig gratis på ventelisten, så får du besked, når appen er klar.
        </p>
        <button
          type="button"
          onClick={handleCTA}
          className="text-sm font-semibold px-5 py-2.5 rounded-full transition-opacity hover:opacity-90"
          style={{
            background: 'var(--sage)',
            color: 'var(--forest)',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            cursor: 'pointer',
          }}
        >
          Skriv dig gratis på ventelisten →
        </button>
      </div>

      {/* To fritsvævende kort — drevet af dagens rigtige priser */}
      <div aria-hidden="true" className="shrink-0 w-64 sm:w-72 space-y-4">
        {/* Notifikation med dagens konkrete råd */}
        <div
          className="rounded-2xl p-4 flex items-start gap-3"
          style={{
            background: '#ffffff',
            border: '1px solid rgba(26,61,34,0.1)',
            boxShadow: '0 10px 28px rgba(26,61,34,0.16)',
            transform: 'rotate(-1.5deg)',
          }}
        >
          <EnergiIkon />
          {visTal && billigst && dyrest ? (
            <div>
              <p className="text-xs font-bold mb-1" style={{ color: 'var(--forest)' }}>
                Strømmen er billigst kl. {hourSpan(billigst.hour)}
              </p>
              <p className="text-xs leading-snug" style={{ color: 'rgba(26,61,34,0.65)' }}>
                Kør opvaskeren kl. {billigst.hour} og spar penge — elprisen er {pctBilligere} %
                lavere end kl. {dyrest.hour}.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs font-bold mb-1" style={{ color: 'var(--forest)' }}>
                Flyt forbruget til de billige timer
              </p>
              <p className="text-xs leading-snug" style={{ color: 'rgba(26,61,34,0.65)' }}>
                Strømmen er typisk billigst om natten og midt på dagen — appen siger til, når
                det er nu.
              </p>
            </div>
          )}
        </div>

        {/* Mini-prisgraf med dagens 24 timer */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: '#ffffff',
            border: '1px solid rgba(26,61,34,0.1)',
            boxShadow: '0 10px 28px rgba(26,61,34,0.14)',
            transform: 'rotate(1deg)',
          }}
        >
          <p className="text-[10px] font-semibold mb-2" style={{ color: 'rgba(26,61,34,0.55)' }}>
            Elprisen i dag
          </p>
          {visTal && billigst && dyrest ? (
            <>
              <div className="flex items-end gap-[2px] h-14">
                {priser.map((p) => (
                  <div
                    key={p.hour}
                    className="flex-1 rounded-t-[2px]"
                    style={{
                      height: `${Math.max((Math.max(p.price, 0) / maxPris) * 100, 4)}%`,
                      background:
                        p.hour === billigst.hour
                          ? '#5cb434'
                          : p.hour === dyrest.hour
                            ? 'rgba(214,69,65,0.75)'
                            : 'rgba(168,224,99,0.55)',
                    }}
                  />
                ))}
              </div>
              <div className="flex gap-[2px] mt-1">
                {priser.map((p) => (
                  <span
                    key={p.hour}
                    className="flex-1 text-center text-[6.5px] tabular-nums"
                    style={{
                      color: p.hour === billigst.hour ? '#3e8c1f' : 'rgba(26,61,34,0.4)',
                      fontWeight: p.hour === billigst.hour ? 700 : 400,
                      opacity: p.hour % 4 === 0 || p.hour === billigst.hour ? 1 : 0,
                    }}
                  >
                    {String(p.hour).padStart(2, '0')}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-[10px]" style={{ color: 'rgba(26,61,34,0.5)' }}>
              Billigst om natten og midt på dagen — dyrest kl. 17-21.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
