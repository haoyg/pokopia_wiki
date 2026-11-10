const fs = require('fs')
const path = require('path')

const root = process.cwd()
const outDir = path.join(root, 'out')
const dataFiles = ['news.json', 'guides.json', 'pokemon.json', 'habitats.json', 'recipes.json']
const unresolvedPaths = new Set()
const retiredPublicPaths = new Set()
const retiredQuarantinePaths = new Set()
const qualityRetirement = JSON.parse(
  fs.readFileSync(path.join(root, 'config/media-quality-retirement.json'), 'utf8'),
)
const issues = []
let retiredRecords = 0

for (const file of dataFiles) {
  const records = JSON.parse(fs.readFileSync(path.join(root, 'src/data', file), 'utf8'))
  for (const record of records) {
    if (record.image_url && record.image_rights_status === 'rights-review-required') {
      unresolvedPaths.add(record.image_url)
    }
    if (record.image_rights_status === 'retired-no-publication') {
      retiredRecords += 1
      if (record.image_url) issues.push(`${file} retains image_url for retired media`)
      if (!record.image_retired_path) {
        issues.push(`${file} has retired media without image_retired_path`)
        continue
      }
      retiredQuarantinePaths.add(record.image_retired_path)
      retiredPublicPaths.add(`/media/nintendo/${path.basename(record.image_retired_path)}`)
    }
  }
}

for (const retiredPath of retiredQuarantinePaths) {
  if (!fs.existsSync(path.join(root, retiredPath))) {
    issues.push(`quarantined media is missing: ${retiredPath}`)
  }
}

const publicNintendoDirectory = path.join(root, 'public/media/nintendo')
if (fs.existsSync(publicNintendoDirectory)) {
  issues.push('retired Nintendo media directory still exists inside public')
}

for (const item of qualityRetirement.retired_media) {
  const publicPath = path.join(root, 'public', item.public_path.replace(/^\//, ''))
  const quarantinePath = path.join(root, item.quarantine_path)
  if (fs.existsSync(publicPath)) issues.push(`quality-retired media remains public: ${item.public_path}`)
  if (!fs.existsSync(quarantinePath)) issues.push(`quality-retired media is missing from quarantine: ${item.quarantine_path}`)
}

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(fullPath)
    else if (entry.isFile() && entry.name.endsWith('.html')) {
      const html = fs.readFileSync(fullPath, 'utf8')
      const relativePath = path.relative(outDir, fullPath).replaceAll('\\', '/')
      if (
        relativePath.startsWith('guides/') &&
        relativePath !== 'guides/index.html' &&
        /<meta name="robots" content="noindex/.test(html) &&
        /\/images\/(guides|pokemon|habitats|recipes)\//.test(html)
      ) {
        issues.push(`${path.relative(root, fullPath)} exposes legacy media on a quarantined guide`)
      }
      if (
        (relativePath.startsWith('wiki/pokemon/') || relativePath.startsWith('wiki/habitat/') || relativePath.startsWith('wiki/recipe/')) &&
        /<meta name="robots" content="noindex/.test(html) &&
        /\/images\/(guides|pokemon|habitats|recipes)\//.test(html)
      ) {
        issues.push(`${path.relative(root, fullPath)} exposes legacy media on a quarantined database page`)
      }
      if (
        (relativePath.startsWith('tags/') || relativePath === 'features/roommate-matchmaker/index.html') &&
        /<meta name="robots" content="noindex/.test(html) &&
        /\/images\/(guides|pokemon|habitats|recipes)\//.test(html)
      ) {
        issues.push(`${path.relative(root, fullPath)} exposes legacy media on a quarantined derived page`)
      }
      for (const mediaPath of unresolvedPaths) {
        if (html.includes(mediaPath)) {
          issues.push(`${path.relative(root, fullPath)} exposes unresolved media ${mediaPath}`)
        }
      }
      for (const mediaPath of retiredPublicPaths) {
        if (html.includes(mediaPath)) {
          issues.push(`${path.relative(root, fullPath)} exposes retired media ${mediaPath}`)
        }
      }
      for (const item of qualityRetirement.retired_media) {
        if (html.includes(item.public_path)) {
          issues.push(`${path.relative(root, fullPath)} exposes quality-retired media ${item.public_path}`)
        }
      }
    }
  }
}

if (!fs.existsSync(outDir)) {
  console.error('Rendered media rights check failed: out directory does not exist.')
  process.exit(1)
}

walk(outDir)

if (issues.length > 0) {
  console.error('Rendered media rights check failed:')
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

console.log(
  `Rendered media rights check passed. ${retiredRecords} records and ${retiredPublicPaths.size} public paths are retired; ${unresolvedPaths.size} unresolved media paths remain referenced.`,
)
