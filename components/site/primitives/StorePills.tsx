'use client'

import { useSyncExternalStore, type ComponentProps, type ReactNode } from 'react'
import * as amplitude from '@amplitude/analytics-browser'
import StoreBadges, { countClick } from '@/components/StoreBadges'
import { detectPlatform } from '@/lib/platform'
import { STORE_ANCHOR, storeLink, type Store, type StorePosition } from '@/lib/store-links'

// The store pills of one spot on the page. position is what the click counts as.
export default function StorePills(props: ComponentProps<typeof StoreBadges>) {
  return <StoreBadges {...props} />
}

const HOME_ANCHOR = `/#${STORE_ANCHOR}`
const HERE_ANCHOR = `#${STORE_ANCHOR}`
type Target = Store | typeof HOME_ANCHOR | typeof HERE_ANCHOR

const noSubscribe = () => () => {}
const onServer = (): Target => HOME_ANCHOR
const inBrowser = (): Target => {
  const platform = detectPlatform(navigator.userAgent, navigator.maxTouchPoints)
  if (platform === 'ios') return 'appstore'
  if (platform === 'android') return 'play'
  return document.getElementById(STORE_ANCHOR) ? HERE_ANCHOR : HOME_ANCHOR
}

// "Hent appen". The server sends a link to the pills, which works on every page
// and without JS. After load a phone gets the right store directly; a desktop
// stays on the pills, on this page if it has them.
export function GetAppLink({
  position = 'nav',
  className,
  style,
  children = 'Hent appen',
}: {
  position?: StorePosition
  className?: string
  style?: React.CSSProperties
  children?: ReactNode
}) {
  const target = useSyncExternalStore(noSubscribe, inBrowser, onServer)
  const store = target === HOME_ANCHOR || target === HERE_ANCHOR ? null : target
  return (
    <a
      href={store ? storeLink(store) : target}
      className={className}
      style={style}
      onClick={() => {
        amplitude.track('Get App CTA Clicked', { source: position })
        if (store) countClick(store, position)
      }}
    >
      {children}
    </a>
  )
}
