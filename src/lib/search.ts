import searchIndex from '@/data/search-index.json'

export type SearchResult = {
  id: string
  type: 'News' | 'Guide' | 'Pokemon' | 'Habitat' | 'Recipe'
  title: string
  href: string
  description: string
  meta: string
  keywords: string
}

const results = searchIndex as SearchResult[]

function scoreResult(result: SearchResult, terms: string[]) {
  const title = result.title.toLowerCase()
  const meta = result.meta.toLowerCase()
  const keywords = result.keywords.toLowerCase()
  const description = result.description.toLowerCase()
  const searchable = `${title} ${meta} ${description} ${keywords}`

  const matchedTerms = terms.filter((term) => searchable.includes(term))
  if (matchedTerms.length === 0) return 0

  const score = terms.reduce((score, term) => {
    if (title === term) return score + 20
    if (title.includes(term)) score += 10
    if (meta.includes(term)) score += 4
    if (description.includes(term)) score += 2
    if (keywords.includes(term)) score += 1
    return score
  }, 0)

  return matchedTerms.length === terms.length ? score + 8 : score
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
