// The invite link is /invitation#<token>. instrumentation-client.ts removes the
// fragment before analytics starts, so the token is kept here, in memory only:
// not in storage, not on window, not in an event, not in a log.

// 32 random bytes as base64url without padding: what the API issues as a
// partner invite link token. Anything else is never passed on.
const INVITE_LINK_TOKEN = /^[A-Za-z0-9_-]{43}$/

export function isInviteLinkToken(value: string): boolean {
  return INVITE_LINK_TOKEN.test(value)
}

let token: string | null = null

export function rememberInviteToken(hash: string): void {
  const candidate = hash.startsWith('#') ? hash.slice(1) : hash
  token = isInviteLinkToken(candidate) ? candidate : null
}

export function rememberedInviteToken(): string | null {
  return token
}

/** The invite link itself, as the app shares and mails it: a phone that scans it opens the app. */
export function inviteLink(inviteToken: string): string {
  return `https://altidhjem.dk/invitation#${inviteToken}`
}
