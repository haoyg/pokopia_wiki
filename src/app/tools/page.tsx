import { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Game Tools & Calculators | Pokopia Portal',
  description: 'Use Pokopia tools and calculators. Habitat planner, recipe calculator, team builder, and spawn tracker.',
  openGraph: {
    title: 'Tools | Pokopia Portal',
    description: 'Use Pokopia tools and calculators. Habitat planner, recipe calculator, team builder, and spawn tracker.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/tools'),
  },
}

export default function ToolsPage() {
  return (
    <main className="page-shell">
      <section className="page-hero">
        <h1>Tools</h1>
        <p>Calculators and planners for Pokopia</p>
      </section>

      <div className="tools-grid">
        <a href="/tools/habitat-planner" className="card">
          <h3>Habitat Planner</h3>
          <p>Plan your progression by level</p>
        </a>
        <a href="/tools/recipe-calculator" className="card">
          <h3>Recipe Calculator</h3>
          <p>Calculate buff effects</p>
        </a>
        <a href="/tools/team-builder" className="card">
          <h3>Team Builder</h3>
          <p>Build your ultimate team</p>
        </a>
        <a href="/tools/spawn-tracker" className="card">
          <h3>Spawn Tracker</h3>
          <p>Track spawn conditions by habitat, weather, time, and rarity</p>
        </a>
      </div>
    </main>
  )
}
