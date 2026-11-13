'use client'

import Image, { getImageProps } from 'next/image'
import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from 'react'
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
// more services are on the way. On a computer it sits centred in the free space under the steps
// once the reader keeps scrolling with 03 open, and goes when 04 opens; on a phone it sits over
// step 03's own photo when that is in view. The icon hops in like a little character from off
// the left edge (of the window, or of the photo on a phone): two hops and a third that trips,
// then the bubble pops out of it. --hop is how far it travels, measured as it comes in. Hidden,
// it is also out of the accessibility tree.
function Psst({ shown }: { shown: boolean }) {
  const box = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!shown) return
    const element = box.current as HTMLDivElement
    const clip = element.closest('.st-inline')
    const edge = clip ? clip.getBoundingClientRect().left : 0
    const icon = element.querySelector('.st-psst-icon') as HTMLElement
    element.style.setProperty('--hop', `${Math.round(element.getBoundingClientRect().left - edge + icon.offsetWidth + 16)}px`)
  }, [shown])

  return (
    <div ref={box} className="st-psst" data-shown={shown ? 'true' : undefined}>
      <span className="st-psst-hop">
        <Image className="st-psst-icon" src="/app-badge.png" alt="" width={112} height={112} />
      </span>
      <p className="st-psst-bubble">
        <strong>{STEPS.psst.lead}</strong>
        {STEPS.psst.text}
      </p>
    </div>
  )
}

/** Step 03 is index 2; the bubble waits until this share of 03's scroll has passed. */
const PSST_STEP = 2
const PSST_AFTER = 0.3

// Four steps. On a computer the whole block stays put (sticky) while the page scrolls through
// the section: the title, all four steps and a photo are in view, and the scroll moves the open
// step from one to four while the photo changes with it. Each photo is seen from the user's
// side: a hand holding a phone with that step's screen in it. Clicking a step scrolls to it.
// On a phone the steps stack, each open with its own photo.
export default function Steps() {
  const [active, setActive] = useState(0)
  const [psstWide, setPsstWide] = useState(false)
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
      const steps = STEPS.steps.length
      setActive(Math.floor(progress * steps))
      setPsstWide(progress >= (PSST_STEP + PSST_AFTER) / steps && progress < (PSST_STEP + 1) / steps)
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

  const open = (i: number) => {
    const el = section.current
    if (!el) return
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
                <div className="st-more">
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
                      {i === PSST_STEP ? <Psst shown={psstNarrow} /> : null}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <Psst shown={psstWide} />
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
