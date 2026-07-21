import { Metadata } from 'next'
import Link from 'next/link'
import guidesData from '@/data/guides.json'
import { canonicalUrl } from '@/lib/site'
import { OfficialContext } from '@/components/content/OfficialContext'
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'
import { isIndexableGuide } from '@/lib/indexing'

const featuredGuides = guidesData.filter(isIndexableGuide).slice(0, 6)

const featuredTopics = [
  {
    href: '/features/meta-analysis',
    title: 'Pokémon Pokopia Confirmed Systems Analysis',
    excerpt: 'An editorial breakdown of officially confirmed systems: Ditto, Pokémon moves, crafting, habitats, food, multiplayer, and daily routines.',
    category: 'Official Context',
    readTime: '7 min',
  },
  {
    href: '/features/pokopia-animal-crossing',
    title: 'Pokopia vs Animal Crossing: Cozy Life Sim Comparison',
    excerpt: 'A source-aware comparison for cozy game players, separating confirmed Pokopia systems from broader life-sim expectations.',
    category: 'Editorial Comparison',
    readTime: '8 min',
  },
  {
    href: '/features/friendship-requests-tracker',
    title: 'Pokopia Friendship and Requests Tracker',
    excerpt: 'Confirmed signals for befriended Pokemon, requests, visits, and what not to claim about unverified NPC relationship systems.',
    category: 'System Tracker',
    readTime: '7 min',
  },
  {
    href: '/features/creative-play-ideas',
    title: 'Pokopia Creative Play Ideas',
    excerpt: 'Safe building, route, recipe, and community challenge ideas that avoid unauthorized mods, downloads, and fake event claims.',
    category: 'Creative Play',
    readTime: '6 min',
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
  keywords: [
    'Pokopia features',
    'Pokopia gameplay guide',
    'Pokopia systems explained',
    'Pokopia official information',
    'Pokopia multiplayer guide',
    'Pokopia beginner guide',
    'Pokopia editorial analysis',
  ],
  openGraph: {
    title: 'Features and Official Context',
    description: 'Source-aware features and editorial explainers for Pokémon Pokopia.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Features and Official Context',
    description: 'Source-aware features and editorial explainers for Pokémon Pokopia.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/features'),
  },
}

export default function FeaturesPage() {
  return (
    <main className="features-hub page-shell">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Features', url: '/features' },
        ]}
      />
      <ItemListJsonLd
        name="Pokopia Features and Official Context"
        description="Source-aware feature articles and official-context explainers for Pokémon Pokopia."
        url="/features"
        items={featuredTopics.map((topic) => ({
          name: topic.title,
          url: topic.href,
        }))}
      />
      <header className="features-hub-hero">
        <span className="badge source-roundup">Features</span>
        <h1>Features & Official Context</h1>
        <p>
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

      <section className="features-lead-section">
        <Link
          href="/features/pokopia-animal-crossing"
          className="feature-hero"
        >
          <span>
            Featured • Cozy Game Comparison
          </span>
          <h2>
            Pokopia vs Animal Crossing: What Cozy Game Players Should Expect
          </h2>
          <p>
            A careful comparison for Animal Crossing players, focused on confirmed Pokopia systems, creative world-building, and where expectations need caution.
          </p>
        </Link>
      </section>

      <section className="features-topic-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Source-Aware Features</span>
            <h2>Official Context and Editorial Explainers</h2>
          </div>
        </div>
        <div className="features-topic-grid">
          {featuredTopics.map((topic) => (
            <Link key={topic.href} href={topic.href} className="card">
              <span className="badge source-roundup">{topic.category}</span>
              <h3 className="index-card-title">
                {topic.title}
              </h3>
              <p className="index-card-summary">
                {topic.excerpt}
              </p>
              <div className="feature-read-time">
                {topic.readTime} read
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="features-guide-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">From the Guides</span>
            <h2>Planning Guides That Use This Context</h2>
          </div>
          <Link href="/guides">All guides</Link>
        </div>
        <div className="features-guide-list">
          {featuredGuides.map((guide) => (
            <Link key={guide.id} href={`/guides/${guide.slug}`} className="feature-guide-row">
              <span className={`badge ${guide.category}`}>{guide.category}</span>
              <strong>{guide.title}</strong>
              <small>Open</small>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
