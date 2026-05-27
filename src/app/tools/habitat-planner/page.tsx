'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import habitatsData from '@/data/habitats.json'
import pokemonLinksData from '@/data/pokemon-links.json'
import recipeLinksData from '@/data/recipe-links.json'
import guideLinksData from '@/data/guide-links.json'
import { DataStatus } from '@/components/content/DataStatus'
import { ToolJsonLd } from '@/components/seo/JsonLd'

const difficultyOrder: Record<string, number> = { easy: 0, medium: 1, hard: 2 }

const goals = [
  {
    id: 'next-unlock',
    label: 'Next Unlock',
    note: 'Find the next habitat worth preparing for at your current level.',
    keywords: ['unlock', 'level', 'starting', 'reach'],
  },
  {
    id: 'rare-farming',
    label: 'Rare Farming',
    note: 'Prioritize routes with rare or legendary spawn value.',
    keywords: ['rare', 'legendary', 'hunting', 'spawn', 'charm'],
  },
  {
    id: 'resource',
    label: 'Resource Route',
    note: 'Choose habitats by drop bonus and repeatable material loops.',
    keywords: ['drops', 'resource', 'farming', 'materials', 'bonus'],
  },
  {
    id: 'safe-daily',
    label: 'Safe Daily',
    note: 'Favor easier routes for stable gathering and low recipe cost.',
    keywords: ['easy', 'starter', 'daily', 'stable', 'training'],
  },
  {
    id: 'hard-push',
    label: 'Hard Push',
    note: 'Prepare for difficult habitats, boss pressure, and survival checks.',
    keywords: ['hard', 'boss', 'tank', 'defense', 'dangerous', 'survival'],
  },
]

const weatherOptions = [
  ['all', 'All Weather'],
  ['clear', 'Clear/Sunny'],
  ['cloudy', 'Cloudy'],
  ['rain', 'Rain'],
  ['snow', 'Snow'],
  ['windy', 'Windy'],
  ['stormy', 'Stormy'],
  ['foggy', 'Foggy'],
  ['dark', 'Dark'],
]

function getUnlockLevel(condition: string) {
  const match = condition.match(/Reach Level (\d+)/)
  return match ? Number.parseInt(match[1], 10) : 1
}

function splitIds(value?: string) {
  return (value || '').split(',').map((item) => item.trim()).filter(Boolean)
}

function scoreHabitat(habitat: (typeof habitatsData)[number], goal: (typeof goals)[number], playerLevel: number) {
  const unlockLevel = getUnlockLevel(habitat.unlock_condition)
  const haystack = [
    habitat.name,
    habitat.unlock_condition,
    habitat.difficulty,
    habitat.resource_bonus,
    habitat.recommended_build,
    habitat.weather,
    habitat.overview,
    ...(habitat.farming_route || []),
    ...(habitat.rare_spawns || []),
    ...(habitat.resource_notes || []),
  ].join(' ').toLowerCase()

  let score = goal.keywords.reduce((total, keyword) => (
    haystack.includes(keyword.toLowerCase()) ? total + 1 : total
  ), 0)

  if (goal.id === 'next-unlock') {
    if (unlockLevel >= playerLevel) score += Math.max(0, 8 - Math.abs(unlockLevel - playerLevel))
    if (unlockLevel <= playerLevel) score += 2
  }

  if (goal.id === 'safe-daily' && habitat.difficulty === 'easy') score += 4
  if (goal.id === 'hard-push' && habitat.difficulty === 'hard') score += 4
  if (goal.id === 'resource' && habitat.resource_bonus.includes('%')) score += 3
  if (goal.id === 'rare-farming' && (habitat.rare_spawns || []).some((spawn) => !spawn.startsWith('No dedicated'))) score += 4

  if (unlockLevel > playerLevel) score -= Math.min(4, unlockLevel - playerLevel)

  return score
}

function getPokemonName(id: string) {
  return pokemonLinksData.find((pokemon) => pokemon.id === id)?.name || id
}

