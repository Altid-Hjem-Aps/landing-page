import type { Metadata } from 'next'
import { SITE_IMAGE } from '@/lib/site-image'
import Guide, { type GuideFaq, GuideApp, GuideLink as A } from '@/components/site/Guide'
import { GUIDES } from '@/lib/guides'

// Upgraded to the recipe (docs/guide-recipe.md) on 16 Nov 2026. The page speaks to "du", like its
// title, which Google already knows. Every fact about Spiir is from Spiir's own closing notice on
// spiir.dk or Mobilsiden, read on 16 Nov 2026.
export const metadata: Metadata = {
  title: 'Spiir-alternativ: Hvad skal du bruge i stedet for Spiir? | Altid Hjem',
  description:
    '8. juni 2026 lukkede Spiir. Brugte du Spiir til at holde styr på faste udgifter, er Altid Hjem et alternativ, men ikke en klassisk budgetapp.',
  alternates: { canonical: 'https://www.altidhjem.dk/spiir-alternativ' },
  openGraph: {
    title: 'Spiir lukkede 8. juni 2026: Hvad skal du bruge i stedet?',
    description:
      '8. juni 2026 lukkede Spiir. Brugte du Spiir til at holde styr på faste udgifter, er Altid Hjem et alternativ, men ikke en klassisk budgetapp.',
    url: 'https://www.altidhjem.dk/spiir-alternativ',
    type: 'article',
    images: [SITE_IMAGE],
  },
  twitter: { card: 'summary_large_image', images: [SITE_IMAGE] },
}

const SPIIR = 'https://www.spiir.dk/'
const MOBILSIDEN = 'https://mobilsiden.dk/nyheder/apps-sociale-medier/en-af-de-bedste-apps-i-danmark-lukker/'
const FT_TPP = 'https://www.finanstilsynet.dk/finansielle-temaer/betalingstjenester-og-e-penge/orientering-om-tredjepartsudbydere'
const FT_REGISTER = 'https://virksomhedsregister.finanstilsynet.dk/'
const TAENK_BUDGET = 'https://taenk.dk/privatoekonomi/gode-raad/saadan-laegger-du-et-budget'

// FAQ bruges to steder: synligt på siden og som FAQPage-schema.
const FAQ: GuideFaq[] = [
  {
    q: 'Hvad skal jeg bruge i stedet for Spiir?',
    a: [
      'Det afhænger af, hvad du brugte Spiir til. Brugte du mest kategorierne og budgettet, skal du have en app, der henter dine posteringer og sorterer dem.',
      'Brugte du Spiir til at holde øje med faste udgifter, kan Altid Hjem være et alternativ. Altid Hjem er ikke en klassisk budgetapp.',
    ],
  },
  {
    q: 'Hvornår lukkede Spiir?',
    a: ['Spiir lukkede 8. juni 2026. Fra den dato kan brugerne ikke længere logge ind, skriver Spiir på sin hjemmeside.'],
  },
  {
    q: 'Kan jeg stadig eksportere mine data fra Spiir?',
    a: [
      'Nej. Eksporten skulle ske, før Spiir lukkede 8. juni 2026, og nu kan du ikke logge ind. Dine posteringer ligger stadig i din netbank, for lukningen påvirker ikke dine bankkonti.',
    ],
  },
  {
    q: 'Er det sikkert at forbinde banken til en app?',
    a: [
      'Det er reguleret. Kun virksomheder med tilladelse må hente oplysninger fra dine betalingskonti, og kun med dit udtrykkelige samtykke, ifølge Finanstilsynet.',
      'Slå udbyderen op i Finanstilsynets virksomhedsregister, og læs privatlivspolitikken, før du giver adgang.',
    ],
  },
  {
    q: 'Er Altid Hjem en budgetapp?',
    a: [
      'Nej, ikke en klassisk budgetapp. Altid Hjem samler madplan, strøm, forsikring og økonomi i én app, så du får ét overblik, ét login.',
      'Forbinder du banken, ser du dine faste udgifter og abonnementer i en kalender, før pengene bliver trukket.',
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
      'Nej, appen er gratis at hente, og det er gratis at oprette en profil.',
      'Du betaler kun for det, du selv vælger at bruge, for eksempel strøm fra Altid Energi, hvis du bliver kunde.',
    ],
  },
]

