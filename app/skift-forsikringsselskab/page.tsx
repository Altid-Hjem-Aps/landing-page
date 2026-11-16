import type { Metadata } from 'next'
import SkiftTjeklisteMockup from '@/components/SkiftTjeklisteMockup'
import Guide, { type GuideFaq, GuideApp, GuideFigure, GuideLink as A, GuideSteps } from '@/components/site/Guide'
import { GUIDES } from '@/lib/guides'

// Brought up to the guide recipe (docs/guide-recipe.md) on 16 Nov 2026. The old rule of thumb
// ("løbende måned plus en måned") had no source; the page now uses Forbrugerrådet Tænk's
// 30 days and names the source of every rule it states.
export const metadata: Metadata = {
  title: 'Skift forsikringsselskab sikkert | Altid Hjem',
  description:
    '30 dages varsel er det normale, når I opsiger en forsikring, ifølge Forbrugerrådet Tænk. Se rækkefølgen, så I ikke står uden dækning, når I skifter.',
  alternates: { canonical: 'https://www.altidhjem.dk/skift-forsikringsselskab' },
  openGraph: {
    title: 'Sådan skifter I forsikringsselskab',
    description:
      '30 dages varsel er det normale, når I opsiger en forsikring, ifølge Forbrugerrådet Tænk. Se rækkefølgen, så I ikke står uden dækning, når I skifter.',
    url: 'https://www.altidhjem.dk/skift-forsikringsselskab',
    type: 'article',
  },
}

const TAENK_SKIFT = 'https://taenk.dk/test-og-forbrugerliv/privatoekonomi-og-aftaler/forsikring/saadan-finder-du-den-bedste-og-billigste'
const FDM_OPSIG = 'https://fdm.dk/forsikringer/opsig-forsikring'
const TAENK_LEDER = 'https://taenk.dk/det-kaemper-vi-for/leder/er-du-loyal-forsikringskunde-kan-det-koste-dig-5000-kr-om-aaret'
const TAENK_LOYAL = 'https://taenk.dk/privatoekonomi/forsikringer/det-er-dyrt-vaere-en-loyal-kunde-i-forsikringsselskaber'
const TAENK_HUS = 'https://taenk.dk/test/husforsikringer/bedste-og-billigste-husforsikringer'
const FDM_GUIDE = 'https://fdm.dk/guides/rettigheder-garanti-og-forsikring/hvilke-forsikringer-skal-du-have-til-bilen'
const BOLIUS_BRAND = 'https://www.bolius.dk/brandforsikring-af-boligen-18406'
const FORSIKRINGSGUIDEN = 'https://www.forsikringsguiden.dk'

