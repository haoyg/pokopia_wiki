import type { Metadata } from 'next'
import pokemonData from '@/data/pokemon.json'
import habitatData from '@/data/habitats.json'
import recipeData from '@/data/recipes.json'
import { canonicalUrl } from '@/lib/site'
import { WebPageJsonLd } from '@/components/seo/JsonLd'
import { CreditedImage } from '@/components/media/CreditedImage'
import { pokemonImage, habitatImage, recipeImage } from '@/lib/localImages'

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

      {/* Featured Pokemon strip */}
      <section style={{ padding: 'var(--space-6) 0', background: 'var(--color-bg-alt)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 var(--space-4)' }}>
          <div style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'var(--color-secondary)', fontWeight: 800, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)', margin: 0 }}>Database</p>
              <h2 style={{ margin: '4px 0 0', fontSize: 'var(--font-size-xl)', fontWeight: 900 }}>Featured Pokemon</h2>
            </div>
            <a href="/wiki/pokemon" style={{ color: 'var(--color-secondary)', fontWeight: 800, fontSize: 'var(--font-size-sm)' }}>View all {pokemonData.length} →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 'var(--space-3)' }}>
            {pokemonData.slice(0, 8).map((p) => (
              <a key={p.id} href={`/wiki/pokemon/${p.id}`} className="card" style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', textDecoration: 'none', boxShadow: 'var(--shadow-sm)', display: 'block' }}>
                <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-2)' }}>
                  <img
                    src={p.image_url && !p.image_url.startsWith('http') ? p.image_url : pokemonImage(p.name)}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div style={{ padding: '0 var(--space-2) var(--space-2)' }}>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', textAlign: 'center' }}>{p.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textAlign: 'center' }}>{p.type}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Habitats strip */}
      <section style={{ padding: 'var(--space-6) 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 var(--space-4)' }}>
          <div style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'var(--color-secondary)', fontWeight: 800, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)', margin: 0 }}>Routes</p>
              <h2 style={{ margin: '4px 0 0', fontSize: 'var(--font-size-xl)', fontWeight: 900 }}>Featured Habitats</h2>
            </div>
            <a href="/wiki/habitat" style={{ color: 'var(--color-secondary)', fontWeight: 800, fontSize: 'var(--font-size-sm)' }}>View all {habitatData.length} →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
            {habitatData.slice(0, 6).map((hab) => (
              <a key={hab.id} href={`/wiki/habitat/${hab.id}`} className="card" style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', textDecoration: 'none', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 120, overflow: 'hidden', background: 'var(--color-bg-alt)' }}>
                  <img
                    src={hab.image_url && !hab.image_url.startsWith('http') ? hab.image_url : habitatImage(hab.id, hab.name)}
                    alt={hab.name}
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: 'var(--space-3)', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '4px' }}>
                    <span className={`badge ${hab.difficulty}`}>{hab.difficulty}</span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{hab.weather}</span>
                  </div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 'var(--font-size-base)', color: 'var(--color-text)' }}>{hab.name}</p>
                  <p style={{ margin: '4px 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{hab.resource_bonus}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes strip */}
      <section style={{ padding: 'var(--space-6) 0', background: 'var(--color-bg-alt)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 var(--space-4)' }}>
          <div style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'var(--color-secondary)', fontWeight: 800, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)', margin: 0 }}>Crafting</p>
              <h2 style={{ margin: '4px 0 0', fontSize: 'var(--font-size-xl)', fontWeight: 900 }}>Featured Recipes</h2>
            </div>
            <a href="/wiki/recipe" style={{ color: 'var(--color-secondary)', fontWeight: 800, fontSize: 'var(--font-size-sm)' }}>View all {recipeData.length} →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            {recipeData.slice(0, 6).map((rec) => (
              <a key={rec.id} href={`/wiki/recipe/${rec.id}`} className="card" style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', textDecoration: 'none', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)' }}>
                <div style={{ width: 56, height: 56, flexShrink: 0, background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img
                    src={recipeImage(rec.id, rec.name)}
                    alt={rec.name}
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' }}>{rec.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{rec.buff}</p>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{rec.rarity}</span>
                </div>
              </a>
            ))}
          </div>
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
