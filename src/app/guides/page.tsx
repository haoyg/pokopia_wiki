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

export const metadata: Metadata = {
  title: 'Game Guides & Tutorials | Pokopia Portal',
  description: 'Master Pokopia with our comprehensive game guides. Tier lists, farming tips, team builds, and strategy guides for all players.',
  openGraph: {
    title: 'Game Guides | Pokopia Portal',
    description: 'Master Pokopia with our comprehensive game guides. Tier lists, farming tips, team builds, and strategy guides.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/guides'),
  },
}

export default function GuidesPage() {
  return (
    <main className="page-shell">
      <section className="page-hero">
        <h1>Guides</h1>
        <p>Game guides and tutorials</p>
      </section>

      <OfficialContext
        title="Check Confirmed Systems First"
        description="Use official source pages for confirmed gameplay, release, and beginner details. Individual guides add editorial route advice on top of that baseline."
      />

      <div className="guides-grid">
        {guidesData.map((guide) => (
          <a key={guide.id} href={`/guides/${guide.slug}`} className="card">
            <CreditedImage src={guide.image_url} alt={guide.image_alt} source={guide.image_source} sourceUrl={guide.image_source_url} licenseNote={guide.image_license_note} />
            <span className="badge">{categoryLabels[guide.category] || guide.category}</span>
            <h3>{guide.title}</h3>
            <p>{guide.seo_keyword}</p>
          </a>
        ))}
      </div>
    </main>
  )
}
