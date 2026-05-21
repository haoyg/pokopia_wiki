import guidesData from '@/data/guides.json'
import habitatsData from '@/data/habitats.json'
import newsData from '@/data/news.json'
import pokemonData from '@/data/pokemon.json'
import recipesData from '@/data/recipes.json'

export type SearchResult = {
  id: string
  type: 'News' | 'Guide' | 'Pokemon' | 'Habitat' | 'Recipe'
  title: string
  href: string
  description: string
  meta: string
  haystack: string
}

const results: SearchResult[] = [
  ...newsData.map((item) => ({
    id: item.id,
    type: 'News' as const,
    title: item.title,
    href: `/news/${item.slug}`,
    description: item.excerpt,
    meta: item.category,
    haystack: [item.title, item.category, item.excerpt, item.content].join(' '),
  })),
  ...guidesData.map((item) => ({
    id: item.id,
    type: 'Guide' as const,
    title: item.title,
    href: `/guides/${item.slug}`,
    description: item.content,
    meta: item.category,
    haystack: [item.title, item.category, item.seo_keyword, item.content].join(' '),
  })),
  ...pokemonData.map((item) => ({
    id: item.id,
    type: 'Pokemon' as const,
    title: item.name,
    href: `/wiki/pokemon/${item.id}`,
    description: item.description,
    meta: `${item.type} / ${item.rarity}`,
    haystack: [
      item.name,
      item.type,
      item.rarity,
      item.habitat,
      item.favorite_food,
      item.spawn_time,
      item.weather,
      item.specialty,
      item.skills,
      item.drops,
      item.description,
    ].join(' '),
  })),
  ...habitatsData.map((item) => ({
    id: item.id,
    type: 'Habitat' as const,
    title: item.name,
    href: `/wiki/habitat/${item.id}`,
    description: `${item.unlock_condition}. ${item.resource_bonus}`,
    meta: `${item.weather} / ${item.difficulty}`,
    haystack: [
      item.name,
      item.unlock_condition,
      item.spawn_list,
      item.recommended_build,
      item.weather,
      item.difficulty,
      item.resource_bonus,
    ].join(' '),
  })),
  ...recipesData.map((item) => ({
    id: item.id,
    type: 'Recipe' as const,
    title: item.name,
    href: `/wiki/recipe/${item.id}`,
    description: item.buff,
    meta: `${item.rarity} / ${item.effect_duration}`,
    haystack: [
      item.name,
      item.ingredients,
      item.buff,
      item.effect_duration,
      item.rarity,
      item.best_use,
    ].join(' '),
  })),
]

function scoreResult(result: SearchResult, terms: string[]) {
  const title = result.title.toLowerCase()
  const meta = result.meta.toLowerCase()
  const haystack = result.haystack.toLowerCase()

  return terms.reduce((score, term) => {
    if (title === term) return score + 20
    if (title.includes(term)) score += 10
    if (meta.includes(term)) score += 4
    if (haystack.includes(term)) score += 1
    return score
  }, 0)
}

export function searchContent(query: string) {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean)

  if (terms.length === 0) return []

  return results
    .map((result) => ({ result, score: scoreResult(result, terms) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.result.title.localeCompare(b.result.title))
    .map((item) => item.result)
}

export const popularSearches = [
  'starter',
  'legendary',
  'fire team',
  'habitat',
  'recipe',
  'rare farming',
]
