const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const outputDir = path.join(root, 'out')
const issues = []

function collectHtmlFiles(directory) {
  const files = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...collectHtmlFiles(file))
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(file)
  }
  return files
}

function withoutScriptAndStyle(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
}

function findNestedAnchors(html) {
  const tagPattern = /<\/?([a-z][\w:-]*)\b[^>]*>/gi
  let anchorDepth = 0
  let match

  while ((match = tagPattern.exec(html))) {
    const tag = match[1].toLowerCase()
    if (tag !== 'a') continue

    const token = match[0]
    if (token.startsWith('</')) {
      anchorDepth = Math.max(anchorDepth - 1, 0)
      continue
    }

    if (anchorDepth > 0) return true
    if (!token.endsWith('/>')) anchorDepth += 1
  }

  return false
}

if (!fs.existsSync(outputDir)) {
  console.error('HTML structure check failed: out directory does not exist. Run next build first.')
  process.exit(1)
}

const htmlFiles = collectHtmlFiles(outputDir)
for (const file of htmlFiles) {
  const html = withoutScriptAndStyle(fs.readFileSync(file, 'utf8'))
  if (findNestedAnchors(html)) {
    issues.push(path.relative(root, file))
  }
}

if (issues.length > 0) {
  console.error('HTML structure check failed: nested anchor tags found in:')
  for (const file of issues) console.error(`- ${file}`)
  process.exit(1)
}

console.log(`HTML structure check passed for ${htmlFiles.length} exported pages.`)
