'use client'

import Image, { getImageProps } from 'next/image'
import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import StoreBadges from '@/components/StoreBadges'
import { STEPS } from './copy'
import GetAppButton from './GetAppButton'
import { STEP_SCREENS, STEP_VIEW } from './stepScreens'

type Step = (typeof STEPS.steps)[number]

// One step photo with its app screens. The photo is exported without a screen (step 1 has its
// own baked in); the screenshot is laid on here, in an SVG that shares the photo's box, so a
// screen is changed in copy.ts without touching the photo. The frame is the whole 3:2 photo,
// sized to cover its slot and placed by photoFocus the way object-fit and object-position
// would, and the SVG scales with it. Each display has Thor's mask from the PSD and a mesh of
// triangles that puts the screenshot in the phone's perspective (stepScreens.ts).
function StepPhoto({ step, slot, alt, sizes, quality, shown }: { step: Step; slot: 'inline' | 'visual'; alt: string; sizes: string; quality: number; shown?: boolean }) {
  const [fx, fy] = step.photoFocus.split(' ')
  const displays = STEP_SCREENS[step.n] ?? []
  return (
    <div className={slot === 'visual' ? 'st-frame st-photo' : 'st-frame'} data-shown={shown ? 'true' : undefined} style={{ '--fx': fx, '--fy': fy } as CSSProperties}>
      <Image src={step.photo} alt={alt} fill sizes={sizes} quality={quality} />
      {displays.length > 0 ? (
        <svg className="st-screens" viewBox={`0 0 ${STEP_VIEW.w} ${STEP_VIEW.h}`} aria-hidden="true" focusable="false">
          {displays.map((display, k) => {
            const id = `st-${slot}-${step.n}-${k}`
            // a 640 px wide copy is enough for a phone in a photo, and scales down cleanly
            const href = getImageProps({ src: step.screens[k], alt: '', width: 320, height: 694, quality: 90 }).props.src
            const { mask } = display
            return (
              <g key={id}>
                <mask id={id} maskUnits="userSpaceOnUse" x={mask.x} y={mask.y} width={mask.w} height={mask.h} style={{ maskType: 'luminance' }}>
                  <image href={mask.src} x={mask.x} y={mask.y} width={mask.w} height={mask.h} preserveAspectRatio="none" />
                </mask>
                <g mask={`url(#${id})`}>
                  {display.tiles.map(([x0, y0, x1, y1, x2, y2, a, b, c, d, e, f], t) => (
                    <g key={t} transform={`matrix(${a} ${b} ${c} ${d} ${e} ${f})`}>
                      <clipPath id={`${id}-${t}`}>
                        <polygon points={`${x0},${y0} ${x1},${y1} ${x2},${y2}`} />
                      </clipPath>
                      <image href={href} width={STEP_VIEW.sw} height={STEP_VIEW.sh} preserveAspectRatio="none" clipPath={`url(#${id}-${t})`} />
                    </g>
                  ))}
                </g>
              </g>
            )
          })}
        </svg>
      ) : null}
    </div>
  )
}

// Psst (Thor 13/11): the app icon, then its speech bubble, as a message reads on a phone, saying
// more services are on the way. On a computer it sits centred in the free space under the steps;
// on a phone over step 03's own photo. A second after 03 opens the icon hops in like a little
// character from off the left edge (of the window, or of the photo on a phone): two hops and a
// third that trips, then the bubble pops out of it. --hop is how far it travels, measured as it
// comes in. Hidden, it is also out of the accessibility tree.
//
// Step 04, "Inviter din partner" (computers): the bubble folds away and a second icon, the
// partner, hops in from the left and leaps over the first to land beside it. The first gives a
// little start, then the two lean into each other and hold, straighten up and do two happy jumps
// side by side without touching, and then stand side by side, each breathing, glancing at the
// other and bobbing now and then on its own clock. Back to 03, the partner leaps back out and the bubble
// returns; to 02, or on past 04 out of the steps, both hop out to the left.
type PsstState = 'in' | 'out' | undefined

