'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import pokemonData from '@/data/team-pokemon-links.json'
import habitatLinksData from '@/data/habitat-links.json'
import recipeLinksData from '@/data/recipe-links.json'
import guideLinksData from '@/data/guide-links.json'
import { DataStatus } from '@/components/content/DataStatus'
import { BreadcrumbJsonLd, FAQJsonLd, ToolJsonLd } from '@/components/seo/JsonLd'

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

const teamBuilderFaqs = [
  {
    question: 'How does the Pokopia Team Builder choose Pokemon?',
    answer: 'It scores Pokemon by the selected team goal, preferred roles, preferred types, rarity fit, and route support, then fills lead, damage, support, and survival slots.',
  },
  {
    question: 'Should I keep the automatic team draft?',
    answer: 'Use the automatic draft as a balanced starting point. Swap Pokemon manually when a target habitat needs a different type, role, food route, or rarity level.',
  },
  {
    question: 'Why do related habitats matter for a team?',
    answer: 'Related habitats show where the selected Pokemon are usually connected, so you can check route difficulty, weather, and recipe cost before farming the team.',
  },
]

const sourceReviewNotes = [
  'Uses Pokopia Portal Pokemon, habitat, recipe, and guide link datasets as team-planning inputs.',
  'Scores Pokemon by selected goal, preferred roles, preferred types, rarity fit, and route support.',
  'Connects team drafts back to related habitats, recipes, and source-backed guides before the player commits resources.',
]

const toolLimits = [
  'Do not treat automatic drafts as official rankings, competitive results, or final team requirements.',
  'Manual picks should be checked against habitat difficulty, weather, food, recipe timing, and route risk.',
  'Team recommendations should be reviewed after official updates, source-backed guide changes, or database corrections.',
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

function getTeamPlanNotes(
  team: typeof pokemonData,
  goal: (typeof goals)[number],
  habitatCount: number,
  hasManualSelection: boolean
) {
  const rolesCovered = uniqueIds(team.map((pokemon) => pokemon.specialty))
  const typesCovered = uniqueIds(team.flatMap((pokemon) => pokemon.type.split('/')))
  const lead = team[0]

  return [
    {
      label: 'Why this draft',
      text: team.length > 0
        ? `This ${goal.label.toLowerCase()} draft covers ${rolesCovered.slice(0, 4).join(', ')} roles and keeps the plan tied to ${goal.note.toLowerCase()}`
        : `Choose Pokemon from the pool to build around ${goal.label.toLowerCase()}.`,
    },
    {
      label: 'Coverage check',
      text: typesCovered.length > 0
        ? `Type coverage currently includes ${typesCovered.slice(0, 5).join(', ')}. Add a missing role before adding a duplicate attacker.`
        : 'Add at least one lead, one damage option, and one support or survival slot.',
    },
    {
      label: 'Route fit',
      text: habitatCount > 1
        ? `The draft spans ${habitatCount} habitats, so confirm food and recipe costs before farming every member.`
        : lead
          ? `${lead.name} anchors the current route fit; check the linked habitat before spending rare recipes.`
          : 'Pick a lead Pokemon first, then check the linked habitat.',
    },
    {
      label: 'Edit status',
      text: hasManualSelection
        ? 'Manual picks are active. Use Reset Auto Draft if you want the four-role recommendation again.'
        : 'Auto draft is active. Swap from the pool only when the target habitat needs a different role or type.',
    },
  ]
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
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Team Builder', url: '/tools/team-builder' },
        ]}
      />
      <FAQJsonLd title="Team Builder FAQ" faqs={teamBuilderFaqs} />
      <ToolJsonLd
        name="Pokopia Team Builder"
        description="Interactive Pokopia team planning tool for drafting roles, comparing Pokemon by goal, and connecting team choices to recipes, habitats, and guides."
        url="/tools/team-builder"
        featureList={[
          'Draft a four-role team',
          'Compare Pokemon by route goal and role',
          'Review type and habitat coverage',
          'Open related recipe, habitat, Pokemon, and guide pages',
        ]}
      />
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
        status="Tool using unverified editorial team data"
        note="Team drafts use Pokopia Portal planning records, not official or confirmed game data. Results do not verify Pokémon names, roles, types, rankings, matchups, habitats, recipes, or competitive performance."
        updatedAt="July 21, 2026"
        showPolicyLink
      />

      <section
        style={{
          marginTop: '1.5rem',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid #dce8dc',
          background: 'rgba(255, 255, 255, 0.94)',
        }}
      >
        <span style={{ color: '#637083', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
          Source Review
        </span>
        <h2 style={{ fontSize: '1rem', marginTop: '0.35rem', marginBottom: '0.85rem' }}>How Team Drafts Are Bounded</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.92rem', marginBottom: '0.5rem' }}>Data basis</h3>
            <ul style={{ paddingLeft: '1.1rem', color: '#3d475c', fontSize: '0.9rem' }}>
              {sourceReviewNotes.map((note) => <li key={note}>{note}</li>)}
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: '0.92rem', marginBottom: '0.5rem' }}>Use limits</h3>
            <ul style={{ paddingLeft: '1.1rem', color: '#3d475c', fontSize: '0.9rem' }}>
              {toolLimits.map((limit) => <li key={limit}>{limit}</li>)}
            </ul>
          </div>
        </div>
      </section>

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

          <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            {getTeamPlanNotes(selectedPokemon, activeGoal, relatedHabitats.length, selectedIds.length > 0).map((note) => (
              <div key={note.label} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #dce8dc', background: '#f6fbff' }}>
                <span style={{ display: 'block', color: '#2f84d8', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  {note.label}
                </span>
                <p style={{ marginTop: '0.35rem', color: '#3d475c', fontSize: '0.88rem', lineHeight: 1.5 }}>{note.text}</p>
              </div>
            ))}
          </div>

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
          border: '1px solid #dce8dc',
          background: 'rgba(255, 255, 255, 0.94)',
        }}
      >
        <h2 style={{ fontSize: '1rem', marginBottom: '0.85rem' }}>Team Builder FAQ</h2>
        <div style={{ display: 'grid', gap: '0.85rem' }}>
          {teamBuilderFaqs.map((faq) => (
            <div key={faq.question}>
              <strong style={{ display: 'block', fontSize: '0.9rem' }}>{faq.question}</strong>
              <p style={{ marginTop: '0.3rem', color: '#637083', fontSize: '0.9rem', lineHeight: 1.55 }}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '1rem' }}>
          <Link href="/official/gameplay-overview" style={{ fontSize: '0.85rem', fontWeight: 800 }}>Check gameplay context</Link>
          <Link href="/tools/habitat-planner" style={{ fontSize: '0.85rem', fontWeight: 800 }}>Plan route first</Link>
          <Link href="/tools/recipe-calculator" style={{ fontSize: '0.85rem', fontWeight: 800 }}>Choose recipe support</Link>
        </div>
      </section>
    </main>
  )
}
