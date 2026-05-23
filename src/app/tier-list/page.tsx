import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import pokemonData from '@/data/pokemon.json'
import { canonicalUrl } from '@/lib/site'

const typeIcons: Record<string, string> = {
  'Fire': '/icons/fire.svg', 'Water': '/icons/water.svg', 'Grass': '/icons/grass.svg',
  'Electric': '/icons/electric.svg', 'Ice': '/icons/ice.svg', 'Ghost': '/icons/ghost.svg',
  'Dark': '/icons/dark.svg', 'Dragon': '/icons/dragon.svg', 'Steel': '/icons/steel.svg',
  'Rock': '/icons/rock.svg', 'Ground': '/icons/ground.svg', 'Flying': '/icons/flying.svg',
  'Normal': '/icons/normal.svg', 'Poison': '/icons/poison.svg', 'Fairy': '/icons/fairy.svg',
  'Crystal': '/icons/crystal.svg',
}

const rarityOrder: Record<string, number> = {
  legendary: 0,
  rare: 1,
  uncommon: 2,
  common: 3,
}

const specialtyOrder: Record<string, number> = {
  Tank: 0,
  Attacker: 1,
  Assassin: 2,
  Speedster: 3,
  Support: 4,
  Defender: 5,
}

function getTypeIcon(type: string): string {
  for (const key of Object.keys(typeIcons)) {
    if (type.toLowerCase().includes(key.toLowerCase())) return typeIcons[key]
  }
  return typeIcons['Normal']
}

// Tier ranking logic
function getTierRank(pokemon: typeof pokemonData[0]): number {
  let score = 0

  // Legendary = highest priority
  if (pokemon.rarity === 'legendary') score += 100
  else if (pokemon.rarity === 'rare') score += 50
  else if (pokemon.rarity === 'uncommon') score += 20

  // Specialty weight
  const specialtyWeights: Record<string, number> = {
    Tank: 30, Attacker: 25, Assassin: 25, Speedster: 20, Support: 15, Defender: 15,
  }
  score += specialtyWeights[pokemon.specialty] || 10

  return score
}

// Sort by tier rank
const sortedByTier = [...pokemonData].sort((a, b) => getTierRank(b) - getTierRank(a))

// Top 10 overall
const top10 = sortedByTier.slice(0, 10)

// By rarity
const legendary = pokemonData.filter((p) => p.rarity === 'legendary')
const rare = pokemonData.filter((p) => p.rarity === 'rare')
const uncommon = pokemonData.filter((p) => p.rarity === 'uncommon')
const common = pokemonData.filter((p) => p.rarity === 'common')

// By specialty role
const byRole = ['Tank', 'Attacker', 'Assassin', 'Speedster', 'Support', 'Defender'].map((role) => ({
  role,
  pokemon: pokemonData.filter((p) => p.specialty === role),
}))

const roleEmoji: Record<string, string> = {
  Tank: '🛡️', Attacker: '⚔️', Assassin: '🗡️', Speedster: '⚡', Support: '💚', Defender: '🛡️',
}

export const metadata: Metadata = {
  title: 'Tier List & Meta Rankings | Pokopia Portal',
  description: 'View the definitive Pokopia tier list. Rankings based on rarity, role, and competitive performance.',
  openGraph: {
    title: 'Tier List | Pokopia Portal',
    description: 'View the definitive Pokopia tier list. Rankings based on rarity and competitive performance.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/tier-list'),
  },
}

export default function TierListPage() {
  return (
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>
          🏆 Tier List
        </h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Meta rankings based on rarity, role, and实战 performance
        </p>
      </header>

      {/* Top 10 Overall */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          ⭐ Top 10 Overall
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {top10.map((pokemon, index) => (
            <Link
              key={pokemon.id}
              href={`/wiki/pokemon/${pokemon.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.25rem',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                background: 'white',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.2s',
              }}
              className="tier-card"
            >
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  background: index < 3 ? '#fff3cd' : '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  color: index < 3 ? '#856404' : '#666',
                }}
              >
                {index + 1}
              </div>
              <div style={{ fontSize: '2rem' }}><Image src={getTypeIcon(pokemon.type)} alt={pokemon.type} width={32} height={32} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{pokemon.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>
                  {pokemon.type} • {pokemon.specialty}
                </div>
              </div>
              <span className={`rarity ${pokemon.rarity}`}>{pokemon.rarity}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* By Rarity */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          💎 By Rarity
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {/* Legendary */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🟡</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#856404' }}>
                Legendary ({legendary.length})
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {legendary.map((p) => (
                <Link
                  key={p.id}
                  href={`/wiki/pokemon/${p.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    border: '1px solid #fff3cd',
                    borderRadius: '8px',
                    background: '#fffef5',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}><Image src={getTypeIcon(p.type)} alt={p.type} width={24} height={24} /></span>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Rare */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🔵</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#004085' }}>
                Rare ({rare.length})
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {rare.map((p) => (
                <Link
                  key={p.id}
                  href={`/wiki/pokemon/${p.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    border: '1px solid #cce5ff',
                    borderRadius: '8px',
                    background: '#f8fbff',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}><Image src={getTypeIcon(p.type)} alt={p.type} width={24} height={24} /></span>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Uncommon */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🟢</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#155724' }}>
                Uncommon ({uncommon.length})
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {uncommon.map((p) => (
                <Link
                  key={p.id}
                  href={`/wiki/pokemon/${p.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    border: '1px solid #d4edda',
                    borderRadius: '8px',
                    background: '#f8fff8',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}><Image src={getTypeIcon(p.type)} alt={p.type} width={24} height={24} /></span>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Common */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.25rem' }}>⚪</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#666' }}>
                Common ({common.length})
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {common.map((p) => (
                <Link
                  key={p.id}
                  href={`/wiki/pokemon/${p.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    background: 'white',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}><Image src={getTypeIcon(p.type)} alt={p.type} width={24} height={24} /></span>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* By Role */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          ⚔️ By Role
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {byRole.map(({ role, pokemon }) => (
            <div key={role}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{roleEmoji[role]}</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
                  {role} ({pokemon.length})
                </h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {pokemon
                  .sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity])
                  .map((p) => (
                    <Link
                      key={p.id}
                      href={`/wiki/pokemon/${p.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.375rem 0.75rem',
                        border: '1px solid #e5e5e5',
                        borderRadius: '20px',
                        background: 'white',
                        textDecoration: 'none',
                        color: 'inherit',
                        fontSize: '0.8rem',
                      }}
                    >
                      <span><Image src={getTypeIcon(p.type)} alt={p.type} width={24} height={24} /></span>
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tips */}
      <div
        style={{
          padding: '1.5rem',
          background: '#fef2f4',
          borderRadius: '12px',
          border: '1px solid #fcc',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Meta Analysis
        </h3>
        <ul style={{ fontSize: '0.875rem', color: '#666', paddingLeft: '1.25rem', margin: 0 }}>
          <li><strong>Legendary Pokémon</strong> dominate the meta - Flamexor, Shadowclaw, Voltscale, Primordion</li>
          <li><strong>Tank builds</strong> are best for solo content and boss fights</li>
          <li><strong>Assassin + Speedster</strong> combo for fast clear speed</li>
          <li><strong>Support roles</strong> essential for co-op content</li>
        </ul>
      </div>

      <style>{`
        .tier-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transform: translateY(-2px);
          border-color: #e94560;
        }
      `}</style>
    </main>
  )
}
