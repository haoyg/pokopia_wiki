const noIndexFlags = [
  'draft',
  'placeholder',
  'thin',
  'ai draft',
  'needs review',
  'noindex',
  'future',
  'unverified',
  'editorial',
]

type DatabaseSource = {
  url?: string | null
}

type GuideIndexingCandidate = {
  data_status?: string | null
  index_status?: string | null
  updated_at?: string | number | null
  published_at?: string | number | null
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

export function shouldNoIndex(status?: string | null, indexStatus?: string | null) {
  return isEditorialContent(status) || isExplicitlyNoindex(status, indexStatus)
}

export function isIndexableGuide(entry: GuideIndexingCandidate) {
  const status = entry.data_status || ''
  const hasGuideStatus = !status || /\bguide$/i.test(String(status))
  return Boolean(entry) &&
    hasGuideStatus &&
    hasValidReviewDate(entry.updated_at || entry.published_at) &&
    !isExplicitlyNoindex(entry.data_status, entry.index_status)
}

export function isIndexableDatabaseEntry(entry: DatabaseIndexingCandidate) {
  return Boolean(entry) &&
    hasValidReviewDate(entry.updated_at) &&
    !isExplicitlyNoindex(entry.data_status, entry.index_status)
}

export const noIndexMetadata = {
  index: false,
  follow: true,
  googleBot: {
    index: false,
    follow: true,
  },
} as const
