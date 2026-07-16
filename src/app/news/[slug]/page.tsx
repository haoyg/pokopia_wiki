import { Metadata } from 'next'
import newsData from '@/data/news.json'
import guidesData from '@/data/guides.json'
import pokemonData from '@/data/pokemon.json'
import habitatsData from '@/data/habitats.json'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { canonicalUrl } from '@/lib/site'
import { cleanDescription, cleanTitle } from '@/lib/seoText'
import { CreditedImage } from '@/components/media/CreditedImage'
import { DataStatus } from '@/components/content/DataStatus'

const categoryLabels: Record<string, string> = {
  official: 'Official',
  event: 'Event',
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
  const title = cleanTitle(news.seo_title || news.title)
  const description = cleanDescription(news.seo_description || news.excerpt)

  return {
    title,
    description,
    keywords: (
      [
        news.category === 'official' ? 'official Pokopia news' : null,
        news.category === 'event' ? 'Pokopia event' : null,
        news.category === 'trailer' ? 'Pokopia trailer' : null,
        news.category === 'source-roundup' ? 'Pokopia source roundup' : null,
        'Pokopia news',
        'Pokopia update',
      ].filter(Boolean) as string[]
    ),
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
  const guideSlugs = (news.related_guides || '').split(',').filter(Boolean)
  const relatedGuides = guidesData.filter((g) => guideSlugs.includes(g.slug))

  const pokemonIds = (news.related_pokemon || '').split(',').filter(Boolean)
  const relatedPokemon = pokemonData.filter((p) => pokemonIds.includes(p.id))

  const habitatIds = (news.related_habitats || '').split(',').filter(Boolean)
  const relatedHabitats = habitatsData.filter((h) => habitatIds.includes(h.id))

  const relatedNews = newsData.filter((n) => n.id !== news.id).slice(0, 3)
  const contentParagraphs = news.content.split('\n\n').filter(Boolean)
  const isExternalSource = news.source_url?.startsWith('http')
  const enrichedNews = news as typeof news & {
    confirmed_facts?: string[]
    reader_takeaways?: string[]
    data_status_note?: string
    updated_at?: string
    source_review_notes?: string[]
    claim_limits?: string[]
    recheck_triggers?: string[]
  }
  const reviewedDate = enrichedNews.updated_at
    ? new Date(enrichedNews.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : date

  return (
    <>
      <ArticleJsonLd
        title={news.title}
        description={news.excerpt}
        url={`/news/${news.slug}`}
        publishedAt={new Date(news.published_at * 1000).toISOString()}
        modifiedAt={enrichedNews.updated_at ? new Date(enrichedNews.updated_at).toISOString() : new Date(news.published_at * 1000).toISOString()}
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
            note={enrichedNews.data_status_note || 'This article is a source-based roundup or site update. It is not a patch note, live event announcement, or balance update unless the linked official source says so.'}
            updatedAt={reviewedDate}
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

          {enrichedNews.confirmed_facts?.length ? (
            <section className="news-content-section news-confirmed-facts">
              <span className="panel-kicker">Official Baseline</span>
              <h2>Confirmed Facts</h2>
              <ol>
                {enrichedNews.confirmed_facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ol>
            </section>
          ) : null}

          {enrichedNews.reader_takeaways?.length ? (
            <section className="news-content-section news-reader-takeaways">
              <span className="panel-kicker">Reader Context</span>
              <h2>What This Means</h2>
              <ul>
                {enrichedNews.reader_takeaways.map((takeaway) => (
                  <li key={takeaway}>{takeaway}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {(enrichedNews.source_review_notes?.length || enrichedNews.claim_limits?.length || enrichedNews.recheck_triggers?.length) && (
            <section className="news-content-section">
              <h2>Source Review Notes</h2>
              {enrichedNews.source_review_notes?.length ? (
                <>
                  <h3>Source basis</h3>
                  <ul>
                    {enrichedNews.source_review_notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              {enrichedNews.claim_limits?.length ? (
                <>
                  <h3>Claim limits</h3>
                  <ul>
                    {enrichedNews.claim_limits.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              {enrichedNews.recheck_triggers?.length ? (
                <>
                  <h3>Recheck when</h3>
                  <ul>
                    {enrichedNews.recheck_triggers.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>
          )}

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

          {relatedGuides.length > 0 && (
            <div>
              <span className="panel-kicker">Route Planning</span>
              <h2>Related Guides</h2>
            </div>
          )}
          <ul>
            {relatedGuides.map((g) => (
              <li key={g.id}>
                <a href={`/guides/${g.slug}`}>{g.title}</a>
              </li>
            ))}
          </ul>

          {relatedPokemon.length > 0 && (
            <div>
              <span className="panel-kicker">Field Notes</span>
              <h2>Related Pokemon</h2>
            </div>
          )}
          <ul>
            {relatedPokemon.map((p) => (
              <li key={p.id}>
                <a href={`/wiki/pokemon/${p.id}`}>{p.name}</a>
              </li>
            ))}
          </ul>

          {relatedHabitats.length > 0 && (
            <div>
              <span className="panel-kicker">Route Planning</span>
              <h2>Related Habitats</h2>
            </div>
          )}
          <ul>
            {relatedHabitats.map((h) => (
              <li key={h.id}>
                <a href={`/wiki/habitat/${h.id}`}>{h.name}</a>
              </li>
            ))}
          </ul>
        </aside>
      </main>
    </>
  )
}
