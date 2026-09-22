interface DataStatusProps {
  status?: string
  note?: string
  updatedAt?: string | null
  showPolicyLink?: boolean
}

export function DataStatus({ status, note, updatedAt, showPolicyLink = false }: DataStatusProps) {
  if (!status && !note && !updatedAt) return null

  return (
    <aside className="data-status" aria-label="Content data status">
      <div className="data-status-summary">
        <span className="data-status-label">Content Status</span>
        {status && <strong>{status}</strong>}
        {updatedAt && <small>Reviewed {updatedAt}</small>}
      </div>
      {(note || showPolicyLink) && (
        <details className="data-status-details">
          <summary>View data limitations</summary>
          {note && <p>{note}</p>}
          {showPolicyLink && <a className="data-status-link" href="/editorial-policy">How we review content</a>}
        </details>
      )}
    </aside>
  )
}
