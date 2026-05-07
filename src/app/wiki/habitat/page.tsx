'use client'

import { useEffect, useState } from 'react'

interface Habitat {
  id: string
  name: string
  unlock_condition: string
  difficulty: string
  weather: string
  resource_bonus: string
}

const difficultyEmoji: Record<string, string> = {
  'easy': '🟢',
  'medium': '🟡',
  'hard': '🔴',
}

const weatherEmoji: Record<string, string> = {
  'Sunny': '☀️', 'Rain': '🌧️', 'Snow': '❄️', 'Cloudy': '☁️',
  'Windy': '💨', 'Thunderstorm': '⛈️', 'Foggy': '🌫️', 'Clear': '✨',
  'Stormy': '🌪️',
}

export default function HabitatPage() {
  const [habitats, setHabitats] = useState<Habitat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/habitats.json')
      .then((res) => res.json())
      .then((data) => {
        setHabitats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🏠 Habitats</h1>
      <p>Explore all habitats in Pokopia</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="pokemon-grid" style={{ marginTop: '2rem' }}>
          {habitats.map((h) => (
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
      )}
    </main>
  )
}
