import type { Metadata } from 'next'
import { getElpriser, getNetselskaber, currentCopenhagenHour } from '@/lib/elpriser'
import ElprisChart from '@/components/ElprisChart'
import ElprisAppMockup from '@/components/ElprisAppMockup'
import Guide, { GuideFigure, type GuideFaq } from '@/components/site/Guide'

export const metadata: Metadata = {
  title: 'Hvornår er strømmen billigst? Se elpriser time for time',
  description:
    'Se hvornår strømmen er billigst i dag og i morgen. Følg elpriser time for time i DK1 og DK2, og få besked når strømmen er billig.',
  alternates: { canonical: '/hvornar-er-strommen-billigst' },
  openGraph: {
    title: 'Hvornår er strømmen billigst? Se elpriser time for time',
    description:
      'Se hvornår strømmen er billigst i dag og i morgen. Følg elpriser time for time i DK1 og DK2, og få besked når strømmen er billig.',
    url: '/hvornar-er-strommen-billigst',
    type: 'website',
    locale: 'da_DK',
  },
}

// Day-ahead-priserne ændrer sig én gang i døgnet (~kl. 13) — 30 min cache er
// rigeligt friskt og holder os langt under Strømlignings rate limit.
export const revalidate = 1800

const FAQ: GuideFaq[] = [
  {
    q: 'Hvornår er strømmen billigst?',
    a: [
      'Strømmen er typisk billigst om natten og midt på dagen, især når der produceres meget strøm fra vind og sol.',
      'De billigste timer ligger ofte omkring kl. 02-05 eller midt på dagen, men mønstret skifter fra dag til dag. Derfor bør du altid tjekke dagens elpriser time for time.',
    ],
  },
  {
    q: 'Hvornår er strømmen dyrest?',
    a: [
      'Strømmen er ofte dyrest sidst på eftermiddagen og om aftenen, især omkring kl. 17-21.',
      'Det skyldes, at mange bruger strøm samtidig, når der laves mad, vaskes tøj, tændes lys, bruges elektronik og lades elbil.',
    ],
  },
  {
    q: 'Hvor kan jeg se elpriser time for time?',
    a: [
      'Du kan se elpriser time for time i grafen øverst på siden.',
      'Her kan du vælge mellem Vestdanmark, DK1, og Østdanmark, DK2. Du kan også vælge dit netselskab og slå elafgift, transmission og moms til eller fra, så du får et mere realistisk billede af din samlede elpris.',
    ],
  },
  {
    q: 'Hvad er forskellen på DK1 og DK2?',
    a: [
      'Danmark er delt i to elprisområder. DK1 dækker Jylland og Fyn. DK2 dækker Sjælland og øerne.',
      'Priserne kan være ens, men de kan også variere, hvis kapaciteten mellem landsdelene er begrænset, eller hvis produktion og forbrug udvikler sig forskelligt i de to områder.',
    ],
  },
  {
    q: 'Hvornår kommer elpriserne for i morgen?',
    a: [
      'Morgendagens elpriser offentliggøres normalt omkring kl. 13.',
      'Når priserne er klar, kan du se dem time for time ved at vælge “I morgen” i grafen øverst på siden.',
    ],
  },
  {
    q: 'Hvorfor ændrer elprisen sig hele tiden?',
    a: [
      'Elprisen ændrer sig, fordi den afhænger af både produktion og forbrug.',
      'Når der produceres meget strøm fra vind og sol, falder prisen ofte. Når mange bruger strøm samtidig, og produktionen er lavere, stiger prisen.',
      'Derfor kan prisen variere markant fra time til time.',
    ],
  },
  {
    q: 'Kan jeg spare penge ved at bruge strøm på bestemte tidspunkter?',
    a: [
      'Ja, hvis du har en variabel eller timeafregnet elaftale.',
      'Du kan især spare penge ved at flytte strømforbrug fra de dyreste timer til de billigste timer. Det gælder for eksempel opvaskemaskine, vaskemaskine, tørretumbler og opladning af elbil.',
    ],
  },
  {
    q: 'Kan Altid Hjem hjælpe mig med elprisen?',
    a: [
      'Ja. I Altid Hjem ser du elprisen time for time og kan få besked, når strømmen er billig.',
      'Så slipper du for selv at tjekke elpriser hele tiden.',
      'Du kan hente appen gratis i App Store og Google Play.',
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
            Strømmen er typisk billigst om natten og midt på dagen, når forbruget er lavere,
            og der ofte produceres mere strøm fra vind og sol.
          </p>
          <p>
            De dyreste timer ligger ofte omkring kl. 17-21, hvor mange laver mad, vasker tøj,
            bruger elektronik og lader elbil.
          </p>
          <p>
            Se dagens elpriser time for time i grafen nedenfor, og find den billigste time i
            både Vestdanmark, DK1, og Østdanmark, DK2.
          </p>
        </>
      }
      meta="Elpriser time for time · opdateres løbende"
      faq={FAQ}
      cta={{
        eyebrow: 'Elprisen uden selv at holde øje',
        heading: 'Hent Altid Hjem, og få besked, når strømmen er billig',
        subtitle: 'I appen ser du elprisen time for time, så du slipper for selv at tjekke den hver dag.',
      }}
    >
      <section>
        <h2>Elprisen lige nu</h2>
        {data ? (
          <GuideFigure tone="sand">
            {/* ElprisChart returns two siblings (the key figures and the chart card). The wrapper
                keeps them stacked in the figure's flex row, fills the card, and may shrink below
                the chart's nowrap hour labels (min-width 0), or a phone would cut the chart off. */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <ElprisChart data={data} nowHour={nowHour} netselskaber={netselskaber} />
            </div>
          </GuideFigure>
        ) : (
          <p>
            De aktuelle priser kan ikke hentes lige nu. Prøv igen om lidt. Mønstret nedenfor
            gælder dog de fleste dage: billigst om natten og midt på dagen, dyrest kl. 17-21.
          </p>
        )}
      </section>

      <section>
        <h2>Dagens elpriser time for time i DK1 og DK2</h2>
        <p>
          Elprisen ændrer sig fra time til time. Derfor er svaret på, hvornår strømmen er
          billigst, ikke ét fast tidspunkt, men dagens konkrete prisudvikling.
        </p>
        <p>
          Nogle dage er strømmen billigst om natten. Andre dage falder elprisen midt på
          dagen, når sol og vind producerer meget strøm. Til gengæld er strømmen ofte
          dyrest sidst på eftermiddagen og om aftenen, når forbruget i hjemmet er højest.
        </p>
        <p>
          I grafen kan du se dagens elpriser time for time for både Vestdanmark, DK1, og
          Østdanmark, DK2. Du kan også vælge dit netselskab, så transportprisen passer
          bedre til din adresse.
        </p>
      </section>

      <section>
        <h2>Hvornår er strømmen billigst i dag?</h2>
        <p>
          Den billigste time afhænger af dagens spotpris, nettariffer og dit
          prisområde.
        </p>
        <p>
          I dag kan du finde den billigste time direkte i grafen øverst på siden. Vælg DK1
          eller DK2, og skift mellem &ldquo;I dag&rdquo; og &ldquo;I morgen&rdquo;, når
          morgendagens elpriser er offentliggjort.
        </p>
        <p>
          Hvis du har en variabel eller timeafregnet elaftale, kan du bruge grafen til at
          planlægge opvask, tøjvask, tørretumbling og opladning af elbil.
        </p>
      </section>

      <section>
        <h2>Lad Altid Hjem holde øje med elprisen for dig</h2>
        <GuideFigure tone="sky">
          <ElprisAppMockup data={data} />
        </GuideFigure>
      </section>

      <section>
        <h2>Derfor svinger elprisen</h2>
        <p>Elprisen styres af udbud og efterspørgsel.</p>
        <p>
          Når det blæser meget, eller solen producerer meget strøm, falder prisen typisk.
          Når vejret er stille, produktionen er lav, og mange bruger strøm samtidig, stiger
          prisen.
        </p>
        <p>
          Derfor ligger de dyreste timer ofte omkring kl. 17-21. Det er her mange laver
          mad, vasker tøj, tænder elektronik og lader elbil.
        </p>
        <p>De billigste timer ligger ofte om natten eller midt på dagen.</p>
        <p>
          På dage med meget vind kan elprisen i perioder blive meget lav og nogle gange
          negativ.
        </p>
      </section>

      <section>
        <h2>Sådan bruger du de billige timer</h2>
        <p>
          Har du en variabel eller timeafregnet elaftale, kan du spare penge ved at flytte
          noget af dit strømforbrug til de billigste timer.
        </p>
        <p>Det gælder især de store strømforbrugere i hjemmet:</p>
        <ul>
          <li>Opvaskemaskine</li>
          <li>Vaskemaskine</li>
          <li>Tørretumbler</li>
          <li>Elbil</li>
          <li>Varmepumpe</li>
        </ul>
        <p>
          Hvis strømmen er billig kl. 14 og dyr kl. 20, kan det betale sig at vente med
          opvasken, vasketøjet eller opladningen af bilen.
        </p>
        <p>
          Forskellen mellem den billigste og dyreste time er ofte over 1 kr. pr. kWh. For
          en elbil kan det alene betyde flere hundrede kroner om måneden, hvis opladningen
          flyttes fra de dyreste til de billigste timer.
        </p>
      </section>

      {/* "Læs også"-sektionen fra SEO-oplægget afventer, at artiklerne
          findes — døde links skader mere, end interne links gavner:
          - Billig strøm: Sådan finder du de billigste timer
          - Variabel elpris: Hvad betyder det?
          - Sådan samler Altid Hjem dine faste udgifter
          - Elpriser i morgen: Hvornår bliver strømmen billigst? */}
    </Guide>
  )
}
