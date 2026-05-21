import { Metadata } from 'next'
import Image from 'next/image'
import newsData from '@/data/news.json'
import guidesData from '@/data/guides.json'
import { ArticleJsonLd } from '@/components/seo/JsonLd'

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
  if (!news) return { title: 'News Not Found' }

  return {
    title: `${news.title} | Pokopia Portal`,
    description: news.excerpt,
    openGraph: {
      title: news.title,
      description: news.excerpt,
      images: [news.image_url],
      type: 'article',
      publishedTime: new Date(news.published_at * 1000).toISOString(),
      authors: ['Pokopia Portal'],
    },
    twitter: {
      card: 'summary_large_image',
      title: news.title,
      description: news.excerpt,
    },
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const news = newsData.find((n) => n.slug === slug)

  if (!news) {
    return <p>News not found</p>
  }

  const date = new Date(news.published_at * 1000).toLocaleDateString()
  const relatedNews = newsData.filter((n) => n.id !== news.id).slice(0, 3)
  const relatedGuides = guidesData.slice(0, 3)

  return (
    <>
      <ArticleJsonLd
        title={news.title}
        description={news.excerpt}
        url={`/news/${news.slug}`}
        publishedAt={new Date(news.published_at * 1000).toISOString()}
        type="NewsArticle"
      />
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <article>
          <span className={`badge ${news.category}`}>{news.category}</span>
          <h1 style={{ marginTop: '1rem' }}>{news.title}</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>{date}</p>
          <div className="article-cover">
            <Image src={news.image_url} alt={news.image_alt} fill sizes="(max-width: 768px) 100vw, 800px" priority />
          </div>
          <p style={{ marginTop: '1rem' }}>{news.excerpt}</p>
          <div style={{ marginTop: '2rem', lineHeight: '1.8' }}>{news.content}</div>
        </article>

        <aside style={{ marginTop: '3rem', borderTop: '1px solid #ddd', paddingTop: '2rem' }}>
          <h3>More News</h3>
          <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
            {relatedNews.map((n) => (
              <li key={n.id} style={{ marginBottom: '0.5rem' }}>
                <a href={`/news/${n.slug}`}>{n.title}</a>
              </li>
            ))}
          </ul>

          <h3 style={{ marginTop: '2rem' }}>Related Guides</h3>
          <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
            {relatedGuides.map((g) => (
              <li key={g.id} style={{ marginBottom: '0.5rem' }}>
                <a href={`/guides/${g.slug}`}>{g.title}</a>
              </li>
            ))}
          </ul>
        </aside>
      </main>
    </>
  )
}
