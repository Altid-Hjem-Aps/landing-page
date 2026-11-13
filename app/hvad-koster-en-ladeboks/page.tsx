import type { Metadata } from 'next'
import LadeboksCalculator from '@/components/LadeboksCalculator'
import Guide, { GuideFigure, GuideLink as A, type GuideFaq } from '@/components/site/Guide'

export const metadata: Metadata = {
  title: 'Hvad koster en ladeboks? Priser og valg | Altid Hjem',
  description:
    'Se vejledende priser på ladeboks, installation, leje og refusion, og få styr på prisen for hjemmeladning. Prøv beregneren her på siden.',
  alternates: { canonical: 'https://altidhjem.dk/hvad-koster-en-ladeboks' },
  openGraph: {
    title: 'Hvad koster en ladeboks?',
    description:
      'Se vejledende priser på ladeboks, installation, leje og refusion, og få styr på prisen for hjemmeladning. Prøv beregneren her på siden.',
    url: 'https://altidhjem.dk/hvad-koster-en-ladeboks',
    type: 'article',
  },
}

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: GuideFaq[] = [
  {
    q: 'Hvad koster en ladeboks med installation?',
    a: [
      'En ladeboks med standardinstallation koster typisk samlet 4.000-7.000 kr.',
      'Selve boksen ligger vejledende på 2.500-6.000 kr., og installationen på 1.500-3.500 kr., afhængigt af blandt andet eltavle, kabellængde og ønsket ladeeffekt.',
    ],
  },
  {
    q: 'Kan det betale sig at leje en ladeboks?',
    a: [
      'Ja, leje kan betale sig, hvis du ønsker en lav startudgift og værdsætter inkluderet service.',
      'Den vejledende pris er typisk 79-199 kr. om måneden, men sammenlign totalprisen, bindingen og vilkårene med et køb.',
    ],
  },
  {
    q: 'Hvad koster det at lade elbilen hjemme?',
    a: [
      'Hjemmeladning koster typisk 2,00-3,50 kr. pr. kWh før refusion.',
      'Den faktiske pris varierer med elaftalen, tidspunktet, nettariffer, elafgift, tillæg og gebyrer, mens en refusionsaftale i et eksempel kan bringe den effektive pris ned omkring 0,73 kr. pr. kWh.',
    ],
  },
  {
    q: 'Hvad er en refusionsaftale?',
    a: [
      'En refusionsaftale er en serviceaftale, som kan give refusion af en del af elafgiften på dokumenteret opladning.',
      'Den koster typisk 0-79 kr. om måneden, og du bør kontrollere sats, måling, krav, binding og udbetaling.',
    ],
  },
  {
    q: 'Hvor meget strøm bruger en elbil?',
    a: [
      'En moderne elbil bruger typisk 15-22 kWh pr. 100 km.',
      'Forbruget varierer blandt andet med bilmodel, hastighed, temperatur, kørestil og brug af varme eller aircondition.',
    ],
  },
  {
    q: 'Hvad er Altid Hjem?',
    a: [
      'Altid Hjem er en dansk app, der samler madplan, strøm, forsikring og økonomi ét sted, så du får ét overblik, ét login.',
      'Appen er bygget af holdet bag det gebyrfrie energiselskab Altid Energi, hvor mere end 15.000 danskere allerede er kunder.',
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

export default function HvadKosterEnLadeboks() {
  return (
    <Guide
      title="Hvad koster en ladeboks?"
      lead={
        <>
          <p>
            En ladeboks med standardinstallation koster typisk samlet 4.000-7.000 kr. Selve boksen ligger vejledende på 2.500-6.000 kr., mens installation typisk koster
            1.500-3.500 kr.
          </p>
          <p>
            Du kan også leje en ladeboks for typisk 79-199 kr. om måneden. En serviceaftale med refusion koster typisk 0-79 kr. om måneden og kan ændre det samlede
            regnestykke mærkbart.
          </p>
        </>
      }
      meta={
        <>
          Opdateret: juli 2026 · Priserne er vejledende markedsintervaller · Se også{' '}
          <a href="https://fdm.dk/vaerd-at-vide/ladeloesninger/hvad-koster-det-at-lade-en-elbil-op-hjemme" target="_blank" rel="noopener noreferrer">
            FDM om hjemmeladning
          </a>
        </>
      }
      faq={FAQ}
      cta={{
        eyebrow: 'Ét overblik over hjemmets udgifter',
        heading: 'Hent Altid Hjem, og få overblik over husstanden',
        subtitle: 'Appen er gratis og viser elprisen time for time, så du kan se, hvornår strømmen er billig.',
      }}
    >
      <section>
        <h2>Prisen på selve ladeboksen</h2>
        <p>
          Selve ladeboksen koster typisk 2.500-6.000 kr. Prisen afhænger blandt andet af ladeeffekt, funktioner, app-styring og om boksen sælges alene eller som del af en
          samlet løsning.
        </p>
        <p>
          Installation koster typisk yderligere 1.500-3.500 kr. Derfor ender boks og standardinstallation normalt på cirka 4.000-7.000 kr. samlet.
        </p>
        <p>
          Prisen kan blive højere, hvis eltavlen skal opgraderes, kablet skal føres langt, eller installationen kræver ekstra arbejde. Bed derfor om et tilbud, der tydeligt
          viser, hvad standardinstallationen omfatter.
        </p>
      </section>
      <section>
        <h2>Skal du købe eller leje ladeboksen?</h2>
        <p>
          Ved køb betaler du typisk en større engangsudgift, men ejer selv boksen. Det kan give mening, hvis du forventer at blive boende længe og ønsker frihed til at
          vælge serviceaftale.
        </p>
        <p>
          Leje koster typisk 79-199 kr. om måneden. Det kan være attraktivt, hvis du foretrækker en lavere startudgift, men undersøg den samlede pris over flere år,
          bindingsperioden og vilkårene ved opsigelse.
        </p>
        <p>
          Sammenlign også, hvem der betaler for installation, service, reparation og udskiftning. En lav månedspris er ikke nødvendigvis den billigste løsning samlet set.
        </p>
      </section>
      <section>
        <h2>Det egentlige regnestykke er strømmen</h2>
        <p>
          Hjemmeladning koster typisk 2,00-3,50 kr. pr. kWh før refusion. Prisen varierer med elaftalen, tidspunktet for opladning, nettariffer, elafgift og eventuelle
          tillæg og gebyrer.
        </p>
        <p>
          Med en refusionsaftale kan den effektive pris i et eksempel lande omkring 0,73 kr. pr. kWh. Det er ikke en fast pris eller en garanti, da både elpris,
          refusionsbeløb og aftalevilkår kan ændre sig.
        </p>
        <p>
          En moderne elbil bruger typisk 15-22 kWh pr. 100 km. Indtast dit månedlige kørselsbehov, bilens forbrug og din elpris i beregneren her på siden for at få et
          vejledende estimat baseret på dine egne tal.
        </p>
        <GuideFigure tone="sky" caption="Beregn din månedlige ladeudgift med dine egne tal. Intet gemmes.">
          <LadeboksCalculator />
        </GuideFigure>
      </section>
      <section>
        <h2>Refusionsaftaler, og hvad du skal kontrollere</h2>
        <p>
          En serviceaftale med elafgiftsrefusion koster typisk 0-79 kr. om måneden. Den kan være økonomisk fordelagtig, hvis den mulige refusion overstiger
          abonnementsprisen og øvrige omkostninger.
        </p>
        <p>
          Tjek, hvilken sats aftalen bruger, hvordan forbruget måles, og hvornår refusionen udbetales. Undersøg også krav til ladeboks, elaftale og installation samt
          eventuelle begrænsninger, bindinger og opsigelsesvilkår.
        </p>
        <p>
          Sammenlign altid nettogevinsten efter abonnementet. Vilkår og din husstands forhold afgør, om en refusionsaftale reelt kan betale sig.
        </p>
      </section>
      <section>
        <h2>Ladeboks og elaftale hænger sammen</h2>
        <p>
          En billig ladeboks sikrer ikke nødvendigvis billig opladning. Elprisen består af spotpris, nettariffer, elafgift samt elselskabets tillæg og gebyrer, så den
          løbende strømpris kan få stor betydning over tid.
        </p>
        <p>
          Du kan ofte påvirke udgiften ved at lade, når spotprisen er lav. Læs mere om <A href="/hvornar-er-strommen-billigst">hvornår strømmen er billigst</A>, og se, hvad
          du bør sammenligne, når du leder efter <A href="/billigste-elselskab">det billigste elselskab</A>.
        </p>
        <p>
          Altid Energi er gebyrfrit og har ingen faste gebyrer eller abonnement. Når du sammenligner elaftaler, bør du stadig tage udgangspunkt i dit eget forbrug, dit
          lademønster og aftalens samlede pris.
        </p>
      </section>
      <section>
        <h2>Hvad Altid Hjem kan i dag</h2>
        <p>
          Altid Hjem samler madplan, strøm, forsikring og økonomi i én app, så du får ét overblik, ét login. Opladning af elbil er ikke i appen endnu, men er blandt de
          næste tjenester, vi lancerer.
        </p>
        <p>
          I appen ser du elprisen time for time og kan få besked, når strømmen er billig. Det kan du bruge, når du vil vælge, hvornår bilen skal lades.
        </p>
        <p>
          Altid Hjem er bygget af holdet bag Altid Energi, Danmarks første gebyrfrie energiselskab, hvor mere end 15.000 danskere allerede er kunder. Du kan hente appen
          gratis i App Store og Google Play.
        </p>
      </section>
    </Guide>
  )
}