/** 0: away, 1: the icon and its bubble (03), 2: the icon and its partner (04). */
export type PsstLevel = 0 | 1 | 2

/** How long 03 has to be open before the icon comes. */
const PSST_DELAY = 1000
/** The partner waits for the first icon to have landed and this long into 04. */
const PAIR_AFTER_ICON = 2000
const PAIR_DELAY = 300

export function Psst({ level }: { level: PsstLevel }) {
  const box = useRef<HTMLDivElement>(null)
  const inAt = useRef(0)
  const [ready, setReady] = useState(false)
  const [pairReady, setPairReady] = useState(false)
  const [state, setState] = useState<PsstState>(undefined)
  const [pair, setPair] = useState<PsstState>(undefined)

  const here = level > 0
  useEffect(() => {
    if (!here) return
    const timer = window.setTimeout(() => setReady(true), PSST_DELAY)
    return () => {
      window.clearTimeout(timer)
      setReady(false)
    }
  }, [here])

  // 'out' only after it has been in, so nothing hops out of a page that has just opened.
  const next: PsstState = ready ? 'in' : state === 'in' ? 'out' : state
  if (next !== state) setState(next)

  const pairWanted = level === 2 && state === 'in'
  useEffect(() => {
    if (!pairWanted) return
    const wait = Math.max(PAIR_DELAY, PAIR_AFTER_ICON - (Date.now() - inAt.current))
    const timer = window.setTimeout(() => setPairReady(true), wait)
    return () => {
      window.clearTimeout(timer)
      setPairReady(false)
    }
  }, [pairWanted])

  const nextPair: PsstState = pairReady ? 'in' : pair === 'in' ? 'out' : pair
  if (nextPair !== pair) setPair(nextPair)

  useLayoutEffect(() => {
    if (state !== 'in') return
    inAt.current = Date.now()
    const element = box.current as HTMLDivElement
    const clip = element.closest('.st-inline')
    const edge = clip ? clip.getBoundingClientRect().left : 0
    const icon = element.querySelector('.st-psst-icon') as HTMLElement
    element.style.setProperty('--hop', `${Math.round(element.getBoundingClientRect().left - edge + icon.offsetWidth + 16)}px`)
  }, [state])

  return (
    <div ref={box} className="st-psst" data-state={state} data-pair={pair}>
      <span className="st-psst-hop">
        <span className="st-psst-lean">
          <Image className="st-psst-icon" src="/app-badge.png" alt="" width={112} height={112} />
        </span>
      </span>
      <span className="st-pair" aria-hidden="true">
        <span className="st-pair-hop">
          <span className="st-pair-lean">
            <Image className="st-pair-icon" src="/app-badge.png" alt="" width={112} height={112} />
          </span>
        </span>
      </span>
      <p className="st-psst-bubble">
        <strong>{STEPS.psst.lead}</strong>
        {STEPS.psst.text}
      </p>
    </div>
  )
}

/** From tablet up the steps fold (app/site.css): only the open one shows its text and buttons. */
const FOLDED = '(min-width: 768px)'
const subscribeFolded = (change: () => void) => {
  const query = window.matchMedia(FOLDED)
  query.addEventListener('change', change)
  return () => query.removeEventListener('change', change)
}
const readFolded = () => window.matchMedia(FOLDED).matches
const foldedOnServer = () => false

/** Step 03 is index 2. */
const PSST_STEP = 2
/** Share of the steps' scroll after which the icons hop out on the way to the next section. */
const PAST_STEPS = 0.985

