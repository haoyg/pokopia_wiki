'use client'

import { useEffect, useState } from 'react'

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [recipe, setRecipe] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string>('')

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return
    fetch(`/api/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRecipe(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <p>Loading...</p>
  if (!recipe) return <p>Recipe not found</p>

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{recipe.name}</h1>
      <p>Rarity: {recipe.rarity}</p>

      <div style={{ marginTop: '2rem' }}>
        <h4>Ingredients</h4>
        <p>{recipe.ingredients}</p>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h4>Buff</h4>
        <p>{recipe.buff}</p>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h4>Effect Duration</h4>
        <p>{recipe.effect_duration}</p>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h4>Best Use</h4>
        <p>{recipe.best_use}</p>
      </div>
    </main>
  )
}
