'use client'

import Link from 'next/link'
import { useAutoCarousel, useCarouselReveal, CarouselPagination } from '@/components/useAutoCarousel'
import { POSTS, type Post } from './blogPosts'

// Blog strip — the "read more" section linking to the SEO pages.
// A centred snap carousel of large post cards (like the Figma frame, where the
// cards overflow the viewport with dots below — on desktop too). Several cards
// can point at the same SEO page from different angles; the chip icon matches
// the post's topic. Loop/autoplay/pagination live in useAutoCarousel.


// The track renders the posts three times so the carousel can loop seamlessly
// (see useAutoCarousel).
const N = POSTS.length
const LOOP = [...POSTS, ...POSTS, ...POSTS]

// Autoplay interval — the active dot's progress fill loads over this time,
// then the carousel slides to the next card (Apple-gallery pagination).
const AUTO_MS = 5000

export function PostCard({ post, clone = false }: { post: Post; clone?: boolean }) {
  return (
    <Link
      tabIndex={clone ? -1 : undefined}
      href={post.href}
      className="flex flex-col w-full transition-transform hover:-translate-y-0.5"
      style={{
        borderRadius: 24,
        background: '#ffffff',
        border: '1px solid rgba(22,50,35,0.12)',
        boxShadow: '0 6px 18px rgba(0,0,0,0.05)',
        padding: 'clamp(24px,1.8vw,34px)',
      }}
    >
      {/* Category chip */}
      <div className="flex items-center gap-3 mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.icon}
          alt=""
          loading="lazy"
          decoding="async"
          className="shrink-0"
          style={{
            width: 'clamp(34px,2.3vw,44px)',
            height: 'clamp(34px,2.3vw,44px)',
            borderRadius: 10,
          }}
        />
        <span className="text-[13px] font-medium uppercase" style={{ color: '#163223', letterSpacing: '1.2px' }}>
          {post.category}
        </span>
      </div>

      <h3
        className="font-bold leading-[1.15] tracking-[-0.02em] text-[clamp(21px,1.6vw,28px)] mb-3.5"
        style={{ color: '#003c16', fontFamily: 'var(--display)' }}
      >
        {post.title}
      </h3>
      <p className="font-normal text-[clamp(14px,0.85vw,16px)] leading-[1.7] mb-7" style={{ color: '#6f6a61' }}>
        {post.excerpt}
      </p>

      {/* Footer — meta left, "read more" pill right */}
      <div className="mt-auto flex items-center justify-between gap-4">
        <span className="text-[clamp(13px,0.8vw,15px)]" style={{ color: '#6f6a61' }}>
          {post.meta}
        </span>
        <span
          className="shrink-0 inline-flex items-center gap-2 rounded-full text-[clamp(13px,0.85vw,16px)] font-medium"
          style={{
            background: '#90ff7c',
            color: '#163223',
            padding: 'clamp(9px,0.7vw,13px) clamp(18px,1.3vw,25px)',
          }}
        >
          Læs mere
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

export default function Blog() {
  const carousel = useAutoCarousel(N, AUTO_MS)
  const { trackRef, onScroll, cancelGlide } = carousel
  const reveal = useCarouselReveal(trackRef, carousel.reduced, N, carousel.demoNudge)

  return (
    <section className="py-20 sm:py-28" style={{ background: '#ffffff' }}>
      <div className="text-center mb-12 sm:mb-14 px-6">
        <h2 className="t-h2">Læs mere om Altid Hjem</h2>
      </div>

      {/* Snap carousel — large cards (≈720px @1920) that overflow the viewport,
          on all breakpoints, like the Figma. snap-center + symmetric edge
          padding = the active card always sits centered on the page, with its
          neighbours peeking in from both sides. */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerDown={cancelGlide}
        onWheel={cancelGlide}
        onTouchStart={cancelGlide}
        className="flex gap-[clamp(16px,2.5vw,48px)] overflow-x-auto snap-x snap-mandatory pt-4 pb-14 px-[max(7vw,calc((100vw-520px)/2))] lg:px-[calc((100vw-clamp(560px,37.5vw,760px))/2)]"
        style={{ scrollbarWidth: 'none' }}
      >
        {LOOP.map((p, i) => {
          // Only the middle set lives in the accessibility tree — the clone
          // sets exist purely for the seamless loop and would otherwise give
          // keyboard/screen-reader users every post three times.
          const clone = i < N || i >= 2 * N
          return (
            <div
              key={`${p.href}-${i}`}
              aria-hidden={clone || undefined}
              className="snap-center shrink-0 flex w-[86vw] max-w-[520px] lg:max-w-none lg:w-[clamp(560px,37.5vw,760px)]"
              style={reveal(i)}
            >
              <PostCard post={p} clone={clone} />
            </div>
          )
        })}
      </div>

      {/* Apple-gallery pagination: active dot = loading pill + pause toggle */}
      <div className="mt-1">
        <CarouselPagination count={N} carousel={carousel} itemLabel={(i) => `Gå til indlæg ${i + 1}`} />
      </div>
    </section>
  )
}
