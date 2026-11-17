import QRCode from 'qrcode'

/** A QR code for `text` as one SVG path in a `size`-module square, quiet zone included. */
export function qrPath(text: string): { size: number; d: string } {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: 'M' })
  const quiet = 2
  const size = modules.size + quiet * 2
  let d = ''
  for (let row = 0; row < modules.size; row++) {
    for (let col = 0; col < modules.size; col++) {
      if (modules.get(row, col)) d += `M${col + quiet} ${row + quiet}h1v1h-1z`
    }
  }
  return { size, d }
}
