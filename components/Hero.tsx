import StoreBadges from '@/components/StoreBadges'
import IPhoneMockup from '@/components/IPhoneMockup'
import { STORE_ANCHOR } from '@/lib/store-links'
import { H1, BODY } from '@/lib/typography'
// DISABLED 8 Sep 2026: same live "total saved" number as SavingsCounter, hidden
// for the same reason (Consumer Ombudsman notice to Altid Energi). See the note
// in app/page.tsx. Restore this import and the STATS entry below to re-enable.
// import LiveSavingsStat from '@/components/LiveSavingsStat'

// Stats from the CVI frame (node 45:6428) — left column below the CTA.
type Stat = {
  value: React.ReactNode
  label: string
  color: string
  desktopOnly?: boolean
  tightLabel?: boolean
}
const STATS: Stat[] = [
  // Desktop only — the approved mobile layout shows only the stat(s) below.
  { value: '0 kr.', label: 'at oprette en konto', color: '#202820', desktopOnly: true },
  { value: '+15.000', label: 'Altid Energi-kunder', color: '#202820' },
  // Live, exact amount — same source + burst behaviour as SavingsCounter.
  // { value: <LiveSavingsStat />, label: 'har Altid Energi-kunder sparet', color: '#163223', tightLabel: true },
]

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden" style={{ background: '#fdfaf4' }}>
      {/* Spacer matching the fixed nav height (66px CTA + py-5 + border). */}
      <div className="h-[108px] shrink-0" />

      {/* Wide grid as in the CVI frame: ~71px margins at 1920 (= Figma's ~95/47). */}
      <div className="max-w-[1920px] mx-auto w-full px-6 sm:px-10 lg:px-[clamp(48px,3.7vw,72px)]">
        <div className="grid grid-cols-1 lg:grid-cols-[47fr_53fr] gap-12 lg:gap-[clamp(48px,4.8vw,92px)] items-center py-12 lg:py-10 lg:min-h-[680px]">

          {/* Left: copy + store pills + stats */}
          <div className="flex flex-col text-center lg:text-left">
            <h1
              className={`${H1} lg:-ml-[0.05em]`}
              style={{ color: '#163223' }}
            >
              {/* Balanced so it stays two lines: "Hele hjemmets økonomi" alone does
                  not fit the column at most widths and left "økonomi" on its own. */}
              <span className="block [text-wrap:balance]">Hele hjemmets økonomi i én app</span>
            </h1>

            <p
              className={`mt-7 ${BODY} lg:text-[18px] mx-auto lg:mx-0`}
              style={{ color: '#6f6a61', maxWidth: 620 }}
            >
              {/* Desktop: two lines with the second forced onto its own line.
                  Phones: one naturally flowing paragraph. */}
              <span className="lg:block">Altid Hjem samler hjemmets faste udgifter i én løsning:</span>
              {' '}
              <span className="lg:block">ét overblik, ét login. <span style={{ color: '#163223' }}>Altid.</span></span>
            </p>

            {/* The target of every "Hent appen" control on the page. The scroll
                margin keeps the pills clear of the fixed nav. */}
            <div id={STORE_ANCHOR} className="mt-8 scroll-mt-[140px]">
              <StoreBadges position="hero" className="justify-center lg:justify-start" />
            </div>

            {/* Stats row. Centered flex (not a 2-col grid) so it stays centered
                on phones with one OR two stats — see the LiveSavingsStat note. */}
            <div className="mt-20 max-lg:mt-10 flex flex-wrap justify-center gap-x-8 gap-y-6 lg:flex-nowrap lg:justify-start lg:gap-x-[clamp(28px,5.2vw,100px)]">
              {STATS.map(s => (
                <div key={s.label} className={`text-left max-lg:text-center whitespace-nowrap${s.desktopOnly ? ' hidden lg:block' : ''}`}>
                  <div
                    className="font-normal tabular-nums leading-none text-[clamp(22px,calc(20px+0.52vw),30px)]"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </div>
                  {/* 12px below lg so two one-line labels fit side by side down to 360px. */}
                  <div className={`mt-2.5 text-[clamp(13px,0.85vw,16px)] max-lg:text-[12px] leading-snug${s.tightLabel ? ' max-lg:tracking-[-0.01em]' : ''}`} style={{ color: '#6f6a61' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: our existing iPhone mockup (not the Figma phones) */}
          <div className="flex items-center justify-center">
            <IPhoneMockup />
          </div>

        </div>
      </div>
    </section>
  )
}
