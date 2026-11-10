const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const outDir = path.join(root, 'out')
const sitemap = fs.readFileSync(path.join(outDir, 'sitemap.xml'), 'utf8')

function normalizedPath(value) {
  const pathname = new URL(value, 'https://pokopia.cloud').pathname
  if (pathname === '/') return '/'
  return `/${pathname.replace(/^\/+|\/+$/g, '')}/`
}

function routeForHtml(filePath) {
  const relativeDir = path.relative(outDir, path.dirname(filePath)).replaceAll('\\', '/')
  return relativeDir ? normalizedPath(relativeDir) : '/'
}

function htmlPathForRoute(route) {
  if (route === '/') return path.join(outDir, 'index.html')
  return path.join(outDir, route.replace(/^\/+|\/+$/g, ''), 'index.html')
}

function collectIndexFiles(directory, results = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) collectIndexFiles(entryPath, results)
    else if (entry.name === 'index.html') results.push(entryPath)
  }
  return results
}

function isNoindex(html) {
  return /<meta\s+name=["']robots["'][^>]*content=["'][^"']*\bnoindex\b/i.test(html)
}

const sitemapRoutes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => normalizedPath(match[1]))
const noindexRoutes = new Set(
  collectIndexFiles(outDir)
    .filter((filePath) => isNoindex(fs.readFileSync(filePath, 'utf8').slice(0, 80000)))
    .map(routeForHtml),
)
const quarantinedDetailRoutes = new Set(
  [...noindexRoutes].filter((route) =>
    /^\/guides\/[^/]+\/$/.test(route) ||
    /^\/wiki\/(pokemon|habitat|recipe)\/[^/]+\/$/.test(route)
  ),
)
const leaks = []

for (const sourceRoute of sitemapRoutes) {
  const sourcePath = htmlPathForRoute(sourceRoute)
  if (!fs.existsSync(sourcePath)) continue
  const html = fs.readFileSync(sourcePath, 'utf8')
  const linkedRoutes = new Set(
    [...html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)]
      .map((match) => match[1])
      .filter((href) => href.startsWith('/'))
      .map(normalizedPath),
  )

  for (const targetRoute of linkedRoutes) {
    if (quarantinedDetailRoutes.has(targetRoute)) leaks.push(`${sourceRoute} -> ${targetRoute}`)
  }
}

if (leaks.length > 0) {
  console.error(`Indexing link boundary check failed:\n${leaks.map((leak) => `- ${leak}`).join('\n')}`)
  process.exit(1)
}

console.log(`Indexing link boundary check passed: ${sitemapRoutes.length} indexable routes do not link to ${quarantinedDetailRoutes.size} quarantined detail routes.`)
