'use client'

import { useLayoutEffect, useSyncExternalStore, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import { Logo } from '@/components/Logo'
import Caption from '@/components/site/primitives/Caption'
import Phone from '@/components/site/primitives/Phone'
import Pin from '@/components/site/primitives/Pin'
import StorePills, { GetAppLink } from '@/components/site/primitives/StorePills'
import { APP_ICON, HJEM_HERO_CROP, SCREENS } from '@/components/site/screens'
import './hero.css'

// One sticky stage from 0 to 7 viewport heights. Every moving value is a track of
// [scroll positions, values] in the reference's px at 1440x900 and 390x844, so
// the same numbers can be checked against its frames. Lengths are multiplied by
// --hu in CSS. The stage's first frame lives in hero.css: the server cannot know
// which table applies, so nothing is written inline until after hydration.

type Track = readonly [readonly number[], readonly number[]]

const DESKTOP = {
  length: 6300,
  phoneY: [[0, 318], [144, 72]],
  phoneS: [[450, 1396], [1, 288 / 993]],
  haloS: [[450, 1396], [993 / 288, 1]],
  eclipseY: [[0, 318], [-262, -334]],
  eclipseO: [[317, 947], [1, 0]],
  glowA: [[632, 951, 1893, 2527], [0, 1, 1, 0]],
  glowB: [[1893, 2527], [0, 1]],
  islandO: [[960, 1200], [1, 0]],
  islandLive: [[0, 120], [1, 0]],
  coinO: [[500, 600], [1, 0]],
  coin1: [[0, 150, 300, 450, 600], [0, -233, -367, -663, -1100]],
  coin2: [[0, 150, 300, 450], [0, -171, -344, -800]],
  coin3: [[0, 150, 300, 450], [0, -313, -499, -1000]],
  textS: [[0, 947], [1, 0.303]],
  textO: [[0, 947], [1, 0]],
  textY: [[0], [0]],
  screenO: [[960, 1260], [0, 1]],
  buildA: [[1350, 1650], [1, 0]],
  buildB: [[1500, 2100], [1, 0]],
  sheetY: [[1893, 1950, 2100, 2250, 2400, 2700, 2850, 3000], [117, 76.4, 15.3, 1, 0, 0, 48.3, 97]],
  sheetO: [[1893, 1950, 2100, 2250, 2750, 2950], [0, 0.1, 0.75, 1, 1, 0]],
  dimO: [[1950, 2250, 2700, 3000, 3300, 3420], [0, 0.65, 0.65, 0.82, 0.82, 0]],
  hjemO: [[3300, 3420], [0, 1]],
  cardO: [[2720, 2850, 2960], [0, 0.6, 1]],
  cardS: [[2720, 2850, 3000, 3150, 3300, 3470], [0.83, 0.905, 0.997, 1, 0.983, 0.72]],
  cardX: [[0], [0]],
  cardY: [[3300, 3470], [0, -147]],
  groupS: [[3474, 3781], [1, 0.6]],
  groupO: [[3474, 3781], [1, 0]],
  word1O: [[1262, 1887, 2494, 2550, 2700, 2752], [0, 1, 1, 0.78, 0.2, 0]],
  word1Y: [[1262, 2752], [0, -126]],
  word1S: [[0], [1]],
  word2O: [[1892, 2400, 2510, 2550, 2700, 2752], [0, 0.8, 0.97, 0.78, 0.2, 0]],
  word2Y: [[1892, 2752], [0, -132]],
  word2S: [[0], [1]],
  word3O: [[2522, 3470], [0, 1]],
  word3S: [[2522, 3470], [0.6, 1]],
  captionO: [[1100, 1300], [0, 1]],
  statementO: [[3781, 4410, 4725], [0, 1, 0]],
  statementS: [[3781, 4725], [0.6, 1.2]],
  stripesO: [[4635, 4880], [0, 1]],
  card1O: [[4886, 5380, 5825, 6220], [0, 1, 1, 0]],
  card1S: [[4886, 5380, 5825, 6220], [0.6, 1, 1, 1.2]],
  card1R: [[4886, 5380], [-20, -8]],
  card1X: [[4886, 5380], [180, 0]],
  card2O: [[4635, 5130, 5625, 6125], [0, 1, 1, 0]],
  card2S: [[4635, 5130, 5625, 6125], [0.6, 1, 1, 1.2]],
  card2R: [[4635, 5130], [20, 8]],
  card2X: [[0], [0]],
  card3O: [[5132, 5626, 6020, 6325], [0, 1, 1, 0]],
  card3S: [[5132, 5626, 6020, 6325], [0.6, 1, 1, 1.2]],
  card3R: [[5132, 5626], [8, 2]],
  card3X: [[5132, 5626], [-183, 0]],
} as const satisfies Record<string, Track | number>

const MOBILE: Record<keyof typeof DESKTOP, Track | number> = {
  length: 5908,
  phoneY: [[0, 1200], [557, 51]],
  phoneS: [[0, 1200], [1, 266 / 333]],
  haloS: [[0, 1200], [333 / 266, 1]],
  eclipseY: [[0, 1200], [447, -59]],
  eclipseO: [[0, 1200], [1, 0]],
  glowA: [[0], [1]],
  glowB: [[0, 1200], [0, 1]],
  islandO: [[0], [0]],
  islandLive: [[0], [0]],
  coinO: [[800, 1000], [1, 0]],
  coin1: [[0, 600, 1000], [0, -684, -1500]],
  coin2: [[0], [0]],
  coin3: [[0, 300, 600], [0, -555, -1300]],
  textS: [[0], [1]],
  textO: [[0], [1]],
  textY: [[0, 1200], [0, -680]],
  screenO: [[0], [1]],
  buildA: [[0], [0]],
  buildB: [[1300, 1650], [1, 0]],
  sheetY: [[1774, 1830, 1950, 2100], [109, 67.7, 3.4, 0]],
  sheetO: [[1774, 1870, 1950, 2400, 2550], [0, 0.6, 1, 1, 0]],
  dimO: [[1800, 2100, 2400, 2600], [0, 0.65, 0.65, 0.82]],
  hjemO: [[2550, 2650], [0, 1]],
  cardO: [[2310, 2400, 2520], [0, 0.5, 1]],
  cardS: [[2310, 2400, 2550], [0.8, 0.92, 1]],
  cardX: [[0], [0]],
  cardY: [[0], [0]],
  groupS: [[2660, 3077], [1, 0.594]],
  groupO: [[2660, 3077], [1, 0]],
  word1O: [[1185, 1477, 1776], [0, 1, 0]],
  word1Y: [[0], [0]],
  word1S: [[1185, 1477, 1776], [0.8, 1, 1.1]],
  word2O: [[1774, 2068, 2367], [0, 1, 0]],
  word2Y: [[0], [0]],
  word2S: [[1774, 2068, 2367], [0.8, 1, 1.1]],
  word3O: [[2365, 2660], [0, 1]],
  word3S: [[2365, 2660], [0.8, 1]],
  captionO: [[1000, 1200], [0, 1]],
  statementO: [[3075, 3544, 4140], [0, 1, 0]],
  statementS: [[3075, 3544, 4140], [0.8, 1, 1.1]],
  stripesO: [[0], [0]],
  card1O: [[3798, 4435], [0, 1]],
  card1S: [[3798, 4435], [0.8, 1]],
  card1R: [[3798, 4435], [-10, -5]],
  card1X: [[0], [0]],
  card2O: [[4555, 5190], [0, 1]],
  card2S: [[4555, 5190], [0.8, 1]],
  card2R: [[4555, 5190], [-10, 4]],
  card2X: [[0], [0]],
  card3O: [[5317, 5909], [0, 1]],
  card3S: [[5317, 5909], [0.8, 1]],
  card3R: [[5317, 5909], [-10, -0.5]],
  card3X: [[0], [0]],
}

type TrackName = Exclude<keyof typeof DESKTOP, 'length'>

function valueAt([keys, values]: Track, y: number) {
  if (y <= keys[0]) return values[0]
  for (let i = 1; i < keys.length; i++) {
    if (y <= keys[i]) {
      const t = (y - keys[i - 1]) / (keys[i] - keys[i - 1])
      return values[i - 1] + (values[i] - values[i - 1]) * t
    }
  }
  return values[values.length - 1]
}

const inUnits = (v: number) => `calc(${v} * var(--hu))`
const inPhoneWidths = (v: number) => `${v}cqw`

const PHONE_SIZES = '(max-width: 767px) 80vw, 45vw'
const MOBILE_QUERY = '(max-width: 767.98px)'

const noSubscribe = () => () => {}
const yes = () => true
const no = () => false

const NOTES = [
  { icon: 'madplan', text: 'Madplanen er klar' },
  { icon: 'strom', text: 'Strømmen er billig nu' },
  { icon: 'okonomi', text: 'Næste regning: fredag' },
  { icon: 'forsikring', text: 'Tilbuddet er på vej' },
] as const

function PadlockArt() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden className="ah-hero-art-svg">
      <defs>
        <linearGradient id="ah-lock-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fdfaf4" />
          <stop offset="0.5" stopColor="#b7f2a7" />
          <stop offset="1" stopColor="#6fd65e" />
        </linearGradient>
      </defs>
      <path
        d="M62 96V66a38 38 0 0 1 76 0v30"
        fill="none"
        stroke="#003c16"
        strokeWidth="20"
        strokeLinecap="round"
      />
      <path d="M62 96V66a38 38 0 0 1 76 0v30" fill="none" stroke="#b7f2a7" strokeWidth="12" strokeLinecap="round" />
      <rect x="34" y="88" width="132" height="100" rx="26" fill="url(#ah-lock-body)" />
      <circle cx="100" cy="130" r="14" fill="#003c16" />
      <rect x="93" y="134" width="14" height="30" rx="7" fill="#003c16" />
    </svg>
  )
}

