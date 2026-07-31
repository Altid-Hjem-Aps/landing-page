import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import BottomCta from '@/components/sections/BottomCta'
import Footer from '@/components/Footer'
import SkiftTjeklisteMockup from '@/components/SkiftTjeklisteMockup'

export const metadata: Metadata = {
  title: 'Skift forsikringsselskab sikkert – Altid Hjem',
  description:
    'Skift forsikringsselskab i den rigtige rækkefølge. Få styr på opsigelse, dækning og selvrisiko, og skriv dig på ventelisten hos Altid Hjem.',
  alternates: { canonical: 'https://altidhjem.dk/skift-forsikringsselskab' },
  openGraph: {
    title: 'Sådan skifter du forsikringsselskab',
    description:
      'Skift forsikringsselskab i den rigtige rækkefølge. Få styr på opsigelse, dækning og selvrisiko, og skriv dig på ventelisten hos Altid Hjem.',
    url: 'https://altidhjem.dk/skift-forsikringsselskab',
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
      'Altid Hjem er en dansk app på vej, som er bygget til at samle hjemmets faste udgifter med ét overblik, ét login.',
      'El findes allerede gennem Altid Energi, mens mobil, opladning, alarm og forsikring er på vej.',
    ],
  },
  {
    q: 'Koster det noget at skrive sig på ventelisten?',
    a: [
      'Nej, det koster ikke noget at skrive sig på ventelisten til Altid Hjem.',
      'Tilmeldingen giver dig mulighed for at følge med, mens appen bliver gjort klar.',
    ],
  },
]

