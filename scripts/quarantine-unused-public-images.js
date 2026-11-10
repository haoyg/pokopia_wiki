const fs = require('fs')
const path = require('path')

const root = process.cwd()
const publicRoot = path.resolve(root, 'public')
const imagesRoot = path.resolve(publicRoot, 'images')
const outRoot = path.resolve(root, 'out')
const quarantineRoot = path.resolve(root, 'quarantine', 'media-quality', 'unused-public-images')
const cleanupGroups = new Set(['guides', 'pokemon', 'habitats', 'recipes', 'items', 'pokemon_backup'])
const apply = process.argv.includes('--apply')
const renderedPaths = new Set()

function assertInside(parent, target) {
  const relative = path.relative(parent, target)
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Unsafe path outside ${parent}: ${target}`)
  }
}

function walk(directory, visit) {
  if (!fs.existsSync(directory)) return
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(fullPath, visit)
    else if (entry.isFile()) visit(fullPath)
  }
}

walk(outRoot, (fullPath) => {
  if (!fullPath.endsWith('.html')) return
  const html = fs.readFileSync(fullPath, 'utf8')
  for (const match of html.matchAll(/\/images\/([^/]+)\/[^"' )<]+/g)) {
    renderedPaths.add(match[0])
  }
})

const unused = []
for (const group of cleanupGroups) {
  const groupRoot = path.join(imagesRoot, group)
  walk(groupRoot, (source) => {
    const publicPath = `/${path.relative(publicRoot, source).replaceAll('\\', '/')}`
    if (!renderedPaths.has(publicPath)) {
      unused.push({ group, source, publicPath, size: fs.statSync(source).size })
    }
  })
}

const totalBytes = unused.reduce((sum, file) => sum + file.size, 0)
console.log(`${apply ? 'Applying' : 'Dry run'}: ${unused.length} unused files, ${(totalBytes / 1024 / 1024).toFixed(2)} MB`)

for (const group of cleanupGroups) {
  const files = unused.filter((file) => file.group === group)
  const bytes = files.reduce((sum, file) => sum + file.size, 0)
  console.log(`${group}: ${files.length} files, ${(bytes / 1024 / 1024).toFixed(2)} MB`)
}

if (!apply) {
  console.log('No files moved. Re-run with --apply after reviewing the totals.')
  process.exit(0)
}

for (const file of unused) {
  assertInside(imagesRoot, file.source)
  const destination = path.resolve(quarantineRoot, file.publicPath.replace(/^\/images\//, ''))
  assertInside(quarantineRoot, destination)
  if (fs.existsSync(destination)) {
    throw new Error(`Quarantine destination already exists: ${destination}`)
  }
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.renameSync(file.source, destination)
}

console.log(`Moved ${unused.length} files to ${quarantineRoot}`)
