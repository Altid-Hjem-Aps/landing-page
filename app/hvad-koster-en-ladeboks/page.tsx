import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import BottomCta from '@/components/sections/BottomCta'
import Footer from '@/components/Footer'
import LadeboksCalculator from '@/components/LadeboksCalculator'

export const metadata: Metadata = {
  title: 'Hvad koster en ladeboks? Priser og valg – Altid Hjem',
  description:
    'Se vejledende priser på ladeboks, installation, leje og refusion, og få styr på prisen for hjemmeladning. Prøv beregneren her på siden.',
  alternates: { canonical: 'https://altidhjem.dk/hvad-koster-en-ladeboks' },
  openGraph: {
    title: 'Hvad koster en ladeboks?',
    description:
      'Se vejledende priser på ladeboks, installation, leje og refusion, og få styr på prisen for hjemmeladning. Prøv beregneren her på siden.',
    url: 'https://altidhjem.dk/hvad-koster-en-ladeboks',
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
    q: 'Hvad koster en ladeboks med installation?',
    a: [
      'En ladeboks med standardinstallation koster typisk samlet 4.000-7.000 kr.',
      'Selve boksen ligger vejledende på 2.500-6.000 kr., og installationen på 1.500-3.500 kr., afhængigt af blandt andet eltavle, kabellængde og ønsket ladeeffekt.',
    ],
  },
  {
    q: 'Kan det betale sig at leje en ladeboks?',
    a: [
      'Ja, leje kan betale sig, hvis du ønsker en lav startudgift og værdsætter inkluderet service.',
      'Den vejledende pris er typisk 79-199 kr. om måneden, men sammenlign totalprisen, bindingen og vilkårene med et køb.',
    ],
  },
  {
    q: 'Hvad koster det at lade elbilen hjemme?',
    a: [
      'Hjemmeladning koster typisk 2,00-3,50 kr. pr. kWh før refusion.',
      'Den faktiske pris varierer med elaftalen, tidspunktet, transport, afgifter, tillæg og gebyrer, mens en refusionsaftale i et eksempel kan bringe den effektive pris ned omkring 0,73 kr. pr. kWh.',
    ],
  },
  {
    q: 'Hvad er en refusionsaftale?',
    a: [
      'En refusionsaftale er en serviceaftale, som kan give refusion af en del af elafgiften på dokumenteret opladning.',
      'Den koster typisk 0-79 kr. om måneden, og du bør kontrollere sats, måling, krav, binding og udbetaling.',
    ],
  },
  {
    q: 'Hvor meget strøm bruger en elbil?',
    a: [
      'En moderne elbil bruger typisk 15-22 kWh pr. 100 km.',
      'Forbruget varierer blandt andet med bilmodel, hastighed, temperatur, kørestil og brug af varme eller aircondition.',
    ],
  },
  {
    q: 'Hvad er Altid Hjem?',
    a: [
      'Altid Hjem er en dansk app på vej, som skal kunne samle el, mobil, forsikring, opladning, alarm og mad i ét overblik med ét login.',
      'Appen bygges af holdet bag det gebyrfrie energiselskab Altid Energi, hvor mere end 15.000 danskere allerede er kunder.',
    ],
  },
  {
    q: 'Koster det noget at skrive sig på ventelisten?',
    a: [
      'Nej, det koster ikke noget at skrive sig på ventelisten til Altid Hjem.',
      'Ventelisten er åben på altidhjem.dk, og appen er endnu ikke lanceret.',
    ],
  },
]

