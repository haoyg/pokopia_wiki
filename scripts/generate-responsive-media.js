const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const root = path.join(__dirname, '..')
const publicDirectory = path.join(root, 'public')
const manifestPath = path.join(root, 'src', 'generated', 'imageVariants.json')
const widths = [480, 960, 1440]

function findRasterImages(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return findRasterImages(entryPath)
    if (!/\.(jpe?g|png)$/i.test(entry.name) || /-\d+\.webp$/i.test(entry.name)) return []
    return [entryPath]
  })
}

async function generateVariants(sourcePath) {
  const metadata = await sharp(sourcePath).metadata()
  if (!metadata.width) return null

  const sourceStat = fs.statSync(sourcePath)
  const outputWidths = widths.filter((width) => width < metadata.width)
  if (!outputWidths.includes(metadata.width)) outputWidths.push(metadata.width)

  const publicPath = `/${path.relative(publicDirectory, sourcePath).replaceAll('\\', '/')}`
  const extension = path.extname(sourcePath)
  const basePath = sourcePath.slice(0, -extension.length)
  const variants = []

  for (const width of outputWidths) {
    const outputPath = `${basePath}-${width}.webp`
    if (fs.existsSync(outputPath)) {
      const outputStat = fs.statSync(outputPath)
      if (outputStat.mtimeMs >= sourceStat.mtimeMs) {
        variants.push({
          src: `/${path.relative(publicDirectory, outputPath).replaceAll('\\', '/')}`,
          width,
        })
        continue
      }
    }

    await sharp(sourcePath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toFile(outputPath)
    variants.push({
      src: `/${path.relative(publicDirectory, outputPath).replaceAll('\\', '/')}`,
      width,
    })
  }

  return [publicPath, variants]
}

async function main() {
  const sourceFiles = findRasterImages(publicDirectory)
  const entries = []
  for (const sourceFile of sourceFiles) {
    const entry = await generateVariants(sourceFile)
    if (entry) entries.push(entry)
  }
  const manifest = Object.fromEntries(entries)

  fs.mkdirSync(path.dirname(manifestPath), { recursive: true })
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

  const variantCount = entries.reduce((total, entry) => total + entry[1].length, 0)
  console.log(`Generated ${variantCount} responsive WebP variants for ${entries.length} images.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
