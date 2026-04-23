import { AltidMark } from '@/components/AltidMark'

const steps: { n: string; title: string; desc: React.ReactNode }[] = [
  { n: '01', title: 'Tilmeld dig ventelisten', desc: 'Skriv dit navn og din e-mail, og vi holder dig opdateret.' },
  { n: '02', title: 'Få besked, når appen er klar', desc: 'Du er blandt de første til at prøve Altid Hjem.' },
  { n: '03', title: 'Vælg dine løsninger', desc: 'Sammenlign og vælg de tjenester, der passer til dit hjem.' },
  { n: '04', title: 'Én samlet regning', desc: <>Alle faste udgifter samlet ét sted, med ét login. <AltidMark dark /></> },
]

export default function HowItWorks() {
  return (
    <section className="py-16 sm:py-24 px-6 sm:px-10 lg:px-12" style={{ background: 'var(--forest)' }}>
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-4" style={{ color: 'rgba(168,224,99,0.6)' }}>
          Sådan fungerer det
        </p>
        <h2
          className="font-extrabold leading-[1.15] tracking-tight text-white mb-10 sm:mb-14"
          style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
        >
          Fire trin til overblik
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.n} className="relative">
              <div className="text-5xl font-extrabold leading-none mb-4" style={{ color: 'rgba(168,224,99,0.2)' }}>
                {step.n}
              </div>
              <p className="text-[15px] font-semibold text-white mb-2">{step.title}</p>
              <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
