import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import BottomCta from '@/components/sections/BottomCta'
import Footer from '@/components/Footer'
import AlarmStatusMockup from '@/components/AlarmStatusMockup'

export const metadata: Metadata = {
  title: 'Hvad koster en tyverialarm? – Altid Hjem',
  description:
    'Se vejledende priser på tyverialarmer, fra gør-det-selv til abonnement, og lær, hvad der påvirker totalprisen. Få et ærligt overblik her.',
  alternates: { canonical: 'https://altidhjem.dk/hvad-koster-en-tyverialarm' },
  openGraph: {
    title: 'Hvad koster en tyverialarm?',
    description:
      'Se vejledende priser på tyverialarmer, fra gør-det-selv til abonnement, og lær, hvad der påvirker totalprisen. Få et ærligt overblik her.',
    url: 'https://altidhjem.dk/hvad-koster-en-tyverialarm',
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
    q: 'Hvad koster en tyverialarm?',
    a: [
      'En tyverialarm koster vejledende 999-2.999 kr. som enkel gør-det-selv-løsning eller typisk 10.000-15.000 kr. for et professionelt installeret villasystem.',
      'Prisen varierer med boligens størrelse, antal sensorer og valgte funktioner.',
    ],
  },
  {
    q: 'Kan jeg selv sætte en alarm op?',
    a: [
      'Ja, mange enkle alarmsystemer er lavet til gør-det-selv-montering.',
      'Kontrollér, om boligen kræver ekstra sensorer, og om systemet kan udvides, før du vælger.',
    ],
  },
  {
    q: 'Hvad koster en alarm om måneden?',
    a: [
      'Abonnementsløsninger hos store udbydere koster typisk fra ca. 299 kr./md. plus installation.',
      'Den vejledende pris varierer med overvågning, vagtservice, udstyr og bindingsperiode.',
    ],
  },
  {
    q: 'Giver en alarm rabat på forsikringen?',
    a: [
      'Nogle forsikringsselskaber giver rabat, hvis alarmen opfylder bestemte krav.',
      'Tjek din police eller spørg selskabet, før du regner en mulig rabat med i alarmens totalpris.',
    ],
  },
  {
    q: 'Hvad sker der, når alarmen går?',
    a: [
      'En gør-det-selv-alarm sender typisk en notifikation, så du selv skal reagere.',
      'Ved en abonnementsløsning kan en kontrolcentral vurdere alarmen og eventuelt sende en vagt, afhængigt af aftalen.',
    ],
  },
  {
    q: 'Hvad er Altid Hjem?',
    a: [
      'Altid Hjem er en kommende dansk app, der er bygget til at samle hjemmets faste udgifter i ét overblik, ét login.',
      'El findes allerede gennem Altid Energi, mens blandt andet alarm, mobil, opladning og forsikring er på vej.',
    ],
  },
  {
    q: 'Koster det noget at skrive sig på ventelisten til Altid Hjem?',
    a: [
      'Nej, det koster ikke noget at skrive sig på ventelisten.',
      'Du kan tilmelde dig på altidhjem.dk og få besked om Altid Hjem.',
    ],
  },
]

