import type { SiteCount, SiteCountProps } from '@/lib/site-counts'

// An anonymous count from the browser (lib/site-counts.ts says what may be counted and why).
// sendBeacon outlives a navigation and never holds up the page; the server answers and logs
// whatever it refuses.
export function countEvent<E extends SiteCount>(event: E, props: SiteCountProps<E>) {
  navigator.sendBeacon?.('/api/forside/count', new Blob([JSON.stringify({ event, props })], { type: 'application/json' }))
}
