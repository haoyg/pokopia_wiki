import type { Metadata } from 'next'
import Link from 'next/link'
import pokemonData from '@/data/pokemon.json'
import habitatsData from '@/data/habitats.json'
import { canonicalUrl } from '@/lib/site'
import { BreadcrumbJsonLd, FAQJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'
import { DataStatus } from '@/components/content/DataStatus'

const PAGE_URL = '/wiki/collection'
const RARITY_ORDER: Record<string, number> = { common: 1, uncommon: 2, rare: 3, legendary: 4 }
const habitatNames = Object.fromEntries(habitatsData.map((h) => [h.id, h.name]))
const ALL_TYPES = [...new Set(pokemonData.flatMap((p) => p.type.split('/')))].sort()
const ALL_SPECIALTIES = [...new Set(pokemonData.map((p) => p.specialty))].sort()
const ALL_HABITATS = [...new Set(pokemonData.map((p) => p.habitat))].map((h) => ({ id: h, name: habitatNames[h] || h }))

const rarityCounts = pokemonData.reduce<Record<string, number>>((acc, p) => {
  acc[p.rarity] = (acc[p.rarity] || 0) + 1
  return acc
}, {})

const typeCounts = pokemonData.reduce<Record<string, number>>((acc, p) => {
  for (const t of p.type.split('/')) acc[t] = (acc[t] || 0) + 1
  return acc
}, {})

const specialtyCounts = pokemonData.reduce<Record<string, number>>((acc, p) => {
  acc[p.specialty] = (acc[p.specialty] || 0) + 1
  return acc
}, {})

const weatherCounts = pokemonData.reduce<Record<string, number>>((acc, p) => {
  acc[p.weather] = (acc[p.weather] || 0) + 1
  return acc
}, {})

const timeCounts = pokemonData.reduce<Record<string, number>>((acc, p) => {
  acc[p.spawn_time] = (acc[p.spawn_time] || 0) + 1
  return acc
}, {})

const faqs = [
  {
    question: 'How many Pokemon are in the Pokopia collection list?',
    answer: `Pokopia currently features ${pokemonData.length} documented Pokemon entries across ${habitatsData.length} distinct habitat environments. The collection is organized by rarity tier, with ${rarityCounts.common || 0} common, ${rarityCounts.uncommon || 0} uncommon, ${rarityCounts.rare || 0} rare, and ${rarityCounts.legendary || 0} legendary entries.`,
  },
  {
    question: 'What is the fastest way to complete the Pokopia collection?',
    answer: 'Focus on one habitat at a time, matching weather conditions and time-of-day windows before spending bait items. Legendary Pokemon should be targeted last after you have established stable routes for the other three tiers.',
  },
  {
    question: 'Do I need to catch every Pokemon to enjoy Pokopia?',
    answer: 'No. The game is fully playable with a small core team. The collection list exists for players who want to complete the Pokopedia, optimize material farming, or pursue the achievement of capturing every entry. A functional core team can be built from 4-6 common and uncommon Pokemon.',
  },
  {
    question: 'What is the rarest Pokemon in Pokopia?',
    answer: `Legendary Pokemon are the rarest tier in Pokopia and require specific habitat conditions, optimal weather, and the correct time window to encounter. Each legendary has a dedicated habitat and drop table that makes it worth targeting for high-end material farming.`,
  },
  {
    question: 'How do I track my collection progress?',
    answer: 'Use the Collection List view on the Pokemon Database page to check off entries as you capture them. The checklist tracks progress by rarity tier, type, specialty role, and habitat so you can identify which areas of the collection are complete and which need targeted farming sessions.',
  },
  {
    question: 'Can I trade Pokemon in Pokopia to complete my collection faster?',
    answer: 'If Pokopia supports multiplayer trading, using it to fill gaps in your collection is significantly faster than farming duplicate rare spawns. Check the official multiplayer guide for trade requirements and any cooldown mechanics before organizing trade sessions.',
  },
  {
    question: 'What is the relationship between habitat and Pokemon availability?',
    answer: 'Every Pokemon in Pokopia is tied to one specific habitat where it can appear. You cannot encounter a Pokemon outside its designated habitat. This makes habitat selection the primary strategic decision in the game — choosing which habitat to visit determines which Pokemon you can possibly encounter during that session.',
  },
]

export const metadata: Metadata = {
  title: 'Pokopia Collection List - Complete Pokémon Checklist | Pokopia Cloud',
  description:
    `The complete Pokopia Collection List — a ${pokemonData.length}-Pokemon checklist organized by rarity, type, habitat, and role. Includes how-to-get conditions, spawn windows, and progress tracking for every entry.`,
  keywords: [
    'pokopia collection list',
    'pokopia collection checklist',
    'pokopia complete pokemon list',
    'pokopia all pokemon',
    'pokopia pokedex',
    'pokopia legendary pokemon',
    'pokopia rare pokemon',
    'pokopia pokemon database',
  ],
  openGraph: {
    title: 'Pokopia Collection List - Complete Pokémon Checklist',
    description: `Complete ${pokemonData.length}-Pokemon checklist for Pokopia. Filter by rarity, type, habitat, and role. Every entry with how-to-get conditions and spawn windows.`,
    images: ['/og-image.svg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Collection List - Complete Pokémon Checklist',
    description: `Complete ${pokemonData.length}-Pokemon checklist for Pokopia with filters and spawn window data.`,
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl(PAGE_URL),
  },
}

export default function CollectionPage() {
  return (
    <main className="page-shell" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Pokemon', url: '/wiki/pokemon' },
          { name: 'Collection List', url: PAGE_URL },
        ]}
      />
      <ItemListJsonLd
        name="Pokopia Collection List"
        description={`Complete ${pokemonData.length}-Pokemon checklist for Pokopia with rarity tiers, type categories, habitat assignments, and how-to-get conditions.`}
        url={PAGE_URL}
        items={pokemonData.map((p) => ({
          name: p.name,
          url: `/wiki/pokemon/${p.id}`,
        }))}
      />
      <FAQJsonLd title="Pokopia Collection List FAQ" faqs={faqs} />

      {/* Hero */}
      <header style={{ marginBottom: '2rem' }}>
        <nav aria-label="Breadcrumb" style={{ marginBottom: '0.75rem' }}>
          <Link href="/wiki/pokemon" style={{ fontSize: '0.875rem', color: '#637083' }}>
            ← Back to Pokemon Database
          </Link>
        </nav>
        <h1 style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.1 }}>
          Pokopia Collection List
        </h1>
        <p style={{ color: '#637083', fontSize: '1.1rem', maxWidth: '820px', lineHeight: 1.65 }}>
          A complete {pokemonData.length}-Pokemon checklist for Pokopia, organized by rarity tier, type
          category, habitat, and specialty role. Every entry includes favorite food, spawn window, and
          weather conditions for targeted farming.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
          <Link href="/wiki/pokemon?view=collection" style={{
            padding: '0.5rem 1rem',
            borderRadius: '999px',
            background: '#ff5c7a',
            color: 'white',
            fontWeight: 800,
            fontSize: '0.9rem',
          }}>
            Open Interactive Checklist
          </Link>
          <Link href="/tools/spawn-tracker" style={{
            padding: '0.5rem 1rem',
            borderRadius: '999px',
            border: '2px solid #dce8dc',
            background: 'white',
            color: '#20243a',
            fontWeight: 800,
            fontSize: '0.9rem',
          }}>
            Use Spawn Tracker
          </Link>
          <Link href="/tools/habitat-planner" style={{
            padding: '0.5rem 1rem',
            borderRadius: '999px',
            border: '2px solid #dce8dc',
            background: 'white',
            color: '#20243a',
            fontWeight: 800,
            fontSize: '0.9rem',
          }}>
            Plan Habitat Routes
          </Link>
        </div>
      </header>

      <DataStatus
        status="Editorial collection database — confirm entries against official sources"
        note="This collection list uses editorial planning data, not confirmed game records. Spawn windows, weather conditions, and drop tables should be verified in-game before committing to farming routes."
        updatedAt="August 11, 2026"
        showPolicyLink
      />

      {/* Overview stats */}
      <section style={{
        marginTop: '1.5rem',
        padding: '1.5rem',
        border: '2px solid rgba(220, 232, 220, 0.95)',
        borderRadius: '12px',
        background: 'rgba(255, 253, 247, 0.96)',
      }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Collection at a Glance</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
          {[
            { label: 'Total Entries', value: pokemonData.length, note: 'Pokemon documented' },
            { label: 'Habitats', value: habitatsData.length, note: 'Distinct environments' },
            { label: 'Rarity Tiers', value: 4, note: 'common to legendary' },
            { label: 'Type Categories', value: ALL_TYPES.length, note: 'Unique elemental types' },
            { label: 'Specialty Roles', value: ALL_SPECIALTIES.length, note: 'Team roles' },
          ].map((stat) => (
            <div key={stat.label} style={{
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid rgba(220, 232, 220, 0.95)',
              background: 'rgba(255, 255, 255, 0.88)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ff5c7a', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#20243a', marginTop: '0.25rem' }}>{stat.label}</div>
              <div style={{ fontSize: '0.72rem', color: '#637083', marginTop: '0.15rem' }}>{stat.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Rarity breakdown */}
      <section style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: '0.85rem' }}>Pokopia Collection by Rarity</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
          {Object.entries(rarityCounts)
            .sort((a, b) => (RARITY_ORDER[a[0]] ?? 0) - (RARITY_ORDER[b[0]] ?? 0))
            .map(([rarity, count]) => (
              <div key={rarity} style={{
                padding: '1rem',
                borderRadius: '10px',
                border: `2px solid ${rarity === 'legendary' ? 'rgba(255, 193, 7, 0.65)' : 'rgba(220, 232, 220, 0.95)'}`,
                background: rarity === 'legendary' ? 'rgba(255, 251, 225, 0.96)' : 'rgba(255, 255, 255, 0.88)',
              }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: rarity === 'legendary' ? '#c68600' : '#20243a' }}>{count}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'capitalize', marginTop: '0.2rem' }}>{rarity}</div>
                <p style={{ fontSize: '0.75rem', color: '#637083', marginTop: '0.3rem' }}>
                  {rarity === 'legendary' ? 'Highest-tier materials, hardest spawn conditions'
                    : rarity === 'rare' ? 'Valuable drop tables, moderate spawn conditions'
                    : rarity === 'uncommon' ? 'Stable farming targets, common spawn windows'
                    : 'Entry-level, easiest to encounter'}
                </p>
              </div>
            ))}
        </div>
        <p style={{ color: '#637083', fontSize: '0.88rem', lineHeight: 1.65 }}>
          Rarity in Pokopia primarily affects <strong>spawn frequency and drop table value</strong>, not raw combat
          strength. A well-built uncommon Attacker often outperforms a legendary without proper support. Use
          rarity to prioritize farming order, not as a replacement for evaluating individual Pokemon route fit.
        </p>
      </section>

      {/* Type distribution */}
      <section style={{ marginTop: '1.75rem' }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: '0.85rem' }}>Pokopia Collection by Type</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem' }}>
          {ALL_TYPES.map((type) => (
            <div key={type} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(220, 232, 220, 0.95)',
              background: 'rgba(255, 255, 255, 0.88)',
            }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800 }}>{type}</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#ff5c7a' }}>{typeCounts[type] || 0}</span>
            </div>
          ))}
        </div>
        <p style={{ color: '#637083', fontSize: '0.88rem', marginTop: '0.85rem', lineHeight: 1.65 }}>
          Fire, Water, Grass, and Electric are the most common type combinations in Pokopia, reflecting the
          variety of climate zones across its {habitatsData.length} habitats. Less common types like Dragon,
          Psychic, and Ghost appear in smaller numbers but often correspond to rare or legendary entries
          worth targeting for their specialized material drops.
        </p>
      </section>

      {/* Role/specialty breakdown */}
      <section style={{ marginTop: '1.75rem' }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: '0.85rem' }}>Pokopia Collection by Specialty Role</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
          {ALL_SPECIALTIES.map((role) => (
            <div key={role} style={{
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid rgba(220, 232, 220, 0.95)',
              background: 'rgba(255, 255, 255, 0.88)',
            }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2f84d8' }}>{specialtyCounts[role] || 0}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: '0.2rem' }}>{role}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#637083', fontSize: '0.88rem', marginTop: '0.85rem', lineHeight: 1.65 }}>
          Specialty roles describe a Pokemon&apos;s primary function in a team context. When building a balanced
          team, aim to cover at least two different specialty roles so your team is not overly reliant on
          raw damage output. The Team Builder tool can help you draft balanced four-slot compositions.
        </p>
      </section>

      {/* Weather + time distribution */}
      <section style={{ marginTop: '1.75rem' }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: '0.85rem' }}>Spawn Conditions Across the Collection</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: '10px', border: '1px solid rgba(220, 232, 220, 0.95)', background: 'rgba(255, 255, 255, 0.88)' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>By Weather</h3>
            {Object.entries(weatherCounts).map(([weather, count]) => (
              <div key={weather} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800 }}>{weather}</span>
                <span style={{ fontSize: '0.82rem', color: '#637083' }}>{count} Pokemon</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '1rem', borderRadius: '10px', border: '1px solid rgba(220, 232, 220, 0.95)', background: 'rgba(255, 255, 255, 0.88)' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>By Time of Day</h3>
            {Object.entries(timeCounts).map(([time, count]) => (
              <div key={time} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800 }}>{time}</span>
                <span style={{ fontSize: '0.82rem', color: '#637083' }}>{count} Pokemon</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ color: '#637083', fontSize: '0.88rem', marginTop: '0.85rem', lineHeight: 1.65 }}>
          Matching weather and time conditions is the single most impactful farming optimization in Pokopia.
          A Pokemon&apos;s spawn probability increases dramatically when both its preferred weather and time window
          align with current in-game conditions. Use the Spawn Tracker to filter by both variables before
          entering any habitat.
        </p>
      </section>

      {/* Habitat overview table */}
      <section style={{ marginTop: '1.75rem' }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: '0.85rem' }}>Pokopia Habitats and Pokemon Counts</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'rgba(242, 251, 244, 0.88)' }}>
                {['Habitat', 'Pokemon Count', 'Primary Weather', 'Difficulty', 'Best For'].map((h) => (
                  <th key={h} style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 900, color: '#637083', fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '2px solid rgba(220, 232, 220, 0.95)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_HABITATS.map((habitat) => {
                const habitatData = habitatsData.find((h) => h.id === habitat.id)
                const pokemonInHabitat = pokemonData.filter((p) => p.habitat === habitat.id).length
                return (
                  <tr key={habitat.id} style={{ borderBottom: '1px solid rgba(220, 232, 220, 0.72)' }}>
                    <td style={{ padding: '0.65rem 0.85rem' }}>
                      <Link href={`/wiki/habitat/${habitat.id}`} style={{ fontWeight: 800, color: '#ff5c7a' }}>{habitat.name}</Link>
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 800 }}>{pokemonInHabitat}</td>
                    <td style={{ padding: '0.65rem 0.85rem', color: '#637083' }}>{habitatData?.weather || '—'}</td>
                    <td style={{ padding: '0.65rem 0.85rem', color: '#637083' }}>{habitatData?.difficulty || '—'}</td>
                    <td style={{ padding: '0.65rem 0.85rem', color: '#637083', fontSize: '0.8rem' }}>{habitatData?.recommended_build || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* How to use the collection list */}
      <section style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '12px', border: '2px solid rgba(220, 232, 220, 0.82)', background: 'rgba(255, 253, 247, 0.88)' }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>How to Use the Pokopia Collection List</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <p style={{ color: '#303030', lineHeight: 1.75, fontSize: '0.9rem' }}>
            The Pokopia Collection List is designed to serve two distinct use cases depending on where you
            are in the game.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
            <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid rgba(220, 232, 220, 0.95)', background: 'rgba(255, 255, 255, 0.88)' }}>
              <strong style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.95rem' }}>If you are early game</strong>
              <p style={{ color: '#637083', fontSize: '0.82rem', lineHeight: 1.6 }}>
                Start with common and uncommon Pokemon from your nearest habitat. Focus on building a
                balanced team of 4 before worrying about rare or legendary entries. Use the collection
                filters to identify which common Pokemon have the best route fit for your current habitat.
              </p>
            </div>
            <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid rgba(220, 232, 220, 0.95)', background: 'rgba(255, 255, 255, 0.88)' }}>
              <strong style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.95rem' }}>If you are mid-game</strong>
              <p style={{ color: '#637083', fontSize: '0.82rem', lineHeight: 1.6 }}>
                Expand into new habitats to access different Pokemon types and material drop tables. Use
                weather forecasts to plan habitat sessions. Check off entries as you capture them to
                track which rarity tiers are still incomplete.
              </p>
            </div>
            <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid rgba(220, 232, 220, 0.95)', background: 'rgba(255, 255, 255, 0.88)' }}>
              <strong style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.95rem' }}>If you are farming legendary</strong>
              <p style={{ color: '#637083', fontSize: '0.82rem', lineHeight: 1.6 }}>
                Target legendary Pokemon last, after you have stable farming routes for the other three
                tiers. Each legendary requires its specific habitat, optimal weather, and correct time
                window — plan the session with the Spawn Tracker before entering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collection strategy */}
      <section style={{ marginTop: '1.75rem' }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: '0.85rem' }}>Recommended Collection Order</h2>
        <ol style={{ display: 'grid', gap: '0.85rem', paddingLeft: '1.25rem', color: '#303030', fontSize: '0.9rem', lineHeight: 1.7 }}>
          <li>
            <strong>Build a core team of 4</strong> — Start with 2 common Attackers or Speedsters from your
            starting habitat, then add 1 Support and 1 Defender or Tank. This gives you a functional team
            capable of handling all early and mid-game content.
          </li>
          <li>
            <strong>Complete the common and uncommon tiers</strong> — Work through your habitat&apos;s common
            and uncommon Pokemon systematically. These are the most reliable material sources and give you
            the crafting foundation to attempt harder content.
          </li>
          <li>
            <strong>Expand to a second habitat</strong> — Once your core team is stable, identify a second
            habitat with weather conditions that differ from your starting area. A second habitat doubles
            your available Pokemon and material drop tables.
          </li>
          <li>
            <strong>Pursue rare Pokemon by drop table priority</strong> — Not all rare Pokemon are worth the
            same farming investment. Prioritize rare Pokemon whose drop tables fill gaps in your current
            crafting需求. Check individual wiki pages for specific drop recommendations.
          </li>
          <li>
            <strong>Target legendary Pokemon last</strong> — Legendary Pokemon require specific sessions
            with optimal conditions. Do not spend rare bait items on legendary attempts until you have
            the recipe support and team durability to survive a long habitat session.
          </li>
        </ol>
      </section>

      {/* Legendary spotlight */}
      <section style={{ marginTop: '1.75rem', padding: '1.5rem', borderRadius: '12px', border: '2px solid rgba(255, 193, 7, 0.45)', background: 'rgba(255, 251, 225, 0.96)' }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: '0.85rem' }}>Legendary Pokemon in the Collection</h2>
        <p style={{ color: '#303030', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '1rem' }}>
          Legendary Pokemon are the rarest tier in Pokopia and represent the highest-value farming targets
          in the game. Each legendary has a unique habitat, specific weather and time requirements, and
          a drop table that includes materials unobtainable elsewhere.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {pokemonData
            .filter((p) => p.rarity === 'legendary')
            .map((p) => (
              <div key={p.id} style={{
                padding: '0.9rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 193, 7, 0.45)',
                background: 'rgba(255, 255, 255, 0.88)',
              }}>
                <Link href={`/wiki/pokemon/${p.id}`} style={{ fontWeight: 900, fontSize: '0.95rem', display: 'block', marginBottom: '0.3rem' }}>
                  {p.name}
                </Link>
                <p style={{ color: '#637083', fontSize: '0.78rem' }}>{p.type} · {habitatNames[p.habitat] || p.habitat}</p>
                <p style={{ color: '#637083', fontSize: '0.75rem', marginTop: '0.3rem' }}>
                  {p.spawn_time} · {p.weather}
                </p>
                <p style={{ color: '#637083', fontSize: '0.75rem', marginTop: '0.2rem' }}>Drops: {p.drops}</p>
              </div>
            ))}
        </div>
        <p style={{ color: '#637083', fontSize: '0.88rem', marginTop: '1rem', lineHeight: 1.65 }}>
          All legendary Pokemon should be reviewed on their individual wiki pages before attempting a
          dedicated farming session. Each entry includes specific route guidance, recommended bait,
          and team composition notes for maximizing encounter efficiency.
        </p>
      </section>

      {/* FAQ */}
      <section style={{ marginTop: '1.75rem', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255, 209, 102, 0.65)', background: 'rgba(255, 253, 247, 0.94)' }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'grid', gap: '0.85rem' }}>
          {faqs.map((faq) => (
            <details key={faq.question} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(220, 232, 220, 0.95)', background: 'rgba(255, 255, 255, 0.88)' }}>
              <summary style={{ fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>{faq.question}</summary>
              <p style={{ marginTop: '0.5rem', color: '#3d475c', fontSize: '0.88rem', lineHeight: 1.65 }}>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Related tools */}
      <section style={{ marginTop: '1.75rem' }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: '0.85rem' }}>Planning Tools for Collection Completion</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {[
            { href: '/wiki/pokemon?view=collection', label: 'Interactive Checklist', desc: 'Filter and track your collection progress' },
            { href: '/tools/spawn-tracker', label: 'Spawn Tracker', desc: 'Find the right weather and time window' },
            { href: '/tools/habitat-planner', label: 'Habitat Planner', desc: 'Plan efficient multi-habitat farming routes' },
            { href: '/tools/team-builder', label: 'Team Builder', desc: 'Draft balanced teams from your collection' },
            { href: '/wiki/pokemon/compatibility', label: 'Compatibility Checker', desc: 'Evaluate team synergy for your collected Pokemon' },
          ].map((tool) => (
            <Link key={tool.href} href={tool.href} style={{
              display: 'block',
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid rgba(220, 232, 220, 0.95)',
              background: 'rgba(255, 255, 255, 0.88)',
              color: 'inherit',
              textDecoration: 'none',
            }}>
              <strong style={{ fontSize: '0.9rem', display: 'block', marginBottom: '0.3rem' }}>{tool.label}</strong>
              <span style={{ fontSize: '0.8rem', color: '#637083' }}>{tool.desc}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
