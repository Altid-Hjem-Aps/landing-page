// Which store badge goes first. The order is set by CSS from a data-platform
// attribute on <html>, written by PLATFORM_SCRIPT before first paint, so the
// server render stays the same for everyone and nothing jumps on hydration.

export type Platform = 'ios' | 'android' | 'desktop'

export function detectPlatform(userAgent: string, maxTouchPoints: number): Platform {
  if (/android/i.test(userAgent)) return 'android'
  // iPadOS reports a Mac user agent; the touch screen gives it away.
  if (/iphone|ipad|ipod/i.test(userAgent) || (/macintosh/i.test(userAgent) && maxTouchPoints > 1)) return 'ios'
  return 'desktop'
}

// The same rules as detectPlatform, as a self-contained inline script for the
// document head. test/store-links.test.ts runs it against fake navigators and
// compares the result with detectPlatform, so the two cannot drift apart. A
// failure (no navigator, a locked dataset) leaves the attribute unset, which
// is the App Store first default.
export const PLATFORM_SCRIPT = `try{var u=navigator.userAgent||'',t=navigator.maxTouchPoints||0,p='desktop';if(/android/i.test(u)){p='android'}else if(/iphone|ipad|ipod/i.test(u)||(/macintosh/i.test(u)&&t>1)){p='ios'}document.documentElement.dataset.platform=p}catch(e){}`

// The front page's motion state, also before first paint. html.js switches the
// pinned scenes on (app/globals.css), so without JS the page stays in static
// flow, and a page bundle that fails to load puts it back there, as the pinned
// scenes start hidden and only the bundle reveals them. data-motion="paused"
// holds the visitor's choice from PauseMotion.
export const MOTION_STORAGE_KEY = 'ah-motion'
export const MOTION_SCRIPT = `document.documentElement.classList.add('js');addEventListener('error',function(e){var s=e.target&&e.target.src;if(s&&s.indexOf('/_next/')>-1)document.documentElement.classList.remove('js')},true);try{if(localStorage.getItem('${MOTION_STORAGE_KEY}')==='paused')document.documentElement.dataset.motion='paused'}catch(e){}`
