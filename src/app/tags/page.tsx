import type { Metadata } from 'next'
import Link from 'next/link'
import pokemonData from '@/data/pokemon.json'
import { canonicalUrl } from '@/lib/site'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'

const ALL_TYPES = ['Bug', 'Crystal', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice', 'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water']
const ALL_SPECIALTIES = ['Assassin', 'Attacker', 'Defender', 'Speedster', 'Support', 'Tank']
const ALL_RARITIES = ['common', 'uncommon', 'rare', 'legendary']

export const metadata: Metadata = {
  title: 'Browse Pokemon by Type, Rarity, and Role | Pokopia Cloud',
  description:
    'Browse all Pokopia Pokemon filtered by type, rarity tier, and specialty role. Use these tag pages to find Pokemon by Fire type, Support role, legendary rarity, and more.',
  keywords: [
    'pokopia pokemon types',
    'pokopia pokemon rarities',
    'pokopia specialty roles',
    'pokopia type list',
    'pokopia rarity tiers',
    'pokopia role guide',
  ],
  openGraph: {
    title: 'Browse Pokemon by Type, Rarity, and Role | Pokopia Cloud',
    description: 'Find Pokopia Pokemon by type, rarity tier, or specialty role. Tag-based browsing for Fire, Water, Support, Tank, and more.',
    images: ['/og-image.svg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Pokemon by Type, Rarity, and Role | Pokopia Cloud',
    description: 'Find Pokopia Pokemon by type, rarity tier, or specialty role. Tag-based browsing for Fire, Water, Support, Tank, and more.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/tags'),
  },
}

function countByType(type: string) {
  return pokemonData.filter((p) => p.type.split('/').includes(type)).length
}

function countBySpecialty(specialty: string) {
  return pokemonData.filter((p) => p.specialty === specialty).length
}

function countByRarity(rarity: string) {
  return pokemonData.filter((p) => p.rarity === rarity).length
}

export default function TagsPage() {
  return (
    <main className="page-shell">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tags', url: '/tags' },
        ]}
      />

      <section className="page-hero">
        <h1>Browse Pokemon by Tag</h1>
        <p>
          Filter the Pokopia Pokemon database by type, specialty role, or rarity tier.
          Each tag page lists all matching Pokemon with key stats, habitat, and spawn conditions.
        </p>
      </section>

      {/* Types */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Types ({ALL_TYPES.length})</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {ALL_TYPES.map((type) => {
            const count = countByType(type)
            return (
              <Link
                key={type}
                href={`/tags/${type}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '0.85rem 1rem',
                  background: '#f7f9fc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#1a202c',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{type}</span>
                <span style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.25rem' }}>
                  {count} {count === 1 ? 'Pokemon' : 'Pokemon'}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Specialties */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Specialty Roles ({ALL_SPECIALTIES.length})</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {ALL_SPECIALTIES.map((specialty) => {
            const count = countBySpecialty(specialty)
            return (
              <Link
                key={specialty}
                href={`/tags/${specialty}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '0.85rem 1rem',
                  background: '#f7f9fc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#1a202c',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{specialty}</span>
                <span style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.25rem' }}>
                  {count} {count === 1 ? 'Pokemon' : 'Pokemon'}
                </span>
              </Link>
            )}
          )}
        </div>
      </section>

      {/* Rarities */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Rarity Tiers ({ALL_RARITIES.length})</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {ALL_RARITIES.map((rarity) => {
            const count = countByRarity(rarity)
            return (
              <Link
                key={rarity}
                href={`/tags/${rarity}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '0.85rem 1rem',
                  background: '#f7f9fc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#1a202c',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.95rem', textTransform: 'capitalize' }}>
                  {rarity}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.25rem' }}>
                  {count} {count === 1 ? 'Pokemon' : 'Pokemon'}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* All Pokemon count */}
      <section
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#f0f4f8',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0, color: '#4a5568' }}>
          Total: <strong>{pokemonData.length} Pokemon</strong> across {ALL_TYPES.length} types,{' '}
          {ALL_SPECIALTIES.length} specialty roles, and {ALL_RARITIES.length} rarity tiers.
        </p>
        <div style={{ marginTop: '1rem' }}>
          <Link
            href="/wiki/pokemon"
            style={{
              display: 'inline-block',
              padding: '0.6rem 1.5rem',
              background: '#2563eb',
              color: '#fff',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Browse Full Database
          </Link>
        </div>
      </section>
    </main>
  )
}
