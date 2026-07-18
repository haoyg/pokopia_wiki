const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const dataFiles = ['news.json', 'guides.json', 'pokemon.json', 'habitats.json', 'recipes.json']
const officialMediaBase = 'https://www.nintendo.com/eu/media/images/assets/nintendo_switch_2_games/pokemonpokopia/nswitch2_pokemonpokopia'
const localMediaPath = '/media/nintendo'
const outputDirectory = path.join(root, 'public', 'media', 'nintendo')
const userAgent = 'PokopiaPortal-MediaMirror/1.0 (+https://pokopia.cloud/source-policy/)'

function localUrl(number) {
  return `${localMediaPath}/pokopia-${number}.jpg`
}

async function download(number) {
  const sourceUrl = `${officialMediaBase}/PkmnPokopia_${number}.jpg`
  const response = await fetch(sourceUrl, { headers: { 'user-agent': userAgent } })
  const contentType = response.headers.get('content-type') || ''

  if (!response.ok || !contentType.startsWith('image/')) {
    throw new Error(`Could not download ${sourceUrl}: ${response.status} ${contentType}`)
  }

  const bytes = Buffer.from(await response.arrayBuffer())
  if (bytes.length < 10_000) throw new Error(`Downloaded file is unexpectedly small: ${sourceUrl}`)
  fs.writeFileSync(path.join(outputDirectory, `pokopia-${number}.jpg`), bytes)
}

async function main() {
  fs.mkdirSync(outputDirectory, { recursive: true })

  for (let index = 1; index <= 25; index += 1) {
    const number = String(index).padStart(2, '0')
    await download(number)
    console.log(`Mirrored ${number}`)
  }

  let updated = 0
  const sourcePattern = new RegExp(`${officialMediaBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/PkmnPokopia_(\\d{2})\\.jpg$`)

  for (const directory of ['src/data', 'public/data']) {
    for (const file of dataFiles) {
      const filePath = path.join(root, directory, file)
      const items = JSON.parse(fs.readFileSync(filePath, 'utf8'))

      for (const item of items) {
        const match = String(item.image_url || '').match(sourcePattern)
        if (!match) continue
        item.image_url = localUrl(match[1])
        updated += 1
      }

      fs.writeFileSync(filePath, `${JSON.stringify(items, null, 2)}\n`)
    }
  }

  console.log(`Mirrored 25 Nintendo screenshots and updated ${updated} data references.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
