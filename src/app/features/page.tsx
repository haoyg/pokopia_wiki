import Link from 'next/link'
import guidesData from '@/data/guides.json'

const featuredGuides = guidesData.filter((g) => ['tier', 'guides'].includes(g.category)).slice(0, 6)

const featuredTopics = [
  {
    id: 'meta-analysis',
    title: 'The State of Pokopia: Season 2 Meta Analysis',
    excerpt: 'After 30 days of competitive data, we break down the definitive tier list and what it means for your builds.',
    category: 'Deep Dive',
    readTime: '8 min',
    emoji: '📊',
  },
  {
    id: 'legendary-hunting',
    title: 'Inside the Hunt: How Top Players Catch Legendaries',
    excerpt: 'We interviewed the top 10 players to reveal their strategies for farming Flamexor, Shadowclaw, and Primordion.',
    category: 'Interview',
    readTime: '12 min',
    emoji: '🎯',
  },
  {
    id: 'habitat-design',
    title: 'The Art of Habitat Design',
    excerpt: 'From starter meadows to endgame lairs - exploring the design philosophy behind Pokopia\'s 20 habitats.',
    category: 'Behind the Scenes',
    readTime: '6 min',
    emoji: '🎨',
  },
  {
    id: 'recipe-science',
    title: 'The Science of Cooking: Recipe Mechanics Explained',
    excerpt: 'Buff stacking, duration calculations, and why Lucky Charm is the most broken item in the game.',
    category: 'Analysis',
    readTime: '10 min',
    emoji: '🍳',
  },
  {
    id: 'community-spotlight',
    title: 'Community Spotlight: Building the Ultimate Guild',
    excerpt: 'Features the top 5 guilds and how they organize raids, trades, and competitive events.',
    category: 'Community',
    readTime: '7 min',
    emoji: '🏰',
  },
]

export default function FeaturesPage() {
  return (
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>
          🎮 Features
        </h1>
        <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '1.125rem' }}>
          Deep dives, interviews, and editorial content
        </p>
      </header>

      {/* Hero Feature */}
      <section style={{ marginBottom: '3rem' }}>
        <Link
          href="/features/meta-analysis"
          style={{
            display: 'block',
            padding: '2.5rem',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
            borderRadius: '16px',
            color: 'white',
            textDecoration: 'none',
            transition: 'transform 0.2s',
          }}
          className="feature-hero"
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>
            Featured • Deep Dive
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.75rem', lineHeight: 1.2 }}>
            The State of Pokopia:<br />Season 2 Meta Analysis
          </h2>
          <p style={{ marginTop: '1rem', opacity: 0.9, fontSize: '1.125rem', lineHeight: 1.6 }}>
            After analyzing over 10,000 competitive matches, we reveal the definitive tier rankings and what the meta means for your next build.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>📊 Analysis</span>
            <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>8 min read</span>
          </div>
        </Link>
      </section>

      {/* Topic Grid */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Latest Features
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {featuredTopics.map((topic) => (
            <Link
              key={topic.id}
              href={`/features/${topic.id}`}
              style={{
                display: 'block',
                padding: '1.5rem',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                background: 'white',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.2s',
              }}
              className="feature-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <span style={{ fontSize: '2rem' }}>{topic.emoji}</span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '0.25rem 0.5rem',
                    background: '#f5f5f5',
                    borderRadius: '4px',
                    color: '#666',
                  }}
                >
                  {topic.category}
                </span>
              </div>
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

      {/* Related Guides */}
      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          📖 From the Guides
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {featuredGuides.map((guide) => (
            <Link
              key={guide.id}
              href={`/guides/${guide.slug}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.25rem',
                border: '1px solid #e5e5e5',
                borderRadius: '10px',
                background: 'white',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.2s',
              }}
              className="guide-row"
            >
              <span className={`badge ${guide.category}`}>{guide.category}</span>
              <span style={{ flex: 1, fontWeight: 600 }}>{guide.title}</span>
              <span style={{ fontSize: '0.75rem', color: '#999' }}>→</span>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        .feature-hero:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .feature-card:hover {
          border-color: #e94560;
          box-shadow: 0 8px 24px rgba(233,69,96,0.1);
          transform: translateY(-2px);
        }
        .guide-row:hover {
          border-color: #e94560;
          background: #fef2f4;
        }
      `}</style>
    </main>
  )
}
