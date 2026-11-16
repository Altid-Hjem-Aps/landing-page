import type { Metadata } from 'next'
import MobilOverblikMockup from '@/components/MobilOverblikMockup'
import Guide, { type GuideFaq, GuideApp, GuideFigure, GuideLink as A } from '@/components/site/Guide'

// Upgraded to the recipe (docs/guide-recipe.md) on 16 Nov 2026. No mobile operator is named: the
// lowest prices are a comparison site's (it says it earns a fee from its partners), the
// price level is Forbrugerrådet Tænk's test, and the rules are Digitaliseringsstyrelsen's.
export const metadata: Metadata = {
  title: 'Billigste mobilabonnement i 2026 | Altid Hjem',
  description:
    '19 kr. om måneden var den laveste normalpris på billigsteabonnement.dk 16. november 2026, og fri tale startede ved 35 kr. Se, hvad husstanden bør tjekke.',
  alternates: { canonical: 'https://www.altidhjem.dk/billigste-mobilabonnement' },
  openGraph: {
    title: 'Det billigste mobilabonnement til hele husstanden',
    description:
      '19 kr. om måneden var den laveste normalpris på billigsteabonnement.dk 16. november 2026, og fri tale startede ved 35 kr. Se, hvad husstanden bør tjekke.',
    url: 'https://www.altidhjem.dk/billigste-mobilabonnement',
    type: 'article',
  },
}

const PRISSIDE = 'https://billigsteabonnement.dk/mobilabonnementer'
const TAENK = 'https://taenk.dk/test/mobilabonnementer/mobilabonnementer-bedst-og-billigst'
const DIGST = 'https://digst.dk/media/r2chpp0w/slutbrugerbekendtgoerelsen-vejledning_nov_2025.pdf'
const DST = 'https://www.statistikbanken.dk/PRIS01'
const EU_ROAMING = 'https://europa.eu/youreurope/citizens/consumers/internet-telecoms/mobile-roaming-costs/index_da.htm'

