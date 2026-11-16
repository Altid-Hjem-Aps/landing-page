'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useMotionPiece, useMotionPrefs } from './MotionPrefs'

// A slow right-to-left loop while in view. The list is drawn twice for the loop: the
// second copy is aria-hidden, so a screen reader and the tab key meet every item once.
// With reduced motion it is a plain scroller; `scrollsByKey` makes one with no links in it
// reachable from the keyboard.
//
// `swipe` (the gallery rows on a phone, Thor 15/11): the loop is driven here instead of by the
// CSS animation, so a finger can take the row, drag it either way and let it glide; then it
// carries on at its own pace. A vertical swipe still scrolls the page (touch-action: pan-y).
// `reverse` runs it left to right.
export default function Marquee({
  label,
  className,
  first,
  second,
  scrollsByKey = false,
  swipe = false,
  reverse = false,
}: {
  label: string
  className: string
  first: ReactNode
  second: ReactNode
  scrollsByKey?: boolean
  swipe?: boolean
  reverse?: boolean
}) {
  const { ref, running } = useMotionPiece<HTMLDivElement>()
  const { reduced } = useMotionPrefs()
  const track = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const offset = useRef(0)

  useEffect(() => {
    if (!swipe || reduced) return
    const host = ref.current as HTMLDivElement
    const row = track.current as HTMLDivElement
    const firstList = list.current as HTMLUListElement
    // One copy's width: the loop wraps there, where the second copy stands in for the first.
    const loop = () => firstList.offsetWidth
    const wrap = (x: number) => {
      const w = loop()
      return w > 0 ? (((x % w) + w) % w) - w : x
    }
    // The CSS animation's own pace: one copy per --mq-time.
    const seconds = () => parseFloat(getComputedStyle(host).getPropertyValue('--mq-time')) || 70
    const direction = reverse ? 1 : -1
    let velocity = 0
    let frame = 0
    let last = performance.now()
    let held: { id: number; x: number; y: number; from: number; dragging: boolean; samples: { t: number; x: number }[] } | null = null

    const place = () => {
      row.style.transform = `translate3d(${offset.current.toFixed(2)}px, 0, 0)`
    }
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!held?.dragging) {
        offset.current = wrap(offset.current + direction * (loop() / seconds()) * dt + velocity * dt)
        // The glide after a flick fades out in about half a second.
        velocity *= Math.exp(-dt * 5)
        if (Math.abs(velocity) < 1) velocity = 0
        place()
      }
      frame = requestAnimationFrame(tick)
    }

    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      held = { id: e.pointerId, x: e.clientX, y: e.clientY, from: offset.current, dragging: false, samples: [{ t: e.timeStamp, x: e.clientX }] }
      velocity = 0
    }
    const move = (e: PointerEvent) => {
      if (!held || e.pointerId !== held.id) return
      const dx = e.clientX - held.x
      if (!held.dragging) {
        if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(e.clientY - held.y)) return
        held.dragging = true
        host.setPointerCapture(e.pointerId)
      }
      offset.current = wrap(held.from + dx)
      place()
      held.samples.push({ t: e.timeStamp, x: e.clientX })
      if (held.samples.length > 5) held.samples.shift()
    }
    const up = (e: PointerEvent) => {
      if (!held || e.pointerId !== held.id) return
      if (held.dragging && held.samples.length > 1) {
        const a = held.samples[0]
        const b = held.samples[held.samples.length - 1]
        const ms = b.t - a.t
        if (ms > 0 && e.timeStamp - b.t < 80) velocity = Math.max(-2500, Math.min(2500, ((b.x - a.x) / ms) * 1000))
      }
      held = null
    }

    host.addEventListener('pointerdown', down)
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerup', up)
    host.addEventListener('pointercancel', up)
    if (running) frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      host.removeEventListener('pointerdown', down)
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerup', up)
      host.removeEventListener('pointercancel', up)
    }
  }, [swipe, reduced, running, reverse, ref])

  return (
    <div
      ref={ref}
      className={`mq ${className}`}
      data-running={running}
      data-swipe={swipe && !reduced ? 'true' : undefined}
      role="group"
      aria-label={label}
      tabIndex={scrollsByKey && reduced ? 0 : undefined}
    >
      <div ref={track} className="mq-track">
        <ul ref={list} className="mq-list">
          {first}
        </ul>
        <ul className="mq-list" aria-hidden="true">
          {second}
        </ul>
      </div>
    </div>
  )
}
