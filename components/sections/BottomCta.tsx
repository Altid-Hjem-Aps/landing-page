import NewsletterForm from '@/components/NewsletterForm'
import StoreBadges from '@/components/StoreBadges'
import { H2, EYEBROW, BODY } from '@/lib/typography'

interface BottomCtaProps {
  /** Small line above the heading. */
  eyebrow: string
  heading: string
  /** One sentence under the heading. */
  subtitle: string
}

// The SEO pages' closing section: the article, then the store pills, then the
// newsletter. id hent-appen is where the campaign banner in the nav scrolls to.
export default function BottomCta({ eyebrow, heading, subtitle }: BottomCtaProps) {
  return (
    <section id="hent-appen" className="focus-ring-dark relative lg:overflow-hidden" style={{ background: '#163223' }}>
      {/* Mobile: the app badge sits ON the seam to the section above */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/app-badge.png"
        alt=""
        aria-hidden
        className="lg:hidden absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10"
        style={{ width: 'clamp(68px,5.5vw,105px)', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))' }}
      />
      <div className="relative max-w-[1377px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-center px-6 sm:px-10 lg:px-[clamp(48px,3.7vw,72px)] py-[clamp(72px,7vw,130px)]">
        <div className="text-center lg:text-left">
          <p className={`${EYEBROW} mb-5`} style={{ color: '#90ff7c' }}>
            {eyebrow}
          </p>
          <h2 className={`${H2} text-white mb-6 mx-auto lg:mx-0`} style={{ maxWidth: 520 }}>
            {heading}
          </h2>
          <p className={`${BODY} mx-auto lg:mx-0`} style={{ color: '#fff', maxWidth: 420 }}>
            {subtitle}
          </p>
          <StoreBadges position="bottom" variant="dark" className="mt-8 justify-center lg:justify-start" />
        </div>
        <div className="relative flex justify-center lg:justify-end">
          <NewsletterForm />
        </div>
      </div>
    </section>
  )
}
