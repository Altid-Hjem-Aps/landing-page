import type { Metadata } from 'next'
import LadeboksCalculator from '@/components/LadeboksCalculator'
import Guide, { type GuideFaq, GuideApp, GuideFigure, GuideLink as A, GuideSteps } from '@/components/site/Guide'
import { GUIDES } from '@/lib/guides'

// Brought up to the recipe (docs/guide-recipe.md, ALT-1714) on 16 Nov 2026. The price range is
// Konkurrence- og Forbrugerstyrelsen's (December 2023); the extra costs are FDM's. The refusion part
// is rewritten for 2026, when the elafgift is 0,8 øre pr. kWh (Skattestyrelsen).
export const metadata: Metadata = {
  title: 'Hvad koster en ladeboks? Pris med installation | Altid Hjem',
  description:
    '7.500 til 13.000 kroner koster en privat ladeboks typisk med installation, ifølge Konkurrence- og Forbrugerstyrelsen. Gravearbejde kan koste ekstra.',
  alternates: { canonical: 'https://www.altidhjem.dk/hvad-koster-en-ladeboks' },
  openGraph: {
    title: 'Hvad koster en ladeboks?',
    description:
      '7.500 til 13.000 kroner koster en privat ladeboks typisk med installation, ifølge Konkurrence- og Forbrugerstyrelsen. Gravearbejde kan koste ekstra.',
    url: 'https://www.altidhjem.dk/hvad-koster-en-ladeboks',
    type: 'article',
  },
}

const KFST = 'https://kfst.dk/media/qpeh34wc/20231214-konkurrencen-paa-markedet-for-opladning-af-elbiler-a.pdf'
const FDM_INSTALL = 'https://fdm.dk/guides/elbil/saadan-faar-du-installeret-ladeboks-til-elbil-hjemme'
const FDM_LADE = 'https://fdm.dk/vaerd-at-vide/ladeloesninger/hvad-koster-det-at-lade-en-elbil-op-hjemme'
const FDM_2026 = 'https://fdm.dk/nyheder/bilist/2025-11-fra-2026-kan-du-tjene-penge-paa-saette-elbilen-til-opladning'
const BOLIUS = 'https://www.bolius.dk/goer-din-bolig-klar-til-en-elbil-87529'
const TAENK = 'https://taenk.dk/privatoekonomi/biloekonomi/elbil-mette-er-stavnsbundet-til-sin-ladeboks'
const SKAT = 'https://skat.dk/erhverv/afgifter-paa-varer-og-ydelser-punktafgifter/nyhedsbrev-afgifter/midlertidig-nedsaettelse-af-elafgiften-i-2026-og-2027'
const SKAT_REFUSION = 'https://skat.dk/erhverv/afgifter-paa-varer-og-ydelser-punktafgifter/nyhedsbrev-afgifter/udvidet-refusionsordning-for-elafgift-ved-opladning-af-elbiler'
const DST = 'https://www.dst.dk/analyser/56579-husstandenes-elforbrug'
const SPAR_ELPRISER = 'https://sparenergi.dk/privat/elpriser'

