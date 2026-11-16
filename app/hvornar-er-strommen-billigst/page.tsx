import type { Metadata } from 'next'
import { getElpriser, getNetselskaber, currentCopenhagenHour } from '@/lib/elpriser'
import ElprisChart from '@/components/ElprisChart'
import Guide, { type GuideFaq, GuideApp, GuideFigure, GuideLink as A, GuideSteps } from '@/components/site/Guide'

// Brought up to the recipe (docs/guide-recipe.md, ALT-1714) on 16 Nov 2026. The hours in the text are
// our own averages of Energinet's day-ahead prices for October 2026; the live chart keeps its own
// data from Strømligning.
export const metadata: Metadata = {
  title: 'Hvornår er strømmen billigst? Se elprisen time for time | Altid Hjem',
  description:
    'Strømmen er typisk billigst om natten og midt på dagen og dyrest fra kl. 17 til 21. Se elprisen time for time i DK1 og DK2 i grafen.',
  alternates: { canonical: 'https://www.altidhjem.dk/hvornar-er-strommen-billigst' },
  openGraph: {
    title: 'Hvornår er strømmen billigst?',
    description:
      'Strømmen er typisk billigst om natten og midt på dagen og dyrest fra kl. 17 til 21. Se elprisen time for time i DK1 og DK2 i grafen.',
    url: 'https://www.altidhjem.dk/hvornar-er-strommen-billigst',
    type: 'article',
    locale: 'da_DK',
    siteName: 'Altid Hjem',
  },
}

// Day-ahead-priserne ændrer sig én gang i døgnet (~kl. 13): 30 min cache er
// rigeligt friskt og holder os langt under Strømlignings rate limit.
export const revalidate = 1800

const EDS = 'https://www.energidataservice.dk/tso-electricity/DayAheadPrices'
const SPAR_ELPRISER = 'https://sparenergi.dk/privat/elpriser'
const SPAR_REGNING = 'https://sparenergi.dk/privat/forstaa-din-elregning'
const FDM_LADE = 'https://fdm.dk/vaerd-at-vide/ladeloesninger/hvad-koster-det-at-lade-en-elbil-op-hjemme'
const BOLIUS_ELBIL = 'https://www.bolius.dk/goer-din-bolig-klar-til-en-elbil-87529'
const STROMLIGNING = 'https://stromligning.dk'

