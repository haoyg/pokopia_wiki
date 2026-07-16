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

function stripHtml(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function routeLabel(routePath) {
  return routePath === '/' ? 'home' : routePath.replace(/^\/|\/$/g, '')
}

function countInternalLinks(html) {
  const links = [...html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)]
    .map((match) => match[1])
    .filter((href) => href.startsWith('/') && !href.startsWith('//'))

  return new Set(links.map((href) => normalizedPath(href))).size
}

function hasReviewSignal(text) {
  return /\b(last reviewed|updated|source|sources|source-backed|source-aware|official|confirmed|correction|review process|content status)\b/i.test(text)
}

const noIndexFlags = ['draft', 'placeholder', 'thin', 'unreviewed', 'ai draft', 'needs review', 'review', 'noindex']

function shouldNoIndex(status, indexStatus) {
  const indexValue = String(indexStatus || '').trim().toLowerCase()
  if (indexValue === 'indexable' || indexValue === 'index') return false
  if (indexValue) return noIndexFlags.some((flag) => indexValue.includes(flag))

  const normalized = String(status || '').trim().toLowerCase()
  return noIndexFlags.some((flag) => normalized.includes(flag))
}

function isIndexableDatabaseEntry(item) {
  if (!item || shouldNoIndex(item.data_status, item.index_status)) return false
  const indexValue = String(item.index_status || '').trim().toLowerCase()
  if (indexValue === 'indexable' || indexValue === 'index') return true

  const reviewedAt = item.updated_at ? new Date(item.updated_at) : null
  return item.data_status === 'Source-backed database entry' &&
    Boolean(reviewedAt && !Number.isNaN(reviewedAt.getTime())) &&
    Array.isArray(item.sources) && item.sources.some((source) => /^https?:\/\//i.test(String(source?.url || ''))) &&
    Array.isArray(item.confirmed_facts) && item.confirmed_facts.length >= 2 &&
    Array.isArray(item.editorial_limits) && item.editorial_limits.length >= 2
}

function isOfficialSourceUrl(value) {
  try {
    const hostname = new URL(String(value || '')).hostname.toLowerCase()
    return hostname === 'nintendo.com' ||
      hostname.endsWith('.nintendo.com') ||
      hostname === 'pokemon.com' ||
      hostname.endsWith('.pokemon.com')
  } catch {
    return false
  }
}

function hasNoindex(html) {
  return /<meta\s+name=["']robots["'][^>]*content=["'][^"']*\bnoindex\b/i.test(html) ||
    /<meta\s+name=["']googlebot["'][^>]*content=["'][^"']*\bnoindex\b/i.test(html)
}

const forbiddenVisibleLinkPatterns = [
  /^\/search\/?$/,
]

const sitemapFile = path.join(root, 'out', 'sitemap.xml')
assert(fs.existsSync(sitemapFile), 'out/sitemap.xml does not exist. Run next build before content quality checks.')

const sitemapPaths = fs.existsSync(sitemapFile)
  ? [...fs.readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => normalizedPath(match[1]))
  : []

for (const pagePath of sitemapPaths) {
  const htmlFile = htmlPathForRoute(pagePath)
  if (!fs.existsSync(htmlFile)) continue

  const html = fs.readFileSync(htmlFile, 'utf8')
  const text = stripHtml(html)
  const label = routeLabel(pagePath)
  const wordCount = text.split(/\s+/).filter(Boolean).length
  const h2Count = (html.match(/<h2\b/gi) || []).length
  const internalLinkCount = countInternalLinks(html)

  assert(!hasNoindex(html), `${label} is in sitemap but exports noindex HTML`)
  assert(wordCount >= 120, `${label} has thin rendered text (${wordCount} words)`)
  assert(h2Count >= 1 || pagePath === '/', `${label} has no h2 section heading`)
  assert(internalLinkCount >= 3 || pagePath === '/', `${label} has too few internal links (${internalLinkCount})`)
  assert(hasReviewSignal(text), `${label} lacks visible source, review, status, updated, or confirmed signal`)
  if (/^\/tools\/.+/.test(pagePath)) {
    assert(/Source Review/i.test(text), `${label} is a tool page without visible Source Review notes`)
    assert(/WebApplication/i.test(html), `${label} is a tool page without WebApplication structured data`)
  }

  const visibleLinks = [...html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)]
    .map((match) => match[1])
    .filter((href) => href.startsWith('/') && !href.startsWith('//'))
    .map((href) => normalizedPath(href))

  for (const href of visibleLinks) {
    for (const pattern of forbiddenVisibleLinkPatterns) {
      assert(!pattern.test(href), `${label} links to noindex or low-confidence page: ${href}`)
    }
  }
}

const guides = readJson('src/data/guides.json')
const official = readJson('src/data/official.json')
const news = readJson('src/data/news.json')
const pokemon = readJson('src/data/pokemon.json')
const habitats = readJson('src/data/habitats.json')
const recipes = readJson('src/data/recipes.json')
const searchIndex = readJson('src/data/search-index.json')

const indexableGuides = guides.filter((guide) => !shouldNoIndex(guide.data_status, guide.index_status))
for (const guide of indexableGuides) {
  if (guide.data_status === 'Source-backed guide') {
    assert(Array.isArray(guide.source_notes) && guide.source_notes.length >= 2, `guide ${guide.slug} is missing source_notes`)
    assert(Array.isArray(guide.confirmed_context) && guide.confirmed_context.length >= 2, `guide ${guide.slug} is missing confirmed_context`)
    assert(Array.isArray(guide.editorial_limits) && guide.editorial_limits.length >= 2, `guide ${guide.slug} is missing editorial_limits`)
    assert(Array.isArray(guide.sources) && guide.sources.length >= 1, `guide ${guide.slug} is missing an official source`)
    assert(
      Array.isArray(guide.sources) && guide.sources.some((source) => source?.label && isOfficialSourceUrl(source.url)),
      `guide ${guide.slug} needs an official Nintendo or Pokemon source URL`
    )
  }
  assert(Array.isArray(guide.faqs) && guide.faqs.length >= 3, `guide ${guide.slug} needs at least 3 FAQs`)
  assert(String(guide.data_status_note || '').length >= 80, `guide ${guide.slug} has a weak data_status_note`)
}

for (const item of [...pokemon, ...habitats, ...recipes].filter(isIndexableDatabaseEntry)) {
  if (item.data_status === 'Source-backed database entry') {
    assert(Array.isArray(item.sources) && item.sources.some((source) => /^https?:\/\//i.test(String(source?.url || ''))), `database ${item.id} needs a primary source URL`)
    assert(Array.isArray(item.confirmed_facts) && item.confirmed_facts.length >= 2, `database ${item.id} needs confirmed facts`)
    assert(Array.isArray(item.editorial_limits) && item.editorial_limits.length >= 2, `database ${item.id} needs editorial limits`)
  }
  assert(String(item.data_status_note || '').length >= 80, `database ${item.id} has a weak data_status_note`)
  assert(item.image_source && item.image_source_url, `database ${item.id} needs image source attribution`)
  assert(Array.isArray(item.faqs) && item.faqs.length >= 3, `database ${item.id} needs at least 3 FAQs`)
}

for (const page of official) {
  assert(Array.isArray(page.facts) && page.facts.length >= 4, `official ${page.slug} needs confirmed facts`)
  assert(Array.isArray(page.sources) && page.sources.length >= 1, `official ${page.slug} needs official sources`)
  assert(Array.isArray(page.source_review_notes) && page.source_review_notes.length >= 2, `official ${page.slug} is missing source_review_notes`)
  assert(Array.isArray(page.claim_limits) && page.claim_limits.length >= 2, `official ${page.slug} is missing claim_limits`)
  assert(Array.isArray(page.recheck_triggers) && page.recheck_triggers.length >= 2, `official ${page.slug} is missing recheck_triggers`)
  assert(Array.isArray(page.related_links) && page.related_links.length >= 2, `official ${page.slug} needs related links`)
}

for (const item of news) {
  assert(item.source_label && item.source_url, `news ${item.slug} is missing primary source label or URL`)
  assert(item.verified_status, `news ${item.slug} is missing verified_status`)
  assert(Array.isArray(item.source_review_notes) && item.source_review_notes.length >= 2, `news ${item.slug} is missing source_review_notes`)
  assert(Array.isArray(item.claim_limits) && item.claim_limits.length >= 2, `news ${item.slug} is missing claim_limits`)
  assert(Array.isArray(item.recheck_triggers) && item.recheck_triggers.length >= 2, `news ${item.slug} is missing recheck_triggers`)
  assert(String(item.content || '').split(/\s+/).filter(Boolean).length >= 70, `news ${item.slug} has thin source-update content`)
  assert(!/\b(rumor|leak|unconfirmed|maybe|probably)\b/i.test(`${item.title} ${item.excerpt} ${item.verified_status}`), `news ${item.slug} uses weak confirmation wording in index-facing fields`)
}

const indexedPaths = new Set(searchIndex.map((item) => normalizedPath(item.href)))
for (const pagePath of sitemapPaths) {
  if (pagePath === '/') continue
  const topLevelUtility = /^\/(about|privacy-policy|terms|copyright|disclaimer|contact)\/?$/.test(pagePath)
  if (topLevelUtility) continue
  assert(indexedPaths.has(pagePath), `sitemap page is missing from search index: ${pagePath}`)
}

for (const item of searchIndex) {
  const combined = `${item.title || ''} ${item.description || ''} ${item.status || ''} ${item.meta || ''}`
  assert(!/\b(placeholder|future draft|coming soon|thin content|lorem ipsum)\b/i.test(combined), `search index item has low-value wording: ${item.href}`)
}

if (issues.length > 0) {
  console.error('Content quality check failed:')
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

console.log(`Content quality check passed for ${sitemapPaths.length} sitemap pages and ${searchIndex.length} search entries.`)
