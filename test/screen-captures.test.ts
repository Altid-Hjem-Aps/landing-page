// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { sceneOpacities } from '@/components/sections/why/cards'
import { HERO_FRAMES, SCREENS, SEO_FRAMES, STORY_SCENES, screenSrc, type ScreenId } from '@/lib/screen-captures'

const { imageSize } = createRequire(import.meta.url)('next/dist/compiled/image-size') as {
  imageSize: (input: Buffer) => { width?: number; height?: number }
}

// Risk: a refreshed capture changes size, a lift lands on the wrong part of the
// screen, or a picture is shown that the manifest does not know about.

describe('the capture manifest', () => {
  it.each(Object.keys(SCREENS) as ScreenId[])('%s has the listed size on disk', (id) => {
    const file = readFileSync(path.join(process.cwd(), 'public', screenSrc(id)))
    const { width, height } = imageSize(file)
    expect({ width, height }).toEqual({ width: SCREENS[id].width, height: SCREENS[id].height })
  })

  it('lists exactly the files in public/app-screens', () => {
    const files = readdirSync(path.join(process.cwd(), 'public/app-screens')).sort()
    expect(files).toEqual(Object.keys(SCREENS).map((id) => `${id}.webp`).sort())
  })

  it('shows only frames from the manifest, and every frame in it is shown', () => {
    const shown = [...HERO_FRAMES, ...STORY_SCENES, ...Object.values(SEO_FRAMES)].map((f) => f.id as string)
    expect(new Set(shown)).toEqual(new Set(Object.keys(SCREENS)))
  })

  it('never takes a picture from the frames that are not the store build', () => {
    for (const { source } of Object.values(SCREENS)) {
      expect(source).toMatch(/^v1\.0\.3 sim\//)
      expect(source).not.toMatch(/store-assets/)
      expect(source).not.toMatch(/\/a\./)
    }
  })

  it('keeps every lift inside its image', () => {
    const lifts = STORY_SCENES.flatMap((s) => (s.lift ? [{ id: s.id, ...s.lift }] : []))
    expect(lifts.length).toBeGreaterThan(0)
    for (const { id, x, y, width, height } of lifts) {
      expect(x).toBeGreaterThanOrEqual(0)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(x + width).toBeLessThanOrEqual(SCREENS[id].width)
      expect(y + height).toBeLessThanOrEqual(SCREENS[id].height)
    }
  })
})

describe('the story frames', () => {
  const froms = [0, 0.5, 0.8]

  it('shows the next frame on top once its time has come', () => {
    expect(sceneOpacities(0.4, froms, [true, true, true])).toEqual([1, 0, 0])
    expect(sceneOpacities(0.6, froms, [true, true, true])).toEqual([1, 1, 0])
    expect(sceneOpacities(1, froms, [true, true, true])).toEqual([1, 1, 1])
  })

  // Risk: a failed image blanks the phone in the middle of the story.
  it('keeps the current frame when the next one failed', () => {
    expect(sceneOpacities(0.6, froms, [true, false, true])).toEqual([1, 0, 0])
    expect(sceneOpacities(0.9, froms, [true, true, false])).toEqual([1, 1, 0])
  })

  // Risk: the first frame fails and the phone is blank until the next one's time.
  it('opens on the first frame that loaded', () => {
    expect(sceneOpacities(0.1, froms, [false, true, true])).toEqual([0, 1, 0])
  })
})
