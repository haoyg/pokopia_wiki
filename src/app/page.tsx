import type { Metadata } from 'next'
import newsData from '@/data/news.json'
import guidesData from '@/data/guides.json'
import pokemonData from '@/data/pokemon.json'
import habitatsData from '@/data/habitats.json'
import recipesData from '@/data/recipes.json'
import { canonicalUrl } from '@/lib/site'
import { CreditedImage } from '@/components/media/CreditedImage'
import { ItemListJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd'
import { isIndexableGuide } from '@/lib/indexing'

export const metadata: Metadata = {
  title: 'Pokopia Wiki: Guides, Pokemon, Tools',
  description: 'Pokopia wiki homepage with official notes, Pokemon pages, habitat routes, recipes, guides, news, and planning tools.',
  alternates: {
    canonical: canonicalUrl('/'),
  },
}

const categoryLabels: Record<string, string> = {
  official: 'Official',
  trailer: 'Trailer',
  'source-roundup': 'Source',
  'site-update': 'Update',
  tier: 'Tier',
  guides: 'Guide',
  farming: 'Farming',
  team: 'Team',
}

<<<<<<< Updated upstream
const planningTools = [
  {
    href: '/tools/habitat-planner',
    label: 'Habitat Planner',
    summary: 'Explore unverified editorial habitat records by goal, level, difficulty, and weather.',
    tags: ['Routes', 'Weather', 'Recipes'],
  },
  {
    href: '/tools/recipe-calculator',
    label: 'Recipe Calculator',
    summary: 'Compare unverified editorial recipe records by goal, timing, and ingredients.',
    tags: ['Buffs', 'Timing', 'Ingredients'],
  },
  {
    href: '/tools/team-builder',
    label: 'Team Builder',
    summary: 'Draft planning combinations from an unverified editorial Pokémon dataset.',
    tags: ['Roles', 'Matchups', 'Routes'],
  },
  {
    href: '/tools/spawn-tracker',
    label: 'Spawn Tracker',
    summary: 'Filter unverified editorial spawn records by habitat, weather, time, and rarity.',
    tags: ['Spawns', 'Habitats', 'Rarity'],
  },
=======
const wikiTiles = [
  { href: '/wiki/pokemon', label: 'Pokemon', icon: 'PK', detail: 'Types, food, drops' },
  { href: '/wiki/habitat', label: 'Habitats', icon: 'HB', detail: 'Routes and weather' },
  { href: '/wiki/recipe', label: 'Recipes', icon: 'RC', detail: 'Buffs and timing' },
  { href: '/guides', label: 'Guides', icon: 'GD', detail: 'Walkthroughs' },
  { href: '/official', label: 'Official', icon: 'OF', detail: 'Confirmed info' },
  { href: '/news', label: 'News', icon: 'NW', detail: 'Source updates' },
  { href: '/tools/spawn-tracker', label: 'Spawns', icon: 'SP', detail: 'Lookup tool' },
  { href: '/tools/team-builder', label: 'Teams', icon: 'TM', detail: 'Draft planner' },
  { href: '/tools/habitat-planner', label: 'Planner', icon: 'PL', detail: 'Route planning' },
  { href: '/tools/recipe-calculator', label: 'Calculator', icon: 'CA', detail: 'Recipe compare' },
>>>>>>> Stashed changes
]

const sideGroups = [
  {
<<<<<<< Updated upstream
    href: '/official',
    label: 'Official Baseline',
    summary: 'Confirmed release, gameplay, multiplayer, beginner tips, and source-backed update pages.',
    links: [
      { href: '/official/gameplay-overview', label: 'Gameplay' },
      { href: '/official/official-beginner-tips', label: 'Tips' },
    ],
  },
  {
    href: '/guides',
    label: 'Source-Backed Guides',
    summary: 'Route pages that have cleared the current source-backed content filter.',
    links: [
      { href: '/guides/how-to-build-first-house', label: 'First House' },
      { href: '/guides/food-powered-moves-guide', label: 'Food-Powered Moves' },
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
    href: '/tools',
    label: 'Planning Tools',
    summary: 'Explore tools built from unverified editorial datasets while those claims remain outside the verified content index.',
    links: [
      { href: '/tools/habitat-planner', label: 'Habitats' },
      { href: '/tools/recipe-calculator', label: 'Recipes' },
    ],
  },
  {
    href: '/news/weekly-event-tracker',
    label: 'Event Tracking',
    summary: 'Confirmed-first event monitoring that avoids invented rewards, schedules, and unverified weekly claims.',
=======
    title: 'Wiki navigation',
>>>>>>> Stashed changes
    links: [
      { href: '/', label: 'Main page' },
      { href: '/official', label: 'Official sources' },
      { href: '/guides', label: 'Guides' },
      { href: '/news', label: 'News' },
    ],
  },
  {
    title: 'Database',
    links: [
      { href: '/wiki/pokemon', label: 'Pokemon' },
      { href: '/wiki/habitat', label: 'Habitats' },
      { href: '/wiki/recipe', label: 'Recipes' },
      { href: '/tools/spawn-tracker', label: 'Spawn tracker' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { href: '/tools/habitat-planner', label: 'Habitat planner' },
      { href: '/tools/recipe-calculator', label: 'Recipe calculator' },
      { href: '/tools/team-builder', label: 'Team builder' },
      { href: '/tools', label: 'All tools' },
    ],
  },
  {
    title: 'Trust',
    links: [
      { href: '/editorial-policy', label: 'Editorial policy' },
      { href: '/source-policy', label: 'Source policy' },
      { href: '/corrections', label: 'Corrections' },
      { href: '/about', label: 'About' },
    ],
  },
]

export default function Home() {
<<<<<<< Updated upstream
  const leadNews = newsData[0]
  const news = newsData.slice(1, 5)
  const sourceBackedGuides = guidesData.filter(isIndexableGuide)
  const guides = sourceBackedGuides.slice(0, 6)
  const homepageItems = [
    { name: 'Official Source Roundups', url: '/official' },
    { name: 'Source-Backed Guides', url: '/guides' },
    { name: 'Planning Tools', url: '/tools' },
    { name: 'News Updates', url: '/news' },
    { name: 'Editorial Policy', url: '/editorial-policy' },
=======
  const leadCards = newsData.slice(0, 2)
  const latestNews = newsData.slice(2, 6)
  const guideList = guidesData.filter(isIndexableGuide).slice(0, 8)
  const featuredGuide = guideList[0]
  const featuredPokemon = pokemonData.slice(0, 6)
  const featuredHabitats = habitatsData.slice(0, 5)
  const featuredRecipes = recipesData.slice(0, 4)
  const homepageItems = [
    { name: 'Pokemon database', url: '/wiki/pokemon' },
    { name: 'Habitat routes', url: '/wiki/habitat' },
    { name: 'Recipe references', url: '/wiki/recipe' },
    { name: 'Guides', url: '/guides' },
    { name: 'Planning tools', url: '/tools' },
>>>>>>> Stashed changes
  ]

  return (
    <main className="wiki-home">
      <WebPageJsonLd
        type="CollectionPage"
        name="Pokopia Wiki, Guides, and Tools"
        description="Pokopia wiki homepage for official source notes, Pokemon pages, habitat routes, recipes, guides, news updates, and planning tools."
        url="/"
        dateModified="2026-08-04"
      />
      <ItemListJsonLd
        name="Pokopia Wiki primary sections"
        description="Primary wiki sections on Pokopia Portal."
        url="/"
        items={homepageItems}
      />
<<<<<<< Updated upstream
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-kicker">Explorer Field Guide</p>
          <h1>Pokopia Wiki, Guides, and Tools</h1>
          <p>Start with official source notes, source-backed route guides, and planning tools before using editorial database pages.</p>
          <div className="hero-actions" aria-label="Pokopia quick sections">
            <a href="/official">Official Source Roundups</a>
            <a href="/guides">Source-Backed Guides</a>
            <a href="/tools">Planning Tools</a>
          </div>
        </div>
      </section>
=======
>>>>>>> Stashed changes

      <div className="wiki-page-tabs" aria-label="Page actions">
        <a href="/" aria-current="page">Main Page</a>
        <a href="/official">Read</a>
        <a href="/source-policy">View source</a>
        <a href="/corrections">View history</a>
        <a href="/search">Search</a>
      </div>

<<<<<<< Updated upstream
      <section className="home-dashboard" aria-label="Pokopia homepage highlights">
        <div className="lead-story">
          <a href={`/news/${leadNews.slug}`} className="lead-story-link">
            <CreditedImage src={leadNews.image_url} alt={leadNews.image_alt} source={leadNews.image_source} sourceUrl={leadNews.image_source_url} licenseNote={leadNews.image_license_note} originalMedia={leadNews.image_original_media} rightsStatus={leadNews.image_rights_status} className="lead-cover" sizes="(max-width: 768px) 100vw, 620px" priority creditLink={false} />
            <span className={`badge ${leadNews.category}`}>
              {categoryLabels[leadNews.category] || leadNews.category}
            </span>
            <h2>{leadNews.title}</h2>
            <p>{leadNews.excerpt}</p>
=======
      <div className="wiki-shell">
        <aside className="wiki-sidebar" aria-label="Wiki navigation">
          <a className="wiki-sidebar-logo" href="/">
            <img src="/logo.svg" alt="Pokopia Portal logo" width={58} height={58} />
            <strong>Pokopia Wiki</strong>
>>>>>>> Stashed changes
          </a>
          {sideGroups.map((group) => (
            <section key={group.title} className="wiki-side-box">
              <h2>{group.title}</h2>
              <nav>
                {group.links.map((link) => (
                  <a key={link.href} href={link.href}>{link.label}</a>
                ))}
              </nav>
            </section>
          ))}
        </aside>

        <section className="wiki-main-column" aria-label="Pokopia wiki main page">
          <nav className="wiki-game-tabs" aria-label="Main wiki sections">
            <a href="/official" className="is-active">Pokopia</a>
            <a href="/guides">Guides</a>
            <a href="/wiki/pokemon">Pokemon</a>
            <a href="/wiki/habitat">Habitats</a>
            <a href="/wiki/recipe">Recipes</a>
          </nav>

          <section className="wiki-feature-grid" aria-label="Featured updates">
            {leadCards.map((item, index) => (
              <a key={item.id} href={`/news/${item.slug}`} className="wiki-feature-card">
                <CreditedImage
                  src={item.image_url}
                  alt={item.image_alt}
                  source={item.image_source}
                  sourceUrl={item.image_source_url}
                  licenseNote={item.image_license_note}
                  originalMedia={item.image_original_media}
                  rightsStatus={item.image_rights_status}
                  className="wiki-feature-image"
                  sizes="(max-width: 900px) 100vw, 430px"
                  priority={index === 0}
                  creditLink={false}
                />
                <span>{index === 0 ? 'Latest' : 'Upcoming'}</span>
                <h1>{item.title}</h1>
                <p>{item.excerpt}</p>
              </a>
            ))}
          </section>

          <section className="wiki-panel wiki-tiles-panel">
            <div className="wiki-panel-title">
              <h2>Pokopia wiki categories</h2>
              <a href="/search">Find a page</a>
            </div>
            <div className="wiki-tile-grid">
              {wikiTiles.map((tile) => (
                <a key={tile.href} href={tile.href} className="wiki-tile">
                  <span>{tile.icon}</span>
                  <strong>{tile.label}</strong>
                  <small>{tile.detail}</small>
                </a>
              ))}
            </div>
<<<<<<< Updated upstream
          </div>
          <div className="briefing-panel official-panel">
            <span className="panel-kicker">Official Sources</span>
            <h2>Confirmed Info</h2>
            <p>Check source-backed release, gameplay, multiplayer, and beginner notes before reading editorial route advice.</p>
            <a className="panel-link" href="/official">Open source roundup hub</a>
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
          <a href="/official">Open source roundup hub</a>
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
=======
          </section>

          <section className="wiki-two-column">
            <article className="wiki-panel">
              <div className="wiki-panel-title">
                <h2>About Pokopia</h2>
                <a href="/official/gameplay-overview">Gameplay overview</a>
              </div>
              <p>
                Pokopia Portal is an independent wiki for Pokemon Pokopia players. It separates official source notes,
                editorial guide advice, database references, and planning tools so readers can tell confirmed information
                from route planning suggestions.
              </p>
              <div className="wiki-button-row">
                <a href="/official">Official sources</a>
                <a href="/guides">Beginner guides</a>
                <a href="/tools">Planning tools</a>
>>>>>>> Stashed changes
              </div>
            </article>

            <article className="wiki-panel">
              <div className="wiki-panel-title">
                <h2>Featured guide</h2>
                <a href="/guides">Read more</a>
              </div>
              {featuredGuide ? (
                <>
                  <h3>{featuredGuide.title}</h3>
                  <p>{featuredGuide.answer}</p>
                  <a className="wiki-wide-button" href={`/guides/${featuredGuide.slug}`}>Open guide</a>
                </>
              ) : (
                <p>Source-backed guides will appear here after review.</p>
              )}
            </article>
          </section>

          <section className="wiki-panel">
            <div className="wiki-panel-title">
              <h2>Pokemon and route shortcuts</h2>
              <a href="/wiki/pokemon">All Pokemon</a>
            </div>
            <div className="wiki-list-columns">
              <div>
                <h3>Pokemon</h3>
                {featuredPokemon.map((pokemon) => (
                  <a key={pokemon.id} href={`/wiki/pokemon/${pokemon.id}`}>
                    <span>{pokemon.name}</span>
                    <small>{pokemon.type} / {pokemon.rarity}</small>
                  </a>
                ))}
              </div>
              <div>
                <h3>Habitats</h3>
                {featuredHabitats.map((habitat) => (
                  <a key={habitat.id} href={`/wiki/habitat/${habitat.id}`}>
                    <span>{habitat.name}</span>
                    <small>{habitat.weather} / {habitat.difficulty}</small>
                  </a>
                ))}
              </div>
              <div>
                <h3>Recipes</h3>
                {featuredRecipes.map((recipe) => (
                  <a key={recipe.id} href={`/wiki/recipe/${recipe.id}`}>
                    <span>{recipe.name}</span>
                    <small>{recipe.rarity} / {recipe.effect_duration}</small>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </section>

<<<<<<< Updated upstream
      <section className="content-lanes">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Source-Backed Planning</span>
            <h2>Approved Guides</h2>
          </div>
          <a href="/guides">View all guides</a>
        </div>
        <div className="guide-lane-grid">
          {guides.map((item) => (
            <a key={item.id} href={`/guides/${item.slug}`} className="card">
              <CreditedImage src={item.image_url} alt={item.image_alt} source={item.image_source} sourceUrl={item.image_source_url} licenseNote={item.image_license_note} originalMedia={item.image_original_media} rightsStatus={item.image_rights_status} creditLink={false} />
              <span className="badge">{categoryLabels[item.category] || item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.answer}</p>
            </a>
          ))}
        </div>
      </section>
=======
        <aside className="wiki-right-rail" aria-label="Wiki sidebar panels">
          <section className="wiki-card wiki-welcome">
            <img src="/logo.svg" alt="" width={90} height={90} />
            <h2>Pokopia Wiki</h2>
            <p>Welcome to an independent wiki for Pokopia guides, Pokemon pages, tools, and official source notes.</p>
            <div>
              <strong>{pokemonData.length}</strong><span>Pokemon</span>
              <strong>{habitatsData.length}</strong><span>Habitats</span>
              <strong>{recipesData.length}</strong><span>Recipes</span>
            </div>
          </section>
>>>>>>> Stashed changes

          <section className="wiki-card">
            <h2>Did you know...</h2>
            <ul>
              <li>Official pages separate confirmed systems from editorial planning advice.</li>
              <li>The spawn tracker can filter by habitat, weather, time, rarity, food, and drops.</li>
              <li>Recipe pages link back to related Pokemon and habitats for route planning.</li>
            </ul>
            <a className="wiki-wide-button" href="/features/meta-analysis">More facts</a>
          </section>

<<<<<<< Updated upstream
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
              <CreditedImage src={item.image_url} alt={item.image_alt} source={item.image_source} sourceUrl={item.image_source_url} licenseNote={item.image_license_note} originalMedia={item.image_original_media} rightsStatus={item.image_rights_status} creditLink={false} />
              <span className={`badge ${item.category}`}>
                {categoryLabels[item.category] || item.category}
              </span>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
            </a>
          ))}
        </div>
      </section>
=======
          <section className="wiki-card">
            <h2>Help improve the wiki</h2>
            <p>Found outdated information, unclear source notes, or attribution issues? Send a correction request.</p>
            <div className="wiki-split-buttons">
              <a href="/corrections">Start here</a>
              <a href="/contact">Need help?</a>
            </div>
          </section>

          <section className="wiki-card">
            <h2>Wiki tools</h2>
            <div className="wiki-small-tool-grid">
              <a href="/tools/habitat-planner">Habitat Planner</a>
              <a href="/tools/recipe-calculator">Recipe Calculator</a>
              <a href="/tools/spawn-tracker">Spawn Tracker</a>
            </div>
          </section>

          <section className="wiki-card">
            <h2>Wiki news</h2>
            {latestNews.map((item) => (
              <a key={item.id} href={`/news/${item.slug}`} className="wiki-news-line">
                <strong>{categoryLabels[item.category] || item.category}</strong>
                <span>{item.title}</span>
              </a>
            ))}
          </section>
        </aside>
      </div>
>>>>>>> Stashed changes
    </main>
  )
}
