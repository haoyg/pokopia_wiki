import type { Metadata } from 'next'
import Link from 'next/link'
import officialData from '@/data/official.json'
import { canonicalUrl } from '@/lib/site'
import { cleanDescription, cleanTitle } from '@/lib/seoText'
import { DataStatus } from '@/components/content/DataStatus'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'

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
  const title = cleanTitle(page.title)
  const description = cleanDescription(page.summary)

  return {
    title,
    description,
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

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Official Info', url: '/official' },
          { name: page.title, url: `/official/${page.slug}` },
        ]}
      />
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
