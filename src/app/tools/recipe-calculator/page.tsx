'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import recipesData from '@/data/tool-recipes.json'
import pokemonLinksData from '@/data/pokemon-links.json'
import habitatLinksData from '@/data/habitat-links.json'
import { DataStatus } from '@/components/content/DataStatus'
import { BreadcrumbJsonLd, FAQJsonLd, ToolJsonLd } from '@/components/seo/JsonLd'

const rarityOrder = ['common', 'uncommon', 'rare', 'legendary']

const goals = [
  {
    id: 'rare-farming',
    label: 'Rare Farming',
    note: 'Repeat short routes for rare Pokemon or high-value materials.',
    keywords: ['rare', 'farming', 'attraction', 'legendary', 'event', 'charm'],
  },
  {
    id: 'boss',
    label: 'Boss Prep',
    note: 'Prepare burst damage for bosses, elite rooms, and hard checks.',
    keywords: ['boss', 'damage', 'fire', 'electric', 'dragon', 'burst', 'fight'],
  },
  {
    id: 'survival',
    label: 'Survival',
    note: 'Stabilize hard habitats, long routes, or dangerous final rooms.',
    keywords: ['defense', 'shield', 'armor', 'restore', 'survival', 'tank', 'hard'],
  },
  {
    id: 'speed',
    label: 'Speed Route',
    note: 'Reduce travel time between known spawn checks and material nodes.',
    keywords: ['speed', 'movement', 'flying', 'route', 'sky', 'travel'],
  },
  {
    id: 'daily',
    label: 'Daily Farming',
    note: 'Use cheaper recipes for normal gathering and safe repeat loops.',
    keywords: ['daily', 'heal', 'grass', 'farming', 'starter', 'common'],
  },
]

const recipeCalculatorFaqs = [
  {
    question: 'What does the Pokopia Recipe Calculator compare?',
    answer: 'It compares recipes by route goal, rarity, buff text, best-use notes, timing advice, related Pokemon, and related habitats.',
  },
  {
    question: 'Should I always craft the top recipe recommendation?',
    answer: 'No. Use the top recommendation as a shortlist, then open the recipe and habitat pages to confirm ingredients, route timing, and common mistakes.',
  },
  {
    question: 'When should I filter recipes by rarity?',
    answer: 'Use the rarity filter when ingredients are limited or when you want a cheaper daily farming option instead of spending rare materials.',
  },
]

const sourceReviewNotes = [
  'Uses Pokopia Portal recipe, Pokemon, and habitat datasets as planning inputs.',
  'Scores recipes by goal keywords, rarity, buff text, timing notes, best-use text, and related route links.',
  'Links recipe results to supporting Pokemon and habitat pages so the recommendation can be checked before spending materials.',
]

const toolLimits = [
  'Do not treat recipe scores as official balance values, final buff math, or guaranteed best-in-slot results.',
  'Rare recipes should be checked against route timing and ingredient availability before crafting.',
  'Recipe recommendations should be reviewed after official updates, source-backed guide changes, or database corrections.',
]

function splitIds(value?: string) {
  return (value || '').split(',').map((item) => item.trim()).filter(Boolean)
}

function scoreRecipe(recipe: (typeof recipesData)[number], goal: (typeof goals)[number]) {
  const haystack = [
    recipe.name,
    recipe.best_use,
    recipe.buff,
    recipe.overview,
    ...(recipe.recommended_for || []),
    ...(recipe.best_timing || []),
  ].join(' ').toLowerCase()

  return goal.keywords.reduce((score, keyword) => {
    return haystack.includes(keyword.toLowerCase()) ? score + 1 : score
  }, 0)
}

function getRecipePlanNotes(recipe: (typeof recipesData)[number], goal: (typeof goals)[number], score: number) {
  const timing = recipe.best_timing?.[0] || 'Use it only after the target route is mapped.'
  const mistake = recipe.common_mistakes?.[0] || 'Avoid spending it during blind exploration.'

  return [
    {
      label: 'Why this fits',
      text: score > 0
        ? `${recipe.name} matches the ${goal.label.toLowerCase()} goal through ${recipe.buff.toLowerCase()} and its ${recipe.best_use.toLowerCase()} use case.`
        : `${recipe.name} is the best available option under the current filters, but it should be checked against the route before crafting.`,
    },
    {
      label: 'Use it when',
      text: timing,
    },
    {
      label: 'Main risk',
      text: mistake,
    },
  ]
}

