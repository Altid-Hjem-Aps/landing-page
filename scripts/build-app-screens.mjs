#!/usr/bin/env node
// Makes the app pictures on the front page and the SEO pages from a capture
// folder: WebP, 720 px wide, in public/app-screens/, plus the share card
// app/opengraph-image.png. Refresh with
//   node scripts/build-app-screens.mjs <capture folder>
// then look at every frame and update lib/screen-captures.ts: the height
// (test/screen-captures.test.ts fails when it drifts) and the lift region (it
// cannot see a bubble that moved inside a frame of the same size).
// Originals stay outside the repo. See CAPTURES.md in the capture folder.
// Nothing in public/ changes unless every frame was made.
import { mkdir, mkdtemp, rename, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const CAPTURES = process.argv[2]
if (!CAPTURES) throw new Error('Usage: node scripts/build-app-screens.mjs <capture folder>')
const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'public/app-screens')
const OG = path.join(ROOT, 'app/opengraph-image.png')
const WIDTH = 720
const QUALITY = 88
const CAPTURE_WIDTH = 1179
const capture = (source) => path.join(CAPTURES, 'sim', source)

// Regions below are in capture pixels.
const CLOCK = { left: 140, top: 50, width: 150, height: 80 }
// The paper top of a screen, with a dark clock.
const PAPER_TOP = { source: 'okonomi/droemme.detail.png', height: 170 }

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
// Frames read 09.41 throughout: the clock is repainted and the timeline's time
// is removed, so the two cannot disagree.
async function retimedForlob(file) {
  const timelineTime = { left: 60, top: 532, width: 110, height: 68 }
  return sharp(file)
    .composite([
      await backgroundPatch(file, CLOCK, 100),
      { input: await darkClockMask(capture(PAPER_TOP.source)), left: CLOCK.left, top: CLOCK.top },
      await backgroundPatch(file, timelineTime, 40),
    ])
    .png()
    .toBuffer()
}

// A frame captured mid scroll, where content runs under the clock. The board's
// crop starts below that: the strip above it gets the paper top of another
// screen, so the frame keeps its 09.41 and the rest stays as captured.
async function underPaperTop(file, cropTop) {
  const paper = await sharp(capture(PAPER_TOP.source))
    .extract({ left: 0, top: 0, width: CAPTURE_WIDTH, height: PAPER_TOP.height })
    .png()
    .toBuffer()
  const layers = [{ input: paper, left: 0, top: 0 }]
  if (cropTop > PAPER_TOP.height) {
    layers.push(
      await backgroundPatch(
        file,
        { left: 0, top: PAPER_TOP.height, width: CAPTURE_WIDTH, height: cropTop - PAPER_TOP.height },
        4,
      ),
    )
  }
  return sharp(file).composite(layers).png().toBuffer()
}

const cropped = (file, top, bottom) =>
  sharp(file).extract({ left: 0, top, width: CAPTURE_WIDTH, height: bottom - top }).png().toBuffer()

// Output name -> how it is made. Only frames allowed on the site: Altid Mad and
// Altid Energi from sim/ (syn/ draws them without the release flags) and the
// site-safe b.* set of Altid Forsikring. Each one is a row on Thor's board.
const FRAMES = {
  // Hero. Energi customer sheet: the other one offers "1. måned gratis*" with no footnote.
  'hjem.top': (f) => f('hjem/hjem.top.png'),
  'mere.sheet': (f) => f('hjem/mere.sheet.energi_customer.png'),
  'todo.madplan': (f) => f('hjem/hjem.todo_list.madplan.png'),
  // WhatIs story. The end is hjem.top, with its "Du er 3.000 kr. foran" bubble lifted.
  'regninger.top': (f) => f('okonomi/regninger.top.png'),
  'regninger.faste': (f) => underPaperTop(f('okonomi/regninger.chart.png'), 240),
  'okonomi.mod_normal': (f) => underPaperTop(f('okonomi/okonomi.mod_normal.png'), 165),
  // SEO pages.
  'energi.top': (f) => cropped(f('energi/energi.home.png'), 0, 1340),
  'energi.month_details': (f) => f('energi/energi.month_details.png'),
  'regninger.subscriptions': (f) => f('okonomi/regninger.subscriptions.png'),
  'forsikring.policy_list': (f) => cropped(f('forsikring/b.policy_list.png'), 190, 1990),
  'forsikring.household': (f) => f('forsikring/b.flow.1_household.png'),
  'forsikring.forlob': (f) => retimedForlob(f('forsikring/b.forlob.waiting.png')),
  // The crop runs a few pixels past the card into the dark top behind it.
  'mere.services_card': async (f) => {
    const file = f('hjem/mere.kommer_snart.crop.png')
    const { width, height } = await sharp(file).metadata()
    return sharp(file).extract({ left: 14, top: 0, width: width - 28, height }).png().toBuffer()
  },
}

