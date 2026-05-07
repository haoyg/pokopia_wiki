'use client'

import { useEffect, useState } from 'react'

interface Pokemon {
  id: string
  name: string
  type: string
  rarity: string
  habitat: string
}

const typeEmoji: Record<string, string> = {
  'Fire': '🔥',
  'Water': '💧',
  'Grass': '🌿',
  'Electric': '⚡',
  'Ice': '❄️',
  'Ghost': '👻',
  'Dark': '🌑',
  'Dragon': '🐉',
  'Steel': '⚙️',
  'Rock': '🪨',
  'Ground': '🌍',
  'Flying': '🕊️',
  'Normal': '⚪',
  'Poison': '☠️',
  'Fairy': '✨',
  'Crystal': '💎',
}

function getTypeEmoji(type: string) {
  for (const [key, emoji] of Object.entries(typeEmoji)) {
    if (type.toLowerCase().includes(key.toLowerCase())) {
      return emoji
    }
  }
  return '⚡'
}

const rarityEmoji: Record<string, string> = {
  'common': '⚪',
  'uncommon': '🟢',
  'rare': '🔵',
  'legendary': '🟡',
}

export default function PokemonPage() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/pokemon.json')
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

      <section style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Pokémon Database</h1>
        <p>Browse all Pokémon in Pokopia</p>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="pokemon-grid" style={{ marginTop: '2rem' }}>
            {pokemon.map((p) => (
              <a key={p.id} href={`/wiki/pokemon/${p.id}`} className="card">
                <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '0.5rem' }}>
                  {getTypeEmoji(p.type)}
                </div>
                <h3 style={{ textAlign: 'center' }}>{p.name}</h3>
                <p style={{ textAlign: 'center', color: '#666', fontSize: '0.875rem' }}>{p.type}</p>
                <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                  <span className={`rarity ${p.rarity}`}>{rarityEmoji[p.rarity]} {p.rarity}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
