import { Metadata } from 'next'
import guidesData from '@/data/guides.json'

const categoryEmoji: Record<string, string> = {
  'tier': '🏆', 'guides': '📖', 'farming': '🌾', 'team': '⚔️',
}

export const metadata: Metadata = {
  title: 'Game Guides & Tutorials | Pokopia Portal',
  description: 'Master Pokopia with our comprehensive game guides. Tier lists, farming tips, team builds, and strategy guides for all players.',
  openGraph: {
    title: 'Game Guides | Pokopia Portal',
    description: 'Master Pokopia with our comprehensive game guides. Tier lists, farming tips, team builds, and strategy guides.',
    images: ['/og-image.svg'],
  },
}

export default function GuidesPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>📖 Guides</h1>
      <p>Game guides and tutorials</p>

      <div className="guides-grid" style={{ marginTop: '2rem' }}>
        {guidesData.map((guide) => (
          <a key={guide.id} href={`/guides/${guide.slug}`} className="card">
            <span className="badge">{categoryEmoji[guide.category] || '📖'} {guide.category}</span>
            <h3>{guide.title}</h3>
            <p>{guide.seo_keyword}</p>
          </a>
        ))}
      </div>
    </main>
  )
}