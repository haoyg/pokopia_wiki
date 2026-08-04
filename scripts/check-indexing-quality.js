const fs = require('fs')
const path = require('path')
const {
<<<<<<< Updated upstream
  isIndexableDatabaseEntry,
  isIndexableGuide,
  shouldNoIndex,
=======
  isEditorialContent,
  isIndexableDatabaseEntry,
  isIndexableGuide,
>>>>>>> Stashed changes
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

function withTrailingSlash(value) {
  if (!value || value === '/') return '/'
  const pathname = value.split('?')[0].split('#')[0]
  return pathname.endsWith('/') ? pathname : `${pathname}/`
}

function normalizedPath(value) {
  try {
    return withTrailingSlash(new URL(value, 'https://pokopia.cloud').pathname)
  } catch {
    return withTrailingSlash(value)
  }
}

function htmlPathForRoute(routePath) {
  const normalized = withTrailingSlash(routePath)
  if (normalized === '/') return path.join(root, 'out', 'index.html')
  return path.join(root, 'out', normalized.replace(/^\/|\/$/g, ''), 'index.html')
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

<<<<<<< Updated upstream
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

=======
>>>>>>> Stashed changes
const indexableDatabasePaths = new Set([
  ...pokemon.filter(isIndexableDatabaseEntry).map((item) => `/wiki/pokemon/${item.id}/`),
  ...habitats.filter(isIndexableDatabaseEntry).map((item) => `/wiki/habitat/${item.id}/`),
  ...recipes.filter(isIndexableDatabaseEntry).map((item) => `/wiki/recipe/${item.id}/`),
])

const forbiddenIndexPathPatterns = [
  /^\/search\/?$/,
<<<<<<< Updated upstream
=======
  /^\/builds\/?$/,
  /^\/builds\/home-design-ideas\/?$/,
  /^\/community\/?$/,
  /^\/community\/showcase\/?$/,
  /^\/guides\/beginner-route\/?$/,
  /^\/guides\/rare-farming-route\/?$/,
  /^\/guides\/recipe-planning-route\/?$/,
>>>>>>> Stashed changes
]

const expectedNoindexPaths = new Set([
  '/search/',
<<<<<<< Updated upstream
  '/guides/beginner-route/',
  '/guides/rare-farming-route/',
  '/guides/recipe-planning-route/',
  '/tier-list/',
  '/wiki/pokemon/',
  '/wiki/habitat/',
  '/wiki/recipe/',
  ...guides.filter((item) => !isIndexableGuide(item)).map((item) => `/guides/${item.slug}/`),
=======
  '/builds/',
  '/builds/home-design-ideas/',
  '/community/',
  '/community/showcase/',
  '/guides/beginner-route/',
  '/guides/rare-farming-route/',
  '/guides/recipe-planning-route/',
  ...guides.filter((item) => isEditorialContent(item.data_status) || !isIndexableGuide(item)).map((item) => `/guides/${item.slug}/`),
>>>>>>> Stashed changes
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
      assert(!pattern.test(pagePath), `sitemap includes noindex URL: ${pagePath}`)
    }
    if (/^\/wiki\/(pokemon|habitat|recipe)\/[^/]+\/$/.test(pagePath)) {
<<<<<<< Updated upstream
      assert(indexableDatabasePaths.has(pagePath), `sitemap includes database page without complete source-review data: ${pagePath}`)
=======
      assert(indexableDatabasePaths.has(pagePath), `sitemap includes non-published database page: ${pagePath}`)
>>>>>>> Stashed changes
    }
    if (/^\/guides\/[^/]+\/$/.test(pagePath)) {
      assert(indexableGuidePaths.has(pagePath), `sitemap includes guide without complete source-review data: ${pagePath}`)
    }

    const htmlFile = htmlPathForRoute(pagePath)
    assert(fs.existsSync(htmlFile), `sitemap URL has no exported HTML file: ${pagePath}`)
    if (fs.existsSync(htmlFile)) {
      const head = fs.readFileSync(htmlFile, 'utf8').slice(0, 80000)
      assert(!hasNoindex(head), `sitemap URL exports noindex HTML: ${pagePath}`)
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
  const head = fs.readFileSync(htmlFile, 'utf8').slice(0, 80000)
  assert(hasNoindex(head), `expected noindex page is missing noindex meta: ${pagePath}`)
  assert(!sitemapPagePaths.includes(pagePath), `expected noindex page is present in sitemap: ${pagePath}`)
}

const searchIndex = readJson('src/data/search-index.json')
const publicSearchIndex = readJson('public/data/search-index.json')
assert(JSON.stringify(searchIndex) === JSON.stringify(publicSearchIndex), 'src/data/search-index.json and public/data/search-index.json are out of sync')

for (const item of searchIndex) {
  const pagePath = normalizedPath(item.href)
  for (const pattern of forbiddenIndexPathPatterns) {
    assert(!pattern.test(pagePath), `search index includes noindex URL: ${pagePath}`)
  }
<<<<<<< Updated upstream

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
=======
  if (/^\/wiki\/(pokemon|habitat|recipe)\/[^/]+\/$/.test(pagePath)) {
    assert(indexableDatabasePaths.has(pagePath), `search index includes non-published database page: ${pagePath}`)
  }
>>>>>>> Stashed changes
}

const guideEntries = searchIndex.filter((item) => item.type === 'Guide')
assert(guideEntries.length > 0, 'search index has no guide entries')
assert(
<<<<<<< Updated upstream
  guideEntries.every((item) => ['Source-backed guide', 'Source-backed guide hub'].includes(item.status)),
  'search index guide entries must be source-backed guides or the source-backed guide hub'
=======
  guideEntries.every((item) => item.status === 'Source-backed guide' || item.status === 'Editorial guide' || item.status === 'Unverified editorial guide' || item.status === 'Source-backed guide hub'),
  'search index guide entries must be published guides or the guide hub'
>>>>>>> Stashed changes
)

if (issues.length > 0) {
  console.error('Indexing quality check failed:')
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

console.log(`Indexing quality check passed for ${searchIndex.length} search entries.`)
