const fs = require('fs')
const path = require('path')

const root = process.cwd()
const outDir = path.join(root, 'out')
const dataFiles = ['news.json', 'guides.json', 'pokemon.json', 'habitats.json', 'recipes.json']
const unresolvedPaths = new Set()

for (const file of dataFiles) {
  const records = JSON.parse(fs.readFileSync(path.join(root, 'src/data', file), 'utf8'))
  for (const record of records) {
    if (record.image_url && record.image_rights_status === 'rights-review-required') {
      unresolvedPaths.add(record.image_url)
    }
  }
}

const issues = []

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(fullPath)
    else if (entry.isFile() && entry.name.endsWith('.html')) {
      const html = fs.readFileSync(fullPath, 'utf8')
      for (const mediaPath of unresolvedPaths) {
        if (html.includes(mediaPath)) {
          issues.push(`${path.relative(root, fullPath)} exposes unresolved media ${mediaPath}`)
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

console.log(`Rendered media rights check passed. ${unresolvedPaths.size} unresolved media paths are absent from exported HTML.`)
