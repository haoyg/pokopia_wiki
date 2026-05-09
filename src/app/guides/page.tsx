import guidesData from '@/data/guides.json'

const categoryEmoji: Record<string, string> = {
  'tier': '🏆', 'guides': '📖', 'farming': '🌾', 'team': '⚔️',
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