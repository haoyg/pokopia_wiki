import { Metadata } from 'next'
import pokemonData from '@/data/pokemon.json'

const typeEmoji: Record<string, string> = {
  'Fire': '🔥', 'Water': '💧', 'Grass': '🌿', 'Electric': '⚡',
  'Ice': '❄️', 'Ghost': '👻', 'Dark': '🌑', 'Dragon': '🐉',
  'Steel': '⚙️', 'Rock': '🪨', 'Ground': '🌍', 'Flying': '🕊️',
  'Normal': '⚪', 'Poison': '☠️', 'Fairy': '✨', 'Crystal': '💎',
}

const rarityEmoji: Record<string, string> = {
  'common': '⚪', 'uncommon': '🟢', 'rare': '🔵', 'legendary': '🟡',
}

function getTypeEmoji(type: string) {
  for (const [key, emoji] of Object.entries(typeEmoji)) {
    if (type.toLowerCase().includes(key.toLowerCase())) return emoji
  }
  return '⚡'
}

export const metadata: Metadata = {
  title: 'Pokémon Database | Pokopia Portal',
  description: 'Browse all Pokémon in Pokopia. View stats, abilities, habitats, drops, and best builds for every creature.',
  openGraph: {
    title: 'Pokémon Database | Pokopia Portal',
    description: 'Browse all Pokémon in Pokopia. View stats, abilities, habitats, drops, and best builds.',
    images: ['/og-image.svg'],
  },
}

export default function PokemonPage() {
  return (
    <main>
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/news">News</a>
          <a href="/guides">Guides</a>
          <a href="/wiki/pokemon">Pokémon</a>
        </nav>
      </header>

      <section style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Pokémon Database</h1>
        <p>Browse all Pokémon in Pokopia</p>

        <div className="pokemon-grid" style={{ marginTop: '2rem' }}>
          {pokemonData.map((p) => (
            <a key={p.id} href={`/wiki/pokemon/${p.id}`} className="card">
              <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '0.5rem' }}>
                {getTypeEmoji(p.type)}
              </div>
              <h3 style={{ textAlign: 'center' }}>{p.name}</h3>
              <p style={{ textAlign: 'center', color: '#666', fontSize: '0.875rem' }}>{p.type}</p>
              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <span className={`rarity ${p.rarity}`}>{rarityEmoji[p.rarity]} {p.rarity}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}