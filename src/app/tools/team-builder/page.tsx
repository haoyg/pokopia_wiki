'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import pokemonData from '@/data/team-pokemon-links.json'
import habitatLinksData from '@/data/habitat-links.json'
import recipeLinksData from '@/data/recipe-links.json'
import guideLinksData from '@/data/guide-links.json'
import { DataStatus } from '@/components/content/DataStatus'

const roles = ['all', 'Tank', 'Attacker', 'Assassin', 'Speedster', 'Support', 'Defender']

const goals = [
  {
    id: 'balanced',
    label: 'Balanced Progression',
    note: 'A stable team for route learning, unlocks, and mixed farming.',
    preferredRoles: ['Defender', 'Attacker', 'Support', 'Speedster'],
    preferredTypes: ['Grass', 'Water', 'Fire', 'Electric'],
    recipeId: 'rec004',
    guideKeyword: 'starter',
  },
  {
    id: 'boss',
    label: 'Boss Push',
    note: 'Prioritize burst damage with enough durability to survive the fight.',
    preferredRoles: ['Attacker', 'Tank', 'Defender', 'Support'],
    preferredTypes: ['Fire', 'Dragon', 'Electric', 'Steel'],
    recipeId: 'rec011',
    guideKeyword: 'fire',
  },
  {
    id: 'rare-farming',
    label: 'Rare Farming',
    note: 'Build around repeatable checks, route speed, and safe capture windows.',
    preferredRoles: ['Speedster', 'Support', 'Assassin', 'Defender'],
    preferredTypes: ['Grass', 'Water', 'Flying', 'Ghost'],
    recipeId: 'rec005',
    guideKeyword: 'rare',
  },
  {
    id: 'safe-daily',
    label: 'Safe Daily',
    note: 'Favor common and uncommon Pokemon that keep farming loops cheap.',
    preferredRoles: ['Defender', 'Support', 'Speedster', 'Attacker'],
    preferredTypes: ['Grass', 'Water', 'Normal', 'Electric'],
    recipeId: 'rec009',
    guideKeyword: 'leveling',
  },
  {
    id: 'speed',
    label: 'Speed Route',
    note: 'Focus on mobility and fast clears for known routes.',
    preferredRoles: ['Speedster', 'Attacker', 'Support', 'Assassin'],
    preferredTypes: ['Electric', 'Flying', 'Fire', 'Water'],
    recipeId: 'rec003',
    guideKeyword: 'speed',
  },
]

const roleSlots = [
  { key: 'Lead', roles: ['Defender', 'Tank', 'Speedster'], note: 'Starts the route and controls the first mistake window.' },
  { key: 'Damage', roles: ['Attacker', 'Assassin'], note: 'Handles boss rooms, elite checks, or faster clears.' },
  { key: 'Support', roles: ['Support', 'Speedster'], note: 'Keeps farming loops consistent and reduces route friction.' },
  { key: 'Survival', roles: ['Tank', 'Defender', 'Support'], note: 'Protects long routes, bad weather, and final-room pressure.' },
]

function includesType(type: string, preferredTypes: string[]) {
  return preferredTypes.some((target) => type.toLowerCase().includes(target.toLowerCase()))
}

function scorePokemon(pokemon: (typeof pokemonData)[number], goal: (typeof goals)[number]) {
  let score = 0
  const roleIndex = goal.preferredRoles.indexOf(pokemon.specialty)
  if (roleIndex >= 0) score += 8 - roleIndex
  if (includesType(pokemon.type, goal.preferredTypes)) score += 4
  if (goal.id === 'safe-daily' && ['common', 'uncommon'].includes(pokemon.rarity)) score += 3
  if (goal.id === 'boss' && ['rare', 'legendary'].includes(pokemon.rarity)) score += 2
  if (goal.id === 'rare-farming' && pokemon.specialty === 'Speedster') score += 2
  if (goal.id === 'balanced' && pokemon.rarity !== 'legendary') score += 1
  return score
}

