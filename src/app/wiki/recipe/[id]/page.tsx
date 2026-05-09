import { Metadata } from 'next'
import recipesData from '@/data/recipes.json'
import guidesData from '@/data/guides.json'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return recipesData.map((recipe) => ({
    id: recipe.id,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const recipe = recipesData.find((r) => r.id === id)
  return {
    title: recipe ? `${recipe.name} | Pokopia Portal` : 'Recipe Not Found',
    description: recipe ? `${recipe.name} - ${recipe.buff}` : undefined,
  }
}

export default async function RecipeDetailPage({ params }: Props) {
  const { id } = await params
  const recipe = recipesData.find((r) => r.id === id)

  if (!recipe) {
    return <p>Recipe not found</p>
  }

  const relatedGuides = guidesData.filter((g) =>
    (g.related_items || '').split(',').includes(id)
  ).slice(0, 3)

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/wiki/recipe">Recipes</a>
        </nav>
      </header>

      <h1>{recipe.name}</h1>
      <span className={`rarity ${recipe.rarity}`}>{recipe.rarity}</span>

      <div style={{ marginTop: '2rem' }}>
        <h4>Ingredients</h4>
        <p>{recipe.ingredients}</p>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h4>Buff</h4>
        <p>{recipe.buff}</p>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h4>Effect Duration</h4>
        <p>{recipe.effect_duration}</p>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h4>Best Use</h4>
        <p>{recipe.best_use}</p>
      </div>

      <aside style={{ marginTop: '3rem', borderTop: '1px solid #ddd', paddingTop: '2rem' }}>
        <h3>Related Guides</h3>
        {relatedGuides.length > 0 ? (
          <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
            {relatedGuides.map((g) => (
              <li key={g.id} style={{ marginBottom: '0.5rem' }}>
                <a href={`/guides/${g.slug}`}>{g.title}</a>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#666' }}>Check our <a href="/guides">guides</a> for recipe strategies.</p>
        )}
      </aside>
    </main>
  )
}
