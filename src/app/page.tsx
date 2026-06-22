import type { Metadata } from 'next'
import newsData from '@/data/news.json'
import guidesData from '@/data/guides.json'
import pokemonData from '@/data/pokemon.json'
import habitatsData from '@/data/habitats.json'
import { canonicalUrl } from '@/lib/site'
import { CreditedImage } from '@/components/media/CreditedImage'
import { OfficialContext } from '@/components/content/OfficialContext'

export const metadata: Metadata = {
  title: 'Pokemon Pokopia Wiki, Guides & Tools',
  description: 'Find official Pokemon Pokopia information, beginner guides, multiplayer details, creative ideas, and planning tools in one place.',
  alternates: {
    canonical: canonicalUrl('/'),
  },
}

const typeLabels: Record<string, string> = {
  Fire: 'Fire',
  Water: 'Water',
  Grass: 'Grass',
  Electric: 'Electric',
  Ice: 'Ice',
  Ghost: 'Ghost',
  Dark: 'Dark',
  Dragon: 'Dragon',
  Steel: 'Steel',
  Rock: 'Rock',
  Ground: 'Ground',
  Flying: 'Flying',
  Normal: 'Normal',
  Poison: 'Poison',
  Fairy: 'Fairy',
  Crystal: 'Crystal',
}

const categoryLabels: Record<string, string> = {
  official: 'Official',
  trailer: 'Trailer',
  'source-roundup': 'Source Roundup',
  'site-update': 'Site Update',
  tier: 'Tier',
  guides: 'Guide',
  farming: 'Farming',
  team: 'Team',
}

const planningTools = [
  {
    href: '/tools/habitat-planner',
    label: 'Habitat Planner',
    summary: 'Match a goal, level, difficulty, and weather window to practical habitat routes.',
    tags: ['Routes', 'Weather', 'Recipes'],
  },
  {
    href: '/tools/recipe-calculator',
    label: 'Recipe Calculator',
    summary: 'Compare recipe value before spending rare ingredients on a farming or boss route.',
    tags: ['Buffs', 'Timing', 'Ingredients'],
  },
  {
    href: '/tools/team-builder',
    label: 'Team Builder',
    summary: 'Draft a four-role team for progression, rare farming, hard fights, or speed routing.',
    tags: ['Roles', 'Matchups', 'Routes'],
  },
  {
    href: '/tools/spawn-tracker',
    label: 'Spawn Tracker',
    summary: 'Filter spawn records by habitat, weather, time, rarity, and Pokemon type.',
    tags: ['Spawns', 'Habitats', 'Rarity'],
  },
]

const exploreClusters = [
  {
    href: '/official',
    label: 'Official Baseline',
    summary: 'Confirmed release, gameplay, multiplayer, beginner tips, and source-backed update pages.',
    links: [
      { href: '/official/gameplay-overview', label: 'Gameplay' },
      { href: '/official/official-beginner-tips', label: 'Tips' },
    ],
  },
  {
    href: '/guides/beginner-route',
    label: 'Route Guides',
    summary: 'Beginner, rare farming, and recipe planning routes that connect guides, tools, habitats, and Pokemon pages.',
    links: [
      { href: '/guides/rare-farming-route', label: 'Rare farming' },
      { href: '/guides/recipe-planning-route', label: 'Recipes' },
    ],
  },
  {
    href: '/features/pokopia-animal-crossing',
    label: 'Cozy Features',
    summary: 'Source-aware features for Animal Crossing players, creative play, friendship requests, and system expectations.',
    links: [
      { href: '/features/creative-play-ideas', label: 'Creative play' },
      { href: '/features/friendship-requests-tracker', label: 'Requests' },
    ],
  },
  {
    href: '/builds/home-design-ideas',
    label: 'Build and Community',
    summary: 'Home design concepts, future community showcase standards, and safe contribution rules.',
    links: [
      { href: '/community/showcase', label: 'Showcase' },
      { href: '/community', label: 'Guidelines' },
    ],
  },
  {
    href: '/news/weekly-event-tracker',
    label: 'Event Tracking',
    summary: 'Confirmed-first event monitoring that avoids invented rewards, schedules, and unverified weekly claims.',
    links: [
      { href: '/news', label: 'News' },
      { href: '/news/pokemon-pokopia-pc-requests-daily-challenges', label: 'Daily context' },
    ],
  },
  {
    href: '/wiki/pokemon',
    label: 'Wiki Database',
    summary: 'Pokemon, habitat, and recipe reference pages connected to route planning and tools.',
    links: [
      { href: '/wiki/habitat', label: 'Habitats' },
      { href: '/wiki/recipe', label: 'Recipes' },
    ],
  },
]

