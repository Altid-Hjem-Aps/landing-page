'use client'

import AppFrame from '@/components/AppFrame'
import { CARD_BORDER, CARD_SHADOW, mockupEntranceStyle, useMockupStart } from '@/components/seo/hjemKit'
import { SCREENS, type Frame } from '@/lib/screen-captures'

// Full-height frames are drawn narrower, so the card stays about as tall as the article around it allows.
const FULL_FRAME_WIDTH = 270
const CROP_WIDTH = 340

/** A picture of the app in an SEO article: a floating card, no phone around it. */
export default function AppScreenCard({ frame }: { frame: Frame }) {
  const { ref, reduced, entered } = useMockupStart()
  const { width, height } = SCREENS[frame.id]
  const isFullFrame = height > width * 2

  return (
    <div
      ref={ref}
      className="w-full rounded-[24px] overflow-hidden hjem-motion-scope"
      style={{
        maxWidth: isFullFrame ? FULL_FRAME_WIDTH : CROP_WIDTH,
        backgroundColor: '#ffffff',
        border: `1px solid ${CARD_BORDER}`,
        boxShadow: CARD_SHADOW,
        ...mockupEntranceStyle(entered, reduced),
      }}
    >
      <AppFrame {...frame} />
    </div>
  )
}
