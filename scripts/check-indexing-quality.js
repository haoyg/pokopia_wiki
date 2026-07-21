const fs = require('fs')
const path = require('path')
const {
  isIndexableDatabaseEntry,
  isIndexableGuide,
  shouldNoIndex,
} = require('./lib/indexing')

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
    return withTrailingSlash(url.pathname)
  } catch {
    return withTrailingSlash(value)
  }
}

function withTrailingSlash(value) {
  if (!value || value === '/') return '/'
  const pathname = value.split('?')[0].split('#')[0]
  return pathname.endsWith('/') ? pathname : `${pathname}/`
}

function htmlPathForRoute(routePath) {
  const normalized = withTrailingSlash(routePath)
  if (normalized === '/') return path.join(root, 'out', 'index.html')
  return path.join(root, 'out', normalized.replace(/^\/|\/$/g, ''), 'index.html')
}

function readHtmlHead(file) {
  const fd = fs.openSync(file, 'r')
  try {
    const buffer = Buffer.alloc(65536)
    const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, 0)
    const chunk = buffer.toString('utf8', 0, bytesRead)
    const headEnd = chunk.indexOf('</head>')
    return headEnd === -1 ? chunk : chunk.slice(0, headEnd)
  } finally {
    fs.closeSync(fd)
  }
}

