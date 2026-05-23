import type { Metadata } from 'next'
import Link from 'next/link'
import officialData from '@/data/official.json'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Official Pokémon Pokopia Info',
  description: 'Official Pokémon Pokopia release, platform, gameplay, multiplayer, GameShare, and beginner information collected from Nintendo and Pokémon sources.',
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
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <span className="badge announcement">Official Info</span>
        <h1 style={{ marginTop: '1rem' }}>Official Pokémon Pokopia Info</h1>
        <p style={{ color: '#666', marginTop: '0.75rem', fontSize: '1.125rem', lineHeight: 1.7 }}>
          Confirmed release, platform, gameplay, multiplayer, and beginner details from Nintendo and Pokémon sources. These pages are kept separate from editorial guide and wiki pages so readers can tell what is confirmed.
        </p>
      </header>

      <section>
        <div className="guides-grid">
          {officialData.map((page) => (
            <Link key={page.id} href={`/official/${page.slug}`} className="card">
              <span className="badge announcement">{page.category}</span>
              <h2 style={{ fontSize: '1.2rem', marginTop: '1rem' }}>{page.title}</h2>
              <p style={{ color: '#666', marginTop: '0.75rem' }}>{page.summary}</p>
              <p style={{ color: '#999', fontSize: '0.8rem', marginTop: '1rem' }}>Updated {page.updated_at}</p>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '3rem', lineHeight: 1.8 }}>
        <h2>How These Pages Are Used</h2>
        <p style={{ marginTop: '1rem' }}>
          Official info pages should be the reference point for confirmed facts. Strategy guides, Pokémon database entries, habitat routes, and recipe pages can link here when they need official context, then clearly label their own recommendations as editorial analysis.
        </p>
      </section>
    </main>
  )
}
