import type { Metadata } from 'next'
import SkiftTjeklisteMockup from '@/components/SkiftTjeklisteMockup'
import Guide, { GuideFigure, GuideLink as A, type GuideFaq } from '@/components/site/Guide'

export const metadata: Metadata = {
  title: 'Skift forsikringsselskab sikkert | Altid Hjem',
  description:
    'Skift forsikringsselskab i den rigtige rækkefølge. Få styr på opsigelse, dækning og selvrisiko, og hent Altid Hjem gratis.',
  alternates: { canonical: 'https://altidhjem.dk/skift-forsikringsselskab' },
  openGraph: {
    title: 'Sådan skifter du forsikringsselskab',
    description:
      'Skift forsikringsselskab i den rigtige rækkefølge. Få styr på opsigelse, dækning og selvrisiko, og hent Altid Hjem gratis.',
    url: 'https://altidhjem.dk/skift-forsikringsselskab',
    type: 'article',
  },
}

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: GuideFaq[] = [
  {
    q: 'Hvordan skifter jeg forsikringsselskab?',
    a: [
      'Indhent og acceptér først en ny forsikring, og få startdatoen bekræftet, før den gamle opsiges.',
      'Kontrollér bagefter, at ophørsdato og startdato passer sammen.',
    ],
  },
  {
    q: 'Kan det nye selskab opsige min gamle forsikring?',
    a: [
      'Ja, mange forsikringsselskaber tilbyder at håndtere opsigelsen ved et skift.',
      'Spørg det nye selskab, om de gør det, og bed om skriftlig bekræftelse på datoen.',
    ],
  },
  {
    q: 'Hvornår kan jeg opsige min forsikring?',
    a: [
      'Efter det første år kan de fleste private forsikringer typisk opsiges med løbende måned plus en måned.',
      'Vilkårene varierer, så tjek altid opsigelsesfristen i din egen police.',
    ],
  },
  {
    q: 'Kan jeg stå uden dækning i skiftet?',
    a: [
      'Ja, hvis den gamle police ophører, før den nye træder i kraft.',
      'Du forebygger et hul ved at få den nye police og startdato bekræftet, inden den gamle forsikring opsiges.',
    ],
  },
  {
    q: 'Mister jeg min anciennitet, når jeg skifter?',
    a: [
      'Det afhænger af forsikringen og selskabets regler.',
      'Nogle fordele eller skadefri perioder kan følge med, mens andre ikke gør, så spørg begge selskaber og få svaret skriftligt.',
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
      'Nej, appen er gratis at hente, og det er gratis at oprette sig.',
      'Du betaler kun for det, du selv vælger at bruge, for eksempel strøm fra Altid Energi, hvis du bliver kunde.',
    ],
  },
]