function hasNoindex(html) {
  return /<meta\s+name=["']robots["'][^>]*content=["'][^"']*\bnoindex\b/i.test(html) ||
    /<meta\s+name=["']googlebot["'][^>]*content=["'][^"']*\bnoindex\b/i.test(html)
}

function hasArticleModifiedTime(html, value) {
  const tags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0])
  return tags.some((tag) =>
    /\bproperty=["']article:modified_time["']/i.test(tag) &&
    new RegExp(`\\bcontent=["']${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'i').test(tag)
  )
}

const guides = readJson('src/data/guides.json')
const news = readJson('src/data/news.json')
const pokemon = readJson('src/data/pokemon.json')
const habitats = readJson('src/data/habitats.json')
const recipes = readJson('src/data/recipes.json')

const sourceBackedGuide = guides.find((item) => item.data_status === 'Source-backed guide')
assert(Boolean(sourceBackedGuide), 'content data must include at least one source-backed guide fixture')
if (sourceBackedGuide) {
  assert(isIndexableGuide(sourceBackedGuide), 'complete source-backed guide fixture should be indexable')
  assert(
    !isIndexableGuide({ ...sourceBackedGuide, sources: [] }),
    'source-backed guide without a source URL must not be indexable'
  )
  assert(
    !isIndexableGuide({ ...sourceBackedGuide, updated_at: null, published_at: null }),
    'source-backed guide without a review date must not be indexable'
  )
}

assert(
  shouldNoIndex('Editorial guide', 'indexable'),
  'editorial guide must remain noindex even when index_status is indexable'
)
assert(
  !isIndexableDatabaseEntry({ ...pokemon[0], index_status: 'indexable' }),
  'editorial database entry must not become indexable through index_status alone'
)

const indexableGuidePaths = new Set(
  guides.filter(isIndexableGuide).map((item) => `/guides/${item.slug}/`)
)

const indexableDatabasePaths = new Set([
  ...pokemon.filter(isIndexableDatabaseEntry).map((item) => `/wiki/pokemon/${item.id}/`),
  ...habitats.filter(isIndexableDatabaseEntry).map((item) => `/wiki/habitat/${item.id}/`),
  ...recipes.filter(isIndexableDatabaseEntry).map((item) => `/wiki/recipe/${item.id}/`),
])

const forbiddenIndexPathPatterns = [
  /^\/search\/?$/,
]

const expectedNoindexPaths = new Set([
  '/search/',
  '/guides/beginner-route/',
  '/guides/rare-farming-route/',
  '/guides/recipe-planning-route/',
  '/tier-list/',
  '/wiki/pokemon/',
  '/wiki/habitat/',
  '/wiki/recipe/',
  ...guides.filter((item) => !isIndexableGuide(item)).map((item) => `/guides/${item.slug}/`),
  ...pokemon.filter((item) => !isIndexableDatabaseEntry(item)).map((item) => `/wiki/pokemon/${item.id}/`),
  ...habitats.filter((item) => !isIndexableDatabaseEntry(item)).map((item) => `/wiki/habitat/${item.id}/`),
  ...recipes.filter((item) => !isIndexableDatabaseEntry(item)).map((item) => `/wiki/recipe/${item.id}/`),
])

const sitemapPath = path.join(root, 'out', 'sitemap.xml')
assert(fs.existsSync(sitemapPath), 'out/sitemap.xml does not exist. Run next build before indexing checks.')

let sitemapPagePaths = []
const sitemapLastModified = new Map()

if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8')
  const sitemapEntries = [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)]
  const urls = sitemapEntries.map((match) => match[1])
  const seen = new Set()

  for (const [, url, lastModified] of sitemapEntries) {
    const pagePath = normalizedPath(url)
    sitemapPagePaths.push(pagePath)
    sitemapLastModified.set(pagePath, lastModified)
    assert(!seen.has(url), `sitemap contains duplicate URL: ${url}`)
    seen.add(url)

    for (const pattern of forbiddenIndexPathPatterns) {
      assert(!pattern.test(pagePath), `sitemap includes noindex or low-confidence URL: ${pagePath}`)
    }
    if (/^\/wiki\/(pokemon|habitat|recipe)\/[^/]+\/$/.test(pagePath)) {
      assert(indexableDatabasePaths.has(pagePath), `sitemap includes database page without complete source-review data: ${pagePath}`)
    }
    if (/^\/guides\/[^/]+\/$/.test(pagePath)) {
      assert(indexableGuidePaths.has(pagePath), `sitemap includes guide without complete source-review data: ${pagePath}`)
    }

    const htmlFile = htmlPathForRoute(pagePath)
    assert(fs.existsSync(htmlFile), `sitemap URL has no exported HTML file: ${pagePath}`)

    if (fs.existsSync(htmlFile)) {
      const html = readHtmlHead(htmlFile)
      assert(!hasNoindex(html), `sitemap URL exports noindex HTML: ${pagePath}`)
    }
  }
}

for (const item of news.filter((entry) => entry.updated_at)) {
  const pagePath = `/news/${item.slug}/`
  const sitemapDate = sitemapLastModified.get(pagePath)
  const expectedDate = new Date(item.updated_at).toISOString()
  assert(sitemapDate === expectedDate, `news sitemap lastmod does not match updated_at for ${pagePath}: expected ${expectedDate}, received ${sitemapDate || 'missing'}`)

  const htmlFile = htmlPathForRoute(pagePath)
  if (fs.existsSync(htmlFile)) {
    assert(hasArticleModifiedTime(readHtmlHead(htmlFile), expectedDate), `news page is missing matching article:modified_time metadata for ${pagePath}`)
  }
}

for (const pagePath of expectedNoindexPaths) {
  const htmlFile = htmlPathForRoute(pagePath)
  if (!fs.existsSync(htmlFile)) continue

  const html = readHtmlHead(htmlFile)
  assert(hasNoindex(html), `expected noindex page is missing noindex meta: ${pagePath}`)
  assert(!sitemapPagePaths.includes(pagePath), `expected noindex page is present in sitemap: ${pagePath}`)
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

  if (/^\/wiki\/(pokemon|habitat|recipe)\/[^/]+\/$/.test(pagePath)) {
    assert(indexableDatabasePaths.has(pagePath), `search index includes database page without complete source-review data: ${pagePath}`)
  }
  if (item.type === 'Guide' && pagePath !== '/guides/') {
    assert(indexableGuidePaths.has(pagePath), `search index includes guide without complete source-review data: ${pagePath}`)
  }

  assert(
    !/^editorial\b/i.test(String(item.status || '')),
    `search index includes editorial status for ${item.href}: ${item.status}`
  )
}

const guideEntries = searchIndex.filter((item) => item.type === 'Guide')
assert(guideEntries.length > 0, 'search index has no guide entries')
assert(
  guideEntries.every((item) => ['Source-backed guide', 'Source-backed guide hub'].includes(item.status)),
  'search index guide entries must be source-backed guides or the source-backed guide hub'
)

if (issues.length > 0) {
  console.error('Indexing quality check failed:')
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

console.log(`Indexing quality check passed for ${searchIndex.length} search entries.`)
