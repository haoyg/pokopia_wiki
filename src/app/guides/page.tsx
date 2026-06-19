import { Metadata } from 'next'
import guidesData from '@/data/guides.json'
import { canonicalUrl } from '@/lib/site'
import { CreditedImage } from '@/components/media/CreditedImage'
import { OfficialContext } from '@/components/content/OfficialContext'
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'

const categoryLabels: Record<string, string> = {
  tier: 'Tier',
  guides: 'Guide',
  farming: 'Farming',
  team: 'Team',
}

const guideTracks = [
  {
    title: 'Start Here',
    text: 'Use these guides for starter choice, early route planning, recipes, and basic habitat decisions.',
    links: ['best-starter-pokemon', 'training-grounds-beginners', 'complete-recipe-list'],
  },
  {
    title: 'Route Planning',
    text: 'Use these pages before entering harder habitats or spending rare recipes on repeated farming loops.',
    links: ['how-to-unlock-volcanic-cave', 'fast-farming-rare-pokemon', 'best-habitat-type-pokopia'],
  },
  {
    title: 'Team Direction',
    text: 'Use these guides when a route keeps failing and the issue is role balance rather than raw level.',
    links: ['best-fire-type-team', 'best-defense-team', 'best-grass-type-team'],
  },
]

function shortText(text: string, length = 145) {
  if (text.length <= length) return text
  return `${text.slice(0, length).trim()}...`
}

export const metadata: Metadata = {
  title: 'Pokopia Guides and Route Notes',
  description: 'Read source-aware Pokopia guides for starter choices, habitat routes, farming plans, recipes, and editorial team planning.',
  keywords: [
    'Pokopia guides',
    'Pokopia route guide',
    'Pokopia farming guide',
    'Pokopia how to',
    'Pokopia walkthrough',
    'Pokopia tips',
    'Pokopia starter guide',
    'Pokopia recipe guide',
  ],
  openGraph: {
    title: 'Pokopia Guides and Route Notes',
    description: 'Source-aware Pokopia guides for routes, farming, recipes, and team planning.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Guides and Route Notes',
    description: 'Source-aware Pokopia guides for routes, farming, recipes, and team planning.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/guides'),
  },
}

export default function GuidesPage() {
  const findGuide = (slug: string) => guidesData.find((guide) => guide.slug === slug)

  return (
    <main className="page-shell">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Guides', url: '/guides' },
        ]}
      />
      <ItemListJsonLd
        name="Pokopia Guides"
        description="Route notes, farming advice, starter picks, team planning, and recipe decisions for Pokopia players."
        url="/guides"
        items={guidesData.map((guide) => ({
          name: guide.title,
          url: `/guides/${guide.slug}`,
        }))}
      />
      <section className="page-hero">
        <h1>Pokopia Guides</h1>
        <p>Route notes, farming advice, starter picks, team planning, and recipe decisions for Pokopia players.</p>
      </section>

      <OfficialContext
        title="Check Confirmed Systems First"
        description="Use official source pages for confirmed gameplay, release, and beginner details. Individual guides add editorial route advice on top of that baseline."
      />

      <section className="features-lead-section">
        <div className="features-topic-grid">
          <a href="/guides/beginner-route" className="feature-hero">
            <span>Topic Route</span>
            <h2>Pokopia Beginner Route</h2>
            <p>
              A practical first path that connects starter choices, easy habitats, recipe timing,
              Pokemon pages, and planning tools before harder routes.
            </p>
            <div className="feature-read-time">Start here before choosing a long farming route</div>
          </a>
          <a href="/guides/rare-farming-route" className="feature-hero">
            <span>Topic Route</span>
            <h2>Pokopia Rare Farming Route</h2>
            <p>
              A focused route for rare and legendary checks, Lucky Charm timing, target habitats,
              recipe support, and tool workflow.
            </p>
            <div className="feature-read-time">Use this after the route is already mapped</div>
          </a>
          <a href="/guides/recipe-planning-route" className="feature-hero">
            <span>Topic Route</span>
            <h2>Pokopia Recipe Planning Route</h2>
            <p>
              A recipe workflow for choosing buffs by route objective, rarity cost, habitat risk,
              Pokemon targets, and tool checks.
            </p>
            <div className="feature-read-time">Use this before spending rare ingredients</div>
          </a>
        </div>
      </section>

      <section className="index-guide-panel">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Recommended Paths</span>
            <h2>Choose the Guide Track That Fits Your Next Run</h2>
          </div>
          <a href="/tools">Use planning tools</a>
        </div>
        <div className="index-guide-grid">
          {guideTracks.map((track) => (
            <div key={track.title} className="index-guide-card">
              <strong>{track.title}</strong>
              <p>{track.text}</p>
              <div>
                {track.links.map((slug) => {
                  const guide = findGuide(slug)
                  if (!guide) return null
                  return (
                    <a key={slug} href={`/guides/${guide.slug}`}>
                      {guide.title}
                    </a>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="guides-grid">
        {guidesData.map((guide) => (
          <a key={guide.id} href={`/guides/${guide.slug}`} className="card">
            <CreditedImage src={guide.image_url} alt={guide.image_alt} source={guide.image_source} sourceUrl={guide.image_source_url} licenseNote={guide.image_license_note} originalMedia={guide.image_original_media} />
            <div className="index-card-badges">
              <span className="badge">{categoryLabels[guide.category] || guide.category}</span>
            </div>
            <h3 className="index-card-title">{guide.title}</h3>
            <p className="index-card-summary">{shortText(guide.answer || guide.seo_keyword, 135)}</p>
            <dl className="index-card-facts">
              <div>
                <dt>Steps</dt>
                <dd>{guide.steps.length} route checks</dd>
              </div>
              <div>
                <dt>Setup</dt>
                <dd>{shortText(guide.recommended_setup[0], 76)}</dd>
              </div>
              <div>
                <dt>Watch For</dt>
                <dd>{shortText(guide.common_mistakes[0], 76)}</dd>
              </div>
            </dl>
          </a>
        ))}
      </div>
    </main>
  )
}
