import Image from 'next/image'

type CreditedImageProps = {
  src?: string
  alt?: string
  source?: string
  sourceUrl?: string
  className?: string
  priority?: boolean
  sizes?: string
}

export function CreditedImage({
  src,
  alt,
  source,
  sourceUrl,
  className = 'card-cover',
  priority = false,
  sizes = '(max-width: 768px) 100vw, 300px',
}: CreditedImageProps) {
  if (!src || !source) return null

  const isRemote = src.startsWith('http://') || src.startsWith('https://')

  return (
    <figure style={{ margin: 0 }}>
      <div className={className}>
        {isRemote ? (
          <img src={src} alt={alt || source} loading={priority ? 'eager' : 'lazy'} />
        ) : (
          <Image src={src} alt={alt || source} fill sizes={sizes} priority={priority} />
        )}
      </div>
      <figcaption style={{ color: '#777', fontSize: '0.75rem', lineHeight: 1.5, marginTop: '0.35rem' }}>
        图片来源：{sourceUrl ? <a href={sourceUrl} rel="nofollow noopener noreferrer" target="_blank">{source}</a> : source}
      </figcaption>
    </figure>
  )
}
