import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import BottomCta from '@/components/sections/BottomCta'
import Footer from '@/components/Footer'
import IndboTjekMockup from '@/components/IndboTjekMockup'

export const metadata: Metadata = {
  title: 'Pris på indboforsikring i 2026 – Altid Hjem',
  description:
    'Se, hvad en indboforsikring typisk koster, hvorfor prisen varierer, og hvad du bør tjekke før et skifte. Få et ærligt overblik hos Altid Hjem.',
  alternates: { canonical: 'https://altidhjem.dk/hvad-koster-indboforsikring' },
  openGraph: {
    title: 'Hvad koster en indboforsikring?',
    description:
      'Se, hvad en indboforsikring typisk koster, hvorfor prisen varierer, og hvad du bør tjekke før et skifte. Få et ærligt overblik hos Altid Hjem.',
    url: 'https://altidhjem.dk/hvad-koster-indboforsikring',
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
    q: 'Hvad koster en indboforsikring om måneden?',
    a: [
      'En indboforsikring koster typisk 100-400 kr. om måneden, mens gennemsnittet ligger omkring 150-160 kr.',
      'Priserne er vejledende og varierer efter blandt andet profil, dækning og selvrisiko.',
    ],
  },
  {
    q: 'Hvad afgør prisen på en indboforsikring?',
    a: [
      'Prisen afgøres typisk af postnummer, indbosum, selvrisiko, alder og valgte tilvalg.',
      'Selskabernes risikovurderinger varierer, så samme husstand kan få forskellige priser.',
    ],
  },
  {
    q: 'Er den billigste indboforsikring god nok?',
    a: [
      'Den billigste indboforsikring kan være god nok, hvis dækningen passer til jeres behov.',
      'Sammenlign især selvrisiko, undtagelser, dækningsgrænser og tilvalg, før I vælger.',
    ],
  },
  {
    q: 'Kan vi være dækket dobbelt?',
    a: [
      'Ja, dobbeltdækning kan opstå, hvis flere i samme hjem har hver sin indboforsikring.',
      'Få selskaberne til at bekræfte, hvem hver police omfatter, før I ændrer eller opsiger noget.',
    ],
  },
  {
    q: 'Hvornår kan jeg opsige min indboforsikring?',
    a: [
      'En indboforsikring kan typisk opsiges med kort varsel efter den første aftaleperiode, men vilkårene varierer.',
      'Tjek policen eller spørg selskabet, og lad den nye dækning begynde, før den gamle ophører.',
    ],
  },
  {
    q: 'Hvad er Altid Hjem?',
    a: [
      'Altid Hjem er en dansk app på vej, som er bygget til at samle hjemmets faste udgifter i ét overblik, ét login.',
      'Ventelisten er åben på altidhjem.dk.',
    ],
  },
  {
    q: 'Koster det noget at skrive sig på ventelisten?',
    a: [
      'Nej, det koster ikke noget at skrive sig på ventelisten til Altid Hjem.',
      'Tilmeldingen giver dig mulighed for at følge med, mens appen bliver klar.',
    ],
  },
]

