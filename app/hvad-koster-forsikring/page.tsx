import type { Metadata } from 'next'
import ForsikringHusstandMockup from '@/components/ForsikringHusstandMockup'
import Guide, { GuideFigure, type GuideFaq } from '@/components/site/Guide'

export const metadata: Metadata = {
  title: 'Hvad koster forsikring i 2026? Se priser | Altid Hjem',
  description:
    'Hvad koster forsikring i Danmark? Se vejledende priser på indbo, hus, bil, ulykke og rejse. Find ud af, om du betaler for meget. Hent Altid Hjem gratis, og saml dine forsikringer ét sted.',
  alternates: { canonical: 'https://altidhjem.dk/hvad-koster-forsikring' },
  openGraph: {
    title: 'Hvad koster forsikring i Danmark?',
    description:
      'Se vejledende priser på de mest almindelige forsikringer, og find ud af, om du betaler for meget.',
    url: 'https://altidhjem.dk/hvad-koster-forsikring',
    type: 'article',
  },
}

// Vejledende månedspriser (DK, 2026) som INTERVALLER — forsikringspris afhænger
// stærkt af profil, dækning og selskab. Pointen er spredningen, ikke et præcist tal.
const PRISER: { type: string; interval: string; note: string }[] = [
  { type: 'Indboforsikring', interval: '140-250 kr./md.', note: 'Afhænger af adresse, husstand, indbosum, selvrisiko og tilvalg.' },
  { type: 'Husforsikring', interval: '250-600 kr./md.', note: 'Afhænger af husets størrelse, alder, tagtype, stand og beliggenhed.' },
  { type: 'Bilforsikring', interval: '400-900 kr./md.', note: 'Afhænger af bilen, førerens alder, postnummer, skadehistorik, kasko og selvrisiko.' },
  { type: 'Ulykkesforsikring', interval: '50-200 kr./md.', note: 'Afhænger af forsikringssum, alder, erhverv og om dækningen gælder fritid eller hele døgnet.' },
  { type: 'Årsrejseforsikring', interval: '30-100 kr./md.', note: 'Afhænger af antal personer, destination, dækning og tilvalg.' },
]

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: GuideFaq[] = [
  {
    q: 'Hvad koster en indboforsikring?',
    a: [
      'En indboforsikring koster typisk 140-250 kr. om måneden for en almindelig husstand.',
      'Prisen afhænger blandt andet af adresse, indbosum, husstandens størrelse, selvrisiko og tilvalg.',
    ],
  },
  {
    q: 'Hvad koster en bilforsikring?',
    a: [
      'En bilforsikring koster typisk 400-900 kr. om måneden, hvis du har kasko.',
      'Ansvarsforsikring alene kan være billigere, mens unge bilister, dyre biler og lav selvrisiko trækker prisen op.',
    ],
  },
  {
    q: 'Hvad koster en husforsikring?',
    a: [
      'En husforsikring koster ofte 250-600 kr. om måneden.',
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
      'Det kan fx være indbo, rejse eller en dækning, der allerede indgår i en anden police. Skriver I jeres forsikringer ind i Altid Hjem, har I dem samlet ét sted, så det er lettere selv at se overlap.',
    ],
  },
  {
    q: 'Hvad er Altid Hjem?',
    a: [
      'Altid Hjem er en dansk app, der samler madplan, strøm, forsikring og økonomi ét sted, så du får ét overblik, ét login.',
      'Du kan hente den gratis i App Store og Google Play.',
    ],
  },
  {
    q: 'Koster Altid Hjem noget?',
    a: [
      'Nej, appen er gratis at hente, og det er gratis at oprette sig.',
      'Du betaler kun for det, du selv vælger at bruge, for eksempel strøm fra Altid Energi, hvis du bliver kunde.',
    ],
  },
]