// FAQ bruges to steder: synligt på siden og som FAQPage-schema.
const FAQ: GuideFaq[] = [
  {
    q: 'Hvad er det billigste mobilabonnement?',
    a: [
      'Den laveste normalpris på prissammenligningssiden billigsteabonnement.dk var 19 kroner om måneden 16. november 2026, for et abonnement med 5 GB data og 5 timers tale. Fri tale startede ved 35 kroner.',
      'Om det er det rigtige for jer, afhænger af, hvor meget data og tale I bruger.',
    ],
  },
  {
    q: 'Hvor meget data har vi brug for?',
    a: [
      'Se jeres eget forbrug hos teleselskabet. I Forbrugerrådet Tænks undersøgelse brugte 610 medlemmer i gennemsnit 18 GB data om måneden.',
      'Ifølge Tænk er den største årsag til, at mange betaler for meget, at de køber langt mere data, end de bruger.',
    ],
  },
  {
    q: 'Hvor længe må et mobilabonnement binde os?',
    a: [
      'Højst 6 måneder, inklusive opsigelsesvarsel. Derefter kan I opsige med 1 måneds varsel til udgangen af en måned.',
      'Afbetaling på en telefon må heller ikke binde jer længere end 6 måneder, ifølge Digitaliseringsstyrelsens vejledning.',
    ],
  },
  {
    q: 'Kan vi opsige, hvis prisen stiger?',
    a: [
      'Ja. Teleselskabet skal varsle en prisstigning mindst 1 måned før, og I kan opsige uden omkostninger, uanset en eventuel bindingsperiode.',
      'Reglen gælder ikke for forudbetalte taletidskort.',
    ],
  },
  {
    q: 'Kan vi tage nummeret med til et nyt selskab?',
    a: [
      'Ja, det hedder nummerportering. I kan bede om, at det nye abonnement først starter, når opsigelsesperioden hos det gamle selskab er slut.',
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

export default function BilligsteMobilabonnement() {
  return (
    <Guide
      title="Det billigste mobilabonnement til hele husstanden"
      lead={
        <>
          <p>
            19 kroner om måneden var den laveste normalpris blandt 109 abonnementer fra 10 selskaber på prissammenligningssiden billigsteabonnement.dk 16. november 2026. Fri
            tale startede ved 35 kroner.
          </p>
          <p>
            Den laveste pris er ikke nødvendigvis den rigtige for jer. Forbrugerrådet Tænk fandt i september 2026, at de ti bedste abonnementer i sin test alle kostede
            under 100 kroner om måneden. Se på data, vilkår og hele husstandens udgift, når I sammenligner.
          </p>
        </>
      }
      meta={
        <>
          Priserne er fra 16. november 2026 · Se{' '}
          <a href={TAENK} target="_blank" rel="noopener noreferrer">
            Forbrugerrådet Tænks test
          </a>
        </>
      }
      answer={{ label: 'Laveste normalpris, november 2026', value: '19', unit: 'kr. om måneden', note: 'Fri tale fra 35 kr. Kilde: billigsteabonnement.dk, 109 abonnementer fra 10 selskaber.' }}
      factors={{ label: 'Det afgør prisen', items: ['Data', 'Tale', 'Roaming i EU', 'Binding og afbetaling', 'Husstandens samlede udgift'] }}
      faq={FAQ}
      related={['/hvad-koster-bredbaand', '/opsig-abonnementer', '/bedste-budget-app']}
      cta={{
        eyebrow: 'Ét overblik over hele husstanden',
        heading: 'Hent Altid Hjem og få overblik over husstanden',
        subtitle: 'Forbind banken, så ser I jeres faste udgifter og abonnementer i en kalender, før pengene bliver trukket.',
      }}
      page={{ path: '/billigste-mobilabonnement', description: metadata.description as string, published: '2026-07-27', updated: '2026-11-16' }}
      sources={{
        checked: '2026-11-16',
        items: [
          {
            publisher: 'billigsteabonnement.dk',
            title: 'Billigste mobilabonnement 2026: alle 109 planer på reel pris',
            href: PRISSIDE,
            note: 'Opdateret 16. november 2026. Normalpriser, ikke intropriser. Siden oplyser, at den får provision fra sine samarbejdspartnere',
          },
          { publisher: 'Forbrugerrådet Tænk', title: 'Betaler du mere end 100 kr. for dit mobilabonnement, betaler du for meget', href: TAENK, note: '17. september 2026' },
          { publisher: 'Digitaliseringsstyrelsen', title: 'Vejledning til slutbrugerbekendtgørelsen', href: DIGST, note: 'November 2025' },
          {
            publisher: 'Danmarks Statistik',
            title: 'PRIS01: Forbrugerprisindeks, gruppe 08.3.2 Mobilkommunikationstjenester',
            href: DST,
            note: 'Oktober 2021 til oktober 2026. Egne beregninger på baggrund af data fra Danmarks Statistik',
          },
          { publisher: 'Den Europæiske Union, Dit Europa', title: 'Roaming: brug af mobiltelefon i EU', href: EU_ROAMING, note: 'Senest tjekket af EU 7. januar 2026' },
        ],
      }}
    >
      <section>
        <h2>Hvad koster et mobilabonnement i 2026?</h2>
        <p>
          Fra 19 kroner om måneden. Det var den laveste normalpris på <A href={PRISSIDE}>billigsteabonnement.dk</A> 16. november 2026, for et abonnement med 5 GB data og 5
          timers tale. Fri tale startede ved 35 kroner og fri data ved 134 kroner, mens det dyreste abonnement i sammenligningen kostede 619 kroner. Siden sammenligner 109 abonnementer fra 10 selskaber og oplyser selv, at den får
          provision fra sine samarbejdspartnere.
        </p>
        <p>
          <A href={TAENK}>Forbrugerrådet Tænk</A> testede 188 mobilabonnementer fra 23 teleselskaber. De ti bedste i testen kostede alle under 100 kroner om måneden, og
          ifølge Tænk betaler I højst sandsynligt for meget, hvis jeres abonnement koster mere end det.
        </p>
        <p>Priserne ændrer sig hele tiden, så tjek altid prisen hos selskabet selv, og se, hvad den er, når en eventuel introrabat er slut.</p>
      </section>
      <section>
        <h2>Hvor meget data har I brug for?</h2>
        <p>
          Ofte mindre, end I betaler for. I en undersøgelse, hvor 610 medlemmer af <A href={TAENK}>Forbrugerrådet Tænk</A> oplyste deres faktiske dataforbrug, var gennemsnittet 18
          GB om måneden. Digitaliseringsstyrelsens gennemsnit på 34,3 GB omfatter ifølge Tænk også dataforbrug ud over almindelige mobilabonnementer.
        </p>
        <p>
          Det er svært at vurdere, hvor meget data I har brug for, skriver Tænk. Det kan være en del af forklaringen på, at mange vælger store og dyre abonnementer, for
          eksempel med fri data.
        </p>
        <p>
          Den største årsag til, at mange betaler for meget, er ifølge Tænk, at de køber langt mere data, end de bruger. Se jeres eget forbrug på teleselskabets hjemmeside
          eller i selskabets app, person for person, før I vælger størrelse.
        </p>
      </section>
      <section>
        <h2>Er mobilabonnementer blevet dyrere?</h2>
        <p>
          Ja, især det seneste år. Fra oktober 2025 til oktober 2026 steg priserne på mobiltjenester 5,8 procent, mens forbrugerpriserne i alt steg 2,2 procent, viser{' '}
          <A href={DST}>Danmarks Statistiks forbrugerprisindeks</A>.
        </p>
        <p>
          Over fem år, fra oktober 2021 til oktober 2026, er priserne på mobiltjenester steget 14,3 procent mod 16,9 procent for forbrugerpriserne i alt. Procenterne for de
          fem år er vores egne beregninger. Har I ikke set på abonnementerne i et stykke tid, er det et godt tidspunkt nu. En prisstigning skal varsles mindst 1 måned
          før, så hold øje med beskeder fra selskabet.
        </p>
      </section>
      <section>
        <h2>Hvor længe kan I være bundet?</h2>
        <p>
          Højst 6 måneder. Ifølge <A href={DIGST}>Digitaliseringsstyrelsens vejledning</A> må en bindingsperiode for forbrugere højst være 6 måneder inklusive
          opsigelsesvarsel. Derefter kan I opsige med 1 måneds varsel til udgangen af en måned.
        </p>
        <p>
          Afbetaling på en telefon må heller ikke binde jer længere. Skal hele restbeløbet betales, hvis I opsiger abonnementet efter 6 måneder, er det en indirekte binding,
          og den er ikke tilladt, skriver Digitaliseringsstyrelsen.
        </p>
        <p>
          Hæver selskabet prisen, skal I have besked mindst 1 måned før, og I kan opsige uden omkostninger, uanset om I er bundet. Det gælder dog ikke forudbetalte
          taletidskort. Selskabet skal også mindst én gang om året oplyse jer om den bedste pris, og før en tidsbegrænset aftale forlænges automatisk, skal det fortælle jer,
          hvordan I opsiger den.
        </p>
      </section>
      <section>
        <h2>Hvad koster det at bruge mobilen i EU?</h2>
        <p>
          Ikke noget ekstra. Når I rejser til et andet EU-land, skal I ikke betale mere for at bruge mobilen, skriver <A href={EU_ROAMING}>EU&apos;s portal Dit Europa</A>.
        </p>
        <p>
          Der er dog en grænse. Er prisen på jeres data meget lav, kan selskabet bruge et dataloft for rimeligt forbrug, når I roamer, og med fri data kan selskabet begrænse,
          hvor meget data I kan bruge i andre EU-lande. Rejser I meget, så tjek, hvor mange GB abonnementet giver i EU.
        </p>
      </section>
      <section>
        <h2>Hvorfor betyder hele husstandens udgift mest?</h2>
        <p>
          For et par eller en familie er det sjældent nok at sammenligne ét abonnement. Børn og voksne kan have forskellige aftaler, gamle priser og tillæg, som ingen længere
          bruger.
        </p>
        <p>
          Når aftalerne ligger i forskellige apps, mails og netbankposter, er det svært at se husstandens samlede mobiludgift. En lille overpris på hvert abonnement kan
          derfor fylde mere end en lav kampagnepris på ét SIM-kort. Tjek også tillæg, som ekstra data eller tjenester, der følger med abonnementet, men som ingen bruger.
        </p>
        <GuideFigure
          tone="lavender"
          caption="Eksempel: en gennemgang af husstandens fire mobilabonnementer, hvor et gammelt abonnement og en ubrugt datapakke skiller sig ud. Illustration, ikke et skærmbillede fra appen."
        >
          <MobilOverblikMockup />
        </GuideFigure>
      </section>
      <section>
        <h2>Hvordan skifter I mobilabonnement?</h2>
        <p>
          Skriv først alle husstandens abonnementer ned med person, selskab, pris, data, tale, roaming, tillæg og eventuel afbetaling på en telefon. Sammenlign derefter det,
          I betaler for, med det, I faktisk bruger. Tjek, om en bindingsperiode stadig løber, og om der er afbetaling på en telefon, før I opsiger.
        </p>
        <p>
          Når I skifter, kan I tage nummeret med. Ifølge <A href={DIGST}>Digitaliseringsstyrelsens vejledning</A> kan I bede om, at det nye abonnement først starter, når
          opsigelsesperioden hos det gamle selskab er slut, så I ikke betaler dobbelt. Et selskab kan heller ikke afvise en opsigelse, fordi den er givet på en anden måde
          end den, der står i aftalen.
        </p>
        <p>
          Læs også vores guide til at <A href="/opsig-abonnementer">opsige de abonnementer</A>, I ikke længere bruger, og se, hvad <A href="/hvad-koster-bredbaand">bredbånd
          koster om måneden</A>.
        </p>
      </section>
      <section>
        <h2>Regneeksempel: hvad koster husstandens mobil om året?</h2>
        <p>Et eksempel, ikke jeres regning. Det bygger på disse antagelser:</p>
        <ul>
          <li>Husstanden har fire mobilabonnementer, ét til hver person.</li>
          <li>Hvert abonnement koster 100 kroner om måneden, den grænse Forbrugerrådet Tænk nævner.</li>
          <li>Der er ingen introrabat og ingen afbetaling på telefoner.</li>
        </ul>
        <p>
          Fire abonnementer til 100 kroner koster 400 kroner om måneden og 4.800 kroner om året. Ligger jeres samlede mobiludgift højere, er det et tegn på, at et eller flere
          abonnementer er værd at se efter. Tjek især, om hver person bruger den data, der er betalt for. Har I afbetaling på telefoner, kommer den oven i.
        </p>
      </section>
      <section>
        <h2>Hvordan kan Altid Hjem hjælpe?</h2>
        <p>
          Mobilabonnementer er nogle af de faste udgifter, der bare bliver trukket hver måned. Altid Hjem samler madplan, strøm, forsikring og økonomi i én app, så I får ét
          overblik, ét login.
        </p>
        <p>
          Forbinder I banken, ser I jeres faste udgifter og abonnementer i en kalender, før pengene bliver trukket. I kan hente appen gratis i App Store og Google Play.
        </p>
        <GuideApp
          tone="lavender"
          src="/site/app/regninger-top.webp"
          alt="Regninger i Altid Hjem: faste regninger vist i en kalender for november"
          caption="I appen: husstandens faste regninger i en kalender, og hvad den næste store regning er."
        />
      </section>
    </Guide>
  )
}