function getHabitatPlanNotes(
  habitat: (typeof habitatsData)[number],
  goal: (typeof goals)[number],
  score: number,
  playerLevel: number
) {
  const unlockLevel = getUnlockLevel(habitat.unlock_condition)
  const isUnlocked = unlockLevel <= playerLevel
  const routeStep = habitat.farming_route?.[0] || 'Scout the first route branch before spending a recipe.'
  const mistake = habitat.common_mistakes?.[0] || 'Avoid repeating the route before choosing a clear farming target.'

  return [
    {
      label: 'Why this route',
      text: score > 0
        ? `${habitat.name} fits the ${goal.label.toLowerCase()} goal because its weather, difficulty, spawns, or bonus line up with the current filters.`
        : `${habitat.name} is a general route pick under the current filters; open the habitat page before committing a long session.`,
    },
    {
      label: 'Access check',
      text: isUnlocked
        ? `Available now at player level ${playerLevel}. Use the route only if ${habitat.resource_bonus.toLowerCase()} supports the next upgrade.`
        : `Locked until level ${unlockLevel}. Prepare the team and recipe first, then return when the route is available.`,
    },
    {
      label: 'Run plan',
      text: routeStep,
    },
    {
      label: 'Main risk',
      text: mistake,
    },
  ]
}

