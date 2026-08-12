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

const wikiTiles = [
  { href: '/wiki/pokemon', label: 'Pokemon', image: '/images/pokemon/pikafire.svg', detail: 'Types, food, drops, spawn windows' },
  { href: '/wiki/habitat', label: 'Habitats', image: '/images/habitats/hab002-forest-valley.svg', detail: 'Route maps, weather, difficulty' },
  { href: '/wiki/recipe', label: 'Recipes', image: '/images/recipes/rec001-honey-cake.svg', detail: 'Buffs, ingredients, effect timing' },
  { href: '/guides', label: 'Guides', image: '/images/guides/best-starter-pokemon.svg', detail: 'Step-by-step route walkthroughs' },
  { href: '/official', label: 'Official', image: '/logo-mark.png', detail: 'Confirmed source notes only' },
  { href: '/news', label: 'News', image: '/images/news/pokopia-dive-update-cover.png', detail: 'Patch notes and event coverage' },
  { href: '/tools/spawn-tracker', label: 'Spawn Tracker', image: '/icons/grass.svg', detail: 'Filter by weather, time, food' },
  { href: '/tools/team-builder', label: 'Team Builder', image: '/icons/fire.svg', detail: 'Draft and score team comps' },
  { href: '/tools/habitat-planner', label: 'Habitat Planner', image: '/icons/ground.svg', detail: 'Plan multi-route farming sessions' },
  { href: '/tools/recipe-calculator', label: 'Calculator', image: '/icons/water.svg', detail: 'Compare recipe efficiency' },
]

