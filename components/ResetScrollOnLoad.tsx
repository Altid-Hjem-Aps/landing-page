'use client'

import { useEffect } from 'react'

// Force reload to land at the top of the page. Browsers default to
// "auto" scroll restoration, which restores the user's previous scroll
// position on reload: fine for blogs, surprising for a landing page
// where reload is a deliberate "start over". Only a reload opts out: the Back
// button keeps the visitor's place on a long page, and when the URL names a
// section (/#altid-mad from the nav on another page, a mail or a shared link)
// the browser's jump to that section stands.
export default function ResetScrollOnLoad() {
  useEffect(() => {
    const [navigation] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
    if (navigation?.type !== 'reload') return
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    if (window.location.hash) return
    // Instant: the site's smooth scrolling would otherwise roll up the whole page.
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])
  return null
}