export default function SkiftForsikringsselskab() {
  return (
    <Guide
      title="Sådan skifter du forsikringsselskab"
      lead={
        <>
          <p>
            At skifte forsikringsselskab er enklere, end mange tror. Det nye selskab kan ofte stå for opsigelsen, men få altid den nye police bekræftet, før den gamle ophører.
          </p>
          <p>
            Den rigtige rækkefølge beskytter dig mod huller i dækningen og unødige dobbeltperioder. Sammenlign både dækning, selvrisiko, tilvalg og pris, før du beslutter dig.
          </p>
        </>
      }
      meta={
        <>
          Opdateret: juli 2026 · Sammenlign selv på{' '}
          <a href="https://www.forsikringsguiden.dk" target="_blank" rel="noopener noreferrer">
            Forsikringsguiden.dk
          </a>
        </>
      }
      faq={FAQ}
      cta={{
        eyebrow: 'Alle jeres forsikringer ét sted',
        heading: 'Hent Altid Hjem, og saml jeres forsikringer, før I skifter',
        subtitle: 'Skriv jeres forsikringer, priser og fornyelser ind i appen, så har I dem samlet ét sted.',
      }}
    >
      <section>
        <h2>Hvornår kan du skifte forsikringsselskab?</h2>
        <p>
          Efter det første år kan de fleste private forsikringer typisk opsiges med løbende måned plus en måned. Fristen afhænger dog af din police og selskabets vilkår, så
          kontrollér altid den konkrete opsigelsesfrist.
        </p>
        <p>
          Du kan godt undersøge alternativer, før opsigelsesfristen nærmer sig. Bed det nye selskab oplyse en præcis startdato, så den passer med ophøret hos dit nuværende
          selskab.
        </p>
        <p>
          Nogle aftaler kan have særlige regler, gebyrer eller længere varsler. Det er derfor policen, og ikke en generel tommelfingerregel, der afgør, hvornår dit skift kan
          gennemføres.
        </p>
      </section>
      <section>
        <h2>Brug en rækkefølge, der beskytter dig</h2>
        <p>
          Begynd med at indhente et tilbud, hvor dækninger, selvrisici og startdato står skriftligt. Acceptér først tilbuddet, når du har kontrolleret, at det dækker det, du
          faktisk har brug for.
        </p>
        <p>Få derefter den nye police og startdato bekræftet. Først når den nye dækning er på plads, bør den gamle forsikring opsiges.</p>
        <p>
          Mange nye selskaber tilbyder at klare opsigelsen for dig. Bed om en skriftlig bekræftelse, og kontrollér både ophørsdatoen på den gamle police og startdatoen på den
          nye.
        </p>
      </section>
      <section>
        <h2>Sammenlign mere end prisen</h2>
        <p>
          To forsikringer med samme navn kan dække meget forskelligt. Sammenlign blandt andet dækningssummer, selvrisiko, undtagelser, tilvalg og regler for erstatning.
        </p>
        <p>
          Ved indboforsikring bør du eksempelvis kontrollere dækning ved tyveri, vandskade, elektronikskader og ansvar. Du kan læse mere om prisniveauer og forskelle i guiden
          til <A href="/hvad-koster-indboforsikring">hvad en indboforsikring koster</A>.
        </p>
        <p>
          Se også på husstandens samlede behov, ikke kun én police ad gangen. Vores guide til <A href="/hvad-koster-forsikring">hvad forsikring koster</A> hjælper dig med at
          vurdere pris i forhold til profil og dækning.
        </p>
        <GuideFigure tone="mint" caption="Rækkefølgen beskytter dig: ny police på plads, før den gamle opsiges. Illustration, ikke et skærmbillede fra appen.">
          <SkiftTjeklisteMockup />
        </GuideFigure>
      </section>
      <section>
        <h2>Undgå de typiske fælder</h2>
        <p>
          En kort dobbeltperiode kan være praktisk, hvis datoerne ellers ikke kan mødes. En lang dobbeltperiode betyder derimod, at du risikerer at betale for to policer uden
          at få tilsvarende ekstra værdi.
        </p>
        <p>
          Kontrollér også tilvalg, som let bliver glemt i et pristilbud. En lavere pris kan skyldes, at eksempelvis elektronik, udvidet rejse eller særlige genstande ikke
          længere er dækket på samme måde.
        </p>
        <p>
          Samlerabat kan gøre en samlet løsning billigere, men den kan også gøre det sværere at gennemskue prisen på hver forsikring. Undersøg derfor, hvad der sker med
          rabatten, hvis du senere flytter én police.
        </p>
      </section>
      <section>
        <h2>Tjekliste til et sikkert skift</h2>
        <p>1. Find dine nuværende policer, seneste opkrævninger og opsigelsesfrister.</p>
        <p>2. Beskriv den dækning, du ønsker, og indhent sammenlignelige tilbud.</p>
        <p>3. Kontrollér selvrisiko, undtagelser, tilvalg, rabatter og den samlede pris.</p>
        <p>4. Vælg det nye selskab, og få police samt startdato bekræftet skriftligt.</p>
        <p>5. Opsig den gamle forsikring selv, eller bekræft, at det nye selskab gør det.</p>
        <p>6. Kontrollér de endelige datoer og gem dokumentationen for begge aftaler.</p>
      </section>
      <section>
        <h2>Hvad Altid Hjem kan i dag</h2>
        <p>Altid Hjem samler madplan, strøm, forsikring og økonomi i én app, så du får ét overblik, ét login.</p>
        <p>Skriv jeres forsikringer, priser og fornyelser ind i appen, så har I dem samlet ét sted. I kan hente den gratis i App Store og Google Play.</p>
        <p>Bag Altid Hjem står teamet bag Altid Energi, Danmarks første gebyrfrie energiselskab, der har mere end 15.000 danskere som kunder.</p>
      </section>
    </Guide>
  )
}
