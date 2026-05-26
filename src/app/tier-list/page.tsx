import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import pokemonData from '@/data/pokemon.json'
import { canonicalUrl } from '@/lib/site'
import { DataStatus } from '@/components/content/DataStatus'
import { OfficialContext } from '@/components/content/OfficialContext'
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'

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

// Database sorting logic for the current editorial index.
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

const sortedByTier = [...pokemonData].sort((a, b) => getTierRank(b) - getTierRank(a))

const priorityPicks = sortedByTier.slice(0, 10)

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

const indexNotes = [
  {
    title: 'What this page is',
    text: 'A planning index that helps readers find Pokemon pages by rarity and role. It is not an official strength ranking or competitive tier list.',
  },
  {
    title: 'How picks are sorted',
    text: 'The current order uses site database fields: rarity first, then specialty. That makes rare planning targets easier to find without claiming verified power.',
  },
  {
    title: 'What to check next',
    text: 'Open the Pokemon page, confirm habitat and weather, then use Team Builder or Recipe Calculator before spending rare resources.',
  },
]

const rarityHeadings = [
  { label: 'Legendary', pokemon: legendary, color: '#856404', border: '#fff3cd', background: '#fffef5' },
  { label: 'Rare', pokemon: rare, color: '#004085', border: '#cce5ff', background: '#f8fbff' },
  { label: 'Uncommon', pokemon: uncommon, color: '#155724', border: '#d4edda', background: '#f8fff8' },
  { label: 'Common', pokemon: common, color: '#666', border: '#eee', background: 'white' },
]

export const metadata: Metadata = {
  title: 'Pokemon Priority Index',
  description: 'Browse an editorial Pokemon priority index based on current site database fields such as rarity and role.',
  openGraph: {
    title: 'Pokemon Priority Index',
    description: 'Browse an editorial Pokemon priority index based on rarity and role data.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/tier-list'),
  },
}

export default function TierListPage() {
  return (
    <main className="page-shell">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Pokemon Priority Index', url: '/tier-list' },
        ]}
      />
      <ItemListJsonLd
        name="Pokemon Priority Index"
        description="Editorial Pokemon planning index based on current site database fields such as rarity and role."
        url="/tier-list"
        items={priorityPicks.map((pokemon) => ({
          name: pokemon.name,
          url: `/wiki/pokemon/${pokemon.id}`,
        }))}
      />
      <section className="page-hero">
        <h1>Pokemon Priority Index</h1>
        <p>Editorial sorting based on Pokopia Portal database fields, not official competitive data.</p>
      </section>

      <DataStatus
        status="Editorial database index"
        note="This page sorts Pokemon by current site fields such as rarity and specialty. It is not an official tier list, live ranking, numeric strength table, or verified results claim."
        updatedAt="2026-05-23"
      />

      <OfficialContext
        title="Check Confirmed Systems First"
        description="Official sources explain the confirmed gameplay loop, moves, food, multiplayer, and beginner systems. This index is a planning aid built on site data."
        links={[
          { href: '/official/gameplay-overview', label: 'Gameplay overview' },
          { href: '/official/official-beginner-tips', label: 'Beginner tips' },
          { href: '/features/meta-analysis', label: 'Systems analysis' },
        ]}
      />

      <section className="index-guide-panel">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Reading Guide</span>
            <h2>Use This as a Planning Index</h2>
          </div>
          <Link href="/tools/team-builder">Open Team Builder</Link>
        </div>
        <div className="index-guide-grid">
          {indexNotes.map((note) => (
            <div key={note.title} className="index-guide-card">
              <strong>{note.title}</strong>
              <p>{note.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Priority Picks */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Priority Picks from Current Database
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {priorityPicks.map((pokemon, index) => (
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
          By Rarity
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {rarityHeadings.map((group) => (
            <div key={group.label}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: group.color, marginBottom: '1rem' }}>
                {group.label} ({group.pokemon.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {group.pokemon.map((p) => (
                <Link
                  key={p.id}
                  href={`/wiki/pokemon/${p.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    border: `1px solid ${group.border}`,
                    borderRadius: '8px',
                    background: group.background,
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
          ))}
        </div>
      </section>

      {/* By Role */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          By Role
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {byRole.map(({ role, pokemon }) => (
            <div key={role}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                {role} ({pokemon.length})
              </h3>
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

      {/* Notes */}
      <div
        style={{
          padding: '1.5rem',
          background: '#fef2f4',
          borderRadius: '12px',
          border: '1px solid #fcc',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          How to Read This Page
        </h3>
        <ul style={{ fontSize: '0.875rem', color: '#666', paddingLeft: '1.25rem', margin: 0 }}>
          <li><strong>Rarity</strong> raises a Pokemon in this index because rare entries usually need more planning.</li>
          <li><strong>Specialty</strong> is used as an editorial organizing field, not as proof of official strength.</li>
          <li><strong>Role groups</strong> help readers jump to Pokemon pages and compare habitats, drops, and recipes.</li>
          <li><strong>Future updates</strong> should replace this simple index only when official data or verified player testing supports a stronger ranking model.</li>
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
