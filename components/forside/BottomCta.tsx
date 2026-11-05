import Link from 'next/link'
import NewsletterForm from '@/components/NewsletterForm'
import StoreBadges from '@/components/StoreBadges'
import { BOTTOM } from '@/lib/forside-copy'
import { H2 } from '@/lib/typography'

export default function BottomCta() {
  return (
    <section id="hent" className="focus-ring-dark bg-[var(--app-forest)] py-20 lg:py-28">
      <div className="mx-auto flex max-w-[760px] flex-col items-center px-6 text-center">
        <h2 className={`${H2} text-white`}>{BOTTOM.title}</h2>
        <p className="mt-5 text-[17px] leading-[1.6] text-white/80">{BOTTOM.lead}</p>
        <StoreBadges position="bottom" variant="dark" className="mt-9 justify-center" />
        <p className="mt-8 text-[15px] leading-[1.6] text-white/72">
          {BOTTOM.shareLead}
          <Link href={BOTTOM.shareHref} className="text-white underline underline-offset-2">
            {BOTTOM.shareLabel}
          </Link>
        </p>
        <NewsletterForm className="mt-14 border-t border-white/15 pt-10" />
      </div>
    </section>
  )
}
