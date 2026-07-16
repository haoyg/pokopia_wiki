import { Metadata } from 'next'
import recipesData from '@/data/recipes.json'
import { canonicalUrl } from '@/lib/site'
import { CreditedImage } from '@/components/media/CreditedImage'
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'

const rarityLabels: Record<string, string> = {
  'common': 'Common', 'uncommon': 'Uncommon', 'rare': 'Rare', 'legendary': 'Legendary',
}

const recipeDecisionGroups = [
  {
    title: 'Scout without wasting rares',
    text: 'Start with cheap recipes when you are testing a route, spawn window, or new habitat layout.',
    ids: ['rec009', 'rec003', 'rec006'],
  },
  {
    title: 'Repeat rare farming',
    text: 'Use these once the route is repeatable and the target is worth stronger attraction or luck support.',
    ids: ['rec001', 'rec005', 'rec010'],
  },
  {
    title: 'Survive hard checks',
    text: 'Pick defensive or recovery recipes when the route fails from damage instead of route timing.',
    ids: ['rec004', 'rec012', 'rec015'],
  },
]

function shortText(text: string, length = 150) {
  if (text.length <= length) return text
  return `${text.slice(0, length).trim()}...`
}

function textValue(value: string | string[]) {
  return Array.isArray(value) ? value.join(' ') : value
}

export const metadata: Metadata = {
  title: 'Recipe Cookbook and Buff Notes',
  description: 'Browse Pokopia recipes with ingredients, buff effects, durations, rarity, timing notes, and related route planning links.',
  keywords: [
    'Pokopia recipes',
    'Pokopia recipe list',
    'Pokopia best recipe',
    'Pokopia recipe buff',
    'Pokopia recipe rarity',
    'Pokopia cooking recipe',
    'Pokopia ingredient recipe',
  ],
  openGraph: {
    title: 'Recipe Cookbook and Buff Notes',
    description: 'Browse Pokopia recipes with ingredients, buff effects, durations, and route notes.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recipe Cookbook and Buff Notes',
    description: 'Browse Pokopia recipes with ingredients, buff effects, durations, and route notes.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/wiki/recipe'),
  },
}

export default function RecipePage() {
  const rarityCounts = recipesData.reduce<Record<string, number>>((counts, recipe) => {
    counts[recipe.rarity] = (counts[recipe.rarity] || 0) + 1
    return counts
  }, {})
  const farmingRecipes = recipesData
    .filter((recipe) => recipe.best_use.toLowerCase().includes('farming') || recipe.buff.toLowerCase().includes('attraction'))
    .slice(0, 4)
  const survivalRecipes = recipesData
    .filter((recipe) => ['defense', 'restore', 'heal', 'armor'].some((word) => `${recipe.buff} ${recipe.best_use}`.toLowerCase().includes(word)))
    .slice(0, 4)
  const findRecipe = (id: string) => recipesData.find((recipe) => recipe.id === id)

  return (
    <main className="page-shell">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Recipes', url: '/wiki/recipe' },
        ]}
      />
      <ItemListJsonLd
        name="Recipe Cookbook and Buff Notes"
        description="Compare Pokopia recipes by ingredients, buff effect, duration, rarity, timing, and route fit."
        url="/wiki/recipe"
        items={recipesData.map((recipe) => ({
          name: recipe.name,
          url: `/wiki/recipe/${recipe.id}`,
        }))}
      />
      <section className="page-hero">
        <h1>Recipe Cookbook and Buff Notes</h1>
        <p>Compare Pokopia recipes by ingredients, buff effect, duration, rarity, timing, and route fit.</p>
      </section>

      <section className="index-guide-panel">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Cooking Routes</span>
            <h2>Choose Recipes by Route Objective</h2>
          </div>
          <a href="/tools/recipe-calculator">Open Recipe Calculator</a>
        </div>
        <div className="index-guide-grid">
          <div className="index-guide-card">
            <strong>Farming support</strong>
            <p>Use these recipes when the route is already mapped and the goal is repeated rare or material checks.</p>
            <div>
              {farmingRecipes.map((recipe) => (
                <a key={recipe.id} href={`/wiki/recipe/${recipe.id}`}>{recipe.name}</a>
              ))}
            </div>
          </div>
          <div className="index-guide-card">
            <strong>Survival support</strong>
            <p>Use defensive or recovery recipes when failed runs come from damage, long routes, or unstable final rooms.</p>
            <div>
              {survivalRecipes.map((recipe) => (
                <a key={recipe.id} href={`/wiki/recipe/${recipe.id}`}>{recipe.name}</a>
              ))}
            </div>
          </div>
          <div className="index-guide-card">
            <strong>Rarity spread</strong>
            <p>Start with common or uncommon recipes while scouting. Save rare recipes for repeatable routes with a clear target.</p>
            <div>
              {Object.entries(rarityCounts).map(([rarity, count]) => (
                <span key={rarity}>{rarity}: {count}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="index-guide-panel">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Recipe Decisions</span>
            <h2>Pick the Buff Before You Start the Run</h2>
          </div>
          <a href="/guides/recipe-planning-route">Open recipe route</a>
        </div>
        <div className="index-guide-grid">
          {recipeDecisionGroups.map((group) => (
            <div key={group.title} className="index-guide-card">
              <strong>{group.title}</strong>
              <p>{group.text}</p>
              <div>
                {group.ids.map((id) => {
                  const recipe = findRecipe(id)
                  if (!recipe) return null
                  return (
                    <a key={id} href={`/wiki/recipe/${recipe.id}`}>
                      {recipe.name} · {recipe.rarity}
                    </a>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="pokemon-grid">
        {recipesData.map((r) => (
          <a key={r.id} href={`/wiki/recipe/${r.id}`} className="card">
            <CreditedImage src={r.image_url} alt={r.image_alt || r.name} source={r.image_source} sourceUrl={r.image_source_url} licenseNote={r.image_license_note} originalMedia={r.image_original_media} />
            <h3 className="index-card-title index-card-title-center">{r.name}</h3>
            <p className="index-card-meta">{r.buff}</p>
            <p className="index-card-submeta">{r.effect_duration} · {r.best_use}</p>
            <p className="index-card-summary">{shortText(r.overview, 135)}</p>
            <dl className="index-card-facts">
              <div>
                <dt>Ingredients</dt>
                <dd>{r.ingredients}</dd>
              </div>
              <div>
                <dt>Timing</dt>
                <dd>{shortText(textValue(r.best_timing), 74)}</dd>
              </div>
            </dl>
            <div className="index-card-badges index-card-badges-center">
              <span className={`rarity ${r.rarity}`}>{rarityLabels[r.rarity]}</span>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
