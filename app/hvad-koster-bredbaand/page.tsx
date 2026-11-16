import type { Metadata } from 'next'
import Guide, { type GuideFaq, GuideApp, GuideLink as A, GuideSteps } from '@/components/site/Guide'

// Built by the recipe (docs/guide-recipe.md, ALT-1714), topic approved by Thor on 16 Nov 2026. The
// newest official prices per technology are Erhvervsstyrelsen's from January 2024; the page says so.
export const metadata: Metadata = {
  title: 'Hvad koster bredbånd om måneden? | Altid Hjem',
  description:
    'Fiber med 300 Mbit/s kostede i gennemsnit 305 kr. om måneden i januar 2024 og coax 284 kr., ifølge Erhvervsstyrelsen. Se, hvad der afgør prisen.',
  alternates: { canonical: 'https://www.altidhjem.dk/hvad-koster-bredbaand' },
  openGraph: {
    title: 'Hvad koster bredbånd om måneden?',
    description:
      'Fiber med 300 Mbit/s kostede i gennemsnit 305 kr. om måneden i januar 2024 og coax 284 kr., ifølge Erhvervsstyrelsen. Se, hvad der afgør prisen.',
    url: 'https://www.altidhjem.dk/hvad-koster-bredbaand',
    type: 'article',
  },
}

const EST = 'https://erhvervsstyrelsen.dk/sites/default/files/2025-08/Bilag-1-udkast-produktmarkedsafgraensning-marked-1-juli2025_WA.pdf'
const EST_METODE = 'https://kfst.dk/media/4oaah2pk/bilag-b-datakilder-metode-juli2024_wa.pdf'
const DIGST = 'https://digst.dk/media/r2chpp0w/slutbrugerbekendtgoerelsen-vejledning_nov_2025.pdf'
const TAENK_BINDING = 'https://taenk.dk/forbrugerliv/elektronik-og-digitale-tjenester/afgoerelse-opgradering-af-bredbaand-udloeser-ikke-ny'
const DST = 'https://www.statistikbanken.dk/PRIS01'

