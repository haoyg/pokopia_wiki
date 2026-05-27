import { Metadata } from 'next'
import newsData from '@/data/news.json'
import { canonicalUrl } from '@/lib/site'
import { CreditedImage } from '@/components/media/CreditedImage'
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'

const categoryLabels: Record<string, string> = {
  official: 'Official',
  trailer: 'Trailer',
  'source-roundup': 'Source Roundup',
  'site-update': 'Site Update',
}

export const metadata: Metadata = {
  title: 'Official News & Source Updates',
  description: 'Official Pokémon Pokopia source roundups, trailer notes, Nintendo updates, and Pokopia Portal site transparency updates.',
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
          <div>
            {Object.entries(sourceCounts).map(([source, count]) => (
              <span key={source}>{source}: {count}</span>
            ))}
          </div>
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
