'use client'

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type TouchEvent } from 'react'
import { OKONOMI } from './copy'
import { useMotionPiece } from './MotionPrefs'

// The app's spending categories. Tabs: the selected one sits centred under the spotlight,
// the others dim beside it, and its name shows under it.
const ADVANCE_MS = 5000
const START = 1
const SWIPE_PX = 40
const COUNT = OKONOMI.categories.length

export default function CategoryCarousel() {
  const { ref, running } = useMotionPiece<HTMLDivElement>()
  const [selected, setSelected] = useState(START)
  const [picked, setPicked] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [focused, setFocused] = useState(false)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const advancing = running && !picked && !hovering && !focused
  useEffect(() => {
    if (!advancing) return
    const timer = setInterval(() => setSelected((day) => (day + 1) % COUNT), ADVANCE_MS)
    return () => clearInterval(timer)
  }, [advancing])

  // A manual pick stops the advance for good.
  const pick = (day: number) => {
    setSelected(day)
    setPicked(true)
  }

  // On a phone the plates beside the selected one are cut by the screen, so a swipe is
  // what a thumb tries first.
  const onTouchEnd = (event: TouchEvent) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const { clientX, clientY } = event.changedTouches[0]
    const across = clientX - start.x
    // A page scroll that starts on a plate drifts sideways too, and must not pick one.
    if (Math.abs(across) < SWIPE_PX || Math.abs(across) < Math.abs(clientY - start.y)) return
    pick((selected + (across < 0 ? 1 : COUNT - 1)) % COUNT)
  }

  const onKeyDown = (event: KeyboardEvent, day: number) => {
    const target = { ArrowRight: (day + 1) % COUNT, ArrowLeft: (day + COUNT - 1) % COUNT, Home: 0, End: COUNT - 1 }[event.key]
    if (target === undefined) return
    event.preventDefault()
    pick(target)
    tabs.current[target]?.focus()
  }

  return (
    <div
      ref={ref}
      className="plates"
      data-running={running}
      onPointerEnter={(event) => event.pointerType === 'mouse' && setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onTouchStart={(event) => {
        // A second finger is a pinch, not a swipe.
        touchStart.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null
      }}
      onTouchEnd={onTouchEnd}
    >
      <div className="plates-row" role="tablist" aria-label={OKONOMI.categoriesLabel} style={{ '--sel': selected } as CSSProperties}>
        {OKONOMI.categories.map((category, i) => (
          <button
            key={category.name}
            ref={(el) => {
              tabs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`plate-tab-${i}`}
            aria-selected={i === selected}
            aria-controls="plate-panel"
            aria-label={category.name}
            tabIndex={i === selected ? 0 : -1}
            className="plate"
            data-selected={i === selected ? 'true' : undefined}
            style={{ '--d': Math.abs(i - selected) } as CSSProperties}
            onClick={() => pick(i)}
            onKeyDown={(event) => onKeyDown(event, i)}
          >
            <span className="plate-icon" data-tone={category.tone}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={category.icon} alt="" width={64} height={64} />
            </span>
          </button>
        ))}
      </div>
      <p id="plate-panel" role="tabpanel" aria-labelledby={`plate-tab-${selected}`} className="plate-name">
        {OKONOMI.categories[selected].name}
      </p>
    </div>
  )
}
