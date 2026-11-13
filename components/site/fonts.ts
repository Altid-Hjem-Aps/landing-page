import { DM_Sans } from 'next/font/google'

// Only app/page.tsx reaches this module. In the root layout next/font would preload
// DM Sans on every SEO page too. The variable font, with its weight and optical-size axes: the
// page draws it at the font's default optical size, as the static 700 and 800 it used before
// (font-optical-sizing: none on .site), and the final block's heading lets the optical size
// follow the type size, as Thor's Figma draws it (10945:3). Weights per the brand book: 700 for
// headlines, 800 for big numbers.
export const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: 'variable',
  axes: ['opsz'],
  variable: '--font-dm-sans',
})
