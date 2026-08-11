'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import pokemonData from '@/data/pokemon.json'
import habitatsData from '@/data/habitats.json'
import { DataStatus } from '@/components/content/DataStatus'
import { pokemonImage } from '@/lib/localImages'

const habitatNames = Object.fromEntries(habitatsData.map((h) => [h.id, h.name]))
const ALL_TYPES = [...new Set(pokemonData.flatMap((p) => p.type.split('/')))].sort()

/* Type matchup chart — effectiveness of attacker type vs defender type */
const TYPE_CHART: Record<string, Record<string, number>> = {
  Fire:    { Grass: 2, Water: 0.5, Fire: 0.5, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
  Water:   { Fire: 2, Grass: 0.5, Water: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Grass:   { Water: 2, Fire: 0.5, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
  Electric:{ Water: 2, Grass: 0.5, Electric: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
  Ice:     { Grass: 2, Fire: 0.5, Water: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
  Fighting:{ Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Dark: 2, Steel: 2, Fairy: 0.5 },
  Poison:  { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Bug: 0.5, Fairy: 2 },
  Ground:  { Fire: 2, Grass: 0.5, Electric: 2, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
  Flying:  { Grass: 2, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5, Electric: 0.5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
  Bug:     { Grass: 2, Fire: 0.5, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Dark: 2, Steel: 0.5, Fairy: 0.5 },
  Rock:    { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
  Ghost:   { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
  Dragon:  { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark:    { Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
  Steel:   { Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Rock: 2, Steel: 0.5, Fairy: 2 },
  Fairy:   { Fire: 0.5, Fighting: 2, Dragon: 2, Dark: 2, Steel: 0.5 },
  Normal:  { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Crystal: {},
}

function getWeaknesses(types: string[]): string[] {
  const weak: string[] = []
  for (const type of types) {
    for (const [defType, mult] of Object.entries(TYPE_CHART[type] || {})) {
      if (mult >= 2) weak.push(defType)
    }
  }
  return [...new Set(weak)]
}

function getResistances(types: string[]): string[] {
  const res: string[] = []
  for (const type of types) {
    for (const [defType, mult] of Object.entries(TYPE_CHART[type] || {})) {
      if (mult <= 0.5) res.push(defType)
    }
  }
  return [...new Set(res)]
}

interface MatchScore {
  pokemon: typeof pokemonData[number]
  total: number
  reasons: string[]
}

function scoreRoommate(picker: typeof pokemonData[number], candidate: typeof pokemonData[number]): MatchScore {
  const reasons: string[] = []
  let total = 0
  const typesA = picker.type.split('/')
  const typesB = candidate.type.split('/')

  // Different role (roommates with same role compete, not complement)
  if (picker.specialty !== candidate.specialty) {
    total += 2
    reasons.push('Different roles — balanced activity coverage')
  }

  // No shared types
  const sharedTypes = typesA.filter((t) => typesB.includes(t))
  if (sharedTypes.length === 0) {
    total += 2
    reasons.push('No overlapping weaknesses')
  } else {
    total -= 1
    reasons.push(`Shared type: ${sharedTypes.join('/')} — watch double weaknesses`)
  }

  // Defensive complement — candidate resists what picker is weak to
  const weakA = getWeaknesses(typesA)
  const resB = getResistances(typesB)
  const covered = weakA.filter((w) => resB.includes(w))
  if (covered.length > 0) {
    total += 2
    reasons.push(`${covered.join(', ')} weaknesses covered by roommate`)
  }

  // Different habitat — more variety in daily activities
  if (picker.habitat !== candidate.habitat) {
    total += 1
    reasons.push('Different habitats — more content variety')
  }

  // Different weather — active in different conditions
  if (picker.weather !== candidate.weather) {
    total += 1
    reasons.push(`Weather complement: ${picker.weather} vs ${candidate.weather}`)
  }

  // Different time window — covers more of the day
  if (picker.spawn_time !== candidate.spawn_time) {
    total += 1
    reasons.push(`Time complement: ${picker.spawn_time} window vs ${candidate.spawn_time}`)
  }

  return { pokemon: candidate, total, reasons }
}

export default function RoommateMatchmakerClient() {
  const [picker, setPicker] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [minScore, setMinScore] = useState(4)

  const selected = pokemonData.find((p) => p.id === picker)

  const matches = useMemo<MatchScore[]>(() => {
    if (!picker) return []
    return pokemonData
      .filter((p) => p.id !== picker)
      .filter((p) => !typeFilter || p.type.split('/').includes(typeFilter))
      .filter((p) => !roleFilter || p.specialty === roleFilter)
      .map((p) => scoreRoommate(selected!, p))
      .filter((m) => m.total >= minScore)
      .sort((a, b) => b.total - a.total || b.pokemon.name.localeCompare(a.pokemon.name))
  }, [picker, typeFilter, roleFilter, minScore, selected])

  const ALL_ROLES = [...new Set(pokemonData.map((p) => p.specialty))].sort()

  return (
    <>
      {/* How the feature works */}
      <section className="topic-section">
        <span className="panel-kicker">Feature Guide</span>
        <h2>How Roommate Matchmaking Works</h2>
        <p>
          The Roommate Matchmaker helps you find the best roommate Pokemon for your active team member.
          Pick the Pokemon you want to find a roommate for, and the tool scores every other Pokemon by how
          well they complement your pick across five dimensions: role balance, type coverage, defensive
          synergy, habitat variety, and time-of-day complement.
        </p>
        <p>
          A higher total score means the pair covers more different activities, weather conditions, and
          time windows together — giving you a broader set of daily routines without needing to swap
          Pokemon in and out. Scores of 4 or above represent a useful roommate pairing. Scores of 6 or
          above indicate a particularly strong complement.
        </p>
        <div className="topic-step-grid">
          <div className="topic-step-card">
            <span>Step 1</span>
            <h3>Pick your Pokemon</h3>
            <p>Choose the Pokemon you want to find a roommate for using the selector below.</p>
          </div>
          <div className="topic-step-card">
            <span>Step 2</span>
            <h3>Review the scores</h3>
            <p>The top matches appear ranked by total score with reasons for each point.</p>
          </div>
          <div className="topic-step-card">
            <span>Step 3</span>
            <h3>Check individual pages</h3>
            <p>Open any matched Pokemon page for full habitat, weather, and route details.</p>
          </div>
          <div className="topic-step-card">
            <span>Step 4</span>
            <h3>Plan the pair</h3>
            <p>Use the Habitat Planner and Recipe Calculator to integrate the pair into your routine.</p>
          </div>
        </div>
      </section>

      {/* Matchmaker tool */}
      <section className="topic-section">
        <span className="panel-kicker">Interactive Tool</span>
        <h2>Roommate Matchmaker</h2>

        <div style={{
          padding: '1.5rem',
          border: '2px solid rgba(220, 232, 220, 0.95)',
          borderRadius: '12px',
          background: 'rgba(255, 253, 247, 0.96)',
          boxShadow: '0 4px 0 rgba(47, 76, 113, 0.08)',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label htmlFor="picker-select" style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.8rem', fontWeight: 900, color: '#637083', textTransform: 'uppercase' }}>
                Find roommate for
              </label>
              <select
                id="picker-select"
                value={picker}
                onChange={(e) => setPicker(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.75rem', border: '2px solid #dce8dc', borderRadius: '8px', font: 'inherit', background: 'rgba(255,255,255,0.92)' }}
              >
                <option value="">Choose a Pokemon...</option>
                {pokemonData.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — {p.type} · {p.specialty}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="type-filter" style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.8rem', fontWeight: 900, color: '#637083', textTransform: 'uppercase' }}>
                Filter by type
              </label>
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.75rem', border: '2px solid #dce8dc', borderRadius: '8px', font: 'inherit', background: 'rgba(255,255,255,0.92)' }}
              >
                <option value="">Any type</option>
                {ALL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="role-filter" style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.8rem', fontWeight: 900, color: '#637083', textTransform: 'uppercase' }}>
                Filter by role
              </label>
              <select
                id="role-filter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.75rem', border: '2px solid #dce8dc', borderRadius: '8px', font: 'inherit', background: 'rgba(255,255,255,0.92)' }}
              >
                <option value="">Any role</option>
                {ALL_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="min-score" style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.8rem', fontWeight: 900, color: '#637083', textTransform: 'uppercase' }}>
                Min score
              </label>
              <select
                id="min-score"
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                style={{ width: '100%', padding: '0.65rem 0.75rem', border: '2px solid #dce8dc', borderRadius: '8px', font: 'inherit', background: 'rgba(255,255,255,0.92)' }}
              >
                <option value={3}>3+ (Any useful)</option>
                <option value={4}>4+ (Good pair)</option>
                <option value={5}>5+ (Strong pair)</option>
                <option value={6}>6+ (Excellent pair)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Selected Pokemon profile */}
        {selected && (
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            padding: '1rem 1.25rem',
            border: '2px solid rgba(255, 209, 102, 0.58)',
            borderRadius: '10px',
            background: 'rgba(255, 248, 225, 0.96)',
            marginBottom: '1.25rem',
            flexWrap: 'wrap'
          }}>
            <img
              src={pokemonImage(selected.name)}
              alt={selected.name}
              style={{ width: '64px', height: '64px', objectFit: 'contain', border: '2px solid #dce8dc', borderRadius: '10px', background: '#f2f8f2', padding: '4px' }}
              loading="lazy"
            />
            <div>
              <strong style={{ fontSize: '1.1rem' }}>{selected.name}</strong>
              <p style={{ color: '#637083', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                {selected.type} · {selected.specialty} · {habitatNames[selected.habitat] || selected.habitat}
              </p>
              <p style={{ color: '#637083', fontSize: '0.8rem' }}>
                {selected.weather} · {selected.spawn_time} · Food: {selected.favorite_food}
              </p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Link href={`/wiki/pokemon/${selected.id}`} style={{ padding: '0.45rem 0.75rem', border: '1px solid #dce8dc', borderRadius: '999px', background: 'white', fontSize: '0.82rem', fontWeight: 800 }}>
                Open page
              </Link>
              <Link href={`/wiki/pokemon/compatibility?a=${selected.id}`} style={{ padding: '0.45rem 0.75rem', border: '1px solid #dce8dc', borderRadius: '999px', background: 'white', fontSize: '0.82rem', fontWeight: 800 }}>
                Check compatibility
              </Link>
            </div>
          </div>
        )}

        {/* Match results */}
        {!picker && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '2px dashed rgba(220,232,220,0.95)', borderRadius: '10px', color: '#637083' }}>
            <p style={{ fontSize: '1.05rem', fontWeight: 700 }}>Select a Pokemon above to find roommates</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>The tool will score all other Pokemon by how well they complement your pick</p>
          </div>
        )}

        {picker && matches.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '2px dashed rgba(220,232,220,0.95)', borderRadius: '10px', color: '#637083' }}>
            <p>No roommates found with score {minScore}+ and the current filters.</p>
            <p style={{ marginTop: '0.5rem' }}>Try lowering the minimum score or removing type/role filters.</p>
          </div>
        )}

        {matches.length > 0 && (
          <div>
            <p style={{ marginBottom: '1rem', color: '#637083', fontSize: '0.9rem', fontWeight: 700 }}>
              {matches.length} roommate{matches.length !== 1 ? 's' : ''} found for {selected?.name}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem' }}>
              {matches.map(({ pokemon, total, reasons }) => (
                <div
                  key={pokemon.id}
                  style={{
                    padding: '1rem',
                    borderRadius: '10px',
                    border: `2px solid ${total >= 6 ? 'rgba(89, 201, 130, 0.65)' : total >= 4 ? 'rgba(255, 209, 102, 0.55)' : 'rgba(220,232,220,0.95)'}`,
                    background: total >= 6 ? 'rgba(242, 251, 244, 0.96)' : 'rgba(255, 253, 247, 0.96)',
                    boxShadow: '0 3px 0 rgba(47, 76, 113, 0.08)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <img
                      src={pokemonImage(pokemon.name)}
                      alt={pokemon.name}
                      style={{ width: '52px', height: '52px', objectFit: 'contain', border: '2px solid #dce8dc', borderRadius: '8px', background: '#f2f8f2', padding: '3px' }}
                      loading="lazy"
                    />
                    <div style={{ flex: 1 }}>
                      <Link href={`/wiki/pokemon/${pokemon.id}`} style={{ fontWeight: 900, fontSize: '0.95rem', display: 'block' }}>
                        {pokemon.name}
                      </Link>
                      <p style={{ color: '#637083', fontSize: '0.78rem' }}>{pokemon.type} · {pokemon.specialty}</p>
                    </div>
                    <div style={{
                      display: 'grid',
                      placeItems: 'center',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      border: `3px solid ${total >= 6 ? '#59c982' : total >= 4 ? '#ffd166' : '#ccc'}`,
                      background: 'white',
                      fontSize: '0.95rem',
                      fontWeight: 900,
                      color: '#20243a',
                      flexShrink: 0,
                    }}>
                      {total}
                    </div>
                  </div>
                  <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                    {reasons.map((r) => (
                      <li key={r} style={{ color: '#3d475c', fontSize: '0.82rem', marginBottom: '0.2rem', lineHeight: 1.4 }}>{r}</li>
                    ))}
                  </ul>
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <Link href={`/wiki/pokemon/${pokemon.id}`} style={{ padding: '0.3rem 0.6rem', border: '1px solid #dce8dc', borderRadius: '999px', background: 'white', fontSize: '0.75rem', fontWeight: 800 }}>
                      Wiki page
                    </Link>
                    <Link href={`/wiki/habitat/${pokemon.habitat}`} style={{ padding: '0.3rem 0.6rem', border: '1px solid #dce8dc', borderRadius: '999px', background: 'white', fontSize: '0.75rem', fontWeight: 800 }}>
                      {habitatNames[pokemon.habitat]}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Scouting tips */}
      <section className="topic-section">
        <span className="panel-kicker">Route Planning</span>
        <h2>How to Use Roommates in Your Daily Routine</h2>
        <div className="topic-two-column">
          <div className="topic-link-list">
            <h3>Build morning and evening pairs</h3>
            <p>Pick roommates with different spawn time windows so at least one is always active.</p>
            <Link href="/tools/spawn-tracker">Check spawn windows with the Spawn Tracker</Link>
          </div>
          <div className="topic-link-list">
            <h3>Match weather for flexible farming</h3>
            <p>When weather changes, a roommate pair covering different conditions keeps your routine stable.</p>
            <Link href="/wiki/habitat">Browse habitat weather conditions</Link>
          </div>
          <div className="topic-link-list">
            <h3>Plan habitat pairs for material diversity</h3>
            <p>Roommates from different habitats give you access to two drop tables in one session.</p>
            <Link href="/tools/habitat-planner">Plan multi-habitat routes</Link>
          </div>
          <div className="topic-link-list">
            <h3>Use role balance to avoid dead slots</h3>
            <p>A Support roommate keeps farming loops running even when your Attacker is on cooldown.</p>
            <Link href="/tools/team-builder">Draft balanced teams with the Team Builder</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="topic-faq">
        <span className="panel-kicker">FAQ</span>
        <h2>Roommate Matchmaker Questions</h2>
        {[
          {
            q: 'What makes a good roommate pair in Pokopia?',
            a: 'A good roommate pair covers different roles, types, habitats, weather conditions, and time windows. The Roommate Matchmaker scores candidates across all five dimensions so you can quickly identify pairs that broaden your daily routine without leaving gaps.',
          },
          {
            q: 'Does a high score guarantee a good team?',
            a: 'A score of 6 or above indicates strong complementary coverage, but team quality also depends on your current route goals, recipe support, and specific habitat difficulty. Use the Team Builder to validate full four-slot drafts before committing rare resources.',
          },
          {
            q: 'Can I use the matchmaker for legendary Pokemon?',
            a: 'Yes. Legendary Pokemon work in the matchmaker the same as any other entry. Because legendary Pokemon often have restrictive habitat or weather conditions, finding a roommate from a different habitat or weather set can be especially valuable for keeping your routine flexible.',
          },
          {
            q: 'Why do different habitats matter for roommates?',
            a: 'Pokemon from different habitats can be farmed in separate sessions without retracing the same ground. A roommate pair from different habitats effectively doubles the material drop tables you can access in a given play session.',
          },
        ].map((faq) => (
          <details key={faq.q}>
            <summary>{faq.q}</summary>
            <p>{faq.a}</p>
          </details>
        ))}
      </section>
    </>
  )
}
