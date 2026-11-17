import type { Metadata } from 'next'
import { SITE_IMAGE } from '@/lib/site-image'
import Guide, { type GuideFaq, GuideApp, GuideLink as A, GuideSteps } from '@/components/site/Guide'
import { GUIDES } from '@/lib/guides'

// Built by the recipe (docs/guide-recipe.md, ALT-1714), topic approved by Thor on 16 Nov 2026. The
// newest published average is FDM's kasko price for 2024, on data from Samlino.dk; the page says
// how old it is and where it comes from.
export const metadata: Metadata = {
  title: 'Hvad koster en bilforsikring? | Altid Hjem',
  description:
    '6.239 kroner kostede en kaskoforsikring i gennemsnit i 2024, ifølge tal som FDM har offentliggjort. Se, hvad der afgør prisen på jeres bilforsikring.',
  alternates: { canonical: 'https://www.altidhjem.dk/hvad-koster-en-bilforsikring' },
  openGraph: {
    title: 'Hvad koster en bilforsikring?',
    description:
      '6.239 kroner kostede en kaskoforsikring i gennemsnit i 2024, ifølge tal som FDM har offentliggjort. Se, hvad der afgør prisen på jeres bilforsikring.',
    url: 'https://www.altidhjem.dk/hvad-koster-en-bilforsikring',
    type: 'article',
    images: [SITE_IMAGE],
  },
  twitter: { card: 'summary_large_image', images: [SITE_IMAGE] },
}

const FDM_2023 = 'https://fdm.dk/nyheder/bilist/2023-08-spar-mest-paa-bilforsikring-er-elbil-eller-benzinbil-billigst'
const FDM_PRIS = 'https://fdm.dk/nyheder/nyt-om-trafik-og-biler/2025-02-derfor-stiger-prisen-paa-din-bilforsikring'
const FDM_STIGNING = 'https://fdm.dk/nyheder/bilist/2025-11-saa-meget-er-bilforsikring-steget-siden-2023-benzinbiler-stiger-mere-end'
const FDM_GUIDE = 'https://fdm.dk/guides/rettigheder-garanti-og-forsikring/hvilke-forsikringer-skal-du-have-til-bilen'
const FDM_SAMMENLIGN = 'https://fdm.dk/vaerd-at-vide/forsikringer/sammenlign-bilforsikring-og-priser'
const TAENK_BENZIN = 'https://taenk.dk/test/bilforsikringer-til-benzin-og-dieselbiler/billigste-bedste-bilforsikringer-benzin-diesel'
const TAENK_ELBIL = 'https://taenk.dk/test/bilforsikringer-til-elbil/prisforskelle-hvor-meget-kan-du-spare'
const BORGER = 'https://www.borger.dk/transport-trafik-rejser/biler-og-koerekort/biler/bilforsikringer'
const DST = 'https://www.statistikbanken.dk/PRIS01'

