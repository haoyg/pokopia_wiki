const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const outputDir = path.join(root, 'out')
const siteOrigin = 'https://pokopia.cloud'
const requiredHeaderRoutes = ['/', '/official', '/news', '/guides', '/tools', '/features', '/about']
const requiredTrustRoutes = ['/about', '/contact', '/privacy-policy', '/terms', '/disclaimer', '/copyright']
const sourceExtensions = new Set(['.js', '.jsx', '.ts', '.tsx'])
const issues = new Set()

function collectFiles(directory, predicate) {
  const files = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...collectFiles(file, predicate))
    if (entry.isFile() && predicate(file)) files.push(file)
  }
  return files
}

function withoutScriptAndStyle(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
}

function decodeAttribute(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
}

function pageUrlForFile(file) {
  const relative = path.relative(outputDir, file).split(path.sep).join('/')
  if (relative === 'index.html') return `${siteOrigin}/`
  if (relative === '404.html') return `${siteOrigin}/404.html`
  return `${siteOrigin}/${relative.replace(/\/index\.html$/, '/')}`
}

function normalizedRoute(pathname) {
  if (pathname === '/') return '/'
  return pathname.replace(/\/$/, '')
}

function outputTargetForPathname(pathname) {
  let decoded
  try {
    decoded = decodeURIComponent(pathname)
  } catch {
    return null
  }

  const relative = decoded.replace(/^\/+/, '')
  if (!relative) return path.join(outputDir, 'index.html')
  if (path.extname(relative)) return path.join(outputDir, relative)
  return path.join(outputDir, relative, 'index.html')
}

function renderedLinks(html, file) {
  const baseUrl = pageUrlForFile(file)
  const links = []
  for (const match of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)) {
    const href = decodeAttribute(match[1].trim())
    if (!href || href.startsWith('#') || /^(mailto|tel):/i.test(href)) continue
    if (/^(javascript|data):/i.test(href)) {
      issues.add(`${path.relative(root, file)} contains unsafe navigation href: ${href}`)
      continue
    }

    try {
      links.push({ href, url: new URL(href, baseUrl) })
    } catch {
      issues.add(`${path.relative(root, file)} contains an invalid href: ${href}`)
    }
  }
  return links
}

if (!fs.existsSync(outputDir)) {
  console.error('Navigation and trust check failed: out directory does not exist. Run next build first.')
  process.exit(1)
}

const htmlFiles = collectFiles(
  outputDir,
  (file) => file.endsWith('.html') && path.basename(file) !== 'og-image-template.html',
)
for (const file of htmlFiles) {
  const relative = path.relative(root, file)
  const rawHtml = fs.readFileSync(file, 'utf8')
  const html = withoutScriptAndStyle(rawHtml)
  const links = renderedLinks(html, file)
  const internalRoutes = new Set(
    links
      .filter(({ url }) => url.origin === siteOrigin)
      .map(({ url }) => normalizedRoute(url.pathname)),
  )

  for (const route of requiredHeaderRoutes) {
    if (!internalRoutes.has(route)) issues.add(`${relative} is missing main navigation route ${route}`)
  }
  for (const route of requiredTrustRoutes) {
    if (!internalRoutes.has(route)) issues.add(`${relative} is missing trust route ${route}`)
  }

  for (const { href, url } of links) {
    if (url.origin !== siteOrigin) continue
    const target = outputTargetForPathname(url.pathname)
    if (!target || !fs.existsSync(target)) {
      issues.add(`${relative} links to missing internal target ${href}`)
    }
  }

  if (/<meta\b[^>]*http-equiv=["']refresh["']/i.test(rawHtml)) {
    issues.add(`${relative} contains a meta refresh redirect`)
  }
  if (/<iframe\b/i.test(html)) issues.add(`${relative} contains an iframe`)
  if (/<(?:a|button)\b[^>]*\bdownload(?:\s|=|>)/i.test(html)) {
    issues.add(`${relative} contains a download control`)
  }
  if (/\b(?:adsbygoogle|ad-slot|ad-placeholder|fake-download)\b/i.test(html)) {
    issues.add(`${relative} contains an ad-like or deceptive placeholder`)
  }
}

const sourceDir = path.join(root, 'src')
const sourceFiles = collectFiles(sourceDir, (file) => sourceExtensions.has(path.extname(file)))
const unexpectedNavigationPattern = /\b(?:window|document)\.location\s*=|\b(?:window|document)\.location\.(?:assign|replace)\s*\(|\bwindow\.open\s*\(/
for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8')
  if (unexpectedNavigationPattern.test(source)) {
    issues.add(`${path.relative(root, file)} contains scripted navigation or popup behavior`)
  }
}

if (issues.size > 0) {
  console.error('Navigation and trust check failed:')
  for (const issue of [...issues].sort()) console.error(`- ${issue}`)
  process.exit(1)
}

console.log(
  `Navigation and trust check passed for ${htmlFiles.length} exported pages: internal links resolve, global navigation and trust links are present, and no redirect/download/popup/ad-placeholder patterns were found.`,
)