// FAQ bruges to steder: synligt på siden og som FAQPage-schema.
const FAQ: GuideFaq[] = [
  {
    q: 'Hvordan skifter man forsikringsselskab?',
    a: [
      'Få først den nye police og startdatoen bekræftet skriftligt, og opsig derefter den gamle forsikring, eller lad det nye selskab gøre det.',
      'Tjek bagefter, at den gamle forsikring ophører samme dag, som den nye begynder.',
    ],
  },
  {
    q: 'Hvornår kan man opsige sin forsikring?',
    a: [
      'Ifølge Forbrugerrådet Tænk kan en forsikring normalt opsiges med 30 dages varsel.',
      'Det er billigst at skifte, når den gamle forsikring udløber. Datoen står i policen.',
    ],
  },
  {
    q: 'Koster det noget at opsige en forsikring?',
    a: [
      'Det kan det. Ifølge Forbrugerrådet Tænk kan gebyret være meget højt, hvis I har haft forsikringen i mindre end et år.',
      'Tjek derfor gebyret i policen eller hos selskabet, før I opsiger.',
    ],
  },
  {
    q: 'Kan det nye selskab opsige vores gamle forsikring?',
    a: [
      'Ja. Ifølge FDM klarer det nye selskab opsigelsen, når I flytter jeres forsikringer til det.',
      'Bed om en skriftlig bekræftelse af datoen, så I ved, hvornår den gamle forsikring stopper.',
    ],
  },
  {
    q: 'Har man fortrydelsesret på en ny forsikring?',
    a: [
      'Ja. Ifølge Forbrugerrådet Tænk er fortrydelsesretten på de fleste forsikringer som udgangspunkt 14 dage.',
      'Fortryder I, så sørg for, at den gamle forsikring stadig dækker.',
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

export default function SkiftForsikringsselskab() {
  return (
    <Guide
      title={GUIDES['/skift-forsikringsselskab'].title}
      lead={
        <>
          <p>
            30 dages varsel er det normale, når I opsiger en forsikring, skriver Forbrugerrådet Tænk. Det er billigst at skifte, når den gamle forsikring udløber, og det
            nye selskab kan klare opsigelsen for jer.
          </p>
          <p>Få den nye police og startdatoen bekræftet, før den gamle ophører, så I ikke står uden dækning en eneste dag.</p>
        </>
      }
      meta={<>Kilde: Forbrugerrådet Tænk og FDM</>}
      answer={{
        label: 'Normalt varsel, når I opsiger',
        value: '30 dage',
        note: 'Ifølge Forbrugerrådet Tænk. Få den nye police bekræftet, før den gamle ophører.',
      }}
      factors={{ label: 'Sammenlign', items: ['Dækning', 'Selvrisiko', 'Tilvalg', 'Pris', 'Startdato'] }}
      faq={FAQ}
      cta={{
        eyebrow: 'Alle jeres forsikringer ét sted',
        heading: 'Hent Altid Hjem, og saml jeres forsikringer, før I skifter',
        subtitle: 'Skriv jeres forsikringer, priser og fornyelser ind i appen, så har I dem samlet ét sted.',
      }}
      page={{ path: '/skift-forsikringsselskab', description: metadata.description as string, published: GUIDES['/skift-forsikringsselskab'].published, updated: GUIDES['/skift-forsikringsselskab'].updated }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'Forbrugerrådet Tænk', title: 'Sådan finder du den bedste og billigste forsikring', href: TAENK_SKIFT, note: '1. april 2025' },
          { publisher: 'FDM', title: 'Opsig en forsikring', href: FDM_OPSIG, note: 'Uden dato' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Er du loyal forsikringskunde, kan det koste dig 5.000 kr. om året', href: TAENK_LEDER, note: '2. september 2025' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Det er dyrt at være en loyal kunde i forsikringsselskaber', href: TAENK_LOYAL, note: '2. april 2025' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Har du den samme husforsikring som sidste år? Så tjek prisen', href: TAENK_HUS, note: '6. oktober 2026' },
          { publisher: 'FDM', title: 'Hvilke forsikringer skal du have til bilen?', href: FDM_GUIDE, note: '19. maj 2025' },
          { publisher: 'Bolius', title: 'Brandforsikring af boligen', href: BOLIUS_BRAND, note: 'Ajourført 22. juni 2023' },
          { publisher: 'Forsikringsguiden', title: 'Uvildig og nem sammenligning af forsikringer', href: FORSIKRINGSGUIDEN, note: 'Sammenligner pris og dækning hos 86 procent af selskaberne i Danmark, læst 16. november 2026' },
        ],
      }}
      related={['/hvad-koster-en-husforsikring', '/hvad-koster-en-bilforsikring', '/hvad-koster-indboforsikring']}
    >
      <section>
        <h2>Hvornår kan I skifte forsikringsselskab?</h2>
        <p>
          Ifølge <A href={TAENK_SKIFT}>Forbrugerrådet Tænk</A> kan en forsikring normalt opsiges med 30 dages varsel. Det er billigst at skifte, når den gamle forsikring
          udløber, og så skal I give selskabet besked mindst 30 dage før udløbsdatoen. Datoen står i policen eller på selskabets hjemmeside.
        </p>
        <p>
          Har I haft forsikringen i mindre end et år, kan gebyret for at opsige være meget højt, skriver Tænk. Tjek derfor gebyret, før I opsiger.
        </p>
        <p>
          Efter en skade gælder særlige regler. Ifølge Tænk kan både I og selskabet opsige forsikringen med 14 dages varsel, fra skaden er anmeldt, til en måned efter, at
          sagen er afsluttet.
        </p>
      </section>
      <section>
        <h2>Kan det betale sig at skifte forsikringsselskab?</h2>
        <p>
          Det er værd at tjekke. Ifølge <A href={TAENK_LEDER}>Forbrugerrådet Tænk</A> viste en rapport fra Konkurrencerådet i april 2025, at kunder, der har været i samme
          selskab i 10 år, typisk betaler 100 kroner mere om måneden end nye kunder i samme selskab.
        </p>
        <p>
          Priserne flytter sig også fra år til år. I <A href={TAENK_HUS}>Tænks test af husforsikringer</A> fra oktober 2026 kan den samme husforsikring være blevet op til
          4.000 kroner billigere eller 6.600 kroner dyrere på et år. Tænk anbefaler at <A href={TAENK_LOYAL}>gennemgå forsikringerne</A> mindst hvert andet år.
        </p>
      </section>
      <section>
        <h2>Hvilken rækkefølge beskytter jer mod huller i dækningen?</h2>
        <p>
          Begynd med at hente et tilbud, hvor dækning, selvrisiko og startdato står skriftligt. Tænk anbefaler at bede to til tre selskaber om skriftlige tilbud. Sig først
          ja, når I har tjekket, at tilbuddet dækker det, I har brug for.
        </p>
        <p>Få derefter den nye police og startdatoen bekræftet. Først når den nye dækning er på plads, bør den gamle forsikring opsiges.</p>
        <p>Tjek til sidst, at den gamle forsikring ophører samme dag, som den nye begynder. Så betaler I ikke dobbelt, og I står ikke uden dækning.</p>
      </section>
      <section>
        <h2>Kan det nye selskab opsige den gamle forsikring?</h2>
        <p>
          Ja. Ifølge <A href={FDM_OPSIG}>FDM</A> klarer det nye selskab opsigelsen, når I flytter jeres forsikringer til det. Bed om en skriftlig bekræftelse, og tjek
          både ophørsdatoen på den gamle police og startdatoen på den nye.
        </p>
        <p>
          Har I betalt forud, skal I have den del af præmien tilbage, som I ikke har brugt. Ifølge <A href={TAENK_SKIFT}>Tænk</A> sørger det nye selskab ofte for det,
          men tjek, at pengene kommer.
        </p>
        <p>Vil I selv opsige, så gør det skriftligt, for eksempel på mail, og gem svaret fra selskabet. Så kan I dokumentere datoen, hvis der opstår tvivl.</p>
      </section>
      <section>
        <h2>Hvad skal I sammenligne ud over prisen?</h2>
        <p>
          To forsikringer med samme navn kan dække meget forskelligt. Sammenlign blandt andet dækningssummer, selvrisiko, undtagelser og tilvalg. En lavere pris betyder
          ikke meget, hvis den skyldes, at en del af dækningen ikke er med.
        </p>
        <p>
          Pris og dækning kan I sammenligne på <A href={FORSIKRINGSGUIDEN}>Forsikringsguiden.dk</A>, før I henter tilbud. Ifølge <A href={TAENK_SKIFT}>Tænk</A> dækker
          sammenligningen mere end 87 procent af markedet for de forsikringer, den omfatter. Om priserne kan I læse mere i guiderne om <A href="/hvad-koster-indboforsikring">indboforsikring</A>,{' '}
          <A href="/hvad-koster-en-husforsikring">husforsikring</A> og <A href="/hvad-koster-en-bilforsikring">bilforsikring</A>.
        </p>
        <GuideFigure tone="mint" caption="Eksempel: de fem trin i et sikkert forsikringsskift. Illustration, ikke et skærmbillede fra appen.">
          <SkiftTjeklisteMockup />
        </GuideFigure>
      </section>
      <section>
        <h2>Hvad gælder for bilen og huset?</h2>
        <p>
          Ifølge <A href={FDM_GUIDE}>FDM</A> er det lovpligtigt at have ansvarsforsikring på bilen. Bilen må derfor ikke stå uden ansvarsforsikring en eneste dag, mens I
          skifter. Har I lånt penge til bilen, eller er den leaset, er kasko ifølge FDM som udgangspunkt et krav, så giv også långiveren besked.
        </p>
        <p>
          Brandforsikringen på huset er ifølge <A href={BOLIUS_BRAND}>Bolius</A> den eneste forsikring, selskabet ikke kan opsige. Banker og realkreditinstitutter kræver
          stort set altid, at huset er brandforsikret, før de giver lån i det. Har I lån i huset, så tjek, at den nye forsikring indeholder brandforsikring, og giv banken
          besked om skiftet.
        </p>
      </section>
      <section>
        <h2>Hvilke fælder skal I undgå?</h2>
        <p>
          En kort periode med to forsikringer kan være praktisk, hvis datoerne ikke passer sammen. En lang periode betyder derimod, at I betaler for to policer uden at få
          mere dækning.
        </p>
        <p>
          Tjek også tilvalg, som let bliver glemt i et tilbud. En lavere pris kan skyldes, at elektronik, rejse eller særlige ting ikke længere er dækket på samme måde.
        </p>
        <p>
          Samlerabat kan gøre en samlet løsning billigere, men den kan også gøre det sværere at se prisen på hver forsikring. Spørg derfor, hvad der sker med rabatten,
          hvis I senere flytter én police.
        </p>
      </section>
      <section>
        <h2>Regneeksempel: hvornår skal I opsige?</h2>
        <p>Et eksempel, ikke jeres regning. Datoerne i jeres egen police gælder. Eksemplet bygger på disse antagelser:</p>
        <ul>
          <li>Jeres forsikringsår slutter den 31. marts.</li>
          <li>Selskabet skal have besked mindst 30 dage før udløbsdatoen, som Tænk beskriver det.</li>
          <li>Det nye selskab klarer opsigelsen for jer.</li>
        </ul>
        <p>
          Så skal det nye selskab have sendt opsigelsen senest den 1. marts, og den nye forsikring skal begynde den 1. april. Hent tilbuddene i februar, så har I tid til at
          sammenligne og få den nye police bekræftet, før fristen.
        </p>
      </section>
      <GuideSteps
        title="Tjekliste til et sikkert skift"
        steps={[
          'Find jeres nuværende policer frem, og skriv dækning, selvrisiko, pris og udløbsdato ned.',
          'Hent skriftlige tilbud på den samme dækning, og tjek undtagelser, tilvalg og rabatter.',
          'Vælg det nye selskab, og få police og startdato bekræftet skriftligt.',
          'Opsig den gamle forsikring selv, eller bekræft, at det nye selskab gør det, og gem papirerne på begge aftaler.',
        ]}
      />
      <section>
        <h2>Hvordan kan Altid Hjem hjælpe?</h2>
        <p>
          Når I vil skifte, er det svært at huske, hvornår forsikringen fornyes, så I kan nå det i tide. Altid Hjem samler madplan, strøm, forsikring og økonomi i én
          app, så I får ét overblik, ét login.
        </p>
        <p>
          Skriv jeres forsikringer, priser og fornyelser ind i appen, så har I dem samlet ét sted og kan nå at sammenligne før næste fornyelse. Forbinder I banken, ser I
          også jeres faste udgifter i en kalender, før pengene bliver trukket. I kan hente appen gratis i App Store og Google Play.
        </p>
        <GuideApp
          tone="mint"
          src="/site/app/regninger-top.webp"
          alt="Regninger i Altid Hjem: faste regninger i en kalender, og bilforsikringen som næste store regning"
          caption="I appen: husstandens faste regninger i en kalender, her med bilforsikringen som den næste store regning."
        />
      </section>
    </Guide>
  )
}
