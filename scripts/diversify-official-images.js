const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const files = ['news.json', 'guides.json', 'pokemon.json', 'habitats.json', 'recipes.json']
const officialMediaBase = 'https://www.nintendo.com/eu/media/images/assets/nintendo_switch_2_games/pokemonpokopia/nswitch2_pokemonpokopia'
const officialSource = 'Nintendo UK official Pokémon Pokopia game page'

function stableImageNumber(value) {
  return [...String(value)].reduce((total, character) => (total * 31 + character.charCodeAt(0)) >>> 0, 7) % 25 + 1
}

function itemLabel(item) {
  return item.title || item.name || item.slug || item.id || 'this page'
}

let updated = 0

for (const directory of ['src/data', 'public/data']) {
  for (const file of files) {
    const filePath = path.join(root, directory, file)
    const items = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    for (const item of items) {
      if (item.image_source !== officialSource || !/PkmnPokopia_\d{2}\.jpg$/.test(item.image_url || '')) continue

      const number = String(stableImageNumber(item.id || item.slug || itemLabel(item))).padStart(2, '0')
      item.image_url = `${officialMediaBase}/PkmnPokopia_${number}.jpg`
      item.image_alt = `Official Pokémon Pokopia gameplay screenshot used for ${itemLabel(item)}`
      updated += 1
    }

    fs.writeFileSync(filePath, `${JSON.stringify(items, null, 2)}\n`)
  }
}

console.log(`Diversified ${updated} official image references across 25 Nintendo screenshots.`)
