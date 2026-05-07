'use client'

import { useEffect, useState } from 'react'

interface NewsItem {
  id: string
  title: string
  slug: string
  category: string
  excerpt: string
  published_at: number
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/news')
      .then((res) => res.json())
      .then((data) => {
        setNews(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Latest News</h1>
      <p>Updates, patch notes, and announcements</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="news-grid" style={{ marginTop: '2rem' }}>
          {news.map((item) => (
            <a key={item.id} href={`/news/${item.slug}`} className="card">
              <span className={`badge ${item.category}`}>{item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
            </a>
          ))}
        </div>
      )}
    </main>
  )
}
