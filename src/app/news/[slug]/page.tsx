import { Metadata } from 'next'
import newsData from '@/data/news.json'
import guidesData from '@/data/guides.json'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { canonicalUrl } from '@/lib/site'
import { cleanDescription, cleanTitle } from '@/lib/seoText'
import { CreditedImage } from '@/components/media/CreditedImage'
import { DataStatus } from '@/components/content/DataStatus'

const categoryLabels: Record<string, string> = {
  official: 'Official',
  trailer: 'Trailer',
  'source-roundup': 'Source Roundup',
  'site-update': 'Site Update',
}

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
  const title = cleanTitle(news.title)
  const description = cleanDescription(news.excerpt)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: news.image_source ? [news.image_url] : ['/og-image.svg'],
      type: 'article',
      publishedTime: new Date(news.published_at * 1000).toISOString(),
      authors: ['Pokopia Portal'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: news.image_source ? [news.image_url] : ['/og-image.svg'],
    },
    alternates: {
      canonical: canonicalUrl(`/news/${news.slug}`),
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
  const contentParagraphs = news.content.split('\n\n').filter(Boolean)
  const isExternalSource = news.source_url?.startsWith('http')

  return (
    <>
      <ArticleJsonLd
        title={news.title}
        description={news.excerpt}
        url={`/news/${news.slug}`}
        publishedAt={new Date(news.published_at * 1000).toISOString()}
        image={news.image_source ? news.image_url : undefined}
        type="NewsArticle"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'News', url: '/news' },
          { name: news.title, url: `/news/${news.slug}` },
        ]}
      />
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <article>
          <span className={`badge ${news.category}`}>{categoryLabels[news.category] || news.category}</span>
          <h1 style={{ marginTop: '1rem' }}>{news.title}</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>{date}</p>
          <DataStatus
            status={news.verified_status}
            note="This article is a source-based roundup or site update. It is not a patch note, live event announcement, or balance update unless the linked official source says so."
            updatedAt={date}
          />
          {news.source_label && news.source_url && (
            <aside className="data-status" aria-label="News source">
              <div>
                <span className="data-status-label">Primary Source</span>
                <strong>{news.source_type || 'Source'}</strong>
              </div>
              <p>
                <a
                  href={news.source_url}
                  rel={isExternalSource ? 'nofollow noopener noreferrer' : undefined}
                  target={isExternalSource ? '_blank' : undefined}
                >
                  {news.source_label}
                </a>
              </p>
            </aside>
          )}
          <CreditedImage src={news.image_url} alt={news.image_alt} source={news.image_source} sourceUrl={news.image_source_url} licenseNote={news.image_license_note} className="article-cover" sizes="(max-width: 768px) 100vw, 800px" priority />
          <p style={{ marginTop: '1rem' }}>{news.excerpt}</p>
          <div style={{ marginTop: '2rem', lineHeight: '1.8' }}>
            {contentParagraphs.map((paragraph) => (
              <p key={paragraph} style={{ marginTop: '1rem' }}>{paragraph}</p>
            ))}
          </div>
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
