import { Metadata } from 'next'
import recipesData from '@/data/recipes.json'
import { canonicalUrl } from '@/lib/site'
import { CreditedImage } from '@/components/media/CreditedImage'

const rarityLabels: Record<string, string> = {
  'common': 'Common', 'uncommon': 'Uncommon', 'rare': 'Rare', 'legendary': 'Legendary',
}

export const metadata: Metadata = {
  title: 'Recipe Cookbook & Buffs | Pokopia Portal',
  description: 'Discover all recipes in Pokopia. Learn ingredient combinations, buff effects, durations, and best use cases.',
  openGraph: {
    title: 'Recipes | Pokopia Portal',
    description: 'Discover all recipes in Pokopia. Learn ingredient combinations and buff effects.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/wiki/recipe'),
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
            <CreditedImage src={r.image_url} alt={r.image_alt || r.name} source={r.image_source} sourceUrl={r.image_source_url} />
            <h3 style={{ textAlign: 'center', marginTop: '0.5rem' }}>{r.name}</h3>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.875rem' }}>{r.buff}</p>
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <span className={`rarity ${r.rarity}`}>{rarityLabels[r.rarity]}</span>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
