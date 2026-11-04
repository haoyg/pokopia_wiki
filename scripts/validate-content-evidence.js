const fs = require('node:fs')
const path = require('node:path')
const { isIndexableDatabaseEntry, isIndexableGuide } = require('./lib/indexing')

const root = path.join(__dirname, '..')
const publishableStatuses = new Set(['official-confirmed', 'community-confirmed'])
const datasets = [
  ['pokemon', 'src/data/pokemon.json', isIndexableDatabaseEntry],
  ['habitat', 'src/data/habitats.json', isIndexableDatabaseEntry],
  ['recipe', 'src/data/recipes.json', isIndexableDatabaseEntry],
  ['guide', 'src/data/guides.json', isIndexableGuide],
]

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, ''))
}

function validDate(value) {
  if (!value) return false
  const date = new Date(value)
  return !Number.isNaN(date.getTime()) && date.getTime() <= Date.now()
}

function validSources(sources) {
  return Array.isArray(sources) && sources.length > 0 && sources.every((source) => {
    if (!source || !source.url || !source.type) return false
    if (!['official', 'community'].includes(source.type)) return false
    try {
      const url = new URL(source.url)
      return ['http:', 'https:'].includes(url.protocol) && !/^(www\.)?pokopia\.cloud$/i.test(url.hostname)
    } catch {
      return false
    }
  })
}

const errors = []
let publishable = 0
let quarantined = 0

const verifiedPokedex = readJson('src/data/pokedex-verified.json')
if (!validDate(verifiedPokedex.reviewed_at)) errors.push('pokedex-verified has a missing, invalid, or future reviewed_at date')
if (!validSources(verifiedPokedex.sources)) errors.push('pokedex-verified contains an invalid, untyped, or self-referential source')
if (!verifiedPokedex.current_game_version) errors.push('pokedex-verified is missing current_game_version')
if (!verifiedPokedex.scope || verifiedPokedex.scope.reviewed_here !== verifiedPokedex.pokemon.length) {
  errors.push('pokedex-verified reviewed_here count does not match its Pokémon rows')
}
const pokedexNumbers = new Set()
const pokedexSlugs = new Set()
for (const pokemon of verifiedPokedex.pokemon || []) {
  if (!pokemon.name || !pokemon.slug || !Number.isInteger(pokemon.number) || !Number.isInteger(pokemon.national_dex)) {
    errors.push('pokedex-verified contains a row without a valid name, slug, Pokopia number, or National Pokédex number')
    continue
  }
  if (pokedexNumbers.has(pokemon.number)) errors.push(`pokedex-verified contains duplicate number ${pokemon.number}`)
  if (pokedexSlugs.has(pokemon.slug)) errors.push(`pokedex-verified contains duplicate slug ${pokemon.slug}`)
  pokedexNumbers.add(pokemon.number)
  pokedexSlugs.add(pokemon.slug)
  for (const field of ['types', 'specialties', 'habitats']) {
    const hasReviewedException = Boolean(pokemon.field_notes?.[field] || pokemon.field_conflicts?.[field])
    if (!Array.isArray(pokemon[field]) || (pokemon[field].length === 0 && !hasReviewedException)) {
      errors.push(`pokedex-verified:${pokemon.slug} is missing ${field}`)
    }
  }
  publishable += 1
}

const intake = readJson('src/data/verified-intake.json')
const intakeSourceIds = new Set((intake.sources || []).map((source) => source.id))
if (!validDate(intake.reviewed_at)) errors.push('verified-intake has a missing, invalid, or future reviewed_at date')
if (!validSources(intake.sources)) errors.push('verified-intake contains an invalid, untyped, or self-referential source')
for (const entity of [...(intake.pokemon || []), ...(intake.locations || [])]) {
  if (!entity.name || !Array.isArray(entity.confirmed_facts) || entity.confirmed_facts.length === 0) {
    errors.push('verified-intake contains an entity without a name or confirmed facts')
  }
  for (const sourceId of entity.source_ids || []) {
    if (!intakeSourceIds.has(sourceId)) errors.push(`verified-intake:${entity.name || 'unknown'} references missing source ${sourceId}`)
  }
}

for (const [type, file, gate] of datasets) {
  for (const record of readJson(file)) {
    const claimedPublishable = publishableStatuses.has(String(record.verification_status || '').toLowerCase())
    if (!claimedPublishable) {
      quarantined += 1
      continue
    }

    const id = record.id || record.slug || record.name || 'unknown'
    if (!validDate(record.verified_at)) errors.push(`${type}:${id} has a missing, invalid, or future verified_at date`)
    if (!validDate(record.updated_at || record.published_at)) errors.push(`${type}:${id} has a missing, invalid, or future review date`)
    if (!record.game_version) errors.push(`${type}:${id} is missing game_version`)
    if (!validSources(record.sources)) errors.push(`${type}:${id} must contain typed, external HTTP(S) evidence sources`)
    if (!gate(record)) errors.push(`${type}:${id} claims a publishable status but fails the shared indexing gate`)
    publishable += 1
  }
}

if (errors.length > 0) {
  console.error(`Content evidence validation failed with ${errors.length} issue(s):`)
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log(`Content evidence validation passed: ${publishable} publishable, ${quarantined} quarantined records.`)
