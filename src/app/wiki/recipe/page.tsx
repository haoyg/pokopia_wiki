import { Metadata } from 'next'
import recipesData from '@/data/recipes.json'
import { canonicalUrl } from '@/lib/site'
import { CreditedImage } from '@/components/media/CreditedImage'

const rarityLabels: Record<string, string> = {
  'common': 'Common', 'uncommon': 'Uncommon', 'rare': 'Rare', 'legendary': 'Legendary',
}

export const metadata: Metadata = {
  title: 'Recipe Cookbook and Buff Notes',
  description: 'Browse Pokopia recipes with ingredients, buff effects, durations, rarity, timing notes, and related route planning links.',
  openGraph: {
    title: 'Recipe Cookbook and Buff Notes',
    description: 'Browse Pokopia recipes with ingredients, buff effects, durations, and route notes.',
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
            <CreditedImage src={r.image_url} alt={r.image_alt || r.name} source={r.image_source} sourceUrl={r.image_source_url} licenseNote={r.image_license_note} originalMedia={r.image_original_media} />
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
