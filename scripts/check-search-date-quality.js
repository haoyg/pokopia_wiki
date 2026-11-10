const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const index = JSON.parse(fs.readFileSync(path.join(root, 'src', 'data', 'search-index.json'), 'utf8'))
const expectedUndatedIds = new Set([
  'official-hub',
  'news-hub',
  'guides-hub',
  'features-hub',
  'creative-play-ideas',
  'friendship-requests-tracker',
  'weekly-event-tracker',
  'pokopia-animal-crossing',
  'meta-analysis',
  'editorial-policy',
  'source-policy',
  'corrections',
])
const failures = []
const today = new Date().toISOString().slice(0, 10)

for (const item of index) {
  if (expectedUndatedIds.has(item.id)) {
    if (item.updatedAt !== null) failures.push(`${item.id}: must not display a date without page-specific evidence`)
    continue
  }

  if (!item.updatedAt) {
    failures.push(`${item.id}: evidence-backed search result is missing its review or publication date`)
    continue
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.updatedAt) || Number.isNaN(new Date(`${item.updatedAt}T00:00:00Z`).getTime())) {
    failures.push(`${item.id}: invalid date ${item.updatedAt}`)
  } else if (item.updatedAt > today) {
    failures.push(`${item.id}: future date ${item.updatedAt}`)
  }
}

if (failures.length) {
  console.error(`Search date quality check failed:\n${failures.map((failure) => `- ${failure}`).join('\n')}`)
  process.exit(1)
}

console.log(`Search date quality check passed: ${expectedUndatedIds.size} undated pages hidden, ${index.length - expectedUndatedIds.size} evidence-backed dates retained.`)