export default function HabitatPlanner() {
  const [playerLevel, setPlayerLevel] = useState(1)
  const [selectedGoal, setSelectedGoal] = useState('next-unlock')
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const [filterWeather, setFilterWeather] = useState('all')
  const [selectedHabitatId, setSelectedHabitatId] = useState('')

  const activeGoal = goals.find((goal) => goal.id === selectedGoal) || goals[0]

  const rankedHabitats = useMemo(() => {
    return habitatsData
      .map((habitat) => ({
        habitat,
        score: scoreHabitat(habitat, activeGoal, playerLevel),
      }))
      .filter(({ habitat }) => {
        if (filterDifficulty !== 'all' && habitat.difficulty !== filterDifficulty) return false
        if (filterWeather !== 'all' && !habitat.weather.toLowerCase().includes(filterWeather)) return false
        return true
      })
      .sort((a, b) => {
        const unlockA = getUnlockLevel(a.habitat.unlock_condition)
        const unlockB = getUnlockLevel(b.habitat.unlock_condition)
        const aUnlocked = unlockA <= playerLevel
        const bUnlocked = unlockB <= playerLevel

        if (aUnlocked !== bUnlocked) return aUnlocked ? -1 : 1
        if (b.score !== a.score) return b.score - a.score
        if (difficultyOrder[a.habitat.difficulty] !== difficultyOrder[b.habitat.difficulty]) {
          return difficultyOrder[a.habitat.difficulty] - difficultyOrder[b.habitat.difficulty]
        }
        return unlockA - unlockB
      })
  }, [activeGoal, filterDifficulty, filterWeather, playerLevel])

  const unlockedCount = rankedHabitats.filter(({ habitat }) => getUnlockLevel(habitat.unlock_condition) <= playerLevel).length
  const lockedCount = rankedHabitats.length - unlockedCount
  const recommendation = rankedHabitats.find(({ score }) => score > 0) || rankedHabitats[0]
  const selectedHabitat = habitatsData.find((habitat) => habitat.id === selectedHabitatId) || recommendation?.habitat
  const selectedScore = rankedHabitats.find(({ habitat }) => habitat.id === selectedHabitat?.id)?.score || 0

  const spawnIds = splitIds(selectedHabitat?.spawn_list)
  const relatedRecipe = recipeLinksData.find((recipe) => recipe.id === selectedHabitat?.recommended_recipe)
  const relatedGuides = guideLinksData
    .filter((guide) => splitIds(guide.related_habitats).includes(selectedHabitat?.id || ''))
    .slice(0, 4)

  return (
    <main style={{ maxWidth: '1120px', margin: '0 auto', padding: '2rem 1rem 3rem' }}>
      <ToolJsonLd
        name="Pokopia Habitat Planner"
        description="Interactive Pokopia habitat planning tool for choosing route goals, checking level access, filtering weather, and opening related recipes, Pokemon, and guides."
        url="/tools/habitat-planner"
        featureList={[
          'Compare habitats by route goal',
          'Check player level access',
          'Filter by difficulty and weather',
          'Open related recipe, Pokemon, and guide pages',
        ]}
      />
      <header style={{ marginBottom: '1.5rem' }}>
        <Link href="/tools" style={{ fontSize: '0.875rem', color: '#637083' }}>
          Back to Tools
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>
          Habitat Planner
        </h1>
        <p style={{ color: '#637083', marginTop: '0.5rem', maxWidth: '780px' }}>
          Pick a route goal, check level access, and jump into the habitat, recipe, Pokemon, and guide pages that support the run.
        </p>
      </header>

      <DataStatus
        status="Interactive habitat planning tool"
        note="Recommendations are based on Pokopia Portal habitat, recipe, Pokemon, and guide entries. Use this as route planning support and recheck pages after balance updates."
        updatedAt="2026-05-26"
      />

      <section style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Route Goal</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => {
                setSelectedGoal(goal.id)
                setSelectedHabitatId('')
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

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem',
          padding: '1rem',
          border: '1px solid #dce8dc',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#637083', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Player Level
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={playerLevel}
            onChange={(event) => {
              setPlayerLevel(Math.max(1, Math.min(50, Number.parseInt(event.target.value, 10) || 1)))
              setSelectedHabitatId('')
            }}
            style={{
              width: '100%',
              minHeight: '44px',
              padding: '0.6rem 0.75rem',
              border: '1px solid #dce8dc',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 800,
              textAlign: 'center',
              background: 'white',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#637083', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Difficulty
          </label>
          <select
            value={filterDifficulty}
            onChange={(event) => {
              setFilterDifficulty(event.target.value)
              setSelectedHabitatId('')
            }}
            aria-label="Filter habitats by difficulty"
            style={{
              width: '100%',
              minHeight: '44px',
              padding: '0.6rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #dce8dc',
              background: 'white',
            }}
          >
            {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty === 'all' ? 'All difficulty' : difficulty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#637083', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Weather
          </label>
          <select
            value={filterWeather}
            onChange={(event) => {
              setFilterWeather(event.target.value)
              setSelectedHabitatId('')
            }}
            aria-label="Filter habitats by weather"
            style={{
              width: '100%',
              minHeight: '44px',
              padding: '0.6rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #dce8dc',
              background: 'white',
            }}
          >
            {weatherOptions.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </section>

      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
        {[
          ['Available', unlockedCount, '#2e7d32', '#e8f5e9'],
          ['Locked', lockedCount, '#c62828', '#ffebee'],
          ['Player Level', playerLevel, '#1565c0', '#e3f2fd'],
        ].map(([label, value, color, background]) => (
          <div key={label} style={{ padding: '0.9rem 1rem', borderRadius: '10px', background: String(background) }}>
            <strong style={{ display: 'block', fontSize: '1.55rem', color: String(color) }}>{value}</strong>
            <span style={{ display: 'block', color: String(color), fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '1.25rem', alignItems: 'start' }}>
        <section>
          <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Recommended Habitats</h2>
          <div style={{ display: 'grid', gap: '0.65rem' }}>
            {rankedHabitats.map(({ habitat, score }) => {
              const unlockLevel = getUnlockLevel(habitat.unlock_condition)
              const isUnlocked = unlockLevel <= playerLevel
              const spawns = splitIds(habitat.spawn_list)

              return (
                <button
                  key={habitat.id}
                  onClick={() => setSelectedHabitatId(habitat.id)}
                  style={{
                    padding: '0.9rem',
                    borderRadius: '10px',
                    border: selectedHabitat?.id === habitat.id ? '2px solid #ff5c7a' : '1px solid #dce8dc',
                    background: selectedHabitat?.id === habitat.id ? '#fff1f4' : 'rgba(255, 255, 255, 0.92)',
                    opacity: isUnlocked ? 1 : 0.72,
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: '0 2px 0 rgba(47, 76, 113, 0.08)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center' }}>
                    <strong>{habitat.name}</strong>
                    <span className={`badge ${habitat.difficulty}`} style={{ flex: '0 0 auto' }}>{habitat.difficulty}</span>
                  </div>
                  <p style={{ marginTop: '0.35rem', color: '#637083', fontSize: '0.84rem' }}>
                    {isUnlocked ? 'Unlocked' : `Unlocks at Lv.${unlockLevel}`} · {habitat.weather} · {habitat.resource_bonus}
                  </p>
                  <small style={{ display: 'block', marginTop: '0.45rem', color: score > 0 ? '#2f84d8' : '#8b97a8' }}>
                    {score > 0 ? `Route match ${score}` : 'General route'} · {spawns.length} Pokemon
                  </small>
                </button>
              )
            })}
          </div>
        </section>

        {selectedHabitat && (
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
                  Current route · Match {selectedScore}
                </span>
                <h2 style={{ fontSize: '1.6rem', marginTop: '0.2rem' }}>{selectedHabitat.name}</h2>
              </div>
              <Link
                href={`/wiki/habitat/${selectedHabitat.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: '40px',
                  padding: '0.55rem 0.8rem',
                  borderRadius: '8px',
                  background: '#ff5c7a',
                  color: 'white',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Open Habitat
              </Link>
            </div>

            <p style={{ marginTop: '1rem', color: '#3d475c' }}>{selectedHabitat.overview}</p>

            <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {getHabitatPlanNotes(selectedHabitat, activeGoal, selectedScore, playerLevel).map((note) => (
                <div key={note.label} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #dce8dc', background: '#f6fbff' }}>
                  <span style={{ display: 'block', color: '#2f84d8', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    {note.label}
                  </span>
                  <p style={{ marginTop: '0.35rem', color: '#3d475c', fontSize: '0.88rem', lineHeight: 1.5 }}>{note.text}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
              {[
                ['Unlock', selectedHabitat.unlock_condition],
                ['Difficulty', selectedHabitat.difficulty],
                ['Weather', selectedHabitat.weather],
                ['Bonus', selectedHabitat.resource_bonus],
                ['Build', selectedHabitat.recommended_build],
              ].map(([label, value]) => (
                <div key={label} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #dce8dc', background: '#fffdf7' }}>
                  <span style={{ display: 'block', color: '#637083', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    {label}
                  </span>
                  <strong style={{ display: 'block', marginTop: '0.3rem', fontSize: '0.9rem' }}>{value}</strong>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', marginBottom: '0.55rem' }}>Route Steps</h3>
                <ul style={{ paddingLeft: '1.1rem', color: '#3d475c', fontSize: '0.9rem' }}>
                  {(selectedHabitat.farming_route || []).slice(0, 4).map((item) => (
                    <li key={item} style={{ marginBottom: '0.35rem' }}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', marginBottom: '0.55rem' }}>Avoid These</h3>
                <ul style={{ paddingLeft: '1.1rem', color: '#3d475c', fontSize: '0.9rem' }}>
                  {(selectedHabitat.common_mistakes || []).slice(0, 4).map((item) => (
                    <li key={item} style={{ marginBottom: '0.35rem' }}>{item}</li>
                  ))}
                </ul>
              </div>
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
                    {relatedRecipe.name} · {relatedRecipe.buff}
                  </Link>
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ display: 'block', fontSize: '0.8rem', color: '#637083', marginBottom: '0.45rem' }}>Pokemon Spawns</strong>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {spawnIds.slice(0, 8).map((id) => (
                    <Link
                      key={id}
                      href={`/wiki/pokemon/${id}`}
                      style={{
                        padding: '0.4rem 0.6rem',
                        border: '1px solid #dce8dc',
                        borderRadius: '999px',
                        background: '#f5fcff',
                        fontSize: '0.82rem',
                      }}
                    >
                      {getPokemonName(id)}
                    </Link>
                  ))}
                </div>
              </div>

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
        )}
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
        <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>How to use the planner</h2>
        <p style={{ color: '#637083', fontSize: '0.9rem', maxWidth: '850px' }}>
          Start with the goal, then narrow by level, difficulty, or weather. Open the habitat page before spending rare recipes, and use the linked Pokemon and guide pages to confirm food, drops, spawn timing, and route risks.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '1rem' }}>
          <Link href="/wiki/habitat" style={{ fontSize: '0.85rem', fontWeight: 800 }}>Browse all habitats</Link>
          <Link href="/tools/recipe-calculator" style={{ fontSize: '0.85rem', fontWeight: 800 }}>Compare recipes</Link>
          <Link href="/tools/team-builder" style={{ fontSize: '0.85rem', fontWeight: 800 }}>Build a team draft</Link>
        </div>
      </section>
    </main>
  )
}
