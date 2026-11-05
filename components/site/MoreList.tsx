'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { MORE } from './copy'
import { useMotionPiece, useMotionPrefs } from './MotionPrefs'
import StagedNote from './StagedNote'

// Tabs. The active row grows and its ring counts down to the next; the list scrolls itself
// to keep the active row on top, without moving the page. A screen is fetched when it
// becomes the next one up, so nine captures do not all load for someone who never gets here.
const STEP_MS = 6000
const TICK_MS = 100
const COUNT = MORE.rows.length
const SIZES = '(max-width: 767px) 224px, 290px'

export default function MoreList() {
  const { ref, running } = useMotionPiece<HTMLDivElement>()
  const { reduced } = useMotionPrefs()
  const [selected, setSelected] = useState(0)
  const [picked, setPicked] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [focused, setFocused] = useState(false)
  const [loaded, setLoaded] = useState<ReadonlySet<number>>(() => new Set([0, 1]))
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const list = useRef<HTMLDivElement>(null)
  const elapsed = useRef(0)
  const current = useRef(0)

  const select = (index: number) => {
    current.current = index
    elapsed.current = 0
    setSelected(index)
    setLoaded((seen) => new Set(seen).add(index).add((index + 1) % COUNT))
  }

  useEffect(() => {
    ref.current?.style.setProperty('--progress', '0')
    const scroller = list.current
    const tab = tabs.current[selected]
    if (!scroller || !tab) return
    const behavior = reduced ? 'auto' : 'smooth'
    if (scroller.scrollWidth > scroller.clientWidth + 1) {
      scroller.scrollTo?.({ left: tab.offsetLeft - parseFloat(getComputedStyle(scroller).paddingLeft), behavior })
    } else {
      scroller.scrollTo?.({ top: tab.offsetTop, behavior })
    }
  }, [selected, ref, reduced])

  const advancing = running && !picked && !hovering && !focused
  useEffect(() => {
    if (!advancing) return
    const timer = setInterval(() => {
      elapsed.current += TICK_MS
      if (elapsed.current >= STEP_MS) {
        select((current.current + 1) % COUNT)
      } else {
        ref.current?.style.setProperty('--progress', String(elapsed.current / STEP_MS))
      }
    }, TICK_MS)
    return () => clearInterval(timer)
  }, [advancing, ref])

  // A manual pick stops the advance for good.
  const pick = (index: number) => {
    select(index)
    setPicked(true)
  }

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const target = {
      ArrowDown: (index + 1) % COUNT,
      ArrowRight: (index + 1) % COUNT,
      ArrowUp: (index + COUNT - 1) % COUNT,
      ArrowLeft: (index + COUNT - 1) % COUNT,
      Home: 0,
      End: COUNT - 1,
    }[event.key]
    if (target === undefined) return
    event.preventDefault()
    pick(target)
    tabs.current[target]?.focus()
  }

  return (
    <section data-b="more" className="sec m" aria-labelledby="m-title">
      <div
        ref={ref}
        className="m-grid"
        data-running={running}
        onPointerEnter={(event) => event.pointerType === 'mouse' && setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <div className="m-left">
          <h2 id="m-title" className="t-h2">
            {MORE.title}
          </h2>
          <p className="t-body m-line">{MORE.line}</p>
          <div
            ref={list}
            className="m-list"
            role="tablist"
            aria-label={MORE.listLabel}
            aria-orientation="vertical"
            // A swipe through the rows on a phone is reading: the list stops pulling back.
            onPointerDown={(event) => event.pointerType !== 'mouse' && setPicked(true)}
          >
            {MORE.rows.map((item, i) => (
              <button
                key={item.title}
                ref={(el) => {
                  tabs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`m-tab-${i}`}
                aria-selected={i === selected}
                aria-controls="m-panel"
                tabIndex={i === selected ? 0 : -1}
                className="m-row"
                data-selected={i === selected ? 'true' : undefined}
                onClick={() => pick(i)}
                onKeyDown={(event) => onKeyDown(event, i)}
              >
                <span className="m-row-title">{item.title}</span>
                <span className="m-row-body">{item.body}</span>
                <span className="m-ring" aria-hidden="true">
                  <svg viewBox="0 0 22 22" width="22" height="22">
                    <circle cx="11" cy="11" r="10" pathLength="1" className="m-ring-track" />
                    <circle cx="11" cy="11" r="10" pathLength="1" className="m-ring-progress" />
                    <path d="M7 11h8M12 8l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </div>
        <div id="m-panel" role="tabpanel" aria-labelledby={`m-tab-${selected}`} className="m-panel">
          <div className="m-phone" data-staged="true">
            <span className="m-shadow" aria-hidden="true" />
            <div className="ph">
              <span className="ph-body" aria-hidden="true" />
              <div className="ph-screen">
                {MORE.rows.map((item, i) =>
                  loaded.has(i) ? (
                    <Image
                      key={item.title}
                      src={item.src}
                      alt={i === selected ? item.alt : ''}
                      fill
                      sizes={SIZES}
                      quality={90}
                      className="m-screen"
                      data-selected={i === selected ? 'true' : undefined}
                      style={{ objectFit: 'cover', objectPosition: '50% 0%' }}
                    />
                  ) : null,
                )}
              </div>
            </div>
          </div>
          <StagedNote className="m-note" />
        </div>
      </div>
    </section>
  )
}
