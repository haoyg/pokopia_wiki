const fs = require('node:fs')
const path = require('node:path')

const dataDir = path.join(process.cwd(), 'src', 'data')

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, fileName), 'utf8'))
}

function writeJson(fileName, data) {
  fs.writeFileSync(path.join(dataDir, fileName), `${JSON.stringify(data, null, 2)}\n`)
}

function pick(record, keys) {
  return keys.reduce((result, key) => {
    result[key] = record[key]
    return result
  }, {})
}

const spawnPokemonKeys = [
  'id',
  'name',
  'type',
  'description',
  'favorite_food',
  'skills',
  'drops',
  'habitat',
  'weather',
  'spawn_time',
  'rarity',
]

const habitatPlannerKeys = [
  'id',
  'name',
  'unlock_condition',
  'difficulty',
  'resource_bonus',
  'recommended_build',
  'weather',
  'overview',
  'farming_route',
  'rare_spawns',
  'resource_notes',
  'common_mistakes',
  'spawn_list',
  'recommended_recipe',
]

const recipeCalculatorKeys = [
  'id',
  'name',
  'best_use',
  'buff',
  'overview',
  'recommended_for',
  'best_timing',
  'rarity',
  'common_mistakes',
  'ingredients',
  'effect_duration',
  'related_pokemon',
  'related_habitats',
]

writeJson('tool-spawn-pokemon.json', readJson('pokemon.json').map((record) => pick(record, spawnPokemonKeys)))
writeJson('tool-habitats.json', readJson('habitats.json').map((record) => pick(record, habitatPlannerKeys)))
writeJson('tool-recipes.json', readJson('recipes.json').map((record) => pick(record, recipeCalculatorKeys)))

console.log('Generated compact tool datasets')
