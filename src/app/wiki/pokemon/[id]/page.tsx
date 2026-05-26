import { Metadata } from 'next'
import pokemonData from '@/data/pokemon.json'
import guidesData from '@/data/guides.json'
import newsData from '@/data/news.json'
import habitatsData from '@/data/habitats.json'
import { canonicalUrl } from '@/lib/site'
import { pokemonMetaDescription, pokemonMetaTitle } from '@/lib/seoText'
import { CreditedImage } from '@/components/media/CreditedImage'
import { BreadcrumbJsonLd, FAQJsonLd, WikiPageJsonLd } from '@/components/seo/JsonLd'
import { DataStatus } from '@/components/content/DataStatus'
import { OfficialContext } from '@/components/content/OfficialContext'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return pokemonData.map((pokemon) => ({
    id: pokemon.id,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const pokemon = pokemonData.find((p) => p.id === id)
  const title = pokemon ? pokemonMetaTitle(pokemon) : 'Pokemon Not Found'
  const description = pokemon ? pokemonMetaDescription(pokemon) : undefined
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: pokemon?.image_source ? [pokemon.image_url] : ['/og-image.svg'],
    },
    alternates: pokemon ? {
      canonical: canonicalUrl(`/wiki/pokemon/${pokemon.id}`),
    } : undefined,
  }
}