function ServiceStack() {
  return (
    <div className="ah-hero-art-stack" aria-hidden>
      {(['okonomi', 'strom', 'forsikring', 'madplan'] as const).map((icon, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={icon} src={`/site/icons/${icon}.svg`} alt="" className={`ah-hero-art-icon ah-hero-art-icon--${i + 1}`} />
      ))}
    </div>
  )
}

function CalendarArt() {
  return (
    <div className="ah-hero-art-calendar">
      <Image
        src={SCREENS.regningerTop.src}
        alt="Kalender med månedens regninger"
        width={SCREENS.regningerTop.width}
        height={SCREENS.regningerTop.height}
        sizes="(max-width: 767px) 70vw, 24vw"
      />
    </div>
  )
}

const BENEFITS: { title: string; body: string; art: ReactNode; kind: string }[] = [
  {
    kind: 'lock',
    title: 'Appen kan kun læse.',
    body: 'Den kan aldrig flytte penge. I logger ind med MitID, og I bestemmer selv, hvad I vil forbinde.',
    art: <PadlockArt />,
  },
  {
    kind: 'stack',
    title: 'Mad, strøm, forsikringer og økonomi.',
    body: 'Det hele i én app, med ét login.',
    art: <ServiceStack />,
  },
  {
    kind: 'calendar',
    title: 'Se regningerne, før de bliver trukket.',
    body: 'Se alle jeres faste udgifter i en kalender, så I aldrig bliver overrasket af store regninger.',
    art: <CalendarArt />,
  },
]

