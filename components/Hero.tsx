import WaitlistForm from '@/components/WaitlistForm'
import IPhoneMockup from '@/components/IPhoneMockup'
import { AltidMark } from '@/components/AltidMark'

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden flex flex-col"
      style={{ minHeight: '100svh', background: 'var(--forest)' }}
    >
      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: -100, right: -100, width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(168,224,99,0.1) 0%, transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: -80, left: -80, width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(143,204,255,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Spacer matching fixed nav height (py-5 + h-11 logo = 84px) */}
      <div className="h-[84px] shrink-0" />

      {/* Content centered in remaining viewport height */}
      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[5fr_6fr] gap-10 lg:gap-8 items-center">

            {/* Left: copy + form */}
            <div className="flex flex-col gap-8">
              <div className="text-center lg:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-7 animate-fade-up-1 text-[13px] leading-none items-center lg:items-start">
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <span className="font-semibold" style={{ color: 'var(--sage)' }}>+14.000</span>
                    {' '}er allerede kunde hos Altid Energi
                  </span>
                  <span className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: 'var(--sage)', animation: 'pulse-dot 2s ease-in-out infinite' }}
                    />
                    Altid Hjem kommer snart
                  </span>
                </div>
                <h1
                  className="font-extrabold leading-[1.1] tracking-tight text-white mb-6 animate-fade-up-2 text-[clamp(28px,8vw,38px)] sm:text-[clamp(38px,10vw,72px)] lg:text-[64px] xl:text-[72px]"
                >
                  <span className="block sm:inline lg:block">Snart får danskerne</span>{' '}
                  <span className="block sm:inline lg:block">
                    <em className="not-italic" style={{ color: 'var(--sage)' }}>bedre råd</em>
                  </span>{' '}
                  <span className="block sm:inline lg:block">til hjemmet</span>
                </h1>
                <p className="text-lg leading-relaxed animate-fade-up-3 mx-auto lg:mx-0" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 440 }}>
                  Altid Hjem samler hjemmets faste udgifter i én app – ét overblik, ét login, én regning. <AltidMark dark />
                </p>
              </div>

              <div id="venteliste" className="animate-fade-up-4">
                <WaitlistForm variant="light" />
              </div>
            </div>

            {/* Right: iPhone mockup. No animate-fade-up wrapper here —
                that class ends with `transform: translateY(0)`, which
                creates a containing block for `filter: blur()` and clips
                the phone's drop-shadow halo at the wrapper edges (345px
                wide on phone) instead of letting it bleed across the hero. */}
            <div className="flex items-center justify-center">
              <IPhoneMockup />
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
