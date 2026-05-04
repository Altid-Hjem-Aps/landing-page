// Regenerates emails/image-data.ts with base64-embedded image data.
// Run: node scripts/generate-email-images.js
const fs = require('fs')
const base = __dirname + '/..'

const files = {
  LOGO_DARK:  [base + '/public/altid-hjem-logo-dark.svg',  'image/svg+xml'],
  LOGO_WHITE: [base + '/public/altid-hjem-logo-white.svg', 'image/svg+xml'],
  ICON_1:     [base + '/public/icons/aktiv-1.svg',   'image/svg+xml'],
  ICON_2_1:   [base + '/public/icons/aktiv-2_1.svg', 'image/svg+xml'],
  ICON_3:     [base + '/public/icons/aktiv-3.svg',   'image/svg+xml'],
  ICON_4:     [base + '/public/icons/aktiv-4.svg',   'image/svg+xml'],
  ICON_5:     [base + '/public/icons/aktiv-5.svg',   'image/svg+xml'],
  ICON_6:     [base + '/public/icons/aktiv-6.svg',   'image/svg+xml'],
}

// App icon (footer): official 1024x1024 PNG
const appIconPng = fs.readFileSync('/Users/a/Desktop/Altid Hjem Ops/Altid Hjem Logo/LOGO_FAVI_APP/APP/PNG/1024x1024.png')
const appIconDataUri = `data:image/png;base64,${appIconPng.toString('base64')}`

// Info box icon: favicon SVG (house + "a", no dark background — sits on light green)
const infoBoxIconSvg = fs.readFileSync('/Users/a/Desktop/Altid Hjem Ops/Altid Hjem Logo/LOGO_FAVI_APP/FAVICON/SVG/Aktiv 2.svg', 'utf8')

const phonePath = base + '/Design Assets/phone-mockup.png'

let out = '// Auto-generated — run scripts/generate-email-images.js to update.\n\n'

for (const [key, [p, mime]] of Object.entries(files)) {
  const b64 = fs.readFileSync(p).toString('base64')
  out += `export const ${key} = "data:${mime};base64,${b64}";\n\n`
}

out += `export const ICON_APP_DARK  = "data:image/svg+xml;base64,${Buffer.from(infoBoxIconSvg).toString('base64')}";\n\n`
out += `export const ICON_APP_LIGHT = "${appIconDataUri}";\n\n`

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
