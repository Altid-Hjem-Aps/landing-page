import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import BottomCta from '@/components/sections/BottomCta'
import Footer from '@/components/Footer'
import ElforbrugBenchmark from '@/components/ElforbrugBenchmark'

export const metadata: Metadata = {
  title: 'Gennemsnitligt elforbrug i hjemmet – Altid Hjem',
  description:
    'Se typisk elforbrug for lejlighed og hus, sammenlign jeres kWh med vejledende niveauer, og få konkrete råd til at forstå og sænke forbruget.',
  alternates: { canonical: 'https://altidhjem.dk/gennemsnitligt-elforbrug' },
  openGraph: {
    title: 'Hvad er et normalt elforbrug?',
    description:
      'Se typisk elforbrug for lejlighed og hus, sammenlign jeres kWh med vejledende niveauer, og få konkrete råd til at forstå og sænke forbruget.',
    url: 'https://altidhjem.dk/gennemsnitligt-elforbrug',
    type: 'article',
  },
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="underline underline-offset-4 hover:opacity-70" style={{ color: 'var(--forest)' }}>
      {children}
    </Link>
  )
}

// FAQ bruges to steder: synligt på siden og som FAQPage-schema (rich results).
const FAQ: { q: string; a: string[] }[] = [
  {
    q: 'Hvad er et normalt elforbrug for en familie på 4?',
    a: [
      'En familie på 4 i hus bruger typisk omkring 4.500-5.000 kWh om året.',
      'Niveauet er vejledende og gælder uden elbil og elvarme, som kan løfte forbruget markant.',
    ],
  },
  {
    q: 'Hvad bruger en lejlighed i el?',
    a: [
      'En lejlighed med 1 person bruger typisk cirka 1.500-2.000 kWh om året, mens 2 personer ligger omkring 2.100 kWh.',
      'En familielejlighed ligger vejledende omkring 2.600 kWh, men boligstørrelse, apparater og vaner påvirker tallet.',
    ],
  },
  {
    q: 'Hvorfor er vores elforbrug højere end gennemsnittet?',
    a: [
      'Et højere elforbrug skyldes ofte elvarme, elbil, mange beboere eller apparater med stort eller hyppigt forbrug.',
      'Hjemmearbejde, teenagere og ældre hvidevarer kan også gøre en mærkbar forskel.',
    ],
  },
  {
    q: 'Hvor meget el bruger en elbil?',
    a: [
      'En moderne elbil bruger typisk 15-22 kWh pr. 100 km, så hjemmeladning kan fordoble en husstands elforbrug afhængigt af kørslen.',
      'Se også, hvad en ladeboks koster, hvis I vil forstå den samlede økonomi ved opladning hjemme.',
    ],
  },
  {
    q: 'Hvordan ser jeg vores eget elforbrug?',
    a: [
      'I kan normalt se forbruget i kWh i elselskabets app, på årsopgørelsen eller via ElOverblik.',
      'Brug helst et helt års data, så sæsonudsving ikke giver et misvisende billede.',
    ],
  },
  {
    q: 'Hvad er Altid Hjem?',
    a: [
      'Altid Hjem er en dansk app på vej, som skal kunne samle hjemmets faste udgifter til el, mobil, forsikring, opladning, alarm og mad.',
      'Den er bygget omkring ét overblik, ét login, mens Altid Energi allerede er live i dag.',
    ],
  },
  {
    q: 'Koster det noget at skrive sig på ventelisten?',
    a: [
      'Nej, det koster ikke noget at skrive sig på ventelisten til Altid Hjem.',
      'Tilmeldingen giver mulighed for at følge med, mens appen bliver gjort klar.',
    ],
  },
]

