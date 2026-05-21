import newsData from '@/data/news.json'
import guidesData from '@/data/guides.json'
import pokemonData from '@/data/pokemon.json'

const typeLabels: Record<string, string> = {
  Fire: 'Fire',
  Water: 'Water',
  Grass: 'Grass',
  Electric: 'Electric',
  Ice: 'Ice',
  Ghost: 'Ghost',
  Dark: 'Dark',
  Dragon: 'Dragon',
  Steel: 'Steel',
  Rock: 'Rock',
  Ground: 'Ground',
  Flying: 'Flying',
  Normal: 'Normal',
  Poison: 'Poison',
  Fairy: 'Fairy',
  Crystal: 'Crystal',
}

const categoryLabels: Record<string, string> = {
  update: 'Update',
  patch: 'Patch',
  event: 'Event',
  announcement: 'News',
  tier: 'Tier',
  guides: 'Guide',
  farming: 'Farming',
  team: 'Team',
}

function getTypeLabel(type: string) {
  for (const [key, label] of Object.entries(typeLabels)) {
    if (type.toLowerCase().includes(key.toLowerCase())) return label
  }
  return 'Normal'
}

export default function Home() {
  const news = newsData.slice(0, 4)
  const guides = guidesData.slice(0, 4)
  const pokemon = pokemonData.slice(0, 8)

  return (
    <main>
      <section className="hero">
        <h1>Pokopia Portal</h1>
        <p>Your ultimate guide to the Pokopia world</p>
      </section>

      <section>
        <h2>Latest News</h2>
        <div className="news-grid">
          {news.map((item) => (
            <a key={item.id} href={`/news/${item.slug}`} className="card">
              <span className={`badge ${item.category}`}>
                {categoryLabels[item.category] || item.category}
              </span>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2>Trending Guides</h2>
        <div className="guides-grid">
          {guides.map((item) => (
            <a key={item.id} href={`/guides/${item.slug}`} className="card">
              <span className="badge">{categoryLabels[item.category] || item.category}</span>
              <h3>{item.title}</h3>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2>Popular Pokemon</h2>
        <div className="pokemon-grid">
          {pokemon.map((p) => (
            <a key={p.id} href={`/wiki/pokemon/${p.id}`} className="card">
              <div className="type-kicker">{getTypeLabel(p.type)}</div>
              <h3 style={{ textAlign: 'center', marginTop: '0.5rem' }}>{p.name}</h3>
              <p style={{ textAlign: 'center', color: '#666', fontSize: '0.875rem' }}>{p.type}</p>
              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <span className={`rarity ${p.rarity}`}>{p.rarity}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
