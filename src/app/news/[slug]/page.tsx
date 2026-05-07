'use client'

import { useEffect, useState } from 'react'

interface NewsItem {
  id: string
  title: string
  slug: string
  category: string
  excerpt: string
  content: string
  published_at: number
}

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const [news, setNews] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string>('')

  useEffect(() => {
    params.then((p) => setSlug(p.slug))
  }, [params])

  useEffect(() => {
    if (!slug) return
    fetch(`/api/news/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setNews(data)
        if (data.title) document.title = `${data.title} | Pokopia Portal`
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) return <p>Loading...</p>
  if (!news) return <p>News not found</p>

  const date = new Date(news.published_at * 1000).toLocaleDateString()

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/news">News</a>
        </nav>
      </header>

      <article style={{ marginTop: '2rem' }}>
        <span className={`badge ${news.category}`}>{news.category}</span>
        <h1 style={{ marginTop: '1rem' }}>{news.title}</h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>{date}</p>
        <p style={{ marginTop: '1rem' }}>{news.excerpt}</p>
        <div style={{ marginTop: '2rem', lineHeight: '1.8' }}>{news.content}</div>
      </article>
    </main>
  )
}
