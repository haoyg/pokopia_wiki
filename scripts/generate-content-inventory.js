const fs = require('node:fs')
const path = require('node:path')
const { isIndexableDatabaseEntry, isIndexableGuide, hasQuarantinedPokemonReference } = require('./lib/indexing')

const root = path.join(__dirname, '..')
const reportDir = path.join(root, 'reports')

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, ''))
}

function writeJson(file, value) {
  fs.mkdirSync(reportDir, { recursive: true })
  fs.writeFileSync(path.join(reportDir, file), `${JSON.stringify(value, null, 2)}\n`)
}

function databaseRows(type, route, records) {
  return records.map((record) => {
    const publishable = isIndexableDatabaseEntry(record)
    return {
      url: `${route}/${record.id}`,
      type,
      id: record.id,
      title: record.name,
      currentAction: publishable ? 'KEEP_INDEXED' : 'NOINDEX',
      nextAction: publishable ? 'MONITOR' : 'VERIFY_THEN_301_OR_410',
      reason: publishable
        ? 'Meets verification status, verification date, evidence URL, and review-date gate.'
        : 'Missing publishable verification status, verification date, or accessible evidence URL.',
    }
  })
}

const pokemon = readJson('src/data/pokemon.json')
const habitats = readJson('src/data/habitats.json')
const recipes = readJson('src/data/recipes.json')
const guides = readJson('src/data/guides.json')

const rows = [
  ...databaseRows('pokemon', '/wiki/pokemon', pokemon),
  ...databaseRows('habitat', '/wiki/habitat', habitats),
  ...databaseRows('recipe', '/wiki/recipe', recipes),
  ...guides.map((guide) => {
    const quarantinedReference = hasQuarantinedPokemonReference(guide.related_pokemon)
    const publishable = isIndexableGuide(guide)
    return {
      url: `/guides/${guide.slug}`,
      type: 'guide',
      id: guide.id,
      title: guide.title,
      currentAction: publishable ? 'KEEP_INDEXED' : 'NOINDEX',
      nextAction: publishable ? 'MONITOR' : 'MANUAL_REVIEW',
      reason: quarantinedReference
        ? 'References quarantined Pokemon IDs.'
        : publishable
          ? 'Passes current guide publishing gate.'
          : 'Fails guide status or review-date gate.',
    }
  }),
]

const summary = rows.reduce((result, row) => {
  result.total += 1
  result[row.currentAction] = (result[row.currentAction] || 0) + 1
  result.byType[row.type] = (result.byType[row.type] || 0) + 1
  return result
}, { total: 0, byType: {} })

writeJson('content-inventory.json', { generatedAt: new Date().toISOString(), summary, rows })
writeJson('url-migration-manifest.json', {
  generatedAt: new Date().toISOString(),
  policy: 'Do not issue a 301 without an evidence-backed equivalent. Use 410 only after manual review confirms no replacement.',
  urls: rows.filter((row) => row.currentAction === 'NOINDEX').map((row) => ({
    from: row.url,
    currentAction: row.currentAction,
    proposedAction: row.nextAction,
    redirectTo: null,
    reason: row.reason,
  })),
})

console.log(`Generated content inventory: ${summary.total} URLs (${summary.KEEP_INDEXED || 0} indexed, ${summary.NOINDEX || 0} noindex).`)
