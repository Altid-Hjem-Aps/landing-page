import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import BottomCta from '@/components/sections/BottomCta'
import Footer from '@/components/Footer'
import AbonnementMockup from '@/components/AbonnementMockup'

export const metadata: Metadata = {
  title: 'Opsig abonnementer, I ikke bruger – Altid Hjem',
  description:
    'Find alle husstandens abonnementer, tjek binding og opsig korrekt. Få en enkel guide til at rydde op, og skriv jer på ventelisten hos Altid Hjem.',
  alternates: { canonical: 'https://altidhjem.dk/opsig-abonnementer' },
  openGraph: {
    title: 'Sådan opsiger I husstandens abonnementer',
    description:
      'Find alle husstandens abonnementer, tjek binding og opsig korrekt. Få en enkel guide til at rydde op, og skriv jer på ventelisten hos Altid Hjem.',
    url: 'https://altidhjem.dk/opsig-abonnementer',
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
    q: 'Hvordan opsiger jeg et abonnement?',
    a: [
      'Find opsigelsesfunktionen på udbyderens hjemmeside eller i appen, og følg den angivne proces.',
      'Tjek binding og opsigelsesvarsel først, og gem altid bekræftelsen.',
    ],
  },
  {
    q: 'Hvordan finder jeg alle mine abonnementer?',
    a: [
      'Gennemgå kontoudtog, appbutikkernes abonnementslister og aftaler hos de enkelte udbydere.',
      'Spørg også resten af husstanden, så delte eller parallelle abonnementer kommer med.',
    ],
  },
  {
    q: 'Hvad koster glemte abonnementer?',
    a: [
      'Det afhænger af, hvor mange aftaler der fortsætter, og hvad de koster.',
      'Selv små månedlige beløb kan fylde mærkbart over et år, når flere ubrugte abonnementer lægges sammen.',
    ],
  },
  {
    q: 'Kan jeg opsige et abonnement med det samme?',
    a: [
      'Det afhænger af abonnementets binding og opsigelsesvarsel.',
      'Du kan ofte sende opsigelsen straks, men aftalen og betalingen kan fortsætte frem til den slutdato, der følger af vilkårene.',
    ],
  },
  {
    q: 'Skal jeg opsige eller nedgradere?',
    a: [
      'Nedgradering kan være bedst, hvis du stadig bruger tjenesten, men ikke har behov for hele pakken.',
      'Opsigelse giver mere mening, hvis abonnementet sjældent bliver brugt eller overlapper med en anden aftale.',
    ],
  },
  {
    q: 'Hvad er Altid Hjem?',
    a: [
      'Altid Hjem er en dansk app på vej, som er bygget til at samle hjemmets faste udgifter ét sted.',
      'Målet er ét overblik, ét login til el, mobil, forsikring, opladning, alarm og mad, og ventelisten er åben på altidhjem.dk.',
    ],
  },
  {
    q: 'Koster det noget at skrive sig på ventelisten?',
    a: [
      'Nej, det er gratis at skrive sig på ventelisten til Altid Hjem.',
      'Tilmeldingen er ikke det samme som at købe et abonnement.',
    ],
  },
]

