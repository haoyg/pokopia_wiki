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
  'image_original_media',
  'image_license_note',
]

const issues = []

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), file), 'utf8'))

  for (const item of data) {
    if (!item.image_url) continue

    if (!/^https:\/\//i.test(item.image_url) && !item.image_url.startsWith('/')) {
      issues.push(`${file}: ${item.id || item.slug || item.title || 'unknown'} has an invalid image_url`)
    }

    if (!/^https:\/\//i.test(item.image_source_url || '')) {
      issues.push(`${file}: ${item.id || item.slug || item.title || 'unknown'} needs an HTTPS image_source_url`)
    }

    const nintendoCdnWidth = item.image_url.match(/assets\.nintendo\.[^/]+\/image\/upload\/[^/]*\bw_(\d+)/i)
    if (nintendoCdnWidth && Number(nintendoCdnWidth[1]) < 960) {
      issues.push(`${file}: ${item.id || item.slug || item.title || 'unknown'} uses a Nintendo CDN image below 960px wide`)
    }

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
