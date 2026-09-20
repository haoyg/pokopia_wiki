import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'
import { WebPageJsonLd } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Pokopia Wiki – Complete Game Guide, Pokemon Database & Tools | Pokopia Cloud',
  description:
    'The independent Pokopia Wiki covers every Pokemon entry, habitat route, recipe, and planning tool. Use this structured game reference to find spawn windows, build notes, and step-by-step guides for Pokopia.',
  keywords: [
    'pokopia wiki',
    'pokopia guide',
    'pokopia pokemon',
    'pokopia database',
    'pokopia habitats',
    'pokopia recipes',
    'pokopia tools',
  ],
  openGraph: {
    title: 'Pokopia Wiki – Complete Game Guide, Pokemon Database & Tools',
    description:
      'The independent Pokopia Wiki covers every Pokemon entry, habitat route, recipe, and planning tool.',
    images: ['/og-image.svg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Wiki – Complete Game Guide, Pokemon Database & Tools',
    description:
      'The independent Pokopia Wiki covers every Pokemon entry, habitat route, recipe, and planning tool.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/'),
  },
}

const portalSections = [
  {
    href: '/wiki/pokemon',
    label: 'Pokemon Database',
    description: '50+ entries with types, drops, favorite food, spawn windows, and recommended habitats.',
    tags: ['Collection list', 'Spawn tracker'],
    tagHrefs: ['/wiki/pokemon?view=collection', '/tools/spawn-tracker'],
  },
  {
    href: '/wiki/habitat',
    label: 'Habitat Routes',
    description: 'Route maps, weather dependencies, difficulty ratings, and recommended team builds.',
    tags: ['Habitat planner', 'All habitats'],
    tagHrefs: ['/tools/habitat-planner', '/wiki/habitat'],
  },
  {
    href: '/wiki/recipe',
    label: 'Recipe Crafting',
    description: 'Buff effects, ingredient costs, rarity comparisons, and best-use scenarios.',
    tags: ['Recipe calculator', 'All recipes'],
    tagHrefs: ['/tools/recipe-calculator', '/wiki/recipe'],
  },
]

const featuredGuides = [
  {
    href: '/guides/training-grounds-beginners',
    label: 'Beginner Route Guide',
    description: 'Step-by-step path through the first 20 hours — habitat order, team building, and resource priorities.',
    image: '/images/guides/training-grounds-beginners.svg',
  },
  {
    href: '/guides/fast-farming-rare-pokemon',
    label: 'Rare Farming Route',
    description: 'Maximize rare material drops by chaining optimal habitat sequences and weather windows.',
    image: '/images/guides/fast-farming-rare-pokemon.svg',
  },
  {
    href: '/guides/complete-recipe-list',
    label: 'Recipe Planning Route',
    description: 'Which recipes to craft first, how to accumulate ingredients efficiently, and when to save for legendaries.',
    image: '/images/guides/complete-recipe-list.svg',
  },
  {
    href: '/guides',
    label: 'All Guides',
    description: 'Browse the full guide library — one question answered per page, searchable by topic.',
    image: '/images/guides/best-starter-pokemon.svg',
  },
]

const tools = [
  {
    href: '/tools/spawn-tracker',
    label: 'Spawn Tracker',
    description: 'Filter Pokemon by weather, time, rarity, and food preference to find the exact spawn window you need.',
    tags: ['Weather filter', 'Time filter', 'Rarity filter'],
  },
  {
    href: '/tools/habitat-planner',
    label: 'Habitat Planner',
    description: 'Plan multi-stop farming routes that chain complementary habitats without dead travel time.',
    tags: ['Route builder', 'Weather sync'],
  },
  {
    href: '/tools/recipe-calculator',
    label: 'Recipe Calculator',
    description: 'Compare recipe efficiency side-by-side, see which ingredients you have, and calculate opportunity cost.',
    tags: ['Side-by-side', 'Inventory check'],
  },
  {
    href: '/tools/team-builder',
    label: 'Team Builder',
    description: 'Draft team compositions, evaluate role coverage, and score your roster against meta benchmarks.',
    tags: ['Role balance', 'Type coverage'],
  },
]

const quickLinks = [
  { href: '/guides/beginner-route', label: 'New to Pokopia? Start here' },
  { href: '/wiki/habitat', label: 'Find the right habitat' },
  { href: '/tools/spawn-tracker', label: 'Track spawn windows' },
  { href: '/tools/team-builder', label: 'Build a team' },
  { href: '/tools/recipe-calculator', label: 'Optimize crafting' },
  { href: '/news', label: 'Follow patch notes' },
]

export default function HomePage() {
  return (
    <main>
      <WebPageJsonLd
        type="WebPage"
        name="Pokopia Wiki – Complete Game Guide, Pokemon Database & Tools"
        description="The independent Pokopia Wiki covers every Pokemon entry, habitat route, recipe, and planning tool."
        url="/"
        dateModified="2026-08-11"
      />

      {/* Portal hero */}
      <section className="hero">
        <div className="hero-inner">
          <span className="hero-kicker">Independent Pokopia Reference</span>
          <h1>Your Complete Pokopia Guide</h1>
          <p>Every Pokemon, habitat, recipe, and planning tool — verified and organized.</p>
          <div className="hero-actions">
            <a href="/wiki/pokemon">Browse Pokemon</a>
            <a href="/guides">Read Guides</a>
            <a href="/tools">Use Tools</a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <img src="/images/homepage-hero.svg" alt="" width="1200" height="400" loading="eager" decoding="async" />
        </div>
      </section>

      {/* Portal main sections */}
      <section className="home-explore">
        <div className="home-explore-grid">
          {portalSections.map((section) => (
            <div key={section.href} className="home-explore-card">
              <a href={section.href}>
                <strong>{section.label}</strong>
                <p>{section.description}</p>
              </a>
              <div>
                {section.tags.map((tag, i) => (
                  <a key={tag} href={section.tagHrefs[i]}>{tag}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured guides strip */}
      <section className="route-board">
        <div className="route-board-grid">
          {featuredGuides.map((guide) => (
            <a key={guide.href} href={guide.href} className="route-card">
              <div className="card-cover">
                <img src={guide.image} alt="" loading="lazy" decoding="async" />
              </div>
              <h3>{guide.label}</h3>
              <p>{guide.description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Tools strip */}
      <section className="home-tools-strip">
        <div className="home-tools-grid">
          {tools.map((tool) => (
            <a key={tool.href} href={tool.href} className="home-tool-card">
              <strong>{tool.label}</strong>
              <p>{tool.description}</p>
              <div>
                {tool.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Quick links by goal */}
      <section>
        <div className="wiki-panel">
          <div className="wiki-panel-title">
            <h2>Start Here — Choose Your Goal</h2>
          </div>
          <div className="pill-list">
            {quickLinks.map((link) => (
              <a key={link.href} href={link.href}>{link.label}</a>
            ))}
          </div>
        </div>
      </section>

      {/* Source policy note */}
      <section>
        <div className="official-context">
          <div>
            <span className="official-context-label">Source Policy</span>
            <h2>What&apos;s confirmed vs. editorial</h2>
            <p>Every page distinguishes confirmed information (official posts, patch notes) from editorial guidance (route recommendations, build suggestions). Look for the Official badge on source-verified content.</p>
          </div>
          <div className="official-context-links">
            <a href="/source-policy">Source policy</a>
            <a href="/editorial-policy">Editorial policy</a>
            <a href="/corrections">Submit a correction</a>
          </div>
        </div>
      </section>
    </main>
  )
}
