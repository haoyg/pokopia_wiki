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

function isExplicitlyIndexable(indexStatus) {
  const value = String(indexStatus || '').trim().toLowerCase()
  return value === 'indexable' || value === 'index'
}

=======
  'ai draft',
  'needs review',
  'noindex',
  'future',
]

>>>>>>> Stashed changes
function hasValidReviewDate(value) {
  if (!value) return false
  return !Number.isNaN(new Date(value).getTime())
}

<<<<<<< Updated upstream
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
=======
function isExplicitlyNoindex(status, indexStatus) {
  const combined = `${status || ''} ${indexStatus || ''}`.toLowerCase()
  return noIndexFlags.some((flag) => combined.includes(flag))
}

function isEditorialContent(status) {
  return Boolean(status && /^editorial$/i.test(String(status).trim()))
}

function shouldNoIndex(status, indexStatus) {
  return isEditorialContent(status) || isExplicitlyNoindex(status, indexStatus)
>>>>>>> Stashed changes
}

function isIndexableGuide(entry) {
  return Boolean(entry) &&
<<<<<<< Updated upstream
    entry.data_status === 'Source-backed guide' &&
    isExplicitlyIndexable(entry.index_status) &&
    hasValidReviewDate(entry.updated_at || entry.published_at) &&
    hasValidSource(entry.sources) &&
    Array.isArray(entry.source_notes) && entry.source_notes.length >= 2 &&
    Array.isArray(entry.confirmed_context) && entry.confirmed_context.length >= 2 &&
    Array.isArray(entry.editorial_limits) && entry.editorial_limits.length >= 2
=======
    /\bguide$/i.test(String(entry.data_status || '')) &&
    hasValidReviewDate(entry.updated_at || entry.published_at) &&
    !isExplicitlyNoindex(entry.data_status, entry.index_status)
>>>>>>> Stashed changes
}

function isIndexableDatabaseEntry(entry) {
  return Boolean(entry) &&
<<<<<<< Updated upstream
    entry.data_status === 'Source-backed database entry' &&
    isExplicitlyIndexable(entry.index_status) &&
    hasValidReviewDate(entry.updated_at) &&
    hasValidSource(entry.sources) &&
    Array.isArray(entry.confirmed_facts) && entry.confirmed_facts.length >= 2 &&
    Array.isArray(entry.editorial_limits) && entry.editorial_limits.length >= 2
}

module.exports = {
=======
    hasValidReviewDate(entry.updated_at) &&
    !isExplicitlyNoindex(entry.data_status, entry.index_status)
}

module.exports = {
  isEditorialContent,
>>>>>>> Stashed changes
  isIndexableDatabaseEntry,
  isIndexableGuide,
  shouldNoIndex,
}
