'use client'

import { useState } from 'react'
import Link from 'next/link'
import pokemonData from '@/data/pokemon.json'
import { DataStatus } from '@/components/content/DataStatus'

const typeEmoji: Record<string, string> = {
  'Fire': '🔥', 'Water': '💧', 'Grass': '🌿', 'Electric': '⚡',
  'Ice': '❄️', 'Ghost': '👻', 'Dark': '🌑', 'Dragon': '🐉',
  'Steel': '⚙️', 'Rock': '🪨', 'Ground': '🌍', 'Flying': '🕊️',
  'Normal': '⚪', 'Poison': '☠️', 'Fairy': '✨', 'Crystal': '💎',
}

function getTypeEmoji(type: string): string {
  for (const [key, emoji] of Object.entries(typeEmoji)) {
    if (type.toLowerCase().includes(key.toLowerCase())) return emoji
  }
  return '⚡'
}

const roles = ['Tank', 'Attacker', 'Assassin', 'Speedster', 'Support', 'Defender']
const roleEmoji: Record<string, string> = {
  Tank: '🛡️', Attacker: '⚔️', Assassin: '🗡️', Speedster: '⚡', Support: '💚', Defender: '🛡️',
}

const recommendedTeams = [
  {
    name: 'Balanced Starter Draft',
    desc: 'A simple role mix for early planning',
    members: ['Bulbin', 'Aquap', 'Pikafire'],
  },
  {
    name: 'Fire Route Draft',
    desc: 'A fire-focused group for comparing habitat and recipe pages',
    members: ['Pikafire', 'Charmuddy', 'Flamexor'],
  },
  {
    name: 'Ghost Route Draft',
    desc: 'A ghost-focused group for checking role coverage',
    members: ['Shados', 'Shadowclaw', 'Nightfall'],
  },
  {
    name: 'Electric Utility Draft',
    desc: 'A speed-leaning group for database comparison',
    members: ['Zaprat', 'Magnedex', 'Voltscale'],
  },
  {
    name: 'Durability Draft',
    desc: 'A sturdy group for planning longer routes',
    members: ['Flamexor', 'Bulbin', 'Tidlet'],
  },
  {
    name: 'Dragon Route Draft',
    desc: 'A dragon-focused group for late-route comparison',
    members: ['Voltscale', 'Snorizard', 'Primordion'],
  },
]