export default function GennemsnitligtElforbrug() {
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
          longPrefix: 'Er jeres elforbrug normalt? Se de typiske niveauer pr. boligtype. ',
          shortPrefix: 'Er jeres elforbrug normalt? ',
          source: 'elforbrug-banner',
          cta: 'Se benchmark →',
        }}
      />
      <script
        type="application/ld+json"
        // '<' escapes som \u003c: JSON.stringify escaper ikke '<', så en
        // fremtidig FAQ-tekst med '</script>' kunne ellers bryde ud af tagget.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
      <main className="min-h-screen" style={{ fontFamily: 'var(--font-onest)' }}>
        {/* pt-32 (128px) = kampagnebanner (~36px) + nav (84px) + luft. */}
        <div className="pt-32 pb-20" style={{ background: 'var(--cream)' }}>
          <div className="max-w-2xl mx-auto px-6">

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm mb-10 transition-opacity hover:opacity-70"
              style={{ color: 'rgba(26,61,34,0.55)' }}
            >
              <span aria-hidden="true">←</span> Tilbage
            </Link>

            <h1 className="text-3xl sm:text-4xl font-bold mb-1 text-balance" style={{ color: 'var(--forest)' }}>
              Hvad er et normalt elforbrug?
            </h1>
            <p className="text-xs mb-12" style={{ color: 'rgba(26,61,34,0.5)' }}>Opdateret: juli 2026 · Kilde: Energistyrelsen og elselskabernes opgørelser</p>

            <div className="space-y-10 text-sm leading-relaxed text-pretty" style={{ color: 'rgba(26,61,34,0.75)' }}>

              {/* Kort svar — målrettet Googles "fremhævede uddrag". */}
              <section>
                <p className="mb-3">
                  En familie på 4 i hus bruger typisk omkring 4.500-5.000 kWh om året, mens en lejlighed normalt bruger væsentligt mindre. Tallene er vejledende og gælder uden elbil og elvarme.
                </p>
                <p>
                  Jeres bolig, vaner og apparater har stor betydning. Oversigten her på siden giver jer et sammenligningsgrundlag, så I kan vurdere, om jeres elforbrug ligger lavt, normalt eller højt.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Typisk elforbrug efter boligtype
                </h2>
                <p className="mb-3">
                  En lejlighed med 1 person bruger typisk omkring 1.500-2.000 kWh om året. Bor der 2 personer i lejligheden, er et vejledende niveau cirka 2.100 kWh om året.
                </p>
                <p className="mb-3">
                  En familielejlighed ligger typisk omkring 2.600 kWh om året. Et hus med 2 personer bruger vejledende cirka 3.700 kWh, mens en familie på 4 i hus typisk bruger omkring 4.500-5.000 kWh om året.
                </p>
                <p>
                  Tallene i oversigten her på siden er pejlemærker, ikke mål, som alle hjem bør ramme. Boligens installationer, antallet af personer og jeres hverdag kan forklare store forskelle.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Det flytter for alvor elforbruget
                </h2>
                <p className="mb-3">
                  Elvarme og elbil kan fordoble husstandens elforbrug eller mere. Derfor bør I ikke sammenligne jeres samlede tal direkte med standardniveauerne, hvis boligen opvarmes med el, eller bilen ofte lades hjemme.
                </p>
                <p className="mb-3">
                  Store apparater, mange vaske, tørretumbler og ældre køleudstyr kan også trække forbruget op. Teenagere, hjemmearbejde og flere personer hjemme i dagtimerne betyder ofte, at lys, elektronik og madlavning bruges flere timer om dagen.
                </p>
                <p>
                  Et højt tal er altså ikke nødvendigvis tegn på spild. Det vigtigste er at forstå, hvilke aktiviteter der ligger bag, og om forbruget ændrer sig uden en tydelig forklaring.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Sådan finder I jeres eget tal
                </h2>
                <p className="mb-3">
                  Se først i elselskabets app eller på jeres årsopgørelse. Her kan I normalt finde forbruget i kWh for et helt år, hvilket giver et bedre sammenligningsgrundlag end en enkelt vintermåned.
                </p>
                <p className="mb-3">
                  I kan også bruge ElOverblik til at se måledata fra elmåleren. Sammenlign gerne hele år med hinanden, da ferie, vejr og ændringer i husstanden kan få enkelte måneder til at afvige.
                </p>
                <p>
                  Notér større ændringer undervejs, for eksempel ny elbil, elvarme eller flere hjemmearbejdsdage. Så bliver det lettere at forklare udviklingen i jeres forbrug.
                </p>

                {/* Animeret side-komponent i gradient-rammen (forsikring-side-mønstret). */}
                <div
                  className="rounded-3xl flex justify-center py-10 px-4 mt-6"
                  style={{ background: 'linear-gradient(160deg, rgba(168,224,99,0.12) 0%, rgba(26,61,34,0.05) 100%)' }}
                >
                  <ElforbrugBenchmark />
                </div>
                <p className="text-xs mt-3 text-center" style={{ color: 'rgba(26,61,34,0.5)' }}>
                  Typiske årsniveauer uden elbil og elvarme. Elbil eller elvarme kan fordoble tallene.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Fra elforbrug til elregning
                </h2>
                <p className="mb-3">
                  Elregningen afhænger ikke kun af antallet af kWh. Den samlede elpris består af spotpris, transport, afgifter samt elselskabets tillæg og eventuelle gebyrer.
                </p>
                <p className="mb-3">
                  I grove træk finder I den forbrugsafhængige del ved at gange jeres kWh med den samlede pris pr. kWh. Faste abonnementer og gebyrer kan dog betyde, at to husstande med samme forbrug betaler forskelligt.
                </p>
                <p>
                  Når I sammenligner aftaler, bør I derfor se på hele prisstrukturen. Læs mere om at finde det <A href="/billigste-elselskab">billigste elselskab</A> og om, <A href="/hvornar-er-strommen-billigst">hvornår strømmen er billigst</A>.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Spar strøm uden at gå i mørke
                </h2>
                <p className="mb-3">
                  Begynd med det forbrug, der er nemt at flytte eller undgå. Opvaskemaskine, vaskemaskine og opladning kan ofte placeres i billigere timer, hvis jeres elaftale følger spotprisen.
                </p>
                <p className="mb-3">
                  Sluk apparater, der står unødigt på standby, og brug programmerne på vask og opvask, som passer til behovet. Det er ofte mere realistisk at ændre få gentagne vaner end at forsøge at spare på alt på én gang.
                </p>
                <p>
                  Følg forbruget efter en ændring, så I kan se, om den faktisk gør en forskel. Det giver et bedre grundlag for at vælge de vaner, der passer til jeres hjem.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Hvad Altid Hjem skal kunne
                </h2>
                <p className="mb-3">
                  Altid Hjem er bygget til at samle hjemmets faste udgifter til el, mobil, forsikring, opladning, alarm og mad. Målet er ét overblik, ét login, så det bliver lettere at forstå aftalerne og følge deres betydning for husholdningen.
                </p>
                <p className="mb-3">
                  Altid Hjem er ikke lanceret endnu, og ventelisten er åben på altidhjem.dk. Mobil, opladning, alarm og forsikring er på vej og skal kunne indgå i overblikket, når tjenesterne bliver tilgængelige.
                </p>
                <p>
                  Altid Energi er live i dag og er Danmarks første gebyrfrie energiselskab, uden faste gebyrer eller abonnement. Mere end 14.000 danskere er allerede kunder hos Altid Energi.
                </p>
              </section>

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

        <div id="venteliste">
          <BottomCta
            eyebrow='Kend jeres forbrug, før I optimerer det'
            subtitle='Skriv dig gratis på ventelisten og få tidlig adgang, når Altid Hjem lanceres'
            source='gennemsnitligt-elforbrug'
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
