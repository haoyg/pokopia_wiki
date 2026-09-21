export function assetSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Guides that have real PNG cover photos (Unsplash)
const GUIDE_COVER_IMAGES: Record<string, string> = {
  'training-grounds-beginners': '/images/guides/training-grounds-beginners.png',
  'forest-valley-complete-walkthrough': '/images/guides/forest-valley-complete-walkthrough.png',
  'volcanic-cave-full-guide': '/images/guides/volcanic-cave-full-guide.png',
  'cloud-islands-secret-guide': '/images/guides/cloud-islands-secret-guide.png',
  'bleak-beach-complete-guide': '/images/guides/bleak-beach-complete-guide.png',
  'ocean-doors-how-to-get': '/images/guides/ocean-doors-how-to-get.png',
  'bubbly-basin-expansion-access-guide': '/images/guides/bubbly-basin-expansion-access-guide.png',
  'how-to-unlock-bubbly-basin': '/images/guides/how-to-unlock-bubbly-basin.png',
  'dlc-wave-1-bubbly-basin-release-date': '/images/guides/dlc-wave-1-bubbly-basin-release-date.png',
  'how-to-get-shiny-pearls-in-bubbly-basin': '/images/guides/how-to-get-shiny-pearls-in-bubbly-basin.png',
  'how-to-make-a-bubbly-basin-habitat-warmer': '/images/guides/how-to-make-a-bubbly-basin-habitat-warmer.png',
  'water-type-team-build': '/images/guides/water-type-team-build.png',
  'best-habitat-type-pokopia': '/images/guides/best-habitat-type-pokopia.png',
  'complete-recipe-list': '/images/guides/complete-recipe-list.png',
  'pokemon-request-planning-guide': '/images/guides/pokemon-request-planning-guide.png',
  'pokemon-center-pc-daily-routine': '/images/guides/pokemon-center-pc-daily-routine.png',
}

export function guideImage(slug: string) {
  return GUIDE_COVER_IMAGES[slug] || `/images/guides/${slug}.svg`
}

export function newsImage(slug: string, category?: string) {
  const newsImages: Record<string, string> = {
    // Real editorial cover images
    'pokopia-dive-update-how-to-unlock-dive': '/images/news/pokopia-dive-update-cover.png',
    'pokopia-expansion-pass-bubbly-basin-bonuses': '/images/news/pokopia-bubbly-basin-cover.png',
    'pokemon-pokopia-release-date-platform': '/images/news/pokemon-pokopia-release-date-platform-cover.png',
    'pokemon-pokopia-gameplay-overview-confirmed-features': '/images/news/pokemon-pokopia-gameplay-overview-confirmed-features-cover.png',
    'pokemon-pokopia-wish-upon-a-jirachi-event': '/images/news/pokemon-pokopia-wish-upon-a-jirachi-event-cover.png',
    'nintendo-switch-2-pokemon-pokopia-bundle-singapore': '/images/news/nintendo-switch-2-pokemon-pokopia-bundle-singapore-cover.png',
    'pokemon-pokopia-confirmed-moves-leafage-surf-glide': '/images/news/pokemon-pokopia-confirmed-moves-leafage-surf-glide-cover.png',
    'pokemon-pokopia-pc-requests-daily-challenges': '/images/news/pokemon-pokopia-pc-requests-daily-challenges-cover.png',
    'pokemon-pokopia-cloud-island-palette-town-explained': '/images/news/pokemon-pokopia-cloud-island-palette-town-explained-cover.png',
    'pokemon-pokopia-multiplayer-gameshare-details': '/images/news/pokemon-pokopia-multiplayer-gameshare-details-cover.png',
    'pokemon-pokopia-early-purchase-bonus-ditto-rug': '/images/news/pokemon-pokopia-early-purchase-bonus-ditto-rug-cover.png',
    'what-is-pokemon-pokopia-official-summary': '/images/news/what-is-pokemon-pokopia-official-summary-cover.png',
    'pokemon-pokopia-official-beginner-tips': '/images/news/pokemon-pokopia-official-beginner-tips-cover.png',
    'pokopia-portal-official-editorial-labels': '/images/news/pokopia-portal-official-editorial-labels-cover.png',
  }
  return newsImages[slug] || (category ? `/images/news/${category}.svg` : undefined)
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
