'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import StoreBadges from '@/components/StoreBadges'
import { STEPS } from './copy'
import StagedNote from './StagedNote'

// The four steps in the list-and-phone layout of the earlier "Og der er mere": the step
// nearest the middle of the screen lights up in its store colour as the page scrolls, and
// the phone shows its screen. A click or the arrow keys pick a step too.
const COUNT = STEPS.steps.length
const SIZES = '(max-width: 767px) 224px, 290px'

export default function Steps() {
  const [selected, setSelected] = useState(0)
  const rows = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    let frame = 0
    const read = () => {
      frame = 0
      const middle = window.innerHeight / 2
      let best = -1
      let distance = Infinity
      rows.current.forEach((row, i) => {
        if (!row) return
        const box = row.getBoundingClientRect()
        if (box.bottom < 0 || box.top > window.innerHeight) return
        const d = Math.abs(box.top + box.height / 2 - middle)
        if (d < distance) {
          distance = d
          best = i
        }
      })
      if (best >= 0) setSelected(best)
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

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const target = { ArrowDown: (index + 1) % COUNT, ArrowUp: (index + COUNT - 1) % COUNT, Home: 0, End: COUNT - 1 }[event.key]
    if (target === undefined) return
    event.preventDefault()
    setSelected(target)
    rows.current[target]?.focus()
  }

  return (
    <section data-b="steps" className="sec m st" aria-labelledby="st-title">
      <div className="m-grid">
        <div className="m-left">
          <p className="st-eyebrow">{STEPS.eyebrow}</p>
          <h2 id="st-title" className="t-h2">
            {STEPS.title}
          </h2>
          <div className="m-list" role="tablist" aria-label={STEPS.listLabel} aria-orientation="vertical">
            {STEPS.steps.map((step, i) => (
              <button
                key={step.n}
                ref={(el) => {
                  rows.current[i] = el
                }}
                type="button"
                role="tab"
                id={`st-tab-${i}`}
                aria-selected={i === selected}
                aria-controls="st-panel"
                tabIndex={i === selected ? 0 : -1}
                className="m-row"
                data-tone={step.tone}
                data-selected={i === selected ? 'true' : undefined}
                onClick={() => setSelected(i)}
                onKeyDown={(event) => onKeyDown(event, i)}
              >
                <span className="st-n" aria-hidden="true">
                  {step.n}
                </span>
                <span className="m-row-title">{step.title}</span>
                <span className="m-row-body">{step.body}</span>
              </button>
            ))}
          </div>
          <StoreBadges position="how-it-works" variant="cream" size="lg" className="st-pills" />
        </div>
        <div id="st-panel" role="tabpanel" aria-labelledby={`st-tab-${selected}`} className="m-panel">
          <div className="m-phone" data-staged="true">
            <span className="m-shadow" aria-hidden="true" />
            <div className="ph">
              <span className="ph-body" aria-hidden="true" />
              <div className="ph-screen">
                {STEPS.steps.map((step, i) => (
                  <Image
                    key={step.n}
                    src={step.src}
                    alt={i === selected ? step.alt : ''}
                    fill
                    sizes={SIZES}
                    quality={90}
                    className="m-screen"
                    data-selected={i === selected ? 'true' : undefined}
                    style={{ objectFit: 'cover', objectPosition: '50% 0%' }}
                  />
                ))}
              </div>
            </div>
          </div>
          <StagedNote className="m-note" />
        </div>
      </div>
    </section>
  )
}
