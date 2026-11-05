import Image from 'next/image'

// Our own drawn phone: dark titanium edge, a thin highlight, black bezel and side buttons,
// in the proportions of the frames on the page we match. The capture carries its own
// status bar and island. Its numbers are seeded, so the section around it must render
// StagedNote, and test/site-home.test.tsx holds every section to that.
export default function Phone({
  src,
  alt,
  sizes,
  focus = '50% 0%',
  preload = false,
}: {
  src: string
  alt: string
  sizes: string
  focus?: string
  preload?: boolean
}) {
  return (
    <div className="ph" data-staged="true">
      <span className="ph-body" aria-hidden="true" />
      <div className="ph-screen">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={90}
          style={{ objectFit: 'cover', objectPosition: focus }}
          {...(preload ? { preload } : {})}
        />
      </div>
    </div>
  )
}
