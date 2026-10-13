import { readCookieChoice } from '@/lib/cookie-consent'
import { startAnalytics } from '@/lib/analytics'

declare global {
  interface Window {
    __altiPartnerInviteFallback?: boolean
  }
}

// Invitation tokens arrive in the URL fragment. Keep only the fact that this
// was an invitation, then remove the fragment before analytics can capture it.
if (window.location.pathname === '/inviter' && window.location.hash.length > 1) {
  window.__altiPartnerInviteFallback = true
  window.history.replaceState(
    window.history.state,
    '',
    `${window.location.pathname}${window.location.search}`,
  )
}

// Returning visitors who already accepted statistics start Amplitude before
// React hydrates. Everyone else waits for the cookie banner (CookieBanner).
if (readCookieChoice() === 'all') startAnalytics()
