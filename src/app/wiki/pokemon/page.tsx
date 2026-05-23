import { Metadata } from 'next'
import pokemonData from '@/data/pokemon.json'
import { canonicalUrl } from '@/lib/site'
import { CreditedImage } from '@/components/media/CreditedImage'

export const metadata: Metadata = {
  title: 'Pokemon Database | Pokopia Portal',
  description: 'Browse all Pokemon in Pokopia. View stats, abilities, habitats, drops, and best builds for every creature.',
  openGraph: {
    title: 'Pokemon Database | Pokopia Portal',
    description: 'Browse all Pokemon in Pokopia. View stats, abilities, habitats, drops, and best builds.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/wiki/pokemon'),
  },
}

export default function PokemonPage() {
  return (
    <main className="page-shell">
      <section className="page-hero">
        <h1>Pokemon Database</h1>
        <p>Browse all Pokemon in Pokopia</p>
      </section>

      <div className="pokemon-grid">
        {pokemonData.map((p) => (
          <a key={p.id} href={`/wiki/pokemon/${p.id}`} className="card">
            <CreditedImage src={p.image_url} alt={p.image_alt || p.type} source={p.image_source} sourceUrl={p.image_source_url} licenseNote={p.image_license_note} className="card-cover pokemon-cover" sizes="(max-width: 768px) 100px, 200px" />
            <h3 style={{ textAlign: 'center' }}>{p.name}</h3>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.875rem' }}>{p.type}</p>
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <span className={`rarity ${p.rarity}`}>{p.rarity}</span>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
