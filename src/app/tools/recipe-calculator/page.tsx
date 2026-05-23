'use client'

import { useState } from 'react'
import recipesData from '@/data/recipes.json'
import Link from 'next/link'
import { DataStatus } from '@/components/content/DataStatus'

const rarityOrder = ['common', 'uncommon', 'rare', 'legendary']

export default function RecipeCalculator() {
  const [selectedRecipe, setSelectedRecipe] = useState<string>('')
  const [filter, setFilter] = useState<string>('all')

  const filteredRecipes = recipesData
    .filter((r) => filter === 'all' || r.rarity === filter)
    .sort((a, b) => {
      return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity)
    })

  const recipe = recipesData.find((r) => r.id === selectedRecipe)

  return (
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/tools" style={{ fontSize: '0.875rem', color: '#666' }}>
          ← Back to Tools
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>
          Recipe Calculator
        </h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Compare current recipe database entries by rarity, ingredients, buff text, and editorial use notes.
        </p>
      </header>

      <DataStatus
        status="Database planning tool"
        note="Recipe effects and best-use notes come from Pokopia Portal database entries. Use this as a planning aid and check official or tested sources before treating a recipe as confirmed."
        updatedAt="2026-05-23"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Recipe List */}
        <div>
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['all', 'common', 'uncommon', 'rare', 'legendary'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '0.375rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: filter === f ? '#e94560' : '#ddd',
                  background: filter === f ? '#e94560' : 'white',
                  color: filter === f ? 'white' : '#666',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '500px', overflowY: 'auto' }}>
            {filteredRecipes.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRecipe(r.id)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: selectedRecipe === r.id ? '#e94560' : '#e5e5e5',
                  background: selectedRecipe === r.id ? '#fef2f4' : 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.name}</span>
                  <span
                    className={`rarity ${r.rarity}`}
                    style={{ fontSize: '0.7rem' }}
                  >
                    {r.rarity}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                  {r.buff}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recipe Detail */}
        <div>
          {recipe ? (
            <div
              style={{
                padding: '1.5rem',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                background: 'white',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{recipe.name}</h2>
                <span className={`rarity ${recipe.rarity}`}>{recipe.rarity}</span>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Buff
                </h3>
                <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#e94560' }}>
                  {recipe.buff}
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Duration
                </h3>
                <p>{recipe.effect_duration}</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Ingredients
                </h3>
                <p style={{ fontFamily: 'monospace', fontSize: '0.875rem', background: '#f8f9fa', padding: '0.75rem', borderRadius: '8px' }}>
                  {recipe.ingredients}
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Best Use
                </h3>
                <p style={{ color: '#666' }}>{recipe.best_use}</p>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e5e5' }}>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Related Guides
                </h3>
                <Link
                  href={`/guides/complete-recipe-list`}
                  style={{ fontSize: '0.875rem', color: '#e94560' }}
                >
                  View Complete Recipe Guide →
                </Link>
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '3rem 1.5rem',
                border: '2px dashed #e5e5e5',
                borderRadius: '12px',
                textAlign: 'center',
                color: '#999',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍳</div>
              <p>Select a recipe to see details</p>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div
        style={{
          marginTop: '3rem',
          padding: '1.5rem',
          background: '#fef2f4',
          borderRadius: '12px',
          border: '1px solid #fcc',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Pro Tips
        </h3>
        <ul style={{ fontSize: '0.875rem', color: '#666', paddingLeft: '1.25rem', margin: 0 }}>
          <li>Use Lucky Charm only during planned farming windows where the full duration helps.</li>
          <li>Match Fire Boost to routes where fire-type planning actually supports the objective.</li>
          <li>Compare Guardian Stew and Steel Shell when a route needs more durability, then confirm details on the recipe pages.</li>
        </ul>
      </div>
    </main>
  )
}
