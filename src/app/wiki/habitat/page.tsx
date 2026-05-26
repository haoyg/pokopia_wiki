import { Metadata } from 'next'
import habitatsData from '@/data/habitats.json'
import { canonicalUrl } from '@/lib/site'
import { CreditedImage } from '@/components/media/CreditedImage'

export const metadata: Metadata = {
  title: 'Habitat Maps and Route Notes',
  description: 'Explore Pokopia habitats with unlock conditions, weather, difficulty, resource bonuses, spawn lists, and editorial route notes.',
  openGraph: {
    title: 'Habitat Maps and Route Notes',
    description: 'Explore Pokopia habitats with unlocks, weather, difficulty, resources, and spawns.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/wiki/habitat'),
  },
}

export default function HabitatPage() {
  const difficultyCounts = habitatsData.reduce<Record<string, number>>((counts, habitat) => {
    counts[habitat.difficulty] = (counts[habitat.difficulty] || 0) + 1
    return counts
  }, {})
  const starterHabitats = habitatsData
    .filter((habitat) => habitat.difficulty === 'easy')
    .slice(0, 4)
  const hardHabitats = habitatsData
    .filter((habitat) => habitat.difficulty === 'hard')
    .slice(0, 4)

  return (
    <main className="page-shell">
      <section className="page-hero">
        <h1>Habitat Maps and Route Notes</h1>
        <p>Explore Pokopia habitats by unlock condition, weather, difficulty, resource bonus, and spawn route.</p>
      </section>

      <section className="index-guide-panel">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Route Index</span>
            <h2>Pick a Habitat by Risk and Reward</h2>
          </div>
          <a href="/tools/habitat-planner">Open Habitat Planner</a>
        </div>
        <div className="index-guide-grid">
          <div className="index-guide-card">
            <strong>Starter-safe areas</strong>
            <p>Use easy habitats for route learning, food checks, and low-cost farming before spending rare recipes.</p>
            <div>
              {starterHabitats.map((habitat) => (
                <a key={habitat.id} href={`/wiki/habitat/${habitat.id}`}>{habitat.name}</a>
              ))}
            </div>
          </div>
          <div className="index-guide-card">
            <strong>Hard route targets</strong>
            <p>Hard habitats should be scouted first, then repeated only when your team, recipe, and weather plan are stable.</p>
            <div>
              {hardHabitats.map((habitat) => (
                <a key={habitat.id} href={`/wiki/habitat/${habitat.id}`}>{habitat.name}</a>
              ))}
            </div>
          </div>
          <div className="index-guide-card">
            <strong>Difficulty spread</strong>
            <p>Use this spread to decide whether the next session should focus on progression, farming, or safer daily loops.</p>
            <div>
              {Object.entries(difficultyCounts).map(([difficulty, count]) => (
                <span key={difficulty}>{difficulty}: {count}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="pokemon-grid">
        {habitatsData.map((h) => (
          <a key={h.id} href={`/wiki/habitat/${h.id}`} className="card">
            <CreditedImage src={h.image_url} alt={h.image_alt || h.name} source={h.image_source} sourceUrl={h.image_source_url} licenseNote={h.image_license_note} originalMedia={h.image_original_media} />
            <h3 style={{ textAlign: 'center', marginTop: '0.5rem' }}>{h.name}</h3>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.875rem' }}>{h.unlock_condition}</p>
            <p style={{ textAlign: 'center', color: '#637083', fontSize: '0.78rem', marginTop: '0.35rem' }}>{h.weather} · {h.resource_bonus}</p>
            <div style={{ textAlign: 'center', marginTop: '0.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
              <span className={`badge ${h.difficulty}`}>{h.difficulty}</span>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
