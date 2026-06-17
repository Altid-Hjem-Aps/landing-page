import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import BottomCta from '@/components/sections/BottomCta'
import Footer from '@/components/Footer'
import ForsikringHusstandMockup from '@/components/ForsikringHusstandMockup'

export const metadata: Metadata = {
  title: 'Hvad koster forsikring? Se priser i 2026 – Altid Hjem',
  description:
    'Hvad koster forsikring i Danmark? Se vejledende priser på indbo-, hus-, bil-, ulykkes- og rejseforsikring, hvorfor forsikringspriserne svinger så meget — og hvordan du tjekker, om du betaler for meget. Skriv dig gratis på ventelisten til Altid Hjem.',
  alternates: { canonical: 'https://altidhjem.dk/hvad-koster-forsikring' },
  openGraph: {
    title: 'Hvad koster forsikring? Se priser i 2026',
    description:
      'Vejledende priser på de mest almindelige forsikringer i Danmark — og sådan tjekker du, om du betaler for meget.',
    url: 'https://altidhjem.dk/hvad-koster-forsikring',
    type: 'article',
  },
}

const FOREST_TEXT = 'rgba(26,61,34,0.75)'

// Vejledende månedspriser (DK, 2026). Bevidst som INTERVALLER, ikke præcise
// gennemsnit: forsikringspris afhænger stærkt af bopæl, alder, dækning og
// selskab. Pointen på siden er netop spredningen — derfor kan det betale sig
// at tjekke. Ingen påstand om "billigste" eller kildeførte gennemsnit.
const PRISER: { type: string; interval: string; note: string }[] = [
  { type: 'Indboforsikring', interval: '100–250 kr./md.', note: 'Afhænger af husstandens størrelse, bopæl og dækningssum' },
  { type: 'Husforsikring', interval: '250–600 kr./md.', note: 'Afhænger af husets størrelse, alder, tag og værdi' },
  { type: 'Bilforsikring', interval: '400–900 kr./md.', note: 'Afhænger af bilen, din alder, postnummer og selvrisiko' },
  { type: 'Ulykkesforsikring', interval: '80–200 kr./md.', note: 'Afhænger af dækningssum og om erhverv er inkluderet' },
  { type: 'Årsrejseforsikring', interval: '30–60 kr./md.', note: 'Typisk 300–700 kr./år for en familie' },
]

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: { q: string; a: string[] }[] = [
  {
    q: 'Hvad koster en indboforsikring?',
    a: [
      'En indboforsikring koster typisk 100–250 kr. om måneden i Danmark.',
      'Prisen afhænger blandt andet af, hvor du bor, hvor stor din husstand er, og hvor høj en dækningssum du vælger.',
    ],
  },
  {
    q: 'Hvad koster en bilforsikring?',
    a: [
      'En bilforsikring koster typisk 400–900 kr. om måneden.',
      'Prisen afhænger af bilen, din alder, dit postnummer, din selvrisiko og din kørselshistorik. Forskellen mellem det dyreste og billigste selskab kan være flere tusinde kroner om året.',
    ],
  },
  {
    q: 'Hvorfor er forsikring så dyrt?',
    a: [
      'Forsikringspriserne er steget de seneste år på grund af inflation, dyrere reparationer og flere skader.',
      'Samtidig betaler mange for meget, fordi de bliver hos det samme selskab af gammel vane uden at tjekke prisen. Spredningen mellem selskaberne er stor.',
    ],
  },
  {
    q: 'Kan jeg spare ved at samle mine forsikringer?',
    a: [
      'Ofte ja. Mange selskaber giver en samlerabat, når du har flere forsikringer samme sted.',
      'Men en samlerabat er ikke automatisk den bedste pris. Det vigtigste er at se den samlede pris for alle dine forsikringer — ikke kun rabatten på den enkelte.',
    ],
  },
  {
    q: 'Hvordan ved jeg, om jeg er dobbeltforsikret?',
    a: [
      'Dobbeltdækning sker typisk, når to i samme husstand har samme forsikring hver for sig — fx to ulykkesforsikringer, eller et barn der står på begge forældres police.',
      'Det er svært at opdage selv, fordi policerne ligger hos forskellige selskaber. Altid Hjem viser hele husstandens forsikringer samlet ét sted og markerer, hvor I er dækket dobbelt.',
    ],
  },
  {
    q: 'Hvad er Altid Hjem?',
    a: [
      'Altid Hjem samler hjemmets faste udgifter — el, mobil, forsikring og mere — i én app med ét login og én samlet regning.',
      'Målet er, at du nemt kan se, om du betaler for meget, og få en fair pris uden at skulle holde styr på flere selskaber.',
    ],
  },
  {
    q: 'Koster det noget at skrive sig på ventelisten?',
    a: [
      'Nej. Det er gratis at skrive sig på ventelisten.',
      'Du får besked, når Altid Hjem åbner. De første på listen får adgang først.',
    ],
  },
]