export default function HvadKosterIndboforsikring() {
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
          longPrefix: 'To ens husstande kan betale vidt forskelligt for indbo. ',
          shortPrefix: 'Betaler du for meget for indbo? ',
          source: 'indboforsikring-banner',
          cta: 'Se om du betaler for meget →',
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
              Hvad koster en indboforsikring?
            </h1>
            <p className="text-xs mb-12" style={{ color: 'rgba(26,61,34,0.5)' }}>Opdateret: juli 2026 · Priserne er vejledende markedsintervaller · Sammenlign selv på <a href="https://www.forsikringsguiden.dk" className="underline" target="_blank" rel="noopener noreferrer">Forsikringsguiden.dk</a></p>

            <div className="space-y-10 text-sm leading-relaxed text-pretty" style={{ color: 'rgba(26,61,34,0.75)' }}>

              {/* Kort svar — målrettet Googles "fremhævede uddrag". */}
              <section>
                <p className="mb-3">
                  En indboforsikring koster typisk 100-400 kr. om måneden afhængigt af din profil. Gennemsnittet ligger omkring 150-160 kr. om måneden, svarende til ca. 1.800 kr. om året.
                </p>
                <p>
                  Priserne er vejledende. Din pris afhænger blandt andet af postnummer, indbosum, selvrisiko, alder og valgte tilvalg.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Hvad koster en indboforsikring i 2026?
                </h2>
                <p className="mb-3">
                  En indboforsikring koster typisk 100-400 kr. om måneden. Gennemsnittet ligger omkring 150-160 kr. om måneden, men det fortæller ikke nødvendigvis, hvad netop din husstand skal betale.
                </p>
                <p className="mb-3">
                  Prisen varierer, fordi selskaberne vurderer risiko forskelligt. Postnummer, alder, indbosum, selvrisiko og tilvalg kan alle påvirke den vejledende pris.
                </p>
                <p>
                  En højere selvrisiko kan ofte give en lavere månedlig pris, men betyder også, at du selv skal betale mere ved en skade. Sammenlign derfor både pris, dækning og selvrisiko.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Hvad dækker en indboforsikring egentlig?
                </h2>
                <p className="mb-3">
                  En indboforsikring dækker typisk husstandens indbo og løsøre ved bestemte skader og hændelser. Den indeholder ofte også privat ansvar og retshjælp, mens den præcise dækning afhænger af policen.
                </p>
                <p className="mb-3">
                  Rejsegods kan være inkluderet eller kræve et tilvalg. Tjek også beløbsgrænser, undtagelser og særlige krav til eksempelvis elektronik, cykler og værdifulde genstande.
                </p>
                <p>
                  Den billigste police er derfor ikke automatisk det bedste valg. Det afgørende er, om dækningen passer til det, I ejer, og den risiko I ønsker at bære selv.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Derfor betaler ens husstande forskellige priser
                </h2>
                <p className="mb-3">
                  To husstande med lignende bolig og indbo kan få meget forskellige tilbud. Forskellen mellem det billigste og dyreste selskab kan være flere hundrede kroner om måneden for samme dækning.
                </p>
                <p className="mb-3">
                  Prisen kan blandt andet afhænge af selskabets risikovurdering, kundens alder, adresse og valgte selvrisiko. Eksisterende kunder får heller ikke altid automatisk den bedste pris, så lang loyalitet kan i praksis blive dyr.
                </p>
                <p>
                  Indhent sammenlignelige tilbud, og brug samme dækning og selvrisiko hver gang. Ellers risikerer I at sammenligne priser på produkter, der reelt ikke er ens.
                </p>

                {/* Animeret side-komponent i gradient-rammen (forsikring-side-mønstret). */}
                <div
                  className="rounded-3xl flex justify-center py-10 px-4 mt-6"
                  style={{ background: 'linear-gradient(160deg, rgba(168,224,99,0.12) 0%, rgba(26,61,34,0.05) 100%)' }}
                >
                  <IndboTjekMockup />
                </div>
                <p className="text-xs mt-3 text-center" style={{ color: 'rgba(26,61,34,0.5)' }}>
                  Altid Hjem skal kunne gennemgå husstandens dækninger og markere mulige overlap. Illustration, ikke et skærmbillede fra appen.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Pas på dobbeltdækning i husstanden
                </h2>
                <p className="mb-3">
                  Hvis to personer flytter sammen, kan begge komme med hver sin indboforsikring. Ofte er én police nok til hele husstanden, men I bør få selskabet til at bekræfte, hvem der er omfattet, før noget opsiges.
                </p>
                <p className="mb-3">
                  Børn kan i visse situationer være dækket gennem begge forældres forsikringer. Det afhænger af policerne og barnets bopælsforhold, så spørg selskaberne konkret i stedet for at antage, at dækningen følger automatisk.
                </p>
                <p>
                  Læs mere om overlap og andre forsikringstyper i guiden til <A href="/hvad-koster-forsikring">hvad forsikringer typisk koster</A>.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Tjekliste før I skifter eller opsiger
                </h2>
                <p className="mb-3">
                  Sammenlign først dækningsomfang, selvrisiko, undtagelser og eventuelle tilvalg. Kontrollér også, om ansvar, retshjælp og rejsegods er med, og om værdifulde ejendele kræver særlig registrering eller dækning.
                </p>
                <p className="mb-3">
                  Tjek opsigelsesvilkårene i den nuværende police, og sørg for, at den nye forsikring er trådt i kraft, før den gamle stopper. På den måde undgår I et hul i dækningen.
                </p>
                <p>
                  Se også på hele husstandens økonomi, ikke kun den enkelte police. Et samlet digitalt budgetværktøj kan være nyttigt, og du kan læse om mulighederne i vores guide til et <A href="/spiir-alternativ">alternativ til Spiir</A>.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Hvad Altid Hjem skal kunne
                </h2>
                <p className="mb-3">
                  Altid Hjem er bygget til at samle hjemmets faste udgifter til el, mobil, forsikring, opladning, alarm og mad i ét overblik, ét login. Forsikringsdelen skal kunne vise husstandens forsikringer samlet og gøre det lettere at opdage mulige overlap.
                </p>
                <p>
                  Altid Energi er allerede i drift som Danmarks første gebyrfrie energiselskab og har mere end 15.000 danske kunder. Mobil, opladning, alarm og forsikring er på vej, og ventelisten til Altid Hjem er åben på altidhjem.dk.
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
            eyebrow='Betaler du for meget for din indboforsikring?'
            subtitle='Skriv dig gratis på ventelisten og få tidlig adgang, når Altid Hjem lanceres'
            source='hvad-koster-indboforsikring'
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