// The share card: the left column stays, the phones are redrawn in the same
// layout with the same frames as the hero. Scale of PhoneShell's 270 x 560.
const OG_BACKGROUND = '#163223'
const OG_TEXT_WIDTH = 515
const OG_PHONES = [
  { frame: 'hjem/mere.sheet.energi_customer.png', width: 196, angle: -10, centre: [652, 363] },
  { frame: 'hjem/hjem.todo_list.madplan.png', width: 196, angle: 10, centre: [1038, 363] },
  { frame: 'hjem/hjem.top.png', width: 228, angle: 0, centre: [842, 298] },
]

async function ogPhone({ frame, width, angle }) {
  const k = width / 270
  const height = Math.round(560 * k)
  const pad = Math.round(8 * k)
  const innerWidth = width - 2 * pad
  const innerHeight = height - 2 * pad
  const shell = Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a3a3a"/><stop offset=".45" stop-color="#141414"/><stop offset="1" stop-color="#111"/></linearGradient></defs><rect width="${width}" height="${height}" rx="${52 * k}" fill="url(#g)"/></svg>`,
  )
  const mask = Buffer.from(
    `<svg width="${innerWidth}" height="${innerHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="${innerWidth}" height="${innerHeight}" rx="${44 * k}" fill="#fff"/></svg>`,
  )
  const screen = await sharp(capture(frame))
    .resize({ width: innerWidth, height: innerHeight, fit: 'cover', position: 'top' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer()
  const phone = await sharp(shell).composite([{ input: screen, left: pad, top: pad }]).png().toBuffer()
  return angle === 0 ? phone : sharp(phone).rotate(angle, { background: '#0000' }).png().toBuffer()
}

async function buildOg() {
  const { width, height } = await sharp(OG).metadata()
  const text = await sharp(OG).extract({ left: 0, top: 0, width: OG_TEXT_WIDTH, height }).png().toBuffer()
  const layers = [{ input: text, left: 0, top: 0 }]
  for (const phone of OG_PHONES) {
    const input = await ogPhone(phone)
    const m = await sharp(input).metadata()
    layers.push({
      input,
      left: Math.round(phone.centre[0] - m.width / 2),
      top: Math.round(phone.centre[1] - m.height / 2),
    })
  }
  return sharp({ create: { width, height, channels: 3, background: OG_BACKGROUND } })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toBuffer()
}

async function write(input, name) {
  const target = path.join(WORK, `${name}.webp`)
  const info = await sharp(input)
    .resize({ width: WIDTH })
    .webp({ quality: QUALITY, smartSubsample: true, effort: 6 })
    .toFile(target)
  const { size } = await stat(target)
  console.log(`${name.padEnd(26)} ${info.width} x ${info.height}  ${Math.round(size / 1024)} KB`)
}

// Next to public/, so the renames below stay on one disk.
const WORK = await mkdtemp(path.join(ROOT, '.app-screens-'))
try {
  for (const [name, make] of Object.entries(FRAMES)) await write(await make(capture), name)
  const og = await buildOg()

  await mkdir(OUT, { recursive: true })
  for (const name of Object.keys(FRAMES)) {
    await rename(path.join(WORK, `${name}.webp`), path.join(OUT, `${name}.webp`))
  }
  // Renamed into place: the share card is also where its left column comes from.
  const ogTemp = path.join(WORK, 'opengraph-image.png')
  await writeFile(ogTemp, og)
  await rename(ogTemp, OG)
  console.log(`opengraph-image.png ${Math.round(og.length / 1024)} KB`)
} finally {
  await rm(WORK, { recursive: true })
}
