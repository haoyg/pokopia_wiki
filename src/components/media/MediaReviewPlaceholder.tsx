type MediaReviewPlaceholderProps = {
  compact?: boolean
  label?: string
}

export function MediaReviewPlaceholder({
  compact = false,
  label = 'Media withheld pending review',
}: MediaReviewPlaceholderProps) {
  return (
    <div
      className={`media-review-placeholder${compact ? ' media-review-placeholder-compact' : ''}`}
      role="img"
      aria-label={label}
    >
      <span aria-hidden="true">✓</span>
      {!compact && (
        <div>
          <strong>{label}</strong>
          <small>Only source-matched media is published.</small>
        </div>
      )}
    </div>
  )
}
