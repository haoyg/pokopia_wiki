import { Metadata } from 'next'
import Image from 'next/image'
import pokemonData from '@/data/pokemon.json'
import guidesData from '@/data/guides.json'
import newsData from '@/data/news.json'
import { canonicalUrl } from '@/lib/site'

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
  return {
    title: pokemon ? `${pokemon.name} | Pokopia Portal` : 'Pokemon Not Found',
    description: pokemon?.description,
    openGraph: {
      title: pokemon ? `${pokemon.name} - Pokopia Portal` : 'Pokemon Not Found',
      description: pokemon?.description,
      images: [pokemon?.image_url || '/og-image.svg'],
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

  return (
    <main>
      <article style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div className="pokemon-detail-hero">
          <div className="pokemon-portrait">
            <Image src={pokemon.image_url} alt={pokemon.image_alt} fill sizes="180px" priority />
          </div>
          <div>
            <h1>{pokemon.name}</h1>
            <p>{pokemon.type}</p>
            <span className={`rarity ${pokemon.rarity}`}>{pokemon.rarity}</span>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3>Description</h3>
          <p>{pokemon.description}</p>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <h4>Habitat</h4>
            <a href={`/wiki/habitat/${pokemon.habitat}`}>{pokemon.habitat}</a>
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

        <div style={{ marginTop: '1.5rem' }}>
          <h4>Skills</h4>
          <p>{pokemon.skills}</p>
        </div>
      </article>

      <aside style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', borderTop: '1px solid #ddd' }}>
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
          <p style={{ color: '#666' }}>No related guides yet.</p>
        )}

        <h3 style={{ marginTop: '2rem' }}>Latest News</h3>
        <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
          {recentNews.map((n) => (
            <li key={n.id} style={{ marginBottom: '0.5rem' }}>
              <a href={`/news/${n.slug}`}>{n.title}</a>
            </li>
          ))}
        </ul>
      </aside>
    </main>
  )
}
