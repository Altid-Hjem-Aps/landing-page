const BASE = 'https://www.altidhjem.dk'

export const LOGO_DARK  = `${BASE}/altid-hjem-logo-dark.svg`
export const LOGO_WHITE = `${BASE}/altid-hjem-logo-white.svg`

export const ICON_1   = `${BASE}/icons/aktiv-1.svg`
export const ICON_2_1 = `${BASE}/icons/aktiv-2_1.svg`
export const ICON_3   = `${BASE}/icons/aktiv-3.svg`
export const ICON_4   = `${BASE}/icons/aktiv-4.svg`
export const ICON_5   = `${BASE}/icons/aktiv-5.svg`
export const ICON_6   = `${BASE}/icons/aktiv-6.svg`

export const ICON_APP_DARK  = `${BASE}/email/info-icon.png`
export const ICON_APP_LIGHT = `${BASE}/email/app-icon.png`
export const ICON_APP_HOUSE = `${BASE}/email/altid-hjem-house.png`

export const PHONE_MOCKUP = `${BASE}/email/phone-mockup.png`

// Referral-progress bar, pre-rendered as images so it can't collapse in the
// Gmail app (CSS percentage bars do). One PNG per 10% step (0,10,…,100); the
// referral-progress template picks one via bar-{{{progress_pct}}}.png.
export const progressBar = (pct: number) => `${BASE}/email/bar-${Math.round(pct / 10) * 10}.png`
