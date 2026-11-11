import { DM_Sans } from 'next/font/google'

// Only app/page.tsx reaches this module. In the root layout next/font would preload
// DM Sans on every SEO page too. Weights per the brand book: 700 for headlines,
// 800 for big numbers.
export const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-dm-sans',
})
