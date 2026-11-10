const fs = require('node:fs')
const path = require('node:path')
const sharp = require('sharp')

const root = path.join(__dirname, '..')
const pokedex = JSON.parse(fs.readFileSync(path.join(root, 'src/data/pokedex-verified.json'), 'utf8'))
const outputDir = path.join(root, 'public/images/pokedex')
const manifestPath = path.join(root, 'src/data/pokedex-image-manifest.json')
const sourceBase = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'
const mirrorBase = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork'
const reviewedAt = '2026-11-05'

fs.mkdirSync(outputDir, { recursive: true })

async function buildImage(pokemon) {
  const sourceUrl = `${sourceBase}/${pokemon.national_dex}.png`
  const outputPath = path.join(outputDir, `${pokemon.slug}.webp`)
  if (!fs.existsSync(outputPath)) {
    let response
    let lastError
    const downloadUrls = [sourceUrl, `${mirrorBase}/${pokemon.national_dex}.png`]
    for (const downloadUrl of downloadUrls) {
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          response = await fetch(downloadUrl)
          if (response.ok) break
          throw new Error(`HTTP ${response.status}`)
        } catch (error) {
          lastError = error
          await new Promise((resolve) => setTimeout(resolve, attempt * 1000))
        }
      }
      if (response?.ok) break
    }
    if (!response?.ok) throw new Error(`${pokemon.slug}: image request failed from primary and mirror sources: ${lastError?.message}`)

    const buffer = Buffer.from(await response.arrayBuffer())
    await sharp(buffer)
      .resize(256, 256, { fit: 'contain', withoutEnlargement: true })
      .webp({ quality: 82, alphaQuality: 90, effort: 5 })
      .toFile(outputPath)
  }

  return {
    slug: pokemon.slug,
    image_url: `/images/pokedex/${pokemon.slug}.webp`,
    image_alt: `${pokemon.name}${pokemon.forms?.length ? ` (${pokemon.forms.join(', ')})` : ''} Pokémon artwork for the Pokopia Pokédex`,
    image_source: 'PokeAPI sprites repository',
    image_source_url: 'https://github.com/PokeAPI/sprites',
    image_original_media: sourceUrl,
    image_rights_status: 'fair_use_editorial',
    image_usage_basis: 'Pokémon artwork is used at reduced resolution for identification and editorial reference in an independently researched game database.',
    image_license_note: 'Pokémon characters and artwork are owned by their respective rights holders. PokeAPI is the technical media source, not the copyright owner.',
    image_rights_reviewed_at: reviewedAt,
    width: 256,
    height: 256,
  }
}

async function main() {
  const results = new Array(pokedex.pokemon.length)
  let cursor = 0
  const workerCount = 3

  async function worker() {
    while (cursor < pokedex.pokemon.length) {
      const index = cursor
      cursor += 1
      results[index] = await buildImage(pokedex.pokemon[index])
      if ((index + 1) % 25 === 0 || index + 1 === pokedex.pokemon.length) {
        console.log(`Generated ${index + 1}/${pokedex.pokemon.length} Pokédex images`)
      }
    }
  }

  await Promise.all(Array.from({ length: workerCount }, () => worker()))
  fs.writeFileSync(manifestPath, `${JSON.stringify({
    generated_at: reviewedAt,
    source: {
      name: 'PokeAPI sprites repository',
      url: 'https://github.com/PokeAPI/sprites',
      usage: 'Reduced-resolution editorial identification images',
    },
    images: results,
  }, null, 2)}\n`)
  console.log(`Wrote ${results.length} image records to ${path.relative(root, manifestPath)}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
