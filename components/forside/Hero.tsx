import StoreBadges from '@/components/StoreBadges'
import ScreenTour from '@/components/ScreenTour'
import { HERO } from '@/lib/forside-copy'
import { H1, BODY } from '@/lib/typography'
import { TOURS } from '@/lib/screen-captures'

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
            the copy and badges come first and the phone's top part shows above
            the fold on 390 x 844. */}
        <div>
          <div className="focus-ring-dark overflow-clip rounded-[40px] bg-[var(--app-forest)] px-6 pt-3 lg:pt-5">
            <ScreenTour
              {...TOURS.hero}
              label={HERO.imageAlt}
              priority
              tone="forest"
              windowClassName="h-[400px] sm:h-[460px] lg:h-[560px]"
              phoneClassName="mx-auto max-w-[260px] sm:max-w-[300px] lg:max-w-[360px]"
            />
          </div>
          <p className="mt-3 text-center text-[13px] text-[var(--app-ink-muted)] lg:text-right">{HERO.screensCaption}</p>
        </div>
      </div>
    </section>
  )
}