export default function OpsigAbonnementer() {
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
          longPrefix: 'Glemte abonnementer gemmer sig i kontoudtoget. Find dem her. ',
          shortPrefix: 'Betaler du for abonnementer, du ikke bruger? ',
          source: 'opsig-abonnementer-banner',
          cta: 'Kom i gang →',
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
              Sådan opsiger I husstandens abonnementer
            </h1>
            <p className="text-xs mb-12" style={{ color: 'rgba(26,61,34,0.5)' }}>Opdateret: juli 2026 · Læs om dine abonnementsrettigheder på <a href="https://www.forbrug.dk" className="underline" target="_blank" rel="noopener noreferrer">forbrug.dk</a></p>

            <div className="space-y-10 text-sm leading-relaxed text-pretty" style={{ color: 'rgba(26,61,34,0.75)' }}>

              {/* Kort svar — målrettet Googles "fremhævede uddrag". */}
              <section>
                <p className="mb-3">
                  De fleste abonnementer kan opsiges hurtigt via udbyderens hjemmeside, app eller kundeservice. Tjek først bindingsperiode og opsigelsesvarsel, og gem derefter bekræftelsen.
                </p>
                <p>
                  Det svære er ofte at finde alle aftalerne og huske dem, der ikke længere bliver brugt. Gennemgå kontoudtog, appbutikker og familiens delte abonnementer, før I beslutter, hvad der skal opsiges.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Sådan finder I alle husstandens abonnementer
                </h2>
                <p className="mb-3">
                  Start med kontoudtoget fra de seneste måneder. Se efter gentagne betalinger til streaming, mobil, fitness, aviser, apps, lagerplads i skyen og andre tjenester.
                </p>
                <p className="mb-3">
                  Tjek også abonnementslisterne i telefonens appbutik. Nogle aftaler bliver trukket gennem Apple eller Google og fremgår derfor ikke under tjenestens eget navn på kontoudtoget.
                </p>
                <p>
                  Spørg alle i husstanden, hvilke aftaler de betaler for. Delte tjenester og parallelle abonnementer kan ellers være svære at opdage.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Abonnementerne, mange glemmer
                </h2>
                <p className="mb-3">
                  Mange husstande opdager glemte abonnementer, når de gennemgår kontoudtoget. Det kan være en gammel app, et fitnessmedlemskab, en nyhedsapp eller streamingtjenester med indhold, der overlapper.
                </p>
                <p className="mb-3">
                  Små månedlige betalinger er lette at overse, fordi de hver for sig virker beskedne. Over et år kan flere ubrugte aftaler dog fylde mærkbart i budgettet.
                </p>
                <p>
                  Se også på mobilabonnementerne i husstanden. Hvis behovet har ændret sig, kan vores guide til det <A href="/billigste-mobilabonnement">billigste mobilabonnement</A> hjælpe jer med at sammenligne pris, data og vilkår.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Sådan opsiger du et abonnement korrekt
                </h2>
                <p className="mb-3">
                  Find udbyderens side om opsigelse, og læs vilkårene for binding og opsigelsesvarsel. Nogle aftaler stopper straks, mens andre fortsætter til udgangen af en betalingsperiode eller bindingsperiode.
                </p>
                <p className="mb-3">
                  Opsig gennem den kanal, som udbyderen angiver. Gem en mail, kvittering eller et skærmbillede, der viser datoen og bekræfter opsigelsen.
                </p>
                <p>
                  Reglerne afhænger af aftaletype og vilkår, så denne guide er generel og ikke en juridisk garanti. Kontakt udbyderen, hvis slutdatoen eller en fortsat betaling er uklar.
                </p>

                {/* Animeret side-komponent i gradient-rammen (forsikring-side-mønstret). */}
                <div
                  className="rounded-3xl flex justify-center py-10 px-4 mt-6"
                  style={{ background: 'linear-gradient(160deg, rgba(168,224,99,0.12) 0%, rgba(26,61,34,0.05) 100%)' }}
                >
                  <AbonnementMockup />
                </div>
                <p className="text-xs mt-3 text-center" style={{ color: 'rgba(26,61,34,0.5)' }}>
                  Altid Hjem skal kunne samle husstandens faste aftaler, så glemte abonnementer ikke kan gemme sig. Illustration, ikke et skærmbillede fra appen.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Behold det, I faktisk bruger
                </h2>
                <p className="mb-3">
                  Målet er ikke at have nul abonnementer. Målet er at vælge dem bevidst og betale for tjenester, der giver reel værdi i hverdagen.
                </p>
                <p className="mb-3">
                  Overvej en billigere pakke, hvis I bruger tjenesten, men ikke alle funktionerne. Ved overlappende streamingtjenester kan I også beholde én ad gangen og skifte efter behov.
                </p>
                <p>
                  Vurdér hver aftale ud fra brug, pris og hvor besværlig den er at undvære. En aktiv beslutning om at beholde et abonnement er lige så relevant som en opsigelse.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Gør gennemgangen til en årlig vane
                </h2>
                <p className="mb-3">
                  Vælg en fast måned, eksempelvis januar eller juni, hvor hele husstanden gennemgår sine løbende aftaler. En tilbagevendende påmindelse i kalenderen gør det mindre sandsynligt, at ubrugte abonnementer fortsætter ubemærket.
                </p>
                <p>
                  Saml en enkel liste med udbyder, pris, betalingsfrekvens, binding og næste vurderingsdato. Opdatér den, når I opretter, ændrer eller opsiger en aftale.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Hvad Altid Hjem skal kunne
                </h2>
                <p className="mb-3">
                  Altid Hjem er bygget til at samle hjemmets faste udgifter til el, mobil, forsikring, opladning, alarm og mad. Tanken er ét overblik, ét login, så aftalerne bliver lettere at finde og vurdere.
                </p>
                <p className="mb-3">
                  Altid Energi er allerede i drift og er Danmarks første gebyrfrie energiselskab med mere end 15.000 danske kunder. Mobil, opladning, alarm og forsikring er på vej og skal kunne indgå i Altid Hjem.
                </p>
                <p>
                  Altid Hjem skal gøre det sværere for faste aftaler at gemme sig i forskellige apps og indbakker. Læs også om forskellen på Altid Hjem og traditionelle <A href="/spiir-alternativ">budget- og kontooverblik-apps</A>.
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
            eyebrow='Glemte abonnementer trives i mørket'
            subtitle='Skriv dig gratis på ventelisten og få tidlig adgang, når Altid Hjem lanceres'
            source='opsig-abonnementer'
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
