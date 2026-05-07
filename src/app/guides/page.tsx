'use client'

import { useEffect, useState } from 'react'

interface Guide {
  id: string
  title: string
  slug: string
  category: string
  seo_keyword: string
}

const categoryEmoji: Record<string, string> = {
  'tier': '🏆', 'guides': '📖', 'farming': '🌾', 'team': '⚔️',
}

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/guides.json')
      .then((res) => res.json())
      .then((data) => {
        setGuides(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>📖 Guides</h1>
      <p>Game guides and tutorials</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="guides-grid" style={{ marginTop: '2rem' }}>
          {guides.map((guide) => (
            <a key={guide.id} href={`/guides/${guide.slug}`} className="card">
              <span className="badge">{categoryEmoji[guide.category] || '📖'} {guide.category}</span>
              <h3>{guide.title}</h3>
              <p>{guide.seo_keyword}</p>
            </a>
          ))}
        </div>
      )}
    </main>
  )
}
