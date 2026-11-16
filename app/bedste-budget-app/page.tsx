import type { Metadata } from 'next'
import BudgetAppSammenligning from '@/components/BudgetAppSammenligning'
import Guide, { type GuideFaq, GuideApp, GuideFigure, GuideLink as A } from '@/components/site/Guide'
import { GUIDES } from '@/lib/guides'

// Upgraded to the recipe (docs/guide-recipe.md) on 16 Nov 2026. No budget app is ranked or named:
// the page compares the two kinds of tool and sends the reader to Finanstilsynet for the rules on
// bank access.
export const metadata: Metadata = {
  title: 'Bedste budget-app til jeres økonomi | Altid Hjem',
  description:
    'En budget-app viser, hvor pengene er gået. Et overblik over de faste udgifter viser, hvad der skal trækkes. Valget afhænger af, hvad I vil løse.',
  alternates: { canonical: 'https://www.altidhjem.dk/bedste-budget-app' },
  openGraph: {
    title: 'Hvilken budget-app er bedst til jeres behov?',
    description:
      'En budget-app viser, hvor pengene er gået. Et overblik over de faste udgifter viser, hvad der skal trækkes. Valget afhænger af, hvad I vil løse.',
    url: 'https://www.altidhjem.dk/bedste-budget-app',
    type: 'article',
  },
}

const FT_TPP = 'https://www.finanstilsynet.dk/finansielle-temaer/betalingstjenester-og-e-penge/orientering-om-tredjepartsudbydere'
const FT_REGISTER = 'https://virksomhedsregister.finanstilsynet.dk/'
const SPIIR = 'https://www.spiir.dk/'
const TAENK_BUDGET = 'https://taenk.dk/privatoekonomi/gode-raad/saadan-laegger-du-et-budget'
const TAENK_POSTER = 'https://taenk.dk/privatoekonomi/gode-raad/budget-oversigt-over-budgetposter'

