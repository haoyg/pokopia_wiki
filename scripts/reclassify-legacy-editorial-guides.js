const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const legacySlugs = new Set([
  'thunder-arena-guide',
  'frost-peak-guide',
  'legendary-locations-guide',
])

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, ''))
}

function writeJson(file, data) {
  fs.writeFileSync(path.join(root, file), `${JSON.stringify(data, null, 2)}\n`)
}

const guides = readJson('src/data/guides.json')
let updatedCount = 0
const updated = guides.map((guide) => {
  if (!legacySlugs.has(guide.slug)) return guide
  updatedCount += 1
  return {
    ...guide,
    data_status: 'Editorial guide',
    data_status_note: 'This is a legacy editorial route page built from earlier site planning data. It is not a direct official source guide, and its route names, targets, rates, requirements, and recommendations require independent verification before being treated as current game facts.',
    source_notes: [
      'This legacy page uses earlier site planning data and a credited promotional screenshot source; it does not have a direct official source supporting its route-specific claims.',
      'Readers should use the official information hub and current Nintendo or Pokemon pages before relying on this page for game facts.',
    ],
    confirmed_context: [
      'No direct official source has been attached to the route-specific names, targets, or recommendations on this legacy page.',
      'The page remains clearly labeled as editorial planning content rather than source-backed game documentation.',
    ],
    editorial_limits: [
      'Treat all route-specific locations, encounter claims, rates, and requirements here as unverified until a primary source or documented in-game evidence is added.',
      'This page should not be used to establish facts on other source-backed pages.',
    ],
  }
})

if (updatedCount !== legacySlugs.size) {
  throw new Error(`Expected to reclassify ${legacySlugs.size} guides, updated ${updatedCount}.`)
}

writeJson('src/data/guides.json', updated)
writeJson('public/data/guides.json', updated)
console.log(`Reclassified ${updatedCount} legacy editorial guides.`)
