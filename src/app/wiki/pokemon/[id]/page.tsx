'use client'

import { useEffect, useState } from 'react'

interface Pokemon {
  id: string
  name: string
  type: string
  rarity: string
  habitat: string
  favorite_food: string
  spawn_time: string
  weather: string
  specialty: string
  skills: string
  drops: string
  description: string
}

interface RelatedGuide {
  id: string
  title: string
  slug: string
  category: string
}

export default function PokemonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [relatedGuides, setRelatedGuides] = useState<RelatedGuide[]>([])
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string>('')

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return

    Promise.all([
      fetch(`/api/pokemon/${id}`),
      fetch('/api/guides'),
    ])
      .then(([pokemonRes, guidesRes]) =>
        Promise.all([pokemonRes.json(), guidesRes.json()])
      )
      .then(([pokemonData, guidesData]) => {
        setPokemon(pokemonData)
        // Update document title
        if (pokemonData.name) {
          document.title = `${pokemonData.name} | Pokopia Portal`
        }
        // Filter guides that mention this pokemon
        const related = guidesData.filter((g: any) =>
          g.related_pokemon?.includes(id)
        )
        setRelatedGuides(related.slice(0, 3))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <p>Loading...</p>
  if (!pokemon) return <p>Pokémon not found</p>

  return (
    <main>
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/wiki/pokemon">Pokémon</a>
        </nav>
      </header>

      <article style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>{pokemon.name}</h1>
        <p>{pokemon.type}</p>
        <span className={`rarity ${pokemon.rarity}`}>{pokemon.rarity}</span>

        <div style={{ marginTop: '2rem' }}>
          <h3>Description</h3>
          <p>{pokemon.description}</p>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <h4>Habitat</h4>
            <a href={`/wiki/habitat/${pokemon.habitat}`}>{pokemon.habitat}</a>
          </div>
          <div>
            <h4>Favorite Food</h4>
            <p>{pokemon.favorite_food}</p>
          </div>
          <div>
            <h4>Spawn Time</h4>
            <p>{pokemon.spawn_time}</p>
          </div>
          <div>
            <h4>Weather</h4>
            <p>{pokemon.weather}</p>
          </div>
          <div>
            <h4>Specialty</h4>
            <p>{pokemon.specialty}</p>
          </div>
          <div>
            <h4>Drops</h4>
            <p>{pokemon.drops}</p>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <h4>Skills</h4>
          <p>{pokemon.skills}</p>
        </div>
      </article>

      <aside style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', borderTop: '1px solid #ddd' }}>
        <h3>Related Guides</h3>
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

        <h3 style={{ marginTop: '2rem' }}>Related News</h3>
        <p style={{ color: '#666' }}>Check back for latest news.</p>
      </aside>
    </main>
  )
}
