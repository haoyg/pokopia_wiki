import type { Metadata } from 'next'
import Link from 'next/link'
import officialData from '@/data/official.json'
import { canonicalUrl } from '@/lib/site'
import { cleanDescription, cleanTitle } from '@/lib/seoText'
import { DataStatus } from '@/components/content/DataStatus'
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/JsonLd'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return officialData.map((page) => ({
    slug: page.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = officialData.find((item) => item.slug === slug)

  if (!page) return { title: 'Official Info Not Found' }
  const title = cleanTitle(page.seo_title || page.title)
  const description = cleanDescription(page.seo_description || page.summary)

  return {
    title,
    description,
    keywords: page.slug === 'multiplayer-gameshare-cloud-island'
      ? [
          'Pokemon Pokopia multiplayer',
          'Pokemon Pokopia local multiplayer',
          'Pokemon Pokopia GameShare',
          'Pokemon Pokopia co-op',
          'Pokemon Pokopia Palette Town',
          'Pokemon Pokopia Cloud Island',
        ]
      : undefined,
    openGraph: {
      title,
      description,
      images: ['/og-image.svg'],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.svg'],
    },
    alternates: {
      canonical: canonicalUrl(`/official/${page.slug}`),
    },
  }
}

export default async function OfficialInfoDetailPage({ params }: Props) {
  const { slug } = await params
  const page = officialData.find((item) => item.slug === slug)

  if (!page) {
    return <p>Official info page not found</p>
  }

  const updatedAt = new Date(page.updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const faqs = page.faqs || []
  const modeComparison = page.mode_comparison || []

  return (
    <>
      <ArticleJsonLd
        title={page.title}
        description={page.seo_description || page.summary}
        url={`/official/${page.slug}`}
        publishedAt={new Date(page.updated_at).toISOString()}
        modifiedAt={new Date(page.updated_at).toISOString()}
        type="Article"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Official Info', url: '/official' },
          { name: page.title, url: `/official/${page.slug}` },
        ]}
      />
      {faqs.length > 0 && <FAQJsonLd title={page.title} faqs={faqs} />}
      <main>
      <article className="official-detail-page">
        <div className="official-detail-hero">
          <div>
            <div className="index-card-badges">
              <span className="badge announcement">{page.category}</span>
            </div>
            <h1>{page.title}</h1>
            <p>{page.summary}</p>
            <div className="guide-meta-row">
              <span>{page.facts.length} confirmed facts</span>
              <span>{page.sources.length} official sources</span>
              <span>Updated {updatedAt}</span>
            </div>
          </div>
        </div>
        <DataStatus
          status="Official source roundup"
          note="This page summarizes information from Nintendo and Pokémon source pages. Editorial interpretation is separated from the confirmed facts section below."
          updatedAt={updatedAt}
        />

        {page.quick_answer && (
          <section className="official-quick-answer">
            <span className="panel-kicker">Quick Answer</span>
            <h2>Is Pokémon Pokopia Multiplayer?</h2>
            <p>{page.quick_answer}</p>
          </section>
        )}

        {modeComparison.length > 0 && (
          <section className="official-mode-section">
            <span className="panel-kicker">Mode Comparison</span>
            <h2>Online, Local Wireless, GameShare, and Shared Building</h2>
            <div className="official-mode-grid">
              {modeComparison.map((mode) => (
                <article key={mode.mode} className="official-mode-card">
                  <h3>{mode.mode}</h3>
                  <dl>
                    <div><dt>Connection</dt><dd>{mode.connection}</dd></div>
                    <div><dt>Players</dt><dd>{mode.players}</dd></div>
                    <div><dt>Editing</dt><dd>{mode.editing}</dd></div>
                    <div><dt>Best For</dt><dd>{mode.best_for}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="official-facts-section">
          <h2>Confirmed Facts</h2>
          <ol>
            {page.facts.map((fact, index) => (
              <li key={fact}>
                <span>{index + 1}</span>
                <p>{fact}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="official-notes-section">
          <h2>Editorial Notes</h2>
          <ul>
            {page.analysis.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>

        {faqs.length > 0 && (
          <section className="official-faq-section">
            <span className="panel-kicker">Common Questions</span>
            <h2>Pokémon Pokopia Multiplayer FAQ</h2>
            <div>
              {faqs.map((faq) => (
                <article key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="official-sources-section">
          <h2>Official Sources</h2>
          <div>
            {page.sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                rel="nofollow noopener noreferrer"
                target="_blank"
                className="card"
              >
                <strong>{source.label}</strong>
                <p>{source.note}</p>
              </a>
            ))}
          </div>
        </section>
      </article>

      <aside className="official-related-panel">
        <div>
          <span className="panel-kicker">Related Pages</span>
          <h2>Use These For Context</h2>
        </div>
        <div>
          {page.related_links.map((item) => (
            <Link key={item.href} href={item.href} className="card">
              {item.label}
            </Link>
          ))}
          <Link href="/official" className="card">
            All official info
          </Link>
        </div>
      </aside>
      </main>
    </>
  )
}
