// Which pop-up messages this visitor has seen and closed.
//
// Remembering that in the browser is not needed for anything the visitor asked for, so it is
// stored only after "Accepter alle" (the cookie rules cover sessionStorage and localStorage too).
// Without that yes the memory lives in this page load only: still one pop-up per visit while the
// visitor stays on the site, but nothing is written to the browser.
//
// The page load's own memory is the one the pop-ups ask. What a yes stored is read into it while
// the yes holds, so a yes taken back mid-visit does not bring a pop-up again, and a yes given
// mid-visit stores what the page load already knows (storeThisPageLoad).
import { readCookieChoice } from './cookie-consent'

export type Popup = 'offer' | 'leave'

const SHOWN_KEYS: Record<Popup, string> = { offer: 'ah-offer-popup-shown', leave: 'ah-leave-popup-shown' }
const OFFER_CLOSED_KEY = 'ah-offer-popup-closed'

const shownThisLoad = new Set<Popup>()
let offerClosedThisLoad = 0

const mayStore = () => readCookieChoice() === 'all'

function read(storage: () => Storage, key: string): string | null {
  try {
    return storage().getItem(key)
  } catch {
    return null
  }
}

function write(storage: () => Storage, key: string, value: string) {
  try {
    storage().setItem(key, value)
  } catch {
    // No storage: this page load's own memory still holds it.
  }
}

const session = () => window.sessionStorage
const local = () => window.localStorage

const POPUPS: Popup[] = ['offer', 'leave']

/** True once either pop-up has been shown in this visit: they share the one-per-visit rule. */
export function popupShownThisVisit(): boolean {
  if (mayStore()) {
    for (const popup of POPUPS) if (read(session, SHOWN_KEYS[popup]) === '1') shownThisLoad.add(popup)
  }
  return shownThisLoad.size > 0
}

export function rememberPopupShown(popup: Popup) {
  shownThisLoad.add(popup)
  if (mayStore()) write(session, SHOWN_KEYS[popup], '1')
}

/** When the visitor last closed the Altid Energi offer, in ms since 1970; 0 when not known. */
export function offerClosedAt(): number {
  const stored = mayStore() ? Number(read(local, OFFER_CLOSED_KEY) ?? 0) : 0
  if (Number.isFinite(stored)) offerClosedThisLoad = Math.max(offerClosedThisLoad, stored)
  return offerClosedThisLoad
}

export function rememberOfferClosed(now: number = Date.now()) {
  offerClosedThisLoad = now
  if (mayStore()) write(local, OFFER_CLOSED_KEY, String(now))
}

/** The visitor just said yes: store what this page load has already shown and closed. */
export function storeThisPageLoad() {
  if (!mayStore()) return
  for (const popup of shownThisLoad) write(session, SHOWN_KEYS[popup], '1')
  if (offerClosedThisLoad > 0) write(local, OFFER_CLOSED_KEY, String(offerClosedThisLoad))
}

/** The visitor said no, or took a yes back: remove what an earlier yes stored. */
export function forgetStoredPopups() {
  try {
    for (const key of Object.values(SHOWN_KEYS)) window.sessionStorage.removeItem(key)
    window.localStorage.removeItem(OFFER_CLOSED_KEY)
  } catch {
    // No storage: nothing was stored.
  }
}

/** A new page load, for tests: forgets what this load has shown. Stored keys are left alone. */
export function startNewPageLoad() {
  shownThisLoad.clear()
  offerClosedThisLoad = 0
}
