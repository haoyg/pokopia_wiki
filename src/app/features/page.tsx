import { Metadata } from 'next'
import Link from 'next/link'
import guidesData from '@/data/guides.json'
import { canonicalUrl } from '@/lib/site'
import { OfficialContext } from '@/components/content/OfficialContext'

const featuredGuides = guidesData.filter((g) => ['tier', 'guides'].includes(g.category)).slice(0, 6)

const featuredTopics = [
  {
    href: '/features/meta-analysis',
    title: 'Pokémon Pokopia Confirmed Systems Analysis',
    excerpt: 'An editorial breakdown of officially confirmed systems: Ditto, Pokémon moves, crafting, habitats, food, multiplayer, and daily routines.',
    category: 'Official Context',
    readTime: '7 min',
  },
  {
    href: '/official/gameplay-overview',
    title: 'Official Gameplay Overview',
    excerpt: 'Confirmed gameplay details from Nintendo and Pokémon sources, separated from editorial route advice.',
    category: 'Official',
    readTime: '5 min',
  },
  {
    href: '/official/multiplayer-gameshare-cloud-island',
    title: 'Multiplayer, GameShare, and Cloud Island',
    excerpt: 'Official multiplayer rules and terminology, including Spectator Mode, Palette Town, Cloud Island, and Virtual Mode.',
    category: 'Official',
    readTime: '5 min',
  },
  {
    href: '/official/official-beginner-tips',
    title: 'Official Beginner Tips',
    excerpt: 'Nintendo-sourced beginner notes for PC features, requests, storage, Pokédex filters, and food-powered moves.',
    category: 'Official',
    readTime: '6 min',
  },
]

export const metadata: Metadata = {
  title: 'Features & Official Context',
  description: 'Official-context features and editorial explainers for Pokémon Pokopia systems, gameplay, multiplayer, and beginner planning.',
  openGraph: {
    title: 'Features & Official Context | Pokopia Portal',
    description: 'Source-aware features and editorial explainers for Pokémon Pokopia.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/features'),
  },
}

export default function FeaturesPage() {
  return (
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <span className="badge source-roundup">Features</span>
        <h1 style={{ marginTop: '1rem' }}>Features & Official Context</h1>
        <p style={{ color: '#666', marginTop: '0.75rem', fontSize: '1.125rem', lineHeight: 1.7 }}>
          Source-aware explainers for Pokémon Pokopia. These pages focus on confirmed systems and clearly marked editorial interpretation rather than unsourced rankings, interviews, or competitive claims.
        </p>
      </header>

      <OfficialContext
        title="Feature Articles Use Official Sources First"
        description="Feature pages should explain confirmed Nintendo and Pokémon information first, then clearly label any editorial interpretation."
        links={[
          { href: '/official/gameplay-overview', label: 'Gameplay overview' },
          { href: '/official/multiplayer-gameshare-cloud-island', label: 'Multiplayer' },
          { href: '/official/official-beginner-tips', label: 'Official tips' },
        ]}
      />

      <section style={{ marginTop: '3rem', marginBottom: '3rem' }}>
        <Link
          href="/features/meta-analysis"
          style={{
            display: 'block',
            padding: '2.5rem',
            background: 'linear-gradient(135deg, #2f84d8 0%, #59c982 100%)',
            borderRadius: '12px',
            color: 'white',
            textDecoration: 'none',
            transition: 'transform 0.2s',
          }}
          className="feature-hero"
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0, opacity: 0.9 }}>
            Featured • Editorial Explainer
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.75rem', lineHeight: 1.2 }}>
            Pokémon Pokopia Confirmed Systems Analysis
          </h2>
          <p style={{ marginTop: '1rem', opacity: 0.95, fontSize: '1.125rem', lineHeight: 1.6 }}>
            What official sources confirm about Ditto, moves, crafting, food, habitats, multiplayer, and beginner routines, with editorial notes clearly separated.
          </p>
        </Link>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Source-Aware Features
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {featuredTopics.map((topic) => (
            <Link key={topic.href} href={topic.href} className="card">
              <span className="badge source-roundup">{topic.category}</span>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginTop: '1rem', lineHeight: 1.3 }}>
                {topic.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.75rem', lineHeight: 1.5 }}>
                {topic.excerpt}
              </p>
              <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#999' }}>
                {topic.readTime} read
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          From the Guides
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {featuredGuides.map((guide) => (
            <Link key={guide.id} href={`/guides/${guide.slug}`} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className={`badge ${guide.category}`}>{guide.category}</span>
              <span style={{ flex: 1, fontWeight: 600 }}>{guide.title}</span>
              <span style={{ fontSize: '0.75rem', color: '#999' }}>Open</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
