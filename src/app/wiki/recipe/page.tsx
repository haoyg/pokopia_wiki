import { Metadata } from 'next'
import recipesData from '@/data/recipes.json'

const rarityEmoji: Record<string, string> = {
  'common': '⚪', 'uncommon': '🟢', 'rare': '🔵', 'legendary': '🟡',
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

export const metadata: Metadata = {
  title: 'Recipe Cookbook & Buffs | Pokopia Portal',
  description: 'Discover all recipes in Pokopia. Learn ingredient combinations, buff effects, durations, and best use cases.',
  openGraph: {
    title: 'Recipes | Pokopia Portal',
    description: 'Discover all recipes in Pokopia. Learn ingredient combinations and buff effects.',
    images: ['/og-image.svg'],
  },
}

export default function RecipePage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🍳 Recipes</h1>
      <p>Discover cooking recipes in Pokopia</p>

      <div className="pokemon-grid" style={{ marginTop: '2rem' }}>
        {recipesData.map((r) => (
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
    </main>
  )
}