#!/usr/bin/env node
// Makes the phone pictures on the front page and the SEO pages from a capture
// folder: WebP, 720 px wide, in public/app-screens/. Refresh with
//   node scripts/build-app-screens.mjs <capture folder>
// then look at every frame and update lib/screen-captures.ts: the width and
// height (test/screen-captures.test.ts fails when they drift) and the regions
// (it cannot see a button that moved inside a frame of the same size).
// Originals stay outside the repo. See CAPTURES.md in the capture folder.
// Nothing in public/ changes unless every frame was made.
import { mkdir, mkdtemp, rename, rm, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const CAPTURES = process.argv[2]
if (!CAPTURES) throw new Error('Usage: node scripts/build-app-screens.mjs <capture folder>')
const OUT = path.resolve(import.meta.dirname, '../public/app-screens')
const WIDTH = 720
const QUALITY = 88

// Output name -> capture. Only frames that are allowed on the site: Altid Mad
// and Altid Energi from sim/ (syn/ draws them without the release flags) and
// the site-safe b.* set of Altid Forsikring.
const FRAMES = {
  'hjem.top': 'sim/hjem/hjem.top.png',
  'hjem.top.full': 'sim/hjem/hjem.top.full.png',
  'okonomi.top': 'sim/okonomi/okonomi.top.png',
  'okonomi.top.full': 'sim/okonomi/okonomi.top.full.png',
  'okonomi.regninger': 'sim/okonomi/regninger.top.png',
  'okonomi.droemme': 'sim/okonomi/droemme.detail.png',
  'mad.home': 'sim/mad/mad.home.png',
  'mad.meal_plan': 'sim/mad/mad.meal_plan.png',
  'mad.trip': 'sim/mad/mad.trip.in_progress.png',
  'energi.home': 'sim/energi/energi.home.png',
  'energi.usage': 'sim/energi/energi.usage.png',
  'forsikring.welcome': 'sim/forsikring/b.welcome.1.png',
  'forsikring.flow': 'sim/forsikring/b.flow.3_insurances_chosen.png',
  'forsikring.forlob': 'sim/forsikring/b.forlob.waiting.png',
}

// Regions below are in capture pixels.
const CAPTURE_WIDTH = 1179
const CLOCK = { left: 140, top: 50, width: 150, height: 80 }
// The paper top of a screen with a dark clock, painted over a panning capture
// once its dark hero has scrolled away.
const PAPER_STATUS_BAR = { source: 'sim/okonomi/droemme.detail.png', left: 0, top: 0, width: 1179, height: 170 }

async function rawRegion(file, r) {
  const { data, info } = await sharp(file).extract(r).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return { data, width: info.width, height: info.height }
}

// Paints a rectangle from a background column next to it, keeping a vertical
// gradient intact.
async function backgroundPatch(file, r, sampleX) {
  const column = await sharp(file)
    .extract({ left: sampleX, top: r.top, width: 1, height: r.height })
    .resize({ width: r.width, height: r.height, kernel: 'nearest', fit: 'fill' })
    .png()
    .toBuffer()
  return { input: column, left: r.left, top: r.top }
}

// The dark 09.41 from a light frame as a mask, so it sits on any light
// background without a visible box. Same status bar layout, same position.
async function darkClockMask(file) {
  const { data, width, height } = await rawRegion(file, CLOCK)
  const luminance = (i) => 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
  let min = 255
  let max = 0
  for (let i = 0; i < data.length; i += 4) {
    min = Math.min(min, luminance(i))
    max = Math.max(max, luminance(i))
  }
  if (max === min) throw new Error(`No clock to copy in ${file}: the region is one colour`)
  const out = Buffer.alloc(data.length)
  for (let i = 0; i < data.length; i += 4) {
    out[i] = out[i + 1] = out[i + 2] = Math.round(min)
    out[i + 3] = Math.round((255 * (max - luminance(i))) / (max - min))
  }
  return sharp(out, { raw: { width, height, channels: 4 } }).png().toBuffer()
}

// b.forlob.waiting was captured at 18.17, with the same time on the timeline.
// A tour reads 09.41 throughout: the clock is repainted and the timeline's time
// is removed, so the two cannot disagree.
async function retimedForlob(file) {
  const clockSource = path.join(CAPTURES, PAPER_STATUS_BAR.source)
  const timelineTime = { left: 60, top: 532, width: 110, height: 68 }
  return sharp(file)
    .composite([
      await backgroundPatch(file, CLOCK, 100),
      { input: await darkClockMask(clockSource), left: CLOCK.left, top: CLOCK.top },
      await backgroundPatch(file, timelineTime, 40),
    ])
    .png()
    .toBuffer()
}

async function write(input, name) {
  const target = path.join(WORK, `${name}.webp`)
  const info = await sharp(input)
    .resize({ width: WIDTH })
    .webp({ quality: QUALITY, smartSubsample: true, effort: 6 })
    .toFile(target)
  const { size } = await stat(target)
  console.log(`${name.padEnd(24)} ${info.width} x ${info.height}  ${Math.round(size / 1024)} KB`)
}

for (const source of [...Object.values(FRAMES), PAPER_STATUS_BAR.source]) {
  const { width } = await sharp(path.join(CAPTURES, source)).metadata()
  if (width !== CAPTURE_WIDTH) throw new Error(`${source} is ${width} px wide, expected ${CAPTURE_WIDTH}`)
}

// Next to public/, so the renames below stay on one disk.
const WORK = await mkdtemp(path.join(path.dirname(OUT), '..', '.app-screens-'))
for (const [name, source] of Object.entries(FRAMES)) {
  const file = path.join(CAPTURES, source)
  await write(name === 'forsikring.forlob' ? await retimedForlob(file) : file, name)
}
const { source, ...region } = PAPER_STATUS_BAR
await write(await sharp(path.join(CAPTURES, source)).extract(region).png().toBuffer(), 'statusbar.paper')

await mkdir(OUT, { recursive: true })
for (const name of [...Object.keys(FRAMES), 'statusbar.paper']) {
  await rename(path.join(WORK, `${name}.webp`), path.join(OUT, `${name}.webp`))
}
await rm(WORK, { recursive: true })