export default function HvadKosterEnLadeboks() {
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
          longPrefix: 'Ladeboks og elaftale hænger sammen. Regn din ladepris ud her. ',
          shortPrefix: 'Hvad koster hjemmeladning? ',
          source: 'ladeboks-banner',
          cta: 'Beregn din ladepris →',
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
              Hvad koster en ladeboks?
            </h1>
            <p className="text-xs mb-12" style={{ color: 'rgba(26,61,34,0.5)' }}>Opdateret: juli 2026 · Priserne er vejledende markedsintervaller · Se også <a href="https://fdm.dk/vaerd-at-vide/ladeloesninger/hvad-koster-det-at-lade-en-elbil-op-hjemme" className="underline" target="_blank" rel="noopener noreferrer">FDM om hjemmeladning</a></p>

            <div className="space-y-10 text-sm leading-relaxed text-pretty" style={{ color: 'rgba(26,61,34,0.75)' }}>

              {/* Kort svar — målrettet Googles "fremhævede uddrag". */}
              <section>
                <p className="mb-3">
                  En ladeboks med standardinstallation koster typisk samlet 4.000-7.000 kr. Selve boksen ligger vejledende på 2.500-6.000 kr., mens installation typisk koster 1.500-3.500 kr.
                </p>
                <p>
                  Du kan også leje en ladeboks for typisk 79-199 kr. om måneden. En serviceaftale med refusion koster typisk 0-79 kr. om måneden og kan ændre det samlede regnestykke mærkbart.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Prisen på selve ladeboksen
                </h2>
                <p className="mb-3">
                  Selve ladeboksen koster typisk 2.500-6.000 kr. Prisen afhænger blandt andet af ladeeffekt, funktioner, app-styring og om boksen sælges alene eller som del af en samlet løsning.
                </p>
                <p className="mb-3">
                  Installation koster typisk yderligere 1.500-3.500 kr. Derfor ender boks og standardinstallation normalt på cirka 4.000-7.000 kr. samlet.
                </p>
                <p>
                  Prisen kan blive højere, hvis eltavlen skal opgraderes, kablet skal føres langt, eller installationen kræver ekstra arbejde. Bed derfor om et tilbud, der tydeligt viser, hvad standardinstallationen omfatter.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Skal du købe eller leje ladeboksen?
                </h2>
                <p className="mb-3">
                  Ved køb betaler du typisk en større engangsudgift, men ejer selv boksen. Det kan give mening, hvis du forventer at blive boende længe og ønsker frihed til at vælge serviceaftale.
                </p>
                <p className="mb-3">
                  Leje koster typisk 79-199 kr. om måneden. Det kan være attraktivt, hvis du foretrækker en lavere startudgift, men undersøg den samlede pris over flere år, bindingsperioden og vilkårene ved opsigelse.
                </p>
                <p>
                  Sammenlign også, hvem der betaler for installation, service, reparation og udskiftning. En lav månedspris er ikke nødvendigvis den billigste løsning samlet set.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Det egentlige regnestykke er strømmen
                </h2>
                <p className="mb-3">
                  Hjemmeladning koster typisk 2,00-3,50 kr. pr. kWh før refusion. Prisen varierer med elaftalen, tidspunktet for opladning, transport, afgifter og eventuelle tillæg og gebyrer.
                </p>
                <p className="mb-3">
                  Med en refusionsaftale kan den effektive pris i et eksempel lande omkring 0,73 kr. pr. kWh. Det er ikke en fast pris eller en garanti, da både elpris, refusionsbeløb og aftalevilkår kan ændre sig.
                </p>
                <p>
                  En moderne elbil bruger typisk 15-22 kWh pr. 100 km. Indtast dit månedlige kørselsbehov, bilens forbrug og din elpris i beregneren her på siden for at få et vejledende estimat baseret på dine egne tal.
                </p>

                {/* Animeret side-komponent i gradient-rammen (forsikring-side-mønstret). */}
                <div
                  className="rounded-3xl flex justify-center py-10 px-4 mt-6"
                  style={{ background: 'linear-gradient(160deg, rgba(168,224,99,0.12) 0%, rgba(26,61,34,0.05) 100%)' }}
                >
                  <LadeboksCalculator />
                </div>
                <p className="text-xs mt-3 text-center" style={{ color: 'rgba(26,61,34,0.5)' }}>
                  Beregn din månedlige ladeudgift med dine egne tal. Intet gemmes.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Refusionsaftaler, og hvad du skal kontrollere
                </h2>
                <p className="mb-3">
                  En serviceaftale med elafgiftsrefusion koster typisk 0-79 kr. om måneden. Den kan være økonomisk fordelagtig, hvis den mulige refusion overstiger abonnementsprisen og øvrige omkostninger.
                </p>
                <p className="mb-3">
                  Tjek, hvilken sats aftalen bruger, hvordan forbruget måles, og hvornår refusionen udbetales. Undersøg også krav til ladeboks, elaftale og installation samt eventuelle begrænsninger, bindinger og opsigelsesvilkår.
                </p>
                <p>
                  Sammenlign altid nettogevinsten efter abonnementet. Vilkår og din husstands forhold afgør, om en refusionsaftale reelt kan betale sig.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Ladeboks og elaftale hænger sammen
                </h2>
                <p className="mb-3">
                  En billig ladeboks sikrer ikke nødvendigvis billig opladning. Elprisen består af spotpris, transport, afgifter samt elselskabets tillæg og gebyrer, så den løbende strømpris kan få stor betydning over tid.
                </p>
                <p className="mb-3">
                  Du kan ofte påvirke udgiften ved at lade, når spotprisen er lav. Læs mere om <A href="/hvornar-er-strommen-billigst">hvornår strømmen er billigst</A>, og se, hvad du bør sammenligne, når du leder efter <A href="/billigste-elselskab">det billigste elselskab</A>.
                </p>
                <p>
                  Altid Energi er gebyrfrit og har ingen faste gebyrer eller abonnement. Når du sammenligner elaftaler, bør du stadig tage udgangspunkt i dit eget forbrug, dit lademønster og aftalens samlede pris.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Hvad Altid Hjem skal kunne
                </h2>
                <p className="mb-3">
                  Altid Hjem er bygget til at samle hjemmets faste udgifter til el, mobil, forsikring, opladning, alarm og mad i ét overblik med ét login. Altid Energi er tilgængeligt i dag, mens opladning og de øvrige tjenester er på vej.
                </p>
                <p className="mb-3">
                  For opladning skal Altid Hjem kunne gøre det lettere at se tjenesten sammen med hjemmets øvrige aftaler. Målet er et mere overskueligt grundlag for at forstå priser, vilkår og løbende udgifter.
                </p>
                <p>
                  Altid Hjem bygges af holdet bag Altid Energi, Danmarks første gebyrfrie energiselskab, hvor mere end 15.000 danskere allerede er kunder. Du kan skrive dig på ventelisten på altidhjem.dk.
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
            eyebrow='Opladning er en del af hjemmets faste udgifter'
            subtitle='Skriv dig gratis på ventelisten og få tidlig adgang, når Altid Hjem lanceres'
            source='hvad-koster-en-ladeboks'
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
