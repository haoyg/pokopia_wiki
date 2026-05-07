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

export default function RecipePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/recipes')
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Recipes</h1>
      <p>Discover cooking recipes in Pokopia</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="pokemon-grid" style={{ marginTop: '2rem' }}>
          {recipes.map((r) => (
            <a key={r.id} href={`/wiki/recipe/${r.id}`} className="card">
              <h3>{r.name}</h3>
              <p>{r.buff}</p>
              <span className={`rarity ${r.rarity}`}>{r.rarity}</span>
            </a>
          ))}
        </div>
      )}
    </main>
  )
}
