import { Metadata } from 'next'
import newsData from '@/data/news.json'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return newsData.map((news) => ({
    slug: news.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const news = newsData.find((n) => n.slug === slug)
  return {
    title: news ? `${news.title} | Pokopia Portal` : 'News Not Found',
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const news = newsData.find((n) => n.slug === slug)

  if (!news) {
    return <p>News not found</p>
  }

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
