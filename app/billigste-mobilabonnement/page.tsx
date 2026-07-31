import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import BottomCta from '@/components/sections/BottomCta'
import Footer from '@/components/Footer'
import MobilOverblikMockup from '@/components/MobilOverblikMockup'

export const metadata: Metadata = {
  title: 'Billigste mobilabonnement i 2026 – Altid Hjem',
  description:
    'Find det billigste mobilabonnement til hele husstanden. Se vejledende priser, typiske faldgruber og få en enkel tjekliste. Skriv dig på ventelisten.',
  alternates: { canonical: 'https://altidhjem.dk/billigste-mobilabonnement' },
  openGraph: {
    title: 'Det billigste mobilabonnement til hele husstanden',
    description:
      'Find det billigste mobilabonnement til hele husstanden. Se vejledende priser, typiske faldgruber og få en enkel tjekliste. Skriv dig på ventelisten.',
    url: 'https://altidhjem.dk/billigste-mobilabonnement',
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
    q: 'Hvad er det billigste mobilabonnement?',
    a: [
      'Det billigste mobilabonnement fås vejledende fra ca. 19 kr./md.',
      'Det er typisk en enkel discountløsning, og den bedste pris for dig afhænger af data, tale, roaming og dækning.',
    ],
  },
  {
    q: 'Er discountselskaberne lige så gode som de store?',
    a: [
      'Discountselskaber kan bruge samme mobilnet som større selskaber og derfor have tilsvarende dækning.',
      'Roaming, kundeservice, ekstratjenester og vilkår kan dog variere, så sammenlign mere end månedsprisen.',
    ],
  },
  {
    q: 'Hvor meget data har jeg brug for?',
    a: [
      'Du har brug for en datamængde, der matcher dit reelle mobilforbrug uden en stor ubrugt buffer.',
      'Se forbruget i din nuværende udbyders app eller på fakturaerne, og husk, at behovet kan stige, hvis du ofte streamer uden wi-fi.',
    ],
  },
  {
    q: 'Kan jeg skifte mobilselskab med det samme?',
    a: [
      'Ofte ja, fordi nul måneders binding er normen i Danmark.',
      'Tjek alligevel opsigelsesvarsel og eventuel telefonafbetaling, og lad normalt det nye selskab håndtere nummerflytningen.',
    ],
  },
  {
    q: 'Hvor meget kan en husstand spare på mobil?',
    a: [
      'Det afhænger af antallet af abonnementer, jeres nuværende priser og det faktiske forbrug.',
      'Flere hundrede kroner om måneden kan være muligt, når flere aftaler er gamle eller har ubrugte tillæg, men besparelsen kan også være mindre.',
    ],
  },
  {
    q: 'Hvad er Altid Hjem?',
    a: [
      'Altid Hjem er en dansk app på vej, som skal kunne samle hjemmets faste udgifter i ét overblik, ét login.',
      'Ventelisten er åben på altidhjem.dk, mens Altid Energi allerede er i drift.',
    ],
  },
  {
    q: 'Koster det noget at skrive sig på ventelisten?',
    a: [
      'Nej, det koster ikke noget at skrive sig på ventelisten til Altid Hjem.',
      'Tilmeldingen giver mulighed for at følge med, mens appen bliver gjort klar.',
    ],
  },
]

