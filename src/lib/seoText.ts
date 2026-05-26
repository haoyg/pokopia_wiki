const SITE_SUFFIX = ' | Pokopia Portal'

export function cleanTitle(title: string, maxLength = 58) {
  const normalized = title
    .replace(/\s+\|\s+Pokopia Portal$/i, '')
    .replace(/\bUltimate\b/gi, 'Complete')
    .replace(/\bDefinitive\b/gi, 'Source-Aware')
    .replace(/\bMeta Rankings?\b/gi, 'Priority Index')
    .replace(/\s+/g, ' ')
    .trim()

  if (normalized.length <= maxLength) return normalized
  return normalized.slice(0, maxLength - 1).trim()
}

export function cleanDescription(description: string, maxLength = 155) {
  const normalized = description
    .replace(/\byour ultimate\b/gi, 'an independent')
    .replace(/\bultimate\b/gi, 'complete')
    .replace(/\bcomprehensive\b/gi, 'structured')
    .replace(/\bdefinitive\b/gi, 'source-aware')
    .replace(/\bbest builds?\b/gi, 'build notes')
    .replace(/\s+/g, ' ')
    .trim()

  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength - 1).trim()}…`
}

export function pokemonMetaTitle(pokemon: {
  name: string
  type: string
  rarity: string
  specialty: string
}) {
  return cleanTitle(`${pokemon.name}: ${pokemon.type} ${pokemon.specialty} Guide`)
}

export function pokemonMetaDescription(pokemon: {
  name: string
  type: string
  rarity: string
  habitat: string
  favorite_food: string
  spawn_time: string
  weather: string
  overview?: string
  description?: string
}) {
  return cleanDescription(
    `${pokemon.name} is a ${pokemon.rarity} ${pokemon.type} Pokemon. Check habitat, food, spawn time, weather, drops, and editorial planning notes.`
  )
}

export function habitatMetaTitle(habitat: {
  name: string
  difficulty: string
  weather: string
}) {
  return cleanTitle(`${habitat.name}: ${habitat.difficulty} Habitat Route`)
}

export function habitatMetaDescription(habitat: {
  name: string
  unlock_condition: string
  weather: string
  resource_bonus: string
}) {
  return cleanDescription(
    `${habitat.name} habitat guide with unlock condition, ${habitat.weather} weather, ${habitat.resource_bonus}, spawn notes, recipe links, and route planning advice.`
  )
}

export function recipeMetaTitle(recipe: {
  name: string
  rarity: string
  effect_duration: string
  best_use?: string
}) {
  return cleanTitle(
    recipe.best_use
      ? `${recipe.name}: ${recipe.best_use} Recipe Guide`
      : `${recipe.name}: Recipe Timing Guide`
  )
}

export function recipeMetaDescription(recipe: {
  name: string
  ingredients: string[] | string
  buff: string
  effect_duration: string
  best_use?: string
  overview?: string
}) {
  if (recipe.overview) {
    return cleanDescription(recipe.overview)
  }

  return cleanDescription(
    `${recipe.name} recipe guide for ${recipe.best_use || 'route planning'} with ingredients, ${recipe.buff}, ${recipe.effect_duration} duration, timing notes, related Pokemon, and habitat links.`
  )
}

export function withSiteSuffix(title: string) {
  const clean = cleanTitle(title)
  return clean.endsWith(SITE_SUFFIX) ? clean : `${clean}${SITE_SUFFIX}`
}
