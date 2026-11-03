export type StorePlatform = 'ios' | 'android' | 'other'

export const APP_STORE_URL = 'https://apps.apple.com/dk/app/altid-hjem/id6794330094'
export const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=dk.altidhjem.app'

// 32 random bytes as base64url without padding: what the backend issues as a
// partner invite link token. Anything else is never passed on.
const INVITE_LINK_TOKEN = /^[A-Za-z0-9_-]{43}$/

export function isInviteLinkToken(value: string): boolean {
  return INVITE_LINK_TOKEN.test(value)
}

type NavigatorSignals = Pick<Navigator, 'userAgent' | 'maxTouchPoints'>

// iPadOS 13+ reports as a Mac; a Mac with a touch screen is an iPad.
export function detectStorePlatform({ userAgent, maxTouchPoints }: NavigatorSignals): StorePlatform {
  if (/Android/i.test(userAgent)) return 'android'
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios'
  if (/Macintosh/i.test(userAgent) && maxTouchPoints > 1) return 'ios'
  return 'other'
}

// Google Play hands the referrer to the app after install. Only a token of the
// right shape is passed on, so nothing else can ride along in the store link.
export function googlePlayUrl(inviteToken: string | null): string {
  if (inviteToken === null || !isInviteLinkToken(inviteToken)) return GOOGLE_PLAY_URL
  return `${GOOGLE_PLAY_URL}&referrer=${encodeURIComponent(`invite_token=${inviteToken}`)}`
}