export default function HvadKosterEnTyverialarm() {
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
          longPrefix: 'Ferietid er indbrudstid. Se hvad en tyverialarm faktisk koster. ',
          shortPrefix: 'Hvad koster en tyverialarm? ',
          source: 'tyverialarm-banner',
          cta: 'Se priserne →',
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
              Hvad koster en tyverialarm?
            </h1>
            <p className="text-xs mb-12" style={{ color: 'rgba(26,61,34,0.5)' }}>Opdateret: juli 2026</p>

            <div className="space-y-10 text-sm leading-relaxed text-pretty" style={{ color: 'rgba(26,61,34,0.75)' }}>

              {/* Kort svar — målrettet Googles "fremhævede uddrag". */}
              <section>
                <p className="mb-3">
                  En tyverialarm koster vejledende fra under 1.000 kr. for en enkel gør-det-selv-løsning til typisk 10.000-15.000 kr. for et professionelt installeret villasystem.
                </p>
                <p>
                  Vælger du abonnement, starter prisen typisk fra ca. 299 kr./md. plus installation og ofte en bindingsperiode. Den endelige pris afhænger blandt andet af boligens størrelse, antal sensorer og behovet for kontrolcentral eller vagtudrykning.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Tre måder at købe tyverialarm på
                </h2>
                <p className="mb-3">
                  Den billigste mulighed er normalt en gør-det-selv-alarm. En basisløsning koster typisk 999-2.999 kr. som engangskøb, men prisen varierer med antallet af sensorer, kameraer og øvrigt udstyr.
                </p>
                <p className="mb-3">
                  Et standardsystem til en villa med professionel installation koster typisk 10.000-15.000 kr. Her afhænger prisen især af boligens indretning, systemets omfang og installationsarbejdet.
                </p>
                <p>
                  Den tredje mulighed er en abonnementsløsning hos en større udbyder. Den koster typisk fra ca. 299 kr./md. plus installation, og der følger ofte en bindingsperiode med.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Hvad afhænger prisen på en alarm af?
                </h2>
                <p className="mb-3">
                  Boligens størrelse har stor betydning. En lejlighed med få adgangspunkter kræver normalt mindre udstyr end en villa med flere døre, vinduer og et større udendørsareal.
                </p>
                <p className="mb-3">
                  Antallet og typen af sensorer påvirker også prisen. Dørkontakter, bevægelsessensorer, røgalarmer og kameraer har forskellige priser, og funktioner som app-styring kan gøre løsningen dyrere.
                </p>
                <p>
                  Kontrolcentral og vagtudrykning er typisk en del af en abonnementsløsning. Sammenlign derfor ikke kun startprisen, men også service, binding og eventuelle omkostninger ved installation eller udrykning.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Regn på abonnementet over fem år
                </h2>
                <p className="mb-3">
                  Et alarmabonnement på flere hundrede kroner om måneden bliver til flere tusinde kroner om året. Over fem år kan den løbende betaling derfor fylde mere end den lave startpris antyder.
                </p>
                <p className="mb-3">
                  Bed udbyderen om en samlet beregning med installation, månedlig betaling, bindingsperiode og mulige tillæg. Sammenlign derefter totalprisen med et system, du selv ejer, og vurder samtidig værdien af kontrolcentral og vagtservice.
                </p>
                <p>
                  Den billigste løsning ved købet er ikke nødvendigvis den billigste over tid. Omvendt kan et abonnement være pengene værd, hvis professionel overvågning og hjælp ved alarm er vigtigt for jer.
                </p>

                {/* Animeret side-komponent i gradient-rammen (forsikring-side-mønstret). */}
                <div
                  className="rounded-3xl flex justify-center py-10 px-4 mt-6"
                  style={{ background: 'linear-gradient(160deg, rgba(168,224,99,0.12) 0%, rgba(26,61,34,0.05) 100%)' }}
                >
                  <AlarmStatusMockup />
                </div>
                <p className="text-xs mt-3 text-center" style={{ color: 'rgba(26,61,34,0.5)' }}>
                  Alarmen er en af hjemmets faste udgifter. Altid Hjem skal kunne samle den i overblikket.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Ferieperioder gør alarmsikkerhed aktuel
                </h2>
                <p className="mb-3">
                  Interessen for tyverialarmer topper ofte i august, hvor mange tænker på indbrud i forbindelse med ferie og tomme boliger. En alarm kan være en del af sikringen, men den bør ikke stå alene.
                </p>
                <p>
                  Få hjemmet til at se beboet ud, undgå synlige tegn på længere fravær, og aftal gerne med en nabo, at post og skraldespand bliver håndteret. Tjek også låse, døre og vinduer, før I rejser.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Alarmen er en fast udgift i hjemmet
                </h2>
                <p className="mb-3">
                  Alarm, el, mobil og forsikring bliver ofte betalt forskellige steder. Det gør det svært at huske, hvad man reelt betaler hver måned, og hvornår priser eller vilkår ændrer sig.
                </p>
                <p className="mb-3">
                  Forsikring og alarmsikring kan hænge sammen, fordi nogle forsikringsselskaber giver rabat for bestemte alarmtyper. Det gælder dog ikke alle, så tjek policen og læs mere om <A href="/hvad-koster-forsikring">hvad forsikring koster</A>.
                </p>
                <p>
                  Vil du samle overblikket over faste udgifter uden at bruge flere separate værktøjer, kan du også læse om et <A href="/spiir-alternativ">alternativ til Spiir</A>.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Hvad Altid Hjem skal kunne
                </h2>
                <p className="mb-3">
                  Altid Hjem er bygget til at samle hjemmets faste udgifter til el, mobil, forsikring, opladning, alarm og mad i ét overblik, ét login. Alarm skal kunne indgå som en tjeneste i overblikket, så det bliver lettere at se pris og vilkår sammen med resten af hjemmets aftaler.
                </p>
                <p className="mb-3">
                  Altid Hjem er ikke lanceret endnu, og ventelisten er åben på altidhjem.dk. Appen bygges af teamet bag Altid Energi, Danmarks første gebyrfrie energiselskab, hvor mere end 14.000 danskere allerede er kunder.
                </p>
                <p>
                  Altid Energi er i drift i dag, mens mobil, opladning, alarm og forsikring er på vej. Du kan i mellemtiden bruge prisguiden her på siden til at sammenligne markedets løsninger.
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
            eyebrow='Tryghed er også en fast udgift'
            subtitle='Skriv dig gratis på ventelisten og få tidlig adgang, når Altid Hjem lanceres'
            source='hvad-koster-en-tyverialarm'
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
