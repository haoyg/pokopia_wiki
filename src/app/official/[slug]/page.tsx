import type { Metadata } from 'next'
import Link from 'next/link'
import officialData from '@/data/official.json'
import { canonicalUrl } from '@/lib/site'
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

  return {
    title: page.title,
    description: page.summary,
    openGraph: {
      title: page.title,
      description: page.summary,
      images: ['/og-image.svg'],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.summary,
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
      <main style={{ maxWidth: '850px', margin: '0 auto', padding: '2rem 1rem' }}>
      <article>
        <span className="badge announcement">{page.category}</span>
        <h1 style={{ marginTop: '1rem' }}>{page.title}</h1>
        <p style={{ color: '#666', marginTop: '0.75rem', fontSize: '1.1rem', lineHeight: 1.7 }}>
          {page.summary}
        </p>
        <DataStatus
          status="Official source roundup"
          note="This page summarizes information from Nintendo and Pokémon source pages. Editorial interpretation is separated from the confirmed facts section below."
          updatedAt={updatedAt}
        />

        <section style={{ marginTop: '2.5rem', lineHeight: 1.8 }}>
          <h2>Confirmed Facts</h2>
          <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
            {page.facts.map((fact) => (
              <li key={fact} style={{ marginBottom: '0.75rem' }}>{fact}</li>
            ))}
          </ul>
        </section>

        <section style={{ marginTop: '2.5rem', lineHeight: 1.8 }}>
          <h2>Editorial Notes</h2>
          <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
            {page.analysis.map((note) => (
              <li key={note} style={{ marginBottom: '0.75rem' }}>{note}</li>
            ))}
          </ul>
        </section>

        <section style={{ marginTop: '2.5rem', lineHeight: 1.8 }}>
          <h2>Official Sources</h2>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            {page.sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                rel="nofollow noopener noreferrer"
                target="_blank"
                className="card"
                style={{ display: 'block' }}
              >
                <strong>{source.label}</strong>
                <p style={{ color: '#666', marginTop: '0.4rem' }}>{source.note}</p>
              </a>
            ))}
          </div>
        </section>
      </article>

      <aside style={{ marginTop: '3rem', borderTop: '1px solid #ddd', paddingTop: '2rem' }}>
        <h3>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
          {page.related_links.map((item) => (
            <Link key={item.href} href={item.href} className="card" style={{ padding: '0.75rem 1rem' }}>
              {item.label}
            </Link>
          ))}
          <Link href="/official" className="card" style={{ padding: '0.75rem 1rem' }}>
            All official info
          </Link>
        </div>
      </aside>
      </main>
    </>
  )
}
