import Image from 'next/image'
import PhoneBody from './PhoneBody'

// Apple's iPhone 18 Pro front (Apple Design Resources) over the screen, with a body behind it
// that gives a tilted phone its depth. The capture carries its own status bar and island. Its
// numbers are seeded, so the section around it must render StagedNote, and
// test/site-home.test.tsx holds every section to that.
export default function Phone({
  src,
  alt,
  sizes,
  focus = '50% 0%',
  preload = false,
  quality = 90,
}: {
  src: string
  alt: string
  sizes: string
  focus?: string
  preload?: boolean
  quality?: number
}) {
  return (
    <div className="ph" data-staged="true">
      <PhoneBody />
      <div className="ph-screen">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={quality}
          style={{ objectFit: 'cover', objectPosition: focus }}
          {...(preload ? { preload } : {})}
        />
      </div>
    </div>
  )
}
