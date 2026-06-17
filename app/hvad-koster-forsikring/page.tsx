import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import BottomCta from '@/components/sections/BottomCta'
import Footer from '@/components/Footer'
import ForsikringHusstandMockup from '@/components/ForsikringHusstandMockup'

export const metadata: Metadata = {
  title: 'Hvad koster forsikring i 2026? Se priser – Altid Hjem',
  description:
    'Hvad koster forsikring i Danmark? Se vejledende priser på indbo, hus, bil, ulykke og rejse — og find ud af, om du betaler for meget. Skriv dig gratis på ventelisten til Altid Hjem.',
  alternates: { canonical: 'https://altidhjem.dk/hvad-koster-forsikring' },
  openGraph: {
    title: 'Hvad koster forsikring i Danmark?',
    description:
      'Se vejledende priser på de mest almindelige forsikringer, og find ud af, om du betaler for meget.',
    url: 'https://altidhjem.dk/hvad-koster-forsikring',
    type: 'article',
  },
}

const FOREST_TEXT = 'rgba(26,61,34,0.75)'

// Vejledende månedspriser (DK, 2026) som INTERVALLER — forsikringspris afhænger
// stærkt af profil, dækning og selskab. Pointen er spredningen, ikke et præcist tal.
const PRISER: { type: string; interval: string; note: string }[] = [
  { type: 'Indboforsikring', interval: '140–250 kr./md.', note: 'Afhænger af adresse, husstand, indbosum, selvrisiko og tilvalg.' },
  { type: 'Husforsikring', interval: '250–600 kr./md.', note: 'Afhænger af husets størrelse, alder, tagtype, stand og beliggenhed.' },
  { type: 'Bilforsikring', interval: '400–900 kr./md.', note: 'Afhænger af bilen, førerens alder, postnummer, skadehistorik, kasko og selvrisiko.' },
  { type: 'Ulykkesforsikring', interval: '50–200 kr./md.', note: 'Afhænger af forsikringssum, alder, erhverv og om dækningen gælder fritid eller hele døgnet.' },
  { type: 'Årsrejseforsikring', interval: '30–100 kr./md.', note: 'Afhænger af antal personer, destination, dækning og tilvalg.' },
]

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: { q: string; a: string[] }[] = [
  {
    q: 'Hvad koster en indboforsikring?',
    a: [
      'En indboforsikring koster typisk 140–250 kr. om måneden for en almindelig husstand.',
      'Prisen afhænger blandt andet af adresse, indbosum, husstandens størrelse, selvrisiko og tilvalg.',
    ],
  },
  {
    q: 'Hvad koster en bilforsikring?',
    a: [
      'En bilforsikring koster typisk 400–900 kr. om måneden, hvis du har kasko.',
      'Ansvarsforsikring alene kan være billigere, mens unge bilister, dyre biler og lav selvrisiko trækker prisen op.',
    ],
  },
  {
    q: 'Hvad koster en husforsikring?',
    a: [
      'En husforsikring koster ofte 250–600 kr. om måneden.',
      'Prisen afhænger især af husets størrelse, alder, byggematerialer, tagtype, stand og beliggenhed.',
    ],
  },
  {
    q: 'Hvorfor er forsikring så dyrt?',
    a: [
      'Forsikring er blevet dyrere, fordi reparationer, materialer og skader generelt koster mere.',
      'Samtidig bliver mange hos samme selskab i mange år uden at tjekke, om prisen stadig er fair.',
    ],
  },
  {
    q: 'Kan jeg spare ved at samle mine forsikringer?',
    a: [
      'Nogle selskaber giver samlerabat, når du har flere forsikringer samme sted.',
      'Men samlerabat betyder ikke nødvendigvis den laveste samlede pris. Det vigtigste er at se hele husstandens pris samlet.',
    ],
  },
  {
    q: 'Hvordan ved jeg, om jeg er dobbeltforsikret?',
    a: [
      'Du kan være dobbeltforsikret, hvis flere i husstanden betaler for den samme dækning hver for sig.',
      'Det kan fx være indbo, rejse eller en dækning, der allerede indgår i en anden police. Altid Hjem samler overblikket og markerer mulige overlap.',
    ],
  },
  {
    q: 'Hvad er Altid Hjem?',
    a: [
      'Altid Hjem samler hjemmets faste udgifter i én app med ét overblik.',
      'Målet er at gøre det nemmere at se, hvad du betaler, finde unødvendige udgifter og få mere kontrol over økonomien i hjemmet.',
    ],
  },
  {
    q: 'Koster det noget at skrive sig på ventelisten?',
    a: [
      'Nej. Det er gratis at skrive sig på ventelisten.',
      'Du får besked, når Altid Hjem åbner, så du kan få et samlet overblik over hjemmets forsikringer ét sted.',
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
          longPrefix: 'Mange husstande betaler dobbelt for forsikring uden at vide det. ',
          shortPrefix: 'Er du dobbeltforsikret uden at vide det? ',
          source: 'forsikring-banner',
          cta: 'Se om du betaler for meget →',
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
                  Det korte svar: De fleste private forsikringer i Danmark koster mellem{' '}
                  <span className="font-medium" style={{ color: 'var(--forest)' }}>30 og 900 kr. om måneden</span>{' '}
                  afhængigt af typen. En indboforsikring ligger typisk i den lave ende, en bilforsikring i den høje.
                </p>
                <p>
                  Men gennemsnittet er sjældent det vigtigste. Det afgørende er, om{' '}
                  <span className="font-medium" style={{ color: 'var(--forest)' }}>du betaler for meget</span>{' '}
                  for den dækning, du faktisk har brug for.
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
                  Vejledende priser for 2026. Din konkrete pris kan ligge både under og over intervallerne,
                  afhængigt af din profil, dækning og dit forsikringsselskab.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--forest)' }}>
                  Derfor svinger forsikringspriserne så meget
                </h2>
                <p className="mb-3">
                  To naboer kan have samme bil, samme boligtype og samme forsikring og stadig betale vidt
                  forskellige priser. Det skyldes, at selskaberne vurderer risiko forskelligt og prissætter
                  blandt andet efter:
                </p>
                <ul className="space-y-2 mb-3">
                  {['Hvor du bor og dit postnummer', 'Din alder og skadehistorik', 'Din selvrisiko', 'Din valgte dækning og tilvalg', 'Om dine forsikringer er samlet samme sted (samlerabat)'].map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <span aria-hidden="true" style={{ color: 'var(--forest)' }}>•</span>
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
                <p className="mb-3">
                  Derfor kan forskellen mellem det billigste og dyreste tilbud nemt være{' '}
                  <span className="font-medium" style={{ color: 'var(--forest)' }}>flere tusinde kroner om året</span>{' '}
                  for den samme dækning.
                </p>
                <p>
                  Samlerabat kan hjælpe — men er ikke automatisk lig med den bedste pris. Det afgørende er
                  den samlede pris for hele husstanden.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-4" style={{ color: 'var(--forest)' }}>
                  5 tegn på, at du betaler for meget
                </h2>
                <div className="space-y-3">
                  {[
                    'Du har ikke tjekket dine forsikringer i mere end to år.',
                    'Du er blevet hos samme selskab af gammel vane.',
                    'Du har flere forsikringer spredt på forskellige logins og regninger.',
                    'Du betaler for dækninger eller tilvalg, du ikke bruger.',
                    'Du ved ikke, hvad husstanden betaler samlet hver måned.',
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
                  En af de dyreste fejl er også en af de nemmeste at overse:{' '}
                  <span className="font-medium" style={{ color: 'var(--forest)' }}>dobbeltdækning</span>.
                </p>
                <p className="mb-3">
                  Det sker, når to personer i samme husstand betaler for den samme dækning hver for sig. Det
                  kan være to indboforsikringer, to rejseforsikringer, et barn der står på begge forældres
                  police — eller en dækning, der allerede ligger som del af en anden forsikring.
                </p>
                <p className="mb-3">
                  Problemet er sjældent, at folk ikke vil rydde op. Problemet er, at de ikke kan se det:
                  policerne ligger hos forskellige selskaber, med hver sin login og regning.
                </p>
                <p className="mb-6">
                  Altid Hjem samler{' '}
                  <span className="font-medium" style={{ color: 'var(--forest)' }}>hele husstandens forsikringer ét sted</span>{' '}
                  og markerer, hvor I kan være dækket dobbelt — så I kan beholde den rigtige dækning og opsige
                  det, I ikke har brug for.
                </p>

                {/* Animeret app-mockup: scanner husstanden, finder mulige dobbeltdækninger og rydder op. */}
                <div
                  className="rounded-3xl flex justify-center py-10 px-4"
                  style={{ background: 'linear-gradient(160deg, rgba(168,224,99,0.12) 0%, rgba(26,61,34,0.05) 100%)' }}
                >
                  <ForsikringHusstandMockup />
                </div>
                <p className="text-xs mt-3 text-center" style={{ color: 'rgba(26,61,34,0.5)' }}>
                  Altid Hjem scanner husstandens forsikringer, finder mulige dobbeltdækninger og viser, hvad
                  I kan rydde op i. Den personlige ulykkesforsikring beholdes.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--forest)' }}>
                  Sådan får du en fair forsikringspris med Altid Hjem
                </h2>
                <p className="mb-3">
                  Altid Hjem samler hjemmets faste udgifter i én app. El, mobil, forsikring, internet og
                  flere services er på vej. Du får{' '}
                  <span className="font-medium" style={{ color: 'var(--forest)' }}>ét login, én samlet regning</span>{' '}
                  og et klart overblik over, hvad hjemmet koster hver måned.
                </p>
                <p className="mb-3">
                  I stedet for at logge ind hos flere selskaber og holde styr på forskellige regninger, får
                  du alt samlet ét sted. Det gør det lettere at se, hvad du betaler for hver måned, og opdage,
                  hvis du betaler for meget.
                </p>
                <p>
                  Altid Hjem er bygget af holdet bag Altid Energi, hvor mere end 14.000 danskere allerede får
                  gennemsigtig strøm til en fair pris. Nu tager vi samme princip videre til resten af hjemmet:
                  færre skjulte udgifter, færre spredte regninger og mere kontrol.
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
          subtitle="Skriv dig gratis på ventelisten og få tidlig adgang, når Altid Hjem lanceres"
          source="forsikring"
        />
      </main>
      <Footer />
    </>
  )
}
