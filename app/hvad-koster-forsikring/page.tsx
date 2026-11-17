import type { Metadata } from 'next'
import { SITE_IMAGE } from '@/lib/site-image'
import ForsikringHusstandMockup from '@/components/ForsikringHusstandMockup'
import Guide, { type GuideFaq, GuideFigure, GuideLink as A, GuideStores } from '@/components/site/Guide'
import { GUIDES } from '@/lib/guides'

// Brought up to the guide recipe (docs/guide-recipe.md) on 16 Nov 2026. The old price ranges per
// insurance had no source; the page now leads with Danmarks Statistik's household spending on
// insurance in 2024 (the sum of the insurance groups in FU12, our own calculation) and gives a
// sourced number per insurance where one exists.
export const metadata: Metadata = {
  title: 'Hvad koster forsikring i 2026? Se priser | Altid Hjem',
  description:
    '21.227 kroner brugte en gennemsnitlig dansk husstand på forsikringer i 2024, ifølge tal fra Danmarks Statistik. Se, hvad de enkelte forsikringer koster.',
  alternates: { canonical: 'https://www.altidhjem.dk/hvad-koster-forsikring' },
  openGraph: {
    title: 'Hvad koster forsikring i Danmark?',
    description:
      '21.227 kroner brugte en gennemsnitlig dansk husstand på forsikringer i 2024, ifølge tal fra Danmarks Statistik. Se, hvad de enkelte forsikringer koster.',
    url: 'https://www.altidhjem.dk/hvad-koster-forsikring',
    type: 'article',
    images: [SITE_IMAGE],
  },
  twitter: { card: 'summary_large_image', images: [SITE_IMAGE] },
}

const DST_FU = 'https://www.statistikbanken.dk/FU12'
const DST_PRIS = 'https://www.statistikbanken.dk/PRIS01'
const TAENK_INDBO = 'https://taenk.dk/test-og-forbrugerliv/privatoekonomi-og-aftaler/forsikring/indboforsikring-bedst-billigst'
const TAENK_HUS = 'https://taenk.dk/test/husforsikringer/bedste-og-billigste-husforsikringer'
const TAENK_HUS_GUIDE = 'https://taenk.dk/test-og-forbrugerliv/privatoekonomi-og-aftaler/forsikring/husforsikring'
const FDM_PRIS = 'https://fdm.dk/nyheder/nyt-om-trafik-og-biler/2025-02-derfor-stiger-prisen-paa-din-bilforsikring'
const FDM_GUIDE = 'https://fdm.dk/guides/rettigheder-garanti-og-forsikring/hvilke-forsikringer-skal-du-have-til-bilen'
const TAENK_LEDER = 'https://taenk.dk/det-kaemper-vi-for/leder/er-du-loyal-forsikringskunde-kan-det-koste-dig-5000-kr-om-aaret'
const TAENK_LOYAL = 'https://taenk.dk/privatoekonomi/forsikringer/det-er-dyrt-vaere-en-loyal-kunde-i-forsikringsselskaber'
const TAENK_PRISER = 'https://taenk.dk/privatoekonomi/forsikringer/forsikringsselskaber-prisstigninger-markedsefterforskning'
const BOLIUS_BRAND = 'https://www.bolius.dk/brandforsikring-af-boligen-18406'
const FORSIKRINGSGUIDEN = 'https://www.forsikringsguiden.dk'

// Danmarks Statistik, FU12, løbende priser, 2024: kroner pr. husstand om året. Månedstallet er
// årstallet delt med 12 og afrundet (egne beregninger).
const FORBRUG: { gruppe: string; aar: string; md: string }[] = [
  { gruppe: 'Livs- og ulykkesforsikring', aar: '8.467 kr.', md: '706 kr.' },
  { gruppe: 'Boligrelateret forsikring', aar: '5.321 kr.', md: '443 kr.' },
  { gruppe: 'Transportforsikring', aar: '4.556 kr.', md: '380 kr.' },
  { gruppe: 'Sygeforsikring', aar: '1.614 kr.', md: '135 kr.' },
  { gruppe: 'Anden forsikring', aar: '737 kr.', md: '61 kr.' },
  { gruppe: 'Rejseforsikring', aar: '532 kr.', md: '44 kr.' },
  { gruppe: 'Forsikringer i alt', aar: '21.227 kr.', md: '1.769 kr.' },
]

