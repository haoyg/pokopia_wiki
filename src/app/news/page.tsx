import { Metadata } from 'next'
import newsData from '@/data/news.json'
import { canonicalUrl } from '@/lib/site'
import { CreditedImage } from '@/components/media/CreditedImage'

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
    title: 'Official News & Source Updates | Pokopia Portal',
    description: 'Source-based Pokémon Pokopia news tracking and official information roundups.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/news'),
  },
}

export default function NewsPage() {
  return (
    <main className="page-shell">
      <section className="page-hero">
        <h1>News & Source Updates</h1>
        <p>Official source roundups, trailer notes, and site transparency updates</p>
      </section>

      <div className="news-grid">
        {newsData.map((item) => (
          <a key={item.id} href={`/news/${item.slug}`} className="card">
            <CreditedImage src={item.image_url} alt={item.image_alt} source={item.image_source} sourceUrl={item.image_source_url} />
            <span className={`badge ${item.category}`}>{categoryLabels[item.category] || item.category}</span>
            <h3>{item.title}</h3>
            <p>{item.excerpt}</p>
            {item.verified_status && (
              <p style={{ color: '#637083', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 700 }}>
                {item.verified_status}
              </p>
            )}
            {item.source_label && (
              <p style={{ color: '#777', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                Source: {item.source_label}
              </p>
            )}
            <p style={{ color: '#999', fontSize: '0.75rem', marginTop: '0.5rem' }}>
              {new Date(item.published_at * 1000).toLocaleDateString()}
            </p>
          </a>
        ))}
      </div>
    </main>
  )
}
