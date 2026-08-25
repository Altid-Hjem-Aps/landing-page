// Regenerates public/og/referral-altid-energi-v1.png, the link-preview card that
// unfurlers get from /r/<code> (ALT-288).
//
// Run: npx tsx scripts/generate-referral-og.tsx
// Needs network: Onest comes from Google Fonts, same family the site uses.
//
// The filename carries a version. Chat apps cache preview images for a long time
// and ignore the HTML's no-store, so a new card means a new filename (bump the
// version here and in REFERRAL_OG_IMAGE_URL), never a silent overwrite.
//
// The promise on the card must stay the promise on Energi's signup page
// (25 Aug 2026: "100% rabat på dit Altid Energi-abonnement de første 3 måneder").
// Not "gratis abonnement": the Danish copy audit rejected it as readable as free
// electricity.
//
// Design Assets/referral-card-app-home.png is the real Altid Energi front page in
// the shipped app: the App Store screenshot for 0.2.5 (sim_home_anon, 24 Aug 2026),
// downscaled to 540px wide. Refresh it from
//   itunes.apple.com/lookup?bundleId=dk.altidhjem.app&country=dk
// when the store screenshots change, so the card never shows a stale app.
import React from 'react'
// next/og is CJS-only in this (CJS) package, so import the node build it wraps.
// If a Next upgrade moves this path, only this script breaks: the card itself is
// the committed PNG.
import { ImageResponse } from 'next/dist/compiled/@vercel/og/index.node.js'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'public/og/referral-altid-energi-v1.png')

// DESIGN.md palette. Forest deep is the darkest surface in the system; the card
// sits a shade under it so it reads as premium against both a white and a black
// chat thread. Signal green is the one-action colour and appears exactly once,
// on the number, per the Signalgrøn rule.
const FOREST_DEEP = '#163223'
const CREAM = '#FDFAF4'
const SIGNAL = '#90FF7C'
const MUTED = 'rgba(253,250,244,0.60)'

async function onest(weight: 400 | 600 | 800): Promise<ArrayBuffer> {
  const css = await fetch(`https://fonts.googleapis.com/css2?family=Onest:wght@${weight}`).then((r) => r.text())
  const url = css.match(/src: url\((https:[^)]+\.ttf)\)/)?.[1]
  if (!url) throw new Error(`no Onest ${weight} ttf in the Google Fonts CSS`)
  return fetch(url).then((r) => r.arrayBuffer())
}

function dataUri(path: string, mime: string): string {
  return `data:${mime};base64,${readFileSync(join(ROOT, path)).toString('base64')}`
}

const energiLogo = dataUri('public/altidenergi-logo-white.svg', 'image/svg+xml')
const appIcon = dataUri('public/app-badge.png', 'image/png')
const appHome = dataUri('Design Assets/referral-card-app-home.png', 'image/png')

// Big, tilted, and running off the bottom edge on purpose: a device that
// continues past the frame reads as a real mockup, a fully contained one reads
// as an icon. Only the bottom bleeds. The top has to stay clear of the canvas
// (and of the 15px X shaves off for its 2:1 crop) so the status bar and the
// Elpris card are never the thing that gets cut.
const PHONE_TILT = -6
const PHONE_H = 790
const PHONE_TOP = 78
const PHONE_W = Math.round((PHONE_H * 540) / 1173)

const card = (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 72px',
      // A shade under DESIGN.md's forest-deep, falling off toward the right so
      // the phone has something to sit against. Deep green, never black.
      backgroundColor: FOREST_DEEP,
      backgroundImage: 'linear-gradient(115deg, #1b3d2a 0%, #14301f 46%, #0b2015 100%)',
      fontFamily: 'Onest',
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 494, width: 600 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={energiLogo} width={162} height={86} alt="Altid Energi" />
        <div
          style={{
            display: 'flex',
            marginLeft: 26,
            padding: '10px 22px',
            borderRadius: 999,
            border: '1px solid rgba(253,250,244,0.38)',
            color: 'rgba(253,250,244,0.86)',
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: 1.6,
          }}
        >
          HENVISNING
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 68, fontWeight: 600, color: CREAM, lineHeight: 1.12, letterSpacing: -1.6 }}>
          <span>3 måneder med</span>
          <span style={{ color: SIGNAL }}>100 % rabat</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20, fontSize: 26, fontWeight: 400, color: 'rgba(253,250,244,0.78)', lineHeight: 1.45 }}>
          <span>Du er blevet henvist til Altid Energi.</span>
          <span>Rabatten gælder abonnementet.</span>
        </div>
      </div>

      {/* The app gets its own line under a rule, never competing with Energi's
          offer above. The download line is Thor's call (25 Aug): the copy audit
          flagged that the link opens Energi's signup, not a store page, so keep
          the lockup visually secondary to the offer. */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', width: 520, height: 1, backgroundColor: 'rgba(253,250,244,0.16)', marginBottom: 24 }} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={appIcon} width={58} height={58} alt="" style={{ borderRadius: 14 }} />
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 18 }}>
            <span style={{ fontSize: 24, fontWeight: 500, color: CREAM }}>Altid Hjem-appen</span>
            <span style={{ fontSize: 20, fontWeight: 400, color: MUTED }}>Hent den i App Store og Google Play</span>
          </div>
        </div>
      </div>
    </div>

    {/* Real app, not a mockup drawing: the Altid Energi front page as it ships. */}
    <div
      style={{
        display: 'flex',
        position: 'absolute',
        top: PHONE_TOP,
        right: 62,
        padding: 8,
        borderRadius: 52,
        backgroundColor: '#0a0a0a',
        border: '1px solid rgba(253,250,244,0.14)',
        transform: `rotate(${PHONE_TILT}deg)`,
        // The one shadow on the card. DESIGN.md keeps surfaces flat, but the
        // phone is a physical object at an angle: with no shadow it reads pasted
        // on rather than held.
        boxShadow: '0 34px 70px rgba(0,0,0,0.42)',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={appHome} width={PHONE_W} height={PHONE_H} alt="" style={{ borderRadius: 44 }} />
    </div>
  </div>
)

async function main() {
  const [regular, semibold, extrabold] = await Promise.all([onest(400), onest(600), onest(800)])
  const png = Buffer.from(
    await new ImageResponse(card, {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Onest', data: regular, weight: 400, style: 'normal' },
        { name: 'Onest', data: semibold, weight: 600, style: 'normal' },
        { name: 'Onest', data: extrabold, weight: 800, style: 'normal' },
      ],
    }).arrayBuffer(),
  )
  writeFileSync(OUT, png)
  console.log(`wrote ${OUT} (${png.length} bytes)`)
}

main()
