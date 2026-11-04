'use client'

import { preload } from 'react-dom'
import { SCREENS, screenSrc, type ScreenId } from '@/lib/screen-captures'

/** A picture of the app, full width of its box. Its height is reserved, so nothing shifts when it loads. */
export default function AppFrame({
  id,
  alt = '',
  priority = false,
  eager = false,
}: {
  id: ScreenId
  alt?: string
  /** The first hero frame: preloaded, fetched before everything else. */
  priority?: boolean
  /** On screen from the first paint, so not left to lazy loading. */
  eager?: boolean
}) {
  const src = screenSrc(id)
  if (priority) preload(src, { as: 'image', fetchPriority: 'high' })
  return (
    // A fixed WebP, not next/image: the text in a frame stays as crisp as the build made it.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={SCREENS[id].width}
      height={SCREENS[id].height}
      loading={priority || eager ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      style={{ display: 'block', width: '100%', height: 'auto' }}
    />
  )
}

/** Whether a frame can be shown. A frame that fails is logged, and whoever asked keeps the one it has. */
export async function decodeFrame(id: ScreenId): Promise<boolean> {
  const img = new window.Image()
  img.src = screenSrc(id)
  try {
    await img.decode()
    return true
  } catch (error) {
    console.error(`App frame ${id} could not be loaded`, error)
    return false
  }
}
