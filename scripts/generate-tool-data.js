const fs = require('node:fs')
const path = require('node:path')
const { isIndexableDatabaseEntry } = require('./lib/indexing')

const dataDir = path.join(process.cwd(), 'src', 'data')

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, fileName), 'utf8'))
}

function writeJson(fileName, data) {
  const filePath = path.join(dataDir, fileName)
  const nextContent = `${JSON.stringify(data, null, 2)}\n`
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf8') === nextContent) return
  fs.writeFileSync(filePath, nextContent)
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

const teamBuilderKeys = ['id', 'name', 'type', 'rarity', 'specialty', 'habitat']

const spawnPokemon = readJson('pokemon.json')
const incompleteSpawnRecords = spawnPokemon.filter((record) => (
  !record.id ||
  !record.name ||
  !record.habitat ||
  !record.weather ||
  !record.spawn_time ||
  !record.favorite_food ||
  !record.drops
))

if (incompleteSpawnRecords.length > 0) {
  console.warn(
    `Excluded ${incompleteSpawnRecords.length} incomplete Pokemon record(s) from spawn tools: ${incompleteSpawnRecords.map((record) => record.id || record.name || 'unknown').join(', ')}`
  )
}

writeJson(
  'tool-spawn-pokemon.json',
  spawnPokemon
    .filter(isIndexableDatabaseEntry)
    .filter((record) => !incompleteSpawnRecords.includes(record))
    .map((record) => pick(record, spawnPokemonKeys))
)
writeJson('team-pokemon-links.json', spawnPokemon.filter(isIndexableDatabaseEntry).map((record) => pick(record, teamBuilderKeys)))
writeJson('tool-habitats.json', readJson('habitats.json').filter(isIndexableDatabaseEntry).map((record) => pick(record, habitatPlannerKeys)))
writeJson('tool-recipes.json', readJson('recipes.json').filter(isIndexableDatabaseEntry).map((record) => pick(record, recipeCalculatorKeys)))

console.log('Generated compact tool datasets')
