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
      <main>
        <article className="news-detail-page">
          <div className="news-detail-hero">
            <div className="news-hero-copy">
              <div className="index-card-badges">
                <span className={`badge ${news.category}`}>{categoryLabels[news.category] || news.category}</span>
              </div>
              <h1>{news.title}</h1>
              <p>{news.excerpt}</p>
              <div className="guide-meta-row">
                <span>{date}</span>
                <span>{news.verified_status}</span>
                <span>{news.source_type || 'Source-backed'}</span>
              </div>
            </div>
            <CreditedImage src={news.image_url} alt={news.image_alt} source={news.image_source} sourceUrl={news.image_source_url} licenseNote={news.image_license_note} originalMedia={news.image_original_media} className="news-detail-cover" sizes="(max-width: 768px) 100vw, 420px" priority />
          </div>

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

          <section className="news-summary-panel">
            <span className="panel-kicker">What Changed</span>
            <p>{news.excerpt}</p>
          </section>

          <section className="news-content-section">
            <h2>Source Update</h2>
            {contentParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        </article>

        <aside className="news-follow-panel">
          <div>
            <span className="panel-kicker">More News</span>
            <h2>Recent Source Updates</h2>
          </div>
          <ul>
            {relatedNews.map((n) => (
              <li key={n.id}>
                <a href={`/news/${n.slug}`}>{n.title}</a>
              </li>
            ))}
          </ul>

          <div>
            <span className="panel-kicker">Next Reads</span>
            <h2>Related Guides</h2>
          </div>
          <ul>
            {relatedGuides.map((g) => (
              <li key={g.id}>
                <a href={`/guides/${g.slug}`}>{g.title}</a>
              </li>
            ))}
          </ul>
        </aside>
      </main>
    </>
  )
}
