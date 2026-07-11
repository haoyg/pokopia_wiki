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

const guides = readJson('src/data/guides.json')
const pokemon = readJson('src/data/pokemon.json')
const habitats = readJson('src/data/habitats.json')
const recipes = readJson('src/data/recipes.json')

function isEditorialContent(status) {
  return Boolean(status && /^editorial\b/i.test(String(status).trim()))
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

const expectedNoindexPaths = new Set([
  '/search/',
  '/tier-list/',
  '/builds/',
  '/builds/home-design-ideas/',
  '/community/',
  '/community/showcase/',
  '/wiki/pokemon/',
  '/wiki/habitat/',
  '/wiki/recipe/',
  '/guides/beginner-route/',
  '/guides/rare-farming-route/',
  '/guides/recipe-planning-route/',
  ...guides.filter((item) => isEditorialContent(item.data_status)).map((item) => `/guides/${item.slug}/`),
  ...pokemon.map((item) => `/wiki/pokemon/${item.id}/`),
  ...habitats.map((item) => `/wiki/habitat/${item.id}/`),
  ...recipes.map((item) => `/wiki/recipe/${item.id}/`),
])

const sitemapPath = path.join(root, 'out', 'sitemap.xml')
assert(fs.existsSync(sitemapPath), 'out/sitemap.xml does not exist. Run next build before indexing checks.')

let sitemapPagePaths = []

if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8')
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  const seen = new Set()

  for (const url of urls) {
    const pagePath = normalizedPath(url)
    sitemapPagePaths.push(pagePath)
    assert(!seen.has(url), `sitemap contains duplicate URL: ${url}`)
    seen.add(url)

    for (const pattern of forbiddenIndexPathPatterns) {
      assert(!pattern.test(pagePath), `sitemap includes noindex or low-confidence URL: ${pagePath}`)
    }

    const htmlFile = htmlPathForRoute(pagePath)
    assert(fs.existsSync(htmlFile), `sitemap URL has no exported HTML file: ${pagePath}`)

    if (fs.existsSync(htmlFile)) {
      const html = readHtmlHead(htmlFile)
      assert(!hasNoindex(html), `sitemap URL exports noindex HTML: ${pagePath}`)
    }
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