function pickForSlot(
  pool: typeof pokemonData,
  slot: (typeof roleSlots)[number],
  usedIds: Set<string>,
  goal: (typeof goals)[number]
) {
  return pool
    .filter((pokemon) => !usedIds.has(pokemon.id))
    .filter((pokemon) => slot.roles.includes(pokemon.specialty))
    .sort((a, b) => scorePokemon(b, goal) - scorePokemon(a, goal))[0]
}

function uniqueIds(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)))
}

export default function TeamBuilder() {
  const [selectedGoal, setSelectedGoal] = useState('balanced')
  const [filterRole, setFilterRole] = useState('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const activeGoal = goals.find((goal) => goal.id === selectedGoal) || goals[0]

  const rankedPokemon = useMemo(() => {
    return pokemonData
      .map((pokemon) => ({
        pokemon,
        score: scorePokemon(pokemon, activeGoal),
      }))
      .filter(({ pokemon }) => filterRole === 'all' || pokemon.specialty === filterRole)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return a.pokemon.name.localeCompare(b.pokemon.name)
      })
  }, [activeGoal, filterRole])

  const autoTeam = useMemo(() => {
    const used = new Set<string>()
    const picked = roleSlots.map((slot) => {
      const pokemon = pickForSlot(pokemonData, slot, used, activeGoal)
      if (pokemon) used.add(pokemon.id)
      return { slot, pokemon }
    })

    for (const { pokemon } of rankedPokemon) {
      if (used.size >= 4) break
      if (!used.has(pokemon.id)) used.add(pokemon.id)
    }

    return picked
  }, [activeGoal, rankedPokemon])

  const visibleTeamIds = selectedIds.length > 0
    ? selectedIds
    : autoTeam.map(({ pokemon }) => pokemon?.id).filter(Boolean) as string[]

  const selectedPokemon = visibleTeamIds
    .map((id) => pokemonData.find((pokemon) => pokemon.id === id))
    .filter(Boolean) as typeof pokemonData

  const habitatIds = uniqueIds(selectedPokemon.map((pokemon) => pokemon.habitat))
  const relatedHabitats = habitatLinksData.filter((habitat) => habitatIds.includes(habitat.id)).slice(0, 5)
  const relatedRecipe = recipeLinksData.find((recipe) => recipe.id === activeGoal.recipeId)
  const relatedGuides = guideLinksData
    .filter((guide) => {
      const haystack = `${guide.title} ${guide.related_pokemon} ${guide.related_habitats} ${guide.related_items}`.toLowerCase()
      return haystack.includes(activeGoal.guideKeyword)
        || selectedPokemon.some((pokemon) => haystack.includes(pokemon.id))
        || habitatIds.some((id) => haystack.includes(id))
    })
    .slice(0, 4)

  const togglePokemon = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      if (current.length >= 6) return current
      return [...current, id]
    })
  }

  return (
    <main style={{ maxWidth: '1120px', margin: '0 auto', padding: '2rem 1rem 3rem' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <Link href="/tools" style={{ fontSize: '0.875rem', color: '#637083' }}>
          Back to Tools
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>
          Team Builder
        </h1>
        <p style={{ color: '#637083', marginTop: '0.5rem', maxWidth: '780px' }}>
          Choose a team goal, compare Pokemon by role, and connect the draft to recipes, habitats, and guide pages before committing resources.
        </p>
      </header>

      <DataStatus
        status="Interactive team planning tool"
        note="Team recommendations are editorial planning drafts based on Pokopia Portal role, type, habitat, recipe, and guide data. They are not official rankings or verified competitive results."
        updatedAt="2026-05-26"
      />

      <section style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Team Goal</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => {
                setSelectedGoal(goal.id)
                setSelectedIds([])
              }}
              style={{
                minHeight: '108px',
                padding: '1rem',
                borderRadius: '10px',
                border: selectedGoal === goal.id ? '2px solid #ff5c7a' : '1px solid #dce8dc',
                background: selectedGoal === goal.id ? '#fff1f4' : 'rgba(255, 255, 255, 0.88)',
                boxShadow: selectedGoal === goal.id ? '0 8px 18px rgba(47, 76, 113, 0.12)' : '0 2px 0 rgba(47, 76, 113, 0.08)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>{goal.label}</strong>
              <span style={{ display: 'block', marginTop: '0.45rem', color: '#637083', fontSize: '0.82rem', lineHeight: 1.45 }}>
                {goal.note}
              </span>
            </button>
          ))}
        </div>
      </section>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '1.25rem', alignItems: 'start' }}>
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1rem' }}>Pokemon Pool</h2>
            <select
              value={filterRole}
              onChange={(event) => setFilterRole(event.target.value)}
              aria-label="Filter Pokemon by role"
              style={{
                minWidth: '140px',
                padding: '0.55rem 0.65rem',
                borderRadius: '8px',
                border: '1px solid #dce8dc',
                background: 'white',
                color: '#20243a',
              }}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role === 'all' ? 'All roles' : role}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.65rem' }}>
            {rankedPokemon.map(({ pokemon, score }) => {
              const isSelected = visibleTeamIds.includes(pokemon.id)
              const isManualSelected = selectedIds.includes(pokemon.id)

              return (
                <button
                  key={pokemon.id}
                  onClick={() => togglePokemon(pokemon.id)}
                  style={{
                    minHeight: '128px',
                    padding: '0.85rem',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #ff5c7a' : '1px solid #dce8dc',
                    background: isSelected ? '#fff1f4' : 'rgba(255, 255, 255, 0.92)',
                    cursor: selectedIds.length >= 6 && !isManualSelected ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    opacity: selectedIds.length >= 6 && !isManualSelected ? 0.55 : 1,
                    boxShadow: '0 2px 0 rgba(47, 76, 113, 0.08)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', alignItems: 'start' }}>
                    <strong style={{ fontSize: '0.9rem' }}>{pokemon.name}</strong>
                    <span className={`rarity ${pokemon.rarity}`} style={{ fontSize: '0.62rem' }}>{pokemon.rarity}</span>
                  </div>
                  <p style={{ marginTop: '0.35rem', color: '#637083', fontSize: '0.8rem' }}>
                    {pokemon.type} · {pokemon.specialty}
                  </p>
                  <small style={{ display: 'block', marginTop: '0.5rem', color: score > 0 ? '#2f84d8' : '#8b97a8' }}>
                    Team match {score}
                  </small>
                  <Link
                    href={`/wiki/pokemon/${pokemon.id}`}
                    onClick={(event) => event.stopPropagation()}
                    style={{ display: 'inline-block', marginTop: '0.55rem', fontSize: '0.78rem' }}
                  >
                    Open Pokemon
                  </Link>
                </button>
              )
            })}
          </div>
        </section>

        <section
          style={{
            padding: '1.25rem',
            border: '1px solid #dce8dc',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.94)',
            boxShadow: '0 8px 18px rgba(47, 76, 113, 0.12)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'start', flexWrap: 'wrap' }}>
            <div>
              <span style={{ color: '#637083', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
                Current draft
              </span>
              <h2 style={{ fontSize: '1.6rem', marginTop: '0.2rem' }}>{activeGoal.label}</h2>
            </div>
            {selectedIds.length > 0 && (
              <button
                onClick={() => setSelectedIds([])}
                style={{
                  minHeight: '40px',
                  padding: '0.55rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #dce8dc',
                  background: 'white',
                  color: '#637083',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Reset Auto Draft
              </button>
            )}
          </div>

          <p style={{ marginTop: '1rem', color: '#3d475c' }}>{activeGoal.note}</p>

          <div style={{ marginTop: '1.25rem', display: 'grid', gap: '0.75rem' }}>
            {roleSlots.map((slot) => {
              const manualPokemon = selectedPokemon.find((pokemon) => slot.roles.includes(pokemon.specialty))
              const autoPokemon = autoTeam.find((item) => item.slot.key === slot.key)?.pokemon
              const pokemon = manualPokemon || autoPokemon

              return (
                <div key={slot.key} style={{ padding: '0.9rem', borderRadius: '10px', border: '1px solid #dce8dc', background: '#fffdf7' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                      <strong>{slot.key}</strong>
                      <p style={{ marginTop: '0.2rem', color: '#637083', fontSize: '0.82rem' }}>{slot.note}</p>
                    </div>
                    {pokemon && (
                      <Link href={`/wiki/pokemon/${pokemon.id}`} style={{ fontWeight: 800 }}>
                        {pokemon.name}
                      </Link>
                    )}
                  </div>
                  {pokemon && (
                    <p style={{ marginTop: '0.45rem', color: '#3d475c', fontSize: '0.88rem' }}>
                      {pokemon.type} · {pokemon.specialty} · {pokemon.rarity}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ marginTop: '1.5rem', borderTop: '1px solid #dce8dc', paddingTop: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Planning Links</h3>

            {relatedRecipe && (
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ display: 'block', fontSize: '0.8rem', color: '#637083', marginBottom: '0.45rem' }}>Recommended Recipe</strong>
                <Link
                  href={`/wiki/recipe/${relatedRecipe.id}`}
                  style={{
                    display: 'inline-block',
                    padding: '0.45rem 0.65rem',
                    border: '1px solid #dce8dc',
                    borderRadius: '999px',
                    background: '#fff1f4',
                    fontSize: '0.82rem',
                  }}
                >
                  {relatedRecipe.name} · {relatedRecipe.best_use}
                </Link>
              </div>
            )}

            {relatedHabitats.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ display: 'block', fontSize: '0.8rem', color: '#637083', marginBottom: '0.45rem' }}>Route Habitats</strong>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {relatedHabitats.map((habitat) => (
                    <Link
                      key={habitat.id}
                      href={`/wiki/habitat/${habitat.id}`}
                      style={{
                        padding: '0.4rem 0.6rem',
                        border: '1px solid #dce8dc',
                        borderRadius: '999px',
                        background: '#f2fbf4',
                        fontSize: '0.82rem',
                      }}
                    >
                      {habitat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {selectedPokemon.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ display: 'block', fontSize: '0.8rem', color: '#637083', marginBottom: '0.45rem' }}>Team Members</strong>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {selectedPokemon.map((pokemon) => (
                    <Link
                      key={pokemon.id}
                      href={`/wiki/pokemon/${pokemon.id}`}
                      style={{
                        padding: '0.4rem 0.6rem',
                        border: '1px solid #dce8dc',
                        borderRadius: '999px',
                        background: '#f5fcff',
                        fontSize: '0.82rem',
                      }}
                    >
                      {pokemon.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {relatedGuides.length > 0 && (
              <div>
                <strong style={{ display: 'block', fontSize: '0.8rem', color: '#637083', marginBottom: '0.45rem' }}>Related Guides</strong>
                <div style={{ display: 'grid', gap: '0.45rem' }}>
                  {relatedGuides.map((guide) => (
                    <Link key={guide.id} href={`/guides/${guide.slug}`} style={{ fontSize: '0.88rem' }}>
                      {guide.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <section
        style={{
          marginTop: '2rem',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 209, 102, 0.65)',
          background: 'rgba(255, 253, 247, 0.94)',
        }}
      >
        <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>How to use the draft</h2>
        <p style={{ color: '#637083', fontSize: '0.9rem', maxWidth: '850px' }}>
          Start from the automatic four-role draft, then swap Pokemon from the pool if your target habitat needs a different type or rarity. Open the linked pages before spending rare recipes so the team matches weather, food, drops, and route risk.
        </p>
      </section>
    </main>
  )
}