// FAQ bruges to steder: synligt på siden og som FAQPage-schema.
const FAQ: GuideFaq[] = [
  {
    q: 'Hvad koster bredbånd om måneden?',
    a: [
      'Ifølge Erhvervsstyrelsen kostede fiber med 300 Mbit/s i gennemsnit 305 kroner om måneden i januar 2024, og coax med samme hastighed 284 kroner.',
      'Gennemsnittene tager højde for rabatter og oprettelse over en periode på 56 måneder, så de første måneders pris kan være lavere.',
    ],
  },
  {
    q: 'Er fiber dyrere end coax?',
    a: [
      'Ja, typisk. Erhvervsstyrelsen skriver, at fiberbaserede produkter grundlæggende er de dyreste, og at et fiberabonnement i gennemsnit koster 20 til 65 kroner mere om måneden end coax med samme hastighed.',
      'Hvilken teknologi I kan få, afhænger af adressen.',
    ],
  },
  {
    q: 'Hvor lang må bindingsperioden være?',
    a: [
      'Højst 6 måneder for forbrugere, inklusive opsigelsesvarsel. Derefter kan I opsige med 1 måneds varsel til udgangen af en måned.',
      'Det følger af slutbrugerbekendtgørelsen, som Digitaliseringsstyrelsen har lavet en vejledning til.',
    ],
  },
  {
    q: 'Kan vi opsige, hvis prisen stiger?',
    a: [
      'Ja. Udbyderen skal give besked om en prisstigning mindst 1 måned før, og I kan opsige uden omkostninger, uanset en eventuel bindingsperiode.',
    ],
  },
  {
    q: 'Kan det betale sig at vælge 1000 Mbit/s frem for 300 Mbit/s?',
    a: [
      'Ifølge Erhvervsstyrelsen kostede fiber med 1000 Mbit/s i gennemsnit 365 kroner om måneden mod 305 kroner for 300 Mbit/s i januar 2024, altså 60 kroner mere.',
      'Om I har brug for hastigheden, afhænger af, hvor mange der bruger nettet på én gang, og hvad de bruger det til.',
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

const PRISER = [
  { speed: '100 Mbit/s', fiber: '284 kr.', coax: '225 kr.', kobber: '272 kr.' },
  { speed: '300 Mbit/s', fiber: '305 kr.', coax: '284 kr.', kobber: 'Ikke oplyst' },
  { speed: '1000 Mbit/s', fiber: '365 kr.', coax: '300 kr.', kobber: 'Ikke oplyst' },
]

export default function HvadKosterBredbaand() {
  return (
    <Guide
      title="Hvad koster bredbånd om måneden?"
      lead={
        <>
          <p>
            305 kroner om måneden kostede fiber med 300 Mbit/s i gennemsnit i januar 2024, og coax med samme hastighed 284 kroner, viser tal fra Erhvervsstyrelsen. Det er
            de nyeste gennemsnitspriser fordelt på teknologi.
          </p>
          <p>Jeres egen pris afhænger af, hvilken teknologi I kan få på adressen, hvilken hastighed I vælger, og om I har en introrabat.</p>
        </>
      }
      meta={
        <>
          Gennemsnitspriserne er fra januar 2024 · Se{' '}
          <a href={EST} target="_blank" rel="noopener noreferrer">
            Erhvervsstyrelsens analyse
          </a>
        </>
      }
      answer={{
        label: 'Fiber, 300 Mbit/s, januar 2024',
        value: '305',
        unit: 'kr. om måneden',
        note: 'Coax med samme hastighed: 284 kr. Erhvervsstyrelsen, januar 2024.',
      }}
      factors={{ label: 'Det afgør prisen', items: ['Teknologi på adressen', 'Hastighed', 'Introrabat', 'Oprettelsesgebyr', 'Router'] }}
      faq={FAQ}
      cta={{
        eyebrow: 'Alle jeres faste udgifter ét sted',
        heading: 'Hent Altid Hjem og få overblik over husstanden',
        subtitle: 'Forbinder I banken, ser I jeres faste udgifter og abonnementer i en kalender, før pengene bliver trukket.',
      }}
      page={{ path: '/hvad-koster-bredbaand', description: metadata.description as string, published: '2026-11-16', updated: '2026-11-16' }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'Erhvervsstyrelsen', title: 'Bilag 1: Udkast til produktmarkedsafgrænsning for marked 1', href: EST, note: 'Juli 2025, udkast. Gennemsnitspriser fra januar 2024' },
          { publisher: 'Erhvervsstyrelsen', title: 'Bilag B: Datakilder og metode', href: EST_METODE, note: 'Juli 2024. Sådan er gennemsnitspriserne beregnet' },
          { publisher: 'Digitaliseringsstyrelsen', title: 'Vejledning til slutbrugerbekendtgørelsen', href: DIGST, note: 'November 2025' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Bredbånd: Opgradering udløser ikke ny bindingsperiode', href: TAENK_BINDING, note: '3. september 2021' },
          { publisher: 'Danmarks Statistik', title: 'PRIS01: Forbrugerprisindeks, gruppe 08.3.3 Internetadgangstjenester og onlinelagringstjenester', href: DST, note: 'Oktober 2021 til oktober 2026. Egne beregninger på baggrund af data fra Danmarks Statistik' },
        ],
      }}
      related={['/billigste-mobilabonnement', '/opsig-abonnementer', '/bedste-budget-app']}
    >
      <section>
        <h2>Hvad koster fiber, coax og kobber?</h2>
        <p>
          De nyeste gennemsnitspriser fordelt på teknologi er fra januar 2024. Dengang kostede fiber med 300 Mbit/s i gennemsnit 305 kroner om måneden, coax 284 kroner og
          fiber med 1000 Mbit/s 365 kroner, viser <A href={EST}>Erhvervsstyrelsens analyse</A> af markedet. Billigst var coax med 100 Mbit/s til 225 kroner,
          mens kobber med 100 Mbit/s kostede 272 kroner.
        </p>
        <p>
          Gennemsnittene tager højde for den faste pris, rabatter, rabattens længde og oprettelse fordelt over 56 måneder, skriver Erhvervsstyrelsen i sin{' '}
          <A href={EST_METODE}>beskrivelse af metoden</A>. Det er et gennemsnit af udbydernes tilbud uden vægtning, ikke af det, husstandene faktisk betaler. Den pris, I
          betaler de første måneder, kan altså være lavere.
        </p>
        <div className="gd-table">
          <table>
            <thead>
              <tr>
                <th>Hastighed</th>
                <th>Fiber</th>
                <th>Coax</th>
                <th>Kobber</th>
              </tr>
            </thead>
            <tbody>
              {PRISER.map((p) => (
                <tr key={p.speed}>
                  <td>{p.speed}</td>
                  <td>{p.fiber}</td>
                  <td>{p.coax}</td>
                  <td>{p.kobber}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Gennemsnitspris om måneden i januar 2024. Kilde: Erhvervsstyrelsen.</p>
        </div>
      </section>
      <section>
        <h2>Er fiber dyrere end coax?</h2>
        <p>
          Ja, typisk. Ifølge <A href={EST}>Erhvervsstyrelsen</A> er fiberbaserede produkter grundlæggende de dyreste, og et fiberabonnement koster i gennemsnit 20 til 65
          kroner mere om måneden end et coax-abonnement med samme hastighed.
        </p>
        <p>
          Erhvervsstyrelsen skriver også, at de højeste priser på coax med 100, 300 og 1000 Mbit/s er lavere end gennemsnitsprisen for fiber med samme hastighed. Hvilken
          teknologi I kan få, afhænger dog af adressen.
        </p>
      </section>
      <section>
        <h2>Hvad afgør prisen på bredbånd?</h2>
        <p>
          Både teknologien og hastigheden betyder noget. I januar 2024 kostede fiber med 1000 Mbit/s i gennemsnit 81 kroner mere om måneden end fiber med 100 Mbit/s, mens
          forskellen mellem fiber og coax med samme hastighed var 20 til 65 kroner, ifølge <A href={EST}>Erhvervsstyrelsen</A>. Abonnementer med 2500 Mbit/s skiller sig
          dog ud prismæssigt. Ifølge Erhvervsstyrelsen er det premiumprodukter, som for nylig er kommet på markedet.
        </p>
        <p>
          Kunderne lægger i øvrigt mere vægt på hastighed og stabilitet end på prisen, viser en undersøgelse, som Erhvervsstyrelsen henviser til. Prisen er vigtig, men ikke
          i samme grad.
        </p>
        <p>
          Se altid efter, hvad abonnementet koster, når en eventuel introrabat er slut, og regn et oprettelsesgebyr og en router med, når I sammenligner.
        </p>
      </section>
      <section>
        <h2>Hvad koster 5G-bredbånd?</h2>
        <p>
          Ifølge <A href={EST}>Erhvervsstyrelsen</A> ligger 5G-abonnementer med ubegrænset data mellem 279 og 299 kroner om måneden, når prisen regnes ud over tid.
        </p>
        <p>
          For 5G-abonnementer skriver Erhvervsstyrelsen, at de første tre til seks måneder ofte har en nedsat pris, hvorefter den almindelige pris træder i kraft. Til
          5G-bredbånd skal I også købe eller leje en særlig router, der kan bruge 5G. Tjek prisen på den, og om dækningen er god nok, der hvor routeren skal stå.
        </p>
      </section>
      <section>
        <h2>Er bredbånd blevet dyrere?</h2>
        <p>
          Mindre end forbrugerpriserne generelt. Danmarks Statistik følger priserne på internetadgang i <A href={DST}>forbrugerprisindekset</A>. Fra oktober 2021 til oktober
          2026 er de steget 13,2 procent, mens de samlede forbrugerpriser er steget 16,9 procent. Procenterne for de fem år er vores egne beregninger.
        </p>
        <p>
          Fra oktober 2025 til oktober 2026 steg priserne på internetadgang 1,3 procent mod 2,2 procent for forbrugerpriserne i alt. Erhvervsstyrelsen beskriver også
          priserne som nogenlunde stabile fra 2022 til 2025. I 2019 kostede et abonnement med 1000 Mbit/s i gennemsnit 425 kroner om måneden.
        </p>
      </section>
      <section>
        <h2>Hvor længe kan I være bundet?</h2>
        <p>
          Højst 6 måneder. Ifølge <A href={DIGST}>Digitaliseringsstyrelsens vejledning</A> til slutbrugerbekendtgørelsen må en bindingsperiode for forbrugere højst være 6
          måneder inklusive opsigelsesvarsel. Derefter kan I opsige med 1 måneds varsel til udgangen af en måned, uden ekstra omkostninger. For små erhvervskunder kan bindingen være op til 24
          måneder, men det gælder ikke private husstande.
        </p>
        <p>
          Hæver udbyderen prisen, skal I have besked mindst 1 måned før, og I kan opsige uden omkostninger, uanset om I er bundet. Udbyderen skal også give jer oplysninger om
          den bedste pris mindst én gang om året.
        </p>
        <p>
          Får I mere data på et mobilt bredbåndsabonnement, starter det ikke nødvendigvis en ny binding. Teleankenævnet har i en sag, som{' '}
          <A href={TAENK_BINDING}>Forbrugerrådet Tænk</A> omtaler, afgjort, at mere data ikke kan forventes at udløse en ny bindingsperiode, når udbyderen ikke tydeligt
          havde sagt det.
        </p>
      </section>
      <section>
        <h2>Hvad skal I tjekke, før abonnementet forlænges?</h2>
        <p>
          Før et abonnement forlænges automatisk, skal udbyderen ifølge <A href={DIGST}>Digitaliseringsstyrelsens vejledning</A> rådgive jer om den bedste pris. Brug den
          besked til at se, om der findes et billigere abonnement, der passer til jeres brug.
        </p>
        <p>
          Tjek også, om I stadig bruger den hastighed, I betaler for. Har jeres husstand ændret sig, kan et trin ned i hastighed være nok. Og husk at regne et eventuelt
          oprettelsesgebyr med, hvis I skifter udbyder.
        </p>
      </section>
      <section>
        <h2>Regneeksempel: hvad koster hastigheden om året?</h2>
        <p>Et eksempel, ikke jeres regning. Det bygger på disse antagelser:</p>
        <ul>
          <li>I har fiber og betaler gennemsnitsprisen fra januar 2024.</li>
          <li>I sammenligner 300 Mbit/s med 1000 Mbit/s og ser bort fra introrabatter.</li>
        </ul>
        <p>
          300 Mbit/s koster så 3.660 kroner om året og 1000 Mbit/s 4.380 kroner. Forskellen i gennemsnitspris er 720 kroner om året. Med coax er forskellen mellem 300 Mbit/s og 1000 Mbit/s 192 kroner om året.
          Jeres egen pris kan I kun se ved at
          indhente tilbud på jeres adresse.
        </p>
      </section>
      <GuideSteps
        title="Tjekliste før I skifter bredbånd"
        steps={[
          'Find ud af, hvilke teknologier I kan få på adressen, og hvilken hastighed I reelt bruger.',
          'Sammenlign prisen, når introrabatten er slut, og regn oprettelsesgebyr og router med.',
          'Tjek, hvornår jeres nuværende binding udløber. Bindingen må højst være 6 måneder inklusive opsigelsesvarsel.',
          'Opsig det gamle abonnement med 1 måneds varsel til udgangen af en måned, og bestil det nye, så det starter, før det gamle stopper.',
        ]}
      />
      <section>
        <h2>Hvordan kan Altid Hjem hjælpe?</h2>
        <p>
          Bredbånd er en af de faste udgifter, der bare bliver trukket hver måned. Altid Hjem samler madplan, strøm, forsikring og økonomi i én app, så I får ét overblik, ét
          login.
        </p>
        <p>
          Forbinder I banken, ser I jeres faste udgifter og abonnementer i en kalender, før pengene bliver trukket. I kan hente appen gratis i App Store og Google Play.
        </p>
        <GuideApp tone="sky" src="/site/app/regninger-top.webp" alt="Regninger i Altid Hjem: faste regninger vist i en kalender for november" caption="I appen: husstandens faste regninger i en kalender, og hvad den næste store regning er." />
      </section>
    </Guide>
  )
}
