import habitatsData from '@/data/habitats.json'

const difficultyEmoji: Record<string, string> = {
  'easy': '🟢', 'medium': '🟡', 'hard': '🔴',
}

const weatherEmoji: Record<string, string> = {
  'Sunny': '☀️', 'Rain': '🌧️', 'Snow': '❄️', 'Cloudy': '☁️',
  'Windy': '💨', 'Thunderstorm': '⛈️', 'Foggy': '🌫️', 'Clear': '✨',
  'Stormy': '🌪️',
}

export default function HabitatPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🏠 Habitats</h1>
      <p>Explore all habitats in Pokopia</p>

      <div className="pokemon-grid" style={{ marginTop: '2rem' }}>
        {habitatsData.map((h) => (
          <a key={h.id} href={`/wiki/habitat/${h.id}`} className="card">
            <div style={{ fontSize: '2.5rem', textAlign: 'center' }}>
              {weatherEmoji[h.weather] || '🏠'}
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