import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import BottomCta from '@/components/sections/BottomCta'
import Footer from '@/components/Footer'
import { getElpriser, getNetselskaber, currentCopenhagenHour } from '@/lib/elpriser'
import ElprisChart from '@/components/ElprisChart'
import ElprisAppMockup from '@/components/ElprisAppMockup'

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

const FAQ: { q: string; a: string[] }[] = [
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
      'Ja. Altid Hjem bygges til at holde øje med elprisen for dig og give konkrete anbefalinger, så du ved, hvornår det bedst kan betale sig at bruge strøm.',
      'Målet er at gøre det lettere at spare penge uden selv at skulle tjekke elpriser hele tiden.',
      'Skriv dig gratis på ventelisten, så får du besked, når Altid Hjem er klar.',
    ],
  },
]

const FOREST_TEXT = 'rgba(26,61,34,0.75)'

export default async function HvornarErStrommenBilligst() {
  const [data, netselskaber] = await Promise.all([getElpriser(), getNetselskaber()])
  const nowHour = currentCopenhagenHour()

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a.join(' ') },
    })),
  }

  return (
    <>
      <Nav
        banner={{
          longPrefix:
            'Træt af selv at tjekke elpriser? Altid Hjem giver dig automatisk besked, når strømmen er billigst. ',
          shortPrefix: 'Få besked, når strømmen er billigst. ',
          source: 'elpris-banner',
        }}
      />
      <script
        type="application/ld+json"
        // '<' escapes som < — JSON.stringify escaper ikke '<' selv.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
      <main className="min-h-screen" style={{ fontFamily: 'var(--font-onest)' }}>

        {/* pt-32 (128px) = kampagnebanner (~36px) + nav (84px) + luft —
            samme regnestykke som på /spiir-alternativ. */}
        <div className="pt-32 pb-20" style={{ background: 'var(--cream)' }}>
          <div className="max-w-2xl mx-auto px-6">

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm mb-10 transition-opacity hover:opacity-70"
              style={{ color: 'rgba(26,61,34,0.55)' }}
            >
              <span aria-hidden="true">←</span> Tilbage
            </Link>

            <h1 className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: 'var(--forest)' }}>
              Hvornår er strømmen billigst?
            </h1>
            <p className="text-xs mb-12" style={{ color: 'rgba(26,61,34,0.5)' }}>
              Elpriser time for time · opdateres løbende
            </p>

            <div className="space-y-10 text-sm leading-relaxed" style={{ color: FOREST_TEXT }}>

              <section>
                <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--forest)' }}>
                  Kort svar
                </h2>
                <p className="mb-3">
                  Strømmen er typisk billigst om natten og midt på dagen, når forbruget er lavere,
                  og der ofte produceres mere strøm fra vind og sol.
                </p>
                <p className="mb-3">
                  De dyreste timer ligger ofte omkring kl. 17-21, hvor mange laver mad, vasker tøj,
                  bruger elektronik og lader elbil.
                </p>
                <p>
                  Se dagens elpriser time for time i grafen nedenfor, og find den billigste time i
                  både Vestdanmark, DK1, og Østdanmark, DK2.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="font-semibold text-base" style={{ color: 'var(--forest)' }}>
                  Elprisen lige nu
                </h2>
                {data ? (
                  <ElprisChart data={data} nowHour={nowHour} netselskaber={netselskaber} />
                ) : (
                  <p>
                    De aktuelle priser kan ikke hentes lige nu. Prøv igen om lidt. Mønstret nedenfor
                    gælder dog de fleste dage: billigst om natten og midt på dagen, dyrest kl. 17-21.
                  </p>
                )}
              </section>

              <section>
                <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--forest)' }}>
                  Dagens elpriser time for time i DK1 og DK2
                </h2>
                <p className="mb-3">
                  Elprisen ændrer sig fra time til time. Derfor er svaret på, hvornår strømmen er
                  billigst, ikke ét fast tidspunkt, men dagens konkrete prisudvikling.
                </p>
                <p className="mb-3">
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
                <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--forest)' }}>
                  Hvornår er strømmen billigst i dag?
                </h2>
                <p className="mb-3">
                  Den billigste time afhænger af dagens spotpris, nettariffer og dit
                  prisområde.
                </p>
                <p className="mb-3">
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
                <h2 className="font-semibold text-base mb-4" style={{ color: 'var(--forest)' }}>
                  Lad Altid Hjem holde øje med elprisen for dig
                </h2>
                <ElprisAppMockup data={data} />
              </section>

              <section>
                <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--forest)' }}>
                  Derfor svinger elprisen
                </h2>
                <p className="mb-3">Elprisen styres af udbud og efterspørgsel.</p>
                <p className="mb-3">
                  Når det blæser meget, eller solen producerer meget strøm, falder prisen typisk.
                  Når vejret er stille, produktionen er lav, og mange bruger strøm samtidig, stiger
                  prisen.
                </p>
                <p className="mb-3">
                  Derfor ligger de dyreste timer ofte omkring kl. 17-21. Det er her mange laver
                  mad, vasker tøj, tænder elektronik og lader elbil.
                </p>
                <p className="mb-3">De billigste timer ligger ofte om natten eller midt på dagen.</p>
                <p>
                  På dage med meget vind kan elprisen i perioder blive meget lav og nogle gange
                  negativ.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--forest)' }}>
                  Sådan bruger du de billige timer
                </h2>
                <p className="mb-3">
                  Har du en variabel eller timeafregnet elaftale, kan du spare penge ved at flytte
                  noget af dit strømforbrug til de billigste timer.
                </p>
                <p className="mb-2">Det gælder især de store strømforbrugere i hjemmet:</p>
                <ul className="mb-3 space-y-1 list-disc pl-5">
                  <li>Opvaskemaskine</li>
                  <li>Vaskemaskine</li>
                  <li>Tørretumbler</li>
                  <li>Elbil</li>
                  <li>Varmepumpe</li>
                </ul>
                <p className="mb-3">
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

              <section>
                <h2 className="font-semibold text-base mb-4" style={{ color: 'var(--forest)' }}>
                  Ofte stillede spørgsmål
                </h2>
                <div className="space-y-3">
                  {FAQ.map((f) => (
                    <details
                      key={f.q}
                      className="group rounded-xl overflow-hidden transition-colors"
                      style={{ background: '#ffffff', border: '1px solid rgba(26,61,34,0.1)', boxShadow: '0 1px 3px rgba(26,61,34,0.06)' }}
                    >
                      <summary
                        className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        <h3 className="font-medium text-sm" style={{ color: 'var(--forest)' }}>{f.q}</h3>
                        <span
                          aria-hidden="true"
                          className="shrink-0 text-lg leading-none transition-transform duration-200 group-open:rotate-45"
                          style={{ color: 'var(--forest)' }}
                        >
                          +
                        </span>
                      </summary>
                      <div className="px-5 pb-5 pt-0 space-y-3">
                        {f.a.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </section>

            </div>
          </div>
        </div>

        <BottomCta
          eyebrow="Træt af selv at holde øje med elpriserne?"
          subtitle="Altid Hjem-appen følger elprisen for dig og siger til, når strømmen er billig. Skriv dig gratis på ventelisten i dag"
          source="elpriser"
        />
      </main>
      <Footer />
    </>
  )
}