function Scene({ progress }: { progress: MotionValue<number> }) {
  // Hydration sees false, the first client render true: inline styles only then.
  const ready = useSyncExternalStore(noSubscribe, yes, no)
  const isMobile = useMotionValue(0)

  useLayoutEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY)
    const update = () => isMobile.set(query.matches ? 1 : 0)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [isMobile])

  const useTrack = (name: TrackName) =>
    useTransform([progress, isMobile], ([p, mobile]: number[]) => {
      const table = mobile ? MOBILE : DESKTOP
      return valueAt(table[name] as Track, p * (table.length as number))
    })
  const useLength = (name: TrackName) => useTransform(useTrack(name), inUnits)

  const motionStyle = <T,>(style: T) => (ready ? style : undefined)

  const textO = useTrack('textO')
  const textVisibility = useTransform(textO, (o) => (o > 0 ? 'visible' : 'hidden'))

  const phoneY = useLength('phoneY')
  const phone = motionStyle({ y: phoneY, scale: useTrack('phoneS') })
  const halos = motionStyle({ y: phoneY, scale: useTrack('haloS') })
  const screenO = useTrack('screenO')

  const cardStyles = [
    motionStyle({ opacity: useTrack('card1O'), scale: useTrack('card1S'), rotate: useTrack('card1R'), x: useLength('card1X') }),
    motionStyle({ opacity: useTrack('card2O'), scale: useTrack('card2S'), rotate: useTrack('card2R'), x: useLength('card2X') }),
    motionStyle({ opacity: useTrack('card3O'), scale: useTrack('card3S'), rotate: useTrack('card3R'), x: useLength('card3X') }),
  ]

  const words = [
    {
      word: 'Forbind.',
      screen: SCREENS.okonomiTop,
      style: motionStyle({ opacity: useTrack('word1O'), y: useLength('word1Y'), scale: useTrack('word1S') }),
    },
    {
      word: 'Se.',
      screen: SCREENS.regningerTop,
      style: motionStyle({ opacity: useTrack('word2O'), y: useLength('word2Y'), scale: useTrack('word2S') }),
    },
    {
      word: 'Slap af.',
      style: motionStyle({ opacity: useTrack('word3O'), scale: useTrack('word3S') }),
    },
  ]

  const coinO = useTrack('coinO')
  const coinStyles = [
    motionStyle({ opacity: coinO, y: useLength('coin1') }),
    motionStyle({ opacity: coinO, y: useLength('coin2') }),
    motionStyle({ opacity: coinO, y: useLength('coin3') }),
  ]
  const stripesO = useTrack('stripesO')
  const maskO = useTrack('eclipseO')

  return (
    <div className="ah-hero-stage">
      <motion.div className="ah-hero-stripes ah-m" style={motionStyle({ opacity: stripesO })} aria-hidden />
      <motion.div className="ah-hero-circle ah-m" style={motionStyle({ opacity: stripesO })} aria-hidden />

      <div className="ah-hero-box">
        <motion.div
          className="ah-hero-text ah-m"
          style={motionStyle({ opacity: textO, scale: useTrack('textS'), y: useLength('textY'), visibility: textVisibility })}
        >
          <p className="ah-hero-small">Få overblik over jeres mad, strøm, forsikring og økonomi.</p>
          <h1 className="ah-hero-title">
            <span>Hele hjemmet</span> <span>i én app</span>
          </h1>
          <StorePills position="hero" variant="dark" className="ah-hero-pills" />
        </motion.div>

        <motion.div className="ah-hero-fig ah-m" style={motionStyle({ opacity: useTrack('groupO'), scale: useTrack('groupS') })}>
          <motion.div className="ah-hero-halos ah-m" style={halos} aria-hidden>
            <span className="ah-hero-light" />
            <motion.span className="ah-hero-glow ah-hero-glow--a ah-m" style={motionStyle({ opacity: useTrack('glowA') })} />
            <motion.span className="ah-hero-glow ah-hero-glow--b ah-m" style={motionStyle({ opacity: useTrack('glowB') })} />
          </motion.div>

          <motion.div
            className="ah-hero-eclipse ah-m"
            style={motionStyle({ y: useLength('eclipseY'), opacity: useTrack('eclipseO') })}
            aria-hidden
          />

          {(['strom', 'madplan', 'okonomi'] as const).map((icon, i) => (
            <motion.div key={icon} className={`ah-hero-coin ah-hero-coin--${i + 1} ah-m`} style={coinStyles[i]} aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/site/icons/${icon}.svg`} alt="" className="ah-hero-coin-img" />
            </motion.div>
          ))}

          <motion.div className="ah-hero-phone ah-m" style={phone}>
            <div className="ah-hero-body">
              <motion.span className="ah-hero-rim ah-hero-rim--a ah-m" style={motionStyle({ opacity: useTrack('glowA') })} aria-hidden />
              <motion.span className="ah-hero-rim ah-hero-rim--b ah-m" style={motionStyle({ opacity: useTrack('glowB') })} aria-hidden />
              <div className="ah-hero-screen">
                <motion.div className="ah-hero-layer ah-hero-layer--money ah-m" style={motionStyle({ opacity: screenO })}>
                  <Image src={SCREENS.okonomiTop.src} alt={SCREENS.okonomiTop.alt} fill sizes={PHONE_SIZES} preload />
                  <motion.span className="ah-hero-build ah-hero-build--a ah-m" style={motionStyle({ opacity: useTrack('buildA') })} aria-hidden />
                  <motion.span className="ah-hero-build ah-hero-build--b ah-m" style={motionStyle({ opacity: useTrack('buildB') })} aria-hidden />
                </motion.div>
                <motion.div className="ah-hero-layer ah-hero-layer--hjem ah-m" style={motionStyle({ opacity: useTrack('hjemO') })}>
                  <Image src={SCREENS.hjemTop.src} alt={SCREENS.hjemTop.alt} fill sizes={PHONE_SIZES} />
                </motion.div>
                <motion.span className="ah-hero-dim ah-m" style={motionStyle({ opacity: useTrack('dimO') })} aria-hidden />
                <motion.div
                  className="ah-hero-sheet ah-m"
                  style={motionStyle({ y: useTransform(useTrack('sheetY'), inPhoneWidths), opacity: useTrack('sheetO') })}
                >
                  <Image
                    src={SCREENS.regningerTop.src}
                    alt=""
                    width={SCREENS.regningerTop.width}
                    height={SCREENS.regningerTop.height}
                    sizes={PHONE_SIZES}
                  />
                </motion.div>
                <motion.div className="ah-hero-island ah-m" style={motionStyle({ opacity: useTrack('islandO') })} aria-hidden>
                  <span className="ah-hero-island-idle" />
                  <motion.span className="ah-hero-island-live ah-m" style={motionStyle({ opacity: useTrack('islandLive') })}>
                    {NOTES.map(({ icon, text }, i) => (
                      <span key={icon} className={`ah-hero-note ah-hero-note--${i + 1}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/site/icons/${icon}.svg`} alt="" className="ah-hero-note-icon" />
                        <span className="ah-hero-note-text">{text}</span>
                      </span>
                    ))}
                    <span className="ah-hero-note-ring" />
                  </motion.span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <ol className="ah-hero-steps">
            {words.map(({ word, screen, style }, i) => (
              <li key={word} className="ah-hero-step">
                <motion.p className={`ah-hero-word ah-hero-word--${i + 1} ah-m`} style={style}>
                  {word}
                </motion.p>
                {screen && <Phone screen={screen} sizes="(max-width: 767px) 70vw, 340px" className="ah-hero-step-phone" />}
              </li>
            ))}
          </ol>

          <motion.div
            className="ah-hero-card ah-m"
            style={motionStyle({ opacity: useTrack('cardO'), scale: useTrack('cardS'), x: useLength('cardX'), y: useLength('cardY') })}
          >
            <div className="ah-hero-card-top">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={APP_ICON} alt="" className="ah-hero-card-icon" />
              <div>
                <p className="ah-hero-card-sum">8.166 kr.</p>
                <p className="ah-hero-card-note">tilbage til lønningsdag</p>
              </div>
            </div>
            <div className="ah-hero-card-face">
              <Image
                src={HJEM_HERO_CROP.src}
                alt="Søjlerne viser, at I er foran"
                width={HJEM_HERO_CROP.width}
                height={HJEM_HERO_CROP.height}
                sizes="(max-width: 767px) 86vw, 30vw"
              />
            </div>
          </motion.div>

          <motion.div className="ah-hero-caption ah-m" style={motionStyle({ opacity: useTrack('captionO') })}>
            <Caption on="forest" />
          </motion.div>
        </motion.div>

        <motion.div
          className="ah-hero-statement ah-m"
          style={motionStyle({ opacity: useTrack('statementO'), scale: useTrack('statementS') })}
        >
          <h2 className="ah-hero-statement-text">
            <span className="ah-hero-statement-line">Ét overblik. Ét login.</span>{' '}
            <span className="ah-hero-statement-line ah-hero-statement-accent">Hele hjemmet.</span>
          </h2>
        </motion.div>

        <div className="ah-hero-benefits">
          {BENEFITS.map(({ title, body, art, kind }, i) => (
            <motion.article key={kind} className={`ah-hero-benefit ah-hero-benefit--${i + 1} ah-m`} style={cardStyles[i]}>
              <div className={`ah-hero-art ah-hero-art--${kind}`}>{art}</div>
              <h3 className="ah-hero-benefit-title">{title}</h3>
              <p className="ah-hero-benefit-body">{body}</p>
            </motion.article>
          ))}
        </div>

      </div>

      <motion.div className="ah-hero-mask ah-m" style={motionStyle({ opacity: maskO })} aria-hidden />
    </div>
  )
}

export default function Hero() {
  return (
    <section id="top" className="ah-hero">
      <header className="ah-hero-head">
        <Link href="/" aria-label="Altid Hjem forside" className="ah-hero-logo">
          <Logo variant="forest" />
        </Link>
        <GetAppLink className="ah-hero-get" position="nav" />
      </header>
      <Pin vh={800} mobileVh={800} className="ah-hero-pin">
        {(progress) => <Scene progress={progress} />}
      </Pin>
    </section>
  )
}
