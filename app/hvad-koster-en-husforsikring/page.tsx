import type { Metadata } from 'next'
import ForsikringHusstandMockup from '@/components/ForsikringHusstandMockup'
import Guide, { GuideFigure, GuideLink as A, GuideSteps, type GuideFaq } from '@/components/site/Guide'

// The first guide built by the recipe (docs/guide-recipe.md, ALT-1714), topic approved by Thor on
// 16 Nov 2026. No neutral source publishes an average price for a husforsikring, so the page leads
// with the one solid number: the spread between companies in Forbrugerrådet Tænk's test.
export const metadata: Metadata = {
  title: 'Hvad koster en husforsikring? | Altid Hjem',
  description:
    'Forskellen mellem den billigste og den dyreste husforsikring kan være op til 9.200 kr. om året. Se, hvad der afgør prisen, og hvordan I sammenligner.',
  alternates: { canonical: 'https://www.altidhjem.dk/hvad-koster-en-husforsikring' },
  openGraph: {
    title: 'Hvad koster en husforsikring?',
    description:
      'Forskellen mellem den billigste og den dyreste husforsikring kan være op til 9.200 kr. om året. Se, hvad der afgør prisen, og hvordan I sammenligner.',
    url: 'https://www.altidhjem.dk/hvad-koster-en-husforsikring',
    type: 'article',
  },
}

const TAENK_HUB = 'https://taenk.dk/test/husforsikringer'
const TAENK_SELVRISIKO = 'https://taenk.dk/privatoekonomi/forsikringer/selvrisiko-skal-den-vaere-hoej-eller-lav'
const BOLIUS_HUS = 'https://www.bolius.dk/husforsikring-hvad-daekker-den-og-hvad-daekker-den-ikke-16636'
const TAENK_TEST = 'https://taenk.dk/test/husforsikringer/bedste-og-billigste-husforsikringer'
const TAENK_GUIDE = 'https://taenk.dk/test-og-forbrugerliv/privatoekonomi-og-aftaler/forsikring/husforsikring'
const DST = 'https://www.statistikbanken.dk/PRIS01'
const BOLIUS_BRAND = 'https://www.bolius.dk/brandforsikring-af-boligen-18406'
const FORSIKRINGSGUIDEN = 'https://www.forsikringsguiden.dk'
const TAENK_PRISER = 'https://taenk.dk/privatoekonomi/forsikringer/forsikringsselskaber-prisstigninger-markedsefterforskning'

// FAQ bruges to steder: synligt på siden og som FAQPage-schema.
const FAQ: GuideFaq[] = [
  {
    q: 'Hvad koster en husforsikring?',
    a: [
      'Der findes ikke en officiel gennemsnitspris, for prisen afhænger af huset, beliggenheden og den dækning, I vælger.',
      'Forbrugerrådet Tænks test fra oktober 2026 viser, at forskellen mellem det billigste og det dyreste selskab kan være op til 9.200 kroner om året.',
    ],
  },
  {
    q: 'Hvad er forskellen på husforsikring og indboforsikring?',
    a: [
      'Husforsikringen dækker skader på selve huset og det, der er fast monteret. Indboforsikringen dækker jeres ting i huset.',
      'Ejer I huset, skal I derfor tage stilling til begge.',
    ],
  },
  {
    q: 'Skal man have husforsikring, når man har lån i huset?',
    a: [
      'Banker og realkreditinstitutter kræver stort set altid, at huset er brandforsikret, før de giver lån i huset. Det er ikke et lovkrav.',
      'Tjek derfor, at jeres husforsikring indeholder brandforsikring, før I skifter selskab.',
    ],
  },
  {
    q: 'Bliver husforsikringen billigere med en højere selvrisiko?',
    a: [
      'Ja, typisk. Jo højere selvrisiko, desto lavere pris, men til gengæld betaler I selv mere, når der sker en skade.',
      'Vælg en selvrisiko, I kan betale uden at låne.',
    ],
  },
  {
    q: 'Kan det betale sig at skifte husforsikring?',
    a: [
      'Det er værd at tjekke, for priserne flytter sig. Ifølge Forbrugerrådet Tænk kan den samme husforsikring være blevet op til 6.600 kroner dyrere eller 4.000 kroner billigere på et år.',
      'Sammenlign med samme dækning og selvrisiko, og lad den nye forsikring begynde, før den gamle stopper.',
    ],
  },
  {
    q: 'Hvad er Altid Hjem?',
    a: [
      'Altid Hjem er en dansk app, der samler madplan, strøm, forsikring og økonomi ét sted, så I får ét overblik, ét login.',
      'I kan hente den gratis i App Store og Google Play.',
    ],
  },
  {
    q: 'Koster Altid Hjem noget?',
    a: [
      'Nej, appen er gratis at hente, og det er gratis at oprette en profil.',
      'I betaler kun for det, I selv vælger at bruge, for eksempel strøm fra Altid Energi, hvis I bliver kunder.',
    ],
  },
]

