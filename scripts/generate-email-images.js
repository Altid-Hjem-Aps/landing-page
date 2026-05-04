// Regenerates emails/image-data.ts with base64-embedded image data.
// Run: node scripts/generate-email-images.js
const fs = require('fs')
const base = __dirname + '/..'

const files = {
  LOGO_DARK:  [base + '/Design Assets/LOGO/PNG/Aktiv 1@3x.png', 'image/png'],
  LOGO_WHITE: [base + '/Design Assets/LOGO/PNG/Aktiv 2@3x.png', 'image/png'],
  ICON_1:     [base + '/public/icons/aktiv-1.svg',   'image/svg+xml'],
  ICON_2_1:   [base + '/public/icons/aktiv-2_1.svg', 'image/svg+xml'],
  ICON_3:     [base + '/public/icons/aktiv-3.svg',   'image/svg+xml'],
  ICON_4:     [base + '/public/icons/aktiv-4.svg',   'image/svg+xml'],
  ICON_5:     [base + '/public/icons/aktiv-5.svg',   'image/svg+xml'],
  ICON_6:     [base + '/public/icons/aktiv-6.svg',   'image/svg+xml'],
}

const house = 'M15 52 L50 13 L85 52 L85 89 L15 89 Z M36 89 L36 66 Q36 63 39 63 L61 63 Q64 63 64 66 L64 89 Z'
const appIconDark  = `<svg width="56" height="56" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="22" fill="#003c16"/><path fill="#b7f2a7" fill-rule="evenodd" d="${house}"/></svg>`
const appIconLight = `<svg width="56" height="56" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="22" fill="#b7f2a7"/><path fill="#003c16" fill-rule="evenodd" d="${house}"/></svg>`

const phonePath = base + '/Design Assets/phone-mockup.png'

let out = '// Auto-generated — run scripts/generate-email-images.js to update.\n\n'

for (const [key, [p, mime]] of Object.entries(files)) {
  const b64 = fs.readFileSync(p).toString('base64')
  out += `export const ${key} = "data:${mime};base64,${b64}";\n\n`
}

out += `export const ICON_APP_DARK  = "data:image/svg+xml;base64,${Buffer.from(appIconDark).toString('base64')}";\n\n`
out += `export const ICON_APP_LIGHT = "data:image/svg+xml;base64,${Buffer.from(appIconLight).toString('base64')}";\n\n`

if (fs.existsSync(phonePath)) {
  const b64 = fs.readFileSync(phonePath).toString('base64')
  out += `export const PHONE_MOCKUP = "data:image/png;base64,${b64}";\n`
  console.log('Phone mockup included.')
} else {
  out += `// Placeholder — add Design Assets/phone-mockup.png and re-run to include.\nexport const PHONE_MOCKUP = "";\n`
  console.log('No phone-mockup.png found — placeholder used.')
}

fs.writeFileSync(base + '/emails/image-data.ts', out)
console.log('Done — emails/image-data.ts updated.')