export default function SkiftForsikringsselskab() {
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
          longPrefix: 'At skifte forsikringsselskab er enklere, end de fleste tror. ',
          shortPrefix: 'Overvejer du at skifte forsikring? ',
          source: 'skift-forsikring-banner',
          cta: 'Se den sikre rækkefølge →',
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
              Sådan skifter du forsikringsselskab
            </h1>
            <p className="text-xs mb-12" style={{ color: 'rgba(26,61,34,0.5)' }}>Opdateret: juli 2026 · Sammenlign selv på <a href="https://www.forsikringsguiden.dk" className="underline" target="_blank" rel="noopener noreferrer">Forsikringsguiden.dk</a></p>

            <div className="space-y-10 text-sm leading-relaxed text-pretty" style={{ color: 'rgba(26,61,34,0.75)' }}>

              {/* Kort svar — målrettet Googles "fremhævede uddrag". */}
              <section>
                <p className="mb-3">
                  At skifte forsikringsselskab er enklere, end mange tror. Det nye selskab kan ofte stå for opsigelsen, men få altid den nye police bekræftet, før den gamle ophører.
                </p>
                <p>
                  Den rigtige rækkefølge beskytter dig mod huller i dækningen og unødige dobbeltperioder. Sammenlign både dækning, selvrisiko, tilvalg og pris, før du beslutter dig.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Hvornår kan du skifte forsikringsselskab?
                </h2>
                <p className="mb-3">
                  Efter det første år kan de fleste private forsikringer typisk opsiges med løbende måned plus en måned. Fristen afhænger dog af din police og selskabets vilkår, så kontrollér altid den konkrete opsigelsesfrist.
                </p>
                <p className="mb-3">
                  Du kan godt undersøge alternativer, før opsigelsesfristen nærmer sig. Bed det nye selskab oplyse en præcis startdato, så den passer med ophøret hos dit nuværende selskab.
                </p>
                <p>
                  Nogle aftaler kan have særlige regler, gebyrer eller længere varsler. Det er derfor policen, og ikke en generel tommelfingerregel, der afgør, hvornår dit skift kan gennemføres.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Brug en rækkefølge, der beskytter dig
                </h2>
                <p className="mb-3">
                  Begynd med at indhente et tilbud, hvor dækninger, selvrisici og startdato står skriftligt. Acceptér først tilbuddet, når du har kontrolleret, at det dækker det, du faktisk har brug for.
                </p>
                <p className="mb-3">
                  Få derefter den nye police og startdato bekræftet. Først når den nye dækning er på plads, bør den gamle forsikring opsiges.
                </p>
                <p>
                  Mange nye selskaber tilbyder at klare opsigelsen for dig. Bed om en skriftlig bekræftelse, og kontrollér både ophørsdatoen på den gamle police og startdatoen på den nye.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Sammenlign mere end prisen
                </h2>
                <p className="mb-3">
                  To forsikringer med samme navn kan dække meget forskelligt. Sammenlign blandt andet dækningssummer, selvrisiko, undtagelser, tilvalg og regler for erstatning.
                </p>
                <p className="mb-3">
                  Ved indboforsikring bør du eksempelvis kontrollere dækning ved tyveri, vandskade, elektronikskader og ansvar. Du kan læse mere om prisniveauer og forskelle i guiden til <A href="/hvad-koster-indboforsikring">hvad en indboforsikring koster</A>.
                </p>
                <p>
                  Se også på husstandens samlede behov, ikke kun én police ad gangen. Vores guide til <A href="/hvad-koster-forsikring">hvad forsikring koster</A> hjælper dig med at vurdere pris i forhold til profil og dækning.
                </p>

                {/* Animeret side-komponent i gradient-rammen (forsikring-side-mønstret). */}
                <div
                  className="rounded-3xl flex justify-center py-10 px-4 mt-6"
                  style={{ background: 'linear-gradient(160deg, rgba(168,224,99,0.12) 0%, rgba(26,61,34,0.05) 100%)' }}
                >
                  <SkiftTjeklisteMockup />
                </div>
                <p className="text-xs mt-3 text-center" style={{ color: 'rgba(26,61,34,0.5)' }}>
                  Rækkefølgen beskytter dig: ny police på plads, før den gamle opsiges. Illustration, ikke et skærmbillede fra appen.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Undgå de typiske fælder
                </h2>
                <p className="mb-3">
                  En kort dobbeltperiode kan være praktisk, hvis datoerne ellers ikke kan mødes. En lang dobbeltperiode betyder derimod, at du risikerer at betale for to policer uden at få tilsvarende ekstra værdi.
                </p>
                <p className="mb-3">
                  Kontrollér også tilvalg, som let bliver glemt i et pristilbud. En lavere pris kan skyldes, at eksempelvis elektronik, udvidet rejse eller særlige genstande ikke længere er dækket på samme måde.
                </p>
                <p>
                  Samlerabat kan gøre en samlet løsning billigere, men den kan også gøre det sværere at gennemskue prisen på hver forsikring. Undersøg derfor, hvad der sker med rabatten, hvis du senere flytter én police.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Tjekliste til et sikkert skift
                </h2>
                <p className="mb-3">
                  1. Find dine nuværende policer, seneste opkrævninger og opsigelsesfrister.
                </p>
                <p className="mb-3">
                  2. Beskriv den dækning, du ønsker, og indhent sammenlignelige tilbud.
                </p>
                <p className="mb-3">
                  3. Kontrollér selvrisiko, undtagelser, tilvalg, rabatter og den samlede pris.
                </p>
                <p className="mb-3">
                  4. Vælg det nye selskab, og få police samt startdato bekræftet skriftligt.
                </p>
                <p className="mb-3">
                  5. Opsig den gamle forsikring selv, eller bekræft, at det nye selskab gør det.
                </p>
                <p>
                  6. Kontrollér de endelige datoer og gem dokumentationen for begge aftaler.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Hvad Altid Hjem skal kunne
                </h2>
                <p className="mb-3">
                  Altid Hjem er bygget til at samle hjemmets faste udgifter til blandt andet el, mobil, forsikring, opladning, alarm og mad. Målet er ét overblik, ét login, så det skal blive lettere at se husstandens aftaler og forstå, hvad der ændrer sig ved et skift.
                </p>
                <p className="mb-3">
                  Forsikringsdelen er på vej og skal kunne gøre husstandens policer mere overskuelige. Altid Hjem er endnu ikke lanceret, men ventelisten er åben på altidhjem.dk.
                </p>
                <p>
                  Bag Altid Hjem står teamet bag Altid Energi, Danmarks første gebyrfrie energiselskab. Altid Energi er i drift i dag og har allerede mere end 15.000 danskere som kunder.
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
            eyebrow='Skift uden huller i dækningen'
            subtitle='Skriv dig gratis på ventelisten og få tidlig adgang, når Altid Hjem lanceres'
            source='skift-forsikringsselskab'
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
