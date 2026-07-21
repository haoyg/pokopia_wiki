import { Metadata } from 'next'
import guidesData from '@/data/guides.json'
import { canonicalUrl } from '@/lib/site'
import { CreditedImage } from '@/components/media/CreditedImage'
import { OfficialContext } from '@/components/content/OfficialContext'
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'
import { isIndexableGuide } from '@/lib/indexing'

const categoryLabels: Record<string, string> = {
  tier: 'Tier',
  guides: 'Guide',
  farming: 'Farming',
  team: 'Team',
}

const guideTracks = [
  {
    title: 'Source-Backed Routes',
    text: 'Start with practical guides that link directly to official Nintendo or Pokemon source pages.',
    links: ['how-to-build-first-house', 'pokemon-center-pc-daily-routine', 'town-visit-multiplayer-guide'],
  },
  {
    title: 'Confirmed Systems',
    text: 'Use official context before applying any route planning advice.',
    links: [],
  },
  {
    title: 'Planning Tools',
    text: 'Use tools for database-driven planning, then check each page’s source or editorial status before acting on a recommendation.',
    links: [],
  },
]

function shortText(text: string, length = 145) {
  if (text.length <= length) return text
  return `${text.slice(0, length).trim()}...`
}

export const metadata: Metadata = {
  title: 'Pokopia Guides: Walkthroughs and Routes',
  description: 'Find source-backed Pokopia route guides, official context, and planning tools separated from broader editorial guide drafts.',
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
    title: 'Pokopia Guides: Walkthroughs and Routes',
    description: 'Source-backed route guides, official context, and planning tools for Pokopia.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Guides: Walkthroughs and Routes',
    description: 'Source-backed route guides, official context, and planning tools for Pokopia.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/guides'),
  },
}

export default function GuidesPage() {
  const publishedGuides = guidesData.filter(isIndexableGuide)
  const sourceBackedGuides = publishedGuides.filter((guide) => guide.data_status === 'Source-backed guide')
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
        description="Source-backed route guides and official-context planning pages for Pokopia players."
        url="/guides"
        items={publishedGuides.map((guide) => ({
          name: guide.title,
          url: `/guides/${guide.slug}`,
        }))}
      />
      <section className="page-hero">
        <h1>Pokopia Guides</h1>
        <p>Official-source guides and editorial planning pages are labeled separately, so you can see what is confirmed before using route advice.</p>
      </section>

      <OfficialContext
        title="Check Confirmed Systems First"
        description="Use official source pages for confirmed gameplay, release, and beginner details. Individual guides add editorial route advice on top of that baseline."
      />

      <section className="features-lead-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Official-Source Guides</span>
            <h2>Start With Confirmed Systems</h2>
          </div>
          <span>{sourceBackedGuides.length} source-backed guides</span>
        </div>
        <div className="features-topic-grid">
          {sourceBackedGuides.map((guide) => (
          <a key={guide.id} href={`/guides/${guide.slug}`} className="feature-hero">
            <span>{guide.data_status}</span>
            <h2>{guide.title}</h2>
            <p>
              {guide.answer}
            </p>
            <div className="feature-read-time">{guide.steps.length} reviewed route checks</div>
          </a>
          ))}
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
                {track.links.length > 0 ? track.links.map((slug) => {
                  const guide = findGuide(slug)
                  if (!guide) return null
                  return (
                    <a key={slug} href={`/guides/${guide.slug}`}>
                      {guide.title}
                    </a>
                  )
                }) : (
                  <>
                    {track.title === 'Confirmed Systems' && (
                      <>
                        <a href="/official/gameplay-overview">Gameplay overview</a>
                        <a href="/official/official-beginner-tips">Official beginner tips</a>
                      </>
                    )}
                    {track.title === 'Planning Tools' && (
                      <>
                        <a href="/tools/habitat-planner">Habitat Planner</a>
                        <a href="/tools/recipe-calculator">Recipe Calculator</a>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="guides-grid">
        {publishedGuides.map((guide) => (
          <a key={guide.id} href={`/guides/${guide.slug}`} className="card">
            <CreditedImage src={guide.image_url} alt={guide.image_alt} source={guide.image_source} sourceUrl={guide.image_source_url} licenseNote={guide.image_license_note} originalMedia={guide.image_original_media} rightsStatus={guide.image_rights_status} creditLink={false} />
            <div className="index-card-badges">
              <span className="badge">{categoryLabels[guide.category] || guide.category}</span>
              <span className="badge announcement">{guide.data_status}</span>
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