export default function HvadKosterForsikring() {
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
          longPrefix: 'Mange familier betaler dobbelt for forsikring uden at vide det. ',
          shortPrefix: 'Betaler I dobbelt for forsikring? ',
          source: 'forsikring-banner',
        }}
      />
      <script
        type="application/ld+json"
        // '<' escapes som <: JSON.stringify escaper ikke '<', så en
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

            <h1 className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: 'var(--forest)' }}>
              Hvad koster forsikring i Danmark?
            </h1>
            <p className="text-xs mb-12" style={{ color: 'rgba(26,61,34,0.5)' }}>Opdateret: juni 2026</p>

            <div className="space-y-10 text-sm leading-relaxed" style={{ color: FOREST_TEXT }}>

              {/* Kort svar — målrettet Googles "fremhævede uddrag". */}
              <section>
                <p className="mb-3">
                  Det korte svar: De fleste forsikringer i Danmark koster mellem{' '}
                  <span className="font-medium" style={{ color: 'var(--forest)' }}>100 og 900 kr. om måneden</span>{' '}
                  afhængigt af typen. En indboforsikring ligger typisk lavest, en bilforsikring højest.
                </p>
                <p>
                  Men <span className="font-medium" style={{ color: 'var(--forest)' }}>forsikringsprisen svinger meget</span>{' '}
                  fra person til person og fra selskab til selskab. Derfor er det vigtigste tal ikke
                  gennemsnittet — men om <em>du</em> betaler for meget for præcis din dækning.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-4" style={{ color: 'var(--forest)' }}>
                  Hvad koster de mest almindelige forsikringer?
                </h2>
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ background: '#ffffff', border: '1px solid rgba(26,61,34,0.1)', boxShadow: '0 1px 3px rgba(26,61,34,0.06)' }}
                >
                  {PRISER.map((p, i) => (
                    <div
                      key={p.type}
                      className="flex items-baseline justify-between gap-4 px-5 py-4"
                      style={i > 0 ? { borderTop: '1px solid rgba(26,61,34,0.08)' } : undefined}
                    >
                      <div>
                        <p className="font-medium" style={{ color: 'var(--forest)' }}>{p.type}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(26,61,34,0.5)' }}>{p.note}</p>
                      </div>
                      <p className="font-semibold whitespace-nowrap" style={{ color: 'var(--forest)' }}>{p.interval}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-3" style={{ color: 'rgba(26,61,34,0.5)' }}>
                  Vejledende priser (2026). Din pris afhænger af bopæl, alder, valgt dækning og selskab —
                  og kan ligge både under og over intervallerne.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--forest)' }}>
                  Derfor svinger forsikringspriserne så meget
                </h2>
                <p className="mb-3">
                  To naboer med samme bil kan betale vidt forskellige priser. Det skyldes, at selskaberne
                  vægter risiko forskelligt og prissætter efter blandt andet:
                </p>
                <ul className="space-y-2 mb-3">
                  {['Din bopæl og dit postnummer', 'Din alder og historik', 'Den dækning og selvrisiko, du vælger', 'Om du har flere forsikringer samme sted (samlerabat)'].map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <span aria-hidden="true" style={{ color: 'var(--forest)' }}>•</span>
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  Forskellen mellem det dyreste og billigste selskab kan nemt være{' '}
                  <span className="font-medium" style={{ color: 'var(--forest)' }}>flere tusinde kroner om året</span>{' '}
                  for den samme dækning.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-4" style={{ color: 'var(--forest)' }}>
                  5 tegn på, at du betaler for meget
                </h2>
                <div className="space-y-3">
                  {[
                    'Du har ikke tjekket din forsikringspris i mere end to år.',
                    'Du er hos samme selskab af gammel vane — uden at have et samlet tilbud.',
                    'Dine forsikringer overlapper, så du er dobbeltdækket på det samme.',
                    'Du betaler for dækning eller tilvalg, du aldrig bruger.',
                    'Du har aldrig set den samlede pris for alle dine forsikringer ét sted.',
                  ].map((x, i) => (
                    <div key={x} className="flex gap-3 items-start">
                      <span
                        className="shrink-0 flex items-center justify-center rounded-full text-xs font-semibold"
                        style={{ width: 22, height: 22, background: 'var(--sage)', color: 'var(--forest)' }}
                      >
                        {i + 1}
                      </span>
                      <span>{x}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--forest)' }}>
                  Er du dobbeltforsikret uden at vide det?
                </h2>
                <p className="mb-3">
                  En af de dyreste — og mest oversete — fælder er{' '}
                  <span className="font-medium" style={{ color: 'var(--forest)' }}>dobbeltdækning</span>:
                  at to personer i samme husstand betaler for den samme dækning hver for sig. To
                  ulykkesforsikringer, en indboforsikring der allerede dækker hele husstanden, et
                  barn der står på både mors og fars police.
                </p>
                <p className="mb-3">
                  Problemet er, at ingen opdager det — fordi policerne ligger spredt hos forskellige
                  selskaber, med hver sin login og regning. Du kan ikke se hele husstanden ét sted.
                </p>
                <p className="mb-6">
                  Det er præcis dét, Altid Hjem gør smart: Du ser{' '}
                  <span className="font-medium" style={{ color: 'var(--forest)' }}>hele husstandens forsikringer samlet</span>{' '}
                  og får besked, hvis I er dækket dobbelt — så I kan opsige den, I ikke har brug for,
                  og beholde pengene.
                </p>

                {/* Animeret app-mockup: scanner husstanden, finder dobbelt-
                    dækninger og rydder automatisk op. */}
                <div
                  className="rounded-3xl flex justify-center py-10 px-4"
                  style={{ background: 'linear-gradient(160deg, rgba(168,224,99,0.12) 0%, rgba(26,61,34,0.05) 100%)' }}
                >
                  <ForsikringHusstandMockup />
                </div>
                <p className="text-xs mt-3 text-center" style={{ color: 'rgba(26,61,34,0.5)' }}>
                  Altid Hjem scanner husstanden, fanger dobbeltdækninger på tværs af jer — og rydder op.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--forest)' }}>
                  Sådan får du en fair forsikringspris med Altid Hjem
                </h2>
                <p className="mb-3">
                  Altid Hjem samler hjemmets faste udgifter — el, mobil, forsikring og mere — i{' '}
                  <span className="font-medium" style={{ color: 'var(--forest)' }}>
                    én app med ét login og én samlet regning
                  </span>
                  .
                </p>
                <p className="mb-3">
                  I stedet for at jonglere flere selskaber og fakturaer kan du se den samlede pris ét sted —
                  og nemt opdage, hvis du betaler for meget for din forsikring.
                </p>
                <p>
                  Altid Hjem er bygget af holdet bag Altid Energi, hvor mere end 14.000 danskere allerede
                  får gennemsigtig strøm til en fair pris. Samme princip tager vi nu videre til resten af
                  hjemmet: fair priser, gennemsigtighed og færre ting at holde styr på.
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

        <BottomCta
          eyebrow="Betaler du for meget for din forsikring?"
          subtitle="Tilmeld dig gratis ventelisten i dag og få tidlig adgang, når Altid Hjem lanceres"
          source="forsikring"
        />
      </main>
      <Footer />
    </>
  )
}
