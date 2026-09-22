import type { Metadata } from 'next'
import pokemonData from '@/data/pokemon.json'
import habitatData from '@/data/habitats.json'
import recipeData from '@/data/recipes.json'
import { canonicalUrl } from '@/lib/site'
import { WebPageJsonLd } from '@/components/seo/JsonLd'
import { pokemonImage, habitatImage, recipeImage } from '@/lib/localImages'
import { HeroBackground } from '@/components/HeroBackground'
import { isIndexableDatabaseEntry } from '@/lib/indexing'

const verifiedPokemon = pokemonData.filter(isIndexableDatabaseEntry)
const verifiedHabitats = habitatData.filter(isIndexableDatabaseEntry)
const verifiedRecipes = recipeData.filter(isIndexableDatabaseEntry)

export const metadata: Metadata = {
  title: 'Pokopia Wiki — Official Info and Source-Checked Guides | Pokopia Cloud',
  description:
    'An independent Pokopia wiki focused on official information, cited updates, and source-checked guides. Unverified database records are withheld from search.',
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
    title: 'Pokopia Wiki — Official Info and Source-Checked Guides',
    description:
      'Official information, cited updates, and source-checked Pokopia guides.',
    images: ['/og-image.svg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Wiki — Official Info and Source-Checked Guides',
    description:
      'Official information, cited updates, and source-checked Pokopia guides.',
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
    description: 'Database rebuild in progress. Entries return only after names and gameplay fields have cited evidence.',
    tags: ['Verification status', 'Official info'],
    tagHrefs: ['/wiki/pokemon', '/official'],
  },
  {
    href: '/wiki/habitat',
    label: 'Habitat Routes',
    description: 'Habitat records are quarantined until unlocks, encounters, weather, and route claims are verified.',
    tags: ['Verification status', 'Source policy'],
    tagHrefs: ['/wiki/habitat', '/source-policy'],
  },
  {
    href: '/wiki/recipe',
    label: 'Recipe Crafting',
    description: 'Recipe records are quarantined until ingredients, effects, duration, and availability are verified.',
    tags: ['Verification status', 'Corrections'],
    tagHrefs: ['/wiki/recipe', '/corrections'],
  },
]

const featuredGuides = [
  {
    href: '/official/official-beginner-tips',
    label: 'Official Beginner Tips',
    description: 'A cited roundup of beginner information published through official Pokopia channels.',
    image: '/images/guides/pokopia-official-2.png',
  },
  {
    href: '/official/gameplay-overview',
    label: 'Confirmed Gameplay Overview',
    description: 'Review confirmed systems and follow each claim back to its published source.',
    image: '/images/guides/pokopia-official-5.png',
  },
  {
    href: '/official/release-date-platform-price',
    label: 'Release and Platform Details',
    description: 'Source-linked release, platform, and availability information.',
    image: '/images/guides/pokopia-game-artwork.png',
  },
  {
    href: '/news',
    label: 'News and Source Updates',
    description: 'Follow official announcements, trailers, and dated source roundups.',
    image: '/images/guides/best-starter-pokemon.png',
  },
]

const tools: Array<{ href: string; label: string; description: string; tags: string[] }> = [
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
].filter(() => false)

const quickLinks = [
  { href: '/official/official-beginner-tips', label: 'New to Pokopia? Start here' },
  { href: '/official/gameplay-overview', label: 'Review confirmed gameplay' },
  { href: '/official/release-date-platform-price', label: 'Check release information' },
  { href: '/official/multiplayer-gameshare-cloud-island', label: 'Understand multiplayer' },
  { href: '/source-policy', label: 'How claims are verified' },
  { href: '/news', label: 'Follow official updates' },
]

export default function HomePage() {
  return (
    <main>
      <WebPageJsonLd
        type="WebPage"
        name="Pokopia Wiki — Official Info and Source-Checked Guides"
        description="Official information, cited updates, and source-checked Pokopia guides."
        url="/"
        dateModified="2026-08-11"
      />

      {/* Portal hero */}
      <section className="hero">
        <HeroBackground />
        <div className="hero-inner">
          <span className="hero-kicker">Independent Pokopia Reference</span>
          <h1>Pokopia Wiki with Sources First</h1>
          <p>Official information and source-checked guides, with unverified database pages kept out of search.</p>
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
            <a href="/wiki/pokemon" style={{ color: 'var(--color-secondary)', fontWeight: 800, fontSize: 'var(--font-size-sm)' }}>Verification status →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 'var(--space-3)' }}>
            {verifiedPokemon.slice(0, 8).map((p) => (
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
            <a href="/wiki/habitat" style={{ color: 'var(--color-secondary)', fontWeight: 800, fontSize: 'var(--font-size-sm)' }}>Verification status →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
            {verifiedHabitats.slice(0, 6).map((hab) => (
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
            <a href="/wiki/recipe" style={{ color: 'var(--color-secondary)', fontWeight: 800, fontSize: 'var(--font-size-sm)' }}>Verification status →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            {verifiedRecipes.slice(0, 6).map((rec) => (
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
