'use client'

import Image from 'next/image'
import PhoneShell from '@/components/PhoneShell'
import StoreBadges from '@/components/StoreBadges'
import { SCREENS, screenSrc } from '@/lib/screen-captures'
import { hourSpan, priceWith, type ElpriserData } from '@/lib/elpriser'

/**
 * The app next to today's prices on /hvornar-er-strommen-billigst: a real
 * capture of Altid Energi in a phone (example data, a still), and under it a
 * plain card with TODAY'S REAL prices (Øst/Radius, full price with transport,
 * taxes and VAT). Live numbers never go in a picture of the app, and the
 * picture's numbers never go in the live card. The CTA is the store badges.
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

export default function ElprisAppMockup({ data }: Props) {
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
          Det kræver tid at holde øje med elprisen hver dag. I Altid Hjem-appen ser du elprisen
          time for time og får besked, når strømmen er billig.
        </p>
        <p className="mb-3">
          Samtidig samler appen madplan, strøm, forsikring og økonomi ét sted, så du får ét overblik,
          ét login.
        </p>
        <p className="mb-5">Appen er gratis at hente i App Store og Google Play.</p>
        <StoreBadges position="bottom" />
      </div>

      <div className="shrink-0 w-64 sm:w-72" style={{ fontFamily: 'var(--font-dm-sans)' }}>
        {/* Cut above the price area picker: the picture is example data for one
            area, the card below is today's prices for another. */}
        <div
          role="img"
          aria-label="Altid Energi i appen med elprisen time for time"
          style={{ aspectRatio: '1 / 0.86', minHeight: 0, clipPath: 'inset(-100px -100px 0 -100px)' }}
        >
          <PhoneShell>
            <Image
              src={screenSrc('energi.home')}
              alt=""
              width={SCREENS['energi.home'].width}
              height={SCREENS['energi.home'].height}
              unoptimized
              className="h-auto w-full"
            />
          </PhoneShell>
        </div>
        <p className="mt-2 mb-4 text-center text-[12px]" style={{ color: 'var(--app-ink-muted)' }}>
          Skærmbillede fra appen med eksempeldata.
        </p>

        {/* Today's real prices, as a plain card outside the phone. */}
        <div
          aria-hidden="true"
          className="rounded-2xl p-4"
          style={{
            background: '#ffffff',
            border: '1px solid var(--app-border)',
            boxShadow: '0 10px 28px rgba(22,50,35,0.10)',
          }}
        >
          <p className="text-[13px] font-semibold" style={{ color: 'var(--app-forest)' }}>
            Elprisen i dag i Østdanmark
          </p>
          {visTal && billigst && dyrest && (
            <p className="mt-0.5 mb-2.5 text-[12px] leading-snug" style={{ color: 'var(--app-ink-muted)' }}>
              Billigst kl. {hourSpan(billigst.hour, '-')}, {pctBilligere} % lavere end kl. {dyrest.hour}.
            </p>
          )}
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
                          ? 'var(--app-forest)'
                          : p.hour === dyrest.hour
                            ? 'rgba(192,57,43,0.75)'
                            : 'rgba(22,50,35,0.2)',
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
                      color: p.hour === billigst.hour ? 'var(--app-forest)' : 'var(--app-ink-muted)',
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
            <p className="mt-0.5 text-[12px] leading-snug" style={{ color: 'var(--app-ink-muted)' }}>
              Typisk billigst om natten og midt på dagen, dyrest kl. 17-21.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
