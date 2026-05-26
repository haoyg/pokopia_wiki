import { Metadata } from 'next'
import guidesData from '@/data/guides.json'
import { canonicalUrl } from '@/lib/site'
import { CreditedImage } from '@/components/media/CreditedImage'
import { OfficialContext } from '@/components/content/OfficialContext'

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

export const metadata: Metadata = {
  title: 'Pokopia Guides and Route Notes',
  description: 'Read source-aware Pokopia guides for starter choices, habitat routes, farming plans, recipes, and editorial team planning.',
  openGraph: {
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
      <section className="page-hero">
        <h1>Pokopia Guides</h1>
        <p>Route notes, farming advice, starter picks, team planning, and recipe decisions for Pokopia players.</p>
      </section>

      <OfficialContext
        title="Check Confirmed Systems First"
        description="Use official source pages for confirmed gameplay, release, and beginner details. Individual guides add editorial route advice on top of that baseline."
      />

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
            <span className="badge">{categoryLabels[guide.category] || guide.category}</span>
            <h3>{guide.title}</h3>
            <p>{guide.answer || guide.seo_keyword}</p>
          </a>
        ))}
      </div>
    </main>
  )
}
