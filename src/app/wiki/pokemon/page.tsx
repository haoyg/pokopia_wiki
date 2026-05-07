'use client'

import { useEffect, useState } from 'react'

interface Pokemon {
  id: string
  name: string
  type: string
  rarity: string
  habitat: string
}

export default function PokemonPage() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/pokemon')
      .then((res) => res.json())
      .then((data) => {
        setPokemon(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main>
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/news">News</a>
          <a href="/guides">Guides</a>
          <a href="/wiki/pokemon">Pokémon</a>
        </nav>
      </header>

      <section>
        <h1>Pokémon Database</h1>
        <p>Browse all Pokémon in Pokopia</p>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="pokemon-grid" style={{ marginTop: '2rem' }}>
            {pokemon.map((p) => (
              <a key={p.id} href={`/wiki/pokemon/${p.id}`} className="card">
                <h3>{p.name}</h3>
                <p>{p.type}</p>
                <span className={`rarity ${p.rarity}`}>{p.rarity}</span>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
