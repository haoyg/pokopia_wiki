import imageVariants from '@/generated/imageVariants.json'

type ResponsiveImageProps = {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}

export function ResponsiveImage({
  src,
  alt,
  className,
  sizes = '100vw',
  priority = false,
}: ResponsiveImageProps) {
  const variants = imageVariants[src as keyof typeof imageVariants]
  const srcSet = variants?.map((variant) => `${variant.src} ${variant.width}w`).join(', ')

  return (
    <picture className={className}>
      {srcSet ? <source type="image/webp" srcSet={srcSet} sizes={sizes} /> : null}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        sizes={srcSet ? sizes : undefined}
      />
    </picture>
  )
}
