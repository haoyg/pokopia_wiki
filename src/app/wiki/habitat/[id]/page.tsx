import { Metadata } from 'next'
import habitatsData from '@/data/habitats.json'
import pokemonData from '@/data/pokemon.json'
import guidesData from '@/data/guides.json'
import recipesData from '@/data/recipes.json'
import { canonicalUrl } from '@/lib/site'
import { CreditedImage } from '@/components/media/CreditedImage'
import { FAQJsonLd } from '@/components/seo/JsonLd'
import { DataStatus } from '@/components/content/DataStatus'
import { OfficialContext } from '@/components/content/OfficialContext'

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
  const description = habitat?.overview || `${habitat?.name} - ${habitat?.unlock_condition}. ${habitat?.resource_bonus}`
  return {
    title: habitat ? `${habitat.name} Unlock, Spawns & Farming Route` : 'Habitat Not Found',
    description,
    openGraph: {
      title: habitat ? `${habitat.name} - Pokopia Portal` : 'Habitat Not Found',
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

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      {habitat.faqs && habitat.faqs.length > 0 && <FAQJsonLd faqs={habitat.faqs} title={habitat.name} />}
      <h1>{habitat.name}</h1>
      <p>{habitat.unlock_condition}</p>
      {updatedAt && <p style={{ color: '#777', fontSize: '0.875rem', marginTop: '0.5rem' }}>Updated {updatedAt}</p>}
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
      <CreditedImage src={habitat.image_url} alt={habitat.image_alt || habitat.name} source={habitat.image_source} sourceUrl={habitat.image_source_url} licenseNote={habitat.image_license_note} className="article-cover" sizes="(max-width: 768px) 100vw, 800px" priority />

      <section style={{ padding: 0, marginTop: '2rem' }}>
        <h2>{habitat.name} Overview</h2>
        <p>{habitat.overview}</p>
      </section>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <h4>Weather</h4>
          <p>{habitat.weather}</p>
        </div>
        <div>
          <h4>Difficulty</h4>
          <span className={`badge ${habitat.difficulty}`}>{habitat.difficulty}</span>
        </div>
        <div>
          <h4>Resource Bonus</h4>
          <p>{habitat.resource_bonus}</p>
        </div>
        <div>
          <h4>Spawns</h4>
          <p>{relatedPokemon.map((p) => p.name).join(', ')}</p>
        </div>
        {recommendedRecipe && (
          <div>
            <h4>Recommended Recipe</h4>
            <a href={`/wiki/recipe/${recommendedRecipe.id}`}>{recommendedRecipe.name}</a>
          </div>
        )}
      </div>

      {habitat.unlock_steps && (
        <section style={{ padding: 0, marginTop: '2rem' }}>
          <h2>Unlock Route</h2>
          <ol>
            {habitat.unlock_steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      {habitat.recommended_team && (
        <section style={{ padding: 0, marginTop: '2rem' }}>
          <h2>Recommended Team</h2>
          <ul>
            {habitat.recommended_team.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {habitat.farming_route && (
        <section style={{ padding: 0, marginTop: '2rem' }}>
          <h2>Farming Route</h2>
          <ol>
            {habitat.farming_route.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      {habitat.rare_spawns && (
        <section style={{ padding: 0, marginTop: '2rem' }}>
          <h2>Rare Spawns</h2>
          <ul>
            {habitat.rare_spawns.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {habitat.resource_notes && (
        <section style={{ padding: 0, marginTop: '2rem' }}>
          <h2>Resource Notes</h2>
          <ul>
            {habitat.resource_notes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {habitat.common_mistakes && (
        <section style={{ padding: 0, marginTop: '2rem' }}>
          <h2>Common Mistakes</h2>
          <ul>
            {habitat.common_mistakes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {habitat.faqs && (
        <section style={{ padding: 0, marginTop: '2rem' }}>
          <h2>{habitat.name} FAQ</h2>
          {habitat.faqs.map((faq) => (
            <div key={faq.question} style={{ marginTop: '1rem' }}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </section>
      )}

      <aside style={{ marginTop: '3rem', borderTop: '1px solid #ddd', paddingTop: '2rem' }}>
        <h3>Pokemon in this Habitat</h3>
        {relatedPokemon.length > 0 ? (
          <div className="pokemon-grid" style={{ marginTop: '1rem' }}>
            {relatedPokemon.map((p) => (
              <a key={p.id} href={`/wiki/pokemon/${p.id}`} className="card">
                <h4>{p.name}</h4>
                <p>{p.type}</p>
                <span className={`rarity ${p.rarity}`}>{p.rarity}</span>
              </a>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666' }}>No Pokemon data yet.</p>
        )}

        <h3 style={{ marginTop: '2rem' }}>Related Guides</h3>
        {relatedGuides.length > 0 ? (
          <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
            {relatedGuides.map((g) => (
              <li key={g.id} style={{ marginBottom: '0.5rem' }}>
                <a href={`/guides/${g.slug}`}>{g.title}</a>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#666' }}>No related guides yet.</p>
        )}

        {recommendedRecipe && (
          <>
            <h3 style={{ marginTop: '2rem' }}>Recommended Recipe</h3>
            <p style={{ marginTop: '0.5rem' }}>
              <a href={`/wiki/recipe/${recommendedRecipe.id}`}>{recommendedRecipe.name}</a>: {recommendedRecipe.buff}
            </p>
          </>
        )}
      </aside>
    </main>
  )
}
