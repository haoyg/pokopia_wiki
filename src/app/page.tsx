import type { Metadata } from 'next'
import newsData from '@/data/news.json'
import guidesData from '@/data/guides.json'
import { canonicalUrl } from '@/lib/site'
import { CreditedImage } from '@/components/media/CreditedImage'
import { OfficialContext } from '@/components/content/OfficialContext'
import { DataStatus } from '@/components/content/DataStatus'
import { ItemListJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd'
import { isIndexableGuide } from '@/lib/indexing'

export const metadata: Metadata = {
  title: 'Pokopia Wiki: Guides, Map, Tools',
  description: 'Use Pokopia guides, map-style habitat routes, Pokemon wiki pages, walkthroughs, spawn tracker, team builder, and planning tools.',
  alternates: {
    canonical: canonicalUrl('/'),
  },
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
    links: [
      { href: '/news', label: 'News' },
      { href: '/news/pokemon-pokopia-pc-requests-daily-challenges', label: 'Daily context' },
    ],
  },
]

export default function Home() {
  const leadNews = newsData[0]
  const news = newsData.slice(1, 5)
  const sourceBackedGuides = guidesData.filter(isIndexableGuide)
  const guides = sourceBackedGuides.slice(0, 6)
  const homepageItems = [
    { name: 'Official Info', url: '/official' },
    { name: 'Source-Backed Guides', url: '/guides' },
    { name: 'Planning Tools', url: '/tools' },
    { name: 'News Updates', url: '/news' },
    { name: 'Editorial Policy', url: '/editorial-policy' },
  ]

  return (
    <main>
      <WebPageJsonLd
        type="CollectionPage"
        name="Pokopia Wiki, Guides, and Tools"
        description="Independent Pokopia homepage for official source notes, source-backed guides, planning tools, news updates, and trust policies."
        url="/"
        dateModified="2026-07-11"
      />
      <ItemListJsonLd
        name="Pokopia Portal primary sections"
        description="Primary source-aware sections on Pokopia Portal."
        url="/"
        items={homepageItems}
      />
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-kicker">Explorer Field Guide</p>
          <h1>Pokopia Wiki, Guides, and Tools</h1>
          <p>Start with official source notes, source-backed route guides, and planning tools before using editorial database pages.</p>
          <div className="hero-actions" aria-label="Pokopia quick sections">
            <a href="/official">Official Info</a>
            <a href="/guides">Source-Backed Guides</a>
            <a href="/tools">Planning Tools</a>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1120px', margin: '1.5rem auto 0', padding: '0 1rem' }}>
        <DataStatus
          status="Source-aware homepage"
          note="This homepage prioritizes official source roundups, reviewed guides, planning tools, and trust policies. Draft database pages remain outside the sitemap until reviewed."
          updatedAt="July 11, 2026"
        />
      </section>

      <section className="home-dashboard" aria-label="Pokopia homepage highlights">
        <div className="lead-story">
          <a href={`/news/${leadNews.slug}`} className="lead-story-link">
            <CreditedImage src={leadNews.image_url} alt={leadNews.image_alt} source={leadNews.image_source} sourceUrl={leadNews.image_source_url} licenseNote={leadNews.image_license_note} originalMedia={leadNews.image_original_media} className="lead-cover" sizes="(max-width: 768px) 100vw, 620px" priority creditLink={false} />
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
            <h2>Source-Backed Routes</h2>
            <p>Use the currently approved guide set first. Broader editorial guides remain available through internal navigation, but they are not treated as primary SEO pages.</p>
            <a className="panel-link" href="/guides">Open guide hub</a>
            <div className="briefing-list">
              {sourceBackedGuides.map((guide) => (
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
          <a href="/official">Open official hub</a>
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
            <span className="panel-kicker">Source-Backed Planning</span>
            <h2>Approved Guides</h2>
          </div>
          <a href="/guides">View all guides</a>
        </div>
        <div className="guide-lane-grid">
          {guides.map((item) => (
            <a key={item.id} href={`/guides/${item.slug}`} className="card">
              <CreditedImage src={item.image_url} alt={item.image_alt} source={item.image_source} sourceUrl={item.image_source_url} licenseNote={item.image_license_note} originalMedia={item.image_original_media} creditLink={false} />
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
            <span className="panel-kicker">Route Checks</span>
            <h2>Source-Backed Route Paths</h2>
          </div>
          <a href="/tools/habitat-planner">Open planner</a>
        </div>
        <div className="route-board-grid">
          {sourceBackedGuides.map((guide) => (
            <a key={guide.id} href={`/guides/${guide.slug}`} className="route-card">
              <span className={`badge ${guide.category}`}>{categoryLabels[guide.category] || guide.category}</span>
              <h3>{guide.title}</h3>
              <p>{guide.answer}</p>
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
              <CreditedImage src={item.image_url} alt={item.image_alt} source={item.image_source} sourceUrl={item.image_source_url} licenseNote={item.image_license_note} originalMedia={item.image_original_media} creditLink={false} />
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
