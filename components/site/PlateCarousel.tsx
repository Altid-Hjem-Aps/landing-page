'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { MAD } from './copy'
import { useMotionPiece } from './MotionPrefs'

// The week of plates. Tabs: the selected plate sits centered under the spotlight, the
// others dim beside it. Each tab's label is its day; the selected one shows the dish.
const ADVANCE_MS = 5000
const START = 1
const COUNT = MAD.plates.length

export default function PlateCarousel() {
  const { ref, running } = useMotionPiece<HTMLDivElement>()
  const [selected, setSelected] = useState(START)
  const [picked, setPicked] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [focused, setFocused] = useState(false)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

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
    >
      <div className="plates-row" role="tablist" aria-label={MAD.weekLabel} style={{ '--sel': selected } as CSSProperties}>
        {MAD.days.map((day, i) => (
          <button
            key={day}
            ref={(el) => {
              tabs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`plate-tab-${i}`}
            aria-selected={i === selected}
            aria-controls="plate-panel"
            aria-label={day}
            tabIndex={i === selected ? 0 : -1}
            className="plate"
            data-selected={i === selected ? 'true' : undefined}
            style={{ '--d': Math.abs(i - selected) } as CSSProperties}
            onClick={() => pick(i)}
            onKeyDown={(event) => onKeyDown(event, i)}
          >
            <Image src={MAD.plates[i].src} alt="" width={160} height={160} sizes="320px" quality={90} />
            <span className="plate-day">{day}</span>
          </button>
        ))}
      </div>
      <p id="plate-panel" role="tabpanel" aria-labelledby={`plate-tab-${selected}`} className="plate-name">
        {MAD.plates[selected].name}
      </p>
    </div>
  )
}
