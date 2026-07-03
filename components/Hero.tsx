import WaitlistForm from '@/components/WaitlistForm'
import IPhoneMockup from '@/components/IPhoneMockup'
import { H1, BODY } from '@/lib/typography'
import LiveSavingsStat from '@/components/LiveSavingsStat'

// Stats from the CVI frame (node 45:6428) — left column below the CTA.
const STATS = [
  // Desktop only — the approved mobile layout shows just the two stats below.
  { value: '0 kr.', label: 'at oprette en konto', color: '#202820', desktopOnly: true },
  { value: '+15.000', label: 'Altid Energi-kunder', color: '#202820' },
  // Live, exact amount — same source + burst behaviour as SavingsCounter.
  { value: <LiveSavingsStat />, label: 'har Altid Energi-kunder sparet', color: '#163223', tightLabel: true },
]

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden" style={{ background: '#fdfaf4' }}>
      {/* Spacer matching the fixed nav height (CTA button up to 70px + py-5). */}
      <div className="h-[112px] shrink-0" />

      {/* Wide grid as in the CVI frame: ~71px margins at 1920 (= Figma's ~95/47). */}
      <div className="max-w-[1920px] mx-auto w-full px-6 sm:px-10 lg:px-[clamp(48px,3.7vw,72px)]">
        <div className="grid grid-cols-1 lg:grid-cols-[47fr_53fr] gap-12 lg:gap-[clamp(48px,4.8vw,92px)] items-center py-12 lg:py-10 lg:min-h-[680px]">

          {/* Left: copy + form + stats */}
          <div className="flex flex-col text-center lg:text-left">
            <h1
              className={`${H1} lg:-ml-[0.05em]`}
              style={{ color: '#163223' }}
            >
              <span className="block">Snart får danskerne</span>
              <span className="block">bedre råd til hjemmet</span>
            </h1>

            <p
              className={`mt-7 ${BODY} mx-auto lg:mx-0`}
              style={{ color: '#6f6a61', maxWidth: 620 }}
            >
              {/* Two block lines: the first wraps naturally so it fills the
                  available width (text-wrap:balance made both halves equally
                  narrow); the glued tail keeps the wrap from orphaning a
                  single word. The dash line always starts its own line. */}
              <span className="block">Altid Hjem samler hjemmets faste udgifter i én løsning</span>
              <span className="block">– ét overblik, ét login, én regning. Altid.</span>
            </p>

            <div id="venteliste" className="mt-8 w-full max-w-[600px] mx-auto lg:mx-0">
              <WaitlistForm variant="light" />
            </div>

            {/* Stats row */}
            <div className="mt-20 max-lg:mt-10 grid grid-cols-[auto_auto] justify-center gap-x-8 gap-y-6 lg:flex lg:flex-nowrap lg:justify-start lg:gap-x-[clamp(28px,5.2vw,100px)]">
              {STATS.map(s => (
                <div key={s.label} className={`text-left max-lg:text-center whitespace-nowrap${s.desktopOnly ? ' hidden lg:block' : ''}`}>
                  <div
                    className="font-normal tabular-nums leading-none text-[clamp(22px,calc(20px+0.52vw),30px)]"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </div>
                  {/* 12px below lg so both one-line labels fit side by side down to 360px. */}
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
