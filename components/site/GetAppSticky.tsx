import Image from 'next/image'
import { QR } from './copy'

// Computers only (CSS): the one QR code on the hero's old dark card with the new simple text
// (Thor 13/11), top right under the menu's height: sampled over a whole turn of the hero's
// ring, the notifications and service marks reach the bottom right corner at most window sizes
// but never this one. Stickies decides when it shows.
export default function GetAppSticky({ shown }: { shown: boolean }) {
  return (
    <div className="gs" data-shown={shown}>
      <span className="gs-tile">
        <Image src="/site/qr/app.svg" alt={QR.alt} width={74} height={74} />
      </span>
      <span className="gs-text">
        <span className="gs-title">{QR.title}</span>
        <span className="gs-line">{QR.line}</span>
      </span>
    </div>
  )
}
