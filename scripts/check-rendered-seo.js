const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const issues = []

function normalizedPath(value) {
  const pathname = new URL(value, 'https://pokopia.cloud').pathname
  return pathname === '/' ? '/' : `${pathname.replace(/\/$/, '')}/`
}

function htmlPathForRoute(routePath) {
  const normalized = normalizedPath(routePath)
  if (normalized === '/') return path.join(root, 'out', 'index.html')
  return path.join(root, 'out', normalized.replace(/^\/|\/$/g, ''), 'index.html')
}

function readHead(file) {
  const html = fs.readFileSync(file, 'utf8')
  const headEnd = html.indexOf('</head>')
  return headEnd === -1 ? html : html.slice(0, headEnd)
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}=["']([^"']+)["']`, 'i'))
  return match?.[1] || ''
}

const siteSource = fs.readFileSync(path.join(root, 'src/lib/site.ts'), 'utf8')
const baseUrlMatch = siteSource.match(/BASE_URL\s*=\s*['"]([^'"]+)['"]/) 
const baseUrl = baseUrlMatch?.[1]
if (!baseUrl) {
  console.error('Rendered SEO check failed: could not determine BASE_URL from src/lib/site.ts')
  process.exit(1)
}

const sitemapFile = path.join(root, 'out', 'sitemap.xml')
if (!fs.existsSync(sitemapFile)) {
  console.error('Rendered SEO check failed: out/sitemap.xml does not exist. Run next build first.')
  process.exit(1)
}

const sitemapUrls = [...fs.readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
const titles = new Map()

for (const url of sitemapUrls) {
  const routePath = normalizedPath(url)
  const htmlFile = htmlPathForRoute(routePath)
  if (!fs.existsSync(htmlFile)) {
    issues.push(`${routePath} has no exported HTML`)
    continue
  }

  const head = readHead(htmlFile)
  const title = head.match(/<title>([\s\S]*?)<\/title>/i)?.[1].trim() || ''
  const description = head.match(/<meta\b[^>]*\bname=["']description["'][^>]*>/i)
  const descriptionValue = description ? attribute(description[0], 'content') : ''
  const canonicalTags = [...head.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => /\brel=["']canonical["']/i.test(tag))

  if (!title) issues.push(`${routePath} is missing a title`)
  if (title && title.length < 12) issues.push(`${routePath} has a short title: "${title}"`)
  if (title && titles.has(title.toLowerCase())) {
    issues.push(`${routePath} duplicates title used by ${titles.get(title.toLowerCase())}: "${title}"`)
  }
  if (title) titles.set(title.toLowerCase(), routePath)
  if (!descriptionValue || descriptionValue.length < 50) issues.push(`${routePath} is missing a substantial meta description`)
  if (canonicalTags.length !== 1) issues.push(`${routePath} has ${canonicalTags.length} canonical tags`)

  const canonical = canonicalTags.length === 1 ? attribute(canonicalTags[0], 'href') : ''
  if (canonical) {
    try {
      const canonicalUrl = new URL(canonical)
      const expectedUrl = new URL(baseUrl)
      if (canonicalUrl.origin !== expectedUrl.origin || normalizedPath(canonicalUrl.pathname) !== routePath) {
        issues.push(`${routePath} has incorrect canonical: ${canonical}`)
      }
    } catch {
      issues.push(`${routePath} has an invalid canonical URL: ${canonical}`)
    }
  }
}

if (issues.length > 0) {
  console.error('Rendered SEO check failed:')
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

console.log(`Rendered SEO check passed for ${sitemapUrls.length} sitemap pages.`)
