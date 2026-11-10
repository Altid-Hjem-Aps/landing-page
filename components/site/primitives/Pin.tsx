'use client'

import { useRef, type ReactNode, type RefObject } from 'react'
import { useScroll, useTransform, type MotionValue, type UseScrollOptions } from 'framer-motion'

// A pinned scene. Heights come from CSS (app/globals.css, .ah-pin), never from
// state, so hydrating moves nothing. Without JS, with reduced motion or on a
// screen under 500 px high it is plain flow with height auto.
//
// children is a function, so a section using Pin is a client component.

// Use this, never useScroll({ target }) directly, when motion elements sit inside
// the target. framer-motion 12.38 runs opacity on a native scroll timeline, set up
// when the motion element mounts. A child mounts before its parent's ref is
// attached, so the timeline gets no target and follows the whole page: opacity
// runs far behind while transforms look right. Passing the value through a
// function drops that path, and everything runs from the same JS value.
export function useTargetProgress(
  target: RefObject<HTMLElement | null>,
  offset: UseScrollOptions['offset'] = ['start start', 'end end'],
): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target, offset })
  return useTransform(scrollYProgress, (v) => v)
}

export default function Pin({
  vh,
  mobileVh,
  className = '',
  stickyClassName = '',
  children,
}: {
  /** Scroll length of the whole pin in svh, at 768 px and wider. */
  vh: number
  /** The same under 768 px. null: not pinned there, static flow. */
  mobileVh: number | null
  /** The stage background goes here, so no gap shows when the address bar moves. */
  className?: string
  stickyClassName?: string
  children: (progress: MotionValue<number>) => ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const progress = useTargetProgress(ref)
  const heights = {
    '--ah-pin-h': `${vh}svh`,
    '--ah-pin-h-mobile': mobileVh === null ? 'auto' : `${mobileVh}svh`,
  } as React.CSSProperties
  return (
    <div
      ref={ref}
      className={`ah-pin ${mobileVh === null ? 'ah-pin--flow-mobile' : ''} ${className}`}
      style={heights}
    >
      <div className={`ah-pin-sticky ${stickyClassName}`}>{children(progress)}</div>
    </div>
  )
}
