'use client'

import type { ElementType } from 'react'
import { motion, useTransform, type MotionValue } from 'framer-motion'

// One sentence that fades in word by word with scroll. The words stay plain text
// in one element, from first paint; each word starts at .12, never at 0, and
// .ah-m shows them all when motion is off.

function Word({
  word,
  progress,
  from,
  to,
  accent,
}: {
  word: string
  progress: MotionValue<number>
  from: number
  to: number
  accent: boolean
}) {
  const opacity = useTransform(progress, [from, to], [0.12, 1])
  return (
    <motion.span className="ah-m" style={{ opacity, color: accent ? 'var(--ah-signal)' : undefined }}>
      {word}
    </motion.span>
  )
}

export default function WordFade({
  text,
  progress,
  range = [0, 1],
  accentFrom,
  as: Tag = 'p',
  className,
}: {
  text: string
  progress: MotionValue<number>
  /** The part of progress the sentence fades over. */
  range?: [number, number]
  /** Index of the first word in Signal green; the rest of the sentence follows it. */
  accentFrom?: number
  as?: ElementType
  className?: string
}) {
  const words = text.split(' ')
  const step = (range[1] - range[0]) / words.length
  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={i}>
          {i > 0 && ' '}
          <Word
            word={word}
            progress={progress}
            from={range[0] + i * step}
            to={range[0] + (i + 1) * step}
            accent={accentFrom !== undefined && i >= accentFrom}
          />
        </span>
      ))}
    </Tag>
  )
}