// FAQ bruges to steder: synligt på siden og som FAQPage-schema.
const FAQ: GuideFaq[] = [
  {
    q: 'Hvornår er strømmen billigst?',
    a: [
      'Typisk om natten og midt på dagen, når der produceres vind- og solenergi. I oktober 2026 var spotprisen i gennemsnit lavest fra kl. 12 til 15 i både DK1 og DK2.',
      'Mønstret skifter fra dag til dag, så tjek dagens priser i grafen.',
    ],
  },
  {
    q: 'Hvornår er strømmen dyrest?',
    a: [
      'Typisk fra kl. 17 til 21, når mange bruger strøm på samme tid. Nettariffen er også højest i de timer, skriver Sparenergi.',
    ],
  },
  {
    q: 'Hvad er forskellen på DK1 og DK2?',
    a: [
      'Danmark er delt i to prisområder ved Storebælt. DK1 er Vestdanmark, og DK2 er Østdanmark, og prisen kan være forskellig i de to områder.',
    ],
  },
  {
    q: 'Hvornår kommer elpriserne for i morgen?',
    a: [
      'Midt på dagen. Energinet råder til at hente morgendagens priser mellem kl. 13 og 14. Når de er klar, kan I se dem under "I morgen" i grafen.',
    ],
  },
  {
    q: 'Kan elprisen blive negativ?',
    a: [
      'Ja, spotprisen kan. I oktober 2026 var den negativ i 12 kvarter i DK1 og i ingen i DK2. Nettarif og elafgift betaler I stadig.',
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

export default async function HvornarErStrommenBilligst() {
  const [data, netselskaber] = await Promise.all([getElpriser(), getNetselskaber()])
  const nowHour = currentCopenhagenHour()

  return (
    <Guide
      title="Hvornår er strømmen billigst?"
      lead={
        <>
          <p>
            Strømmen er typisk billigst om natten og midt på dagen og dyrest fra kl. 17 til 21. I oktober 2026 var spotprisen i både DK1 og DK2 i gennemsnit lavest fra kl. 12
            til 15, viser vores egne beregninger på Energinets data.
          </p>
          <p>Nettariffen er også højest fra kl. 17 til 21. Se dagens elpriser time for time i grafen herunder.</p>
        </>
      }
      meta={
        <>
          Bygger på Energinet og Sparenergi · Grafen bruger data fra{' '}
          <a href={STROMLIGNING} target="_blank" rel="noopener noreferrer">
            Strømligning
          </a>
        </>
      }
      answer={{ label: 'Typisk billigst', value: 'Om natten og midt på dagen', note: 'Spotprisen og nettariffen er typisk højest fra kl. 17 til 21.' }}
      factors={{ label: 'Det afgør prisen', items: ['Vind og sol', 'Forbruget i timen', 'Nettariffen', 'DK1 eller DK2', 'Årstiden'] }}
      faq={FAQ}
      cta={{
        eyebrow: 'Elprisen time for time',
        heading: 'Hent Altid Hjem, og hold øje med elprisen',
        subtitle: 'I appen ser I elprisen time for time.',
      }}
      page={{ path: '/hvornar-er-strommen-billigst', description: metadata.description as string, published: '2026-06-25', updated: '2026-11-16' }}
      sources={{
        checked: '2026-11-16',
        items: [
          { publisher: 'Energinet', title: 'Energi Data Service: Day-Ahead Prices', href: EDS, note: 'Priser for DK1 og DK2 pr. kvarter, oktober 2026. Timerne og de negative priser er egne beregninger på baggrund af data fra Energinet' },
          { publisher: 'Sparenergi', title: 'Elpriser time for time', href: SPAR_ELPRISER, note: 'Opdateret 8. januar 2025' },
          { publisher: 'Sparenergi', title: 'Forstå din elregning, og få hjælp til at skifte elselskab', href: SPAR_REGNING, note: 'Opdateret 8. januar 2026' },
          { publisher: 'FDM', title: 'Hvad koster det at lade en elbil op hjemme?', href: FDM_LADE, note: '12. november 2025. Regneeksemplet er egne beregninger på baggrund af data fra FDM og Bolius' },
          { publisher: 'Bolius', title: 'Gør din bolig klar til en elbil', href: BOLIUS_ELBIL, note: 'Ajourført 16. september 2022' },
          { publisher: 'Strømligning', title: 'Sammenlign elpriser og elselskaber på pris og vilkår', href: STROMLIGNING, note: 'Data til grafen med dagens og morgendagens priser' },
        ],
      }}
      related={['/fastpris-eller-variabel-el', '/billigste-elselskab', '/gennemsnitligt-elforbrug']}
    >
      <section>
        <h2>Hvad koster strømmen time for time i dag?</h2>
        <p>
          Grafen viser dagens elpriser time for time. Vælg Vestdanmark, DK1, eller Østdanmark, DK2, og jeres netselskab, så transporten passer til jeres adresse. I kan slå
          elafgift, Energinets tariffer og moms til og fra.
        </p>
        {data ? (
          <GuideFigure tone="sand" kind="data" caption="Tal fra Strømligning, med spotpriser fra Energinet: elprisen time for time i dag og, når priserne er ude, i morgen.">
            {/* ElprisChart returns two siblings (the key figures and the chart card). The wrapper
                keeps them stacked in the figure's flex row, fills the card, and may shrink below
                the chart's nowrap hour labels (min-width 0), or a phone would cut the chart off. */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <ElprisChart data={data} nowHour={nowHour} netselskaber={netselskaber} />
            </div>
          </GuideFigure>
        ) : (
          <p>
            De aktuelle priser kan ikke hentes lige nu. Prøv igen om lidt. Mønstret herunder gælder dog de fleste dage: billigst om natten og midt på dagen, dyrest fra kl. 17
            til 21.
          </p>
        )}
        <p>
          Når morgendagens priser er klar, kan I skifte mellem &ldquo;I dag&rdquo; og &ldquo;I morgen&rdquo; i grafen. Jeres elleverandørs tillæg og abonnement er ikke
          med i priserne.
        </p>
      </section>
      <section>
        <h2>Hvornår på døgnet er strømmen billigst?</h2>
        <p>
          Strøm er typisk billigst og grønnest, når der produceres vind- og solenergi, og dyrest, når vi alle sammen bruger strøm, skriver{' '}
          <A href={SPAR_ELPRISER}>Sparenergi</A>.
        </p>
        <p>
          Vi har regnet gennemsnittet ud for hver time i oktober 2026 med <A href={EDS}>Energinets priser</A>. I både DK1 og DK2 var spotprisen lavest fra kl. 12 til 15 og
          også lav omkring kl. 2 om natten. Den var højest fra kl. 17 til 21, og prisen var også høj omkring kl. 8 om morgenen.
        </p>
        <p>
          Det er et gennemsnit for én måned. Nogle dage er strømmen billigst om natten, andre dage midt på dagen. Spotprisen kan også blive negativ. I oktober 2026 skete det
          i 12 kvarter i DK1 og i ingen i DK2.
        </p>
      </section>
      <section>
        <h2>Hvorfor er strømmen dyrest fra klokken 17 til 21?</h2>
        <p>
          Fordi mange bruger strøm på samme tid i den såkaldte kogespids om aftenen. Samtidig er nettariffen højest. Ifølge <A href={SPAR_ELPRISER}>Sparenergi</A> har
          transporten af strøm tre niveauer:
        </p>
        <ul>
          <li>Lavlast fra kl. 0 til 6, hvor den er billigst.</li>
          <li>Højlast fra kl. 6 til 17 og fra kl. 21 til 24.</li>
          <li>Spidslast fra kl. 17 til 21, hvor den er dyrest.</li>
        </ul>
        <p>
          Nettariffen er også højere om vinteren, fra oktober til marts. Strømmen er derfor billigere på visse tidspunkter af døgnet, uanset om I har fast eller variabel
          timepris, skriver Sparenergi. Netselskabet sætter nettariffen, og der er moms oven i, skriver <A href={SPAR_REGNING}>Sparenergi</A> i sin forklaring af
          elregningen.
        </p>
      </section>
      <section>
        <h2>Hvad er forskellen på DK1 og DK2?</h2>
        <p>
          Danmark er delt i to prisområder ved Storebælt, skriver <A href={EDS}>Energinet</A>. DK1 ligger vest for Storebælt, og DK2 ligger øst for. Jylland og Fyn ligger
          altså i DK1, og Sjælland ligger i DK2. Prisen bliver sat for hvert område for sig, så den kan være forskellig.
        </p>
        <p>
          I oktober 2026 fulgte de to områder det samme mønster over døgnet, men gennemsnitspriserne var ikke helt de samme. Vælg derfor det område, I bor i, når I ser på
          grafen øverst på siden. Her vælger I også jeres netselskab.
        </p>
      </section>
      <section>
        <h2>Hvornår kommer elpriserne for i morgen?</h2>
        <p>
          Midt på dagen. Prisen bliver sat på day-ahead-markedet, hvor der handles strøm til levering det næste døgn i hvert prisområde, skriver{' '}
          <A href={EDS}>Energinet</A>. <A href={SPAR_ELPRISER}>Sparenergi</A> skriver, at priserne for det kommende døgn kommer midt på dagen, og Energinet råder til at hente morgendagens priser
          mellem kl. 13 og 14.
        </p>
        <p>
          Siden 1. oktober 2025 er prisen sat for hvert kvarter og ikke for hver hele time, viser <A href={EDS}>Energinets data</A>. Den timepris, I ser hos Sparenergi og i
          grafen her, er et gennemsnit af timens fire kvarterer.
        </p>
      </section>
      <section>
        <h2>Hvordan bruger I de billige timer?</h2>
        <p>
          Spotprisens billige timer får I kun gavn af med en variabel timepris. Nettariffen svinger dog for alle, så det kan betale sig for alle at flytte forbrug, skriver{' '}
          <A href={SPAR_ELPRISER}>Sparenergi</A>. I har normalt en variabel timepris, hvis der står flexpris, spotpris eller lignende på regningen. Er I i tvivl, så spørg
          elleverandøren.
        </p>
        <p>
          Flyt det forbrug, der kan vente: opvaskemaskine, vaskemaskine, tørretumbler og opladning af elbil. Sparenergi fortæller om en familie, der før startede
          opvaskemaskinen kl. 19 og nu tidsindstiller den til om natten. Har I elbil, kan opladningen ændre husstandens forbrugsmønster markant, skriver{' '}
          <A href={FDM_LADE}>FDM</A>. Den er derfor værd at planlægge først.
        </p>
        <p>
          Har I fastpris på strømmen, betaler I det samme for selve strømmen hele døgnet, men nettariffen svinger stadig. Læs mere i guiden{' '}
          <A href="/fastpris-eller-variabel-el">Fastpris eller variabel elaftale?</A>
        </p>
      </section>
      <section>
        <h2>Regneeksempel: kan elbilen lades i de billige timer?</h2>
        <p>Et eksempel, ikke jeres regning. Det bygger på disse antagelser:</p>
        <ul>
          <li>Bilen kører 15.000 km om året og bruger 20 kWh pr. 100 km. Det er ca. 3.000 kWh om året, som i FDM&apos;s eksempel.</li>
          <li>Bilen lades hjemme hver dag med en ladeboks på 11 kW, som ifølge Bolius kræver tre faser og 16 ampere.</li>
          <li>Ladetab er ikke regnet med.</li>
        </ul>
        <p>
          3.000 kWh fordelt på årets 365 dage er ca. 8,2 kWh om dagen. Med 11 kW tager det ca. 45 minutter at lade dem. Opladningen kan altså sagtens ligge i lavlast mellem
          kl. 0 og 6, hvor nettariffen er lavest, eller i de timer, hvor spotprisen er lavest den dag.
        </p>
      </section>
      <GuideSteps
        title="Sådan bruger I de billige timer"
        steps={[
          'Tjek, om jeres aftale har variabel timepris. Står der flexpris eller spotpris på regningen, er den normalt variabel.',
          'Se morgendagens priser, når de er klar midt på dagen, og find de billigste timer.',
          'Tidsindstil opvaskemaskine og vaskemaskine til de billige timer, og undgå kl. 17 til 21.',
          'Lad elbilen om natten eller i dagens billigste timer.',
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
          Altid Hjem er bygget af holdet bag elleverandøren Altid Energi. Denne guide bygger på Energinets priser, Sparenergi, FDM og Bolius, ikke på vores egne priser.
        </p>
        <GuideApp
          tone="sky"
          src="/site/app/energi-home.webp"
          alt="Energi i Altid Hjem: elprisen lige nu, priserne time for time for Vestdanmark med den billigste time markeret, og forbruget de seneste tre måneder"
          caption="I appen: elprisen time for time for Vestdanmark, DK1, med den billigste time markeret."
        />
      </section>
    </Guide>
  )
}
