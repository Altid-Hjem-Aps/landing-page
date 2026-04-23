import WaitlistForm from '@/components/WaitlistForm'
import IPhoneMockup from '@/components/IPhoneMockup'
import { AltidMark } from '@/components/AltidMark'

export default function Hero() {
  return (
    <section
      id="top"
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'var(--forest)' }}
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

      <div className="max-w-6xl mx-auto px-12 pt-36 pb-20">
        <div className="grid grid-cols-2 gap-16 items-center">

          {/* Left: copy + form */}
          <div className="flex flex-col gap-8">
            <div>
              <div
                className="inline-flex items-center gap-0 text-[11px] font-medium rounded-full mb-7 animate-fade-up-1 overflow-hidden"
                style={{
                  background: 'rgba(168,224,99,0.1)',
                  border: '1px solid rgba(168,224,99,0.25)',
                }}
              >
                {/* Left: Kommer snart */}
                <div
                  className="flex items-center gap-2 px-3.5 py-1.5 tracking-widest uppercase"
                  style={{ color: 'var(--sage)' }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: 'var(--sage)', animation: 'pulse-dot 2s ease-in-out infinite' }}
                  />
                  Kommer snart
                </div>
                {/* Divider */}
                <div className="w-px self-stretch" style={{ background: 'rgba(168,224,99,0.3)' }} />
                {/* Right: social proof */}
                <div className="flex items-center gap-1.5 px-3.5 py-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  <span className="font-semibold" style={{ color: 'var(--sage)' }}>13.000+</span>
                  bruger allerede Altid Energi
                </div>
              </div>
              <h1
                className="text-5xl font-extrabold leading-[1.1] tracking-tight text-white mb-6 animate-fade-up-2"
                style={{ fontSize: 'clamp(36px, 4vw, 56px)' }}
              >
                Snart får danskerne{' '}
                <em className="not-italic" style={{ color: 'var(--sage)' }}>bedre råd</em>{' '}
                til hjemmet
              </h1>
              <p className="text-lg leading-relaxed animate-fade-up-3" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 440 }}>
                Altid Hjem samler hjemmets faste udgifter i én app, med ét login og én regning – så du sparer tid og penge. <AltidMark dark />
              </p>
            </div>

            <div id="venteliste" className="animate-fade-up-4">
              <WaitlistForm variant="light" />
            </div>
          </div>

          {/* Right: iPhone mockup */}
          <div className="flex items-center justify-center pt-8 animate-fade-up-3">
            <IPhoneMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
