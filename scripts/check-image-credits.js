const fs = require('fs')
const path = require('path')

const files = [
  'src/data/news.json',
  'src/data/guides.json',
  'src/data/pokemon.json',
  'src/data/habitats.json',
  'src/data/recipes.json',
]

const requiredFields = [
  'image_alt',
  'image_source',
  'image_source_url',
  'image_license_note',
]

const issues = []

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), file), 'utf8'))

  for (const item of data) {
    if (!item.image_url) continue

    for (const field of requiredFields) {
      if (!item[field]) {
        issues.push(`${file}: ${item.id || item.slug || item.title || 'unknown'} is missing ${field}`)
      }
    }
  }
}

if (issues.length > 0) {
  console.error('Image credit check failed:')
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

console.log('Image credit check passed.')
