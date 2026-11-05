'use client'

import { useCallback, type CSSProperties, type ReactNode } from 'react'
import './reveal.css'

// One beat the first time something comes into view, then still. Nothing is hidden
// until the client has JS and motion is allowed (reveal.css), so the static page shows
// it all. margin shrinks the bottom of the viewport: how far in it has to come.
export default function Reveal({
  id,
  margin = '-6%',
  className = '',
  style,
  children,
}: {
  id?: string
  margin?: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const watch = useCallback(
    (el: HTMLDivElement | null) => {
      if (el === null) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          observer.disconnect()
          el.dataset.in = ''
        },
        { rootMargin: `0px 0px ${margin} 0px` },
      )
      observer.observe(el)
      return () => observer.disconnect()
    },
    [margin],
  )
  return (
    <div ref={watch} id={id} className={`ah-reveal ${className}`} style={style}>
      {children}
    </div>
  )
}
