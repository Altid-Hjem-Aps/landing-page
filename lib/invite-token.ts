import { isInviteLinkToken } from '@/lib/store-links'

// The invite link is /invitation#<token>. instrumentation-client.ts removes the
// fragment before analytics starts, so the token is kept here, in memory only:
// not in storage, not on window, not in an event, not in a log.
let token: string | null = null

export function rememberInviteToken(hash: string): void {
  const candidate = hash.startsWith('#') ? hash.slice(1) : hash
  token = isInviteLinkToken(candidate) ? candidate : null
}

export function rememberedInviteToken(): string | null {
  return token
}
