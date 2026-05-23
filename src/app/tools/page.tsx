import { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Pokopia Tools and Calculators',
  description: 'Use Pokopia database tools for habitat planning, recipe lookup, team notes, and spawn filtering.',
  openGraph: {
    title: 'Pokopia Tools and Calculators',
    description: 'Use Pokopia database tools for habitat planning, recipe lookup, team notes, and spawn filtering.',
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
        <p>Database tools for planning routes, recipes, Pokemon roles, and spawn filters.</p>
      </section>

      <div className="tools-grid">
        <a href="/tools/habitat-planner" className="card">
          <h3>Habitat Planner</h3>
          <p>Filter habitat database entries by level, difficulty, and weather.</p>
        </a>
        <a href="/tools/recipe-calculator" className="card">
          <h3>Recipe Calculator</h3>
          <p>Compare recipe ingredients, buffs, durations, and editorial use notes.</p>
        </a>
        <a href="/tools/team-builder" className="card">
          <h3>Team Builder</h3>
          <p>Draft a Pokemon group from current database roles and rarity fields.</p>
        </a>
        <a href="/tools/spawn-tracker" className="card">
          <h3>Spawn Tracker</h3>
          <p>Track spawn conditions by habitat, weather, time, and rarity</p>
        </a>
      </div>
    </main>
  )
}
