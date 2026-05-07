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

export default function HabitatPage() {
  const [habitats, setHabitats] = useState<Habitat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/habitats')
      .then((res) => res.json())
      .then((data) => {
        setHabitats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Habitats</h1>
      <p>Explore all habitats in Pokopia</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="pokemon-grid" style={{ marginTop: '2rem' }}>
          {habitats.map((h) => (
            <a key={h.id} href={`/wiki/habitat/${h.id}`} className="card">
              <h3>{h.name}</h3>
              <p>{h.unlock_condition}</p>
              <span className={`badge ${h.difficulty}`}>{h.difficulty}</span>
            </a>
          ))}
        </div>
      )}
    </main>
  )
}