function getTypeLabel(type: string) {
  for (const [key, label] of Object.entries(typeLabels)) {
    if (type.toLowerCase().includes(key.toLowerCase())) return label
  }
  return 'Normal'
}

export default function Home() {
  const leadNews = newsData[0]
  const news = newsData.slice(1, 5)
  const guides = guidesData.slice(0, 6)
  const pokemon = pokemonData.slice(0, 8)
  const habitats = habitatsData.slice(0, 4)
  const beginnerGuides = guidesData.filter((guide) =>
    ['best-starter-pokemon', 'training-grounds-beginners', 'best-habitat-type-pokopia', 'complete-recipe-list'].includes(guide.slug)
  )
  const routeGuides = guidesData.filter((guide) =>
    ['how-to-unlock-volcanic-cave', 'fast-farming-rare-pokemon', 'shadow-marsh-guide', 'frost-peak-guide'].includes(guide.slug)
  )

  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-kicker">Explorer Field Guide</p>
          <h1>Pokopia Portal</h1>
          <p>Your cozy guide to habitats, Pokemon, recipes, and build routes across the Pokopia world.</p>
          <div className="hero-actions" aria-label="Pokopia quick sections">
            <a href="/guides">Start Guides</a>
            <a href="/wiki/pokemon">Open Pokedex</a>
            <a href="/tools">Use Tools</a>
          </div>
        </div>
      </section>

      <section className="home-dashboard" aria-label="Pokopia homepage highlights">
        <div className="lead-story">
          <a href={`/news/${leadNews.slug}`} className="lead-story-link">
            <CreditedImage src={leadNews.image_url} alt={leadNews.image_alt} source={leadNews.image_source} sourceUrl={leadNews.image_source_url} licenseNote={leadNews.image_license_note} originalMedia={leadNews.image_original_media} className="lead-cover" sizes="(max-width: 768px) 100vw, 620px" priority />
            <span className={`badge ${leadNews.category}`}>
              {categoryLabels[leadNews.category] || leadNews.category}
            </span>
            <h2>{leadNews.title}</h2>
            <p>{leadNews.excerpt}</p>
          </a>
        </div>

        <div className="home-briefing">
          <div className="briefing-panel">
            <span className="panel-kicker">Start Here</span>
            <h2>Beginner Route</h2>
            <p>Use the full topic route to connect starter picks, easy habitats, recipes, and tools before choosing a longer farming loop.</p>
            <a className="panel-link" href="/guides/beginner-route">Open beginner route</a>
            <div className="briefing-list">
              {beginnerGuides.map((guide) => (
                <a key={guide.id} href={`/guides/${guide.slug}`}>
                  <span>{categoryLabels[guide.category] || guide.category}</span>
                  <strong>{guide.title}</strong>
                </a>
              ))}
            </div>
          </div>
          <div className="briefing-panel official-panel">
            <span className="panel-kicker">Official Sources</span>
            <h2>Confirmed Info</h2>
            <p>Check source-backed release, gameplay, multiplayer, and beginner notes before reading editorial route advice.</p>
            <a className="panel-link" href="/official">Open official hub</a>
          </div>
        </div>
      </section>

      <section>
        <OfficialContext
          title="Start With Confirmed Pokopia Info"
          description="Official pages collect release, gameplay, multiplayer, and beginner details from Nintendo and Pokémon sources before you move into editorial guides."
          links={[
            { href: '/official/gameplay-overview', label: 'Gameplay overview' },
            { href: '/official/multiplayer-gameshare-cloud-island', label: 'Multiplayer' },
            { href: '/official/release-date-platform-price', label: 'Release details' },
          ]}
        />
      </section>

      <section className="home-explore">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Explore Pokopia</span>
            <h2>Choose a Content Path</h2>
          </div>
          <a href="/search">Search all pages</a>
        </div>
        <div className="home-explore-grid">
          {exploreClusters.map((cluster) => (
            <article key={cluster.href} className="home-explore-card">
              <a href={cluster.href}>
                <strong>{cluster.label}</strong>
                <p>{cluster.summary}</p>
              </a>
              <div>
                {cluster.links.map((link) => (
                  <a key={link.href} href={link.href}>{link.label}</a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-tools-strip">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Planning Tools</span>
            <h2>Build a Route Before You Spend Resources</h2>
          </div>
          <a href="/tools">Open tools hub</a>
        </div>
        <div className="home-tools-grid">
          {planningTools.map((tool) => (
            <a key={tool.href} href={tool.href} className="home-tool-card">
              <strong>{tool.label}</strong>
              <p>{tool.summary}</p>
              <div>
                {tool.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="content-lanes">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Route Planning</span>
            <h2>Trending Guides</h2>
          </div>
          <a href="/guides">View all guides</a>
        </div>
        <div className="guide-lane-grid">
          {guides.map((item) => (
            <a key={item.id} href={`/guides/${item.slug}`} className="card">
              <CreditedImage src={item.image_url} alt={item.image_alt} source={item.image_source} sourceUrl={item.image_source_url} licenseNote={item.image_license_note} originalMedia={item.image_original_media} />
              <span className="badge">{categoryLabels[item.category] || item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.answer}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="route-board">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Today&apos;s Routes</span>
            <h2>Habitat and Farming Paths</h2>
          </div>
          <a href="/wiki/habitat">Open habitats</a>
        </div>
        <div className="route-board-grid">
          {routeGuides.map((guide) => (
            <a key={guide.id} href={`/guides/${guide.slug}`} className="route-card">
              <span className={`badge ${guide.category}`}>{categoryLabels[guide.category] || guide.category}</span>
              <h3>{guide.title}</h3>
              <p>{guide.answer}</p>
            </a>
          ))}
          {habitats.map((habitat) => (
            <a key={habitat.id} href={`/wiki/habitat/${habitat.id}`} className="route-card habitat-route">
              <span className={`badge ${habitat.difficulty.toLowerCase()}`}>{habitat.difficulty}</span>
              <h3>{habitat.name}</h3>
              <p>{habitat.overview}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="pokedex-strip">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Field Notes</span>
            <h2>Popular Pokemon</h2>
          </div>
          <a href="/wiki/pokemon">Open Pokedex</a>
        </div>
        <div className="pokemon-strip-grid">
          {pokemon.map((p) => (
            <a key={p.id} href={`/wiki/pokemon/${p.id}`} className="card">
              <CreditedImage src={p.image_url} alt={p.image_alt} source={p.image_source} sourceUrl={p.image_source_url} licenseNote={p.image_license_note} originalMedia={p.image_original_media} className="card-cover pokemon-cover" sizes="120px" />
              <div className="type-kicker">{getTypeLabel(p.type)}</div>
              <h3 style={{ textAlign: 'center', marginTop: '0.5rem' }}>{p.name}</h3>
              <p style={{ textAlign: 'center', color: '#666', fontSize: '0.875rem' }}>{p.type}</p>
              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <span className={`rarity ${p.rarity}`}>{p.rarity}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="latest-wire">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">News Wire</span>
            <h2>Latest Updates</h2>
          </div>
          <a href="/news">View all news</a>
        </div>
        <div className="news-grid">
          {news.map((item) => (
            <a key={item.id} href={`/news/${item.slug}`} className="card">
              <CreditedImage src={item.image_url} alt={item.image_alt} source={item.image_source} sourceUrl={item.image_source_url} licenseNote={item.image_license_note} originalMedia={item.image_original_media} />
              <span className={`badge ${item.category}`}>
                {categoryLabels[item.category] || item.category}
              </span>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
