import WaitlistForm from '@/components/WaitlistForm'
import { AltidMark } from '@/components/AltidMark'

interface BottomCtaProps {
  /** Lille overlinje over overskriften — forsiden bruger standardteksten. */
  eyebrow?: string
  /** Undertekst under overskriften — forsiden bruger standardteksten. */
  subtitle?: string
  /** Hvor tilmeldingen kom fra (fx 'spiir-alternativ') — gemmes på signup'et. */
  source?: string
}

export default function BottomCta({
  eyebrow = 'Klar til at komme med?',
  subtitle = 'Tilmeld dig ventelisten i dag og få tidlig adgang, når appen lanceres. Gratis.',
  source,
}: BottomCtaProps) {
  return (
    <section className="py-16 sm:py-24 px-6 sm:px-10 lg:px-12" style={{ background: 'var(--forest)' }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="text-center lg:text-left">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-4" style={{ color: 'rgba(168,224,99,0.6)' }}>
            {eyebrow}
          </p>
          <h2
            className="font-extrabold leading-[1.15] tracking-tight text-white mb-5"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
          >
            Få besked, når Altid Hjem åbner dørene
          </h2>
          <p className="text-lg leading-relaxed mx-auto lg:mx-0" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 420 }}>
            {subtitle}
          </p>
        </div>

        <WaitlistForm variant="dark" id="venteliste2" source={source} />
      </div>
    </section>
  )
}
