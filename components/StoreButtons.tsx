const APP_STORE_URL = 'https://apps.apple.com/dk/app/altid-hjem/id6794330094'
const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=dk.altidhjem.app'

export default function StoreButtons() {
  return (
    <div className="mt-8 grid gap-3">
      <a
        href={APP_STORE_URL}
        className="rounded-[20px] bg-[#163223] px-5 py-3.5 text-center text-base font-medium text-white"
      >
        Hent i App Store
      </a>
      <a
        href={GOOGLE_PLAY_URL}
        className="rounded-[20px] border border-[#163223] px-5 py-3.5 text-center text-base font-medium text-[#163223]"
      >
        Hent i Google Play
      </a>
    </div>
  )
}
