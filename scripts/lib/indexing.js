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

const sourceBackedStatuses = new Set([
  'source-backed guide',
  'source-backed database entry',
])

function isExplicitlyIndexable(indexStatus) {
  const value = String(indexStatus || '').trim().toLowerCase()
  return value === 'indexable' || value === 'index'
}

function hasValidReviewDate(value) {
  if (!value) return false
  return !Number.isNaN(new Date(value).getTime())
}

function hasValidSource(sources) {
  return Array.isArray(sources) &&
    sources.some((source) => /^https?:\/\//i.test(String(source?.url || '')))
}

function shouldNoIndex(status, indexStatus) {
  const indexValue = String(indexStatus || '').trim().toLowerCase()
  const normalizedStatus = String(status || '').trim().toLowerCase()

  if (indexValue && noIndexFlags.some((flag) => indexValue.includes(flag))) return true
  if (!isExplicitlyIndexable(indexStatus)) return true
  return !sourceBackedStatuses.has(normalizedStatus)
}

function isIndexableGuide(entry) {
  return Boolean(entry) &&
    entry.data_status === 'Source-backed guide' &&
    isExplicitlyIndexable(entry.index_status) &&
    hasValidReviewDate(entry.updated_at || entry.published_at) &&
    hasValidSource(entry.sources) &&
    Array.isArray(entry.source_notes) && entry.source_notes.length >= 2 &&
    Array.isArray(entry.confirmed_context) && entry.confirmed_context.length >= 2 &&
    Array.isArray(entry.editorial_limits) && entry.editorial_limits.length >= 2
}

function isIndexableDatabaseEntry(entry) {
  return Boolean(entry) &&
    entry.data_status === 'Source-backed database entry' &&
    isExplicitlyIndexable(entry.index_status) &&
    hasValidReviewDate(entry.updated_at) &&
    hasValidSource(entry.sources) &&
    Array.isArray(entry.confirmed_facts) && entry.confirmed_facts.length >= 2 &&
    Array.isArray(entry.editorial_limits) && entry.editorial_limits.length >= 2
}

module.exports = {
  isIndexableDatabaseEntry,
  isIndexableGuide,
  shouldNoIndex,
}
