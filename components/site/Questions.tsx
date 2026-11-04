'use client'

import { useState, useSyncExternalStore } from 'react'
import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion'
import Phone from '@/components/site/primitives/Phone'
import Pin from '@/components/site/primitives/Pin'
import Caption from '@/components/site/primitives/Caption'
import { SCREENS, type Screen } from '@/components/site/screens'
import './questions.css'

// The screens are decoration inside the link: its name is the question and the
// sentence, and each screen comes back with its alt text in its own section.
const picture = (screen: Screen): Screen => ({ ...screen, alt: '' })

// In page order. The phone sits on the side the mail block has it.
const QUESTIONS = [
  {
    title: '“Bruger vi for meget på takeaway?”',
    hang: true,
    body: 'Forbind banken sikkert med MitID, og se hvordan pengene bliver brugt.',
    href: '#okonomi',
    surface: 'ah-bg-honey',
    screen: picture(SCREENS.okonomiTop),
    phoneLeft: false,
  },
  {
    title: 'Ikke mere “hvad skal vi spise?”',
    hang: false,
    body: 'Få en komplet madplan på få minutter, tilpasset dig og din familie.',
    href: '#altid-mad',
    surface: 'ah-bg-lavender',
    screen: picture(SCREENS.madHome),
    phoneLeft: true,
  },
  {
    title: '“Hvornår skal opvasken sættes over?”',
    hang: true,
    body: 'Følg elprisen time for time og få besked, når strømmen er billigst.',
    href: '#altid-energi',
    surface: 'ah-bg-sky',
    screen: picture(SCREENS.energiHome),
    phoneLeft: true,
  },
  {
    title: 'Alle jeres forsikringer samlet ét sted',
    hang: false,
    body: 'Se, hvad I betaler, og få snart nye tilbud. Helt gratis og uforpligtende.',
    href: '#altid-forsikring',
    surface: 'ah-bg-rose',
    screen: picture(SCREENS.forsikringChosen),
    phoneLeft: false,
  },
]

// When the fan is the stacked deck. Everywhere else (no JS, reduced motion, a low
// landscape screen, the swipe row under 768 px) every card is plainly in reach.
const FAN_QUERY = '(min-width: 768px) and (min-height: 501px) and (prefers-reduced-motion: no-preference)'

function subscribeToFan(onChange: () => void) {
  const query = window.matchMedia(FAN_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

// One value per distance from the focused card: 0, 1, 2 and 3 cards away.
function byDistance(distance: number, steps: readonly number[]) {
  const far = Math.min(Math.abs(distance), steps.length - 1)
  const low = Math.floor(far)
  const high = Math.min(low + 1, steps.length - 1)
  return steps[low] + (steps[high] - steps[low]) * (far - low)
}

const OFFSET = [0, 40, 52, 60]
const SCALE = [1, 0.84, 0.72, 0.62]
const TILT = [0, 3.4, 4.6, 5.5]
const DROP = [0, 2, 4, 6]
const DIM = [0, 0.22, 0.32, 0.38]

function FanItem({
  question,
  index,
  focus,
  live,
}: {
  question: (typeof QUESTIONS)[number]
  index: number
  focus: MotionValue<number>
  live: boolean
}) {
  const x = useTransform(focus, (f) => `${Math.sign(index - f) * byDistance(index - f, OFFSET)}%`)
  const y = useTransform(focus, (f) => `${byDistance(index - f, DROP)}%`)
  const scale = useTransform(focus, (f) => byDistance(index - f, SCALE))
  const rotate = useTransform(focus, (f) => Math.sign(index - f) * byDistance(index - f, TILT))
  const zIndex = useTransform(focus, (f) => 40 - Math.round(Math.abs(index - f) * 10))
  const dim = useTransform(focus, (f) => byDistance(index - f, DIM))

  return (
    <motion.li className="ah-fan-item ah-m" style={{ x, y, scale, rotate, zIndex }}>
      <a
        href={question.href}
        inert={!live}
        className={`ah-fan-card ${question.surface} ${question.phoneLeft ? 'ah-fan-card--left' : ''}`}
      >
        <div className="ah-fan-words">
          <h3 className={`ah-fan-title ${question.hang ? 'ah-hang' : ''}`}>{question.title}</h3>
          <p className="ah-fan-body">{question.body}</p>
          <span className="ah-fan-arrow" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
        <motion.span className="ah-fan-dim" style={{ opacity: dim }} aria-hidden />
        <div className="ah-fan-phone">
          <Phone screen={question.screen} crop={0.83} sizes="(max-width: 767px) 60vw, 440px" />
          <motion.span className="ah-fan-phone-dim" style={{ opacity: dim }} aria-hidden />
        </div>
      </a>
    </motion.li>
  )
}

function Fan({ progress }: { progress: MotionValue<number> }) {
  const isFan = useSyncExternalStore(
    subscribeToFan,
    () => window.matchMedia(FAN_QUERY).matches,
    () => false,
  )
  // Each card rests a moment in focus, so it can be read and clicked.
  const focus = useTransform(progress, [0, 0.1, 0.3, 0.4, 0.6, 0.7, 0.9, 1], [0, 0, 1, 1, 2, 2, 3, 3])
  // The whole deck slides as the focus moves, so it opens to the right at the start
  // and to the left at the end instead of leaving one side of the page empty.
  const rail = useTransform(focus, (f) => `calc(var(--fan-rail) * ${f - 1.5})`)
  const [focused, setFocused] = useState(0)
  useMotionValueEvent(focus, 'change', (f) => setFocused(Math.round(f)))

  return (
    <>
      <motion.ul className="ah-fan-list ah-m" style={{ x: rail }}>
        {QUESTIONS.map((question, index) => (
          <FanItem
            key={question.href}
            question={question}
            index={index}
            focus={focus}
            live={!isFan || focused === index}
          />
        ))}
      </motion.ul>
      <Caption on="forest" className="ah-fan-caption" />
    </>
  )
}

export default function Questions() {
  return (
    <section id="spoergsmaal-fra-hverdagen" className="ah-fan-sec">
      <h2 className="sr-only">Fire spørgsmål fra hverdagen</h2>
      <Pin vh={220} mobileVh={null} className="ah-bg-forest">
        {(progress) => <Fan progress={progress} />}
      </Pin>
    </section>
  )
}
