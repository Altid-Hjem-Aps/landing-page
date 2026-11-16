import type { Metadata } from 'next'
import Guide, { type GuideFaq, GuideApp, GuideLink as A, GuideSteps } from '@/components/site/Guide'

// Built by the recipe (docs/guide-recipe.md, ALT-1714), topic approved by Thor on 16 Nov 2026. There
// is no single number that answers the question, so the answer card states Forbrugerrådet Tænk's
// assessment, and the page gives the official facts behind both kinds of agreement.
export const metadata: Metadata = {
  title: 'Fastpris eller variabel elaftale? | Altid Hjem',
  description:
    'For de fleste er en variabel elaftale billigst over tid, vurderer Forbrugerrådet Tænk. Se forskellen, og hvad det koster at komme ud af en fastpris.',
  alternates: { canonical: 'https://www.altidhjem.dk/fastpris-eller-variabel-el' },
  openGraph: {
    title: 'Fastpris eller variabel elaftale?',
    description:
      'For de fleste er en variabel elaftale billigst over tid, vurderer Forbrugerrådet Tænk. Se forskellen, og hvad det koster at komme ud af en fastpris.',
    url: 'https://www.altidhjem.dk/fastpris-eller-variabel-el',
    type: 'article',
  },
}

const FST = 'https://forsyningstilsynet.dk/Media/638387451314241652/2022-elprisunders%C3%B8gelse.PDF'
const TAENK = 'https://taenk.dk/forbrugerliv/bolig/skal-du-vaelge-fast-eller-variabel-elpris'
const SPAR_ELPRISER = 'https://sparenergi.dk/privat/elpriser'
const SPAR_REGNING = 'https://sparenergi.dk/privat/forstaa-din-elregning'
const SKAT = 'https://skat.dk/erhverv/afgifter-paa-varer-og-ydelser-punktafgifter/nyhedsbrev-afgifter/midlertidig-nedsaettelse-af-elafgiften-i-2026-og-2027'
const SKM = 'https://svmn.dk/media/jm3bwwyj/faktaark-om-lempelse-af-elafgift.pdf'
const BEK = 'https://www.retsinformation.dk/eli/lta/2025/1810/pdf'
const ENERGINET = 'https://www.energinet.dk/media/5v3pikp3/energinets_tarifkatalog_2026.pdf'

