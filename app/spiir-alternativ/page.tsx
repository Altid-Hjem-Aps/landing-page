import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import BottomCta from '@/components/sections/BottomCta'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Spiir-alternativ: Hvad skal du bruge i stedet for Spiir? – Altid Hjem',
  description:
    'Spiir lukkede 8. juni 2026. Leder du efter et Spiir-alternativ, der giver overblik over dine faste udgifter? Altid Hjem skal samle el, mobil og forsikring i én app. Skriv dig gratis på ventelisten.',
}

// FAQ-indholdet bruges to steder: på siden (afsnit for afsnit) og som
// FAQPage-schema (rich results i Google, afsnit samlet til én tekst).
const FAQ: { q: string; a: string[] }[] = [
  {
    q: 'Er Altid Hjem et alternativ til Spiir?',
    a: [
      'Ja. Altid Hjem kan være et alternativ til Spiir, hvis du primært brugte Spiir til at holde overblik over dine faste udgifter.',
      'Altid Hjem er dog ikke en klassisk budgetapp. Vi samler i stedet hjemmets faste udgifter i én app med ét overblik og ét login.',
    ],
  },
  {
    q: 'Hvad skal jeg bruge i stedet for Spiir?',
    a: [
      'Hvis du vil have en klassisk budgetapp, skal du vælge en løsning, der kategoriserer dine kontobevægelser.',
      'Hvis du derimod vil have bedre overblik over hjemmets faste udgifter, er Altid Hjem bygget som et alternativ til Spiir.',
    ],
  },
  {
    q: 'Er Altid Hjem en budgetapp?',
    a: [
      'Nej. Altid Hjem er ikke en klassisk budgetapp.',
      'Vi fokuserer på hjemmets faste udgifter som el, mobil, forsikring, mad og mere. Målet er at samle dem ét sted, så du får færre logins, færre regninger og bedre overblik.',
    ],
  },
  {
    q: 'Hvornår åbner Altid Hjem?',
    a: [
      'Altid Hjem er i de sidste forberedelser.',
      'Skriv dig på ventelisten på altidhjem.dk, så får du besked, når appen er klar. De første på listen får adgang først.',
    ],
  },
  {
    q: 'Koster det noget at skrive sig på ventelisten?',
    a: [
      'Nej. Det er gratis at skrive sig på ventelisten.',
      'Du får besked, når Altid Hjem åbner.',
    ],
  },
]

const FOREST_TEXT = 'rgba(26,61,34,0.75)'

export default function SpiirAlternativ() {
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
      <Nav spiirBanner />
      <script
        type="application/ld+json"
        // '<' escapes som <: JSON.stringify escaper ikke '<', så en
        // fremtidig FAQ-tekst med '</script>' kunne ellers bryde ud af tagget.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
      <main className="min-h-screen" style={{ fontFamily: 'var(--font-onest)' }}>

        {/* Artikel — creme baggrund som resten af sitet. pt-32 (128px) =
            Spiir-banner (~36px) + nav (84px, jf. Hero.tsx-spaceren) + luft.
            Ændres bannerets højde, skal denne følge med. */}
        <div className="pt-32 pb-20" style={{ background: 'var(--cream)' }}>
          <div className="max-w-2xl mx-auto px-6">

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm mb-10 transition-opacity hover:opacity-70"
              style={{ color: 'rgba(26,61,34,0.55)' }}
            >
              <span aria-hidden="true">←</span> Tilbage
            </Link>

            <h1 className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: 'var(--forest)' }}>
              Spiir lukkede 8. juni 2026: Hvad skal du bruge i stedet?
            </h1>
            <p className="text-xs mb-12" style={{ color: 'rgba(26,61,34,0.5)' }}>Opdateret: juni 2026</p>

            <div className="space-y-10 text-sm leading-relaxed" style={{ color: FOREST_TEXT }}>

              <section>
                <p className="mb-3">
                  Spiir lukkede den 8. juni 2026 efter 15 år med at hjælpe danskere med at holde
                  overblik over deres økonomi.
                </p>
                <p className="mb-3">
                  For mange betyder lukningen, at de nu skal finde en ny måde at få styr på budget,
                  faste udgifter og hjemmets økonomi.
                </p>
                <p className="mb-3">
                  Over 500.000 danskere har brugt Spiir til at skabe overblik over deres økonomi.
                  Derfor leder mange nu efter et{' '}
                  <span className="font-medium" style={{ color: 'var(--forest)' }}>Spiir-alternativ</span>,
                  en Spiir-erstatning eller et svar på spørgsmålet: Hvad skal jeg bruge i stedet for Spiir?
                </p>
                <p>
                  Her er det korte svar: Altid Hjem er et alternativ til Spiir, men ikke en klassisk
                  budgetapp.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--forest)' }}>
                  Et alternativ til Spiir, men ikke en budgetapp
                </h2>
                <p className="mb-3">
                  Spiir hjalp dig med at se, hvor dine penge blev af. Det var værdifuldt, men
                  overblikket ændrede ikke i sig selv på regningerne.
                </p>
                <p className="mb-3">Altid Hjem går skridtet videre.</p>
                <p className="mb-3">
                  Vi samler hjemmets faste udgifter. El, mobil, forsikring, mad og mere. I{' '}
                  <span className="font-medium" style={{ color: 'var(--forest)' }}>
                    én app med ét overblik og ét login
                  </span>
                  .
                </p>
                <p className="mb-3">
                  I stedet for at holde styr på flere udbydere, flere logins og flere fakturaer får
                  du ét samlet sted med overblik over hjemmets økonomi.
                </p>
                <p className="font-semibold" style={{ color: 'var(--forest)' }}>Uden skjulte gebyrer.</p>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--forest)' }}>
                  Fra overblik til handling
                </h2>
                <p className="mb-3">
                  Leder du efter en klassisk budgetapp, der kategoriserer alle dine kontobevægelser,
                  findes der andre løsninger på markedet.
                </p>
                <p className="mb-3">
                  Men hvis du brugte Spiir til at holde styr på dine{' '}
                  <span className="font-medium" style={{ color: 'var(--forest)' }}>faste udgifter</span>,
                  er Altid Hjem bygget til netop det.
                </p>
                <p>
                  Vi viser dig ikke kun udgifterne. Vi samler dem, så det bliver lettere at forstå,
                  styre og betale hjemmets faste regninger.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--forest)' }}>
                  Hvem står bag Altid Hjem?
                </h2>
                <p className="mb-3">
                  Altid Hjem er bygget af holdet bag Altid Energi, hvor mere end 15.000 danskere
                  allerede får gennemsigtig strøm til en fair pris.
                </p>
                <p>
                  Samme princip tager vi nu videre til resten af hjemmet: Fair priser,
                  gennemsigtighed og færre ting at holde styr på.
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

        {/* Samme tilmeldingssektion som forsiden — mørkegrøn, folk kan skrive
            sig på ventelisten direkte her uden at forlade siden. */}
        <BottomCta
          eyebrow="Klar til at få overblikket tilbage?"
          subtitle="Tilmeld dig gratis ventelisten i dag og få tidlig adgang, når appen lanceres"
          source="spiir-alternativ"
        />
      </main>
      <Footer />
    </>
  )
}
