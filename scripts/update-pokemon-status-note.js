/**
 * Update data_status_note for all Pokemon to reflect current guide status.
 * Now that images are properly attributed PokemonDB fair-use artwork and
 * data_status is "guide", the disclaimer can be updated.
 */

const fs = require('fs')
const path = require('path')

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'pokemon.json')

const newNote = 'Pokopia wiki editorial guide. Pokemon artwork sourced from PokemonDB under fair use for educational purposes, with full attribution. Gameplay data represents editorial analysis pending in-game verification.'

function main() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'))

  data.forEach(pokemon => {
    pokemon.data_status_note = newNote
  })

  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2))
  console.log(`Updated data_status_note for ${data.length} Pokemon entries.`)
}

main()
