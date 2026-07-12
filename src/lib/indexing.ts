export function isEditorialContent(status?: string | null) {
  return Boolean(status && /^editorial\b/i.test(status.trim()))
}

type DatabaseSource = {
  url?: string | null
}

type DatabaseIndexingCandidate = {
  data_status?: string | null
  updated_at?: string | null
  sources?: DatabaseSource[] | null
  confirmed_facts?: unknown[] | null
  editorial_limits?: unknown[] | null
}

// Database records stay noindex until their game-specific claims are independently reviewable.
export function isIndexableDatabaseEntry(entry: DatabaseIndexingCandidate) {
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