export default function SpiirAlternativ() {
  return (
    <Guide
      title={GUIDES['/spiir-alternativ'].title}
      lead={
        <>
          <p>
            8. juni 2026 lukkede Spiir, og fra den dato kan brugerne ikke længere logge ind, skriver Spiir på sin hjemmeside. Mange leder derfor efter et nyt sted at få
            overblik over økonomien.
          </p>
          <p>
            Brugte du Spiir til at holde styr på faste udgifter, er Altid Hjem et alternativ, men ikke en klassisk budgetapp. Brugte du mest kategorierne, skal du have en
            budgetapp.
          </p>
        </>
      }
      meta={
        <>
          Lukkede 8. juni 2026 · Se{' '}
          <a href={SPIIR} target="_blank" rel="noopener noreferrer">
            Spiirs besked om lukningen
          </a>
        </>
      }
      answer={{ label: 'Spiir lukkede', value: '8. juni 2026', note: 'Efter 15 år, ifølge Mobilsiden. Fra den dato kan brugerne ikke logge ind, skriver Spiir.' }}
      factors={{ label: 'Det afgør valget', items: ['Hvad du brugte Spiir til', 'Adgang til banken', 'Eksport af data', 'Pris', 'Privatliv'] }}
      faq={FAQ}
      cta={{
        eyebrow: 'Fra Spiir til Altid Hjem',
        heading: 'Hent Altid Hjem, og få overblikket tilbage',
        subtitle: 'Forbind banken med MitID, så ser du dine faste udgifter og abonnementer i en kalender, før pengene bliver trukket.',
      }}
      page={{ path: '/spiir-alternativ', description: metadata.description as string, published: GUIDES['/spiir-alternativ'].published, updated: GUIDES['/spiir-alternativ'].updated }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'Spiir', title: 'Spiir lukker d. 8. juni 2026', href: SPIIR, note: 'Spiirs besked om lukningen, data og eksport, og tallet 500.000 fra samme side' },
          { publisher: 'Mobilsiden', title: 'En af de bedste apps i Danmark lukker', href: MOBILSIDEN, note: '8. april 2026. Spiir lukker efter 15 år, ejerforholdet' },
          { publisher: 'Finanstilsynet', title: 'Orientering om tredjepartsudbydere', href: FT_TPP, note: 'Kontooplysningstjenester, tilladelse, samtykke og betalingskonti' },
          { publisher: 'Finanstilsynet', title: 'Virksomhedsregister: Søg virksomheder', href: FT_REGISTER },
          { publisher: 'Forbrugerrådet Tænk', title: 'Sådan lægger du et budget', href: TAENK_BUDGET, note: '6. juni 2025' },
        ],
      }}
      related={['/bedste-budget-app', '/opsig-abonnementer', '/hvad-koster-bredbaand']}
    >
      <section>
        <h2>Hvorfor lukkede Spiir?</h2>
        <p>
          Spiir lukkede 8. juni 2026. Det skriver Team Spiir i en besked på <A href={SPIIR}>spiir.dk</A>, hvor de kalder lukningen en svær beslutning efter mere end et
          årti. Ifølge <A href={MOBILSIDEN}>Mobilsiden</A> lukker Mastercard appen efter 15 år. Mastercard har købt Aiia, virksomheden bag Spiir. Ifølge Mobilsiden var
          Mastercard primært interesseret i den tekniske motor og tilsyneladende ikke i at drive appen til forbrugerne videre.
        </p>
        <p>
          Spiir var gratis og sorterede automatisk dine posteringer fra alle dine konti i kategorier. På sin hjemmeside skriver Spiir, at mere end 500.000 har hentet
          appen. Derfor står mange nu uden det overblik, de har brugt i årevis.
        </p>
      </section>
      <section>
        <h2>Kan du stadig hente dine data fra Spiir?</h2>
        <p>
          Nej, ikke længere. Indtil lukningen kunne du eksportere dine poster fra appen eller webversionen, enten som en simpel CSV-fil, en avanceret eksport i CSV eller
          JSON eller en fuld dataeksport som ZIP-fil. Fra 8. juni 2026 kan du ikke logge ind, skriver <A href={SPIIR}>Spiir</A>.
        </p>
        <p>
          Spiir stopper med at hente data fra dine konti og bruger ikke længere de samtykker, du har givet. Dine personoplysninger bliver slettet eller anonymiseret, men
          nogle kan blive gemt i en begrænset periode af juridiske grunde.
        </p>
        <p>
          Lukningen påvirker ikke dine bankkonti. Dine posteringer ligger stadig i netbanken, og <A href={TAENK_BUDGET}>Forbrugerrådet Tænk</A> anbefaler at gå et år
          tilbage der, når du lægger et nyt budget. Har du en eksportfil fra Spiir, så gem den et sikkert sted.
        </p>
      </section>
      <section>
        <h2>Hvad skal du bruge i stedet for Spiir?</h2>
        <p>
          Det afhænger af, hvad du brugte Spiir til. Brugte du mest kategorierne og budgettet, skal du have en app, der henter dine posteringer og sorterer dem. Den slags
          kalder <A href={FT_TPP}>Finanstilsynet</A> en kontooplysningstjeneste, for eksempel et forbrugsoverblik eller et budget.
        </p>
        <p>
          Brugte du Spiir til at holde øje med husleje, forsikringer, strøm og abonnementer, har du snarere brug for et overblik over de faste udgifter, og hvornår de
          bliver trukket.
        </p>
        <p>
          Din egen bank kan også være et bud. Ifølge Finanstilsynet kan pengeinstitutter som udgangspunkt udbyde kontooplysningstjenester uden en særskilt tilladelse. Se,
          hvad din netbank kan vise, før du vælger en ny app.
        </p>
        <p>
          Måske har du brug for begge dele: en budgetapp til det daglige forbrug og et overblik over de faste aftaler. De svarer på to forskellige spørgsmål, nemlig hvor
          pengene gik hen, og hvad der skal trækkes de næste uger.
        </p>
      </section>
      <section>
        <h2>Er det sikkert at give en ny app adgang til banken?</h2>
        <p>
          Det er reguleret. Kun virksomheder med tilladelse fra Finanstilsynet må udbyde kontooplysningstjenester, og de må kun hente dine oplysninger med dit udtrykkelige
          samtykke, skriver <A href={FT_TPP}>Finanstilsynet</A>. Oplysningerne må kun bruges til at give dig selv det overblik, du har bedt om. En udbyder med tilladelse fra
          et andet EU- eller EØS-land må også tilbyde tjenesten i Danmark.
        </p>
        <p>
          Adgangen gælder betalingskonti som lønkontoen eller husholdningskontoen. En opsparingskonto eller en konto til et boliglån er ifølge Finanstilsynet ikke en
          betalingskonto.
        </p>
        <p>
          Før du giver adgang, kan du slå udbyderen op i <A href={FT_REGISTER}>Finanstilsynets virksomhedsregister</A>. Læs også appens privatlivspolitik, og se, hvordan
          du trækker samtykket tilbage igen.
        </p>
      </section>
      <section>
        <h2>Hvad skal du se efter i en ny app?</h2>
        <p>
          Spiirs lukning viste, at et overblik afhænger af, at tjenesten fortsætter, og at det er godt at kunne tage sine data med. Stil disse spørgsmål, før du vælger:
        </p>
        <ul>
          <li>Kan appen forbinde alle dine banker?</li>
          <li>Kan du rette kategorierne, når en postering lander forkert?</li>
          <li>Kan du eksportere dine data, hvis du vil skifte, eller hvis appen lukker?</li>
          <li>Hvad koster appen, og hvordan tjener udbyderen penge?</li>
          <li>Hvem står bag, og har udbyderen tilladelse fra Finanstilsynet?</li>
        </ul>
        <p>
          Prøv gerne appen et par uger, før du lægger hele budgettet ind. Så ser du, om kategorierne rammer rigtigt, og om alle dine konti kommer med. Kan du ikke finde
          svarene i vilkårene, så spørg udbyderen, før du forbinder banken.
        </p>
      </section>
      <section>
        <h2>Hvordan kommer du i gang efter Spiir?</h2>
        <p>
          Start med netbanken. Gå 12 måneder tilbage, og skriv dine faste udgifter ned med beløb og dato, som <A href={TAENK_BUDGET}>Forbrugerrådet Tænk</A> anbefaler.
          Så får du også de regninger med, der kun kommer hvert kvartal eller én gang om året.
        </p>
        <p>
          Tjek også, hvilken konto pengene bliver trukket fra. Ifølge Tænk bliver mange faste udgifter, for eksempel mobil og streaming, trukket automatisk via
          betalingskortet, også når de er tilmeldt via MobilePay. Så ryger de ofte fra lønkontoen og ikke fra budgetkontoen.
        </p>
        <p>Når du har listen, er det lettere at se, om en ny app viser det, du har brug for.</p>
      </section>
      <section>
        <h2>Regneeksempel: hvorfor kommer de faste udgifter ikke hver måned?</h2>
        <p>
          Et eksempel, ikke din regning. <A href={TAENK_BUDGET}>Forbrugerrådet Tænk</A> advarer mod blot at dele årets faste udgifter med 12, fordi mange regninger kommer
          kvartalsvis, halvårligt eller én gang om året. Eksemplet bygger på disse antagelser:
        </p>
        <ul>
          <li>Du har faste udgifter på 10.000 kroner hver måned.</li>
          <li>En forsikring på 6.000 kroner bliver trukket én gang om året, i januar.</li>
          <li>Du starter en budgetkonto i januar og overfører det samme beløb hver måned.</li>
        </ul>
        <p>
          Året giver 126.000 kroner i faste udgifter, eller 10.500 kroner om måneden, når du deler med 12. Men i januar skal der betales 16.000 kroner, så efter den første
          overførsel mangler der 5.500 kroner. Derfor er det vigtigt at se, hvornår regningerne kommer, ikke kun hvad de koster i alt. Tænk anbefaler at lave et overblik over årets betalinger måned for måned og eventuelt at sætte ekstra penge ind på kontoen til en start.
        </p>
      </section>
      <section>
        <h2>Hvordan kan Altid Hjem hjælpe?</h2>
        <p>
          Spiir er lukket, men de faste udgifter bliver ved med at blive trukket. Altid Hjem samler madplan, strøm, forsikring og økonomi i én app, så du får ét overblik,
          ét login.
        </p>
        <p>
          Forbinder du banken, ser du dine faste udgifter og abonnementer i en kalender, før pengene bliver trukket. Altid Hjem er bygget af holdet bag elleverandøren
          Altid Energi. Du kan hente appen gratis i App Store og Google Play.
        </p>
        <GuideApp
          tone="honey"
          src="/site/app/okonomi-top-uden-beta.webp"
          alt="Økonomi i Altid Hjem: 1.076 kr. brugt siden løn, fordelt på Transport, Restaurant og takeaway, Tøj og Andet"
          caption="I appen: det, der er brugt siden lønnen, fordelt på kategorier og holdt op mod en normal måned."
        />
      </section>
    </Guide>
  )
}
