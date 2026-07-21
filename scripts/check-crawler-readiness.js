const fs = require('fs')
const path = require('path')

const root = process.cwd()
const outDir = path.join(root, 'out')
const robotsPath = path.join(outDir, 'robots.txt')
const sitemapPath = path.join(outDir, 'sitemap.xml')
const issues = []

if (!fs.existsSync(robotsPath)) issues.push('out/robots.txt is missing')
if (!fs.existsSync(sitemapPath)) issues.push('out/sitemap.xml is missing')

const robots = fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath, 'utf8') : ''
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : ''

if (!/User-Agent:\s*Mediapartners-Google\s*\nAllow:\s*\//i.test(robots)) {
  issues.push('robots.txt does not explicitly allow Mediapartners-Google')
}

const mediaPartnersBlock = robots.match(/User-Agent:\s*Mediapartners-Google([\s\S]*?)(?=\nUser-Agent:|$)/i)?.[1] || ''
if (/Disallow:\s*\//i.test(mediaPartnersBlock)) {
  issues.push('robots.txt blocks Mediapartners-Google')
}

if (!robots.includes('Sitemap: https://pokopia.cloud/sitemap.xml')) {
  issues.push('robots.txt does not advertise the canonical sitemap URL')
}

const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
const uniqueUrls = new Set(urls)

if (urls.length === 0) issues.push('sitemap.xml contains no URLs')
if (uniqueUrls.size !== urls.length) issues.push('sitemap.xml contains duplicate URLs')

for (const value of urls) {
  let url
  try {
    url = new URL(value)
  } catch {
    issues.push(`sitemap.xml contains an invalid URL: ${value}`)
    continue
  }

  if (url.protocol !== 'https:' || url.hostname !== 'pokopia.cloud') {
    issues.push(`sitemap URL does not use the canonical HTTPS domain: ${value}`)
  }
  if (url.search || url.hash || /(?:session|sid|token|user|email)=/i.test(value)) {
    issues.push(`sitemap URL contains unstable or user-specific state: ${value}`)
  }

  const pathname = decodeURIComponent(url.pathname)
  const renderedPath = pathname === '/'
    ? path.join(outDir, 'index.html')
    : path.join(outDir, pathname.replace(/^\//, ''), 'index.html')
  if (!fs.existsSync(renderedPath)) {
    issues.push(`sitemap URL has no exported HTML page: ${value}`)
  }
}

const sourceFiles = []
function collect(directory) {
  if (!fs.existsSync(directory)) return
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) collect(fullPath)
    else if (entry.isFile() && /\.(js|jsx|ts|tsx)$/.test(entry.name)) sourceFiles.push(fullPath)
  }
}
collect(path.join(root, 'src'))

for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8')
  if (/Mediapartners-Google[\s\S]{0,120}Disallow:\s*['"]?\//i.test(source)) {
    issues.push(`${path.relative(root, file)} contains a Mediapartners-Google disallow rule`)
  }
}

if (issues.length > 0) {
  console.error('Crawler readiness check failed:')
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

console.log(`Crawler readiness check passed for ${urls.length} canonical sitemap URLs.`)