export default function HomePage() {
  return (
    <main className="wiki-home">
      <WebPageJsonLd
        type="WebPage"
        name="Pokopia Wiki – Complete Game Guide, Pokemon Database & Tools"
        description="The independent Pokopia Wiki covers every Pokemon entry, habitat route, recipe, and planning tool."
        url="/"
        dateModified="2026-08-11"
      />

      {/* Wiki-style top bar */}
      <div className="wiki-page-tabs" aria-label="Page actions">
        <a href="/" aria-current="page">Main Page</a>
        <a href="/official">Read</a>
        <a href="/source-policy">View source</a>
        <a href="/corrections">View history</a>
        <a href="/search">Search</a>
      </div>

      <div className="wiki-shell">
        {/* Left sidebar */}
        <aside className="wiki-sidebar" aria-label="Wiki navigation">
          <a className="wiki-sidebar-logo" href="/">
            <img src="/logo.svg" alt="Pokopia Wiki logo" width={58} height={58} />
            <strong>Pokopia Wiki</strong>
          </a>

          <section className="wiki-side-box">
            <h2>Main navigation</h2>
            <nav>
              <a href="/">Main page</a>
              <a href="/official">Official sources</a>
              <a href="/guides">All guides</a>
              <a href="/news">Latest news</a>
            </nav>
          </section>

          <section className="wiki-side-box">
            <h2>Database</h2>
            <nav>
              <a href="/wiki/pokemon">Pokemon</a>
              <a href="/wiki/habitat">Habitats</a>
              <a href="/wiki/recipe">Recipes</a>
              <a href="/tools/spawn-tracker">Spawn tracker</a>
            </nav>
          </section>

          <section className="wiki-side-box">
            <h2>Planning tools</h2>
            <nav>
              <a href="/tools/habitat-planner">Habitat planner</a>
              <a href="/tools/recipe-calculator">Recipe calculator</a>
              <a href="/tools/team-builder">Team builder</a>
              <a href="/tools">All tools</a>
            </nav>
          </section>

          <section className="wiki-side-box">
            <h2>Trust &amp; policy</h2>
            <nav>
              <a href="/editorial-policy">Editorial policy</a>
              <a href="/source-policy">Source policy</a>
              <a href="/corrections">Corrections</a>
              <a href="/about">About this wiki</a>
            </nav>
          </section>
        </aside>

        {/* Main content */}
        <section className="wiki-main-column" aria-label="Pokopia wiki main content">

          {/* Game tabs */}
          <nav className="wiki-game-tabs" aria-label="Main wiki sections">
            <a href="/official" className="is-active">Pokopia</a>
            <a href="/guides">Guides</a>
            <a href="/wiki/pokemon">Pokemon</a>
            <a href="/wiki/habitat">Habitats</a>
            <a href="/wiki/recipe">Recipes</a>
          </nav>

          {/* Search */}
          <div className="wiki-search-box">
            <h1>Pokopia Wiki</h1>
            <p className="wiki-search-subtitle">
              The independent reference for Pokopia — every Pokemon, habitat, recipe, and planning tool.
            </p>
            <form className="site-search" action="/search" method="get" role="search" aria-label="Site search">
              <input
                type="search"
                name="q"
                placeholder="Search Pokemon, habitats, recipes, guides..."
                aria-label="Search the Pokopia Wiki"
              />
              <button type="submit">Search</button>
            </form>
            <div className="wiki-search-hints">
              <span>Popular:</span>
              <a href="/wiki/pokemon">Pokemon list</a>
              <a href="/wiki/habitat">Habitat routes</a>
              <a href="/guides/beginner-route">Beginner guide</a>
              <a href="/wiki/pokemon?view=collection">Collection list</a>
            </div>
          </div>

          {/* Wiki category tiles */}
          <div className="wiki-panel wiki-tiles-panel">
            <div className="wiki-panel-title">
              <h2>Browse the Pokopia Wiki</h2>
            </div>
            <div className="wiki-tile-grid">
              {wikiTiles.map((tile) => (
                <a key={tile.href} href={tile.href} className="wiki-tile">
                  <span><img src={tile.image} alt="" loading="lazy" decoding="async" /></span>
                  <strong>{tile.label}</strong>
                  <small>{tile.detail}</small>
                </a>
              ))}
            </div>
          </div>

          {/* Long-form overview: 1200+ words */}
          <article className="wiki-overview-section" aria-labelledby="overview-heading">
            <div className="wiki-panel">
              <div className="wiki-panel-title">
                <h2 id="overview-heading">What Is Pokopia? A Complete Game Guide</h2>
              </div>

              <p className="wiki-overview-lead">
                Pokopia is a free-to-play creature-collection game that blends habitat farming, recipe crafting,
                and team-building strategy into a single progression loop. Players capture and raise Pokemon across
                dozens of distinct environments, each with its own weather patterns, spawn windows, and rare drop
                tables. The Pokopia Wiki exists to document every confirmed system — Pokemon stats, habitat
                conditions, recipe buffs, and planning tools — so players can make informed decisions without
                sorting through outdated or speculative content.
              </p>

              <h3>How Pokopia&apos;s Core Loop Works</h3>
              <p>
                Every session in Pokopia starts with selecting a habitat to explore. Habitats are themed
                environments — forest valleys, volcanic caves, ocean shores — that determine which Pokemon
                can appear, what weather conditions affect spawn rates, and what materials drop when you
                succeed. Each habitat has a recommended difficulty rating and a resource bonus type, so
                choosing the right habitat for your current team strength is the first real strategic decision
                in the game.
              </p>
              <p>
                When you enter a habitat, you choose bait or lure items based on what Pokemon you want to
                attract. Each Pokemon has a favorite food, a preferred weather condition, and a spawn time
                window — day or night. Matching all three conditions improves your odds, but even partial
                matches can produce useful results. After a successful encounter, Pokemon drop materials
                that feed back into recipe crafting. Rare Pokemon drop rare materials; legendary Pokemon
                drop build-defining resources that take multiple farming sessions to accumulate.
              </p>

              <h3>Pokemon, Types, and Specialties</h3>
              <p>
                The Pokemon in Pokopia each belong to one or two elemental types, a rarity tier, and a
                specialty role. Type determines which moves deal super-effective damage and which matchups
                to avoid. Rarity — common, uncommon, rare, or legendary — primarily affects how often a
                Pokemon appears and what it drops, not raw strength. A well-built uncommon attacker often
                outperforms a poorly supported legendary.
              </p>
              <p>
                Specialty roles — Attacker, Defender, Support, Speedster, and All-Rounder — describe what
                a Pokemon is designed to do in a team fight, not just how it contributes to raw damage
                numbers. When assembling a team, mixing roles matters more than stacking high-rarity damage
                dealers. A balanced team with one Attacker, one Support, and one Defender will generally
                outperform three Attackers of higher rarity.
              </p>
              <p>
                Every Pokemon entry on this wiki lists its confirmed type combination, specialty role,
                habitat, favorite food, spawn time window, weather preference, and drop table. The individual
                Pokemon pages also include route-specific guidance: when to use a Pokemon, what mistakes
                to avoid, how to farm its drops efficiently, and which teammates complement its role.
              </p>

              <h3>Habitats, Weather, and Route Planning</h3>
              <p>
                Habitats are the primary unit of progression in Pokopia. Each habitat has a fixed set of
                Pokemon that can appear there, a weather cycle that affects spawn rates for specific
                types, and a difficulty rating that gates which players should attempt it. The game
                recommends specific team builds for each habitat, but those recommendations are starting
                points — experienced players often develop counter-strategies that work at lower investment.
              </p>
              <p>
                Weather is the most important variable in habitat planning. A habitat that produces
                excellent results in sunny conditions may be nearly impassable during rain. Before
                committing to a habitat run, check the current weather forecast in-game and compare it
                against the Pokemon you are targeting. The Spawn Tracker tool on this wiki lets you
                filter by weather, time of day, rarity, and food preference so you can identify the
                exact window when your target Pokemon is most likely to appear.
              </p>
              <p>
                Route planning in Pokopia is the practice of sequencing habitat visits to maximize
                material efficiency. Because different habitats produce different resource bonuses,
                players who plan multi-stop routes accumulate crafting materials faster than players
                who farm a single habitat repeatedly. The Habitat Planner tool helps you design routes
                that chain complementary habitats together, so a session that starts in Forest Valley
                can end in Volcanic Cave with no dead travel time between them.
              </p>

              <h3>Recipes, Buffs, and Crafting</h3>
              <p>
                Recipes in Pokopia produce buffs that apply to your team for a set duration. Some buffs
                increase spawn rates for specific Pokemon types; others improve material drop rates,
                reduce the stamina cost of habitat exploration, or grant temporary stat boosts to your
                active team. Each recipe has a rarity, an ingredient list, a buff type, and an effect
                duration. Higher-rarity recipes last longer and apply stronger buffs, but they also
                require rarer ingredients that take more farming sessions to gather.
              </p>
              <p>
                The Recipe Calculator tool lets you compare recipes side-by-side, see which ingredients
                you already have in inventory, and identify which recipes are most efficient given your
                current resource state. This matters especially when you are building toward a legendary
                recipe that requires multiple rare drops — calculating the opportunity cost of each
                ingredient before committing to a craft prevents wasted farming runs.
              </p>

              <h3>How to Use This Wiki</h3>
              <p>
                This Pokopia Wiki is organized into five primary sections: Pokemon, Habitats, Recipes,
                Guides, and Tools. Each Pokemon page functions as a mini route guide — it tells you
                where to find the Pokemon, what conditions maximize your spawn odds, what mistakes to
                avoid, and which teammates work well with it. Habitat pages document weather dependencies,
                difficulty ratings, recommended builds, and spawn lists so you can evaluate whether a
                habitat is worth visiting before committing a session to it.
              </p>
              <p>
                The Guides section covers high-level questions — how to start, how to build your first
                team, how to farm efficiently, how to interpret patch notes — using a one-question-per-page
                format inspired by GameWith. Each guide is written to answer one specific question with
                actionable steps, so you can find the exact information you need without reading through
                general background material.
              </p>
              <p>
                The Tools section hosts the Spawn Tracker, Habitat Planner, Recipe Calculator, and Team
                Builder. These are interactive planning utilities, not static reference pages. The Spawn
                Tracker filters the Pokemon database by habitat, weather, time of day, rarity, and food
                type so you can identify target Pokemon before starting a session. The Team Builder helps
                you draft team compositions and evaluates role coverage. All tools are free to use and
                require no account.
              </p>

              <h3>Editorial Standards and Source Policy</h3>
              <p>
                Every page on this wiki distinguishes between confirmed information and editorial
                guidance. Confirmed information — Pokemon types, spawn windows, weather dependencies,
                drop tables, recipe ingredients — comes from in-game observation, official developer
                posts, or verified patch notes. Editorial guidance — route recommendations, build
                suggestions, farming priorities, team composition advice — is clearly labeled as
                opinion and represents the author&apos;s best assessment based on available data.
              </p>
              <p>
                Pages that aggregate confirmed information from multiple official sources are labeled
                as official pages and carry a distinct visual treatment. Pages that offer editorial
                route planning are labeled as guides. This separation exists so readers can calibrate
                their trust accordingly. If a page lacks a source note or editorial label, treat it
                as unverified planning data until it receives a full editorial review.
              </p>
              <p>
                Found an error, outdated information, or a missing Pokemon entry? Use the Corrections
                page to submit a fix. All submitted corrections are reviewed against primary sources
                before being applied. We do not publish unverified claims, datamined content presented
                as confirmed, or speculation about future updates.
              </p>

              <h3>Quick Links by Goal</h3>
              <ul>
                <li>
                  <strong>New to Pokopia?</strong> Start with the{' '}
                  <a href="/guides/beginner-route">Beginner Route Guide</a>, then browse{' '}
                  <a href="/wiki/pokemon">all Pokemon</a> to pick your first team core.
                </li>
                <li>
                  <strong>Want to farm rare materials?</strong> Check the{' '}
                  <a href="/wiki/habitat">Habitat list</a>, use the{' '}
                  <a href="/tools/spawn-tracker">Spawn Tracker</a> to find the right weather window,
                  and plan your route with the <a href="/tools/habitat-planner">Habitat Planner</a>.
                </li>
                <li>
                  <strong>Need team composition help?</strong> Use the{' '}
                  <a href="/tools/team-builder">Team Builder</a> to draft a balanced roster,
                  then cross-reference type matchups on individual Pokemon pages.
                </li>
                <li>
                  <strong>Looking for a specific Pokemon?</strong> Search by name in the header
                  bar, or browse the <a href="/wiki/pokemon">Pokemon database</a> filtered by
                  type, rarity, or habitat.
                </li>
                <li>
                  <strong>Want to optimize crafting?</strong> Open the{' '}
                  <a href="/tools/recipe-calculator">Recipe Calculator</a>, input your
                  current ingredients, and compare buff efficiency across rarity tiers.
                </li>
              </ul>
            </div>
          </article>

          {/* Getting started CTA */}
          <div className="wiki-cta-panel">
            <div className="wiki-panel">
              <h2>Start Exploring Pokopia</h2>
              <div className="wiki-cta-grid">
                <a href="/wiki/pokemon" className="wiki-cta-card">
                  <strong>Browse Pokemon</strong>
                  <span>50+ entries with types, drops, and route tips</span>
                </a>
                <a href="/guides" className="wiki-cta-card">
                  <strong>Read Guides</strong>
                  <span>Step-by-step answers to common questions</span>
                </a>
                <a href="/tools" className="wiki-cta-card">
                  <strong>Use Planning Tools</strong>
                  <span>Spawn tracker, team builder, habitat planner</span>
                </a>
                <a href="/news" className="wiki-cta-card">
                  <strong>Follow News</strong>
                  <span>Patch notes, events, and update coverage</span>
                </a>
              </div>
            </div>
          </div>

        </section>

        {/* Right rail */}
        <aside className="wiki-right-rail" aria-label="Wiki sidebar panels">
          <section className="wiki-card wiki-welcome">
            <img src="/logo.svg" alt="" width={90} height={90} />
            <h2>Pokopia Wiki</h2>
            <p>The independent reference for Pokopia players. Browse Pokemon, habitats, recipes, guides, and planning tools.</p>
          </section>

          <section className="wiki-card">
            <h2>How to use this wiki</h2>
            <ul>
              <li>Search by Pokemon name, habitat, or recipe</li>
              <li>Filter the Pokemon list by type, rarity, or role</li>
              <li>Use Spawn Tracker to plan around weather</li>
              <li>Check individual pages for confirmed drop tables</li>
              <li>Read one-question guides for specific decisions</li>
            </ul>
            <a className="wiki-wide-button" href="/editorial-policy">Editorial policy</a>
          </section>

          <section className="wiki-card">
            <h2>Source types on this wiki</h2>
            <ul>
              <li><strong>Official</strong> — confirmed by developer posts or patch notes</li>
              <li><strong>Guides</strong> — editorial route planning and recommendations</li>
              <li><strong>Database</strong> — unverified editorial data, review in progress</li>
            </ul>
            <a className="wiki-wide-button" href="/source-policy">Source policy</a>
          </section>

          <section className="wiki-card">
            <h2>Popular pages</h2>
            <div className="wiki-popular-list">
              <a href="/wiki/pokemon/pkm001">Pikafire — Fire/Electric Attacker</a>
              <a href="/wiki/habitat/hab001">Volcanic Cave — Fire habitat guide</a>
              <a href="/wiki/recipe/rec001">Honey Cake — Attacker buff recipe</a>
              <a href="/guides/beginner-route">Beginner Route Guide</a>
              <a href="/guides/rare-farming-route">Rare Farming Route</a>
            </div>
          </section>

          <section className="wiki-card">
            <h2>Planning tools</h2>
            <div className="wiki-small-tool-grid">
              <a href="/tools/habitat-planner">Habitat Planner</a>
              <a href="/tools/recipe-calculator">Recipe Calculator</a>
              <a href="/tools/spawn-tracker">Spawn Tracker</a>
            </div>
          </section>
        </aside>
      </div>
    </main>
  )
}
