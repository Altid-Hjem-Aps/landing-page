import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import BottomCta from '@/components/sections/BottomCta'
import Footer from '@/components/Footer'
import GebyrMockup from '@/components/GebyrMockup'

export const metadata: Metadata = {
  title: 'Billigste elselskab, sådan sammenligner du – Altid Hjem',
  description:
    'Find det billigste elselskab ved at sammenligne spotpris, tillæg og gebyrer for dit forbrug. Få en enkel guide, og skriv dig på ventelisten.',
  alternates: { canonical: 'https://altidhjem.dk/billigste-elselskab' },
  openGraph: {
    title: 'Hvilket elselskab er billigst?',
    description:
      'Find det billigste elselskab ved at sammenligne spotpris, tillæg og gebyrer for dit forbrug. Få en enkel guide, og skriv dig på ventelisten.',
    url: 'https://altidhjem.dk/billigste-elselskab',
    type: 'article',
  },
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="underline underline-offset-4 hover:opacity-70" style={{ color: 'var(--forest)' }}>
      {children}
    </Link>
  )
}

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: { q: string; a: string[] }[] = [
  {
    q: 'Hvilket elselskab er billigst?',
    a: [
      'Det afhænger af dit forbrug og den samlede pris inklusive tillæg og gebyrer.',
      'En gebyrfri aftale gør sammenligningen enklere, men du bør altid beregne årsprisen ud fra dit eget forbrug.',
    ],
  },
  {
    q: 'Hvad betyder et gebyrfrit elselskab?',
    a: [
      'Det betyder, at elselskabet ikke opkræver faste gebyrer eller abonnement.',
      'Du betaler fortsat for selve strømmen, nettariffer, elafgift og eventuelle tydeligt oplyste pristillæg.',
    ],
  },
  {
    q: 'Hvorfor er kWh-prisen ikke hele sandheden?',
    a: [
      'Fordi din samlede elpris også indeholder nettariffer, elafgift, tillæg og eventuelle faste gebyrer.',
      'En lav kWh-pris kan derfor ende med at være dyrere, hvis aftalen har et månedligt abonnement eller andre omkostninger.',
    ],
  },
  {
    q: 'Kan jeg skifte elselskab uden problemer?',
    a: [
      'Ja, et skift er normalt enkelt, og dit netselskab samt den fysiske levering af strøm forbliver det samme.',
      'Læs dog bindingsvilkår og opsigelsesbetingelser hos dit nuværende selskab, før du skifter.',
    ],
  },
  {
    q: 'Hvornår er strømmen billigst?',
    a: [
      'Strømmen er billigst i de timer, hvor den aktuelle spotpris er lavest.',
      'Tidspunktet varierer fra dag til dag, så tjek næste døgns timepriser, hvis du har en variabel aftale.',
    ],
  },
  {
    q: 'Hvad er Altid Hjem?',
    a: [
      'Altid Hjem er en kommende dansk app, der skal kunne samle hjemmets faste udgifter til el, mobil, forsikring, opladning, alarm og mad.',
      'Den er bygget omkring idéen om ét overblik, ét login.',
    ],
  },
  {
    q: 'Koster det noget at skrive sig på ventelisten?',
    a: [
      'Nej, det koster ikke noget at skrive sig på ventelisten til Altid Hjem.',
      'Ventelisten er åben på altidhjem.dk.',
    ],
  },
]

