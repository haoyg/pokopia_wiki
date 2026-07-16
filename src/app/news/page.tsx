import { Metadata } from 'next'
import newsData from '@/data/news.json'
import { canonicalUrl } from '@/lib/site'
import { CreditedImage } from '@/components/media/CreditedImage'
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'

const categoryLabels: Record<string, string> = {
  official: 'Official',
  event: 'Event',
  trailer: 'Trailer',
  'source-roundup': 'Source Roundup',
  'site-update': 'Site Update',
}

const newsReadingPaths = [
  {
    title: 'Official confirmation first',
    text: 'Use these pages when you need confirmed release, platform, gameplay, or feature details before reading editorial advice.',
    slugs: [
      'pokemon-pokopia-release-date-platform',
      'pokemon-pokopia-gameplay-overview-confirmed-features',
      'pokemon-pokopia-multiplayer-gameshare-details',
    ],
  },
  {
    title: 'Feature and system context',
    text: 'Read these when a guide mentions requests, moves, Cloud Island, multiplayer, or other confirmed systems.',
    slugs: [
      'pokemon-pokopia-confirmed-moves-leafage-surf-glide',
      'pokemon-pokopia-pc-requests-daily-challenges',
      'pokemon-pokopia-cloud-island-palette-town-explained',
    ],
  },
  {
    title: 'Events and update watch',
    text: 'Use these pages for time-sensitive updates, then recheck source labels before treating details as current.',
    slugs: [
      'pokopia-dive-update-how-to-unlock-dive',
      'pokemon-pokopia-wish-upon-a-jirachi-event',
      'pokopia-expansion-pass-bubbly-basin-bonuses',
    ],
  },
  {
    title: 'Site transparency',
    text: 'Check these when you want to understand how Pokopia Portal separates official facts from editorial planning notes.',
    slugs: [
      'pokopia-portal-official-editorial-labels',
    ],
  },
]

export const metadata: Metadata = {
  title: 'Official News & Source Updates',
  description: 'Official Pokémon Pokopia source roundups, trailer notes, Nintendo updates, and Pokopia Portal site transparency updates.',
  keywords: [
    'Pokopia news',
    'Pokopia update',
    'Pokopia official news',
    'Pokopia Nintendo',
    'Pokopia source roundup',
    'Pokopia trailer',
    'Pokopia patch notes',
    'Pokopia release news',
  ],
  openGraph: {
    title: 'Official News & Source Updates',
    description: 'Source-based Pokémon Pokopia news tracking and official information roundups.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/news'),
  },
}

export default function NewsPage() {
  const leadNews = newsData[0]
  const findNews = (slug: string) => newsData.find((item) => item.slug === slug)
  const sourceCounts = newsData.reduce<Record<string, number>>((counts, item) => {
    counts[item.source_type] = (counts[item.source_type] || 0) + 1
    return counts
  }, {})

  return (
    <main className="page-shell">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'News', url: '/news' },
        ]}
      />
      <ItemListJsonLd
        name="Pokopia News and Source Updates"
        description="Official source roundups, trailer notes, and transparent site updates for Pokémon Pokopia."
        url="/news"
        items={newsData.map((item) => ({
          name: item.title,
          url: `/news/${item.slug}`,
        }))}
      />
      <section className="page-hero">
        <h1>News & Source Updates</h1>
        <p>Official source roundups, trailer notes, and site transparency updates</p>
      </section>

      <section className="news-lead-panel">
        <a href={`/news/${leadNews.slug}`} className="news-lead-card">
          <CreditedImage src={leadNews.image_url} alt={leadNews.image_alt} source={leadNews.image_source} sourceUrl={leadNews.image_source_url} licenseNote={leadNews.image_license_note} originalMedia={leadNews.image_original_media} className="news-lead-image" priority />
          <div>
            <span className={`badge ${leadNews.category}`}>{categoryLabels[leadNews.category] || leadNews.category}</span>
            <h2>{leadNews.title}</h2>
            <p>{leadNews.excerpt}</p>
            <dl className="source-facts">
              <div>
                <dt>Status</dt>
                <dd>{leadNews.verified_status}</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>{leadNews.source_label}</dd>
              </div>
              <div>
                <dt>Published</dt>
                <dd>{new Date(leadNews.published_at * 1000).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
        </a>
        <div className="news-source-panel">
          <span className="panel-kicker">Source Mix</span>
          <h2>Track Confirmed Updates First</h2>
          <p>News pages prioritize official or source-backed updates. Editorial context is separated from confirmed facts so readers can verify the baseline.</p>
          <a className="panel-link" href="/news/weekly-event-tracker">Open weekly event tracker</a>
          <div>
            {Object.entries(sourceCounts).map(([source, count]) => (
              <span key={source}>{source}: {count}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="index-guide-panel">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">News Reading Paths</span>
            <h2>Start With the Right Source Track</h2>
          </div>
          <a href="/official">Open official info</a>
        </div>
        <div className="index-guide-grid">
          {newsReadingPaths.map((path) => (
            <div key={path.title} className="index-guide-card">
              <strong>{path.title}</strong>
              <p>{path.text}</p>
              <div>
                {path.slugs.map((slug) => {
                  const item = findNews(slug)
                  if (!item) return null
                  return (
                    <a key={slug} href={`/news/${item.slug}`}>
                      {item.title}
                    </a>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="news-grid">
        {newsData.slice(1).map((item) => (
          <a key={item.id} href={`/news/${item.slug}`} className="card">
            <CreditedImage src={item.image_url} alt={item.image_alt} source={item.image_source} sourceUrl={item.image_source_url} licenseNote={item.image_license_note} originalMedia={item.image_original_media} />
            <span className={`badge ${item.category}`}>{categoryLabels[item.category] || item.category}</span>
            <h3>{item.title}</h3>
            <p>{item.excerpt}</p>
            {item.verified_status && (
              <p className="news-card-status">
                {item.verified_status}
              </p>
            )}
            {item.source_label && (
              <p className="news-card-source">
                Source: {item.source_label}
              </p>
            )}
            <p className="news-card-date">
              {new Date(item.published_at * 1000).toLocaleDateString()}
            </p>
          </a>
        ))}
      </div>
    </main>
  )
}
