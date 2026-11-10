'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import StoreBadges from '@/components/StoreBadges'
import { STEPS } from './copy'
import StagedNote from './StagedNote'

// Four steps. On a computer the whole block stays put (sticky) while the page scrolls through
// the section: the title, all four steps and a photo are in view, and the scroll moves the open
// step from one to four while the photo changes with it. Each photo is seen from the user's
// side: a hand holding a phone with that step's screen in it. Clicking a step scrolls to it.
// On a phone the steps stack, each open with its own photo.
export default function Steps() {
  const [active, setActive] = useState(0)
  const section = useRef<HTMLElement>(null)

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
                    {i === 0 ? <StoreBadges position="how-it-works" variant="cream" size="lg" className="st-pills" /> : null}
                    <div className="st-inline">
                      <Image
                        src={step.photo}
                        alt={step.alt}
                        fill
                        sizes="(max-width: 767px) 100vw, 1px"
                        quality={78}
                        className="st-inline-photo"
                        style={{ objectFit: 'cover', objectPosition: step.photoFocus }}
                      />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <StagedNote className="st-note" />
        </div>
        <div className="st-visual" aria-hidden="true">
          {STEPS.steps.map((step, i) => (
            <Image
              key={step.photo}
              src={step.photo}
              alt=""
              fill
              sizes="(max-width: 767px) 1px, 50vw"
              quality={80}
              className="st-photo"
              data-shown={i === active ? 'true' : undefined}
              style={{ objectFit: 'cover', objectPosition: step.photoFocus }}
            />
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {STEPS.steps[active].alt}
        </p>
      </div>
    </section>
  )
}
