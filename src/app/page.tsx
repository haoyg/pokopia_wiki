import newsData from '@/data/news.json'
import guidesData from '@/data/guides.json'
import pokemonData from '@/data/pokemon.json'

const typeEmoji: Record<string, string> = {
  'Fire': '🔥', 'Water': '💧', 'Grass': '🌿', 'Electric': '⚡',
  'Ice': '❄️', 'Ghost': '👻', 'Dark': '🌑', 'Dragon': '🐉',
  'Steel': '⚙️', 'Rock': '🪨', 'Ground': '🌍', 'Flying': '🕊️',
  'Normal': '⚪', 'Poison': '☠️', 'Fairy': '✨', 'Crystal': '💎',
}

const categoryEmoji: Record<string, string> = {
  'update': '🆕', 'patch': '🔧', 'event': '🎉', 'announcement': '📢',
  'tier': '🏆', 'guides': '📖', 'farming': '🌾', 'team': '⚔️',
}

const rarityEmoji: Record<string, string> = {
  'common': '⚪', 'uncommon': '🟢', 'rare': '🔵', 'legendary': '🟡',
}

function getTypeEmoji(type: string) {
  for (const [key, emoji] of Object.entries(typeEmoji)) {
    if (type.toLowerCase().includes(key.toLowerCase())) return emoji
  }
  return '⚡'
}

export default function Home() {
  const news = newsData.slice(0, 4)
  const guides = guidesData.slice(0, 4)
  const pokemon = pokemonData.slice(0, 8)

  return (
    <main>
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/news">News</a>
          <a href="/guides">Guides</a>
          <a href="/wiki/pokemon">Pokémon</a>
          <a href="/wiki/habitat">Habitats</a>
          <a href="/wiki/recipe">Recipes</a>
          <a href="/features">Features</a>
          <a href="/tools">Tools</a>
        </nav>
      </header>

      <section className="hero">
        <h1>Pokopia Portal</h1>
        <p>Your ultimate guide to the Pokopia world</p>
      </section>

      <section style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>📰 Latest News</h2>
        <div className="news-grid">
          {news.map((item) => (
            <a key={item.id} href={`/news/${item.slug}`} className="card">
              <span className={`badge ${item.category}`}>{categoryEmoji[item.category]} {item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
            </a>
          ))}
        </div>
      </section>

      <section style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>📖 Trending Guides</h2>
        <div className="guides-grid">
          {guides.map((item) => (
            <a key={item.id} href={`/guides/${item.slug}`} className="card">
              <span className="badge">{categoryEmoji[item.category] || '📖'} {item.category}</span>
              <h3>{item.title}</h3>
            </a>
          ))}
        </div>
      </section>

      <section style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>⚡ Popular Pokémon</h2>
        <div className="pokemon-grid">
          {pokemon.map((p) => (
            <a key={p.id} href={`/wiki/pokemon/${p.id}`} className="card">
              <div style={{ fontSize: '2.5rem', textAlign: 'center' }}>{getTypeEmoji(p.type)}</div>
              <h3 style={{ textAlign: 'center', marginTop: '0.5rem' }}>{p.name}</h3>
              <p style={{ textAlign: 'center', color: '#666', fontSize: '0.875rem' }}>{p.type}</p>
              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <span className={`rarity ${p.rarity}`}>{rarityEmoji[p.rarity]}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer>
        <p>&copy; 2026 Pokopia Portal</p>
      </footer>
    </main>
  )
}