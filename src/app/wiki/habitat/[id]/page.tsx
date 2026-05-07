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

interface RelatedPokemon {
  id: string
  name: string
  type: string
}

interface RelatedGuide {
  id: string
  title: string
  slug: string
}

export default function HabitatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [habitat, setHabitat] = useState<Habitat | null>(null)
  const [relatedPokemon, setRelatedPokemon] = useState<RelatedPokemon[]>([])
  const [relatedGuides, setRelatedGuides] = useState<RelatedGuide[]>([])
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string>('')

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return

    Promise.all([
      fetch(`/api/habitats/${id}`),
      fetch('/api/pokemon'),
      fetch('/api/guides'),
    ])
      .then(([habRes, pokeRes, guideRes]) =>
        Promise.all([habRes.json(), pokeRes.json(), guideRes.json()])
      )
      .then(([habData, pokeData, guideData]) => {
        setHabitat(habData)
        if (habData.name) document.title = `${habData.name} | Pokopia Portal`
        // Filter pokemon that spawn in this habitat
        const spawns = (habData.spawn_list || '').split(',')
        const related = pokeData.filter((p: any) => spawns.includes(p.id))
        setRelatedPokemon(related.slice(0, 4))
        // Filter guides that mention this habitat
        const guides = guideData.filter((g: any) =>
          g.related_habitats?.includes(id)
        )
        setRelatedGuides(guides.slice(0, 3))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <p>Loading...</p>
  if (!habitat) return <p>Habitat not found</p>

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/wiki/habitat">Habitats</a>
        </nav>
      </header>

      <h1>{habitat.name}</h1>
      <p>{habitat.unlock_condition}</p>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <h4>Weather</h4>
          <p>{habitat.weather}</p>
        </div>
        <div>
          <h4>Difficulty</h4>
          <span className={`badge ${habitat.difficulty}`}>{habitat.difficulty}</span>
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

      <aside style={{ marginTop: '3rem', borderTop: '1px solid #ddd', paddingTop: '2rem' }}>
        <h3>Pokémon in this Habitat</h3>
        {relatedPokemon.length > 0 ? (
          <div className="pokemon-grid" style={{ marginTop: '1rem' }}>
            {relatedPokemon.map((p) => (
              <a key={p.id} href={`/wiki/pokemon/${p.id}`} className="card">
                <h4>{p.name}</h4>
                <p>{p.type}</p>
              </a>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666' }}>No Pokémon data yet.</p>
        )}

        <h3 style={{ marginTop: '2rem' }}>Related Guides</h3>
        {relatedGuides.length > 0 ? (
          <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
            {relatedGuides.map((g) => (
              <li key={g.id} style={{ marginBottom: '0.5rem' }}>
                <a href={`/guides/${g.slug}`}>{g.title}</a>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#666' }}>No related guides yet.</p>
        )}
      </aside>
    </main>
  )
}
