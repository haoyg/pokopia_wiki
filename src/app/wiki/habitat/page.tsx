import { Metadata } from 'next'
import habitatsData from '@/data/habitats.json'
import { canonicalUrl } from '@/lib/site'
import { CreditedImage } from '@/components/media/CreditedImage'

const difficultyEmoji: Record<string, string> = {
  'easy': '🟢', 'medium': '🟡', 'hard': '🔴',
}

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
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🏠 Habitats</h1>
      <p>Explore all habitats in Pokopia</p>

      <div className="pokemon-grid" style={{ marginTop: '2rem' }}>
        {habitatsData.map((h) => (
          <a key={h.id} href={`/wiki/habitat/${h.id}`} className="card">
            <CreditedImage src={h.image_url} alt={h.image_alt || h.name} source={h.image_source} sourceUrl={h.image_source_url} licenseNote={h.image_license_note} />
            <h3 style={{ textAlign: 'center', marginTop: '0.5rem' }}>{h.name}</h3>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.875rem' }}>{h.unlock_condition}</p>
            <div style={{ textAlign: 'center', marginTop: '0.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
              <span className={`badge ${h.difficulty}`}>{difficultyEmoji[h.difficulty]} {h.difficulty}</span>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
