import WaitlistForm from '@/components/WaitlistForm'
import { H2, EYEBROW, BODY } from '@/lib/typography'

interface BottomCtaProps {
  /** Small line above the heading — the front page uses the default text. */
  eyebrow?: string
  /** Subtitle under the heading — the front page uses the default text. */
  subtitle?: string
  /** Where the signup came from (e.g. 'spiir-alternativ') — stored on the signup. */
  source?: string
}

export default function BottomCta({
  eyebrow = 'Klar til at komme med?',
  subtitle = 'Tilmeld dig ventelisten i dag og få tidlig adgang, når appen lanceres. Gratis.',
  source,
}: BottomCtaProps) {
  return (
    <section className="relative lg:overflow-hidden" style={{ background: '#163223' }}>
      {/* Mobile: the app badge sits ON the seam to the Blog section above */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/app-badge.png"
        alt=""
        aria-hidden
        className="lg:hidden absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10"
        style={{ width: 'clamp(68px,5.5vw,105px)', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))' }}
      />
      <div className="relative max-w-[1377px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-center px-6 sm:px-10 lg:px-[clamp(48px,3.7vw,72px)] py-[clamp(72px,7vw,130px)]">
        {/* Left — copy */}
        <div className="text-center lg:text-left">
          <p className={`${EYEBROW} mb-5`} style={{ color: '#90ff7c' }}>
            {eyebrow}
          </p>
          <h2
            className={`${H2} text-white mb-6 mx-auto lg:mx-0`}
            style={{ maxWidth: 520 }}
          >
            Få besked, når Altid Hjem åbner dørene
          </h2>
          <p className={`${BODY} mx-auto lg:mx-0`} style={{ color: '#fff', maxWidth: 420 }}>
            {subtitle}
          </p>
        </div>

        {/* Right — signup form with the app badge on its top-right corner */}
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/app-badge.png"
            alt=""
            aria-hidden
            className="hidden lg:block absolute z-10 right-0 top-0 translate-x-1/2 -translate-y-1/2"
            style={{ width: 'clamp(68px,5.5vw,105px)', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))' }}
          />
          <WaitlistForm variant="dark" id="venteliste2" source={source} />
        </div>
      </div>
    </section>
  )
}
