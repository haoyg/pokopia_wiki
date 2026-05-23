interface DataStatusProps {
  status?: string
  note?: string
  updatedAt?: string | null
}

export function DataStatus({ status, note, updatedAt }: DataStatusProps) {
  if (!status && !note && !updatedAt) return null

  return (
    <aside className="data-status" aria-label="Content data status">
      <div>
        <span className="data-status-label">Content Status</span>
        {status && <strong>{status}</strong>}
      </div>
      {note && <p>{note}</p>}
      {updatedAt && <small>Last reviewed: {updatedAt}</small>}
    </aside>
  )
}
