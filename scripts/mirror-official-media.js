const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const dataFiles = ['news.json', 'guides.json', 'pokemon.json', 'habitats.json', 'recipes.json']
const officialMediaBase = 'https://www.nintendo.com/eu/media/images/assets/nintendo_switch_2_games/pokemonpokopia/nswitch2_pokemonpokopia'
const localMediaPath = '/media/nintendo'
const outputDirectory = path.join(root, 'public', 'media', 'nintendo')
const userAgent = 'PokopiaPortal-MediaMirror/1.0 (+https://pokopia.cloud/source-policy/)'
const specialMedia = new Map([
  [
    'https://assets.nintendo.com.au/image/upload/f_auto/q_auto/c_scale,w_1200/v1782260785/NAL/Articles/2026/06-June/pokopia-wish-upon-a-jiraichi-article/pokopia_wish_upon_a_jiraichi_hero_image',
    'pokopia-jirachi-event.jpg',
  ],
  [
    'https://images.ctfassets.net/pkeegl0voupm/7AdSb2ARwBQEwzSvpXk4WR/b89cbde58e0dc7b3659d9e8aa1cbd951/topics-banner.png',
    'pokopia-switch2-banner.png',
  ],
])

function localUrl(number) {
  return `${localMediaPath}/pokopia-${number}.jpg`
}

async function download(sourceUrl, filename) {
  const response = await fetch(sourceUrl, { headers: { 'user-agent': userAgent } })
  const contentType = response.headers.get('content-type') || ''

  if (!response.ok || !contentType.startsWith('image/')) {
    throw new Error(`Could not download ${sourceUrl}: ${response.status} ${contentType}`)
  }

  const bytes = Buffer.from(await response.arrayBuffer())
  if (bytes.length < 10_000) throw new Error(`Downloaded file is unexpectedly small: ${sourceUrl}`)
  fs.writeFileSync(path.join(outputDirectory, filename), bytes)
}

async function main() {
  fs.mkdirSync(outputDirectory, { recursive: true })

  for (let index = 1; index <= 25; index += 1) {
    const number = String(index).padStart(2, '0')
    await download(`${officialMediaBase}/PkmnPokopia_${number}.jpg`, `pokopia-${number}.jpg`)
    console.log(`Mirrored ${number}`)
  }

  for (const [sourceUrl, filename] of specialMedia) {
    await download(sourceUrl, filename)
    console.log(`Mirrored ${filename}`)
  }

  let updated = 0
  const sourcePattern = new RegExp(`${officialMediaBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/PkmnPokopia_(\\d{2})\\.jpg$`)

  for (const directory of ['src/data', 'public/data']) {
    for (const file of dataFiles) {
      const filePath = path.join(root, directory, file)
      const items = JSON.parse(fs.readFileSync(filePath, 'utf8'))

      for (const item of items) {
        const match = String(item.image_url || '').match(sourcePattern)
        if (match) {
          item.image_url = localUrl(match[1])
          updated += 1
          continue
        }

        const specialFilename = specialMedia.get(item.image_url)
        if (specialFilename) {
          item.image_url = `${localMediaPath}/${specialFilename}`
          updated += 1
        }
      }

      fs.writeFileSync(filePath, `${JSON.stringify(items, null, 2)}\n`)
    }
  }

  console.log(`Mirrored 27 official images and updated ${updated} data references.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