export default function HvadKosterForsikring() {
  return (
    <Guide
      title="Hvad koster forsikring i Danmark?"
      lead={
        <>
          <p>
            Det korte svar: De fleste private forsikringer i Danmark koster mellem <strong>30 og 900 kr. om måneden</strong> afhængigt af typen. En indboforsikring ligger
            typisk i den lave ende, en bilforsikring i den høje.
          </p>
          <p>
            Men gennemsnittet er sjældent det vigtigste. Det afgørende er, om <strong>du betaler for meget</strong> for den dækning, du faktisk har brug for.
          </p>
        </>
      }
      meta="Opdateret: juni 2026"
      faq={FAQ}
      cta={{
        eyebrow: 'Alle jeres forsikringer ét sted',
        heading: 'Hent Altid Hjem, og saml jeres forsikringer',
        subtitle: 'Skriv jeres forsikringer, priser og fornyelser ind i appen, så har I dem samlet ét sted.',
      }}
    >
      <section>
        <h2>Hvad koster de mest almindelige forsikringer?</h2>
        <div className="gd-table">
          <table>
            <tbody>
              {PRISER.map((p) => (
                <tr key={p.type}>
                  <th scope="row">{p.type}</th>
                  <td>{p.note}</td>
                  <td>{p.interval}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Vejledende priser for 2026. Din konkrete pris kan ligge både under og over intervallerne, afhængigt af din profil, dækning og dit forsikringsselskab.
        </p>
      </section>
      <section>
        <h2>Derfor svinger forsikringspriserne så meget</h2>
        <p>
          To naboer kan have samme bil, samme boligtype og samme forsikring og stadig betale vidt forskellige priser. Det skyldes, at selskaberne vurderer risiko
          forskelligt og prissætter blandt andet efter:
        </p>
        <ul>
          <li>Hvor du bor og dit postnummer</li>
          <li>Din alder og skadehistorik</li>
          <li>Din selvrisiko</li>
          <li>Din valgte dækning og tilvalg</li>
          <li>Om dine forsikringer er samlet samme sted (samlerabat)</li>
        </ul>
        <p>
          Derfor kan forskellen mellem det billigste og dyreste tilbud nemt være <strong>flere tusinde kroner om året</strong> for den samme dækning.
        </p>
        <p>Samlerabat kan hjælpe, men er ikke automatisk lig med den bedste pris. Det afgørende er den samlede pris for hele husstanden.</p>
      </section>
      <section>
        <h2>5 tegn på, at du betaler for meget</h2>
        <ol>
          <li>Du har ikke tjekket dine forsikringer i mere end to år.</li>
          <li>Du er blevet hos samme selskab af gammel vane.</li>
          <li>Du har flere forsikringer spredt på forskellige logins og regninger.</li>
          <li>Du betaler for dækninger eller tilvalg, du ikke bruger.</li>
          <li>Du ved ikke, hvad husstanden betaler samlet hver måned.</li>
        </ol>
      </section>
      <section>
        <h2>Er du dobbeltforsikret uden at vide det?</h2>
        <p>
          En af de dyreste fejl er også en af de nemmeste at overse: <strong>dobbeltdækning</strong>.
        </p>
        <p>
          Det sker, når to personer i samme husstand betaler for den samme dækning hver for sig. Det kan være to indboforsikringer, to rejseforsikringer, et barn der står
          på begge forældres police eller en dækning, der allerede ligger som del af en anden forsikring.
        </p>
        <p>
          Problemet er sjældent, at folk ikke vil rydde op. Problemet er, at de ikke kan se det: policerne ligger hos forskellige selskaber, med hver sin login og regning.
        </p>
        <p>
          Altid Hjem samler <strong>hele husstandens forsikringer ét sted</strong>, så I selv kan se, hvor I kan være dækket dobbelt. Så kan I beholde den rigtige dækning
          og opsige det, I ikke har brug for.
        </p>
        <GuideFigure tone="mint" caption="Et samlet overblik gør det lettere at se mulige dobbeltdækninger. Illustration, ikke et skærmbillede fra appen.">
          <ForsikringHusstandMockup />
        </GuideFigure>
      </section>
      <section>
        <h2>Sådan får du overblik over forsikringerne med Altid Hjem</h2>
        <p>
          Altid Hjem samler madplan, strøm, forsikring og økonomi i én app. Du får <strong>ét overblik, ét login</strong> og kan se, hvad hjemmet koster hver måned.
        </p>
        <p>
          Skriv jeres forsikringer, priser og fornyelser ind i appen, så har I dem samlet ét sted. Vil I have et tilbud, kan I bede om det i appen, og I bliver ringet op,
          når det er klart. Det er gratis og uforpligtende.
        </p>
        <p>
          Altid Hjem er bygget af holdet bag Altid Energi, hvor mere end 15.000 danskere allerede får gennemsigtig strøm til en fair pris. Nu tager vi samme princip videre
          til resten af hjemmet: færre skjulte udgifter, færre spredte regninger og mere kontrol.
        </p>
      </section>
    </Guide>
  )
}
