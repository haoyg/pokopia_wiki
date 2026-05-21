import { Metadata } from 'next'
import Image from 'next/image'
import pokemonData from '@/data/pokemon.json'

const typeIcons: Record<string, string> = {
  Fire: '/icons/fire.svg',
  Water: '/icons/water.svg',
  Grass: '/icons/grass.svg',
  Electric: '/icons/electric.svg',
  Ice: '/icons/ice.svg',
  Ghost: '/icons/ghost.svg',
  Dark: '/icons/dark.svg',
  Dragon: '/icons/dragon.svg',
  Steel: '/icons/steel.svg',
  Rock: '/icons/rock.svg',
  Ground: '/icons/ground.svg',
  Flying: '/icons/flying.svg',
  Normal: '/icons/normal.svg',
  Poison: '/icons/poison.svg',
  Fairy: '/icons/fairy.svg',
  Crystal: '/icons/crystal.svg',
}

function getTypeIcon(type: string): string {
  for (const key of Object.keys(typeIcons)) {
    if (type.toLowerCase().includes(key.toLowerCase())) return typeIcons[key]
  }
  return typeIcons.Normal
}

export const metadata: Metadata = {
  title: 'Pokemon Database | Pokopia Portal',
  description: 'Browse all Pokemon in Pokopia. View stats, abilities, habitats, drops, and best builds for every creature.',
  openGraph: {
    title: 'Pokemon Database | Pokopia Portal',
    description: 'Browse all Pokemon in Pokopia. View stats, abilities, habitats, drops, and best builds.',
    images: ['/og-image.svg'],
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
            <div style={{ width: '100%', height: '80px', position: 'relative', marginBottom: '0.5rem' }}>
              <Image
                src={p.image_url || getTypeIcon(p.type)}
                alt={p.image_alt || p.type}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 100px, 200px"
              />
            </div>
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
