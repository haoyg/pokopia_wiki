type CreditedImageProps = {
  src?: string
  alt?: string
  source?: string
  sourceUrl?: string
  originalMedia?: string
  licenseNote?: string
  className?: string
  priority?: boolean
  sizes?: string
}

export function CreditedImage({
  src,
  alt,
  source,
  sourceUrl,
  originalMedia,
  className = 'card-cover',
  priority = false,
}: CreditedImageProps) {
  if (!src || !source) return null

  const isRemote = src.startsWith('http://') || src.startsWith('https://')
  const loading = priority ? 'eager' : 'lazy'
  const fetchPriority = priority ? 'high' : 'auto'

  return (
    <figure style={{ margin: 0 }}>
      <div className={className}>
        <img
          src={src}
          alt={alt || source}
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          referrerPolicy={isRemote ? 'no-referrer' : undefined}
        />
      </div>
      <figcaption style={{ color: '#777', fontSize: '0.75rem', lineHeight: 1.5, marginTop: '0.35rem' }}>
        <span>
          Image source: {sourceUrl ? <a href={sourceUrl} rel="nofollow noopener noreferrer" target="_blank">{source}</a> : source}
        </span>
        {originalMedia && (
          <>
            <br />
            <span>Original media: {originalMedia}</span>
          </>
        )}
      </figcaption>
    </figure>
  )
}
