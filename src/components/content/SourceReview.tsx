type Source = {
  label?: string
  url?: string
}

interface SourceReviewProps {
  className: string
  sources?: Source[] | null
  confirmedFacts?: string[] | null
  editorialLimits?: string[] | null
}

export function SourceReview({ className, sources, confirmedFacts, editorialLimits }: SourceReviewProps) {
  const linkedSources = (sources || []).filter((source) => source.label && source.url)
  const facts = confirmedFacts || []
  const limits = editorialLimits || []

  if (linkedSources.length === 0 && facts.length === 0 && limits.length === 0) return null

  return (
    <section className={className}>
      <h2>Source Review</h2>
      {linkedSources.length > 0 && (
        <ul>
          {linkedSources.map((source) => (
            <li key={source.url}><a href={source.url}>{source.label}</a></li>
          ))}
        </ul>
      )}
      {facts.length > 0 && <p><strong>Confirmed context:</strong> {facts.join(' ')}</p>}
      {limits.length > 0 && <p><strong>Editorial limits:</strong> {limits.join(' ')}</p>}
    </section>
  )
}
