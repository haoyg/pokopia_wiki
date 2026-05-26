import { Metadata } from 'next'
import pokemonData from '@/data/pokemon.json'
import { canonicalUrl } from '@/lib/site'
import { CreditedImage } from '@/components/media/CreditedImage'

const featuredPokemon = ['pkm001', 'pkm002', 'pkm007', 'pkm030']

export const metadata: Metadata = {
  title: 'Pokemon Database',
  description: 'Browse Pokopia Pokemon entries with types, rarity, habitats, food, drops, and editorial route notes.',
  openGraph: {
    title: 'Pokemon Database',
    description: 'Browse Pokopia Pokemon entries with types, rarity, habitats, food, and drops.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/wiki/pokemon'),
  },
}

export default function PokemonPage() {
  const rarityCounts = pokemonData.reduce<Record<string, number>>((counts, pokemon) => {
    counts[pokemon.rarity] = (counts[pokemon.rarity] || 0) + 1
    return counts
  }, {})
  const roleCounts = pokemonData.reduce<Record<string, number>>((counts, pokemon) => {
    counts[pokemon.specialty] = (counts[pokemon.specialty] || 0) + 1
    return counts
  }, {})
  const featured = featuredPokemon
    .map((id) => pokemonData.find((pokemon) => pokemon.id === id))
    .filter(Boolean) as typeof pokemonData

  return (
    <main className="page-shell">
      <section className="page-hero">
        <h1>Pokemon Database</h1>
        <p>Browse Pokopia Pokemon by type, rarity, habitat, favorite food, drops, and route role.</p>
      </section>

      <section className="index-guide-panel">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Pokedex Routes</span>
            <h2>Use Pokemon Pages as Small Route Guides</h2>
          </div>
          <a href="/tools/team-builder">Open Team Builder</a>
        </div>
        <div className="index-guide-grid">
          <div className="index-guide-card">
            <strong>Best first checks</strong>
            <p>Start with flexible Pokemon that explain early route roles, then move into rare or legendary targets after the habitat is stable.</p>
            <div>
              {featured.map((pokemon) => (
                <a key={pokemon.id} href={`/wiki/pokemon/${pokemon.id}`}>{pokemon.name}</a>
              ))}
            </div>
          </div>
          <div className="index-guide-card">
            <strong>Rarity spread</strong>
            <p>Rarity is useful for farming priority, but route fit matters more than chasing the highest label.</p>
            <div>
              {Object.entries(rarityCounts).map(([rarity, count]) => (
                <span key={rarity}>{rarity}: {count}</span>
              ))}
            </div>
          </div>
          <div className="index-guide-card">
            <strong>Role planning</strong>
            <p>Use specialty roles to avoid building teams with too many attackers and not enough support or survival coverage.</p>
            <div>
              {Object.entries(roleCounts).slice(0, 6).map(([role, count]) => (
                <span key={role}>{role}: {count}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="pokemon-grid">
        {pokemonData.map((p) => (
          <a key={p.id} href={`/wiki/pokemon/${p.id}`} className="card">
            <CreditedImage src={p.image_url} alt={p.image_alt || p.type} source={p.image_source} sourceUrl={p.image_source_url} licenseNote={p.image_license_note} originalMedia={p.image_original_media} className="card-cover pokemon-cover" sizes="(max-width: 768px) 100px, 200px" />
            <h3 style={{ textAlign: 'center' }}>{p.name}</h3>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.875rem' }}>{p.type}</p>
            <p style={{ textAlign: 'center', color: '#637083', fontSize: '0.78rem', marginTop: '0.35rem' }}>{p.specialty} · {p.spawn_time}</p>
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <span className={`rarity ${p.rarity}`}>{p.rarity}</span>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
