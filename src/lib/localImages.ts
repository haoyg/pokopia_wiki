export function assetSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function guideImage(slug: string) {
  return `/images/guides/${slug}.svg`
}

export function newsImage(slug: string) {
  const newsImages: Record<string, string> = {
    'pokopia-dive-update-how-to-unlock-dive': '/images/news/pokopia-dive-update-cover.png',
    'pokopia-expansion-pass-bubbly-basin-bonuses': '/images/news/pokopia-bubbly-basin-cover.png',
  }
  return newsImages[slug] || '/images/news/pokopia-dive-update-cover.png'
}

export function pokemonImage(name: string) {
  return `/images/pokemon/${assetSlug(name)}.svg`
}

export function habitatImage(id: string, name: string) {
  return `/images/habitats/${id}-${assetSlug(name)}.svg`
}

export function recipeImage(id: string, name: string) {
  return `/images/recipes/${id}-${assetSlug(name)}.svg`
}
