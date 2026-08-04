/**
 * Download real Pokemon images from PokemonDB and update pokemon.json
 *
 * PokemonDB artwork is under fair use / fair dealing for educational/editorial purposes.
 * We attribute to: Pokemon DB (pokemondb.net)
 */

const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')

const POKEMON_MAP = {
  pkm001: 'typhlosion',
  pkm002: 'bulbasaur',
  pkm003: 'charmander',
  pkm004: 'squirtle',
  pkm005: 'pikachu',
  pkm006: 'venusaur',
  pkm007: 'charizard',
  pkm008: 'jigglypuff',
  pkm009: 'gengar',
  pkm010: 'magnemite',
  pkm011: 'geodude',
  pkm012: 'carbink',
  pkm013: 'vulpix',
  pkm014: 'cloyster',
  pkm015: 'ampharos',
  pkm016: 'pidgey',
  pkm017: 'bellsprout',
  pkm018: 'mudkip',
  pkm019: 'metang',
  pkm020: 'talonflame',
  pkm021: 'gyarados',
  pkm022: 'froslass',
  pkm023: 'vulpix',
  pkm024: 'magneton',
  pkm025: 'tropius',
  pkm026: 'snubbull',
  pkm027: 'psyduck',
  pkm028: 'magmar',
  pkm029: 'snover',
  pkm030: 'absol',
  pkm031: 'salamence',
  pkm032: 'paras',
  pkm033: 'ninetales',
  pkm034: 'poliwag',
  pkm035: 'voltorb',
  pkm036: 'oddish',
  pkm037: 'lucario',
  pkm038: 'ralts',
  pkm039: 'geodude',
  pkm040: 'swablu',
  pkm041: 'carvanha',
  pkm042: 'machamp',
  pkm043: 'heatran',
  pkm044: 'entei',
  pkm045: 'staravia',
  pkm046: 'turtwig',
  pkm047: 'staraptor',
  pkm048: 'grimer',
  pkm049: 'shuppet',
  pkm050: 'groudon',
}

const BASE_URL = 'https://img.pokemondb.net/artwork/large'
const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'pokemon')

function downloadImage(id, name) {
  const url = `${BASE_URL}/${name}.jpg`
  const filePath = path.join(OUT_DIR, `${name}.jpg`)

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath)
    console.log(`Downloading ${id} (${name})...`)

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          console.log(`✓ ${id} -> ${name}.jpg`)
          resolve({ id, name, path: `/images/pokemon/${name}.jpg`, url })
        })
      } else {
        file.close()
        console.error(`✗ ${id} (${name}) failed: HTTP ${response.statusCode}`)
        // Fallback to webp
        const webpUrl = `${BASE_URL}/${name}.webp`
        const file2 = fs.createWriteStream(filePath.replace('.jpg', '.webp'))
        https.get(webpUrl, (res2) => {
          if (res2.statusCode === 200) {
            res2.pipe(file2)
            file2.on('finish', () => {
              file2.close()
              console.log(`✓ ${id} -> ${name}.webp (fallback)`)
              resolve({ id, name, path: `/images/pokemon/${name}.webp`, url: webpUrl })
            })
          } else {
            console.error(`✗ ${id} (${name}) webp fallback also failed`)
            resolve(null)
          }
        }).on('error', (err) => {
          console.error(`✗ Network error for ${id}: ${err.message}`)
          resolve(null)
        })
      }
    }).on('error', (err) => {
      console.error(`✗ Network error for ${id}: ${err.message}`)
      resolve(null)
    })
  })
}

async function main() {
  // Ensure directory exists
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true })
  }

  const results = []
  for (const [id, name] of Object.entries(POKEMON_MAP)) {
    const result = await downloadImage(id, name)
    if (result) results.push(result)
    // Small delay to be nice to the server
    await new Promise(r => setTimeout(r, 200))
  }

  console.log(`\nDownloaded ${results.length}/${Object.keys(POKEMON_MAP).length} images`)

  // Generate mapping for updating pokemon.json
  const mapping = {}
  results.forEach(r => { mapping[r.id] = r.path })

  fs.writeFileSync(
    path.join(__dirname, 'pokemon-image-mapping.json'),
    JSON.stringify(mapping, null, 2)
  )
  console.log('Mapping saved to scripts/pokemon-image-mapping.json')
}

main().catch(console.error)