export default function HvadKosterEnHusforsikring() {
  return (
    <Guide
      title="Hvad koster en husforsikring?"
      lead={
        <>
          <p>
            Op til 9.200 kroner om året kan der være mellem det billigste og det dyreste selskab, viser Forbrugerrådet Tænks test af husforsikringer fra oktober 2026. Der
            findes altså ikke én pris på en husforsikring.
          </p>
          <p>Prisen afhænger især af husets beliggenhed, type, størrelse og byggeår, af jeres selvrisiko og af den dækning, I vælger.</p>
        </>
      }
      meta={
        <>
          Få jeres egen pris på{' '}
          <a href={FORSIKRINGSGUIDEN} target="_blank" rel="noopener noreferrer">
            Forsikringsguiden.dk
          </a>
        </>
      }
      answer={{
        label: 'Forskel mellem selskaberne',
        value: 'Op til 9.200',
        unit: 'kr. om året',
        note: 'Mellem det billigste og det dyreste selskab i Forbrugerrådet Tænks test af 13 selskaber, oktober 2026.',
      }}
      factors={{ label: 'Det afgør prisen', items: ['Beliggenhed', 'Hustype og størrelse', 'Byggeår', 'Selvrisiko', 'Dækning og tilvalg'] }}
      faq={FAQ}
      cta={{
        eyebrow: 'Alle jeres forsikringer ét sted',
        heading: 'Hent Altid Hjem, og saml husstandens forsikringer',
        subtitle: 'Skriv jeres forsikringer, priser og fornyelser ind i appen, så har I dem samlet ét sted.',
      }}
      page={{ path: '/hvad-koster-en-husforsikring', description: metadata.description as string, published: '2026-11-16', updated: '2026-11-16' }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'Forbrugerrådet Tænk', title: 'Har du den samme husforsikring som sidste år? Så tjek prisen', href: TAENK_TEST, note: 'Test af 13 selskaber, 6. oktober 2026' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Test af husforsikringer: Find den bedste husforsikring', href: TAENK_HUB, note: 'Testens metode: 13 selskaber, 25 eksempler, priser fra Forsikringsguiden.dk. Udgivet 6. oktober 2026' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Selvrisiko: Skal den være høj eller lav?', href: TAENK_SELVRISIKO, note: '24. oktober 2025' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Sådan vælger du den rette husforsikring', href: TAENK_GUIDE, note: '5. oktober 2026' },
          { publisher: 'Danmarks Statistik', title: 'PRIS01: Forbrugerprisindeks, gruppe 12.1.3 Boligrelateret forsikring', href: DST, note: 'Oktober 2021 til oktober 2026. Egne beregninger på baggrund af data fra Danmarks Statistik' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Forsikringsselskaber hæver priser i det skjulte: nu skal branchen efterforskes', href: TAENK_PRISER, note: '2. september 2025' },
          { publisher: 'Bolius', title: 'Husforsikring: hvad dækker den, og hvad dækker den ikke?', href: BOLIUS_HUS, note: 'Ajourført 11. juli 2024' },
          { publisher: 'Bolius', title: 'Brandforsikring af boligen', href: BOLIUS_BRAND, note: 'Ajourført 22. juni 2023' },
        ],
      }}
      related={['/hvad-koster-indboforsikring', '/hvad-koster-forsikring', '/skift-forsikringsselskab']}
    >
      <section>
        <h2>Hvad koster en husforsikring i 2026?</h2>
        <p>
          Der findes ingen officiel gennemsnitspris på en husforsikring. Prisen bliver regnet ud for netop jeres hus, og selskaberne vurderer risikoen forskelligt. Derfor kan
          to ens huse få vidt forskellige tilbud.
        </p>
        <p>
          Hvor stor forskellen kan være, viser <A href={TAENK_TEST}>Forbrugerrådet Tænks test</A> af 13 selskaber fra oktober 2026: Mellem det billigste og det dyreste
          selskab kan der være op til 9.200 kroner om året. <A href={TAENK_HUB}>Tænk regner hver pris ud</A> som et gennemsnit af 25 forskellige eksempler med en
          selvrisiko mellem 2.000 og 6.000 kroner.
        </p>
        <p>
          Prisen står heller ikke stille. Ifølge samme test kan den samme husforsikring være blevet op til 4.000 kroner billigere eller 6.600 kroner dyrere på et år.
        </p>
      </section>
      <section>
        <h2>Hvad afgør prisen på en husforsikring?</h2>
        <p>
          Ifølge <A href={TAENK_GUIDE}>Forbrugerrådet Tænk</A> afhænger prisen især af husets beliggenhed, hustypen, husets størrelse og det år, huset blev bygget. Har I haft
          mange skader før, bliver prisen typisk højere.
        </p>
        <p>
          Også jeres alder tæller. Tænks test viser, at forsikringen i gennemsnit er over 20 procent billigere at tegne, når man er 80 år, end når man er 20.
        </p>
        <p>
          Taget kan også betyde meget. Ifølge{' '}
          <A href="https://www.bolius.dk/husforsikring-hvad-daekker-den-og-hvad-daekker-den-ikke-16636">Bolius</A> er et hus med stråtag næsten altid dyrere at forsikre end et hus med en anden type tag.
        </p>
      </section>
      <section>
        <h2>Er husforsikringen blevet dyrere?</h2>
        <p>
          Ja. Danmarks Statistik følger priserne på boligrelaterede forsikringer i <A href={DST}>forbrugerprisindekset</A>. Fra oktober 2021 til oktober 2026 er de steget
          26,9 procent, mens de samlede forbrugerpriser er steget 16,9 procent.
        </p>
        <p>
          Tallene dækker hele gruppen af boligrelaterede forsikringer og ikke kun husforsikringer, så de viser retningen og ikke prisen på jeres egen police. Procenterne er vores egne
          beregninger ud fra Danmarks Statistiks indeks.
        </p>
        <p>
          Ifølge <A href={TAENK_PRISER}>Forbrugerrådet Tænk</A> betalte en gennemsnitlig dansk husstand i 2022 knap 2.300 kroner mere for sine skadesforsikringer, end den
          ville have gjort, hvis priserne kun havde fulgt med inflationen. Det er Tænks egen beregning, og den gælder alle skadesforsikringer, ikke kun husforsikringen.
        </p>
        <p>
          Samme artikel fortalte i september 2025, at Konkurrence- og Forbrugerstyrelsen skulle undersøge markedet for forsikringer. Bliver jeres forsikring bare fornyet
          hvert år, er prisen på fornyelsen ikke nødvendigvis den bedste, I kan få.
        </p>
      </section>
      <section>
        <h2>Hvad dækker en husforsikring?</h2>
        <p>
          Husforsikringen dækker skader på selve huset og det, der er fast monteret på det. Jeres møbler, tøj og elektronik hører under indboforsikringen, som vi har en{' '}
          <A href="/hvad-koster-indboforsikring">guide til her</A>.
        </p>
        <p>
          Dækningen varierer fra selskab til selskab. Ifølge <A href={BOLIUS_HUS}>Bolius</A> kan I blandt andet tilvælge dækning af svamp, råd, insekter, stikledninger og
          skjulte rør og kabler. I <A href={TAENK_HUB}>Tænks test</A> er udvidet vandskade et
          tilvalg hos alle 13 selskaber, så tjek, om I har brug for det.
        </p>
        <p>
          Bolius nævner de samme tilvalg og anbefaler at se dem igennem, før I vælger police, så I ved, hvad der er med, og hvad der ikke er.
        </p>
      </section>
      <section>
        <h2>Skal man have husforsikring, når man har lån i huset?</h2>
        <p>
          Ifølge <A href={BOLIUS_BRAND}>Bolius</A> kræver banker og realkreditinstitutter stort set altid, at huset er brandforsikret, før de giver lån i huset. Det er
          dog ikke et lovkrav.
        </p>
        <p>
          Brandforsikringen er også den eneste forsikring, selskabet ikke kan opsige. Tjek derfor, at den nye husforsikring indeholder brandforsikring, før I skifter.
        </p>
        <p>
          Giv også banken eller realkreditinstituttet besked, når I skifter selskab, så de har den rigtige police registreret, og spørg, om de har særlige krav til den.
        </p>
      </section>
      <section>
        <h2>Hvordan sammenligner I husforsikringer rigtigt?</h2>
        <p>
          <A href={TAENK_HUB}>Forbrugerrådet Tænk</A> henter priserne til sin test fra Forsikringsguiden.dk, og de 13 testede selskaber dækker ifølge Tænk over 80 procent
          af markedet. Det samme værktøj kan I selv bruge til at få et tilbud på jeres eget hus.
        </p>
        <p>
          Sammenlign altid med den samme dækning, de samme tilvalg og den samme selvrisiko. En lavere pris betyder ikke meget, hvis den skyldes, at stikledninger eller
          skjulte rør ikke er med.
        </p>
        <p>
          I guiden <A href="/hvad-koster-forsikring">Hvad koster forsikring?</A> kan I læse, hvad andre forsikringer typisk koster. I guiden om at{' '}
          <A href="/skift-forsikringsselskab">skifte forsikringsselskab</A> kan I se, hvordan I skifter uden huller i dækningen.
        </p>
      </section>
      <section>
        <h2>Skal I vælge høj eller lav selvrisiko?</h2>
        <p>
          Jo højere selvrisiko, desto lavere pris, skriver Forbrugerrådet Tænk. Til gengæld betaler I selv mere, når der sker en skade. I en{' '}
          <A href={TAENK_SELVRISIKO}>guide om selvrisiko</A> forklarer Tænk, at det samme gælder for indboforsikringen: Jo lavere selvrisiko, desto dyrere bliver
          forsikringen typisk.
        </p>
        <p>
          Vælg en selvrisiko, I kan betale uden at låne. Og når I sammenligner selskaber, så brug den samme selvrisiko hver gang. Ellers sammenligner I to forskellige
          forsikringer.
        </p>
      </section>
      <section>
        <h2>Regneeksempel: hvad betyder prisstigningerne?</h2>
        <p>Et eksempel, ikke jeres regning. Det bygger på disse antagelser:</p>
        <ul>
          <li>I betaler 6.000 kroner om året for husforsikringen i dag.</li>
          <li>Prisen stiger 4,7 procent om året, ligesom priserne på boligrelaterede forsikringer gjorde fra oktober 2025 til oktober 2026.</li>
          <li>I beholder den samme police uden at sammenligne.</li>
        </ul>
        <p>
          Næste år betaler I så 6.282 kroner, og efter tre år 6.886 kroner. Hvor meget jeres egen pris ændrer sig, kan I kun se ved at hente et nyt tilbud med samme dækning,
          for eksempel på <A href={FORSIKRINGSGUIDEN}>Forsikringsguiden.dk</A>.
        </p>
      </section>
      <GuideSteps
        title="Tjekliste før I skifter husforsikring"
        steps={[
          'Find jeres nuværende police frem, og skriv dækning, tilvalg og selvrisiko ned, så I kan sammenligne på samme betingelser.',
          'Hent mindst to tilbud med samme dækning og selvrisiko, og tjek især svamp og insekter, skjulte rør og stikledninger.',
          'Har I lån i huset, så tjek, at den nye forsikring indeholder brandforsikring, og giv banken eller realkreditinstituttet besked.',
          'Lad den nye forsikring begynde, før den gamle stopper, så I ikke står uden dækning en eneste dag.',
        ]}
      />
      <section>
        <h2>Hvordan kan Altid Hjem hjælpe?</h2>
        <p>
          Det er svært at huske, hvad husforsikringen koster, og hvornår den fornyes, når den bare bliver trukket hvert år. Altid Hjem samler madplan, strøm, forsikring og
          økonomi i én app, så I får ét overblik, ét login.
        </p>
        <p>
          Skriv jeres forsikringer, priser og fornyelser ind i appen, så har I dem samlet ét sted og kan nå at sammenligne før næste fornyelse. I kan hente appen gratis i
          App Store og Google Play.
        </p>
        <GuideFigure tone="mint" caption="Eksempel: husstandens forsikringer samlet i ét overblik. Illustration, ikke et skærmbillede fra appen.">
          <ForsikringHusstandMockup />
        </GuideFigure>
      </section>
    </Guide>
  )
}
