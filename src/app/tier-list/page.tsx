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
  { label: 'Legendary', pokemon: legendary, className: 'legendary' },
  { label: 'Rare', pokemon: rare, className: 'rare' },
  { label: 'Uncommon', pokemon: uncommon, className: 'uncommon' },
  { label: 'Common', pokemon: common, className: 'common' },
]

export const metadata: Metadata = {
  title: 'Pokemon Priority Index',
  description: 'Browse an editorial Pokemon priority index based on current site database fields such as rarity and role.',
  keywords: [
    'Pokopia tier list',
    'Pokopia best Pokemon',
    'Pokopia strongest Pokemon',
    'Pokopia priority index',
    'Pokopia Pokemon ranking',
    'Pokopia meta Pokemon',
    'Pokopia top Pokemon',
  ],
  openGraph: {
    title: 'Pokemon Priority Index',
    description: 'Browse an editorial Pokemon priority index based on rarity and role data.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
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

      <section className="tier-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Priority Picks</span>
            <h2>Priority Picks from Current Database</h2>
          </div>
        </div>
        <div className="tier-priority-list">
          {priorityPicks.map((pokemon, index) => (
            <Link
              key={pokemon.id}
              href={`/wiki/pokemon/${pokemon.id}`}
              className="tier-priority-card"
            >
              <span className={`tier-rank ${index < 3 ? 'top' : ''}`}>
                {index + 1}
              </span>
              <Image src={getTypeIcon(pokemon.type)} alt={pokemon.type} width={32} height={32} />
              <div>
                <strong>{pokemon.name}</strong>
                <small>
                  {pokemon.type} • {pokemon.specialty}
                </small>
              </div>
              <span className={`rarity ${pokemon.rarity}`}>{pokemon.rarity}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="tier-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Rarity Groups</span>
            <h2>By Rarity</h2>
          </div>
        </div>
        <div className="tier-rarity-grid">
          {rarityHeadings.map((group) => (
            <div key={group.label} className={`tier-rarity-group ${group.className}`}>
              <h3>
                {group.label} ({group.pokemon.length})
              </h3>
              <div>
              {group.pokemon.map((p) => (
                <Link
                  key={p.id}
                  href={`/wiki/pokemon/${p.id}`}
                >
                  <Image src={getTypeIcon(p.type)} alt={p.type} width={24} height={24} />
                  <span>{p.name}</span>
                </Link>
              ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="tier-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Role Groups</span>
            <h2>By Role</h2>
          </div>
        </div>
        <div className="tier-role-grid">
          {byRole.map(({ role, pokemon }) => (
            <div key={role}>
              <h3>
                {role} ({pokemon.length})
              </h3>
              <div>
                {pokemon
                  .sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity])
                  .map((p) => (
                    <Link
                      key={p.id}
                      href={`/wiki/pokemon/${p.id}`}
                    >
                      <Image src={getTypeIcon(p.type)} alt={p.type} width={24} height={24} />
                      <span>{p.name}</span>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="tier-note-panel">
        <h2>How to Read This Page</h2>
        <ul>
          <li><strong>Rarity</strong> raises a Pokemon in this index because rare entries usually need more planning.</li>
          <li><strong>Specialty</strong> is used as an editorial organizing field, not as proof of official strength.</li>
          <li><strong>Role groups</strong> help readers jump to Pokemon pages and compare habitats, drops, and recipes.</li>
          <li><strong>Future updates</strong> should replace this simple index only when official data or verified player testing supports a stronger ranking model.</li>
        </ul>
      </aside>
    </main>
  )
}
