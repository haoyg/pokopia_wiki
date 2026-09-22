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

const publishableVerificationStatuses = new Set([
  'official-confirmed',
  'community-confirmed',
])

type GuideIndexingCandidate = {
  data_status?: string | null
  index_status?: string | null
  updated_at?: string | number | null
  published_at?: string | number | null
  related_pokemon?: string | null
  verification_status?: string | null
  verified_at?: string | number | null
  sources?: DatabaseSource[] | null
}

type DatabaseIndexingCandidate = {
  data_status?: string | null
  index_status?: string | null
  updated_at?: string | number | null
  verification_status?: string | null
  verified_at?: string | number | null
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

function hasEvidence(sources?: DatabaseSource[] | null) {
  return Boolean(sources?.some((source) => {
    if (!source?.url) return false
    try {
      const url = new URL(source.url)
      return url.protocol === 'https:' || url.protocol === 'http:'
    } catch {
      return false
    }
  }))
}

function hasPublishableVerification(status?: string | null) {
  return publishableVerificationStatuses.has(String(status || '').trim().toLowerCase())
}

export function hasQuarantinedPokemonReference(value?: string | null) {
  return String(value || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
    .some((id) => /^pkm\d+$/i.test(id))
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
    hasValidReviewDate(entry.verified_at) &&
    hasPublishableVerification(entry.verification_status) &&
    hasEvidence(entry.sources) &&
    !hasQuarantinedPokemonReference(entry.related_pokemon) &&
    !isExplicitlyNoindex(entry.data_status, entry.index_status)
}

export function isIndexableDatabaseEntry(entry: DatabaseIndexingCandidate) {
  return Boolean(entry) &&
    hasValidReviewDate(entry.updated_at) &&
    hasValidReviewDate(entry.verified_at) &&
    hasPublishableVerification(entry.verification_status) &&
    hasEvidence(entry.sources) &&
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
