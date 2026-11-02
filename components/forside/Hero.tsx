import StoreBadges from '@/components/StoreBadges'
import PhoneImage from '@/components/forside/PhoneImage'
import { HERO } from '@/lib/forside-copy'
import { H1, BODY } from '@/lib/typography'
import hjem from './img/hjem.webp'

export default function Hero() {
  return (
    <section id="top" className="focus-ring-light bg-[var(--app-paper)] pt-[128px] lg:pt-[168px] pb-14 lg:pb-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:gap-12 lg:px-12">
        <div>
          <h1 className={`${H1} text-[var(--app-forest)]`}>{HERO.title}</h1>
          <p className={`${BODY} mt-5 lg:text-[18px] text-[var(--app-ink)] max-w-[34ch]`}>{HERO.lead}</p>
          <div id="hent-appen" className="mt-8">
            <StoreBadges position="hero" />
          </div>
          <p className="mt-4 text-[14px] text-[var(--app-ink-muted)]">{HERO.note}</p>
        </div>
        {/* Forest card with the phone running off its bottom edge. On phones
            the card shows the top part of the phone, so the screen peeks
            above the fold. */}
        <div className="overflow-hidden rounded-[40px] bg-[var(--app-forest)] px-6 pt-8 lg:pt-12">
          <div className="mx-auto h-[184px] w-[260px] overflow-hidden sm:h-[212px] sm:w-[300px] lg:h-[520px] lg:w-[360px]">
            <PhoneImage src={hjem} alt={HERO.imageAlt} preload />
          </div>
        </div>
      </div>
    </section>
  )
}
