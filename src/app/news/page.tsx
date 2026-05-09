import { Metadata } from 'next'
import newsData from '@/data/news.json'

const categoryEmoji: Record<string, string> = {
  'update': '🆕', 'patch': '🔧', 'event': '🎉', 'announcement': '📢',
}

export const metadata: Metadata = {
  title: 'Latest News & Updates | Pokopia Portal',
  description: 'Stay updated with the latest Pokopia news, patch notes, events, and announcements.',
  openGraph: {
    title: 'News & Updates | Pokopia Portal',
    description: 'Stay updated with the latest Pokopia news, patch notes, events, and announcements.',
    images: ['/og-image.svg'],
  },
}

export default function NewsPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>📰 Latest News</h1>
      <p>Updates, patch notes, and announcements</p>

      <div className="news-grid" style={{ marginTop: '2rem' }}>
        {newsData.map((item) => (
          <a key={item.id} href={`/news/${item.slug}`} className="card">
            <span className={`badge ${item.category}`}>{categoryEmoji[item.category] || '📰'} {item.category}</span>
            <h3>{item.title}</h3>
            <p>{item.excerpt}</p>
            <p style={{ color: '#999', fontSize: '0.75rem', marginTop: '0.5rem' }}>
              {new Date(item.published_at * 1000).toLocaleDateString()}
            </p>
          </a>
        ))}
      </div>
    </main>
  )
}