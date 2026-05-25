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
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
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
      <h1>{recipe.name}</h1>
      <span className={`rarity ${recipe.rarity}`}>{recipe.rarity}</span>
      {updatedAt && <p style={{ color: '#777', fontSize: '0.875rem', marginTop: '0.5rem' }}>Updated {updatedAt}</p>}
      <DataStatus status={recipe.data_status} note={recipe.data_status_note} updatedAt={updatedAt} />
      <OfficialContext
        title="Official Food and Move Context"
        description="Recipe recommendations are editorial. Nintendo's official tips explain how food can power up Ditto's moves and support exploration."
        links={[
          { href: '/official/official-beginner-tips', label: 'Official tips' },
          { href: '/official/gameplay-overview', label: 'Gameplay overview' },
        ]}
      />
      <CreditedImage src={recipe.image_url} alt={recipe.image_alt || recipe.name} source={recipe.image_source} sourceUrl={recipe.image_source_url} licenseNote={recipe.image_license_note} originalMedia={recipe.image_original_media} className="article-cover" sizes="(max-width: 768px) 100vw, 800px" priority />

      <section style={{ padding: 0, marginTop: '2rem' }}>
        <h2>{recipe.name} Overview</h2>
        <p>{recipe.overview}</p>
      </section>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <h4>Ingredients</h4>
          <p>{recipe.ingredients}</p>
        </div>

        <div>
          <h4>Buff</h4>
          <p>{recipe.buff}</p>
        </div>

        <div>
          <h4>Effect Duration</h4>
          <p>{recipe.effect_duration}</p>
        </div>

        <div>
          <h4>Best Use</h4>
          <p>{recipe.best_use}</p>
        </div>
      </div>

      {recipe.ingredient_route && (
        <section style={{ padding: 0, marginTop: '2rem' }}>
          <h2>Ingredient Route</h2>
          <ol>
            {recipe.ingredient_route.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      {recipe.best_timing && (
        <section style={{ padding: 0, marginTop: '2rem' }}>
          <h2>Best Timing</h2>
          <ul>
            {recipe.best_timing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {recipe.recommended_for && (
        <section style={{ padding: 0, marginTop: '2rem' }}>
          <h2>Recommended For</h2>
          <ul>
            {recipe.recommended_for.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {recipe.alternatives && (
        <section style={{ padding: 0, marginTop: '2rem' }}>
          <h2>Alternatives</h2>
          <ul>
            {recipe.alternatives.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {recipe.common_mistakes && (
        <section style={{ padding: 0, marginTop: '2rem' }}>
          <h2>Common Mistakes</h2>
          <ul>
            {recipe.common_mistakes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {recipe.faqs && (
        <section style={{ padding: 0, marginTop: '2rem' }}>
          <h2>{recipe.name} FAQ</h2>
          {recipe.faqs.map((faq) => (
            <div key={faq.question} style={{ marginTop: '1rem' }}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </section>
      )}

      <aside style={{ marginTop: '3rem', borderTop: '1px solid #ddd', paddingTop: '2rem' }}>
        {relatedPokemon.length > 0 && (
          <>
            <h3>Recommended Pokemon</h3>
            <div className="pokemon-grid" style={{ marginTop: '1rem' }}>
              {relatedPokemon.map((p) => (
                <a key={p.id} href={`/wiki/pokemon/${p.id}`} className="card">
                  <h4>{p.name}</h4>
                  <p>{p.type}</p>
                  <span className={`rarity ${p.rarity}`}>{p.rarity}</span>
                </a>
              ))}
            </div>
          </>
        )}

        {relatedHabitats.length > 0 && (
          <>
            <h3 style={{ marginTop: '2rem' }}>Recommended Habitats</h3>
            <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
              {relatedHabitats.map((h) => (
                <li key={h.id} style={{ marginBottom: '0.5rem' }}>
                  <a href={`/wiki/habitat/${h.id}`}>{h.name}</a>
                </li>
              ))}
            </ul>
          </>
        )}

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
