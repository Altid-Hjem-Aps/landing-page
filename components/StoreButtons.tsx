'use client'

import { APP_STORE_URL, googlePlayUrl } from '@/lib/store-links'
import { useInviteToken, useStorePlatform } from '@/lib/use-store-target'

// Official badges, unmodified (source in public/store-badges/README.md). The Google
// PNG carries its own clear space (192 of 250 px is badge), so it is drawn at
// 250/192 of the App Store badge height to make both badges equally tall; the gap
// between them is more than the quarter-height clear space both guidelines ask for.
// A phone gets its own store only; anything else gets both. Only Android carries
// the invite, since only the Play install referrer can hand it to the app.
export default function StoreButtons() {
  const platform = useStorePlatform()
  const inviteToken = useInviteToken()

  if (platform === null) return null

  return (
    <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      {platform !== 'android' && (
        <a href={APP_STORE_URL} className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/store-badges/app-store-da.svg"
            alt="Hent i App Store"
            width={144}
            height={48}
            style={{ display: 'block', height: 48, width: 'auto' }}
          />
        </a>
      )}
      {platform !== 'ios' && (
        <a href={googlePlayUrl(platform === 'android' ? inviteToken : null)} className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/store-badges/google-play-da.png"
            alt="Hent den på Google Play"
            width={163}
            height={63}
            style={{ display: 'block', height: 62.5, width: 'auto' }}
          />
        </a>
      )}
    </div>
  )
}
