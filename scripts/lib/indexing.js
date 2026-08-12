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

function hasValidReviewDate(value) {
  if (!value) return false
  return !Number.isNaN(new Date(value).getTime())
}

function isExplicitlyNoindex(status, indexStatus) {
  const combined = `${status || ''} ${indexStatus || ''}`.toLowerCase()
  return noIndexFlags.some((flag) => combined.includes(flag))
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
    !isExplicitlyNoindex(entry.data_status, entry.index_status)
}

function isIndexableDatabaseEntry(entry) {
  return Boolean(entry) &&
    hasValidReviewDate(entry.updated_at) &&
    !isExplicitlyNoindex(entry.data_status, entry.index_status)
}

module.exports = {
  isEditorialContent,
  isIndexableDatabaseEntry,
  isIndexableGuide,
  shouldNoIndex,
}
