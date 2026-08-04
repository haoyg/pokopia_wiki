const noIndexFlags = [
  'draft',
  'placeholder',
  'thin',
<<<<<<< Updated upstream
  'unreviewed',
  'ai draft',
  'needs review',
  'review',
  'noindex',
]

const sourceBackedStatuses = new Set([
  'source-backed guide',
  'source-backed database entry',
])

function isExplicitlyIndexable(indexStatus?: string | null) {
  const value = indexStatus?.trim().toLowerCase()
  return value === 'indexable' || value === 'index'
}

function hasValidReviewDate(value?: string | number | null) {
  if (!value) return false
  return !Number.isNaN(new Date(value).getTime())
}

function hasValidSource(sources?: DatabaseSource[] | null) {
  return Array.isArray(sources) &&
    sources.some((source) => /^https?:\/\//i.test(String(source?.url || '')))
}

export function shouldNoIndex(status?: string | null, indexStatus?: string | null) {
  const indexValue = indexStatus?.trim().toLowerCase()
  const normalizedStatus = status?.trim().toLowerCase() || ''

  if (indexValue && noIndexFlags.some((flag) => indexValue.includes(flag))) return true
  if (!isExplicitlyIndexable(indexStatus)) return true
  return !sourceBackedStatuses.has(normalizedStatus)
}
=======
  'ai draft',
  'needs review',
  'noindex',
  'future',
]
>>>>>>> Stashed changes

type DatabaseSource = {
  url?: string | null
}

type GuideIndexingCandidate = {
<<<<<<< Updated upstream
  data_status?: string | null
  index_status?: string | null
  updated_at?: string | number | null
  published_at?: string | number | null
  sources?: DatabaseSource[] | null
  source_notes?: unknown[] | null
  confirmed_context?: unknown[] | null
  editorial_limits?: unknown[] | null
}

export function isIndexableGuide(entry: GuideIndexingCandidate) {
  return Boolean(entry) &&
    entry.data_status === 'Source-backed guide' &&
    isExplicitlyIndexable(entry.index_status) &&
    hasValidReviewDate(entry.updated_at || entry.published_at) &&
    hasValidSource(entry.sources) &&
    Array.isArray(entry.source_notes) && entry.source_notes.length >= 2 &&
    Array.isArray(entry.confirmed_context) && entry.confirmed_context.length >= 2 &&
    Array.isArray(entry.editorial_limits) && entry.editorial_limits.length >= 2
}

type DatabaseIndexingCandidate = {
  data_status?: string | null
  index_status?: string | null
  updated_at?: string | number | null
  sources?: DatabaseSource[] | null
  confirmed_facts?: unknown[] | null
  editorial_limits?: unknown[] | null
=======
  data_status?: string | null
  index_status?: string | null
  updated_at?: string | number | null
  published_at?: string | number | null
>>>>>>> Stashed changes
}

type DatabaseIndexingCandidate = {
  data_status?: string | null
  index_status?: string | null
  updated_at?: string | number | null
  sources?: DatabaseSource[] | null
}

function hasValidReviewDate(value?: string | number | null) {
  if (!value) return false
  return !Number.isNaN(new Date(value).getTime())
}

function isExplicitlyNoindex(status?: string | null, indexStatus?: string | null) {
  const combined = `${status || ''} ${indexStatus || ''}`.toLowerCase()
  return noIndexFlags.some((flag) => combined.includes(flag))
}

export function isEditorialContent(status?: string | null) {
  return Boolean(status && /^editorial$/i.test(status.trim()))
}

export function isIndexableGuide(entry: GuideIndexingCandidate) {
  return Boolean(entry) &&
    /\bguide$/i.test(String(entry.data_status || '')) &&
    hasValidReviewDate(entry.updated_at || entry.published_at) &&
    !isExplicitlyNoindex(entry.data_status, entry.index_status)
}

// Published database records can be indexed unless they are explicitly marked as drafts or placeholders.
export function isIndexableDatabaseEntry(entry: DatabaseIndexingCandidate) {
  return Boolean(entry) &&
<<<<<<< Updated upstream
    entry.data_status === 'Source-backed database entry' &&
    isExplicitlyIndexable(entry.index_status) &&
    hasValidReviewDate(entry.updated_at) &&
    hasValidSource(entry.sources) &&
    Array.isArray(entry.confirmed_facts) && entry.confirmed_facts.length >= 2 &&
    Array.isArray(entry.editorial_limits) && entry.editorial_limits.length >= 2
=======
    hasValidReviewDate(entry.updated_at) &&
    !isExplicitlyNoindex(entry.data_status, entry.index_status)
>>>>>>> Stashed changes
}

export const noIndexMetadata = {
  index: false,
  follow: true,
  googleBot: {
    index: false,
    follow: true,
  },
} as const