export default async function PokemonDetailPage({ params }: Props) {
  const { id } = await params
  const pokemon = pokemonData.find((p) => p.id === id)

  if (!pokemon) {
    return <p>Pokemon not found</p>
  }

  const relatedGuides = guidesData.filter((g) =>
    (g.related_pokemon || '').split(',').includes(id)
  ).slice(0, 3)
  const recentNews = newsData.slice(0, 3)
  const habitat = habitatsData.find((h) => h.id === pokemon.habitat)
  const updatedAt = pokemon.updated_at ? new Date(pokemon.updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : null
  const modifiedAt = pokemon.updated_at ? new Date(pokemon.updated_at).toISOString() : undefined

  return (
    <main>
      <WikiPageJsonLd
        name={pokemon.name}
        description={pokemon.overview || pokemon.description}
        url={`/wiki/pokemon/${pokemon.id}`}
        pageType="Pokemon"
        image={pokemon.image_source ? pokemon.image_url : undefined}
        dateModified={modifiedAt}
        properties={[
          { name: 'Type', value: pokemon.type },
          { name: 'Rarity', value: pokemon.rarity },
          { name: 'Habitat', value: habitat?.name || pokemon.habitat },
          { name: 'Favorite Food', value: pokemon.favorite_food },
          { name: 'Spawn Time', value: pokemon.spawn_time },
          { name: 'Weather', value: pokemon.weather },
          { name: 'Specialty', value: pokemon.specialty },
          { name: 'Drops', value: Array.isArray(pokemon.drops) ? pokemon.drops.join(', ') : pokemon.drops },
        ]}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Pokemon Database', url: '/wiki/pokemon' },
          { name: pokemon.name, url: `/wiki/pokemon/${pokemon.id}` },
        ]}
      />
      {pokemon.faqs && pokemon.faqs.length > 0 && <FAQJsonLd faqs={pokemon.faqs} title={pokemon.name} />}
      <article style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div className="pokemon-detail-hero">
          <CreditedImage src={pokemon.image_url} alt={pokemon.image_alt} source={pokemon.image_source} sourceUrl={pokemon.image_source_url} licenseNote={pokemon.image_license_note} originalMedia={pokemon.image_original_media} className="pokemon-portrait" sizes="180px" priority />
          <div>
            <h1>{pokemon.name}</h1>
            <p>{pokemon.type}</p>
            <span className={`rarity ${pokemon.rarity}`}>{pokemon.rarity}</span>
            {updatedAt && <p style={{ color: '#777', fontSize: '0.875rem', marginTop: '0.75rem' }}>Updated {updatedAt}</p>}
            <DataStatus status={pokemon.data_status} note={pokemon.data_status_note} updatedAt={updatedAt} />
            <OfficialContext
              title="Confirmed Gameplay Context"
              description="Pokémon pages include editorial database notes. Use the official gameplay overview for confirmed systems such as Ditto, moves, crafting, and exploration."
              links={[
                { href: '/official/gameplay-overview', label: 'Gameplay overview' },
                { href: '/official/official-beginner-tips', label: 'Official tips' },
              ]}
            />
          </div>
        </div>

        <section style={{ padding: 0, marginTop: '2rem' }}>
          <h2>{pokemon.name} Overview</h2>
          <p>{pokemon.overview || pokemon.description}</p>
        </section>

        {pokemon.how_to_get && pokemon.how_to_get.length > 0 && (
          <section style={{ padding: 0, marginTop: '2rem' }}>
            <h2>How to Get {pokemon.name}</h2>
            <ol>
              {pokemon.how_to_get.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        )}

        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <h4>Habitat</h4>
            <a href={`/wiki/habitat/${pokemon.habitat}`}>{habitat?.name || pokemon.habitat}</a>
          </div>
          <div>
            <h4>Favorite Food</h4>
            <p>{pokemon.favorite_food}</p>
          </div>
          <div>
            <h4>Spawn Time</h4>
            <p>{pokemon.spawn_time}</p>
          </div>
          <div>
            <h4>Weather</h4>
            <p>{pokemon.weather}</p>
          </div>
          <div>
            <h4>Specialty</h4>
            <p>{pokemon.specialty}</p>
          </div>
          <div>
            <h4>Drops</h4>
            <p>{pokemon.drops}</p>
          </div>
        </div>

        <section style={{ padding: 0, marginTop: '2rem' }}>
          <h2>Skills</h2>
          <p>{pokemon.skills}</p>
        </section>

        {pokemon.best_use && pokemon.best_use.length > 0 && (
          <section style={{ padding: 0, marginTop: '2rem' }}>
            <h2>Best Use</h2>
            <ul>
              {pokemon.best_use.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {pokemon.team_tips && pokemon.team_tips.length > 0 && (
          <section style={{ padding: 0, marginTop: '2rem' }}>
            <h2>Team Tips</h2>
            <ul>
              {pokemon.team_tips.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {pokemon.farming_notes && pokemon.farming_notes.length > 0 && (
          <section style={{ padding: 0, marginTop: '2rem' }}>
            <h2>Farming Notes</h2>
            <ul>
              {pokemon.farming_notes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {pokemon.common_mistakes && pokemon.common_mistakes.length > 0 && (
          <section style={{ padding: 0, marginTop: '2rem' }}>
            <h2>Common Mistakes</h2>
            <ul>
              {pokemon.common_mistakes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {pokemon.faqs && pokemon.faqs.length > 0 && (
          <section style={{ padding: 0, marginTop: '2rem' }}>
            <h2>{pokemon.name} FAQ</h2>
            {pokemon.faqs.map((faq) => (
              <div key={faq.question} style={{ marginTop: '1rem' }}>
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
            <span className="panel-kicker">Next Checks</span>
            <h2>Related Guides and Source Updates</h2>
          </div>
          <a href="/wiki/pokemon">All Pokemon</a>
        </div>
        <div className="related-content-grid">
          {habitat && (
            <a href={`/wiki/habitat/${habitat.id}`} className="related-content-card">
              <span>Habitat</span>
              <strong>{habitat.name}</strong>
              <p>{habitat.weather} · {habitat.resource_bonus}</p>
              <small>Use this route page before farming {pokemon.name}.</small>
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
          {recentNews.map((n) => (
            <a key={n.id} href={`/news/${n.slug}`} className="related-content-card">
              <span>News</span>
              <strong>{n.title}</strong>
              <p>{n.excerpt}</p>
              <small>{n.verified_status}</small>
            </a>
          ))}
        </div>
      </aside>
    </main>
  )
}
