import type { Metadata } from 'next'
import AbonnementMockup from '@/components/AbonnementMockup'
import Guide, { type GuideFaq, GuideApp, GuideFigure, GuideLink as A } from '@/components/site/Guide'
import { GUIDES } from '@/lib/guides'

// Upgraded to the recipe (docs/guide-recipe.md) on 16 Nov 2026. The rules are forbrugeraftaleloven
// (LBK nr. 1184 af 28/09/2025, §§ 1, 28, 28 a and 29) and, for phone and internet,
// Digitaliseringsstyrelsen's guide. The page is general and says so.
export const metadata: Metadata = {
  title: 'Opsig abonnementer, I ikke bruger | Altid Hjem',
  description:
    '5 måneder efter, at I har tegnet et løbende abonnement, kan I opsige det med 1 måneds varsel til udgangen af en måned. Sådan finder og opsiger I dem.',
  alternates: { canonical: 'https://www.altidhjem.dk/opsig-abonnementer' },
  openGraph: {
    title: 'Sådan opsiger I husstandens abonnementer',
    description:
      '5 måneder efter, at I har tegnet et løbende abonnement, kan I opsige det med 1 måneds varsel til udgangen af en måned. Sådan finder og opsiger I dem.',
    url: 'https://www.altidhjem.dk/opsig-abonnementer',
    type: 'article',
  },
}

const LOV = 'https://www.retsinformation.dk/eli/lta/2025/1184'
const FORBRUG = 'https://forbrug.dk/media/pkmhxxfo/abonnementer.pdf'
const APPLE = 'https://support.apple.com/da-dk/118428'
const GOOGLE = 'https://support.google.com/googleplay/answer/7018481?hl=da'
const TAENK_BUDGET = 'https://taenk.dk/privatoekonomi/gode-raad/saadan-laegger-du-et-budget'
const TAENK_HJAELP = 'https://taenk.dk/forbrugerliv/elektronik-og-digitale-tjenester/opsigelse-abonnementer-bymetis'
const DIGST = 'https://digst.dk/media/r2chpp0w/slutbrugerbekendtgoerelsen-vejledning_nov_2025.pdf'
const DST = 'https://www.statistikbanken.dk/PRIS01'

