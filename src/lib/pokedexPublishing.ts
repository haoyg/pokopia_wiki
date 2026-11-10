import pokedex from '@/data/pokedex-verified.json'

export type VerifiedPokedexEntry = (typeof pokedex.pokemon)[number]

export function hasPokedexDetailEvidence(entry: VerifiedPokedexEntry) {
  return 'acquisition' in entry || 'variants' in entry
}

export const publishedPokedexDetails = pokedex.pokemon.filter(hasPokedexDetailEvidence)
export const publishedPokedexDetailSlugs = new Set(publishedPokedexDetails.map((entry) => entry.slug))
