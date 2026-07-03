import { Logo } from '@/components/Logo'
import { H2, EYEBROW, BODY } from '@/lib/typography'

// Blue → green "we've done this before" section: Altid Energi (deep blue,
// credibility quote) evolving into Altid Hjem (forest green, promise). The two
// brand wordmarks sit at the bottom, bridged by a run of dots that fade from
// slate to signal-green across the seam.

const BLUE = '#022f6f'
const FOREST = '#193d23'
const ENERGI_CYAN = '#73d0e7'

// Green connector line — 5 equal-size dots that pulse opacity in a staggered
// loop, each peaking at its own max (20% → 100% toward the green/hjem side) so
// a highlight flows along the line while brightening from energi to hjem.
const DOT_MAX = [0.2, 0.4, 0.6, 0.8, 1]

function Dots({ className = '', vertical = false }: { className?: string; vertical?: boolean }) {
  return (
    <div className={`flex ${vertical ? 'flex-col items-center' : 'items-center'} gap-2.5 ${className}`} aria-hidden>
      {DOT_MAX.map((max, i) => (
        <span
          key={i}
          style={{
            width: 11,
            height: 11,
            borderRadius: 999,
            background: '#90ff7c',
            ['--dot-max' as string]: max,
            animation: 'dot-flow 2.6s linear infinite',
            animationDelay: `${i * 0.22}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

// eslint-disable-next-line @next/next/no-img-element
const EnergiLogo = ({ className }: { className?: string }) => <img src="/altidenergi-logo-white.svg" alt="Altid Energi" className={className} />

export default function Trust() {
  return (
    <section className="relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* Left — Altid Energi (blue). Extra bottom padding on lg reserves room
            for the seam-bridge strip so the gap above it ≈ eyebrow→text. */}
        <div
          className="relative flex flex-col px-[clamp(28px,4.6vw,92px)] pt-[clamp(64px,7.8vw,150px)] pb-[clamp(56px,7vw,120px)] max-lg:pb-16 lg:pb-[clamp(150px,10.9vw,210px)]"
          style={{ background: BLUE }}
        >
          <p className={`${EYEBROW} mb-8`} style={{ color: ENERGI_CYAN }}>
            +15.000 tilfredse danske kunder
          </p>
          {/* Hanging quote mark: text-indent pulls the opening " into the margin
              so the text aligns at the left edge, like the FounderVideo quote. */}
          {/* The Figma 4-line wrap is only forced from 1720px, where each line
              genuinely fits the column (widest line = 741px vs 783px column at
              1920, both scale ~linearly → fits from ~1710px); below that the
              breaks would collide with natural wrapping (orphan words), so the
              text wraps freely with text-wrap:balance keeping lines even. */}
          <blockquote
            className="font-normal text-white leading-[1.2] text-[clamp(28px,calc(22.4px+1.44vw),50px)] [text-wrap:balance]"
            style={{ textIndent: '-0.42em' }}
          >
            <span style={{ letterSpacing: '-0.02em' }}>&ldquo;Vi startede med at gøre op med{' '}</span><br className="hidden min-[1720px]:block" />
            <span style={{ letterSpacing: '0.04em' }}>skjulte gebyrer i elmarkedet.{' '}</span><br className="hidden min-[1720px]:block" />
            <span style={{ letterSpacing: '0em' }}>Nu gør vi det samme på tværs{' '}</span><br className="hidden min-[1720px]:block" />
            <span style={{ letterSpacing: '0em' }}>af alle hjemmets faste udgifter.&rdquo;</span>
          </blockquote>

          {/* Mobile: centered logo; the dot line hangs on the seam below. */}
          <div className="lg:hidden mt-10 flex justify-center">
            <EnergiLogo className="h-12 w-auto" />
          </div>

          {/* Mobile: vertical dot line straddling the seam — the middle dot
              lands exactly on the border between the blue and green boxes. */}
          <div className="lg:hidden absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
            <Dots vertical />
          </div>
        </div>

        {/* Right — Altid Hjem (green) */}
        <div
          className="flex flex-col px-[clamp(28px,4.6vw,92px)] pt-[clamp(64px,7.8vw,150px)] max-lg:pt-16 pb-[clamp(56px,7vw,120px)] lg:pb-[clamp(150px,10.9vw,210px)]"
          style={{ background: FOREST }}
        >
          {/* Mobile: the Altid Hjem logo receives the dot line from above. */}
          <div className="lg:hidden mb-9 flex justify-center">
            <Logo variant="forest" className="h-12 w-auto" />
          </div>
          <p className={`${EYEBROW} mb-6`} style={{ color: '#90ff7c' }}>
            Vi har gjort det før
          </p>
          <h2 className={`${H2} text-white mb-6`}>
            Fair, gennemsigtigt og billigt
          </h2>
          <p className={BODY} style={{ color: '#fff', maxWidth: 560 }}>
            Altid Hjem er skabt af teamet bag Altid Energi, som gjorde op med skjulte gebyrer i elmarkedet. Med over 15.000 kunder har vi bevist, at fair og gennemsigtige priser virker. Nu tager vi samme tilgang til hjemmets faste udgifter, så du altid ved, hvad du betaler for, og hvorfor. Ingen skjulte gebyrer. Fuld gennemsigtighed. Altid.
          </p>

        </div>
      </div>

      {/* Desktop: energi → dots → hjem bridged across the seam, at the bottom. */}
      <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 bottom-[clamp(44px,4.8vw,92px)] items-center gap-[clamp(20px,2.2vw,34px)]">
        <EnergiLogo className="h-[clamp(38px,3.2vw,56px)] w-auto" />
        <Dots />
        <Logo variant="forest" className="h-[clamp(38px,3.2vw,56px)] w-auto" />
      </div>
    </section>
  )
}
