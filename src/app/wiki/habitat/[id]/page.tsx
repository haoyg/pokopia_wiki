import { Metadata } from 'next'
import habitatsData from '@/data/habitats.json'
import pokemonData from '@/data/pokemon.json'
import guidesData from '@/data/guides.json'

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
  return {
    title: habitat ? `${habitat.name} | Pokopia Portal` : 'Habitat Not Found',
  }
}

export default async function HabitatDetailPage({ params }: Props) {
  const { id } = await params
  const habitat = habitatsData.find((h) => h.id === id)

  if (!habitat) {
    return <p>Habitat not found</p>
  }

  const spawns = (habitat.spawn_list || '').split(',')
  const relatedPokemon = pokemonData.filter((p) => spawns.includes(p.id)).slice(0, 4)
  const relatedGuides = guidesData.filter((g) =>
    g.related_habitats?.includes(id)
  ).slice(0, 3)

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/wiki/habitat">Habitats</a>
        </nav>
      </header>

      <h1>{habitat.name}</h1>
      <p>{habitat.unlock_condition}</p>

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
          <p>{habitat.spawn_list}</p>
        </div>
      </div>

      <aside style={{ marginTop: '3rem', borderTop: '1px solid #ddd', paddingTop: '2rem' }}>
        <h3>Pokémon in this Habitat</h3>
        {relatedPokemon.length > 0 ? (
          <div className="pokemon-grid" style={{ marginTop: '1rem' }}>
            {relatedPokemon.map((p) => (
              <a key={p.id} href={`/wiki/pokemon/${p.id}`} className="card">
                <h4>{p.name}</h4>
                <p>{p.type}</p>
              </a>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666' }}>No Pokémon data yet.</p>
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
      </aside>
    </main>
  )
}
