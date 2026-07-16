const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const files = ['news.json', 'guides.json', 'pokemon.json', 'habitats.json', 'recipes.json']
const officialPage = 'https://www.nintendo.com/en-gb/Games/Nintendo-Switch-2-games/Pokemon-Pokopia-2915161.html'
const officialMediaBase = 'https://www.nintendo.com/eu/media/images/assets/nintendo_switch_2_games/pokemonpokopia/nswitch2_pokemonpokopia'

const replacements = new Map(
  ['001.jpeg', '003.jpg', '004.jpg', '005.jpg', '006.jpg', '007.jpg', '008.jpg'].map((filename) => {
    const number = String(Number(filename.slice(0, 3))).padStart(2, '0')
    return [
      `https://www.gematsu.com/wp-content/uploads/2025/11/Pokemon-Pokopia_2025_11-13-25_${filename}`,
      `${officialMediaBase}/PkmnPokopia_${number}.jpg`,
    ]
  })
)

let updated = 0

for (const directory of ['src/data', 'public/data']) {
  for (const file of files) {
    const filePath = path.join(root, directory, file)
    const items = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    for (const item of items) {
      if (typeof item.image_url !== 'string') continue
      const replacement = replacements.get(item.image_url) || item.image_url.replace(
        /PkmnPokopia_0*(\d+)\.jpg$/,
        (_, number) => `PkmnPokopia_${String(Number(number)).padStart(2, '0')}.jpg`
      )
      if (replacement === item.image_url) continue

      item.image_url = replacement
      item.image_source = 'Nintendo UK official Pokémon Pokopia game page'
      item.image_source_url = officialPage
      item.image_license_note = 'Image is hosted by Nintendo and used for editorial identification with source attribution.'
      item.image_original_media = 'Nintendo official Pokémon Pokopia screenshot'
      updated += 1
    }

    fs.writeFileSync(filePath, `${JSON.stringify(items, null, 2)}\n`)
  }
}

console.log(`Migrated ${updated} Gematsu image references to Nintendo official media.`)
