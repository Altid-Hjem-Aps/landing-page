'use client'

import { CarouselPagination, useAutoCarousel, useCarouselReveal } from '@/components/useAutoCarousel'
import { TESTIMONIALS } from '@/components/sections/Testimonials'
import { PROOF } from './copy'

// The testimonial slider from the old front page (components/sections/Testimonials.tsx), in
// the new look: Sand cards, Deep forest text. No stars: these are people's own words, not
// App Store ratings. The quote about signing up before launch stays out: the app is out.
const VOICES = TESTIMONIALS.filter((t) => !/skrevet mig op/i.test(t.quote))
const N = VOICES.length
const LOOP = [...VOICES, ...VOICES, ...VOICES]

export default function Voices() {
  const carousel = useAutoCarousel(N)
  const { trackRef, onScroll, cancelGlide } = carousel
  const reveal = useCarouselReveal(trackRef, carousel.reduced, N, carousel.demoNudge)

  return (
    <div className="v">
      <div
        ref={trackRef}
        role="region"
        aria-label={PROOF.voicesLabel}
        tabIndex={0}
        onScroll={onScroll}
        onPointerDown={cancelGlide}
        onWheel={cancelGlide}
        onTouchStart={cancelGlide}
        className="v-track"
      >
        {LOOP.map((t, i) => {
          // The clone sets exist only for the seamless loop.
          const clone = i < N || i >= 2 * N
          return (
            <figure key={`${t.name}-${i}`} aria-hidden={clone || undefined} className="v-card" style={reveal(i)}>
              <blockquote className="v-quote">“{t.quote}”</blockquote>
              <figcaption className="v-who">
                <span className="v-name">{t.name}</span> {t.job}
              </figcaption>
            </figure>
          )
        })}
      </div>
      <CarouselPagination count={N} carousel={carousel} itemLabel={PROOF.voiceLabel} />
    </div>
  )
}
