'use client'

import { useEffect, useState } from 'react'

interface Recipe {
  id: string
  name: string
  ingredients: string
  buff: string
  rarity: string
  best_use: string
}

const rarityEmoji: Record<string, string> = {
  'common': '⚪', 'uncommon': '🟢', 'rare': '🔵', 'legendary': '🟡',
}

const buffEmoji: Record<string, string> = {
  'attraction': '🎯', 'damage': '⚔️', 'speed': '💨', 'defense': '🛡️',
  'spawn': '🎰', 'resistance': '🛡️', 'HP': '❤️', 'rare': '⭐',
}

function getBuffEmoji(buff: string) {
  const lower = buff.toLowerCase()
  if (lower.includes('damage') || lower.includes('fire') || lower.includes('electric')) return '⚔️'
  if (lower.includes('defense') || lower.includes('resistance')) return '🛡️'
  if (lower.includes('speed') || lower.includes('movement')) return '💨'
  if (lower.includes('spawn') || lower.includes('rare')) return '🎯'
  if (lower.includes('HP') || lower.includes('restore')) return '❤️'
  return '✨'
}

export default function RecipePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/recipes.json')
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🍳 Recipes</h1>
      <p>Discover cooking recipes in Pokopia</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="pokemon-grid" style={{ marginTop: '2rem' }}>
          {recipes.map((r) => (
            <a key={r.id} href={`/wiki/recipe/${r.id}`} className="card">
              <div style={{ fontSize: '2.5rem', textAlign: 'center' }}>{getBuffEmoji(r.buff)}</div>
              <h3 style={{ textAlign: 'center', marginTop: '0.5rem' }}>{r.name}</h3>
              <p style={{ textAlign: 'center', color: '#666', fontSize: '0.875rem' }}>{r.buff}</p>
              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <span className={`rarity ${r.rarity}`}>{rarityEmoji[r.rarity]} {r.rarity}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  )
}
