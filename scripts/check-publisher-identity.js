const fs = require('fs')
const path = require('path')

const root = process.cwd()
const outDir = path.join(root, 'out')
const issues = []

function readPage(relativePath) {
  const file = path.join(outDir, relativePath)
  if (!fs.existsSync(file)) {
    issues.push(`missing rendered page: out/${relativePath}`)
    return ''
  }
  return fs.readFileSync(file, 'utf8')
}

function htmlFiles(directory) {
  const files = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...htmlFiles(fullPath))
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(fullPath)
  }
  return files
}

for (const file of htmlFiles(outDir)) {
  if (path.basename(file) === 'og-image-template.html') continue
  const html = fs.readFileSync(file, 'utf8')
  if (!html.includes('Unofficial fan resource. Not affiliated with, endorsed by, or sponsored by Nintendo')) {
    issues.push(`${path.relative(root, file)} is missing the site-wide non-affiliation disclosure`)
  }
}

const about = readPage('about/index.html')
if (!about.includes('Publisher Identity') || !about.includes('Pokopia Portal is the publisher and operator')) {
  issues.push('About page does not identify Pokopia Portal as the publisher and operator')
}

const disclaimer = readPage('disclaimer/index.html')
if (!disclaimer.includes('No Official Affiliation') || !disclaimer.includes('not affiliated with, endorsed by, sponsored by')) {
  issues.push('Disclaimer page is missing the explicit non-affiliation statement')
}

const officialIndex = readPage('official/index.html')
if (!officialIndex.includes('Independent Source Roundups') || !officialIndex.includes('not the official publisher or rights holder')) {
  issues.push('Official-source index does not clearly identify itself as an independent roundup')
}

const officialDetailDir = path.join(outDir, 'official')
if (fs.existsSync(officialDetailDir)) {
  for (const entry of fs.readdirSync(officialDetailDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const html = readPage(path.join('official', entry.name, 'index.html'))
    if (html && !html.includes('Independent official-source roundup')) {
      issues.push(`official/${entry.name} is missing the independent roundup status`)
    }
  }
}

if (issues.length > 0) {
  console.error('Publisher identity check failed:')
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

console.log('Publisher identity check passed for all rendered pages and official-source roundups.')
