import { MetadataRoute } from 'next'

export const dynamic = 'force-static'
import newsData from '@/data/news.json'
import guidesData from '@/data/guides.json'
import pokemonData from '@/data/pokemon.json'
import habitatsData from '@/data/habitats.json'
import recipesData from '@/data/recipes.json'
import officialData from '@/data/official.json'
import { BASE_URL } from '@/lib/site'

const SITE_REVIEWED_AT = new Date('2026-05-23')

const staticPages = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/official/', priority: 0.9, changefreq: 'weekly' },
  { url: '/news/', priority: 0.85, changefreq: 'weekly' },
  { url: '/news/weekly-event-tracker/', priority: 0.76, changefreq: 'weekly' },
  { url: '/guides/', priority: 0.85, changefreq: 'weekly' },
  { url: '/guides/beginner-route/', priority: 0.82, changefreq: 'weekly' },
  { url: '/guides/rare-farming-route/', priority: 0.82, changefreq: 'weekly' },
  { url: '/guides/recipe-planning-route/', priority: 0.82, changefreq: 'weekly' },
  { url: '/wiki/pokemon/', priority: 0.8, changefreq: 'weekly' },
  { url: '/wiki/habitat/', priority: 0.78, changefreq: 'weekly' },
  { url: '/wiki/recipe/', priority: 0.74, changefreq: 'weekly' },
  { url: '/features/', priority: 0.65, changefreq: 'monthly' },
  { url: '/search/', priority: 0.45, changefreq: 'monthly' },
  { url: '/tools/', priority: 0.65, changefreq: 'monthly' },
  { url: '/tools/habitat-planner/', priority: 0.66, changefreq: 'monthly' },
  { url: '/tools/recipe-calculator/', priority: 0.66, changefreq: 'monthly' },
  { url: '/tools/team-builder/', priority: 0.62, changefreq: 'monthly' },
  { url: '/tools/spawn-tracker/', priority: 0.62, changefreq: 'monthly' },
  { url: '/features/pokopia-animal-crossing/', priority: 0.72, changefreq: 'monthly' },
  { url: '/features/friendship-requests-tracker/', priority: 0.7, changefreq: 'monthly' },
  { url: '/features/creative-play-ideas/', priority: 0.68, changefreq: 'monthly' },
  { url: '/features/meta-analysis/', priority: 0.7, changefreq: 'monthly' },
  { url: '/builds/', priority: 0.45, changefreq: 'monthly' },
  { url: '/builds/home-design-ideas/', priority: 0.66, changefreq: 'monthly' },
  { url: '/tier-list/', priority: 0.58, changefreq: 'monthly' },
  { url: '/community/', priority: 0.4, changefreq: 'monthly' },
  { url: '/community/showcase/', priority: 0.62, changefreq: 'monthly' },
  { url: '/about/', priority: 0.35, changefreq: 'yearly' },
  { url: '/contact/', priority: 0.35, changefreq: 'yearly' },
  { url: '/disclaimer/', priority: 0.3, changefreq: 'yearly' },
  { url: '/copyright/', priority: 0.3, changefreq: 'yearly' },
  { url: '/privacy-policy/', priority: 0.3, changefreq: 'yearly' },
  { url: '/terms/', priority: 0.3, changefreq: 'yearly' },
]

function reviewedDate(value?: string | number | null) {
  if (!value) return SITE_REVIEWED_AT
  const date = typeof value === 'number' ? new Date(value * 1000) : new Date(value)
  return Number.isNaN(date.getTime()) ? SITE_REVIEWED_AT : date
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: SITE_REVIEWED_AT,
    changeFrequency: page.changefreq as any,
    priority: page.priority,
  }))

  // News articles
  newsData.forEach((news) => {
    entries.push({
      url: `${BASE_URL}/news/${news.slug}/`,
      lastModified: reviewedDate(news.published_at),
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  })

  // Guides
  guidesData.forEach((guide) => {
    entries.push({
      url: `${BASE_URL}/guides/${guide.slug}/`,
      lastModified: reviewedDate(guide.updated_at || guide.published_at),
      changeFrequency: 'monthly',
      priority: 0.72,
    })
  })

  // Official info
  officialData.forEach((page) => {
    entries.push({
      url: `${BASE_URL}/official/${page.slug}/`,
      lastModified: reviewedDate(page.updated_at),
      changeFrequency: 'monthly',
      priority: 0.86,
    })
  })

  // Pokemon
  pokemonData.forEach((pokemon) => {
    entries.push({
      url: `${BASE_URL}/wiki/pokemon/${pokemon.id}/`,
      lastModified: reviewedDate(pokemon.updated_at),
      changeFrequency: 'monthly',
      priority: 0.68,
    })
  })

  // Habitats
  habitatsData.forEach((habitat) => {
    entries.push({
      url: `${BASE_URL}/wiki/habitat/${habitat.id}/`,
      lastModified: reviewedDate(habitat.updated_at),
      changeFrequency: 'monthly',
      priority: 0.64,
    })
  })

  // Recipes
  recipesData.forEach((recipe) => {
    entries.push({
      url: `${BASE_URL}/wiki/recipe/${recipe.id}/`,
      lastModified: reviewedDate(recipe.updated_at),
      changeFrequency: 'monthly',
      priority: 0.58,
    })
  })

  return entries
}