// FAQ bruges to steder: synligt på siden og som FAQPage-schema.
const FAQ: GuideFaq[] = [
  {
    q: 'Er fastpris eller variabel elaftale billigst?',
    a: [
      'For de fleste forbrugere vil en variabel elaftale være det billigste valg over tid, vurderer Forbrugerrådet Tænk.',
      'Forsyningstilsynet skriver, at elprodukter med fast pris generelt har en højere pris end et tilsvarende produkt uden fast pris, fordi fastprisen er en slags forsikring mod stigende priser.',
    ],
  },
  {
    q: 'Hvad er forskellen på fastpris og variabel elpris?',
    a: [
      'Med en variabel elpris kender I ikke prisen på forhånd, for den følger prisen på engrosmarkedet. Med fastpris er prisen for strømmen låst i en periode, fra en måned og op til tre år.',
    ],
  },
  {
    q: 'Kan man få en fast samlet elpris?',
    a: [
      'Nej. Ifølge Forbrugerrådet Tænk kan I ikke låse den samlede elpris, fordi nettariffen varierer over døgnet. Fastprisen gælder kun selve strømmen fra elleverandøren.',
    ],
  },
  {
    q: 'Koster det noget at opsige en fastprisaftale?',
    a: [
      'Det kan det. Elleverandøren må kun opkræve et gebyr, hvis I selv opsiger en fastprisaftale, før den udløber, og gebyret må ikke være højere end leverandørens direkte tab.',
    ],
  },
  {
    q: 'Hvordan ser vi, hvilken elaftale vi har?',
    a: [
      'Ifølge Sparenergi har I normalt en variabel timepris, hvis elregningen skriver flexpris, spotpris eller lignende.',
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

export default function FastprisEllerVariabelEl() {
  return (
    <Guide
      title="Fastpris eller variabel elaftale?"
      lead={
        <>
          <p>
            For de fleste vil en variabel elaftale være det billigste valg over tid, vurderer Forbrugerrådet Tænk. En fastpris er en slags forsikring mod stigende elpriser,
            men den har generelt en højere pris, skriver Forsyningstilsynet.
          </p>
          <p>Uanset aftalen kan I ikke låse hele elregningen: Nettariffen og afgifterne følger ikke med i fastprisen.</p>
        </>
      }
      meta={
        <>
          Bygger på Forsyningstilsynet, Forbrugerrådet Tænk og Sparenergi · Se{' '}
          <a href={SPAR_REGNING} target="_blank" rel="noopener noreferrer">
            Sparenergis forklaring af elregningen
          </a>
        </>
      }
      answer={{
        label: 'Forbrugerrådet Tænks vurdering',
        value: 'Variabel er billigst for de fleste over tid',
        note: 'Fastpris giver en kendt pris for strømmen, men koster typisk mere, skriver Forsyningstilsynet.',
      }}
      factors={{ label: 'Det skal I overveje', items: ['Risiko for stigninger', 'Binding', 'Gebyr ved opsigelse', 'Nettarif om aftenen', 'Jeres forbrug'] }}
      faq={FAQ}
      cta={{
        eyebrow: 'Elprisen time for time',
        heading: 'Hent Altid Hjem, og hold øje med elprisen',
        subtitle: 'I appen ser I elprisen time for time.',
      }}
      page={{ path: '/fastpris-eller-variabel-el', description: metadata.description as string, published: '2026-11-16', updated: '2026-11-16' }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'Forsyningstilsynet', title: 'Hvad kostede strømmen i 2022? Prisundersøgelse af elprodukter til private og mindre virksomheder', href: FST, note: 'Juli 2023' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Elaftale med fast elpris giver ikke den tryghed, den lover', href: TAENK, note: '22. september 2026' },
          { publisher: 'Sparenergi', title: 'Elpriser time for time', href: SPAR_ELPRISER, note: 'Opdateret 8. januar 2025' },
          { publisher: 'Sparenergi', title: 'Forstå din elregning, og få hjælp til at skifte elselskab', href: SPAR_REGNING, note: 'Opdateret 8. januar 2026' },
          { publisher: 'Skattestyrelsen', title: 'Midlertidig nedsættelse af elafgiften i 2026 og 2027', href: SKAT, note: '1. januar 2026' },
          { publisher: 'Skatteministeriet', title: 'Faktaark: Lempelse af den almindelige elafgift', href: SKM, note: 'Regneeksemplet er egne beregninger på baggrund af data fra Skatteministeriet' },
          { publisher: 'Energinet', title: 'Tarifkatalog 2026', href: ENERGINET },
          { publisher: 'Retsinformation', title: 'Bekendtgørelse om elhandelsvirksomhedernes opgaver og forpligtelser i forbindelse med levering af elektricitet til elkunder', href: BEK, note: 'Nr. 1810 af 29. december 2025, gældende fra 1. januar 2026' },
        ],
      }}
      related={['/billigste-elselskab', '/hvornar-er-strommen-billigst', '/gennemsnitligt-elforbrug']}
    >
      <section>
        <h2>Hvad er forskellen på fastpris og variabel elpris?</h2>
        <p>
          Med en variabel elpris kender I ikke prisen på forhånd, fordi den afhænger af prisen på engrosmarkedet, skriver <A href={FST}>Forsyningstilsynet</A>. Har I en
          variabel timepris, kan prisen skifte fra time til time, forklarer <A href={SPAR_ELPRISER}>Sparenergi</A>.
        </p>
        <p>
          Med en fastprisaftale er prisen for selve strømmen låst i en periode, for eksempel en måned, tre måneder eller et år, skriver{' '}
          <A href={TAENK}>Forbrugerrådet Tænk</A>. Ifølge Forsyningstilsynet kan prisen være fast i op til tre år.
        </p>
        <p>
          Forsyningstilsynet kalder fastprisen en slags forsikring mod en stigning i elprisen. Falder engrosprisen, får I til gengæld ikke gavn af prisfaldet.
        </p>
      </section>
      <section>
        <h2>Er fastpris dyrere end variabel?</h2>
        <p>
          Typisk ja. Forsyningstilsynet skriver, at elprodukter med en fast pris generelt, alt andet lige, har en højere pris end et tilsvarende produkt uden fast pris.
          Forsikringen mod stigninger koster altså noget.
        </p>
        <p>
          Forbrugerrådet Tænk har i starten af 2026 gennemgået 1.500 elregninger og vurderer, at regningen i sidste ende bliver højere med en fastprisaftale. For de fleste
          forbrugere vil en variabel elaftale ifølge Tænk være det billigste valg over tid.
        </p>
        <p>
          Tænk skriver også, at en elaftale med fastpris ikke giver den tryghed, den lover, fordi I aldrig kan låse hele elregningen. Det kommer vi til herunder.
        </p>
      </section>
      <section>
        <h2>Hvor mange har variabel elpris?</h2>
        <p>
          De fleste. I Forsyningstilsynets prisundersøgelse for 2022 udgjorde de variable produkter 66 procent af den solgte strøm til private og mindre virksomheder.
          Kvartalsprodukter udgjorde 30 procent, og fastprisprodukter de sidste 4 procent. Omkring to ud af tre kWh blev altså solgt på en variabel aftale.
        </p>
        <p>
          Samme år skiftede ca. 8,4 procent af forbrugerne elleverandør, skriver Forsyningstilsynet. Tallene er de nyeste i Forsyningstilsynets undersøgelse og måler, hvor
          meget strøm der blev solgt, ikke hvor mange husstande der har hver type aftale.
        </p>
      </section>
      <section>
        <h2>Kan man låse hele elregningen?</h2>
        <p>
          Nej. Ifølge Forbrugerrådet Tænk kan I ikke få en fast samlet elpris, fordi nettariffen varierer over døgnet. Fastprisen gælder kun selve strømmen.
        </p>
        <p>
          Ifølge <A href={SPAR_REGNING}>Sparenergi</A> sætter netselskabet nettariffen, og den er højest fra klokken 17 til 21. Elleverandøren sætter elprisen og
          elabonnementet, og der skal betales moms af alle posterne.
        </p>
        <p>
          Energinets egne tariffer ligger ifølge <A href={ENERGINET}>Energinets tarifkatalog</A> på 11,5 øre pr. kWh i 2026, uden moms. Dertil kommer et systemabonnement på
          187 kroner om året for hvert målepunkt. Begge dele gælder, uanset hvilken elaftale I har.
        </p>
      </section>
      <section>
        <h2>Hvorfor er elregningen lavere i 2026?</h2>
        <p>
          Elafgiften er sat ned til 0,8 øre pr. kWh fra 1. januar 2026 til 31. december 2027, skriver <A href={SKAT}>Skattestyrelsen</A>. Ifølge{' '}
          <A href={SKM}>Skatteministeriets faktaark</A> ville afgiften ellers have været 72,7 øre pr. kWh i 2026, så nedsættelsen er på 71,9 øre.
        </p>
        <p>
          Afgiften er den samme, uanset om I har fastpris eller variabel pris. Den gør regningen lavere for alle, men ændrer ikke på, hvilken af de to aftaler der er
          billigst.
        </p>
      </section>
      <section>
        <h2>Koster det noget at komme ud af en fastprisaftale?</h2>
        <p>
          Det kan det. Ifølge <A href={BEK}>bekendtgørelsen</A>, der gælder fra 1. januar 2026, må elleverandøren kun opkræve et gebyr, hvis I frivilligt opsiger en
          fastprisaftale, før den udløber. Gebyret skal være forholdsmæssigt og må ikke være højere end leverandørens direkte økonomiske tab.
        </p>
        <p>
          Gebyret skal også stå i aftalen, og I skal have fået det at vide, før I indgik aftalen. Tjek derfor udløbsdatoen og opsigelsesvilkårene i jeres aftale, før I
          skifter, så I ved, om der kommer et gebyr.
        </p>
        <p>
          Bekendtgørelsen kræver også, at elleverandører med mere end 200.000 kunder tilbyder fastprisaftaler på mindst et år. Har I en fastprisaftale, kan I bruge
          udløbsdatoen som en påmindelse om at sammenligne igen.
        </p>
      </section>
      <section>
        <h2>Hvordan ser I, hvilken aftale I har?</h2>
        <p>
          Kig på elregningen. Ifølge <A href={SPAR_ELPRISER}>Sparenergi</A> har I normalt en variabel timepris, hvis regningen skriver flexpris, spotpris eller lignende.
          Det står dog ikke altid tydeligt, så spørg elleverandøren, hvis I er i tvivl.
        </p>
        <p>
          Sparenergi skriver også, at strøm er billigere på visse tidspunkter af døgnet, uanset om I har fast eller variabel timepris. Nettariffen er for eksempel højest
          fra klokken 17 til 21.
        </p>
      </section>
      <section>
        <h2>Regneeksempel: hvad betyder elafgiften for en husstand?</h2>
        <p>Et eksempel, ikke jeres regning. Det bygger på disse antagelser:</p>
        <ul>
          <li>Husstanden bruger 4.000 kWh om året.</li>
          <li>Elafgiften er 71,9 øre lavere pr. kWh, end den ellers ville have været i 2026.</li>
          <li>Der er 25 procent moms oven i.</li>
        </ul>
        <p>
          4.000 kWh gange 71,9 øre er 2.876 kroner, og med moms 3.595 kroner om året. Det passer med Skatteministeriets eget eksempel på ca. 3.600 kroner om året for en
          husholdning med 4.000 kWh. Beløbet er det samme med fastpris og variabel pris.
        </p>
      </section>
      <GuideSteps
        title="Tjekliste før I vælger elaftale"
        steps={[
          'Find ud af, hvilken aftale I har i dag. Står der flexpris eller spotpris på regningen, er den normalt variabel.',
          'Har I fastpris, så tjek udløbsdatoen, og om der er et gebyr, hvis I opsiger før tid.',
          'Overvej, om I vil betale for en kendt pris på strømmen, eller om I kan leve med, at prisen svinger fra time til time.',
          'Flyt gerne vaskemaskine, opvaskemaskine og opladning væk fra klokken 17 til 21, hvor nettariffen er højest. Det gælder for begge aftaler.',
        ]}
      />
      <section>
        <h2>Hvordan kan Altid Hjem hjælpe?</h2>
        <p>
          Med en variabel elpris betaler det sig at vide, hvornår strømmen er billig. Altid Hjem samler madplan, strøm, forsikring og økonomi i én app, så I får ét overblik,
          ét login.
        </p>
        <p>
          I appen ser I elprisen time for time, og med Altid Energi følger I også elforbruget pr. dag, uge og måned. I kan hente appen gratis i App Store og Google Play.
        </p>
        <p>
          Altid Hjem er bygget af holdet bag elleverandøren Altid Energi. Denne guide bygger på Forsyningstilsynet, Forbrugerrådet Tænk, Sparenergi og myndighedernes egne
          tal, ikke på vores egne priser.
        </p>
        <GuideApp tone="sky" src="/site/app/energi-home.webp" alt="Energi i Altid Hjem: elprisen lige nu, priserne time for time og forbruget de seneste tre måneder" caption="I appen: elprisen time for time og husstandens forbrug de seneste måneder." />
      </section>
    </Guide>
  )
}
