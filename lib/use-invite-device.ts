'use client'

import { useSyncExternalStore } from 'react'
import { rememberedInviteToken } from '@/lib/invite-token'
import { detectPlatform, type Platform } from '@/lib/platform'

const subscribe = () => () => {}

// null on the server and during hydration; the real values right after, so the
// server render is the same for everyone and nothing mismatches.
export function usePlatform(): Platform | null {
  return useSyncExternalStore(
    subscribe,
    () => detectPlatform(navigator.userAgent, navigator.maxTouchPoints),
    () => null,
  )
}

export function useInviteToken(): string | null {
  return useSyncExternalStore(subscribe, rememberedInviteToken, () => null)
}