// FAQ bruges to steder: synligt på siden og som FAQPage-schema.
const FAQ: GuideFaq[] = [
  {
    q: 'Hvordan opsiger vi husstandens abonnementer?',
    a: [
      'Find først alle aftalerne i kontoudtoget og i telefonens appbutik. Opsig derefter hvert abonnement samme sted, som I tegnede det, og gem kvitteringen.',
      'Når et løbende abonnement har kørt i 5 måneder, kan I opsige det med 1 måneds varsel til udgangen af en måned.',
    ],
  },
  {
    q: 'Hvor hurtigt kan vi komme ud af et abonnement?',
    a: [
      'Efter forbrugeraftaleloven kan I opsige et løbende abonnement med 1 måneds varsel til udgangen af en måned, når der er gået 5 måneder. Virksomheden må ikke aftale et længere varsel.',
      'Der er undtagelser, og for mobil og internet gælder telereglerne.',
    ],
  },
  {
    q: 'Må virksomheden kræve, at vi opsiger på en bestemt måde?',
    a: [
      'Nej. Virksomheden skal sikre, at I kan opsige på samme medie eller platform, som I tegnede abonnementet på.',
      'Det er en god idé at opsige skriftligt eller tage et skærmbillede, så I kan bevise opsigelsen.',
    ],
  },
  {
    q: 'Hvordan opsiger vi et abonnement i App Store eller Google Play?',
    a: [
      'På en iPhone trykker I på jeres navn i Indstillinger og derefter på Abonnementer. På Android går I til abonnementerne i Google Play og trykker på Opsig abonnement.',
      'Det opsiger ikke abonnementet at slette appen.',
    ],
  },
  {
    q: 'Får vi penge tilbage, hvis vi har betalt forud?',
    a: [
      'Ja. Har I betalt for en periode efter, at aftalen ophører, skal virksomheden straks betale det beløb tilbage, ifølge forbrugeraftaleloven.',
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

export default function OpsigAbonnementer() {
  return (
    <Guide
      title={GUIDES['/opsig-abonnementer'].title}
      lead={
        <>
          <p>
            5 måneder efter, at I har tegnet et løbende abonnement, kan I opsige det med 1 måneds varsel til udgangen af en måned. Sådan står det i forbrugeraftaleloven, med
            enkelte undtagelser.
          </p>
          <p>
            I kan opsige samme sted, som I tegnede abonnementet, og det er en god idé at gemme kvitteringen. Det svære er ofte at finde alle aftalerne, så start med
            kontoudtoget og telefonens appbutik.
          </p>
        </>
      }
      meta={
        <>
          Reglerne står i{' '}
          <a href={LOV} target="_blank" rel="noopener noreferrer">
            forbrugeraftaleloven
          </a>{' '}
          · Generel vejledning, ikke juridisk rådgivning
        </>
      }
      answer={{ label: 'Længste opsigelsesvarsel', value: '1', unit: 'måneds varsel', note: 'Til udgangen af en måned, når abonnementet har kørt i 5 måneder. Forbrugeraftaleloven § 28.' }}
      factors={{ label: 'Gennemgå', items: ['Kontoudtog', 'Appbutikker', 'Prøveabonnementer', 'Delte abonnementer', 'Binding og varsel'] }}
      faq={FAQ}
      related={['/hvad-koster-bredbaand', '/billigste-mobilabonnement', '/bedste-budget-app']}
      cta={{
        eyebrow: 'Glemte abonnementer gemmer sig',
        heading: 'Hent Altid Hjem, og find jeres abonnementer',
        subtitle: 'Forbind banken, så ser I jeres faste udgifter og abonnementer i en kalender, før pengene bliver trukket.',
      }}
      page={{ path: '/opsig-abonnementer', description: metadata.description as string, published: GUIDES['/opsig-abonnementer'].published, updated: GUIDES['/opsig-abonnementer'].updated }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'Retsinformation', title: 'Bekendtgørelse af lov om forbrugeraftaler, LBK nr. 1184 af 28. september 2025', href: LOV, note: '§ 1, § 28, § 28 a og § 29' },
          { publisher: 'Forbrug.dk', title: 'Råd til Forbrug: Abonnementer', href: FORBRUG, note: 'Udskrift af en episode af podcasten Råd til Forbrug' },
          { publisher: 'Apple Support', title: 'Opsig et abonnement fra Apple', href: APPLE },
          { publisher: 'Google Play Hjælp', title: 'Opsig et abonnement, sæt et abonnement på pause, eller foretag ændringer i et abonnement i Google Play', href: GOOGLE },
          { publisher: 'Forbrugerrådet Tænk', title: 'Sådan lægger du et godt budget', href: TAENK_BUDGET, note: '6. juni 2025' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Hold dig langt væk fra firmaer, der vil opsige abonnementer for dig', href: TAENK_HJAELP, note: '21. november 2024' },
          { publisher: 'Digitaliseringsstyrelsen', title: 'Vejledning til slutbrugerbekendtgørelsen', href: DIGST, note: 'November 2025' },
          {
            publisher: 'Danmarks Statistik',
            title: 'PRIS01: Forbrugerprisindeks, gruppe 08.3.9.2 Abonnementer på streamingtjenester og leje af film o.l.',
            href: DST,
            note: 'Oktober 2021 til oktober 2026. Egne beregninger på baggrund af data fra Danmarks Statistik',
          },
        ],
      }}
    >
      <section>
        <h2>Hvordan finder I alle husstandens abonnementer?</h2>
        <p>
          Start med kontoudtoget. <A href={TAENK_BUDGET}>Forbrugerrådet Tænk</A> anbefaler at gå 12 måneder tilbage i netbanken, så I også får de betalinger med, der kun
          kommer hvert kvartal eller én gang om året. Se efter streaming, mobil, fitness, aviser, apps og lagerplads i skyen.
        </p>
        <p>
          Tjek også betalingskortet. Ifølge Tænk bliver mange faste udgifter, for eksempel mobil og streaming, trukket automatisk via kortet, og betalinger, der er tilmeldt
          via MobilePay, går ofte også via kortet.
        </p>
        <p>
          Se derefter abonnementerne i telefonens appbutik. Nogle aftaler bliver betalt gennem Apple eller Google. Spørg til sidst alle i husstanden, hvad de betaler for, så
          delte og dobbelte abonnementer kommer med.
        </p>
      </section>
      <section>
        <h2>Hvilke abonnementer bliver let glemt?</h2>
        <p>
          Prøveabonnementer. Et prøveabonnement er ofte et rigtigt abonnement, der fortsætter, når prøveperioden udløber, medmindre I selv opsiger det, lyder det i
          podcasten <A href={FORBRUG}>Råd til Forbrug</A> på forbrug.dk. Hos <A href={APPLE}>Apple</A> skal et prøveabonnement opsiges mindst 24 timer før, prøveperioden udløber.
        </p>
        <p>
          Apps, I har slettet. Ifølge <A href={GOOGLE}>Google Play</A> opsiger I ikke abonnementet ved at afinstallere appen.
        </p>
        <p>
          Abonnementer, der ligner hinanden. To streamingtjenester med overlappende indhold eller to lagerpladser i skyen er lette at overse, fordi beløbene hver for sig er
          små. Se også på husstandens mobilabonnementer. Vores guide til det <A href="/billigste-mobilabonnement">billigste mobilabonnement</A> viser, hvad I skal tjekke.
        </p>
      </section>
      <section>
        <h2>Hvor hurtigt kan I komme ud af et abonnement?</h2>
        <p>
          Når et løbende abonnement har kørt i 5 måneder, kan I opsige det med 1 måneds varsel til udgangen af en måned. Det står i § 28 i{' '}
          <A href={LOV}>forbrugeraftaleloven</A>, og virksomheden må ikke aftale et længere varsel. Det bliver til et halvt år i alt, lyder det i podcasten <A href={FORBRUG}>Råd til Forbrug</A>.
        </p>
        <p>
          Der er undtagelser. Koster aftalen mere end 20.000 kroner om året, og har virksomheden store udgifter til at starte den, kan grænsen være 11 måneder. Reglen gælder
          heller ikke aftaler til højst 2.000 kroner, der skal betales inden 14 dage og leveres inden for et år, for eksempel et årskort. Loven gælder ikke forsikringer.
        </p>
        <p>
          For mobil og internet gælder telereglerne: Bindingen må højst være 6 måneder inklusive opsigelsesvarsel, ifølge <A href={DIGST}>Digitaliseringsstyrelsens
          vejledning</A>.
        </p>
      </section>
      <section>
        <h2>Hvordan opsiger I et abonnement korrekt?</h2>
        <p>
          Opsig samme sted, som I tegnede abonnementet. Ifølge § 28 a i <A href={LOV}>forbrugeraftaleloven</A> skal virksomheden sikre, at I kan opsige på samme medie eller
          tekniske platform, som aftalen blev indgået på.
        </p>
        <p>
          Virksomheden må ikke stille formkrav, men det er altid en god idé at opsige skriftligt eller tage et skærmbillede, så I kan bevise opsigelsen, lyder rådet i{' '}
          <A href={FORBRUG}>Råd til Forbrug</A>.
        </p>
        <p>
          Er abonnementet købt gennem telefonen, opsiger I det i appbutikken. På en iPhone trykker I på jeres navn i Indstillinger og derefter på Abonnementer, skriver{' '}
          <A href={APPLE}>Apple</A>. På Android går I til abonnementerne i <A href={GOOGLE}>Google Play</A> og trykker på Opsig abonnement.
        </p>
        <GuideFigure
          tone="honey"
          caption="Eksempel: en gennemgang af husstandens abonnementer, hvor to ubrugte aftaler skiller sig ud. Illustration, ikke et skærmbillede fra appen."
        >
          <AbonnementMockup />
        </GuideFigure>
      </section>
      <section>
        <h2>Skal I betale nogen for at opsige for jer?</h2>
        <p>
          Nej. <A href={TAENK_HJAELP}>Forbrugerrådet Tænk</A> fraråder firmaer, der vil opsige abonnementer for jer: Det er dyrt, aftalerne kan være tvivlsomme, og I er ikke
          sikre på at få det, I betaler for. I Tænks eksempel opkrævede et firma 300 kroner plus et rykkergebyr for at opsige ét abonnement.
        </p>
        <p>
          Det er ikke nødvendigt at købe hjælp, for I kan sagtens selv opsige, lyder rådet i podcasten <A href={FORBRUG}>Råd til Forbrug</A>. Her bliver et af de firmaer,
          der tilbyder hjælpen, beskrevet som påfaldende lig netop den slags abonnementsfælde, det siger, det hjælper folk ud af.
        </p>
      </section>
      <section>
        <h2>Hvad gør I, hvis abonnementet ikke bliver stoppet?</h2>
        <p>
          Kontakt først virksomheden skriftligt, og vedlæg kvitteringen eller skærmbilledet af opsigelsen. Hjælper det ikke, er der flere steder at klage, lyder det i
          podcasten <A href={FORBRUG}>Råd til Forbrug</A>. Ligger firmaet i et andet EU-land, giver Forbruger Europa gratis råd.
        </p>
        <p>
          Var det ikke tydeligt, at I tegnede et abonnement, kan I klage til Forbrugerombudsmanden over vildledende markedsføring. Er pengene trukket, uden at I vidste, at I
          havde et abonnement, kan banken i nogle tilfælde skulle dække tabet, men det kan være en besværlig proces.
        </p>
        <p>Tjek derfor kontoudtoget jævnligt for betalinger, der går igen, og som I ikke kan genkende.</p>
      </section>
      <section>
        <h2>Er streamingtjenester blevet dyrere?</h2>
        <p>
          Ja. Fra oktober 2025 til oktober 2026 steg priserne på streamingtjenester og leje af film 6,0 procent, mens forbrugerpriserne i alt steg 2,2 procent, viser{' '}
          <A href={DST}>Danmarks Statistiks forbrugerprisindeks</A>. Over fem år, fra oktober 2021 til oktober 2026, er de steget 29,0 procent mod 16,9 procent for
          forbrugerpriserne i alt. Procenterne for de fem år er vores egne beregninger.
        </p>
        <p>
          Målet er ikke nul abonnementer, men at vælge dem bevidst. Bruger I en tjeneste, men ikke det hele, så se på en billigere pakke. Ved overlappende streaming kan I
          beholde én ad gangen og skifte efter behov. Gør gennemgangen til en fast vane, for eksempel hver januar.
        </p>
      </section>
      <section>
        <h2>Regneeksempel: hvornår stopper betalingen?</h2>
        <p>Et eksempel, ikke jeres aftale. Det bygger på disse antagelser:</p>
        <ul>
          <li>I tegnede et fitnessabonnement 1. januar og betaler hver måned.</li>
          <li>I opsiger det 10. august.</li>
          <li>Aftalen har ingen særlige vilkår, så forbrugeraftalelovens regel gælder.</li>
        </ul>
        <p>
          Der er gået mere end 5 måneder, så I kan opsige med 1 måneds varsel til udgangen af en måned. Varslet løber fra 10. august til 10. september, og aftalen ophører
          derfor 30. september. Havde I opsagt 31. juli, var aftalen ophørt 31. august. Har I betalt forud for tiden efter ophøret, skal virksomheden straks betale det beløb tilbage,
          ifølge § 29 i <A href={LOV}>forbrugeraftaleloven</A>.
        </p>
      </section>
      <section>
        <h2>Hvordan kan Altid Hjem hjælpe?</h2>
        <p>
          Glemte abonnementer bliver bare trukket hver måned, til nogen opdager dem. Altid Hjem samler madplan, strøm, forsikring og økonomi i én app, så I får ét overblik,
          ét login.
        </p>
        <p>
          Forbinder I banken, ser I jeres faste udgifter og abonnementer i en kalender, før pengene bliver trukket. I kan hente appen gratis i App Store og Google Play.
        </p>
        <GuideApp
          tone="honey"
          src="/site/app/regninger-top.webp"
          alt="Regninger i Altid Hjem: faste regninger og abonnementer vist i en kalender for november"
          caption="I appen: husstandens faste regninger i en kalender, og hvad den næste store regning er."
        />
      </section>
    </Guide>
  )
}
