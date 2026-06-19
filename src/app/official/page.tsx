import type { Metadata } from 'next'
import Link from 'next/link'
import officialData from '@/data/official.json'
import { canonicalUrl } from '@/lib/site'
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Official Pokémon Pokopia Info',
  description: 'Official Pokémon Pokopia release, platform, gameplay, multiplayer, GameShare, and beginner information collected from Nintendo and Pokémon sources.',
  keywords: [
    'official Pokopia information',
    'Pokopia release date',
    'Pokopia platform',
    'Pokopia gameplay',
    'Pokopia multiplayer',
    'Pokopia GameShare',
    'Pokopia official news',
    'Nintendo Pokopia',
  ],
  openGraph: {
    title: 'Official Pokémon Pokopia Info',
    description: 'Verified official information for Pokémon Pokopia from Nintendo and Pokémon sources.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/official'),
  },
}

export default function OfficialInfoPage() {
  return (
    <main className="page-shell">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Official Info', url: '/official' },
        ]}
      />
      <ItemListJsonLd
        name="Official Pokémon Pokopia Info"
        description="Confirmed Pokémon Pokopia release, gameplay, multiplayer, and beginner information from Nintendo and Pokémon sources."
        url="/official"
        items={officialData.map((page) => ({
          name: page.title,
          url: `/official/${page.slug}`,
        }))}
      />
      <section className="page-hero official-info-hero">
        <span className="badge announcement">Official Info</span>
        <h1>Official Pokémon Pokopia Info</h1>
        <p>Confirmed release, platform, gameplay, multiplayer, and beginner details from Nintendo and Pokémon sources. These pages stay separate from editorial guide and wiki pages so readers can tell what is confirmed.</p>
      </section>

      <section className="official-index-panel">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Verified Baseline</span>
            <h2>Start With Source-Backed Facts</h2>
          </div>
          <Link href="/news">Open news updates</Link>
        </div>
        <div className="guides-grid">
          {officialData.map((page) => (
            <Link key={page.id} href={`/official/${page.slug}`} className="card">
              <span className="badge announcement">{page.category}</span>
              <h3>{page.title}</h3>
              <p className="index-card-summary">{page.summary}</p>
              <dl className="index-card-facts">
                <div>
                  <dt>Facts</dt>
                  <dd>{page.facts.length} confirmed notes</dd>
                </div>
                <div>
                  <dt>Sources</dt>
                  <dd>{page.sources.map((source) => source.label).join(', ')}</dd>
                </div>
                <div>
                  <dt>Updated</dt>
                  <dd>{page.updated_at}</dd>
                </div>
              </dl>
            </Link>
          ))}
        </div>
      </section>

      <section className="official-usage-panel">
        <h2>How These Pages Are Used</h2>
        <p>Official info pages are the reference point for confirmed facts. Strategy guides, Pokémon database entries, habitat routes, and recipe pages can link here when they need official context, then clearly label their own recommendations as editorial analysis.</p>
      </section>
    </main>
  )
}
