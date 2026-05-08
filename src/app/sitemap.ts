import { MetadataRoute } from 'next'

export const dynamic = 'force-static'
import newsData from '@/data/news.json'
import guidesData from '@/data/guides.json'
import pokemonData from '@/data/pokemon.json'
import habitatsData from '@/data/habitats.json'
import recipesData from '@/data/recipes.json'

const BASE_URL = 'https://pokopia.wiki'

const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/news', priority: '0.9', changefreq: 'hourly' },
  { url: '/guides', priority: '0.9', changefreq: 'weekly' },
  { url: '/wiki/pokemon', priority: '0.8', changefreq: 'weekly' },
  { url: '/wiki/habitat', priority: '0.8', changefreq: 'weekly' },
  { url: '/wiki/recipe', priority: '0.7', changefreq: 'weekly' },
  { url: '/features', priority: '0.7', changefreq: 'weekly' },
  { url: '/tools', priority: '0.7', changefreq: 'weekly' },
  { url: '/builds', priority: '0.6', changefreq: 'weekly' },
  { url: '/tier-list', priority: '0.6', changefreq: 'weekly' },
  { url: '/community', priority: '0.5', changefreq: 'monthly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changefreq as any,
    priority: parseFloat(page.priority),
  }))

  // News articles
  newsData.forEach((news) => {
    entries.push({
      url: `${BASE_URL}/news/${news.slug}`,
      lastModified: new Date(news.published_at * 1000),
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  })

  // Guides
  guidesData.forEach((guide) => {
    entries.push({
      url: `${BASE_URL}/guides/${guide.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  })

  // Pokemon
  pokemonData.forEach((pokemon) => {
    entries.push({
      url: `${BASE_URL}/wiki/pokemon/${pokemon.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  })

  // Habitats
  habitatsData.forEach((habitat) => {
    entries.push({
      url: `${BASE_URL}/wiki/habitat/${habitat.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  })

  // Recipes
  recipesData.forEach((recipe) => {
    entries.push({
      url: `${BASE_URL}/wiki/recipe/${recipe.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    })
  })

  return entries
}
