const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const sharp = require('sharp')

const root = path.join(__dirname, '..')
const imageDir = path.join(root, 'public', 'images', 'pokedex')
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'src', 'data', 'pokedex-image-manifest.json'), 'utf8'))
const pokedex = JSON.parse(fs.readFileSync(path.join(root, 'src', 'data', 'pokedex-verified.json'), 'utf8'))
const failures = []
const hashes = new Map()

async function inspectImage(entry) {
  const expectedUrl = `/images/pokedex/${entry.slug}.webp`
  if (entry.image_url !== expectedUrl) failures.push(`${entry.slug}: manifest URL is ${entry.image_url}`)

  const imagePath = path.join(root, 'public', entry.image_url.replace(/^\//, ''))
  if (!fs.existsSync(imagePath)) {
    failures.push(`${entry.slug}: image file is missing`)
    return
  }

  const buffer = fs.readFileSync(imagePath)
  if (buffer.length < 1000) failures.push(`${entry.slug}: image is suspiciously small (${buffer.length} bytes)`)

  const hash = crypto.createHash('sha256').update(buffer).digest('hex')
  if (hashes.has(hash)) failures.push(`${entry.slug}: duplicates ${hashes.get(hash)}`)
  else hashes.set(hash, entry.slug)

  const image = sharp(buffer)
  const [metadata, stats] = await Promise.all([image.metadata(), image.stats()])
  if (metadata.format !== 'webp') failures.push(`${entry.slug}: expected WebP, found ${metadata.format}`)
  if (metadata.width !== 256 || metadata.height !== 256) {
    failures.push(`${entry.slug}: expected 256x256, found ${metadata.width}x${metadata.height}`)
  }

  const alpha = stats.channels.length === 4 ? stats.channels[3] : null
  const visibleCoverage = alpha ? alpha.mean / 255 : 1
  if (visibleCoverage < 0.025) failures.push(`${entry.slug}: visible artwork coverage is only ${(visibleCoverage * 100).toFixed(1)}%`)
}

async function main() {
  const expectedSlugs = new Set(pokedex.pokemon.map((pokemon) => pokemon.slug))
  const manifestSlugs = new Set(manifest.images.map((entry) => entry.slug))
  const files = fs.readdirSync(imageDir).filter((file) => file.endsWith('.webp'))

  if (expectedSlugs.size !== 300) failures.push(`expected 300 Pokédex records, found ${expectedSlugs.size}`)
  if (manifest.images.length !== expectedSlugs.size) failures.push(`manifest has ${manifest.images.length} entries for ${expectedSlugs.size} records`)
  if (files.length !== expectedSlugs.size) failures.push(`image directory has ${files.length} WebP files for ${expectedSlugs.size} records`)

  for (const slug of expectedSlugs) {
    if (!manifestSlugs.has(slug)) failures.push(`${slug}: missing from image manifest`)
  }
  for (const entry of manifest.images) await inspectImage(entry)

  if (failures.length) {
    console.error(`Pokédex image quality check failed:\n${failures.map((failure) => `- ${failure}`).join('\n')}`)
    process.exit(1)
  }

  console.log(`Pokédex image quality check passed: ${files.length} unique 256x256 WebP files with complete manifest coverage.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
