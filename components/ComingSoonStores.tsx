// Pre-launch store pills for the hero, under the waitlist form.
//
// Not Apple's "Download on the App Store" or Google's "Get it on Google Play"
// badge artwork. Each store sanctions exactly one pre-launch badge — Apple's
// "Pre-order on the App Store", Google's "Pre-register on Google Play" — and
// both need a live listing we don't have, so neither is available to us.
//
// Be clear about the trade this makes: the marks below are redrawn outside the
// badge artwork those guidelines license them for, which is its own deviation,
// not a compliant alternative. Shipped knowingly (Thor, 16 Jul) — the marks
// carry the recognition the pills exist for. Swap to text-only if that call
// ever changes; the store names alone read fine.
//
// The pills are not links and must not become links until the listings are
// live: the point is to signal that a real app is coming without sending
// anyone to search a store for a name that returns nothing.

// Both viewports render this phrase, but never at the same time — see the
// breakpoint note below. One const so a copy edit can't reach one and miss the
// other. The separating space lives at the call site, not in here.
const COMING_SOON_PREFIX = 'Kommer snart i'

type Store = {
  name: string
  /** Brand mark path, authored in a 24x24 viewBox and rendered at 16px. */
  path: string
}

const STORES: Store[] = [
  {
    name: 'App Store',
    path: 'M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09v-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z',
  },
  {
    name: 'Google Play',
    path: 'M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.61-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1.001 1.001 0 010 1.73l-2.808 1.626L15.117 12l2.581-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z',
  },
]

export default function ComingSoonStores() {
  return (
    <div>
      {/* Below sm the two pills can't hold "Kommer snart i" and still sit on one
          row — the pair needs 474px against the 272px a 320px phone offers. The
          prefix lifts out to this shared line so the pills shrink to their store
          names (254px) and stay side by side. Above sm each pill carries its own
          prefix and this is hidden, so the phrase is never shown twice. */}
      <p
        id="coming-soon-prefix"
        className="sm:hidden text-sm leading-none mb-3 text-center"
        style={{ color: 'var(--text-light)' }}
      >
        {COMING_SOON_PREFIX}
      </p>

      {/* Labelled by the lead-in so a screen reader exploring the list below sm
          still gets the "kommer snart" framing — the pills only say the store
          name at that width. Above sm the lead-in is display:none and drops out
          of the a11y tree, and each pill carries the prefix itself instead. */}
      <ul
        aria-labelledby="coming-soon-prefix"
        className="flex flex-wrap justify-center lg:justify-start gap-3 list-none p-0 m-0"
      >
        {STORES.map(store => (
          <li key={store.name}>
            {/* 20px radius is BUTTON_PRIMARY's corner, hard-coded rather than
                rounded-full so the pills keep matching the CTA above them if
                their height ever changes. */}
            <span
              className="inline-flex items-center gap-2 rounded-[20px] border py-3 px-3 sm:px-4 text-sm leading-none whitespace-nowrap"
              style={{
                borderColor: 'rgba(26, 61, 34, 0.18)',
                color: 'var(--text-mid)',
              }}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 shrink-0"
                fill="currentColor"
              >
                <path d={store.path} />
              </svg>
              <span>
                <span className="max-sm:hidden">{COMING_SOON_PREFIX} </span>
                <span className="font-medium" style={{ color: 'var(--text-dark)' }}>
                  {store.name}
                </span>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
