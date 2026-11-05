'use client'

import { useEffect, useRef } from 'react'
import { preload } from 'react-dom'
import { useMotionPiece } from './MotionPrefs'

// The looping tunnel of light. Nothing autoplays from the HTML: the poster is what a
// reduced-motion visitor gets, and the video plays only while the effective state says so.
export default function HeroTunnel() {
  // The poster is the page's largest paint, and a video's poster is found late otherwise.
  preload('/site/render/tunnel-poster.webp', { as: 'image', fetchPriority: 'high' })
  const { ref, running } = useMotionPiece<HTMLDivElement>()
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const element = video.current as HTMLVideoElement
    // On the first effect the motion state has not caught up with the browser yet, and
    // a play() there would fetch the video for a reduced-motion visitor.
    if (running && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && document.visibilityState === 'visible') {
      // A browser may refuse autoplay, for example in power saving. The poster then stays,
      // which is a finished picture, and nothing else depends on the video playing.
      // Started after load: the poster is the same picture, and the page's first paint
      // should not wait on the video.
      const start = () => void element.play().catch(() => {})
      if (document.readyState === 'complete') {
        start()
        return
      }
      window.addEventListener('load', start, { once: true })
      return () => window.removeEventListener('load', start)
    }
    element.pause()
  }, [running])

  return (
    <div ref={ref} className="h-tunnel-wrap" data-running={running}>
      <video ref={video} className="h-tunnel" poster="/site/render/tunnel-poster.webp" muted loop playsInline preload="none" tabIndex={-1}>
        <source src="/site/render/tunnel.webm" type="video/webm" />
        <source src="/site/render/tunnel.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
