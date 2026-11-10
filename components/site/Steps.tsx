'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import StoreBadges from '@/components/StoreBadges'
import { STEPS } from './copy'
import Phone from './Phone'
import StagedNote from './StagedNote'

// Four steps. On a computer the phone stays put on the right while the steps scroll past on
// the left, and it shows the step in the middle of the screen, which takes its store colour.
// The phone is position: fixed inside a clip-path, the trick the dark section uses: sticky
// does not work under the page's overflow-x: hidden. On a phone each step shows its own screen.
const SIZES = '(max-width: 767px) 240px, 320px'

export default function Steps() {
  const [active, setActive] = useState(0)
  const steps = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    let frame = 0
    const read = () => {
      frame = 0
      const middle = window.innerHeight / 2
      let best = -1
      let distance = Infinity
      steps.current.forEach((step, i) => {
        if (!step) return
        const box = step.getBoundingClientRect()
        if (box.bottom < 0 || box.top > window.innerHeight) return
        const d = Math.abs(box.top + box.height / 2 - middle)
        if (d < distance) {
          distance = d
          best = i
        }
      })
      if (best >= 0) setActive(best)
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

  return (
    <section data-b="steps" className="sec st" aria-labelledby="st-title">
      <h2 id="st-title" className="t-h2 st-title">
        {STEPS.title}
      </h2>
      <div className="st-wrap">
        <div className="st-pin" aria-hidden="true">
          <div className="st-phone" data-staged="true">
            <div className="ph">
              <span className="ph-body" />
              <div className="ph-screen">
                {STEPS.steps.map((step, i) => (
                  <Image
                    key={step.n}
                    src={step.src}
                    alt=""
                    fill
                    sizes={SIZES}
                    quality={85}
                    className="st-screen"
                    data-shown={i === active ? 'true' : undefined}
                    style={{ objectFit: 'cover', objectPosition: '50% 0%' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <ol className="st-list">
          {STEPS.steps.map((step, i) => (
            <li
              key={step.n}
              ref={(el) => {
                steps.current[i] = el
              }}
              className="st-step"
              data-tone={step.tone}
              data-active={i === active ? 'true' : undefined}
            >
              <div className="st-card">
                <span className="st-n" aria-hidden="true">
                  {step.n}
                </span>
                <h3 className="st-card-title">{step.title}</h3>
                <p className="st-card-body">{step.body}</p>
                {i === 0 ? <StoreBadges position="how-it-works" variant="cream" size="lg" className="st-pills" /> : null}
              </div>
              <div className="st-inline">
                <Phone src={step.src} alt={step.alt} sizes={SIZES} />
              </div>
            </li>
          ))}
        </ol>
        <p className="sr-only" aria-live="polite">
          {STEPS.steps[active].alt}
        </p>
      </div>
      <StagedNote className="st-note" />
    </section>
  )
}