export default function BilligsteMobilabonnement() {
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
          longPrefix: 'Husstanden har ofte 3-5 mobilaftaler. Ingen kan se totalen. ',
          shortPrefix: 'Hvad betaler husstanden for mobil? ',
          source: 'mobilabonnement-banner',
          cta: 'Få overblikket →',
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
              Det billigste mobilabonnement til hele husstanden
            </h1>
            <p className="text-xs mb-12" style={{ color: 'rgba(26,61,34,0.5)' }}>Opdateret: juli 2026</p>

            <div className="space-y-10 text-sm leading-relaxed text-pretty" style={{ color: 'rgba(26,61,34,0.75)' }}>

              {/* Kort svar — målrettet Googles "fremhævede uddrag". */}
              <section>
                <p className="mb-3">
                  Det billigste mobilabonnement fås vejledende fra ca. 19 kr./md. Det er typisk et enkelt taletids- eller discountabonnement, mens fri tale ofte starter ved ca. 29-49 kr./md.
                </p>
                <p>
                  Den laveste pris er dog ikke nødvendigvis billigst for jer. Se på data, dækning og vilkår, men især på hele husstandens mobiludgift, når I sammenligner.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Hvad koster mobilabonnementer i 2026?
                </h2>
                <p className="mb-3">
                  De billigste mobilabonnementer fås vejledende fra ca. 19 kr./md. Prisen gælder typisk en enkel løsning fra et taletids- eller discountselskab, hvor data og øvrige tjenester kan være begrænsede.
                </p>
                <p className="mb-3">
                  Abonnementer med fri tale koster typisk fra ca. 29-49 kr./md. Den konkrete pris varierer blandt andet med datamængde, roaming, netværk og inkluderede tjenester.
                </p>
                <p className="mb-3">
                  Nul måneders binding er normen i Danmark. Tjek dog altid opsigelsesvarsel, eventuel afbetaling på telefonen og vilkårene for nummerflytning, før du skifter.
                </p>
                <p>
                  Læs også vores guide til at <A href="/opsig-abonnementer">opsige de abonnementer</A>, I ikke længere bruger.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Hvorfor den laveste pris ikke altid er billigst
                </h2>
                <p className="mb-3">
                  Et abonnement er kun billigt, hvis det passer til dit forbrug. For lidt data kan give ekstraudgifter, mens en stor datapakke er spild af penge, hvis du næsten altid bruger wi-fi.
                </p>
                <p className="mb-3">
                  Se også på EU-roaming, dækning dér, hvor du bor og arbejder, samt adgang til kundeservice. Discountselskaber bruger ofte samme mobilnet som større selskaber, men vilkår og service kan være forskellige.
                </p>
                <p>
                  Det vigtigste overses let, fordi en husstand ofte har tre til fem abonnementer fordelt på flere selskaber. En lille overpris på hver aftale kan derfor betyde mere end en meget lav kampagnepris på ét SIM-kort.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Den skjulte udgift ligger i hele husstanden
                </h2>
                <p className="mb-3">
                  For et par eller en familie er det sjældent nok at sammenligne ét abonnement. Børn og voksne kan have forskellige aftaler, gamle priser og tillæg, som ingen længere bruger.
                </p>
                <p className="mb-3">
                  Problemet er ikke nødvendigvis den enkelte pris, men manglen på overblik. Når aftalerne ligger i forskellige apps, mails og netbankposter, er det svært at se husstandens reelle mobiludgift.
                </p>
                <p>
                  Et budgetværktøj kan vise betalingerne, men fortæller ikke altid, om aftalerne passer til jeres behov. Se, hvordan Altid Hjem adskiller sig fra et traditionelt budgetoverblik, i vores guide til et <A href="/spiir-alternativ">alternativ til Spiir</A>.
                </p>

                {/* Animeret side-komponent i gradient-rammen (forsikring-side-mønstret). */}
                <div
                  className="rounded-3xl flex justify-center py-10 px-4 mt-6"
                  style={{ background: 'linear-gradient(160deg, rgba(168,224,99,0.12) 0%, rgba(26,61,34,0.05) 100%)' }}
                >
                  <MobilOverblikMockup />
                </div>
                <p className="text-xs mt-3 text-center" style={{ color: 'rgba(26,61,34,0.5)' }}>
                  Altid Hjem skal kunne samle husstandens mobilaftaler i ét overblik og vise, hvor I betaler for meget. Illustration, ikke et skærmbillede fra appen.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Sådan tjekker I mobilaftalerne i dag
                </h2>
                <p className="mb-3">
                  Start med at skrive alle husstandens abonnementer ned. Notér person, selskab, månedspris, data, fri tale, roaming, tillæg og eventuel afbetaling på en telefon.
                </p>
                <p className="mb-3">
                  Åbn derefter hver faktura og sammenlign det inkluderede forbrug med det faktiske forbrug. Kig især efter ubrugte datapakker, ekstra tjenester og rabatter, der er udløbet.
                </p>
                <p className="mb-3">
                  Sammenlign nye priser på samme tidspunkt, så I vurderer alle aftaler på ens vilkår. Husk at kontrollere dækning og nummerflytning, før I beslutter jer.
                </p>
                <p>
                  Gentag gennemgangen med jævne mellemrum. Når mobilabonnementerne er på plads, kan I bruge samme metode på andre faste udgifter, eksempelvis ved at undersøge det <A href="/billigste-elselskab">billigste elselskab</A>.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Hvad Altid Hjem skal kunne
                </h2>
                <p className="mb-3">
                  Altid Hjem er bygget til at samle hjemmets faste udgifter til blandt andet el, mobil, forsikring, opladning, alarm og mad. Målet er ét overblik, ét login.
                </p>
                <p className="mb-3">
                  På mobilområdet skal Altid Hjem kunne samle husstandens aftaler og gøre det lettere at opdage gamle priser, unødvendige tillæg og mulige overpriser. Mobilfunktionen er på vej og findes ikke endnu.
                </p>
                <p>
                  Altid Hjem er udviklet af holdet bag Altid Energi, Danmarks første gebyrfrie energiselskab. Altid Energi er i drift i dag og har allerede mere end 15.000 danske kunder, mens de øvrige tjenester er på vej.
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
            eyebrow='Hvad betaler husstanden egentlig for mobil?'
            subtitle='Skriv dig gratis på ventelisten og få tidlig adgang, når Altid Hjem lanceres'
            source='billigste-mobilabonnement'
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
