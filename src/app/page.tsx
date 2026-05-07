'use client'

import { useEffect, useState } from 'react'

interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  published_at: number
}

interface GuideItem {
  id: string
  title: string
  slug: string
  category: string
}

interface PokemonItem {
  id: string
  name: string
  type: string
  rarity: string
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [guides, setGuides] = useState<GuideItem[]>([])
  const [pokemon, setPokemon] = useState<PokemonItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [newsRes, guidesRes, pokemonRes] = await Promise.all([
          fetch('/api/news'),
          fetch('/api/guides'),
          fetch('/api/pokemon'),
        ])
        const [newsData, guidesData, pokemonData] = await Promise.all([
          newsRes.json(),
          guidesRes.json(),
          pokemonRes.json(),
        ])
        setNews(newsData.slice(0, 4))
        setGuides(guidesData.slice(0, 4))
        setPokemon(pokemonData.slice(0, 8))
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <section className="latest-news">
            <h2>Latest News</h2>
            <div className="news-grid">
              {news.map((item) => (
                <a key={item.id} href={`/news/${item.slug}`} className="card">
                  <span className={`badge ${item.category}`}>{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                </a>
              ))}
            </div>
          </section>

          <section className="trending-guides">
            <h2>Trending Guides</h2>
            <div className="guides-grid">
              {guides.map((item) => (
                <a key={item.id} href={`/guides/${item.slug}`} className="card">
                  <span className="badge">{item.category}</span>
                  <h3>{item.title}</h3>
                </a>
              ))}
            </div>
          </section>

          <section className="popular-pokemon">
            <h2>Popular Pokémon</h2>
            <div className="pokemon-grid">
              {pokemon.map((p) => (
                <a key={p.id} href={`/wiki/pokemon/${p.id}`} className="card">
                  <h3>{p.name}</h3>
                  <p>{p.type}</p>
                  <span className={`rarity ${p.rarity}`}>{p.rarity}</span>
                </a>
              ))}
            </div>
          </section>
        </>
      )}

      <footer>
        <p>&copy; 2026 Pokopia Portal</p>
      </footer>
    </main>
  )
}
