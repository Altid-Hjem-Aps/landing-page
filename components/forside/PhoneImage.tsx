import Image, { type StaticImageData } from 'next/image'

// A phone cropped out of a store screenshot (components/forside/img). The crop
// starts at the bezel's top edge, so the corners still hold a few pixels of
// the store background: the 56px top radius is a little larger than the
// bezel's own (about 48px at 360px wide) and clips them away. The bottom of
// the phone is cut by the parent's height and overflow.
export default function PhoneImage({
  src,
  alt,
  preload = false,
  className = '',
}: {
  src: StaticImageData
  alt: string
  preload?: boolean
  className?: string
}) {
  return (
    <div className={`overflow-hidden rounded-t-[56px] ${className}`}>
      <Image
        src={src}
        alt={alt}
        sizes="(min-width: 1024px) 360px, 80vw"
        preload={preload}
        className="block w-full h-auto"
      />
    </div>
  )
}
