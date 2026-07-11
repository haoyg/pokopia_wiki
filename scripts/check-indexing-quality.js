const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const issues = []

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '')
}

function readJson(file) {
  return JSON.parse(read(file))
}

function assert(condition, message) {
  if (!condition) issues.push(message)
}

function normalizedPath(value) {
  try {
    const url = new URL(value, 'https://pokopia.cloud')
    return url.pathname
  } catch {
    return value
  }
}

const forbiddenIndexPathPatterns = [
  /^\/search\/?$/,
  /^\/wiki\/pokemon(?:\/|$)/,
  /^\/wiki\/habitat(?:\/|$)/,
  /^\/wiki\/recipe(?:\/|$)/,
  /^\/tier-list\/?$/,
  /^\/builds\/home-design-ideas\/?$/,
  /^\/community\/showcase\/?$/,
  /^\/guides\/beginner-route\/?$/,
  /^\/guides\/rare-farming-route\/?$/,
  /^\/guides\/recipe-planning-route\/?$/,
]

const sitemapPath = path.join(root, 'out', 'sitemap.xml')
assert(fs.existsSync(sitemapPath), 'out/sitemap.xml does not exist. Run next build before indexing checks.')

if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8')
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  const seen = new Set()

  for (const url of urls) {
    const pagePath = normalizedPath(url)
    assert(!seen.has(url), `sitemap contains duplicate URL: ${url}`)
    seen.add(url)

    for (const pattern of forbiddenIndexPathPatterns) {
      assert(!pattern.test(pagePath), `sitemap includes noindex or low-confidence URL: ${pagePath}`)
    }
  }
}

const searchIndex = readJson('src/data/search-index.json')
const publicSearchIndex = readJson('public/data/search-index.json')

assert(
  JSON.stringify(searchIndex) === JSON.stringify(publicSearchIndex),
  'src/data/search-index.json and public/data/search-index.json are out of sync'
)

for (const item of searchIndex) {
  const pagePath = normalizedPath(item.href)
  for (const pattern of forbiddenIndexPathPatterns) {
    assert(!pattern.test(pagePath), `search index includes noindex or low-confidence URL: ${pagePath}`)
  }

  assert(
    !/^editorial\b/i.test(String(item.status || '')),
    `search index includes editorial status for ${item.href}: ${item.status}`
  )
}

const guideEntries = searchIndex.filter((item) => item.type === 'Guide')
assert(guideEntries.length > 0, 'search index has no guide entries')
assert(
  guideEntries.every((item) => item.status === 'Source-backed guide' || item.status === 'Source-backed guide hub'),
  'search index guide entries must be source-backed guides or the source-backed guide hub'
)

if (issues.length > 0) {
  console.error('Indexing quality check failed:')
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

console.log(`Indexing quality check passed for ${searchIndex.length} search entries.`)
