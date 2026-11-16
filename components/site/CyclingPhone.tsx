'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useMotionPiece } from './MotionPrefs'
import PhoneBody from './PhoneBody'

// A phone that floats gently and shows its screens in turn, so a mockup never stands still.
// It stops with the page's pause control, off screen and under reduced motion.
const STEP_MS = 3800

export type Screen = { src: string; alt: string; focus?: string }

export default function CyclingPhone({ screens, sizes, preload = false }: { screens: readonly Screen[]; sizes: string; preload?: boolean }) {
  const { ref, running } = useMotionPiece<HTMLDivElement>()
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => setShown((i) => (i + 1) % screens.length), STEP_MS)
    return () => clearInterval(timer)
  }, [running, screens.length])

  return (
    <div ref={ref} className="ph-cycle" data-running={running}>
      <div className="ph" data-staged="true">
        <PhoneBody />
        <div className="ph-screen">
          {screens.map((screen, i) => (
            <Image
              key={screen.src}
              src={screen.src}
              alt={i === shown ? screen.alt : ''}
              fill
              sizes={sizes}
              quality={75}
              className="ph-cycle-screen"
              data-shown={i === shown ? 'true' : undefined}
              style={{ objectFit: 'cover', objectPosition: screen.focus ?? '50% 0%' }}
              {...(preload && i === 0 ? { preload } : {})}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
