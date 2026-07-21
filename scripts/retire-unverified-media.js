const fs = require('fs')
const path = require('path')

const root = process.cwd()
const dataFiles = ['news.json', 'guides.json', 'pokemon.json', 'habitats.json', 'recipes.json']
const sourceDirectory = path.join(root, 'public/media/nintendo')
const quarantineDirectory = path.join(root, 'quarantine/media-rights/nintendo')
const retiredAt = '2026-07-21'

if (fs.existsSync(sourceDirectory) && fs.existsSync(quarantineDirectory)) {
  throw new Error('Both public and quarantine Nintendo media directories exist; resolve the duplicate before retiring media.')
}

if (fs.existsSync(sourceDirectory)) {
  fs.mkdirSync(path.dirname(quarantineDirectory), { recursive: true })
  fs.renameSync(sourceDirectory, quarantineDirectory)
}

if (!fs.existsSync(quarantineDirectory)) {
  throw new Error('Quarantine media directory does not exist.')
}

let retiredRecords = 0
const retiredPaths = new Set()

for (const file of dataFiles) {
  const sourcePath = path.join(root, 'src/data', file)
  const publicPath = path.join(root, 'public/data', file)
  const records = JSON.parse(fs.readFileSync(sourcePath, 'utf8'))

  for (const record of records) {
    if (record.image_rights_status !== 'rights-review-required' || !record.image_url) continue

    const originalPublicPath = record.image_url
    const filename = path.basename(originalPublicPath)
    record.image_url = ''
    record.image_rights_status = 'retired-no-publication'
    record.image_retired_path = `quarantine/media-rights/nintendo/${filename}`
    record.image_usage_basis = `Retired from the public site on ${retiredAt} because commercial ad-supported reuse rights were not verified.`
    record.image_rights_reviewed_at = retiredAt
    retiredRecords += 1
    retiredPaths.add(originalPublicPath)
  }

  const serialized = `${JSON.stringify(records, null, 2)}\n`
  fs.writeFileSync(sourcePath, serialized)
  fs.writeFileSync(publicPath, serialized)
}

console.log(`Retired ${retiredRecords} media records across ${retiredPaths.size} unique public paths.`)
