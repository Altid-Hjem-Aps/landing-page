import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import BottomCta from '@/components/sections/BottomCta'
import Footer from '@/components/Footer'
import BudgetAppSammenligning from '@/components/BudgetAppSammenligning'

export const metadata: Metadata = {
  title: 'Bedste budget-app til jeres økonomi – Altid Hjem',
  description:
    'Få en ærlig guide til budget-apps, faste aftaler og økonomisk overblik. Se forskellen på værktøjerne, og find den løsning, der passer til jer.',
  alternates: { canonical: 'https://altidhjem.dk/bedste-budget-app' },
  openGraph: {
    title: 'Hvilken budget-app er bedst til jeres behov?',
    description:
      'Få en ærlig guide til budget-apps, faste aftaler og økonomisk overblik. Se forskellen på værktøjerne, og find den løsning, der passer til jer.',
    url: 'https://altidhjem.dk/bedste-budget-app',
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
    q: 'Hvad er den bedste budget-app?',
    a: [
      'Den bedste budget-app er den, der løser jeres konkrete behov og håndterer jeres data på en måde, I er trygge ved.',
      'Vælg ud fra bankunderstøttelse, kategorisering, eksportmuligheder og vilkår, ikke kun ud fra antallet af funktioner.',
    ],
  },
  {
    q: 'Er budget-apps sikre?',
    a: [
      'Budget-apps kan være sikre, men I bør altid undersøge den enkelte udbyder.',
      'Kontoadgang sker generelt gennem regulerede åbne bankløsninger, men tjek appens vilkår, databehandling og muligheder for at fjerne adgangen.',
    ],
  },
  {
    q: 'Hvad kostede Spiirs lukning brugerne?',
    a: [
      'Spiirs lukning betød først og fremmest, at brugerne mistede adgangen til deres vante overblik.',
      'Konsekvensen var ikke nødvendigvis et direkte økonomisk tab, men mange måtte finde en ny måde at kategorisere forbrug og følge økonomien på.',
    ],
  },
  {
    q: 'Skal vi vælge en budget-app eller et samlet overblik?',
    a: [
      'Vælg en budget-app, hvis I vil analysere forbruget bagud, og et samlet overblik, hvis I vil styre faste aftaler fremadrettet.',
      'De kan supplere hinanden, fordi de løser forskellige opgaver.',
    ],
  },
  {
    q: 'Kan Altid Hjem erstatte en budget-app?',
    a: [
      'Nej, Altid Hjem skal løse en anden opgave end en klassisk budget-app.',
      'Appen er bygget til at samle hjemmets faste aftaler, mens budget-apps typisk kategoriserer bevægelser på jeres konti.',
    ],
  },
  {
    q: 'Hvad er Altid Hjem?',
    a: [
      'Altid Hjem er en kommende dansk app, der skal samle hjemmets faste udgifter ét sted.',
      'Målet er ét overblik, ét login til el, mobil, forsikring, opladning, alarm og mad.',
    ],
  },
  {
    q: 'Koster det noget at skrive sig på ventelisten til Altid Hjem?',
    a: [
      'Nej, det koster ikke noget at skrive sig på ventelisten.',
      'Tilmeldingen giver jer mulighed for at følge med, mens Altid Hjem bliver udviklet.',
    ],
  },
]

