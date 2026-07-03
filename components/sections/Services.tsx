'use client'

import { useEffect, useRef, useState } from 'react'
import { fluid } from '@/lib/fluid'
import { H2, EYEBROW, BODY } from '@/lib/typography'

// Spring-ish easing for the on-scroll card reveal (slight overshoot on settle).
const REVEAL_SPRING = 'cubic-bezier(0.34, 1.2, 0.64, 1)'

// "Hvad finder du i appen?" — forest section presenting the six Altid subbrands
// as white cards, each with its official logo lockup (round icon + "altid" +
// subbrand wordmark) and a one-line, transparency-focused description.
//
// Logo assets live in /public/services. Energi ships as a single flattened
// lockup SVG; the other five are composed from a round icon SVG + the coloured
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
  /** render the "altid" wordmark as the charge-up animation (Opladning) */
  charge?: boolean
  /** lit-bulb overlay SVG, faded in on light-up (Energi) */
  bulb?: string
  /** render the icon inline so the phone can vibrate (Mobil) */
  vibrate?: boolean
}

// The five "altid" letter paths (viewBox 84.0116 × 28.7848), inlined so the
// Opladning card can render them as an outline that fills up on charge.
const ALTID_PATHS = [
  'M16.6449 28.0645V25.7886H16.5699C15.6682 27.6468 13.1885 28.7848 10.4457 28.7848C4.28321 28.7857 2.20893e-05 23.8925 2.20893e-05 17.5211C2.20893e-05 11.1496 4.47141 6.29519 10.4457 6.29519C13.0003 6.29519 15.3676 7.31884 16.5699 9.25359H16.6449V7.01634H22.8823V28.0645H16.6449ZM16.6449 17.5211C16.6449 14.5627 14.2776 12.1742 11.3466 12.1742C8.41565 12.1742 6.23659 14.5636 6.23659 17.5976C6.23659 20.6316 8.52893 22.9076 11.4215 22.9076C14.3142 22.9076 16.644 20.556 16.644 17.522L16.6449 17.5211Z',
  'M27.6149 28.0642V0H33.8523V28.0642H27.6149Z',
  'M39.6008 28.0642V11.7949H36.52V7.01606H39.6008V0H45.8383V7.01606H48.8442V11.7949H45.8383V28.0642H39.6008Z',
  'M51.5497 4.77881V0H57.7872V4.77881H51.5497ZM51.5497 28.0642V7.01606H57.7872V28.0642H51.5497Z',
  'M78.0757 28.0642V25.7883H78.0007C76.8358 27.7221 74.7317 28.7467 71.7633 28.7467C65.4509 28.7467 61.3176 23.8544 61.3176 17.483C61.3176 11.1115 65.5633 6.29492 71.65 6.29492C74.0547 6.29492 76.0081 7.01516 77.7742 8.79776V0H84.0117V28.0642H78.0748H78.0757ZM78.1131 17.4452C78.1131 14.5246 75.8966 12.1739 72.8149 12.1739C69.7332 12.1739 67.5541 14.3733 67.5541 17.4452C67.5541 20.517 69.7706 22.8686 72.7765 22.8686C75.7824 22.8686 78.1122 20.5548 78.1122 17.4452H78.1131Z',
]

// "altid" wordmark that charges up: a faint "empty" fill underneath (no stroke,
// so nothing gets clipped by the tight viewBox), plus the solid black fill
// revealed bottom-to-top in steps (clip-rect) once `charging` flips on.
function ChargingAltid({ charging, reduced, width }: { charging: boolean; reduced: boolean; width: string }) {
  return (
    <svg
      viewBox="0 0 84.0116 28.7848"
      style={{ width, height: 'auto', overflow: 'visible' }}
      className={`altid-charge shrink-0${charging ? ' is-charging' : ''}${reduced ? ' is-filled' : ''}`}
      aria-label="Altid Opladning"
    >
      <defs>
        <clipPath id="altid-charge-clip">
          <rect className="altid-charge-fill" x="0" y="0" width="84.0116" height="28.7848" />
        </clipPath>
      </defs>
      <g fill="rgba(0,0,0,0.16)">
        {ALTID_PATHS.map((d, i) => <path key={i} d={d} />)}
      </g>
      <g fill="#000" clipPath="url(#altid-charge-clip)">
        {ALTID_PATHS.map((d, i) => <path key={i} d={d} />)}
      </g>
    </svg>
  )
}

const services: Service[] = [
  {
    label: 'Altid Energi',
    desc: '+15.000 kunder. Gennemsigtig strøm til fair pris. ',
    full: '/services/altid-energi.svg',
    bulb: '/services/altid-energi-bulb.svg',
  },
  {
    label: 'Altid Alarm',
    desc: 'Tryg boligsikring med professionel overvågning. ',
    logo: { icon: '/services/icon-alarm.svg', altid: '/services/altid-alarm.svg', word: 'alarm', color: '#c6000f' },
  },
  {
    label: 'Altid Opladning',
    desc: 'Smart elbilsopladning til hjemmet. ',
    logo: { icon: '/services/icon-opladning.svg', altid: '/services/altid-opladning.svg', word: 'opladning', color: '#000000' },
    charge: true,
  },
  {
    label: 'Altid Forsikring',
    desc: 'Gennemsigtige forsikringer uden skjulte vilkår. ',
    logo: { icon: '/services/icon-forsikring.svg', altid: '/services/altid-forsikring.svg', word: 'forsikring', color: '#a7d3f9' },
  },
  {
    label: 'Altid Mobil',
    desc: 'Mobilabonnement på gennemsigtige vilkår. ',
    logo: { icon: '/services/icon-mobil.svg', altid: '/services/altid-mobil.svg', word: 'mobil', color: '#5530de' },
    vibrate: true,
  },
  {
    label: 'Altid Mad',
    desc: 'Nem madplanlægning tilpasset din husstand. ',
    logo: { icon: '/services/icon-mad.svg', altid: '/services/altid-mad.svg', word: 'mad', color: '#0f6e68' },
  },
]