// FAQ bruges to steder: synligt på siden og som FAQPage-schema.
const FAQ: GuideFaq[] = [
  {
    q: 'Hvad koster en ladeboks?',
    a: [
      'En privat ladeboks koster typisk 7.500 til 13.000 kroner i anskaffelse og installation, ifølge Konkurrence- og Forbrugerstyrelsen. Prisen er fra december 2023.',
    ],
  },
  {
    q: 'Hvad koster det ekstra, hvis der skal graves?',
    a: [
      'FDM skriver, at fem meter kabel gravet ned fra hus til carport typisk koster 4.500 kroner oven i de øvrige udgifter. Skal der også bruges et jordspyd, kan det for eksempel koste 1.500 kroner.',
    ],
  },
  {
    q: 'Kan det betale sig at leje en ladeboks?',
    a: [
      'Leje giver en lavere udgift fra start, men højere månedlige udgifter, skriver Konkurrence- og Forbrugerstyrelsen. Vil I ud af aftalen, skal boksen tages ned og leveres tilbage, og det koster et gebyr eller en elektriker.',
    ],
  },
  {
    q: 'Får vi stadig refusion af elafgiften, når vi lader elbilen?',
    a: [
      'Kun meget lidt i 2026 og 2027. Elafgiften er sat ned til 0,8 øre pr. kWh, og refusionen går kun ned til EU’s minimumssats for erhverv på 0,4 øre pr. kWh.',
    ],
  },
  {
    q: 'Hvor meget strøm bruger en elbil?',
    a: [
      'Kører I 15.000 km om året i en bil, der bruger 20 kWh pr. 100 km, svarer det til ca. 3.000 kWh om året, regner FDM. Lader I hjemme, kommer det oven i husstandens elforbrug.',
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

export default function HvadKosterEnLadeboks() {
  return (
    <Guide
      title={GUIDES['/hvad-koster-en-ladeboks'].title}
      lead={
        <>
          <p>
            7.500 til 13.000 kroner koster en privat ladeboks typisk i anskaffelse og installation, ifølge Konkurrence- og Forbrugerstyrelsen. Skal der graves fem meter kabel
            ned, kommer der typisk 4.500 kroner oven i, skriver FDM.
          </p>
          <p>I 2026 og 2027 er elafgiften næsten væk, så en serviceaftale med refusion af afgiften giver meget lidt tilbage.</p>
        </>
      }
      meta={
        <>
          Bygger på Konkurrence- og Forbrugerstyrelsen, FDM og Skattestyrelsen · Se{' '}
          <a href={FDM_INSTALL} target="_blank" rel="noopener noreferrer">
            FDM om installation af ladeboks
          </a>
        </>
      }
      answer={{ label: 'Ladeboks med installation', value: '7.500-13.000', unit: 'kr.', note: 'Typisk pris i anskaffelse og installation, ifølge Konkurrence- og Forbrugerstyrelsen (december 2023).' }}
      factors={{ label: 'Det afgør prisen', items: ['Selve ladeboksen', 'Afstand til eltavlen', 'Plads i eltavlen', 'Køb eller leje', 'Serviceaftale'] }}
      faq={FAQ}
      cta={{
        eyebrow: 'Elbilen og elprisen',
        heading: 'Hent Altid Hjem, og hold øje med elprisen',
        subtitle: 'I appen ser I elprisen time for time.',
      }}
      page={{ path: '/hvad-koster-en-ladeboks', description: metadata.description as string, published: GUIDES['/hvad-koster-en-ladeboks'].published, updated: GUIDES['/hvad-koster-en-ladeboks'].updated }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'Konkurrence- og Forbrugerstyrelsen', title: 'Konkurrencen på markedet for opladning af elbiler', href: KFST, note: 'December 2023' },
          { publisher: 'FDM', title: 'Sådan får du installeret ladeboks til elbil hjemme', href: FDM_INSTALL, note: '19. december 2025' },
          { publisher: 'Bolius', title: 'Gør din bolig klar til en elbil', href: BOLIUS, note: 'Ajourført 16. september 2022' },
          { publisher: 'Forbrugerrådet Tænk', title: 'Mette er stavnsbundet til sin ladeboks', href: TAENK, note: '6. marts 2024' },
          { publisher: 'Skattestyrelsen', title: 'Midlertidig nedsættelse af elafgiften i 2026 og 2027', href: SKAT, note: '1. januar 2026' },
          { publisher: 'Skattestyrelsen', title: 'Udvidet refusionsordning for elafgift ved opladning af elbiler', href: SKAT_REFUSION, note: '18. december 2025. Regneeksemplet er egne beregninger på baggrund af data fra Skattestyrelsen og FDM' },
          { publisher: 'FDM', title: 'Fra 2026 kan du tjene penge på at sætte elbilen til opladning', href: FDM_2026, note: '20. november 2025' },
          { publisher: 'FDM', title: 'Hvad koster det at lade en elbil op hjemme?', href: FDM_LADE, note: '12. november 2025' },
          { publisher: 'Danmarks Statistik', title: 'Husstandenes elforbrug', href: DST, note: '11. september 2025' },
          { publisher: 'Sparenergi', title: 'Elpriser time for time', href: SPAR_ELPRISER, note: 'Opdateret 8. januar 2025' },
        ],
      }}
      related={['/fastpris-eller-variabel-el', '/hvornar-er-strommen-billigst', '/gennemsnitligt-elforbrug']}
    >
      <section>
        <h2>Hvad koster en ladeboks med installation?</h2>
        <p>
          En privat ladeboks koster typisk 7.500 til 13.000 kroner i anskaffelse og installation, skriver <A href={KFST}>Konkurrence- og Forbrugerstyrelsen</A> i sin
          undersøgelse af markedet for opladning af elbiler fra december 2023. Knap 70 procent af ejerne af el- og plug-in hybridbiler kan ifølge styrelsen lade hjemme.
        </p>
        <p>
          Mange kan klare sig med en standardinstallation, skriver <A href={FDM_INSTALL}>FDM</A>. Den omfatter montering af ladeboksen, kabel til eltavlen,
          fejlstrømssikring og en ny gruppe i eltavlen på et almindeligt hus.
        </p>
        <p>
          <A href={TAENK}>Forbrugerrådet Tænk</A> har fortalt om en elbilist, der betalte cirka 10.000 kroner for at købe en ladeboks og få den sat op. Bed om et tilbud,
          der viser, hvad standardinstallationen dækker. Så kan I se, hvad der eventuelt kommer oven i, og sammenligne to tilbud på samme grundlag.
        </p>
      </section>
      <section>
        <h2>Hvad gør installationen dyrere?</h2>
        <p>
          Afstanden og eltavlen. Skal der graves fem meter kabel ned fra hus til carport, koster det typisk 4.500 kroner oven i de øvrige udgifter, skriver{' '}
          <A href={FDM_INSTALL}>FDM</A>. I cirka 20 procent af tilfældene skal der også etableres et jordspyd, for eksempel til 1.500 kroner.
        </p>
        <p>
          Er der ikke plads i eltavlen, koster en ny gruppetavle ifølge FDM cirka 2.000 kroner, mens en udvidelse med en ekstra tavle ligger mellem 3.000 og 6.000 kroner.
        </p>
        <p>
          <A href={BOLIUS}>Bolius</A> anbefaler at tale med en autoriseret elinstallatør om, hvad jeres bolig har brug for. En ladeboks på 11 kW kræver ifølge Bolius tre
          faser og 16 ampere.
        </p>
      </section>
      <section>
        <h2>Skal I købe eller leje ladeboksen?</h2>
        <p>
          Hos flere udbydere kan I leje ladeboksen i stedet for at købe den. Det giver en lavere udgift fra start, men højere månedlige udgifter, skriver{' '}
          <A href={KFST}>Konkurrence- og Forbrugerstyrelsen</A>.
        </p>
        <p>
          Vil I ud af en lejeaftale, skal boksen tages ned og leveres tilbage. Det koster enten et nedtagningsgebyr eller en elektriker. <A href={BOLIUS}>Bolius</A> skrev i
          2022, at lejen starter fra 75 kroner om måneden, men en aktuel, uafhængig opgørelse af lejepriserne har vi ikke fundet.
        </p>
        <p>Regn derfor den samlede pris ud over de år, I regner med at have elbilen, og læs vilkårene for opsigelse, før I skriver under.</p>
      </section>
      <section>
        <h2>Kan en serviceaftale med refusion betale sig i 2026?</h2>
        <p>
          Sjældent af hensyn til refusionen. Elafgiften er sat ned til 0,8 øre pr. kWh fra 1. januar 2026 til 31. december 2027, skriver{' '}
          <A href={SKAT}>Skattestyrelsen</A>. Før var den omkring 90 øre, skriver <A href={FDM_2026}>FDM</A>.
        </p>
        <p>
          Ladeoperatører kan få refunderet forskellen mellem den aktuelle elafgift og EU&apos;s minimumssats for erhverv på 0,4 øre pr. kWh, skriver{' '}
          <A href={SKAT_REFUSION}>Skattestyrelsen</A> om refusionen ved opladning af elbiler. Med en afgift på 0,8 øre er der altså højst 0,4 øre pr. kWh at få tilbage.
        </p>
        <p>
          FDM skriver, at nogle udbydere har sat abonnementet ned til 0 kroner om måneden, og at andre har sænket prisen. Har I en serviceaftale, så tjek, hvad I betaler, og
          om I stadig har brug for den.
        </p>
      </section>
      <section>
        <h2>Hvorfor er det svært at skifte udbyder af ladeboks?</h2>
        <p>
          Fordi et skifte ofte betyder en ny ladeboks. <A href={KFST}>Konkurrence- og Forbrugerstyrelsen</A> skriver, at et skifte ofte medfører et skift af hele
          ladeboksen eller som minimum et skiftegebyr. I styrelsens spørgeundersøgelse svarede godt 75 procent af kunderne med abonnement og privat ladeboks, at de ville overveje at skifte udbyder, hvis
          de kunne beholde boksen. Styrelsen anbefaler, at forbrugerne får bedre mulighed for at beholde deres ladeboks.
        </p>
        <p>
          <A href={TAENK}>Forbrugerrådet Tænk</A> skrev i 2024, at de fleste operatører krævede, at kunden købte en helt ny ladeboks af dem for at få en serviceaftale.
          Tjek derfor, om boksen kan bruges med andre udbydere, før I køber.
        </p>
      </section>
      <section>
        <h2>Hvor meget strøm bruger elbilen derhjemme?</h2>
        <p>
          Kører I 15.000 km om året i en bil, der bruger 20 kWh pr. 100 km, svarer det til ca. 3.000 kWh om året før ladetab, regner <A href={FDM_LADE}>FDM</A>. Lader I
          hjemme, bliver det en del af husstandens elforbrug.
        </p>
        <p>
          I hus brugte husstande med elbil 1,9 gange så meget strøm som husstande med benzin- eller dieselbil i 2024, viser <A href={DST}>Danmarks Statistik</A>. Nettariffen er
          højest fra kl. 17 til 21, skriver <A href={SPAR_ELPRISER}>Sparenergi</A>, så lad gerne uden for de timer.
        </p>
        <p>
          Se, <A href="/hvornar-er-strommen-billigst">hvornår strømmen er billigst</A>, eller regn jeres egen månedlige ladeudgift ud i beregneren med jeres egen elpris.
        </p>
        <GuideFigure tone="sky" caption="Eksempel: regn jeres månedlige ladeudgift ud med jeres egne tal. Intet gemmes. Illustration, ikke et skærmbillede fra appen.">
          <LadeboksCalculator />
        </GuideFigure>
      </section>
      <section>
        <h2>Regneeksempel: hvad betyder elbilen for elforbruget?</h2>
        <p>Et eksempel, ikke jeres regning. Det bygger på disse antagelser:</p>
        <ul>
          <li>Bilen kører 15.000 km om året og bruger 20 kWh pr. 100 km, som i FDM&apos;s eksempel.</li>
          <li>Al opladning sker hjemme, og ladetab er ikke regnet med.</li>
          <li>Refusionen er højst 0,4 øre pr. kWh, forskellen mellem elafgiften i 2026 og EU&apos;s minimumssats for erhverv.</li>
        </ul>
        <p>
          Bilen bruger ca. 3.000 kWh om året. Det er ca. 250 kWh om måneden oven i husstandens forbrug. Med højst 0,4 øre pr. kWh i refusion er det abonnementet på en
          serviceaftale, I skal holde øje med, ikke refusionen.
        </p>
      </section>
      <GuideSteps
        title="Tjekliste før I køber ladeboks"
        steps={[
          'Bed om et skriftligt tilbud, der viser, hvad standardinstallationen dækker, og hvad gravearbejde og eltavle koster ekstra.',
          'Sammenlign køb med leje over hele den tid, I regner med at have elbilen.',
          'Tjek, om boksen kan bruges med andre udbydere, hvis I senere vil skifte.',
          'Har I en serviceaftale, så tjek abonnementet. Refusionen af elafgiften er næsten ingenting i 2026 og 2027.',
        ]}
      />
      <section>
        <h2>Hvordan kan Altid Hjem hjælpe?</h2>
        <p>
          Med en elbil i indkørslen betaler det sig at vide, hvornår strømmen er billig. Altid Hjem samler madplan, strøm, forsikring og økonomi i én app, så I får ét
          overblik, ét login.
        </p>
        <p>
          I appen ser I elprisen time for time, og med Altid Energi følger I også elforbruget pr. dag, uge og måned. I kan hente appen gratis i App Store og Google Play.
        </p>
        <p>
          Altid Hjem er bygget af holdet bag elleverandøren Altid Energi. Denne guide bygger på Konkurrence- og Forbrugerstyrelsen, FDM, Skattestyrelsen og Danmarks
          Statistik, ikke på vores egne priser.
        </p>
        <GuideApp
          tone="sky"
          src="/site/app/energi-home.webp"
          alt="Energi i Altid Hjem: elprisen lige nu, priserne time for time med den billigste time markeret, og forbruget de seneste tre måneder"
          caption="I appen: elprisen time for time med den billigste time markeret, og husstandens forbrug de seneste måneder."
        />
      </section>
    </Guide>
  )
}
