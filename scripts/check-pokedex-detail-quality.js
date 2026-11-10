const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const outDir = path.join(root, 'out')
const pokedex = JSON.parse(fs.readFileSync(path.join(root, 'src', 'data', 'pokedex-verified.json'), 'utf8'))
const searchIndex = JSON.parse(fs.readFileSync(path.join(root, 'src', 'data', 'search-index.json'), 'utf8'))
const sitemap = fs.readFileSync(path.join(outDir, 'sitemap.xml'), 'utf8')
const published = pokedex.pokemon.filter((entry) => entry.acquisition || entry.variants?.length)
const failures = []
const titles = new Map()
const descriptions = new Map()
const homepage = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
const featuredHomepageSlugs = ['pikachu', 'snorlax', 'toxtricity', 'kyogre', 'lugia', 'ho-oh', 'mewtwo', 'mew']

function decodeEntities(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
}

function visibleWords(html) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] || ''
  const text = decodeEntities(main)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.split(' ').filter((word) => /[A-Za-z0-9]/.test(word)).length
}

for (const pokemon of published) {
  const pagePath = path.join(outDir, 'pokedex', pokemon.slug, 'index.html')
  const expectedUrl = `https://pokopia.cloud/pokedex/${pokemon.slug}/`
  if (!fs.existsSync(pagePath)) {
    failures.push(`${pokemon.slug}: exported detail page is missing`)
    continue
  }

  const html = fs.readFileSync(pagePath, 'utf8')
  const title = decodeEntities(html.match(/<title>([^<]+)<\/title>/i)?.[1] || '')
  const description = decodeEntities(html.match(/<meta name="description" content="([^"]+)"/i)?.[1] || '')
  const wordCount = visibleWords(html)

  if (wordCount < 150) failures.push(`${pokemon.slug}: main content has only ${wordCount} words`)
  if (!html.includes(`<link rel="canonical" href="${expectedUrl}"`)) failures.push(`${pokemon.slug}: canonical is missing or incorrect`)
  if (/<meta name="robots" content="[^"]*noindex/i.test(html)) failures.push(`${pokemon.slug}: published detail page is noindex`)
  if (!html.includes('application/ld+json')) failures.push(`${pokemon.slug}: JSON-LD is missing`)
  if (!html.includes(`/images/pokedex/${pokemon.slug}.webp`)) failures.push(`${pokemon.slug}: local Pokédex image is missing`)
  if ((html.match(/rel="nofollow noopener noreferrer"/g) || []).length < 4) failures.push(`${pokemon.slug}: fewer than four reviewed source links`)
  if (!sitemap.includes(`<loc>${expectedUrl}</loc>`)) failures.push(`${pokemon.slug}: missing from sitemap`)
  if (!searchIndex.some((entry) => entry.href === `/pokedex/${pokemon.slug}`)) failures.push(`${pokemon.slug}: missing from search index`)

  if (titles.has(title)) failures.push(`${pokemon.slug}: duplicate title with ${titles.get(title)}`)
  else titles.set(title, pokemon.slug)
  if (descriptions.has(description)) failures.push(`${pokemon.slug}: duplicate meta description with ${descriptions.get(description)}`)
  else descriptions.set(description, pokemon.slug)
}

for (const slug of featuredHomepageSlugs) {
  const isPublished = published.some((pokemon) => pokemon.slug === slug)
  const expectedHref = isPublished ? `/pokedex/${slug}` : `/pokedex#${slug}`
  if (!homepage.includes(`href="${expectedHref}"`)) {
    failures.push(`homepage: ${slug} should link to ${expectedHref}`)
  }
}

if (failures.length) {
  console.error(`Pokédex detail quality check failed:\n${failures.map((failure) => `- ${failure}`).join('\n')}`)
  process.exit(1)
}

console.log(`Pokédex detail quality check passed for ${published.length} evidence-qualified pages.`)
