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

export default function PokemonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string>('')

  useEffect(() => {
    params.then((p) => {
      setId(p.id)
    })
  }, [params])

  useEffect(() => {
    if (!id) return
    fetch(`/api/pokemon/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPokemon(data)
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
            <p>{pokemon.habitat}</p>
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

      <aside style={{ padding: '2rem', borderTop: '1px solid #ddd' }}>
        <h3>Related Guides</h3>
        <h3>Related News</h3>
        <h3>Related Builds</h3>
      </aside>
    </main>
  )
}
