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
        <div className="max-w-6xl mx-auto w-full px-6 sm:px-10 lg:px-12 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left: copy + form */}
            <div className="flex flex-col gap-8">
              <div className="text-center lg:text-left">
                <div
                  className="inline-flex items-center gap-0 text-[11px] font-medium rounded-full mb-7 animate-fade-up-1 overflow-hidden"
                  style={{
                    background: 'rgba(168,224,99,0.1)',
                    border: '1px solid rgba(168,224,99,0.25)',
                  }}
                >
                  <div
                    className="flex items-center gap-2 px-3.5 py-1.5 tracking-widest uppercase whitespace-nowrap"
                    style={{ color: 'var(--sage)' }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: 'var(--sage)', animation: 'pulse-dot 2s ease-in-out infinite' }}
                    />
                    Kommer snart
                  </div>
                  <div className="w-px self-stretch" style={{ background: 'rgba(168,224,99,0.3)' }} />
                  <div className="flex items-center gap-1.5 px-3.5 py-1.5 whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    <span className="font-semibold" style={{ color: 'var(--sage)' }}>13.000+</span>
                    <span className="hidden sm:inline">bruger allerede Altid Energi</span>
                    <span className="sm:hidden">brugere</span>
                  </div>
                </div>
                <h1
                  className="font-extrabold leading-[1.1] tracking-tight text-white mb-6 animate-fade-up-2 text-[clamp(30px,8vw,50px)] lg:text-[40px] xl:text-[46px]"
                >
                  <span className="lg:block">Snart får danskerne</span>{' '}
                  <span className="lg:block">
                    <em className="not-italic" style={{ color: 'var(--sage)' }}>bedre råd</em>
                  </span>{' '}
                  <span className="lg:block">til hjemmet</span>
                </h1>
                <p className="text-lg leading-relaxed animate-fade-up-3 mx-auto lg:mx-0" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 440 }}>
                  Altid Hjem samler hjemmets faste udgifter i én app – ét overblik, ét login, én regning. <AltidMark dark />
                </p>
              </div>

              <div id="venteliste" className="animate-fade-up-4">
                <WaitlistForm variant="light" />
              </div>
            </div>

            {/* Right: iPhone mockup */}
            <div className="flex items-center justify-center animate-fade-up-3">
              <IPhoneMockup />
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
