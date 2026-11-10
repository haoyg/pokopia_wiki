const fs = require('fs')
const path = require('path')

const root = process.cwd()
const outDir = path.join(root, 'out')
const publicImagesDir = path.join(root, 'public', 'images')
const trackedGroups = new Set(['guides', 'pokemon', 'habitats', 'recipes', 'items', 'news', 'pokedex', 'pokemon_backup'])
const cleanupGroups = new Set(['guides', 'pokemon', 'habitats', 'recipes', 'items', 'pokemon_backup'])
const renderedPaths = new Set()
const showUsed = process.argv.includes('--show-used')
const failUnused = process.argv.includes('--fail-unused')
let cleanupUnusedCount = 0

function walk(directory, visit) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(fullPath, visit)
    else if (entry.isFile()) visit(fullPath)
  }
}

walk(outDir, (fullPath) => {
  if (!fullPath.endsWith('.html')) return
  const html = fs.readFileSync(fullPath, 'utf8')
  for (const match of html.matchAll(/\/images\/([^/]+)\/[^"' )<]+/g)) {
    if (trackedGroups.has(match[1])) renderedPaths.add(match[0])
  }
})

const publicFiles = []
walk(publicImagesDir, (fullPath) => {
  const publicPath = `/${path.relative(path.join(root, 'public'), fullPath).replaceAll('\\', '/')}`
  const group = publicPath.split('/')[2]
  if (trackedGroups.has(group)) publicFiles.push({ fullPath, publicPath, group })
})

for (const group of trackedGroups) {
  const files = publicFiles.filter((file) => file.group === group)
  const used = files.filter((file) => renderedPaths.has(file.publicPath))
  const unused = files.filter((file) => !renderedPaths.has(file.publicPath))
  const unusedBytes = unused.reduce((total, file) => total + fs.statSync(file.fullPath).size, 0)
  if (cleanupGroups.has(group)) cleanupUnusedCount += unused.length
  console.log(
    `${group}: public=${files.length}, rendered=${used.length}, unused=${unused.length}, unused_mb=${(unusedBytes / 1024 / 1024).toFixed(2)}`,
  )
  if (showUsed) {
    for (const file of used) console.log(`  USED ${file.publicPath}`)
  }
}

if (failUnused && cleanupUnusedCount > 0) {
  console.error(`Found ${cleanupUnusedCount} unused files in deployment-cleanup image groups.`)
  process.exit(1)
}
