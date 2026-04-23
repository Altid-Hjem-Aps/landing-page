import WaitlistForm from '@/components/WaitlistForm'
import { AltidMark } from '@/components/AltidMark'

export default function BottomCta() {
  return (
    <section className="py-24 px-12" style={{ background: 'var(--forest)' }}>
      <div className="max-w-5xl mx-auto grid grid-cols-2 gap-20 items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-4" style={{ color: 'rgba(168,224,99,0.6)' }}>
            Klar til at komme med?
          </p>
          <h2
            className="font-extrabold leading-[1.15] tracking-tight text-white mb-5"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
          >
            Få besked, når Altid Hjem åbner dørene
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Tilmeld dig ventelisten i dag og få tidlig adgang, når appen lanceres. Gratis.
          </p>
        </div>

        <WaitlistForm variant="dark" id="venteliste2" />
      </div>
    </section>
  )
}
