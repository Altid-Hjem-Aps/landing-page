import ScreenTour from '@/components/ScreenTour'
import ServiceLockup from '@/components/forside/ServiceLockup'
import type { ServiceCopy } from '@/lib/forside-copy'
import type { TourData } from '@/lib/screen-captures'
import { H2 } from '@/lib/typography'

// One full-bleed band per live service. Built as a self-contained panel
// (copy, tint, tour, side) so the four can later become tabs without a
// rewrite. Every text on the tint is forest: the tints fail contrast with the
// muted greys.

const PAD = 'clamp(56px, 8vw, 112px)'

export default function ServiceSection({
  copy,
  tint,
  tour,
  phoneLeft = false,
}: {
  copy: ServiceCopy
  tint: string
  tour: TourData
  phoneLeft?: boolean
}) {
  return (
    <section
      id={copy.id}
      className="focus-ring-light overflow-clip text-[var(--app-forest)]"
      style={{ background: tint, paddingTop: PAD, paddingBottom: PAD }}
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 lg:grid-cols-2 lg:gap-12 lg:px-12">
        <div className="self-center">
          <ServiceLockup service={copy.key} name={copy.name} />
          <h2 className={`${H2} mt-6`}>{copy.title}</h2>
          <ul className="mt-7 flex flex-col gap-4">
            {copy.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-[17px] leading-[1.55]">
                <span aria-hidden className="mt-[0.6em] h-2 w-2 shrink-0 rounded-full bg-[var(--app-forest)]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          {copy.claim && (
            <div className="mt-8">
              <p className="text-[17px] font-medium">{copy.claim.text}</p>
              <p className="mt-1.5 text-[13px] leading-[1.5]">
                {copy.claim.footnoteBeforeLink}
                <a href={copy.claim.linkHref} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                  {copy.claim.linkLabel}
                </a>
                {copy.claim.footnoteAfterLink}
              </p>
            </div>
          )}
          {copy.qualification && <p className="mt-7 text-[15px] leading-[1.55]">{copy.qualification}</p>}
        </div>
        {/* The phone runs off the band's bottom edge: the negative margin
            cancels the bottom padding and the tour's window cuts the phone. */}
        <div
          className={`self-end flex justify-center ${phoneLeft ? 'lg:order-first' : ''}`}
          style={{ marginBottom: `calc(-1 * ${PAD})` }}
        >
          <ScreenTour
            {...tour}
            label={copy.imageAlt}
            windowClassName="h-[480px] lg:h-[600px]"
            phoneClassName="max-w-[300px] lg:max-w-[360px]"
          />
        </div>
      </div>
    </section>
  )
}