export default function TeamBuilder() {
  const [selected, setSelected] = useState<string[]>([])
  const [filterRole, setFilterRole] = useState<string>('all')

  const togglePokemon = (name: string) => {
    if (selected.includes(name)) {
      setSelected(selected.filter((n) => n !== name))
    } else if (selected.length < 6) {
      setSelected([...selected, name])
    }
  }

  const filteredPokemon = pokemonData.filter((p) => {
    if (filterRole === 'all') return true
    return p.specialty === filterRole
  })

  const selectedPokemon = selected.map((name) => pokemonData.find((p) => p.name === name)).filter(Boolean)

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/tools" style={{ fontSize: '0.875rem', color: '#666' }}>
          ← Back to Tools
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>
          ⚔️ Team Builder
        </h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Draft up to 6 Pokemon from current database roles, then verify details on Pokemon and habitat pages.
        </p>
      </header>

      <DataStatus
        status="Database planning tool"
        note="Suggested teams are editorial drafts built from site database roles. They are not official team rankings, competitive recommendations, or verified clear-speed results."
        updatedAt="2026-05-23"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        {/* Pokemon Selection */}
        <div>
          {/* Role Filter */}
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilterRole('all')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '2px solid',
                borderColor: filterRole === 'all' ? '#e94560' : '#e5e5e5',
                background: filterRole === 'all' ? '#e94560' : 'white',
                color: filterRole === 'all' ? 'white' : '#666',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              All
            </button>
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: '2px solid',
                  borderColor: filterRole === role ? '#e94560' : '#e5e5e5',
                  background: filterRole === role ? '#e94560' : 'white',
                  color: filterRole === role ? 'white' : '#666',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {roleEmoji[role]} {role}
              </button>
            ))}
          </div>

          {/* Pokemon Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '0.75rem',
              maxHeight: '500px',
              overflowY: 'auto',
              padding: '0.5rem',
            }}
          >
            {filteredPokemon.map((p) => {
              const isSelected = selected.includes(p.name)
              return (
                <button
                  key={p.id}
                  onClick={() => togglePokemon(p.name)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: '2px solid',
                    borderColor: isSelected ? '#e94560' : '#e5e5e5',
                    background: isSelected ? '#fef2f4' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    opacity: selected.length >= 6 && !isSelected ? 0.5 : 1,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <span style={{ fontSize: '1.5rem' }}>{getTypeEmoji(p.type)}</span>
                    {isSelected && (
                      <span style={{ color: '#e94560', fontWeight: 700, fontSize: '0.875rem' }}>✓</span>
                    )}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.8rem', marginTop: '0.25rem', color: '#1a1a2e' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#666', marginTop: '0.125rem' }}>
                    {p.specialty}
                  </div>
                  <span
                    className={`rarity ${p.rarity}`}
                    style={{ fontSize: '0.6rem', marginTop: '0.25rem', display: 'inline-block' }}
                  >
                    {p.rarity}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Team Panel */}
        <div style={{ position: 'sticky', top: '1rem' }}>
          {/* Your Team */}
          <div
            style={{
              padding: '1.5rem',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              background: 'white',
              marginBottom: '1.5rem',
            }}
          >
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>
              Your Team ({selected.length}/6)
            </h2>

            {selected.length === 0 ? (
              <p style={{ color: '#999', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>
                Select Pokémon to build your team
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedPokemon.map((p) => p && (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.5rem',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{getTypeEmoji(p.type)}</span>
                    <div style={{ flex: 1 }}>
                      <Link href={`/wiki/pokemon/${p.id}`} style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a2e' }}>
                        {p.name}
                      </Link>
                      <div style={{ fontSize: '0.7rem', color: '#666' }}>{p.specialty}</div>
                    </div>
                    <button
                      onClick={() => togglePokemon(p.name)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        border: 'none',
                        background: '#ffebee',
                        color: '#c62828',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selected.length > 0 && (
              <button
                onClick={() => setSelected([])}
                style={{
                  marginTop: '1rem',
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                Clear Team
              </button>
            )}
          </div>

          {/* Recommended Teams */}
          <div
            style={{
              padding: '1.5rem',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              background: 'white',
            }}
          >
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>
              Planning Drafts
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recommendedTeams.map((team) => (
                <div
                  key={team.name}
                  style={{
                    padding: '0.75rem',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{team.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666', margin: '0.25rem 0' }}>{team.desc}</div>
                  <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {team.members.map((member) => {
                      const p = pokemonData.find((pk) => pk.name === member)
                      return (
                        <button
                          key={member}
                          onClick={() => !selected.includes(member) && togglePokemon(member)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            border: '1px solid',
                            borderColor: selected.includes(member) ? '#e94560' : '#ddd',
                            borderRadius: '4px',
                            background: selected.includes(member) ? '#fef2f4' : 'white',
                            fontSize: '0.7rem',
                            cursor: selected.includes(member) ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          {p && getTypeEmoji(p.type)} {member}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Synergy Tips */}
      {selected.length >= 3 && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: '#e8f5e9',
            borderRadius: '12px',
          }}
        >
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            💡 Team Synergy Tips
          </h3>
          <ul style={{ fontSize: '0.875rem', color: '#666', paddingLeft: '1.25rem', margin: 0 }}>
            {selected.length >= 4 && <li>Your draft has several roles covered; compare Support entries if the route needs utility.</li>}
            {selected.filter((n) => pokemonData.find((p) => p.name === n)?.specialty === 'Tank').length === 0 && (
              <li>No Tank role selected; check durability-focused Pokemon if the habitat route is difficult.</li>
            )}
            {selected.filter((n) => pokemonData.find((p) => p.name === n)?.rarity === 'legendary').length === 0 && (
              <li>No legendary entry selected; compare rarity, habitat access, and resource needs before adding one.</li>
            )}
            {!selected.some((n) => pokemonData.find((p) => p.name === n)?.type.includes('Ghost')) && (
              <li>No Ghost-type selected; check whether the target habitat actually needs Ghost-type planning.</li>
            )}
            {selected.length >= 5 && <li>Before using this draft, match weather, recipes, and habitat conditions on the linked pages.</li>}
          </ul>
        </div>
      )}
    </main>
  )
}
