'use client'

import { useSyncExternalStore } from 'react'
import { rememberedInviteToken } from '@/lib/invite-token'
import { detectStorePlatform, type StorePlatform } from '@/lib/store-links'

const subscribe = () => () => {}

// null on the server and during hydration; the real platform right after.
export function useStorePlatform(): StorePlatform | null {
  return useSyncExternalStore(
    subscribe,
    () => detectStorePlatform(navigator),
    () => null,
  )
}

export function useInviteToken(): string | null {
  return useSyncExternalStore(subscribe, rememberedInviteToken, () => null)
}
