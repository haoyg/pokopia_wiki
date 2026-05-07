'use client'

import { useEffect, useState } from 'react'

interface Habitat {
  id: string
  name: string
  unlock_condition: string
  spawn_list: string
  weather: string
  difficulty: string
  resource_bonus: string
}

export default function HabitatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [habitat, setHabitat] = useState<Habitat | null>(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string>('')

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return
    fetch(`/api/habitats/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setHabitat(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <p>Loading...</p>
  if (!habitat) return <p>Habitat not found</p>

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{habitat.name}</h1>
      <p>{habitat.unlock_condition}</p>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <h4>Weather</h4>
          <p>{habitat.weather}</p>
        </div>
        <div>
          <h4>Difficulty</h4>
          <p>{habitat.difficulty}</p>
        </div>
        <div>
          <h4>Resource Bonus</h4>
          <p>{habitat.resource_bonus}</p>
        </div>
        <div>
          <h4>Spawns</h4>
          <p>{habitat.spawn_list}</p>
        </div>
      </div>
    </main>
  )
}
