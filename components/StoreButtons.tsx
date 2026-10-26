const APP_STORE_URL = 'https://apps.apple.com/dk/app/altid-hjem/id6794330094'
const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=dk.altidhjem.app'

// Official badges, unmodified (source in public/store-badges/README.md). The Google
// PNG carries its own clear space (192 of 250 px is badge), so it is drawn at
// 250/192 of the App Store badge height to make both badges equally tall; the gap
// between them is more than the quarter-height clear space both guidelines ask for.
export default function StoreButtons() {
  return (
    <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
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
      <a href={GOOGLE_PLAY_URL} className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/store-badges/google-play-da.png"
          alt="Hent den på Google Play"
          width={163}
          height={63}
          style={{ display: 'block', height: 62.5, width: 'auto' }}
        />
      </a>
    </div>
  )
}