// FAQ bruges to steder: synligt på siden og som FAQPage-schema.
const FAQ: GuideFaq[] = [
  {
    q: 'Hvilken budget-app er bedst til os?',
    a: [
      'Det afhænger af, hvilket problem I vil løse. En budget-app viser, hvor pengene er gået, mens et overblik over de faste udgifter viser, hvad der skal trækkes.',
      'Vælg ud fra jeres banker, om I kan rette kategorierne, om I kan eksportere data, og hvordan appen behandler jeres oplysninger.',
    ],
  },
  {
    q: 'Er budget-apps sikre?',
    a: [
      'Adgangen til banken er reguleret. Kun virksomheder med tilladelse må hente oplysninger fra jeres betalingskonti, og kun med jeres udtrykkelige samtykke, ifølge Finanstilsynet.',
      'Slå udbyderen op i Finanstilsynets virksomhedsregister, og læs privatlivspolitikken, før I giver adgang.',
    ],
  },
  {
    q: 'Kan en budget-app se vores opsparing og lån?',
    a: [
      'Retten til at give en app adgang gælder betalingskonti som lønkontoen og husholdningskontoen. En opsparingskonto eller en konto til et boliglån er ifølge Finanstilsynet ikke en betalingskonto.',
    ],
  },
  {
    q: 'Hvad skete der med Spiir?',
    a: [
      'Spiir lukkede 8. juni 2026. Fra den dato kan brugerne ikke længere logge ind, skriver Spiir på sin hjemmeside.',
      'Brugerne kunne eksportere deres data indtil lukningen.',
    ],
  },
  {
    q: 'Skal vi vælge en budget-app eller et samlet overblik?',
    a: [
      'Vælg en budget-app, hvis I vil se forbruget bagud, og et samlet overblik, hvis I vil styre de faste aftaler fremad.',
      'De kan supplere hinanden, fordi de løser forskellige opgaver.',
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

export default function BedsteBudgetApp() {
  return (
    <Guide
      title={GUIDES['/bedste-budget-app'].title}
      lead={
        <>
          <p>
            En budget-app viser, hvor pengene er gået. Et overblik over de faste udgifter viser, hvad der skal trækkes. Valget afhænger af, hvad I vil løse.
          </p>
          <p>
            De to værktøjer kan sagtens supplere hinanden. Uanset hvad I vælger, er adgangen til banken reguleret: kun virksomheder med tilladelse må hente oplysninger fra
            jeres betalingskonti, og kun med jeres samtykke, ifølge Finanstilsynet.
          </p>
        </>
      }
      meta={
        <>
          Om adgang til banken: se{' '}
          <a href={FT_TPP} target="_blank" rel="noopener noreferrer">
            Finanstilsynet
          </a>
        </>
      }
      answer={{ label: 'Kort svar', value: 'Det afhænger af, hvilket problem I vil løse.', note: 'En budget-app viser, hvor pengene er gået. Et overblik over de faste udgifter viser, hvad der skal trækkes.' }}
      factors={{ label: 'Det afgør valget', items: ['Hvad I vil styre', 'Adgang til banken', 'Eksport af data', 'Pris', 'Privatliv'] }}
      faq={FAQ}
      cta={{
        eyebrow: 'Budget og faste udgifter i samme app',
        heading: 'Hent Altid Hjem, og se jeres faste udgifter samlet',
        subtitle: 'Appen er gratis og viser jeres faste udgifter og abonnementer i en kalender, før pengene bliver trukket.',
      }}
      page={{ path: '/bedste-budget-app', description: metadata.description as string, published: GUIDES['/bedste-budget-app'].published, updated: GUIDES['/bedste-budget-app'].updated }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'Finanstilsynet', title: 'Orientering om tredjepartsudbydere', href: FT_TPP, note: 'Kontooplysningstjenester, tilladelse, samtykke og betalingskonti' },
          { publisher: 'Finanstilsynet', title: 'Virksomhedsregister: Søg virksomheder', href: FT_REGISTER },
          { publisher: 'Spiir', title: 'Spiir lukker d. 8. juni 2026', href: SPIIR, note: 'Spiirs besked om lukningen og eksport af data' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Sådan lægger du et budget', href: TAENK_BUDGET, note: '6. juni 2025' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Budget: Oversigt over budgetposter', href: TAENK_POSTER, note: '6. juni 2025' },
        ],
      }}
      related={['/spiir-alternativ', '/opsig-abonnementer', '/hvad-koster-bredbaand']}
    >
      <section>
        <h2>Hvad gør en budget-app egentlig?</h2>
        <p>
          En budget-app henter posteringerne fra jeres konti og sorterer dem i kategorier som bolig, transport, dagligvarer og fornøjelser. Det gør det lettere at se, hvor
          pengene gik hen sidste måned. <A href={FT_TPP}>Finanstilsynet</A> kalder det en kontooplysningstjeneste og nævner netop et forbrugsoverblik eller et budget som
          eksempler. Appen kan for eksempel sende jer en besked, hvis månedens budget er overskredet.
        </p>
        <p>Overblikket er især nyttigt, hvis I vil finde vaner i det variable forbrug, for eksempel takeaway, små netkøb eller dagligvarer.</p>
        <p>
          Kategoriseringen er dog ikke altid fejlfri. En overførsel eller betaling kan lande i den forkerte kategori, så gennemgå tallene, før I træffer større beslutninger
          ud fra dem.
        </p>
      </section>
      <section>
        <h2>Hvad løser en budget-app sjældent?</h2>
        <p>
          Budget-apps ser normalt bagud. De viser, at en forsikring eller et mobilabonnement er blevet betalt, men giver ikke nødvendigvis et samlet overblik over priser,
          vilkår, fornyelser og forskellige logins.
        </p>
        <p>
          Det gør det sværere at styre de faste aftaler fremad. I kan godt se beløbet på kontoen uden at vide, om aftalen stadig passer til jeres behov. En prisstigning
          eller en fornyelse kan let gå ubemærket hen, når I kun ser bagud, og en regning, der kun kommer én gang om året, dukker først op, når den er betalt.
        </p>
        <p>
          Her kan et særskilt overblik over de faste udgifter være mere relevant. Det gælder især, hvis målet er at samle el, mobil, forsikringer og abonnementer, ikke blot
          at sortere dem i kategorier.
        </p>
      </section>
      <section>
        <h2>Er budget-apps sikre?</h2>
        <p>
          Adgangen til banken er reguleret. Kun virksomheder med tilladelse fra Finanstilsynet må udbyde kontooplysningstjenester, og de må kun hente jeres oplysninger med
          jeres udtrykkelige samtykke, skriver <A href={FT_TPP}>Finanstilsynet</A>. Oplysningerne må kun bruges til at give jer selv det overblik, I har bedt om.
          Pengeinstitutter må som udgangspunkt tilbyde det samme uden en særskilt tilladelse, og en udbyder med tilladelse fra et andet EU- eller EØS-land må også tilbyde
          tjenesten i Danmark.
        </p>
        <p>
          Adgangen gælder betalingskonti som lønkontoen eller husholdningskontoen, ikke en opsparingskonto eller en konto til et boliglån. Før I giver adgang, kan I slå
          udbyderen op i <A href={FT_REGISTER}>Finanstilsynets virksomhedsregister</A>. Læs også privatlivspolitikken, og se, hvordan I trækker samtykket tilbage igen.
        </p>
      </section>
      <section>
        <h2>Hvad lærte Spiirs lukning brugerne?</h2>
        <p>
          Spiir lukkede 8. juni 2026. Fra den dato kan brugerne ikke længere logge ind, skriver <A href={SPIIR}>Spiir</A>. Brugerne kunne eksportere deres data indtil
          lukningen. Spiir stopper med at hente data fra brugernes konti og sletter eller anonymiserer deres personoplysninger. Mange mistede dermed det overblik og de
          kategorier, de havde gjort til en fast del af hverdagen.
        </p>
        <p>
          Lukningen viste, at et digitalt overblik afhænger af, at tjenesten fortsætter. Det er derfor fornuftigt at vælge en app, hvor I kan eksportere jeres data, og at
          have en enkel liste over de vigtigste aftaler.
        </p>
        <p>
          Brugte I Spiir, kan I læse vores guide til et <A href="/spiir-alternativ">alternativ til Spiir</A>.
        </p>
        <GuideFigure
          tone="honey"
          caption="Eksempel: en budget-app ser bagud på forbruget, et samlet overblik styrer de faste aftaler fremad. Illustration, ikke et skærmbillede fra appen."
        >
          <BudgetAppSammenligning />
        </GuideFigure>
      </section>
      <section>
        <h2>Hvordan vælger I den rigtige app?</h2>
        <p>
          Start med at spørge jer selv, om jeres største udfordring er det variable forbrug eller de faste aftaler. Vil I forstå, hvor pengene gik hen, er en budget-app det oplagte
          valg. Er problemet abonnementer, policer og leverandører fordelt på forskellige logins, har I snarere brug for et samlet overblik.
        </p>
        <p>Stil disse spørgsmål, før I vælger:</p>
        <ul>
          <li>Kan appen forbinde alle jeres banker?</li>
          <li>Kan I rette kategorierne, når en postering lander forkert?</li>
          <li>Kan I eksportere jeres data, hvis I vil skifte?</li>
          <li>Hvad koster appen, og hvordan tjener udbyderen penge?</li>
          <li>Hvem står bag, og har udbyderen tilladelse fra Finanstilsynet?</li>
        </ul>
        <p>
          Prøv gerne appen et par uger, før I lægger hele budgettet ind. Så ser I, om kategorierne rammer rigtigt, og om alle jeres konti kommer med. Læs vilkår og
          privatlivspolitik, før I giver adgang til jeres økonomiske oplysninger.
        </p>
      </section>
      <section>
        <h2>Hvorfor er de faste udgifter svære at følge?</h2>
        <p>
          Fordi de ikke kommer jævnt. Ifølge <A href={TAENK_BUDGET}>Forbrugerrådet Tænk</A> bliver mange faste udgifter betalt én gang i kvartalet, halvårligt eller én gang
          om året. Tænk anbefaler derfor at lægge budgettet mindst et år frem og at tjekke posterne 12 måneder tilbage i netbanken.
        </p>
        <p>
          Mange faste udgifter, for eksempel mobilabonnementer og streaming, bliver også trukket automatisk via betalingskortet, ofte fra lønkontoen og ikke fra
          budgetkontoen, skriver Tænk. Har budgetkontoen ikke et betalingskort, skal I derfor vide, hvilke faste udgifter der trækkes hvorfra. Abonnementer på tv, mobil, internet og streaming står i øvrigt på <A href={TAENK_POSTER}>Tænks huskeliste</A> over faste udgifter.
        </p>
        <p>
          Begynd gerne med <A href="/billigste-mobilabonnement">mobilabonnementerne</A>, <A href="/hvad-koster-bredbaand">bredbåndet</A> og{' '}
          <A href="/opsig-abonnementer">de abonnementer, I ikke bruger</A>.
        </p>
      </section>
      <section>
        <h2>Regneeksempel: hvor mange gange bliver der trukket penge?</h2>
        <p>Et eksempel, ikke jeres regning. Det bygger på disse antagelser:</p>
        <ul>
          <li>7 faste udgifter bliver trukket hver måned, for eksempel husleje, mobil, bredbånd og streaming.</li>
          <li>2 bliver trukket hvert kvartal.</li>
          <li>3 bliver trukket én gang om året, for eksempel forsikringer.</li>
        </ul>
        <p>
          Det giver 84 træk fra de månedlige udgifter, 8 fra de kvartalsvise og 3 fra de årlige, i alt 95 træk om året. De falder ikke jævnt: i en måned, hvor begge
          kvartalsregninger og de tre årlige regninger kommer, er der 12 træk, mens der i en stille måned kun er 7. Derfor hjælper det at se de faste udgifter i en kalender,
          ikke kun som et gennemsnit. Tænk anbefaler netop at lave et overblik over årets betalinger måned for måned.
        </p>
      </section>
      <section>
        <h2>Hvordan kan Altid Hjem hjælpe?</h2>
        <p>
          En budget-app fortæller, hvor pengene gik hen. De faste udgifter bliver bare ved med at blive trukket. Altid Hjem samler madplan, strøm, forsikring og økonomi i
          én app, så I får ét overblik, ét login.
        </p>
        <p>
          Forbinder I banken, ser I jeres faste udgifter og abonnementer i en kalender, før pengene bliver trukket. Skriv jeres forsikringer, priser og fornyelser ind i
          appen, så har I dem samlet ét sted. I kan hente appen gratis i App Store og Google Play.
        </p>
        <GuideApp
          tone="sky"
          src="/site/app/regninger-top.webp"
          alt="Regninger i Altid Hjem: faste regninger vist i en kalender for november"
          caption="I appen: husstandens faste regninger i en kalender, og hvad den næste store regning er."
        />
      </section>
    </Guide>
  )
}
