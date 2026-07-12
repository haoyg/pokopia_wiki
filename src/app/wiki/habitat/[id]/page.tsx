import { Metadata } from 'next'
import habitatsData from '@/data/habitats.json'
import pokemonData from '@/data/pokemon.json'
import guidesData from '@/data/guides.json'
import recipesData from '@/data/recipes.json'
import { canonicalUrl } from '@/lib/site'
import { habitatMetaDescription, habitatMetaTitle } from '@/lib/seoText'
import { CreditedImage } from '@/components/media/CreditedImage'
import { BreadcrumbJsonLd, FAQJsonLd, WikiPageJsonLd } from '@/components/seo/JsonLd'
import { DataStatus } from '@/components/content/DataStatus'
import { OfficialContext } from '@/components/content/OfficialContext'
import { SourceReview } from '@/components/content/SourceReview'
import { isIndexableDatabaseEntry, noIndexMetadata } from '@/lib/indexing'

type SourceReviewFields = {
  sources?: { label?: string; url?: string }[]
  confirmed_facts?: string[]
  editorial_limits?: string[]
}

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return habitatsData.map((habitat) => ({
    id: habitat.id,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const habitat = habitatsData.find((h) => h.id === id)
  const title = habitat ? habitatMetaTitle(habitat) : 'Habitat Not Found'
  const description = habitat ? habitatMetaDescription(habitat) : undefined
  return {
    title,
    description,
    robots: habitat && !isIndexableDatabaseEntry(habitat) ? noIndexMetadata : undefined,
    keywords: habitat
      ? ([
          `${habitat.name} Pokopia habitat`,
          `${habitat.difficulty} habitat Pokopia`,
          `${habitat.weather} Pokemon Pokopia`,
          `best habitat route Pokopia`,
          habitat.resource_bonus ? `resource bonus ${habitat.resource_bonus} Pokopia` : null,
        ].filter(Boolean) as string[])
      : undefined,
    openGraph: {
      title,
      description,
      images: habitat?.image_source ? [habitat.image_url] : ['/og-image.svg'],
    },
    alternates: habitat ? {
      canonical: canonicalUrl(`/wiki/habitat/${habitat.id}`),
    } : undefined,
  }
}

export default async function HabitatDetailPage({ params }: Props) {
  const { id } = await params
  const habitat = habitatsData.find((h) => h.id === id)

  if (!habitat) {
    return <p>Habitat not found</p>
  }
  const sourceReview = habitat as typeof habitat & SourceReviewFields

  const spawns = (habitat.spawn_list || '').split(',')
  const relatedPokemon = pokemonData.filter((p) => spawns.includes(p.id))
  const relatedGuides = guidesData.filter((g) =>
    (g.related_habitats || '').split(',').includes(id)
  ).slice(0, 5)
  const recommendedRecipe = recipesData.find((recipe) => recipe.id === habitat.recommended_recipe)
  const updatedAt = habitat.updated_at ? new Date(habitat.updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : null
  const modifiedAt = habitat.updated_at ? new Date(habitat.updated_at).toISOString() : undefined

  return (
    <main>
      <WikiPageJsonLd
        name={habitat.name}
        description={habitat.overview}
        url={`/wiki/habitat/${habitat.id}`}
        pageType="Habitat"
        image={habitat.image_source ? habitat.image_url : undefined}
        dateModified={modifiedAt}
        properties={[
          { name: 'Unlock Condition', value: habitat.unlock_condition },
          { name: 'Weather', value: habitat.weather },
          { name: 'Difficulty', value: habitat.difficulty },
          { name: 'Resource Bonus', value: habitat.resource_bonus },
          { name: 'Pokemon Spawns', value: relatedPokemon.map((p) => p.name).join(', ') },
          ...(recommendedRecipe ? [{ name: 'Recommended Recipe', value: recommendedRecipe.name }] : []),
        ]}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Habitats', url: '/wiki/habitat' },
          { name: habitat.name, url: `/wiki/habitat/${habitat.id}` },
        ]}
      />
      {habitat.faqs && habitat.faqs.length > 0 && <FAQJsonLd faqs={habitat.faqs} title={habitat.name} />}
      <article className="habitat-detail-page">
        <div className="habitat-detail-hero">
          <div className="habitat-hero-copy">
            <span className="panel-kicker">Habitat Route</span>
            <h1>{habitat.name}</h1>
            <p>{habitat.overview}</p>
            <div className="pokemon-tag-row">
              <span className={`badge ${habitat.difficulty}`}>{habitat.difficulty}</span>
              <span className="type-chip">{habitat.weather}</span>
              <span className="type-chip">{habitat.resource_bonus}</span>
            </div>
            {updatedAt && <p className="updated-note">Updated {updatedAt}</p>}
            <DataStatus status={habitat.data_status} note={habitat.data_status_note} updatedAt={updatedAt} />
            <OfficialContext
              title="Official Building and Exploration Context"
              description="Habitat route advice is editorial. Use official pages for confirmed systems around building, exploration, Pokémon moves, multiplayer, and world creation."
              links={[
                { href: '/official/gameplay-overview', label: 'Gameplay overview' },
                { href: '/official/multiplayer-gameshare-cloud-island', label: 'Multiplayer' },
                { href: '/official/official-beginner-tips', label: 'Official tips' },
              ]}
            />
          </div>
          <CreditedImage src={habitat.image_url} alt={habitat.image_alt || habitat.name} source={habitat.image_source} sourceUrl={habitat.image_source_url} licenseNote={habitat.image_license_note} originalMedia={habitat.image_original_media} className="habitat-hero-cover" sizes="(max-width: 768px) 100vw, 420px" priority />
        </div>

        <div className="habitat-quick-facts" aria-label={`${habitat.name} quick facts`}>
          <div>
            <span>Unlock Condition</span>
            <strong>{habitat.unlock_condition}</strong>
          </div>
          <div>
            <span>Weather</span>
            <strong>{habitat.weather}</strong>
          </div>
          <div>
            <span>Spawns</span>
            <strong>{relatedPokemon.length} Pokemon</strong>
          </div>
          {recommendedRecipe && (
            <div>
              <span>Recommended Recipe</span>
              <a href={`/wiki/recipe/${recommendedRecipe.id}`}>{recommendedRecipe.name}</a>
            </div>
          )}
        </div>

        {relatedPokemon.length > 0 && (
          <section className="habitat-spawn-panel">
            <div className="section-title-row">
              <div>
                <span className="panel-kicker">Local Spawns</span>
                <h2>Pokemon in {habitat.name}</h2>
              </div>
            </div>
            <div className="habitat-spawn-grid">
              {relatedPokemon.map((p) => (
                <a key={p.id} href={`/wiki/pokemon/${p.id}`}>
                  <strong>{p.name}</strong>
                  <span>{p.type} · {p.specialty}</span>
                  <small>{p.spawn_time} / {p.weather}</small>
                </a>
              ))}
            </div>
          </section>
        )}

        {habitat.unlock_steps && (
          <section className="habitat-guide-section">
            <h2>Unlock Route</h2>
            <ol>
              {habitat.unlock_steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        )}

        {habitat.recommended_team && (
          <section className="habitat-guide-section">
            <h2>Recommended Team</h2>
            <ul>
              {habitat.recommended_team.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {habitat.farming_route && (
          <section className="habitat-guide-section">
            <h2>Farming Route</h2>
            <ol>
              {habitat.farming_route.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        )}

        {habitat.rare_spawns && (
          <section className="habitat-guide-section">
            <h2>Rare Spawns</h2>
            <ul>
              {habitat.rare_spawns.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {habitat.resource_notes && (
          <section className="habitat-guide-section">
            <h2>Resource Notes</h2>
            <ul>
              {habitat.resource_notes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        <SourceReview className="habitat-guide-section" sources={sourceReview.sources} confirmedFacts={sourceReview.confirmed_facts} editorialLimits={sourceReview.editorial_limits} />

        {habitat.common_mistakes && (
          <section className="habitat-guide-section">
            <h2>Common Mistakes</h2>
            <ul>
              {habitat.common_mistakes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {habitat.faqs && (
          <section className="habitat-guide-section pokemon-faq-list">
            <h2>{habitat.name} FAQ</h2>
            {habitat.faqs.map((faq) => (
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
            <span className="panel-kicker">Route Network</span>
            <h2>Pokemon, Recipes, and Guides</h2>
          </div>
          <a href="/tools/habitat-planner">Plan route</a>
        </div>
        <div className="related-content-grid">
          {relatedPokemon.map((p) => (
            <a key={p.id} href={`/wiki/pokemon/${p.id}`} className="related-content-card">
              <span>Pokemon</span>
              <strong>{p.name}</strong>
              <p>{p.type} · {p.specialty}</p>
              <small>{p.spawn_time} / {p.weather}</small>
            </a>
          ))}
          {recommendedRecipe && (
            <a href={`/wiki/recipe/${recommendedRecipe.id}`} className="related-content-card">
              <span>Recipe</span>
              <strong>{recommendedRecipe.name}</strong>
              <p>{recommendedRecipe.buff} · {recommendedRecipe.effect_duration}</p>
              <small>{recommendedRecipe.best_use}</small>
            </a>
          )}
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
