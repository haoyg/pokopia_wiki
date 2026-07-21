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
  'image_rights_status',
  'image_usage_basis',
  'image_rights_reviewed_at',
]

const allowedRightsStatuses = new Set([
  'owned-original',
  'licensed',
  'open-license',
  'public-domain',
  'rights-review-required',
  'retired-no-publication',
])
const clearedRightsStatuses = new Set(['owned-original', 'licensed', 'open-license', 'public-domain'])

const issues = []

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), file), 'utf8'))

  for (const item of data) {
    if (item.image_rights_status === 'retired-no-publication') {
      if (item.image_url) {
        issues.push(`${file}: ${item.id || item.slug || item.title || 'unknown'} retains image_url after media retirement`)
      }
      if (!item.image_retired_path || path.isAbsolute(item.image_retired_path)) {
        issues.push(`${file}: ${item.id || item.slug || item.title || 'unknown'} needs a repository-relative image_retired_path`)
      } else if (!fs.existsSync(path.join(process.cwd(), item.image_retired_path))) {
        issues.push(`${file}: ${item.id || item.slug || item.title || 'unknown'} references missing quarantined media ${item.image_retired_path}`)
      }
      if (!/retired from the public site/i.test(item.image_usage_basis || '')) {
        issues.push(`${file}: ${item.id || item.slug || item.title || 'unknown'} needs a media-retirement usage note`)
      }
      continue
    }

    if (!item.image_url) continue

    if (!/^https:\/\//i.test(item.image_url) && !item.image_url.startsWith('/')) {
      issues.push(`${file}: ${item.id || item.slug || item.title || 'unknown'} has an invalid image_url`)
    }

    if (item.image_url.startsWith('/')) {
      const localFile = path.join(process.cwd(), 'public', item.image_url)
      if (!fs.existsSync(localFile)) {
        issues.push(`${file}: ${item.id || item.slug || item.title || 'unknown'} references missing local image ${item.image_url}`)
      }

      const nintendoMedia = item.image_url.match(/^(\/media\/nintendo\/.+)\.(jpe?g|png)$/i)
      if (nintendoMedia) {
        for (const width of [640, 1280]) {
          const responsiveFile = path.join(process.cwd(), 'public', `${nintendoMedia[1]}-${width}.webp`)
          if (!fs.existsSync(responsiveFile)) {
            issues.push(`${file}: ${item.id || item.slug || item.title || 'unknown'} is missing ${width}px WebP media variant`)
          }
        }
      }
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

    if (!allowedRightsStatuses.has(item.image_rights_status)) {
      issues.push(`${file}: ${item.id || item.slug || item.title || 'unknown'} has an invalid image_rights_status`)
    }

    if (clearedRightsStatuses.has(item.image_rights_status) && !/^https:\/\//i.test(item.image_rights_evidence_url || '')) {
      issues.push(`${file}: ${item.id || item.slug || item.title || 'unknown'} claims cleared media rights without an HTTPS evidence URL`)
    }

    if (item.image_rights_status === 'rights-review-required' && !/not been verified/i.test(item.image_usage_basis || '')) {
      issues.push(`${file}: ${item.id || item.slug || item.title || 'unknown'} must state that media reuse rights have not been verified`)
    }
  }
}

if (issues.length > 0) {
  console.error('Image credit check failed:')
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

console.log('Image credit check passed.')