// Altid Mobil icon inlined so the phone path can vibrate (the circle stays put).
function MobilIcon({ vibrating, size }: { vibrating: boolean; size: string }) {
  return (
    <svg viewBox="0 0 52 52" style={{ width: size, height: size }} className="shrink-0" aria-hidden>
      <rect width="52" height="52" rx="26" fill="#5530DE" />
      <path
        className={`mobil-phone${vibrating ? ' is-vibrating' : ''}`}
        fill="#F9CBF4"
        d="M31.1667 13.1709H19.8333C19.0819 13.1709 18.3612 13.4644 17.8299 13.9868C17.2985 14.5092 17 15.2178 17 15.9566V36.3852C17 37.124 17.2985 37.8326 17.8299 38.355C18.3612 38.8774 19.0819 39.1709 19.8333 39.1709H31.1667C31.9181 39.1709 32.6388 38.8774 33.1701 38.355C33.7015 37.8326 34 37.124 34 36.3852V15.9566C34 15.2178 33.7015 14.5092 33.1701 13.9868C32.6388 13.4644 31.9181 13.1709 31.1667 13.1709ZM18.8889 18.7423H32.1111V33.5995H18.8889V18.7423ZM19.8333 15.028H31.1667C31.4171 15.028 31.6574 15.1259 31.8345 15.3C32.0116 15.4742 32.1111 15.7103 32.1111 15.9566V16.8852H18.8889V15.9566C18.8889 15.7103 18.9884 15.4742 19.1655 15.3C19.3426 15.1259 19.5829 15.028 19.8333 15.028ZM31.1667 37.3138H19.8333C19.5829 37.3138 19.3426 37.2159 19.1655 37.0418C18.9884 36.8676 18.8889 36.6315 18.8889 36.3852V35.4566H32.1111V36.3852C32.1111 36.6315 32.0116 36.8676 31.8345 37.0418C31.6574 37.2159 31.4171 37.3138 31.1667 37.3138Z"
      />
    </svg>
  )
}

function Lockup({ service, charging, reduced, lit, vibrating }: { service: Service; charging: boolean; reduced: boolean; lit: boolean; vibrating: boolean }) {
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
      {service.vibrate ? (
        <MobilIcon vibrating={vibrating} size={fluid(52, 40)} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={icon} alt="" style={{ width: fluid(52, 40), height: fluid(52, 40) }} className="shrink-0" />
      )}
      {/* Wordmark: "altid" stacked over the subbrand word (right-aligned), with a
          gap that matches the flattened Altid Energi lockup so they don't clash. */}
      <div className="flex flex-col items-end shrink-0">
        {service.charge ? (
          <ChargingAltid charging={charging} reduced={reduced} width={fluid(84, 64)} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={altid} alt={service.label} className="shrink-0" style={{ width: fluid(84, 64) }} />
        )}
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
  const [charging, setCharging] = useState(false)
  const [bulbLit, setBulbLit] = useState(false)
  const [phoneVibrate, setPhoneVibrate] = useState(false)

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

  // Once the cards have settled, run the icon sequence with 1s gaps between:
  // (1) Opladning wordmark charges up, (2) Energi bulb lights up, (3) Mobil
  // phone vibrates.
  useEffect(() => {
    if (!revealed) return
    if (reduceRef.current) { setCharging(true); return }
    const CHARGE_DELAY = 1000
    const CHARGE_DURATION = 2600
    const BULB_DELAY = CHARGE_DELAY + CHARGE_DURATION + 1000 // 1s after charge finishes
    const BULB_DURATION = 2200
    const PHONE_DELAY = BULB_DELAY + BULB_DURATION + 1000 // 1s after the bulb finishes
    const t1 = setTimeout(() => setCharging(true), CHARGE_DELAY)
    const t2 = setTimeout(() => setBulbLit(true), BULB_DELAY)
    const t3 = setTimeout(() => setPhoneVibrate(true), PHONE_DELAY)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [revealed])

  return (
    <section id="tjenester" className="scroll-mt-24" style={{ background: '#193d24' }}>
      <div
        className="max-w-[1920px] mx-auto"
        style={{ paddingLeft: fluid(48, 24), paddingRight: fluid(48, 24), paddingTop: fluid(120, 64), paddingBottom: fluid(120, 64) }}
      >
        <p
          className={`${EYEBROW} text-center mb-4`}
          style={{ color: '#90ff7c' }}
        >
          Tjenesterne
        </p>
        <h2 className={`${H2} text-center text-white`}>
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
              <Lockup service={s} charging={charging} reduced={reduceRef.current} lit={bulbLit} vibrating={phoneVibrate} />
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
          className={`text-center text-white mx-auto ${BODY}`}
          style={{ maxWidth: fluid(923, 720), marginTop: fluid(48, 36) }}
        >
          Nøje udvalgte tjenester til hjemmet – valgt på baggrund af kvalitet, pris og gennemsigtighed.
        </p>
      </div>
    </section>
  )
}
