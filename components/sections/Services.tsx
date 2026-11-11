'use client'

import { useEffect, useRef, useState } from 'react'
import { fluid } from '@/lib/fluid'
import { REVEAL_SPRING } from '@/lib/motion'
import { H2, EYEBROW, BODY } from '@/lib/typography'


// "Hvad finder du i appen?": the Altid subbrands that are in the app, as white
// cards, each with its official logo lockup (round icon + "altid" +
// subbrand wordmark) and a one-line, transparency-focused description.
//
// Logo assets live in /public/services. Energi ships as a single flattened
// lockup SVG; the others are composed from a round icon SVG + the coloured
// "altid" wordmark SVG + the subbrand word set in Afacad (the brand font).

type Split = {
  icon: string
  altid: string
  /** subbrand word, e.g. "alarm" */
  word: string
  /** brand colour for the subbrand word (matches the "altid" wordmark) */
  color: string
}

type Service = {
  label: string
  desc: string
  /** flattened lockup SVG (used by Energi) */
  full?: string
  /** composed lockup pieces (used by everyone else) */
  logo?: Split
  /** lit-bulb overlay SVG, faded in on light-up (Energi) */
  bulb?: string
}

const services: Service[] = [
  {
    label: 'Altid Energi',
    desc: '+15.000 kunder. Gennemsigtig strøm til fair pris. ',
    full: '/services/altid-energi.svg',
    bulb: '/services/altid-energi-bulb.svg',
  },
  {
    label: 'Altid Forsikring',
    desc: 'Gennemsigtige forsikringer uden skjulte vilkår. ',
    logo: { icon: '/services/icon-forsikring.svg', altid: '/services/altid-forsikring.svg', word: 'forsikring', color: '#a7d3f9' },
  },
  {
    label: 'Altid Mad',
    desc: 'Nem madplanlægning tilpasset din husstand. ',
    logo: { icon: '/services/icon-mad.svg', altid: '/services/altid-mad.svg', word: 'mad', color: '#3E6924' },
  },
]

function Lockup({ service, lit }: { service: Service; lit: boolean }) {
  if (service.full) {
    // self-start + w-auto so the flattened lockup keeps its intrinsic width and
    // left-aligns, instead of stretching to the full card width (which made the
    // centred SVG look indented).
    return (
      <div className="relative self-start w-auto shrink-0" style={{ height: fluid(52, 40) }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={service.full} alt={service.label} className="w-auto h-full" />
        {service.bulb && (
          // Lit-bulb overlay, aligned exactly over the icon (same viewBox); fades
          // in with a glow on light-up.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={service.bulb} alt="" className={`energi-bulb-overlay absolute inset-0 w-auto h-full pointer-events-none${lit ? ' is-lit' : ''}`} />
        )}
      </div>
    )
  }
  const { icon, altid, word, color } = service.logo!
  return (
    <div className="flex items-center shrink-0" style={{ gap: fluid(14, 11) }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icon} alt="" style={{ width: fluid(52, 40), height: fluid(52, 40) }} className="shrink-0" />
      {/* Wordmark: "altid" stacked over the subbrand word (right-aligned), with a
          gap that matches the flattened Altid Energi lockup so they don't clash. */}
      <div className="flex flex-col items-end shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={altid} alt={service.label} className="shrink-0" style={{ width: fluid(84, 64) }} />
        <span
          className="leading-none whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-afacad)',
            fontSize: fluid(20, 15),
            color,
          }}
        >
          {word}
        </span>
      </div>
    </div>
  )
}

export default function Services() {
  const gridRef = useRef<HTMLDivElement>(null)
  const reduceRef = useRef(false)
  const [revealed, setRevealed] = useState(false)
  const [bulbLit, setBulbLit] = useState(false)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    reduceRef.current = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    // Reveal immediately if motion is reduced or IntersectionObserver is missing.
    if (reduceRef.current || typeof IntersectionObserver === 'undefined') {
      setRevealed(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Once the cards have settled, the Energi bulb lights up.
  useEffect(() => {
    if (!revealed || reduceRef.current) return
    const t = setTimeout(() => setBulbLit(true), 1000)
    return () => clearTimeout(t)
  }, [revealed])

  return (
    // Cream section (Thor, 9 Sep): the same text colours the site uses on its
    // white and cream sections (WhatIs, HowItWorks): muted eyebrow and body, ink heading.
    <section id="tjenester" className="scroll-mt-24" style={{ background: '#f4efe6' }}>
      <div
        className="max-w-[1920px] mx-auto"
        style={{ paddingLeft: fluid(48, 24), paddingRight: fluid(48, 24), paddingTop: fluid(120, 64), paddingBottom: fluid(120, 64) }}
      >
        <p
          className={`${EYEBROW} text-center mb-4`}
          style={{ color: '#6f6a61' }}
        >
          Tjenesterne
        </p>
        <h2 className={`${H2} text-center`} style={{ color: '#163223' }}>
          Hvad finder du i appen?
        </h2>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto"
          style={{ gap: fluid(24, 16), maxWidth: 'min(1377px, max(76vw, 340px))', marginTop: fluid(56, 40) }}
        >
          {services.map((s, i) => (
            <div
              key={s.label}
              className="bg-white flex flex-col"
              style={{
                gap: fluid(14, 12),
                padding: fluid(26, 22),
                borderRadius: fluid(20, 16),
                boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
                // Container so the description can size to the card width (below).
                containerType: 'inline-size',
                // On-scroll reveal: fade + rise, staggered per card.
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'none' : 'translateY(24px)',
                transition: reduceRef.current
                  ? 'none'
                  : `opacity 0.5s ease ${i * 70}ms, transform 0.6s ${REVEAL_SPRING} ${i * 70}ms`,
                willChange: 'opacity, transform',
              }}
            >
              <Lockup service={s} lit={bulbLit} />
              {/* Shrinks with the card so the longest description stays on ONE line;
                  caps at 16px on the widest cards. */}
              <p className="leading-[1.4] whitespace-nowrap" style={{ fontSize: 'min(16px, 4cqw)', letterSpacing: '-0.01em', color: '#4a5a4e' }}>
                {s.desc}
                <span className="font-medium" style={{ color: '#1a3d24' }}>Altid.</span>
              </p>
            </div>
          ))}
        </div>

        <p
          className={`text-center mx-auto ${BODY}`}
          style={{ color: '#6f6a61', maxWidth: fluid(923, 720), marginTop: fluid(48, 36) }}
        >
          Nøje udvalgte tjenester til hjemmet, valgt på baggrund af kvalitet, pris og gennemsigtighed.
        </p>
      </div>
    </section>
  )
}