// Four steps. On a computer the whole block stays put (sticky) while the page scrolls through
// the section: the title, all four steps and a photo are in view, and the scroll moves the open
// step from one to four while the photo changes with it. Each photo is seen from the user's
// side: a hand holding a phone with that step's screen in it. Clicking a step scrolls to it.
// On a phone the steps stack, each open with its own photo.
export default function Steps() {
  const [active, setActive] = useState(0)
  const [pastSteps, setPastSteps] = useState(false)
  const [psstNarrow, setPsstNarrow] = useState(false)
  const section = useRef<HTMLElement>(null)
  const psstPhoto = useRef<HTMLDivElement>(null)

  // On a phone: step 03's photo at least 60 % in view.
  useEffect(() => {
    const photo = psstPhoto.current as HTMLDivElement
    const watch = new IntersectionObserver(([entry]) => setPsstNarrow(entry.intersectionRatio >= 0.6), { threshold: [0, 0.6, 1] })
    watch.observe(photo)
    return () => watch.disconnect()
  }, [])

  useEffect(() => {
    let frame = 0
    const read = () => {
      frame = 0
      const el = section.current
      if (!el) return
      const box = el.getBoundingClientRect()
      const travel = box.height - window.innerHeight
      if (travel <= 0) return
      const progress = Math.min(0.999, Math.max(0, -box.top / travel))
      setActive(Math.floor(progress * STEPS.steps.length))
      // The block starts to scroll away (the next section is coming): the icons leave.
      setPastSteps(-box.top / travel >= PAST_STEPS)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  const folded = useSyncExternalStore(subscribeFolded, readFolded, foldedOnServer)

  // Folded (tablet up): scroll to the share of the section that opens step i. Stacked (phone):
  // every step is open in the flow, so go to the step itself.
  const open = (i: number) => {
    const el = section.current
    if (!el) return
    if (!folded) {
      el.querySelectorAll('.st-step')[i]?.scrollIntoView({ block: 'start' })
      return
    }
    const travel = el.offsetHeight - window.innerHeight
    if (travel <= 0) return
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + travel * ((i + 0.5) / STEPS.steps.length) })
  }

  return (
    <section ref={section} data-b="steps" className="sec st" aria-labelledby="st-title">
      <div className="st-stage">
        <h2 id="st-title" className="t-h2 st-title">
          {STEPS.title}
        </h2>
        <div className="st-left">
          <ol className="st-list">
            {STEPS.steps.map((step, i) => (
              <li key={step.n} className="st-step" data-tone={step.tone} data-active={i === active ? 'true' : undefined}>
                <h3 className="st-card-title">
                  <button type="button" className="st-head" onClick={() => open(i)} aria-current={i === active ? 'step' : undefined}>
                    <span className="st-n" aria-hidden="true">
                      {step.n}
                    </span>
                    {step.title}
                  </button>
                </h3>
                {/* A folded step's text and buttons are out of the tab order too (inert). */}
                <div className="st-more" inert={folded && i !== active}>
                  <div>
                    <p className="st-card-body">{step.body}</p>
                    {i === 0 ? (
                      <>
                        <StoreBadges position="how-it-works" variant="cream" size="lg" className="st-pills store-row" />
                        <GetAppButton position="how-it-works" />
                      </>
                    ) : null}
                    <div className="st-inline" ref={i === PSST_STEP ? psstPhoto : undefined}>
                      <StepPhoto step={step} slot="inline" alt={step.alt} sizes="(max-width: 767px) 120vw, 1px" quality={75} />
                      {i === PSST_STEP ? <Psst level={psstNarrow ? 1 : 0} /> : null}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <Psst level={active === PSST_STEP ? 1 : active === PSST_STEP + 1 && !pastSteps ? 2 : 0} />
        </div>
        <div className="st-visual" aria-hidden="true">
          {STEPS.steps.map((step, i) => (
            <StepPhoto key={step.photo} step={step} slot="visual" alt="" sizes="(max-width: 767px) 1px, 70vw" quality={90} shown={i === active} />
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {STEPS.steps[active].alt}
        </p>
      </div>
    </section>
  )
}
