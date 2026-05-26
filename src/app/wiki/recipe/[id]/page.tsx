import { Metadata } from 'next'
import recipesData from '@/data/recipes.json'
import guidesData from '@/data/guides.json'
import pokemonData from '@/data/pokemon.json'
import habitatsData from '@/data/habitats.json'
import { canonicalUrl } from '@/lib/site'
import { recipeMetaDescription, recipeMetaTitle } from '@/lib/seoText'
import { CreditedImage } from '@/components/media/CreditedImage'
import { BreadcrumbJsonLd, FAQJsonLd, WikiPageJsonLd } from '@/components/seo/JsonLd'
import { DataStatus } from '@/components/content/DataStatus'
import { OfficialContext } from '@/components/content/OfficialContext'

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
  const title = recipe ? recipeMetaTitle(recipe) : 'Recipe Not Found'
  const description = recipe ? recipeMetaDescription(recipe) : undefined
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: recipe?.image_source ? [recipe.image_url] : ['/og-image.svg'],
    },
    alternates: recipe ? {
      canonical: canonicalUrl(`/wiki/recipe/${recipe.id}`),
    } : undefined,
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
  ).slice(0, 5)
  const relatedPokemonIds = (recipe.related_pokemon || '').split(',').map((item) => item.trim()).filter(Boolean)
  const relatedHabitatIds = (recipe.related_habitats || '').split(',').map((item) => item.trim()).filter(Boolean)
  const relatedPokemon = pokemonData.filter((p) => relatedPokemonIds.includes(p.id)).slice(0, 6)
  const relatedHabitats = habitatsData.filter((h) => relatedHabitatIds.includes(h.id)).slice(0, 5)
  const updatedAt = recipe.updated_at ? new Date(recipe.updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : null
  const modifiedAt = recipe.updated_at ? new Date(recipe.updated_at).toISOString() : undefined

  return (
    <main>
      <WikiPageJsonLd
        name={recipe.name}
        description={recipe.overview || `${recipe.name} - ${recipe.buff}`}
        url={`/wiki/recipe/${recipe.id}`}
        pageType="Recipe"
        image={recipe.image_source ? recipe.image_url : undefined}
        dateModified={modifiedAt}
        properties={[
          { name: 'Ingredients', value: Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : recipe.ingredients },
          { name: 'Buff', value: recipe.buff },
          { name: 'Effect Duration', value: recipe.effect_duration },
          { name: 'Rarity', value: recipe.rarity },
          { name: 'Best Use', value: recipe.best_use },
        ]}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Recipes', url: '/wiki/recipe' },
          { name: recipe.name, url: `/wiki/recipe/${recipe.id}` },
        ]}
      />
      {recipe.faqs && recipe.faqs.length > 0 && <FAQJsonLd faqs={recipe.faqs} title={recipe.name} />}
      <article className="recipe-detail-page">
        <div className="recipe-detail-hero">
          <div className="recipe-hero-copy">
            <span className="panel-kicker">Recipe Guide</span>
            <h1>{recipe.name}</h1>
            <p>{recipe.overview}</p>
            <div className="pokemon-tag-row">
              <span className={`rarity ${recipe.rarity}`}>{recipe.rarity}</span>
              <span className="type-chip">{recipe.buff}</span>
              <span className="type-chip">{recipe.effect_duration}</span>
            </div>
            {updatedAt && <p className="updated-note">Updated {updatedAt}</p>}
            <DataStatus status={recipe.data_status} note={recipe.data_status_note} updatedAt={updatedAt} />
            <OfficialContext
              title="Official Food and Move Context"
              description="Recipe recommendations are editorial. Nintendo's official tips explain how food can power up Ditto's moves and support exploration."
              links={[
                { href: '/official/official-beginner-tips', label: 'Official tips' },
                { href: '/official/gameplay-overview', label: 'Gameplay overview' },
              ]}
            />
          </div>
          <CreditedImage src={recipe.image_url} alt={recipe.image_alt || recipe.name} source={recipe.image_source} sourceUrl={recipe.image_source_url} licenseNote={recipe.image_license_note} originalMedia={recipe.image_original_media} className="recipe-hero-cover" sizes="(max-width: 768px) 100vw, 420px" priority />
        </div>

        <div className="recipe-quick-facts" aria-label={`${recipe.name} quick facts`}>
          <div>
            <span>Ingredients</span>
            <strong>{recipe.ingredients}</strong>
          </div>
          <div>
            <span>Buff</span>
            <strong>{recipe.buff}</strong>
          </div>
          <div>
            <span>Duration</span>
            <strong>{recipe.effect_duration}</strong>
          </div>
          <div>
            <span>Best Use</span>
            <strong>{recipe.best_use}</strong>
          </div>
        </div>

        {(relatedPokemon.length > 0 || relatedHabitats.length > 0) && (
          <section className="recipe-use-panel">
            <div className="section-title-row">
              <div>
                <span className="panel-kicker">Best Pairings</span>
                <h2>Where {recipe.name} Fits</h2>
              </div>
              <a href="/tools/recipe-calculator">Compare recipes</a>
            </div>
            <div className="recipe-use-grid">
              {relatedPokemon.map((p) => (
                <a key={p.id} href={`/wiki/pokemon/${p.id}`}>
                  <span>Pokemon</span>
                  <strong>{p.name}</strong>
                  <small>{p.type} · {p.favorite_food}</small>
                </a>
              ))}
              {relatedHabitats.map((h) => (
                <a key={h.id} href={`/wiki/habitat/${h.id}`}>
                  <span>Habitat</span>
                  <strong>{h.name}</strong>
                  <small>{h.weather} · {h.difficulty}</small>
                </a>
              ))}
            </div>
          </section>
        )}

        {recipe.ingredient_route && (
          <section className="recipe-guide-section">
            <h2>Ingredient Route</h2>
            <ol>
              {recipe.ingredient_route.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        )}

        {recipe.best_timing && (
          <section className="recipe-guide-section">
            <h2>Best Timing</h2>
            <ul>
              {recipe.best_timing.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {recipe.recommended_for && (
          <section className="recipe-guide-section">
            <h2>Recommended For</h2>
            <ul>
              {recipe.recommended_for.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {recipe.alternatives && (
          <section className="recipe-guide-section">
            <h2>Alternatives</h2>
            <ul>
              {recipe.alternatives.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {recipe.common_mistakes && (
          <section className="recipe-guide-section">
            <h2>Common Mistakes</h2>
            <ul>
              {recipe.common_mistakes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {recipe.faqs && (
          <section className="recipe-guide-section pokemon-faq-list">
            <h2>{recipe.name} FAQ</h2>
            {recipe.faqs.map((faq) => (
              <div key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </section>
        )}
      </article>

      <aside className="related-content-panel">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Use This Recipe With</span>
            <h2>Related Pokemon, Habitats, and Guides</h2>
          </div>
          <a href="/tools/recipe-calculator">Compare recipes</a>
        </div>
        <div className="related-content-grid">
          {relatedPokemon.map((p) => (
            <a key={p.id} href={`/wiki/pokemon/${p.id}`} className="related-content-card">
              <span>Pokemon</span>
              <strong>{p.name}</strong>
              <p>{p.type} · {p.specialty}</p>
              <small>Food: {p.favorite_food}</small>
            </a>
          ))}
          {relatedHabitats.map((h) => (
            <a key={h.id} href={`/wiki/habitat/${h.id}`} className="related-content-card">
              <span>Habitat</span>
              <strong>{h.name}</strong>
              <p>{h.weather} · {h.resource_bonus}</p>
              <small>{h.difficulty} route</small>
            </a>
          ))}
          {relatedGuides.map((g) => (
            <a key={g.id} href={`/guides/${g.slug}`} className="related-content-card">
              <span>Guide</span>
              <strong>{g.title}</strong>
              <p>{g.answer}</p>
              <small>{g.steps.length} route checks</small>
            </a>
          ))}
        </div>
      </aside>
    </main>
  )
}
