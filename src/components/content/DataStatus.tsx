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
      <div>
        <span className="data-status-label">Content Status</span>
        {status && <strong>{status}</strong>}
      </div>
      {note && <p>{note}</p>}
      {updatedAt && <small>Last reviewed: {updatedAt}</small>}
      {showPolicyLink && <a className="data-status-link" href="/editorial-policy">How we review content</a>}
    </aside>
  )
}