export default function BilligsteElselskab() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a.join(' ') },
    })),
  }

  return (
    <>
      <Nav
        banner={{
          longPrefix: 'Elselskabets gebyrer er den oversete del af elregningen. ',
          shortPrefix: 'Betaler du gebyrer for din strøm? ',
          source: 'billigste-elselskab-banner',
          cta: 'Se hvad du kan gøre →',
        }}
      />
      <script
        type="application/ld+json"
        // '<' escapes som \u003c: JSON.stringify escaper ikke '<', så en
        // fremtidig FAQ-tekst med '</script>' kunne ellers bryde ud af tagget.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
      <main className="min-h-screen" style={{ fontFamily: 'var(--font-onest)' }}>
        {/* pt-32 (128px) = kampagnebanner (~36px) + nav (84px) + luft. */}
        <div className="pt-32 pb-20" style={{ background: 'var(--cream)' }}>
          <div className="max-w-2xl mx-auto px-6">

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm mb-10 transition-opacity hover:opacity-70"
              style={{ color: 'rgba(26,61,34,0.55)' }}
            >
              <span aria-hidden="true">←</span> Tilbage
            </Link>

            <h1 className="text-3xl sm:text-4xl font-bold mb-1 text-balance" style={{ color: 'var(--forest)' }}>
              Hvilket elselskab er billigst?
            </h1>
            <p className="text-xs mb-12" style={{ color: 'rgba(26,61,34,0.5)' }}>Opdateret: juli 2026 · Sammenlign selv elprodukter på <a href="https://elpris.dk" className="underline" target="_blank" rel="noopener noreferrer">elpris.dk</a></p>

            <div className="space-y-10 text-sm leading-relaxed text-pretty" style={{ color: 'rgba(26,61,34,0.75)' }}>

              {/* Kort svar — målrettet Googles "fremhævede uddrag". */}
              <section>
                <p className="mb-3">
                  Det billigste elselskab afhænger af den samlede pris for dit forbrug. Se på spotpris, tillæg og gebyrer, ikke kun den viste pris pr. kWh.
                </p>
                <p>
                  Spotprisen følger markedet, mens elselskabet især kan konkurrere på sit tillæg og sine gebyrer. Et gebyrfrit elselskab gør derfor sammenligningen enklere.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Hvad består elprisen egentlig af?
                </h2>
                <p className="mb-3">
                  Din elpris består af spotpris, nettariffer, elafgift samt elselskabets tillæg og gebyrer. Spotprisen bestemmes på elmarkedet, mens nettarifferne betales til dit netselskab, og afgifterne fastsættes politisk.
                </p>
                <p className="mb-3">
                  Elselskabet kan primært konkurrere på tillæg og gebyrer. Derfor kan to aftaler med samme type spotpris ende med forskellige samlede priser.
                </p>
                <p>
                  Når du sammenligner, bør du også undersøge, om prisen ændrer sig efter en introduktionsperiode. Den billigste aftale her og nu er ikke nødvendigvis billigst over et helt år.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Gebyrerne er den oversete del af elprisen
                </h2>
                <p className="mb-3">
                  Mange elselskaber opkræver et fast månedligt abonnement eller andre faste gebyrer. Beløbene kan se små ud hver for sig, men over et år bliver de til reelle penge, især ved et lavt elforbrug.
                </p>
                <p className="mb-3">
                  Altid Energi er gebyrfrit og har hverken faste gebyrer eller abonnement. Du betaler stadig for strøm, transport og afgifter, men ikke et fast beløb til Altid Energi ved siden af.
                </p>
                <p>
                  Se altid prislisten og aftalevilkårene. Kig efter abonnement, betalingsgebyr, tillæg pr. kWh og eventuelle priser, der kun gælder i en begrænset periode.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Sådan sammenligner du elselskaber rigtigt
                </h2>
                <p className="mb-3">
                  Tag udgangspunkt i den samlede årspris ved dit eget forventede forbrug. En lav pris pr. kWh kan blive opvejet af et fast abonnement, mens faste gebyrer betyder mere for en lille bolig end for et hjem med stort forbrug.
                </p>
                <p className="mb-3">
                  Sammenlign samme produkttype og samme periode. Kontrollér også, om beregningen inkluderer transport og afgifter, så du ikke sammenholder en delpris med en samlet pris.
                </p>
                <p>
                  Eksterne sammenligningssider har i 2026 placeret Altid Energi øverst og omtalt selskabet som Danmarks eneste gebyrfrie elselskab. Det er deres vurdering, og din billigste løsning afhænger fortsat af dit forbrug og de aktuelle aftalevilkår.
                </p>

                {/* Animeret side-komponent i gradient-rammen (forsikring-side-mønstret). */}
                <div
                  className="rounded-3xl flex justify-center py-10 px-4 mt-6"
                  style={{ background: 'linear-gradient(160deg, rgba(168,224,99,0.12) 0%, rgba(26,61,34,0.05) 100%)' }}
                >
                  <GebyrMockup />
                </div>
                <p className="text-xs mt-3 text-center" style={{ color: 'rgba(26,61,34,0.5)' }}>
                  Gebyrerne er den del af elregningen, selskabet selv bestemmer. Hos Altid Energi er de 0 kr. Illustration, ikke et skærmbillede fra appen.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Tidspunktet påvirker også din elpris
                </h2>
                <p className="mb-3">
                  Har du en aftale med variabel timepris, svinger spotprisen gennem døgnet. Du kan ofte reducere din udgift ved at flytte opvask, tøjvask eller opladning til timer med lavere spotpris.
                </p>
                <p>
                  Det billigste tidspunkt er ikke det samme hver dag. Se, hvordan priserne varierer, i guiden til <A href="/hvornar-er-strommen-billigst">hvornår strømmen er billigst</A>.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  El er kun én af hjemmets faste udgifter
                </h2>
                <p className="mb-3">
                  En billig elaftale skaber mest værdi, når den indgår i et samlet overblik over hjemmets økonomi. Mobil, forsikring, alarm, opladning og mad kan hver især rumme priser eller vilkår, der er værd at gennemgå.
                </p>
                <p>
                  Hvis du leder efter et samlet økonomioverblik, kan du læse om <A href="/spiir-alternativ">et alternativ til Spiir</A>. Har du elbil, kan vores guide til <A href="/hvad-koster-en-ladeboks">hvad en ladeboks koster</A> hjælpe dig med at vurdere både køb, installation og løbende aftaler.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Hvad Altid Hjem skal kunne
                </h2>
                <p className="mb-3">
                  Altid Hjem er en kommende dansk app, der er bygget til at samle hjemmets faste udgifter til el, mobil, forsikring, opladning, alarm og mad. Målet er ét overblik, ét login, så du lettere skal kunne forstå priser og holde styr på aftaler.
                </p>
                <p className="mb-3">
                  Altid Energi er tilgængeligt i dag og har allerede mere end 15.000 danske kunder. Mobil, opladning, alarm og forsikring er på vej og skal kunne indgå i Altid Hjem, når de enkelte tjenester bliver tilgængelige.
                </p>
                <p>
                  Ventelisten til Altid Hjem er åben på altidhjem.dk. Du kan skrive dig op, hvis du vil følge med.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-4" style={{ color: 'var(--forest)' }}>
                  Ofte stillede spørgsmål
                </h2>
                <div className="space-y-3">
                  {FAQ.map((f) => (
                    <details
                      key={f.q}
                      className="group rounded-xl overflow-hidden transition-colors"
                      style={{ background: '#ffffff', border: '1px solid rgba(26,61,34,0.1)', boxShadow: '0 1px 3px rgba(26,61,34,0.06)' }}
                    >
                      <summary
                        className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        <h3 className="font-medium text-sm" style={{ color: 'var(--forest)' }}>{f.q}</h3>
                        <span
                          aria-hidden="true"
                          className="shrink-0 text-lg leading-none transition-transform duration-200 group-open:rotate-45"
                          style={{ color: 'var(--forest)' }}
                        >
                          +
                        </span>
                      </summary>
                      <div className="px-5 pb-5 pt-0 space-y-3">
                        {f.a.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </section>

            </div>
          </div>
        </div>

        <div id="venteliste">
          <BottomCta
            eyebrow='Strøm uden gebyrer findes allerede'
            subtitle='Skriv dig gratis på ventelisten og få tidlig adgang, når Altid Hjem lanceres'
            source='billigste-elselskab'
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
