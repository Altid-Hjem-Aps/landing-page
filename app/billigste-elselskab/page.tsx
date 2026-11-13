import type { Metadata } from 'next'
import GebyrMockup from '@/components/GebyrMockup'
import Guide, { GuideFigure, GuideLink as A, type GuideFaq } from '@/components/site/Guide'

export const metadata: Metadata = {
  title: 'Billigste elselskab, sådan sammenligner du | Altid Hjem',
  description:
    'Find det billigste elselskab ved at sammenligne spotpris, tillæg og gebyrer for dit forbrug. Få en enkel guide, og hent Altid Hjem gratis.',
  alternates: { canonical: 'https://altidhjem.dk/billigste-elselskab' },
  openGraph: {
    title: 'Hvilket elselskab er billigst?',
    description:
      'Find det billigste elselskab ved at sammenligne spotpris, tillæg og gebyrer for dit forbrug. Få en enkel guide, og hent Altid Hjem gratis.',
    url: 'https://altidhjem.dk/billigste-elselskab',
    type: 'article',
  },
}

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: GuideFaq[] = [
  {
    q: 'Hvilket elselskab er billigst?',
    a: [
      'Det afhænger af dit forbrug og den samlede pris inklusive tillæg og gebyrer.',
      'En gebyrfri aftale gør sammenligningen enklere, men du bør altid beregne årsprisen ud fra dit eget forbrug.',
    ],
  },
  {
    q: 'Hvad betyder et gebyrfrit elselskab?',
    a: [
      'Det betyder, at elselskabet ikke opkræver faste gebyrer eller abonnement.',
      'Du betaler fortsat for selve strømmen, nettariffer, elafgift og eventuelle tydeligt oplyste pristillæg.',
    ],
  },
  {
    q: 'Hvorfor er kWh-prisen ikke hele sandheden?',
    a: [
      'Fordi din samlede elpris også indeholder nettariffer, elafgift, tillæg og eventuelle faste gebyrer.',
      'En lav kWh-pris kan derfor ende med at være dyrere, hvis aftalen har et månedligt abonnement eller andre omkostninger.',
    ],
  },
  {
    q: 'Kan jeg skifte elselskab uden problemer?',
    a: [
      'Ja, et skift er normalt enkelt, og dit netselskab samt den fysiske levering af strøm forbliver det samme.',
      'Læs dog bindingsvilkår og opsigelsesbetingelser hos dit nuværende selskab, før du skifter.',
    ],
  },
  {
    q: 'Hvornår er strømmen billigst?',
    a: [
      'Strømmen er billigst i de timer, hvor den aktuelle spotpris er lavest.',
      'Tidspunktet varierer fra dag til dag, så tjek næste døgns timepriser, hvis du har en variabel aftale.',
    ],
  },
  {
    q: 'Hvad er Altid Hjem?',
    a: [
      'Altid Hjem er en dansk app, der samler madplan, strøm, forsikring og økonomi ét sted.',
      'Den er bygget omkring idéen om ét overblik, ét login.',
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

export default function BilligsteElselskab() {
  return (
    <Guide
      title="Hvilket elselskab er billigst?"
      lead={
        <>
          <p>
            Det billigste elselskab afhænger af den samlede pris for dit forbrug. Se på spotpris, tillæg og gebyrer, ikke kun den viste pris pr. kWh.
          </p>
          <p>
            Spotprisen følger markedet, mens elselskabet især kan konkurrere på sit tillæg og sine gebyrer. Et gebyrfrit elselskab gør derfor sammenligningen enklere.
          </p>
        </>
      }
      meta={
        <>
          Opdateret: juli 2026 · Sammenlign selv elprodukter på{' '}
          <a href="https://elpris.dk" target="_blank" rel="noopener noreferrer">
            elpris.dk
          </a>
        </>
      }
      faq={FAQ}
      cta={{
        eyebrow: 'Strøm og overblik i samme app',
        heading: 'Hent Altid Hjem, og følg din strøm time for time',
        subtitle: 'I appen ser du elprisen time for time og kan blive kunde hos Altid Energi, hvis du ikke allerede er det.',
      }}
    >
      <section>
        <h2>Hvad består elprisen egentlig af?</h2>
        <p>
          Din elpris består af spotpris, nettariffer, elafgift samt elselskabets tillæg og gebyrer. Spotprisen bestemmes på elmarkedet, mens nettarifferne betales til dit
          netselskab, og afgifterne fastsættes politisk.
        </p>
        <p>
          Elselskabet kan primært konkurrere på tillæg og gebyrer. Derfor kan to aftaler med samme type spotpris ende med forskellige samlede priser.
        </p>
        <p>
          Når du sammenligner, bør du også undersøge, om prisen ændrer sig efter en introduktionsperiode. Den billigste aftale her og nu er ikke nødvendigvis billigst over
          et helt år.
        </p>
      </section>
      <section>
        <h2>Gebyrerne er den oversete del af elprisen</h2>
        <p>
          Mange elselskaber opkræver et fast månedligt abonnement eller andre faste gebyrer. Beløbene kan se små ud hver for sig, men over et år bliver de til reelle penge,
          især ved et lavt elforbrug.
        </p>
        <p>
          Altid Energi er gebyrfrit og har hverken faste gebyrer eller abonnement. Du betaler stadig for strøm, transport og afgifter, men ikke et fast beløb til Altid
          Energi ved siden af.
        </p>
        <p>
          Se altid prislisten og aftalevilkårene. Kig efter abonnement, betalingsgebyr, tillæg pr. kWh og eventuelle priser, der kun gælder i en begrænset periode.
        </p>
      </section>
      <section>
        <h2>Sådan sammenligner du elselskaber rigtigt</h2>
        <p>
          Tag udgangspunkt i den samlede årspris ved dit eget forventede forbrug. En lav pris pr. kWh kan blive opvejet af et fast abonnement, mens faste gebyrer betyder
          mere for en lille bolig end for et hjem med stort forbrug.
        </p>
        <p>
          Sammenlign samme produkttype og samme periode. Kontrollér også, om beregningen inkluderer transport og afgifter, så du ikke sammenholder en delpris med en samlet
          pris.
        </p>
        <p>
          Eksterne sammenligningssider har i 2026 placeret Altid Energi øverst og omtalt selskabet som Danmarks eneste gebyrfrie elselskab. Det er deres vurdering, og din
          billigste løsning afhænger fortsat af dit forbrug og de aktuelle aftalevilkår.
        </p>
        <GuideFigure
          tone="sky"
          caption="Gebyrerne er den del af elregningen, selskabet selv bestemmer. Hos Altid Energi er de 0 kr. Illustration, ikke et skærmbillede fra appen."
        >
          <GebyrMockup />
        </GuideFigure>
      </section>
      <section>
        <h2>Tidspunktet påvirker også din elpris</h2>
        <p>
          Har du en aftale med variabel timepris, svinger spotprisen gennem døgnet. Du kan ofte reducere din udgift ved at flytte opvask, tøjvask eller opladning til timer
          med lavere spotpris.
        </p>
        <p>
          Det billigste tidspunkt er ikke det samme hver dag. Se, hvordan priserne varierer, i guiden til <A href="/hvornar-er-strommen-billigst">hvornår strømmen er billigst</A>.
        </p>
      </section>
      <section>
        <h2>El er kun én af hjemmets faste udgifter</h2>
        <p>
          En billig elaftale skaber mest værdi, når den indgår i et samlet overblik over hjemmets økonomi. Mobil, forsikring, alarm, opladning og mad kan hver især rumme
          priser eller vilkår, der er værd at gennemgå.
        </p>
        <p>
          Hvis du leder efter et samlet økonomioverblik, kan du læse om <A href="/spiir-alternativ">et alternativ til Spiir</A>. Har du elbil, kan vores guide til{' '}
          <A href="/hvad-koster-en-ladeboks">hvad en ladeboks koster</A> hjælpe dig med at vurdere både køb, installation og løbende aftaler.
        </p>
      </section>
      <section>
        <h2>Hvad Altid Hjem kan i dag</h2>
        <p>Altid Hjem samler madplan, strøm, forsikring og økonomi i én app, så du får ét overblik, ét login.</p>
        <p>
          Altid Energi har mere end 15.000 danske kunder. I appen ser du elprisen time for time, og du kan blive kunde direkte, hvis du ikke allerede er det.
        </p>
        <p>Du kan hente appen gratis i App Store og Google Play.</p>
      </section>
    </Guide>
  )
}
