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
  creditLink?: boolean
  rightsStatus?: string
}

export function CreditedImage({
  src,
  alt,
  source,
  sourceUrl,
  originalMedia,
  licenseNote,
  className = 'card-cover',
  priority = false,
  sizes,
  creditLink = true,
  rightsStatus,
}: CreditedImageProps) {
  const clearedRightsStatuses = new Set(['owned-original', 'licensed', 'open-license', 'public-domain'])
  if (!src || !source || !rightsStatus || !clearedRightsStatuses.has(rightsStatus)) return null

  const isRemote = src.startsWith('http://') || src.startsWith('https://')
  const localNintendoMedia = src.match(/^(\/media\/nintendo\/.+)\.(jpe?g|png)$/i)
  const responsiveSrcSet = localNintendoMedia
    ? `${localNintendoMedia[1]}-640.webp 640w, ${localNintendoMedia[1]}-1280.webp 1280w`
    : undefined
  const responsiveSizes = sizes || '(max-width: 768px) 100vw, 360px'
  const loading = priority ? 'eager' : 'lazy'
  const fetchPriority = priority ? 'high' : 'auto'

  return (
    <figure style={{ margin: 0 }}>
      <div className={className}>
        <picture>
          {responsiveSrcSet && <source type="image/webp" srcSet={responsiveSrcSet} sizes={responsiveSizes} />}
          <img
            src={src}
            alt={alt || source}
            loading={loading}
            decoding="async"
            fetchPriority={fetchPriority}
            referrerPolicy={isRemote ? 'no-referrer' : undefined}
            sizes={responsiveSrcSet ? responsiveSizes : sizes}
          />
        </picture>
      </div>
      <figcaption style={{ color: '#777', fontSize: '0.75rem', lineHeight: 1.5, marginTop: '0.35rem' }}>
        <span>
          Image source: {sourceUrl && creditLink ? <a href={sourceUrl} rel="nofollow noopener noreferrer" target="_blank">{source}</a> : source}
        </span>
        {originalMedia && (
          <>
            <br />
            <span>Original media: {originalMedia}</span>
          </>
        )}
        {priority && licenseNote && (
          <>
            <br />
            <span>Use note: {licenseNote}</span>
          </>
        )}
      </figcaption>
    </figure>
  )
}