// FAQ bruges to steder: synligt på siden og som FAQPage-schema.
const FAQ: GuideFaq[] = [
  {
    q: 'Hvad koster forsikring i Danmark?',
    a: [
      'En gennemsnitlig dansk husstand brugte 21.227 kroner på forsikringer i 2024, eller cirka 1.770 kroner om måneden. Det er vores beregning på tal fra Danmarks Statistiks forbrugsundersøgelse.',
      'Jeres egen pris afhænger af, hvilke forsikringer I har, og af jeres bolig, bil, alder og selvrisiko.',
    ],
  },
  {
    q: 'Hvad koster en indboforsikring?',
    a: [
      'Ifølge Forbrugerrådet Tænk koster en indboforsikring for en gennemsnitsfamilie typisk mellem 1.700 og 3.000 kroner om året.',
      'Prisen afhænger blandt andet af indbosummen, selvrisikoen og jeres alder.',
    ],
  },
  {
    q: 'Hvad koster en bilforsikring?',
    a: [
      'Ifølge FDM kostede en kaskoforsikring i gennemsnit 6.239 kroner i 2024. Tallet bygger på data fra Samlino.dk.',
      'Prisen afhænger af bilen, jeres alder og bopæl og af, hvor mange kilometer I kører om året.',
    ],
  },
  {
    q: 'Hvad koster en husforsikring?',
    a: [
      'Der findes ingen officiel gennemsnitspris, for prisen regnes ud for det enkelte hus.',
      'Forbrugerrådet Tænks test fra oktober 2026 viser, at forskellen mellem det billigste og det dyreste selskab kan være op til 9.200 kroner om året.',
    ],
  },
  {
    q: 'Hvorfor er forsikring blevet dyrere?',
    a: [
      'Priserne på forsikringer steg 20,8 procent fra oktober 2021 til oktober 2026, mens de samlede forbrugerpriser steg 16,9 procent. Det er vores beregning på Danmarks Statistiks forbrugerprisindeks.',
      'Ifølge en rapport fra april 2025, som Forbrugerrådet Tænk omtaler, hæver mange forsikringsselskaber priserne automatisk, så de følger lønudviklingen.',
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

export default function HvadKosterForsikring() {
  return (
    <Guide
      title={GUIDES['/hvad-koster-forsikring'].title}
      lead={
        <>
          <p>
            21.227 kroner brugte en gennemsnitlig dansk husstand på forsikringer i 2024. Det svarer til cirka 1.770 kroner om måneden og er vores beregning på tal fra
            Danmarks Statistiks forbrugsundersøgelse.
          </p>
          <p>Jeres egen pris afhænger af, hvilke forsikringer I har, og af jeres bolig, bil, alder, bopæl og selvrisiko.</p>
        </>
      }
      meta={<>Kilde: Danmarks Statistik, forbrugsundersøgelsen 2024</>}
      answer={{
        label: 'Forsikringer pr. husstand, 2024',
        value: '21.227',
        unit: 'kr. om året',
        note: 'Gennemsnit for alle danske husstande, cirka 1.770 kr. om måneden. Egne beregninger på tal fra Danmarks Statistik.',
      }}
      factors={{ label: 'Det afgør prisen', items: ['Hvilke forsikringer I har', 'Bolig og bil', 'Alder og bopæl', 'Selvrisiko', 'Dækning og tilvalg'] }}
      faq={FAQ}
      cta={{
        eyebrow: 'Alle jeres forsikringer ét sted',
        heading: 'Hent Altid Hjem, og saml jeres forsikringer',
        subtitle: 'Skriv jeres forsikringer, priser og fornyelser ind i appen, så har I dem samlet ét sted.',
      }}
      page={{ path: '/hvad-koster-forsikring', description: metadata.description as string, published: GUIDES['/hvad-koster-forsikring'].published, updated: GUIDES['/hvad-koster-forsikring'].updated }}
      sources={{
        checked: '2026-11-16',
        items: [
          {
            publisher: 'Danmarks Statistik',
            title: 'FU12: Husstandenes gennemsnitlige forbrug',
            href: DST_FU,
            note: 'Forsikringsgrupperne 12.1.1.0 til 12.1.9.0, 2024, løbende priser, kr. pr. husstand. Egne beregninger på baggrund af data fra Danmarks Statistik',
          },
          {
            publisher: 'Danmarks Statistik',
            title: 'PRIS01: Forbrugerprisindeks, gruppe 12.1 Forsikring og 12.1.3 Boligrelateret forsikring',
            href: DST_PRIS,
            note: 'Oktober 2021 til oktober 2026. Egne beregninger på baggrund af data fra Danmarks Statistik',
          },
          { publisher: 'Forbrugerrådet Tænk', title: 'Sådan finder du den bedste og billigste indboforsikring', href: TAENK_INDBO, note: '21. maj 2024' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Har du den samme husforsikring som sidste år? Så tjek prisen', href: TAENK_HUS, note: '6. oktober 2026' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Sådan vælger du den rette husforsikring', href: TAENK_HUS_GUIDE, note: '5. oktober 2026' },
          { publisher: 'FDM', title: 'Derfor stiger prisen på din bilforsikring', href: FDM_PRIS, note: '25. februar 2025. Gennemsnitspriser på data fra Samlino.dk' },
          { publisher: 'FDM', title: 'Hvilke forsikringer skal du have til bilen?', href: FDM_GUIDE, note: '19. maj 2025' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Er du loyal forsikringskunde, kan det koste dig 5.000 kr. om året', href: TAENK_LEDER, note: '2. september 2025' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Det er dyrt at være en loyal kunde i forsikringsselskaber', href: TAENK_LOYAL, note: '2. april 2025' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Forsikringsselskaber hæver priser i det skjulte: nu skal branchen efterforskes', href: TAENK_PRISER, note: '2. september 2025' },
          { publisher: 'Bolius', title: 'Brandforsikring af boligen', href: BOLIUS_BRAND, note: 'Ajourført 22. juni 2023' },
          { publisher: 'Forsikringsguiden', title: 'Uvildig og nem sammenligning af forsikringer', href: FORSIKRINGSGUIDEN, note: 'Sammenligner pris og dækning hos 86 procent af selskaberne i Danmark, læst 16. november 2026' },
        ],
      }}
      related={['/hvad-koster-en-husforsikring', '/hvad-koster-en-bilforsikring', '/hvad-koster-indboforsikring']}
    >
      <section>
        <h2>Hvad bruger en husstand på forsikringer om året?</h2>
        <p>
          Danmarks Statistik opgør hvert år, hvad husstandene bruger penge på. Ifølge <A href={DST_FU}>forbrugsundersøgelsen</A> brugte en gennemsnitlig husstand 21.227
          kroner på forsikringer i 2024. Tallet er vores egen sum af statistikkens forsikringsgrupper. Månedstallene er årstallene delt med 12 og
          afrundet.
        </p>
        <div className="gd-table">
          <table>
            <thead>
              <tr>
                <th scope="col">Forsikring, 2024</th>
                <th scope="col">Om året</th>
                <th scope="col">Om måneden</th>
              </tr>
            </thead>
            <tbody>
              {FORBRUG.map((f) => (
                <tr key={f.gruppe}>
                  <th scope="row">{f.gruppe}</th>
                  <td>{f.aar}</td>
                  <td>{f.md}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Tallene er et gennemsnit for alle husstande, også dem uden bil eller hus. Har I bil, hus og børn, betaler I derfor typisk mere end gennemsnittet i de
          grupper, der gælder for jer.
        </p>
      </section>
      <section>
        <h2>Hvad koster de enkelte forsikringer?</h2>
        <p>
          <strong>Indboforsikring:</strong> Ifølge <A href={TAENK_INDBO}>Forbrugerrådet Tænk</A> koster en indboforsikring for en gennemsnitsfamilie typisk mellem 1.700 og
          3.000 kroner om året. Læs mere i guiden <A href="/hvad-koster-indboforsikring">Hvad koster en indboforsikring?</A>
        </p>
        <p>
          <strong>Husforsikring:</strong> Der findes ingen officiel gennemsnitspris. <A href={TAENK_HUS}>Tænks test fra oktober 2026</A> viser, at der kan være op til
          9.200 kroner om året mellem det billigste og det dyreste selskab. Se guiden <A href="/hvad-koster-en-husforsikring">Hvad koster en husforsikring?</A>
        </p>
        <p>
          <strong>Bilforsikring:</strong> Ifølge <A href={FDM_PRIS}>FDM</A> kostede en kaskoforsikring i gennemsnit 6.239 kroner i 2024, på tal fra Samlino.dk. Se guiden{' '}
          <A href="/hvad-koster-en-bilforsikring">Hvad koster en bilforsikring?</A>
        </p>
        <p>
          <strong>Ulykkes- og rejseforsikring:</strong> Ikke oplyst. Vi har ikke fundet en uafhængig gennemsnitspris for den enkelte police, kun husstandenes samlede
          forbrug i tabellen ovenfor.
        </p>
      </section>
      <section>
        <h2>Hvilke forsikringer er et krav?</h2>
        <p>
          Kun få. Ifølge <A href={FDM_GUIDE}>FDM</A> er det lovpligtigt at have ansvarsforsikring på bilen. Har I lånt penge til bilen, eller er den leaset, er det som
          udgangspunkt også et krav, at I har kasko.
        </p>
        <p>
          Brandforsikring af huset er ikke et lovkrav, skriver <A href={BOLIUS_BRAND}>Bolius</A>. Men banker og realkreditinstitutter kræver stort set altid, at huset er
          brandforsikret, før I kan låne penge i det.
        </p>
        <p>
          Indboforsikringen er frivillig, men den dækker mere end jeres ting. Ifølge <A href={TAENK_INDBO}>Forbrugerrådet Tænk</A> indeholder den også en
          ansvarsforsikring og en retshjælpsforsikring. Ansvarsforsikringen dækker blandt andet, hvis I laver skade på andres ting.
        </p>
      </section>
      <section>
        <h2>Hvorfor betaler to husstande forskellige priser?</h2>
        <p>
          Selskaberne regner prisen ud for netop jer. Prisen på en husforsikring afhænger ifølge <A href={TAENK_HUS_GUIDE}>Forbrugerrådet Tænk</A> af husets beliggenhed,
          hustypen, husets størrelse og byggeåret. Prisen på en bilforsikring afhænger ifølge <A href={FDM_GUIDE}>FDM</A> af jeres alder, bopæl, hvor mange kilometer I kører
          om året, og bilen selv.
        </p>
        <p>
          Selvrisikoen betyder også meget. I <A href={TAENK_INDBO}>Tænks analyse</A> af 14 selskaber faldt prisen på en indboforsikring i gennemsnit 24,4 procent, når
          selvrisikoen gik fra 0 til 3.000 kroner. Til gengæld betaler I selv mere, når der sker en skade.
        </p>
        <p>Sammenlign derfor altid tilbud med den samme dækning, de samme tilvalg og den samme selvrisiko.</p>
      </section>
      <section>
        <h2>Er forsikring blevet dyrere?</h2>
        <p>
          Ja. Ifølge Danmarks Statistiks <A href={DST_PRIS}>forbrugerprisindeks</A> steg priserne på forsikringer 20,8 procent fra oktober 2021 til oktober 2026, mens de
          samlede forbrugerpriser steg 16,9 procent. Boligrelaterede forsikringer steg 26,9 procent. Procenterne er vores egne beregninger ud fra indekset.
        </p>
        <p>
          <A href={TAENK_LEDER}>Forbrugerrådet Tænk</A> har regnet ud, at en gennemsnitlig husstand i dag betaler over 5.000 kroner mere om året for skadesforsikringer,
          end hvis priserne var steget i samme takt som priserne i samfundet generelt.
        </p>
        <p>
          Ifølge en rapport fra april 2025, som <A href={TAENK_PRISER}>Tænk</A> omtaler, hæver mange forsikringsselskaber priserne automatisk, så de følger
          lønudviklingen. I september 2025 skrev Tænk, at Konkurrence- og Forbrugerstyrelsen havde indledt en markedsefterforskning af forsikringsbranchen.
        </p>
      </section>
      <section>
        <h2>Betaler trofaste kunder mere for forsikringen?</h2>
        <p>
          Ofte, ja. Ifølge <A href={TAENK_LEDER}>Forbrugerrådet Tænk</A> viste en rapport fra Konkurrencerådet i april 2025, at kunder, der har været i samme selskab i 10
          år, typisk betaler 100 kroner mere om måneden end nye kunder i samme selskab.
        </p>
        <p>
          Ifølge Konkurrencerådet, som Tænk citerer, er <A href={TAENK_LOYAL}>merprisen for at være loyal</A> steget de seneste fem til ti år. Tænk anbefaler at
          gennemgå forsikringerne mindst hvert andet år. Hent et tilbud med samme dækning, og brug det til at spørge jeres nuværende selskab om prisen. Bliver I, hvor I er, så gør det, fordi prisen og
          dækningen passer, og ikke af vane.
        </p>
      </section>
      <section>
        <h2>Er I dobbeltforsikret uden at vide det?</h2>
        <p>
          Dobbeltdækning er let at overse. Det sker, når to i samme husstand betaler for den samme dækning hver for sig, for eksempel når et par flytter sammen med hver sin
          indboforsikring.
        </p>
        <p>
          Ifølge <A href={TAENK_INDBO}>Forbrugerrådet Tænk</A> dækker indboforsikringen som udgangspunkt alle i husstanden, både børn og voksne. Ligger policerne hos
          forskellige selskaber med hver sit login, er overlappet svært at se.
        </p>
        <p>Læg policerne ved siden af hinanden, og få selskaberne til at bekræfte, hvem der er dækket, før I opsiger noget.</p>
      </section>
      <section>
        <h2>Regneeksempel: hvad koster tre forsikringer om måneden?</h2>
        <p>Et eksempel, ikke jeres regning. Det bygger på disse antagelser:</p>
        <ul>
          <li>I betaler 2.400 kroner om året for indboforsikringen, inden for Tænks spænd på 1.700 til 3.000 kroner.</li>
          <li>I betaler 6.239 kroner om året for kasko på bilen, som var FDMs gennemsnit i 2024.</li>
          <li>I betaler 6.000 kroner om året for husforsikringen. Det er et antaget beløb, for der findes ingen officiel gennemsnitspris.</li>
          <li>Priserne stiger 2,7 procent på et år, ligesom forsikringer i forbrugerprisindekset gjorde fra oktober 2025 til oktober 2026.</li>
        </ul>
        <p>
          I alt betaler I så 14.639 kroner om året, eller 1.220 kroner om måneden. Næste år bliver det cirka 15.030 kroner. Hvad jeres egne forsikringer koster, kan I
          kun se ved at hente tilbud. Priserne kan I sammenligne på <A href={FORSIKRINGSGUIDEN}>Forsikringsguiden.dk</A>.
        </p>
      </section>
      <section>
        <h2>Hvordan kan Altid Hjem hjælpe?</h2>
        <p>
          Når forsikringerne ligger i hver sit selskab og bliver trukket på hver sin dato, er det svært at se, hvad husstanden betaler i alt. Altid Hjem samler madplan,
          strøm, forsikring og økonomi i én app, så I får ét overblik, ét login.
        </p>
        <p>
          Skriv jeres forsikringer, priser og fornyelser ind i appen, så har I dem samlet ét sted og kan nå at sammenligne før næste fornyelse. I kan hente appen gratis i
          App Store og Google Play.
        </p>
        <GuideStores />
        <GuideFigure tone="mint" caption="Eksempel: husstandens forsikringer samlet i ét overblik. Illustration, ikke et skærmbillede fra appen.">
          <ForsikringHusstandMockup />
        </GuideFigure>
      </section>
    </Guide>
  )
}