export default function RecipeCalculator() {
  const [selectedGoal, setSelectedGoal] = useState('rare-farming')
  const [rarityFilter, setRarityFilter] = useState('all')
  const [selectedRecipe, setSelectedRecipe] = useState<string>('')

  const activeGoal = goals.find((goal) => goal.id === selectedGoal) || goals[0]

  const rankedRecipes = useMemo(() => {
    return recipesData
      .map((recipe) => ({
        recipe,
        score: scoreRecipe(recipe, activeGoal),
      }))
      .filter(({ recipe }) => rarityFilter === 'all' || recipe.rarity === rarityFilter)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return rarityOrder.indexOf(a.recipe.rarity) - rarityOrder.indexOf(b.recipe.rarity)
      })
  }, [activeGoal, rarityFilter])

  const recommendation = rankedRecipes.find((item) => item.score > 0) || rankedRecipes[0]
  const recipe = recipesData.find((item) => item.id === selectedRecipe) || recommendation?.recipe
  const selectedScore = rankedRecipes.find((item) => item.recipe.id === recipe?.id)?.score || 0

  const relatedPokemon = useMemo(() => {
    const ids = splitIds(recipe?.related_pokemon)
    return pokemonLinksData.filter((pokemon) => ids.includes(pokemon.id)).slice(0, 6)
  }, [recipe])

  const relatedHabitats = useMemo(() => {
    const ids = splitIds(recipe?.related_habitats)
    return habitatLinksData.filter((habitat) => ids.includes(habitat.id)).slice(0, 5)
  }, [recipe])

  return (
    <main style={{ maxWidth: '1120px', margin: '0 auto', padding: '2rem 1rem 3rem' }}>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Recipe Calculator', url: '/tools/recipe-calculator' },
        ]}
      />
      <FAQJsonLd title="Recipe Calculator FAQ" faqs={recipeCalculatorFaqs} />
      <ToolJsonLd
        name="Pokopia Recipe Calculator"
        description="Interactive Pokopia recipe planning tool for comparing recipe value by route goal, rarity, timing, Pokemon links, and habitat support."
        url="/tools/recipe-calculator"
        featureList={[
          'Compare recipes by route goal',
          'Filter recipes by rarity',
          'Review use timing and common mistakes',
          'Open related Pokemon and habitat pages',
        ]}
      />
      <header style={{ marginBottom: '1.5rem' }}>
        <Link href="/tools" style={{ fontSize: '0.875rem', color: '#637083' }}>
          Back to Tools
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>
          Recipe Calculator
        </h1>
        <p style={{ color: '#637083', marginTop: '0.5rem', maxWidth: '760px' }}>
          Choose a route goal, compare recipe value, then jump into the recipe, Pokemon, and habitat pages that support the plan.
        </p>
      </header>

      <DataStatus
        status="Tool using unverified editorial recipe data"
        note="Scores are generated from Pokopia Portal planning records, not official or confirmed game data. Results do not verify recipe names, ingredients, buffs, durations, Pokémon, or habitats."
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
        <h2 style={{ fontSize: '1rem', marginTop: '0.35rem', marginBottom: '0.85rem' }}>How Recipe Scores Are Bounded</h2>
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
        <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Route Goal</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => {
                setSelectedGoal(goal.id)
                setSelectedRecipe('')
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
            <h2 style={{ fontSize: '1rem' }}>Recommended Recipes</h2>
            <select
              value={rarityFilter}
              onChange={(event) => {
                setRarityFilter(event.target.value)
                setSelectedRecipe('')
              }}
              aria-label="Filter recipes by rarity"
              style={{
                minWidth: '132px',
                padding: '0.55rem 0.65rem',
                borderRadius: '8px',
                border: '1px solid #dce8dc',
                background: 'white',
                color: '#20243a',
              }}
            >
              {['all', 'common', 'uncommon', 'rare', 'legendary'].map((rarity) => (
                <option key={rarity} value={rarity}>
                  {rarity === 'all' ? 'All rarity' : rarity}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gap: '0.65rem' }}>
            {rankedRecipes.map(({ recipe: item, score }, index) => (
              <button
                key={item.id}
                onClick={() => setSelectedRecipe(item.id)}
                style={{
                  padding: '0.9rem',
                  borderRadius: '10px',
                  border: recipe?.id === item.id ? '2px solid #ff5c7a' : '1px solid #dce8dc',
                  background: recipe?.id === item.id ? '#fff1f4' : 'rgba(255, 255, 255, 0.92)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: '0 2px 0 rgba(47, 76, 113, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center' }}>
                  <strong>{item.name}</strong>
                  <span className={`rarity ${item.rarity}`} style={{ fontSize: '0.7rem', flex: '0 0 auto' }}>
                    {item.rarity}
                  </span>
                </div>
                <p style={{ marginTop: '0.35rem', color: '#637083', fontSize: '0.84rem' }}>
                  {item.best_use} · {item.buff} · {item.effect_duration}
                </p>
                <small style={{ display: 'block', marginTop: '0.45rem', color: score > 0 ? '#2f84d8' : '#8b97a8' }}>
                  {score > 0 ? `Goal match ${score}` : index === 0 ? 'Fallback recommendation' : 'General option'}
                </small>
              </button>
            ))}
          </div>
        </section>

        {recipe && (
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
                  Current plan
                </span>
                <h2 style={{ fontSize: '1.6rem', marginTop: '0.2rem' }}>{recipe.name}</h2>
              </div>
              <Link
                href={`/wiki/recipe/${recipe.id}`}
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
                Open Recipe
              </Link>
            </div>

            <p style={{ marginTop: '1rem', color: '#3d475c' }}>{recipe.overview}</p>

            <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {getRecipePlanNotes(recipe, activeGoal, selectedScore).map((note) => (
                <div key={note.label} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #dce8dc', background: '#f6fbff' }}>
                  <span style={{ display: 'block', color: '#2f84d8', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    {note.label}
                  </span>
                  <p style={{ marginTop: '0.35rem', color: '#3d475c', fontSize: '0.88rem', lineHeight: 1.5 }}>{note.text}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
              {[
                ['Ingredients', recipe.ingredients],
                ['Buff', recipe.buff],
                ['Duration', recipe.effect_duration],
                ['Best Use', recipe.best_use],
              ].map(([label, value]) => (
                <div key={label} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #dce8dc', background: '#fffdf7' }}>
                  <span style={{ display: 'block', color: '#637083', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    {label}
                  </span>
                  <strong style={{ display: 'block', marginTop: '0.3rem', fontSize: '0.92rem' }}>{value}</strong>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', marginBottom: '0.55rem' }}>Use Timing</h3>
                <ul style={{ paddingLeft: '1.1rem', color: '#3d475c', fontSize: '0.9rem' }}>
                  {(recipe.best_timing || []).slice(0, 3).map((item) => (
                    <li key={item} style={{ marginBottom: '0.35rem' }}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', marginBottom: '0.55rem' }}>Avoid Wasting It</h3>
                <ul style={{ paddingLeft: '1.1rem', color: '#3d475c', fontSize: '0.9rem' }}>
                  {(recipe.common_mistakes || []).slice(0, 3).map((item) => (
                    <li key={item} style={{ marginBottom: '0.35rem' }}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {(relatedPokemon.length > 0 || relatedHabitats.length > 0) && (
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid #dce8dc', paddingTop: '1.25rem' }}>
                <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Planning Links</h3>
                {relatedPokemon.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ display: 'block', fontSize: '0.8rem', color: '#637083', marginBottom: '0.45rem' }}>Pokemon</strong>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {relatedPokemon.map((pokemon) => (
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
                {relatedHabitats.length > 0 && (
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.8rem', color: '#637083', marginBottom: '0.45rem' }}>Habitats</strong>
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
              </div>
            )}
          </section>
        )}
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
        <h2 style={{ fontSize: '1rem', marginBottom: '0.85rem' }}>Recipe Calculator FAQ</h2>
        <div style={{ display: 'grid', gap: '0.85rem' }}>
          {recipeCalculatorFaqs.map((faq) => (
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
        <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>How to read the recommendation</h2>
        <p style={{ color: '#637083', fontSize: '0.9rem', maxWidth: '850px' }}>
          A high goal match means the recipe text, buff, best-use note, or route guidance lines up with the selected objective. Use the result as a short list, then open the linked Recipe, Pokemon, and Habitat pages before spending rare ingredients.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '1rem' }}>
          <Link href="/official/official-beginner-tips" style={{ fontSize: '0.85rem', fontWeight: 800 }}>Check official tips</Link>
          <Link href="/tools/habitat-planner" style={{ fontSize: '0.85rem', fontWeight: 800 }}>Plan a habitat route</Link>
          <Link href="/tools/team-builder" style={{ fontSize: '0.85rem', fontWeight: 800 }}>Match a team</Link>
        </div>
      </section>
    </main>
  )
}
