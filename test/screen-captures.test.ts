// @vitest-environment node
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { SCREENS, STATUS_STRIP_HEIGHT, TOURS, VISIBLE_SCREEN_HEIGHT, screenSrc, type ScreenId } from '@/lib/screen-captures'

const { imageSize } = createRequire(import.meta.url)('next/dist/compiled/image-size') as {
  imageSize: (input: Buffer) => { width?: number; height?: number }
}

// Risk: a refreshed capture changes size, and a tap dot, a pan or a lift
// silently lands on the wrong part of the screen or runs off the picture.

const tours = Object.entries(TOURS)

describe('the capture manifest', () => {
  it.each(Object.keys(SCREENS) as ScreenId[])('%s has the listed size on disk', (id) => {
    const file = readFileSync(path.join(process.cwd(), 'public', screenSrc(id)))
    const { width, height } = imageSize(file)
    expect({ width, height }).toEqual({ width: SCREENS[id].width, height: SCREENS[id].height })
  })
})

describe.each(tours)('the %s tour', (_name, tour) => {
  it('has at most three scenes, all different', () => {
    expect(tour.scenes.length).toBeLessThanOrEqual(3)
    expect(new Set(tour.scenes.map((s) => s.id)).size).toBe(tour.scenes.length)
  })

  it('keeps every pan and tap inside its image', () => {
    for (const scene of tour.scenes) {
      const image = SCREENS[scene.panTo?.image ?? scene.id]
      if (scene.panTo) {
        expect(scene.panTo.y, scene.id).toBeGreaterThan(0)
        expect(scene.panTo.y + VISIBLE_SCREEN_HEIGHT, scene.id).toBeLessThanOrEqual(image.height)
        // The status bar turns light as the dark top passes under it: that has to
        // happen during the pan, and not before it starts.
        expect(scene.panTo.foldY, scene.id).toBeGreaterThanOrEqual(STATUS_STRIP_HEIGHT)
        expect(scene.panTo.foldY - STATUS_STRIP_HEIGHT, scene.id).toBeLessThan(scene.panTo.y)
      }
      if (scene.tap) {
        const top = scene.panTo?.y ?? 0
        expect(scene.tap.x, scene.id).toBeLessThanOrEqual(image.width)
        expect(scene.tap.y, scene.id).toBeGreaterThanOrEqual(top)
        expect(scene.tap.y, scene.id).toBeLessThanOrEqual(top + VISIBLE_SCREEN_HEIGHT)
      }
    }
  })

  it.skipIf(!tour.lift)('lifts a crop that lies inside a scene of the tour', () => {
    const { sceneId, x, y, width, height } = tour.lift!
    expect(tour.scenes.map((s) => s.id)).toContain(sceneId)
    const image = SCREENS[sceneId]
    expect(x).toBeGreaterThanOrEqual(0)
    expect(y).toBeGreaterThanOrEqual(0)
    expect(x + width).toBeLessThanOrEqual(image.width)
    expect(y + height).toBeLessThanOrEqual(VISIBLE_SCREEN_HEIGHT)
  })
})
