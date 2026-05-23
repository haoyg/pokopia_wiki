import { Metadata } from 'next'
import Image from 'next/image'
import habitatsData from '@/data/habitats.json'
import { canonicalUrl } from '@/lib/site'

const weatherIconMap: Record<string, string> = {
  'Sunny': '/icons/habitat-forest.svg', 'Rain': '/icons/habitat-lake.svg',
  'Snow': '/icons/habitat-frost.svg', 'Cloudy': '/icons/habitat-plains.svg',
  'Windy': '/icons/habitat-plains.svg', 'Thunderstorm': '/icons/habitat-volcanic.svg',
  'Foggy': '/icons/habitat-shadow.svg', 'Clear': '/icons/habitat-forest.svg',
  'Stormy': '/icons/habitat-shadow.svg',
}

const difficultyEmoji: Record<string, string> = {
  'easy': '🟢', 'medium': '🟡', 'hard': '🔴',
}

function getWeatherIcon(weather: string): string {
  for (const key of Object.keys(weatherIconMap)) {
    if (weather.toLowerCase().includes(key.toLowerCase())) return weatherIconMap[key]
  }
  return '/icons/habitat-forest.svg'
}

export const metadata: Metadata = {
  title: 'Habitat Maps & Locations | Pokopia Portal',
  description: 'Explore all habitats in Pokopia. Find unlock conditions, difficulty ratings, resource bonuses, and recommended builds.',
  openGraph: {
    title: 'Habitats | Pokopia Portal',
    description: 'Explore all habitats in Pokopia. Find unlock conditions, difficulty ratings, and resource bonuses.',
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
            <div style={{ width: '100%', height: '80px', position: 'relative', marginBottom: '0.5rem' }}>
              <Image
                src={getWeatherIcon(h.weather)}
                alt={h.name}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 100px, 200px"
              />
            </div>
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
