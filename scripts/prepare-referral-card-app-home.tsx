// Rebuilds Design Assets/referral-card-app-home.png: the app screen shown on the
// referral OG card (ALT-288).
//
// Run: npx tsx scripts/prepare-referral-card-app-home.tsx
// Needs network: the screenshot comes from the live App Store listing and DM Sans
// (the app's typeface) from Google Fonts.
//
// Source is whatever the store is serving right now for dk.altidhjem.app, so the
// card cannot drift away from the shipped app. Two things are painted over the
// real screen for the card:
//   - the personal greeting becomes "Velkommen til Altid Hjem", set with more
//     leading than the app uses, and the demo address under it is painted out
//   - the avatar initials become AH
// The app itself renders "God eftermiddag, <fornavn>" and the customer's own
// initials. On a card sent to someone who is not a customer yet, a stranger's
// name is noise, so the greeting is replaced with the brand. Keep that in mind
// before reusing this asset anywhere that claims to be a literal app screenshot.
import React from 'react'
import { ImageResponse } from 'next/dist/compiled/@vercel/og/index.node.js'
import sharp from 'sharp'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT = join(__dirname, '..', 'Design Assets/referral-card-app-home.png')
const LOOKUP = 'https://itunes.apple.com/lookup?bundleId=dk.altidhjem.app&country=dk'
const SCREEN = 'sim_home_anon'

const CREAM = '#fdfaf4'
const INK = '#163223'

// Measured on the 1287x2796 store screenshot (0.2.5, 24 Aug 2026). The patch
// runs down to just above the Elpris card (its top edge is around y=518) so it
// swallows the demo address line as well; a street address under a brand
// greeting reads as someone else's screen.
const GREETING = { left: 40, top: 214, width: 1040, height: 280 }
const AVATAR = { left: 1100, top: 228, size: 128 }

async function dmSans(weight: 500 | 700): Promise<ArrayBuffer> {
  const css = await fetch(`https://fonts.googleapis.com/css2?family=DM+Sans:wght@${weight}`).then((r) => r.text())
  const url = css.match(/src: url\((https:[^)]+\.ttf)\)/)?.[1]
  if (!url) throw new Error(`no DM Sans ${weight} ttf in the Google Fonts CSS`)
  return fetch(url).then((r) => r.arrayBuffer())
}

async function storeScreenshot(): Promise<Buffer> {
  const listing = await fetch(LOOKUP).then((r) => r.json())
  const urls: string[] = listing?.results?.[0]?.screenshotUrls ?? []
  const shot = urls.find((u) => u.includes(SCREEN))
  if (!shot) throw new Error(`no ${SCREEN} screenshot on the App Store listing`)
  const full = shot.replace(/\/\d+x\d+bb\.(jpg|png)$/, '/1290x2796bb.png')
  const res = await fetch(full)
  if (!res.ok) throw new Error(`store screenshot ${full}: HTTP ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

async function render(node: React.ReactElement, width: number, height: number, fonts: ArrayBuffer[]): Promise<Buffer> {
  const res = new ImageResponse(node, {
    width,
    height,
    fonts: [
      { name: 'DM Sans', data: fonts[0], weight: 500, style: 'normal' },
      { name: 'DM Sans', data: fonts[1], weight: 700, style: 'normal' },
    ],
  })
  return Buffer.from(await res.arrayBuffer())
}

async function main() {
  const [medium, bold, screenshot] = await Promise.all([dmSans(500), dmSans(700), storeScreenshot()])
  const fonts = [medium, bold]

  const greeting = await render(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingLeft: 20,
        backgroundColor: CREAM,
        fontFamily: 'DM Sans',
        fontWeight: 700,
        fontSize: 92,
        lineHeight: 1.2,
        letterSpacing: -1.5,
        color: INK,
      }}
    >
      <span>Velkommen til</span>
      <span>Altid Hjem</span>
    </div>,
    GREETING.width,
    GREETING.height,
    fonts,
  )

  const avatar = await render(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: INK,
        borderRadius: 34,
        fontFamily: 'DM Sans',
        fontWeight: 700,
        fontSize: 46,
        letterSpacing: 0.5,
        color: CREAM,
      }}
    >
      AH
    </div>,
    AVATAR.size,
    AVATAR.size,
    fonts,
  )

  // Two pipelines on purpose: sharp resizes before it composites, so painting
  // and downscaling in one chain would try to paste full-size patches onto an
  // already-shrunken screen.
  const painted = await sharp(screenshot)
    .composite([
      { input: greeting, left: GREETING.left, top: GREETING.top },
      { input: avatar, left: AVATAR.left, top: AVATAR.top },
    ])
    .png()
    .toBuffer()

  const png = await sharp(painted).resize({ width: 540 }).png({ compressionLevel: 9 }).toBuffer()

  writeFileSync(OUT, png)
  console.log(`wrote ${OUT} (${png.length} bytes)`)
}

main()
