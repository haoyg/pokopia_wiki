import { MetadataRoute } from 'next'

export const dynamic = 'force-static'
import newsData from '@/data/news.json'
import guidesData from '@/data/guides.json'
import officialData from '@/data/official.json'
import { BASE_URL } from '@/lib/site'
import { isEditorialContent } from '@/lib/indexing'

const SITE_REVIEWED_AT = new Date('2026-05-23')
const REDIRECTED_NEWS_SLUGS = new Set([
  'pokemon-pokopia-multiplayer-gameshare-details',
  'pokemon-pokopia-switch-2-online-local-gameshare',
])

const staticPages = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/official/', priority: 0.9, changefreq: 'weekly' },
  { url: '/news/', priority: 0.85, changefreq: 'weekly' },
  { url: '/news/weekly-event-tracker/', priority: 0.76, changefreq: 'weekly' },
  { url: '/features/', priority: 0.65, changefreq: 'monthly' },
  { url: '/tools/', priority: 0.65, changefreq: 'monthly' },
  { url: '/tools/habitat-planner/', priority: 0.66, changefreq: 'monthly' },
  { url: '/tools/recipe-calculator/', priority: 0.66, changefreq: 'monthly' },
  { url: '/tools/team-builder/', priority: 0.62, changefreq: 'monthly' },
  { url: '/tools/spawn-tracker/', priority: 0.62, changefreq: 'monthly' },
  { url: '/features/pokopia-animal-crossing/', priority: 0.72, changefreq: 'monthly' },
  { url: '/features/friendship-requests-tracker/', priority: 0.7, changefreq: 'monthly' },
  { url: '/features/creative-play-ideas/', priority: 0.68, changefreq: 'monthly' },
  { url: '/features/meta-analysis/', priority: 0.7, changefreq: 'monthly' },
  { url: '/builds/home-design-ideas/', priority: 0.66, changefreq: 'monthly' },
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
  const entries: MetadataRoute.Sitemap = []
  const seenUrls = new Set<string>()

  function addEntry(entry: MetadataRoute.Sitemap[number]) {
    if (seenUrls.has(entry.url)) return
    seenUrls.add(entry.url)
    entries.push(entry)
  }

  staticPages.forEach((page) => {
    addEntry({
      url: `${BASE_URL}${page.url}`,
      lastModified: SITE_REVIEWED_AT,
      changeFrequency: page.changefreq as any,
      priority: page.priority,
    })
  })

  // News articles
  newsData.filter((news) => !REDIRECTED_NEWS_SLUGS.has(news.slug)).forEach((news) => {
    addEntry({
      url: `${BASE_URL}/news/${news.slug}/`,
      lastModified: reviewedDate(news.published_at),
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  })

  // Guides
  guidesData.filter((guide) => !isEditorialContent(guide.data_status)).forEach((guide) => {
    addEntry({
      url: `${BASE_URL}/guides/${guide.slug}/`,
      lastModified: reviewedDate(guide.updated_at || guide.published_at),
      changeFrequency: 'monthly',
      priority: 0.72,
    })
  })

  // Official info
  officialData.forEach((page) => {
    addEntry({
      url: `${BASE_URL}/official/${page.slug}/`,
      lastModified: reviewedDate(page.updated_at),
      changeFrequency: 'monthly',
      priority: 0.86,
    })
  })

  return entries
}