// FAQ bruges to steder: synligt på siden og som FAQPage-schema.
const FAQ: GuideFaq[] = [
  {
    q: 'Hvad koster en bilforsikring?',
    a: [
      'Ifølge FDM kostede en kaskoforsikring i gennemsnit 6.239 kroner i 2024. Tallet bygger på data fra Samlino.dk, og FDM har ikke offentliggjort et nyere gennemsnit.',
      'Jeres egen pris afhænger af bilen, jeres alder, bopæl, kørte kilometer og selvrisiko.',
    ],
  },
  {
    q: 'Er bilforsikring lovpligtig?',
    a: [
      'Ja, ansvarsforsikringen er lovpligtig for biler. Den dækker skader, I forvolder på andre.',
      'Kaskoforsikringen, der dækker jeres egen bil, er frivillig, men den er som udgangspunkt et krav, hvis bilen er købt med lån eller er leaset.',
    ],
  },
  {
    q: 'Hvad påvirker prisen på en bilforsikring?',
    a: [
      'Ifølge FDM afhænger prisen af jeres risikoprofil: alder, bopæl, antal kørte kilometer om året og bilen selv, altså mærke, model, alder og værdi.',
      'Tidligere skader og år med skadefri kørsel tæller også med.',
    ],
  },
  {
    q: 'Bliver bilforsikringen billigere med en højere selvrisiko?',
    a: [
      'Ja, typisk. Ifølge FDM kan en højere selvrisiko sænke prisen, mens en lav selvrisiko ofte giver en højere pris.',
      'Vælg en selvrisiko, I kan betale uden at låne, hvis uheldet er ude.',
    ],
  },
  {
    q: 'Er det dyrere at forsikre en elbil?',
    a: [
      'Det kommer an på bilen. Ifølge FDM er forsikringer til elbiler steget 13 procent på to år, mens benzinbiler er steget 19 procent.',
      'Forbrugerrådet Tænk fandt, at forsikringen af den samme elbil kan variere med op til 7.000 kroner mellem selskaberne.',
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

export default function HvadKosterEnBilforsikring() {
  return (
    <Guide
      title={GUIDES['/hvad-koster-en-bilforsikring'].title}
      lead={
        <>
          <p>
            6.239 kroner kostede en kaskoforsikring i gennemsnit i 2024, ifølge tal fra Samlino.dk, som FDM har offentliggjort. FDM har ikke offentliggjort et nyere
            gennemsnit.
          </p>
          <p>Jeres egen pris afhænger af bilen, jeres alder og bopæl, hvor meget I kører, og hvilken selvrisiko I vælger.</p>
        </>
      }
      meta={
        <>
          Gennemsnittet er for kasko i 2024 · Se FDMs{' '}
          <a href={FDM_SAMMENLIGN} target="_blank" rel="noopener noreferrer">
            råd om at sammenligne bilforsikringer
          </a>
        </>
      }
      answer={{
        label: 'Kaskoforsikring i gennemsnit, 2024',
        value: '6.239',
        unit: 'kr.',
        note: 'Ifølge tal fra Samlino.dk, som FDM har offentliggjort. I 2021 var gennemsnittet 5.415 kr.',
      }}
      factors={{ label: 'Det afgør prisen', items: ['Bilen', 'Alder', 'Bopæl', 'Kilometer om året', 'Selvrisiko'] }}
      faq={FAQ}
      cta={{
        eyebrow: 'Alle jeres forsikringer ét sted',
        heading: 'Hent Altid Hjem, og saml husstandens forsikringer',
        subtitle: 'Skriv jeres forsikringer, priser og fornyelser ind i appen, så har I dem samlet ét sted.',
      }}
      page={{ path: '/hvad-koster-en-bilforsikring', description: metadata.description as string, published: GUIDES['/hvad-koster-en-bilforsikring'].published, updated: GUIDES['/hvad-koster-en-bilforsikring'].updated }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'FDM', title: 'Spar mest på bilforsikring: Er elbil eller benzinbil billigst?', href: FDM_2023, note: '24. august 2023' },
          { publisher: 'FDM', title: 'Derfor stiger prisen på din bilforsikring', href: FDM_PRIS, note: '25. februar 2025. Gennemsnitspriser på data fra Samlino.dk' },
          { publisher: 'FDM', title: 'Så meget er bilforsikring steget siden 2023 - benzinbiler stiger mere end elbiler', href: FDM_STIGNING, note: '13. november 2025' },
          { publisher: 'FDM', title: 'Hvilke forsikringer skal du have til bilen?', href: FDM_GUIDE, note: '19. maj 2025' },
          { publisher: 'FDM', title: 'Sammenlign bilforsikring og priser', href: FDM_SAMMENLIGN, note: '23. april 2025' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Dyrest betyder ikke bedst: Her er bilforsikringen, der giver mest for pengene', href: TAENK_BENZIN, note: 'Test af 14 selskaber, 23. januar 2026' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Store prisforskelle på forsikringer til elbil: så meget kan du spare', href: TAENK_ELBIL, note: '23. januar 2026' },
          { publisher: 'borger.dk', title: 'Bilforsikringer', href: BORGER },
          { publisher: 'Danmarks Statistik', title: 'PRIS01: Forbrugerprisindeks, gruppe 12.1.4.1 Transportforsikring', href: DST, note: 'Oktober 2021 til oktober 2026. Egne beregninger på baggrund af data fra Danmarks Statistik' },
        ],
      }}
      related={['/hvad-koster-en-husforsikring', '/hvad-koster-forsikring', '/skift-forsikringsselskab']}
    >
      <section>
        <h2>Hvad koster en bilforsikring?</h2>
        <p>
          Ifølge <A href={FDM_PRIS}>FDM</A> kostede en kaskoforsikring i gennemsnit 5.415 kroner i 2021 og 6.239 kroner i 2024. FDM har tallene fra
          sammenligningstjenesten Samlino.dk og har ikke offentliggjort et nyere gennemsnit.
        </p>
        <p>
          Gennemsnittet siger dog ikke meget om jeres egen pris. <A href={TAENK_BENZIN}>Forbrugerrådet Tænks test</A> fra januar 2026 af 14 selskaber viser, at den
          dyreste bilforsikring til benzin- og dieselbiler koster cirka 60 procent mere end den billigste.
        </p>
        <p>
          Tænk har regnet priserne ud for 15 forskellige bilejere hos hvert selskab, så forskellen gælder ikke kun én bestemt bil eller fører.
        </p>
        <p>
          Også for erfarne bilister kan forskellen være stor. Da <A href={FDM_2023}>FDM undersøgte priserne i 2023</A>, var forskellen mellem de dyreste og de billigste
          forsikringer for elitebilister på mellem 3.600 og 8.500 kroner, afhængigt af bilen.
        </p>
      </section>
      <section>
        <h2>Hvad afgør prisen på en bilforsikring?</h2>
        <p>
          Ifølge <A href={FDM_GUIDE}>FDM</A> afhænger prisen af jeres risikoprofil: jeres alder, bopæl, hvor mange kilometer I kører om året, og bilen selv. Tidligere skader
          trækker prisen op, mens flere års dokumenteret skadefri kørsel kan trække den ned.
        </p>
        <p>
          Om bilen skriver <A href={FDM_SAMMENLIGN}>FDM</A>, at mærke, model, alder og værdi spiller en stor rolle for prisen. Ifølge <A href={BORGER}>borger.dk</A> kan også bilens vægt og jeres
          medlemskab af en bestemt faggruppe have betydning.
        </p>
        <p>
          Kører I mindre, end I har opgivet, så ret tallet. Langt de fleste selskaber regner kilometer om året med i prisen, skriver{' '}
          <A href={FDM_SAMMENLIGN}>FDM</A>.
        </p>
      </section>
      <section>
        <h2>Er bilforsikringen blevet dyrere?</h2>
        <p>
          Ja. Danmarks Statistik følger priserne på transportforsikringer i <A href={DST}>forbrugerprisindekset</A>. Fra oktober 2021 til oktober 2026 er de steget 18,7
          procent, mens de samlede forbrugerpriser er steget 16,9 procent. Procenterne er vores egne beregninger ud fra Danmarks Statistiks indeks. Alene fra
          oktober 2025 til oktober 2026 steg priserne på transportforsikringer 3,1 procent.
        </p>
        <p>
          Tallet dækker alle transportforsikringer og ikke kun bilforsikringer, så det viser retningen og ikke prisen på jeres egen police.
        </p>
        <p>
          <A href={FDM_STIGNING}>FDM undersøgte i november 2025</A> priserne hos de otte største selskaber. På to år var forsikringen af benzinbiler steget 19 procent og af
          elbiler 13 procent.
        </p>
      </section>
      <section>
        <h2>Hvad er forskellen på ansvar og kasko?</h2>
        <p>
          Ansvarsforsikringen dækker de skader, I forvolder på andre, og den er lovpligtig. Ifølge FDM kan det koste dagbøder at køre uden, og FDM nævner 250 kroner om dagen som
          satsen for 2022.
        </p>
        <p>
          Kaskoforsikringen dækker skader på jeres egen bil. Den er frivillig, men har I lånt penge til bilen, eller er den leaset, er det
          ifølge FDM som udgangspunkt et krav, at I har kasko.
        </p>
        <p>Gennemsnitsprisen ovenfor gælder kasko. Er bilen gammel og ikke meget værd, kan det betale sig at regne på, om kaskoen stadig giver mening for jer.</p>
      </section>
      <section>
        <h2>Er det dyrere at forsikre en elbil?</h2>
        <p>
          Ikke nødvendigvis. <A href={TAENK_ELBIL}>Forbrugerrådet Tænk</A> fandt i januar 2026, at forsikringen af den samme elbil kan variere med op til 7.000 kroner mellem
          selskaberne. For de testede elbiler fandt Tænk prisforskelle på op til 38 procent, svarende til 3.777 kroner om året.
        </p>
        <p>
          Prisstigningerne har også været mindre for elbiler. Ifølge FDMs undersøgelse fra november 2025 steg forsikringen af elbiler 13 procent på to år, mens benzinbiler
          steg 19 procent.
        </p>
      </section>
      <section>
        <h2>Hvordan sammenligner I bilforsikringer på den rigtige måde?</h2>
        <p>
          Sammenlign altid den samme dækning, den samme selvrisiko og det samme antal kilometer om året. En lavere pris betyder ikke meget, hvis den skyldes, at kaskoen
          eller en anden del af dækningen ikke er med.
        </p>
        <p>
          Har I flere forsikringer i samme selskab, så se også på den samlede pris. I guiden <A href="/hvad-koster-forsikring">Hvad koster forsikring?</A> kan I se, hvad de
          andre forsikringer typisk koster, og i guiden om at <A href="/skift-forsikringsselskab">skifte forsikringsselskab</A> kan I se, hvordan I skifter uden huller i
          dækningen. FDM har også samlet sine <A href={FDM_SAMMENLIGN}>råd om at sammenligne bilforsikringer</A>.
        </p>
      </section>
      <section>
        <h2>Skal I vælge høj eller lav selvrisiko?</h2>
        <p>
          Ifølge <A href={FDM_SAMMENLIGN}>FDM</A> kan en højere selvrisiko sænke prisen på bilforsikringen, mens en lav selvrisiko ofte giver en højere pris. Til gengæld
          betaler I selv mere, når der sker en skade.
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
          <li>I betaler 6.239 kroner om året for kasko, som var FDMs gennemsnit i 2024.</li>
          <li>Prisen stiger 3,1 procent om året, ligesom priserne på transportforsikringer gjorde fra oktober 2025 til oktober 2026.</li>
          <li>I beholder den samme police uden at sammenligne.</li>
        </ul>
        <p>
          Næste år betaler I så 6.432 kroner, og efter tre år 6.837 kroner. Hvor meget jeres egen pris ændrer sig, kan I kun se ved at hente et nyt tilbud med samme dækning.
        </p>
      </section>
      <GuideSteps
        title="Tjekliste før I skifter bilforsikring"
        steps={[
          'Find jeres nuværende police frem, og skriv dækning, selvrisiko og kilometer om året ned, så I kan sammenligne på samme betingelser.',
          'Ret kilometer om året, hvis I kører mindre end opgivet, og hav dokumentation for jeres skadefri år klar.',
          'Har I billån eller leasing, så tjek, om långiver kræver kasko, og giv dem besked om den nye forsikring.',
          'Lad den nye forsikring begynde, før den gamle stopper. Bilen må ikke stå uden ansvarsforsikring en eneste dag.',
        ]}
      />
      <section>
        <h2>Hvordan kan Altid Hjem hjælpe?</h2>
        <p>
          Det er let at glemme, hvad bilforsikringen koster, når den bare bliver betalt hvert år. Altid Hjem samler madplan, strøm, forsikring og økonomi i én app, så I
          får ét overblik, ét login.
        </p>
        <p>
          Skriv jeres forsikringer, priser og fornyelser ind i appen, så har I dem samlet ét sted. Forbinder I banken, ser I
          også jeres faste udgifter i en kalender, før pengene bliver trukket. I kan hente appen gratis i App Store og Google Play.
        </p>
        <GuideApp tone="mint" src="/site/app/regninger-top.webp" alt="Regninger i Altid Hjem: faste regninger i en kalender, og bilforsikringen som næste store regning" caption="I appen: husstandens faste regninger i en kalender, her med bilforsikringen som den næste store regning." />
      </section>
    </Guide>
  )
}