export default function BedsteBudgetApp() {
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
          longPrefix: 'Budget-app eller samlet overblik? De løser to forskellige opgaver. ',
          shortPrefix: 'Budget-app eller samlet overblik? ',
          source: 'budget-app-banner',
          cta: 'Se forskellen →',
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
              Hvilken budget-app er bedst til jeres behov?
            </h1>
            <p className="text-xs mb-12" style={{ color: 'rgba(26,61,34,0.5)' }}>Opdateret: juli 2026</p>

            <div className="space-y-10 text-sm leading-relaxed text-pretty" style={{ color: 'rgba(26,61,34,0.75)' }}>

              {/* Kort svar — målrettet Googles "fremhævede uddrag". */}
              <section>
                <p className="mb-3">
                  Den bedste budget-app afhænger af, hvilket problem I vil løse. En klassisk budget-app viser, hvor pengene er gået, mens et samlet aftaleoverblik hjælper jer med at styre faste udgifter fremadrettet.
                </p>
                <p>
                  De to værktøjer kan sagtens supplere hinanden. Vælg en budget-app til løbende forbrug, et aftaleoverblik til el, mobil, forsikringer og abonnementer, eller begge dele, hvis I har brug for hele billedet.
                </p>
              </section>

              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Hvad gør en budget-app egentlig?
                </h2>
                <p className="mb-3">
                  En klassisk budget-app henter oplysninger fra jeres konti og placerer betalingerne i kategorier som bolig, transport, dagligvarer og fornøjelser. Det gør det lettere at se, hvor pengene gik sidste måned.
                </p>
                <p className="mb-3">
                  Overblikket er især nyttigt, hvis I vil finde vaner i det variable forbrug. Måske fylder takeaway, små netkøb eller dagligvarer mere, end I havde regnet med.
                </p>
                <p>
                  Kategoriseringen er dog ikke altid fejlfri. En overførsel eller betaling kan lande i den forkerte kategori, så I bør gennemgå tallene, før I træffer større beslutninger ud fra dem.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Hvad løser budget-apps sjældent?
                </h2>
                <p className="mb-3">
                  Budget-apps ser normalt på betalinger bagud i tid. De viser, at en forsikring eller et mobilabonnement er blevet betalt, men giver ikke nødvendigvis et samlet overblik over priser, vilkår, dækning og forskellige logins.
                </p>
                <p className="mb-3">
                  Det gør det sværere at styre de faste aftaler fremadrettet. I kan godt se beløbet på kontoen uden at vide, om aftalen stadig passer til jeres behov.
                </p>
                <p>
                  Her kan et særskilt aftaleoverblik være mere relevant. Det gælder især, hvis målet er at samle el, mobil, forsikringer og andre faste udgifter, ikke blot at kategorisere dem.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Spiir lukkede, hvad lærte det brugerne?
                </h2>
                <p className="mb-3">
                  Spiir lukkede i juni 2026. Mange brugere mistede dermed det kontooverblik og de kategorier, som de havde gjort til en fast del af deres økonomiske rutine.
                </p>
                <p className="mb-3">
                  Lukningen viste, at et digitalt økonomioverblik også afhænger af, at tjenesten fortsætter. Det er derfor fornuftigt at kunne hente sine oplysninger og have en enkel, selvstændig oversigt over de vigtigste aftaler.
                </p>
                <p>
                  Hvis I brugte Spiir, kan I læse vores guide til at finde et <A href="/spiir-alternativ">alternativ til Spiir</A>. Her gennemgår vi forskellen mellem kontooverblik og styring af faste aftaler.
                </p>

                {/* Animeret side-komponent i gradient-rammen (forsikring-side-mønstret). */}
                <div
                  className="rounded-3xl flex justify-center py-10 px-4 mt-6"
                  style={{ background: 'linear-gradient(160deg, rgba(168,224,99,0.12) 0%, rgba(26,61,34,0.05) 100%)' }}
                >
                  <BudgetAppSammenligning />
                </div>
                <p className="text-xs mt-3 text-center" style={{ color: 'rgba(26,61,34,0.5)' }}>
                  En budget-app ser bagud på forbruget. Et samlet overblik styrer de faste aftaler fremad. Illustration, ikke et skærmbillede fra appen.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Sådan vælger I det rigtige værktøj
                </h2>
                <p className="mb-3">
                  Start med at spørge, om jeres største udfordring er det variable forbrug eller de faste aftaler. Hvis I vil forstå, hvor pengene gik, er en klassisk budget-app ofte det mest oplagte valg.
                </p>
                <p className="mb-3">
                  Hvis problemet er abonnementer, policer og leverandører fordelt på forskellige logins, har I snarere brug for et samlet aftaleoverblik. Mange vil få mest værdi af begge dele, fordi værktøjerne besvarer forskellige spørgsmål.
                </p>
                <p>
                  Undersøg også, hvordan appen beskytter jeres data, hvilke konti den understøtter, om kategorier kan rettes, og om oplysninger kan eksporteres. Læs altid vilkår og privatlivspolitik, før I giver adgang til økonomiske oplysninger.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  De faste udgifter er den stille post
                </h2>
                <p className="mb-3">
                  Faste udgifter bliver let overset, fordi betalingerne kører automatisk. Mange husstande opdager glemte abonnementer, når de gennemgår kontoudtoget grundigt.
                </p>
                <p className="mb-3">
                  Se hver aftale efter mindst én gang om året. Tjek pris, brug, binding, opsigelsesvilkår og eventuelle overlap, og begynd gerne med områder som <A href="/billigste-mobilabonnement">mobilabonnementet</A> og <A href="/hvad-koster-indboforsikring">indboforsikringen</A>.
                </p>
                <p>
                  En lav pris er ikke altid det vigtigste. Dækning, datamængde, service og fleksibilitet skal passe til jeres faktiske behov, ellers kan den billigste aftale ende med at være et dårligt valg.
                </p>
              </section>
              <section>
                <h2 className="font-semibold text-base mb-3 text-balance" style={{ color: 'var(--forest)' }}>
                  Hvad skal Altid Hjem kunne?
                </h2>
                <p className="mb-3">
                  Altid Hjem er ikke bygget som en klassisk budget-app. Appen skal kunne samle hjemmets faste udgifter til el, mobil, forsikring, opladning, alarm og mad, så I får ét overblik, ét login.
                </p>
                <p className="mb-3">
                  Altid Energi er allerede aktivt som Danmarks første gebyrfrie energiselskab, uden faste gebyrer eller abonnement, og mere end 15.000 danskere er kunder. Mobil, opladning, alarm og forsikring er på vej og skal kunne indgå i Altid Hjem.
                </p>
                <p>
                  Altid Hjem er endnu ikke lanceret. I kan skrive jer på ventelisten på altidhjem.dk, hvis I vil følge udviklingen.
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
            eyebrow='De faste udgifter er den stille post'
            subtitle='Skriv dig gratis på ventelisten og få tidlig adgang, når Altid Hjem lanceres'
            source='bedste-budget-app'
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
