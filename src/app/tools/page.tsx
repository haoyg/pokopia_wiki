import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Game Tools & Calculators | Pokopia Portal',
  description: 'Use Pokopia tools and calculators. Habitat planner, recipe calculator, team builder, and spawn tracker.',
  openGraph: {
    title: 'Tools | Pokopia Portal',
    description: 'Use Pokopia tools and calculators. Habitat planner, recipe calculator, team builder, and spawn tracker.',
    images: ['/og-image.svg'],
  },
}

export default function ToolsPage() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>🛠️ Tools</h1>
      <p style={{ color: '#666', marginTop: '0.5rem' }}>Calculators and planners for Pokopia</p>

      <div className="tools-grid" style={{ marginTop: '2rem' }}>
        <a href="/tools/habitat-planner" className="card">
          <h3>🏠 Habitat Planner</h3>
          <p>Plan your progression by level</p>
        </a>
        <a href="/tools/recipe-calculator" className="card">
          <h3>🍳 Recipe Calculator</h3>
          <p>Calculate buff effects</p>
        </a>
        <a href="/tools/team-builder" className="card">
          <h3>⚔️ Team Builder</h3>
          <p>Build your ultimate team</p>
        </a>
        <a href="/tools/spawn-tracker" className="card">
          <h3>🎰 Spawn Tracker</h3>
          <p>Track spawn rates</p>
        </a>
      </div>
    </main>
  )
}