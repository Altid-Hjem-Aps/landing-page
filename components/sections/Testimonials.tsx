'use client'

import { useAutoCarousel, useCarouselReveal, CarouselPagination } from '@/components/useAutoCarousel'
import { EYEBROW } from '@/lib/typography'

// Quotes from people who use the app. The first four signed up before launch (3 Jul 2026) and
// updated their words now that they have the app; Mie is new. ChatGPT drafted the wording from
// what each person cared about, and each person approved their quote (Thor, 14 Nov 2026).
// `initials` is unused since the photo panel was cut from the card design, kept in case it returns.
export interface Testimonial {
  quote: string
  name: string
  job: string
  initials: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Jeg fik Altid Hjem anbefalet, og nu bruger jeg appen til at få et bedre overblik over vores økonomi hjemme hos os.',
    name: 'Lone',
    job: 'Optometrist',
    initials: 'L',
  },
  {
    quote: 'Jeg er træt af skjulte gebyrer og aftaler, der er svære at gennemskue. Med Altid Hjem har jeg fået mere overblik over mine faste udgifter.',
    name: 'Kenneth Knudsen',
    job: 'Ingeniør',
    initials: 'KK',
  },
  {
    quote: 'Det er rart at have ét samlet overblik over hjemmets faste udgifter i Altid Hjem. Jeg synes hurtigt, at abonnementer og aftaler bliver svære at holde styr på.',
    name: 'Magnus Svendsen',
    job: 'Folkeskolelærer',
    initials: 'MS',
  },
  {
    quote: 'Jeg er stadig irriteret over det voksende antal gebyrer i Danmark. Jeg bruger Altid Hjem til at holde bedre styr på, hvad jeg betaler til hver måned.',
    name: 'Michael',
    job: 'Iværksætter',
    initials: 'M',
  },
  {
    quote: 'Det er især budgettet i Altid Hjem, jeg bruger. Det hjælper mig med at få overblik over min egen økonomi.',
    name: 'Mie',
    job: 'Studerende',
    initials: 'M',
  },
]

// The track renders the testimonials three times so the carousel can loop
// seamlessly (see useAutoCarousel).
const N = TESTIMONIALS.length
const LOOP = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS]

function Stars() {
  return (
    <div role="img" className="flex items-center gap-[1px]" aria-label="5 ud af 5 stjerner">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="19" height="18" viewBox="0 0 20 19" fill="#193d23" aria-hidden>
          <path d="M10 0l2.59 6.06 6.41.54-4.87 4.34 1.46 6.46L10 14.6l-5.59 3.4 1.46-6.46L1 7.2l6.41-.54L10 0z" />
        </svg>
      ))}
    </div>
  )
}

// Figma node 182:540 — no photo panel, full-width white card: stars, quote
// (18px), name+job (16px) stacked with generous padding. Shadow matches the
// Blog post cards (soft resting shadow, deeper on hover).
function Card({ t, clone = false, revealStyle }: { t: Testimonial; clone?: boolean; revealStyle?: React.CSSProperties }) {
  return (
    <article
      aria-hidden={clone || undefined}
      className="snap-center shrink-0 w-[88vw] max-w-[640px] min-h-[220px] flex flex-col justify-between gap-5 overflow-hidden rounded-[20px] border border-[#e6e2d8] bg-white px-6 py-5 transition-shadow hover:shadow-[0_14px_34px_rgba(15,55,30,0.12)]"
      style={{ boxShadow: '0 6px 18px rgba(0,0,0,0.05)', ...revealStyle }}
    >
      <Stars />
      {/* Hanging quote mark, same trick as FounderVideo/Trust: text-indent
          pulls the opening " into the margin so the text below aligns flush. */}
      <p className="text-[18px] leading-snug text-[#193d23]" style={{ textIndent: '-0.42em' }}>
        &quot;{t.quote}&quot;
      </p>
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
        <span className="text-[16px] text-[#193d23] whitespace-nowrap">{t.name}</span>
        <span className="text-[16px]" style={{ color: 'rgba(25,61,35,0.72)' }}>{t.job}</span>
      </div>
    </article>
  )
}

export default function Testimonials() {
  const carousel = useAutoCarousel(N)
  const { trackRef, onScroll, cancelGlide } = carousel
  const reveal = useCarouselReveal(trackRef, carousel.reduced, N, carousel.demoNudge)

  return (
    <section className="py-16 sm:py-20" style={{ background: '#fff' }}>
      <p className={`${EYEBROW} mx-auto max-w-[960px] px-6 text-center`} style={{ color: '#163223' }}>
        Hør, hvad danskerne siger om Altid Hjem
      </p>

      {/* Centred snap carousel, same behaviour as the Blog: the active card
          sits centred with neighbours peeking in from both sides. */}
      <div
        ref={trackRef}
        // Keyboard users can focus the track and scroll it with arrow keys.
        role="region"
        aria-label="Udtalelser"
        tabIndex={0}
        onScroll={onScroll}
        onPointerDown={cancelGlide}
        onWheel={cancelGlide}
        onTouchStart={cancelGlide}
        className="mt-10 flex gap-[50px] overflow-x-auto snap-x snap-mandatory pt-4 pb-8 px-[max(6vw,calc((100vw-640px)/2))] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {LOOP.map((t, i) => {
          // Clone sets exist only for the seamless loop — hide them from AT.
          const clone = i < N || i >= 2 * N
          return <Card key={`${t.name}-${i}`} t={t} clone={clone} revealStyle={reveal(i)} />
        })}
      </div>

      {/* Apple-gallery pagination: active dot = loading pill + pause toggle.
          Track already carries pb-8 so card shadows don't clip — keep this
          gap small to avoid doubling up the spacing. */}
      <div className="mt-2">
        <CarouselPagination count={N} carousel={carousel} itemLabel={(i) => `Gå til udtalelse ${i + 1}`} />
      </div>
    </section>
  )
}
