interface NewsEditorialCoverProps {
  category: string
  title: string
  className?: string
  compact?: boolean
}

const categoryLabels: Record<string, string> = {
  official: 'Official Update',
  event: 'Event Archive',
  trailer: 'Trailer Notes',
  'source-roundup': 'Source Roundup',
  'site-update': 'Site Update',
}

export function NewsEditorialCover({ category, title, className = '', compact = false }: NewsEditorialCoverProps) {
  return (
    <div
      aria-hidden="true"
      className={`news-editorial-cover ${compact ? 'is-compact' : ''} ${className}`.trim()}
      data-category={category}
    >
      <span className="news-cover-orbit" />
      <span className="news-cover-grid" />
      <span className="news-cover-brand">Pokopia Newsroom</span>
      <span className="news-cover-category">{categoryLabels[category] || 'News Brief'}</span>
      <strong>{title}</strong>
      <span className="news-cover-mark">P</span>
    </div>
  )
}
