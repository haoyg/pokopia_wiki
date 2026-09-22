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
const publishableVerificationStatuses = new Set(['official-confirmed', 'community-confirmed'])

function hasValidReviewDate(value) {
  if (!value) return false
  return !Number.isNaN(new Date(value).getTime())
}

function isExplicitlyNoindex(status, indexStatus) {
  const combined = `${status || ''} ${indexStatus || ''}`.toLowerCase()
  return noIndexFlags.some((flag) => combined.includes(flag))
}

function hasEvidence(sources) {
  return Boolean(sources && sources.some((source) => {
    if (!source || !source.url) return false
    try {
      const url = new URL(source.url)
      return url.protocol === 'https:' || url.protocol === 'http:'
    } catch {
      return false
    }
  }))
}

function hasQuarantinedPokemonReference(value) {
  return String(value || '').split(',').map((id) => id.trim()).filter(Boolean).some((id) => /^pkm\d+$/i.test(id))
}

function isEditorialContent(status) {
  return Boolean(status && /^editorial$/i.test(String(status).trim()))
}

function shouldNoIndex(status, indexStatus) {
  return isEditorialContent(status) || isExplicitlyNoindex(status, indexStatus)
}

function isIndexableGuide(entry) {
  return Boolean(entry) &&
    /\bguide$/i.test(String(entry.data_status || '')) &&
    hasValidReviewDate(entry.updated_at || entry.published_at) &&
    hasValidReviewDate(entry.verified_at) &&
    publishableVerificationStatuses.has(String(entry.verification_status || '').trim().toLowerCase()) &&
    hasEvidence(entry.sources) &&
    !hasQuarantinedPokemonReference(entry.related_pokemon) &&
    !isExplicitlyNoindex(entry.data_status, entry.index_status)
}

function isIndexableDatabaseEntry(entry) {
  return Boolean(entry) &&
    hasValidReviewDate(entry.updated_at) &&
    hasValidReviewDate(entry.verified_at) &&
    publishableVerificationStatuses.has(String(entry.verification_status || '').trim().toLowerCase()) &&
    hasEvidence(entry.sources) &&
    !isExplicitlyNoindex(entry.data_status, entry.index_status)
}

module.exports = {
  isEditorialContent,
  isIndexableDatabaseEntry,
  isIndexableGuide,
  hasQuarantinedPokemonReference,
  shouldNoIndex,
}
