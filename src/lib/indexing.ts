const noIndexFlags = [
  'draft',
  'placeholder',
  'thin',
  'unreviewed',
  'ai draft',
  'needs review',
  'review',
  'noindex',
]

export function shouldNoIndex(status?: string | null, indexStatus?: string | null) {
  const indexValue = indexStatus?.trim().toLowerCase()

  if (indexValue === 'indexable' || indexValue === 'index') return false
  if (indexValue) return noIndexFlags.some((flag) => indexValue.includes(flag))

  if (!status) return false

  const normalized = status.trim().toLowerCase()
  return noIndexFlags.some((flag) => normalized.includes(flag))
}

type DatabaseSource = {
  url?: string | null
}

type DatabaseIndexingCandidate = {
  data_status?: string | null
  index_status?: string | null
  updated_at?: string | null
  sources?: DatabaseSource[] | null
  confirmed_facts?: unknown[] | null
  editorial_limits?: unknown[] | null
}

// Database records stay noindex until their game-specific claims are independently reviewable.
export function isIndexableDatabaseEntry(entry: DatabaseIndexingCandidate) {
  if (!entry || shouldNoIndex(entry.data_status, entry.index_status)) return false

  const indexValue = entry.index_status?.trim().toLowerCase()
  if (indexValue === 'indexable' || indexValue === 'index') return true

  const reviewedAt = entry.updated_at ? new Date(entry.updated_at) : null
  return entry.data_status === 'Source-backed database entry' &&
    Boolean(reviewedAt && !Number.isNaN(reviewedAt.getTime())) &&
    Array.isArray(entry.sources) && entry.sources.some((source) => /^https?:\/\//i.test(String(source?.url || ''))) &&
    Array.isArray(entry.confirmed_facts) && entry.confirmed_facts.length >= 2 &&
    Array.isArray(entry.editorial_limits) && entry.editorial_limits.length >= 2
}

export const noIndexMetadata = {
  index: false,
  follow: true,
  googleBot: {
    index: false,
    follow: true,
  },
} as const
