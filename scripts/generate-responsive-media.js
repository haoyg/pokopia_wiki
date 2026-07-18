const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const root = path.join(__dirname, '..')
const mediaDirectory = path.join(root, 'public', 'media', 'nintendo')
const cwebp = process.env.CWEBP_BIN || 'cwebp'
const sourceFiles = fs.readdirSync(mediaDirectory)
  .filter((file) => /\.(jpe?g|png)$/i.test(file))
  .sort()

if (sourceFiles.length === 0) {
  console.error('No Nintendo media files found. Run npm run mirror:official-media first.')
  process.exit(1)
}

for (const sourceFile of sourceFiles) {
  const sourcePath = path.join(mediaDirectory, sourceFile)
  const baseName = sourceFile.replace(/\.(jpe?g|png)$/i, '')

  for (const width of [640, 1280]) {
    const outputPath = path.join(mediaDirectory, `${baseName}-${width}.webp`)
    execFileSync(cwebp, ['-quiet', '-q', '82', '-resize', String(width), '0', sourcePath, '-o', outputPath], {
      stdio: 'inherit',
    })
  }
}

console.log(`Generated responsive WebP variants for ${sourceFiles.length} local Nintendo images.`)
