export default function Home() {
  return (
    <main>
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/news">News</a>
          <a href="/guides">Guides</a>
          <a href="/wiki/pokemon">Pokémon</a>
          <a href="/features">Features</a>
          <a href="/tools">Tools</a>
        </nav>
      </header>

      <section className="hero">
        <h1>Pokopia Portal</h1>
        <p>Your ultimate guide to the Pokopia world</p>
      </section>

      <section className="latest-news">
        <h2>Latest News</h2>
        <div className="news-grid">{/* News items */}</div>
      </section>

      <section className="trending-guides">
        <h2>Trending Guides</h2>
        <div className="guides-grid">{/* Guide items */}</div>
      </section>

      <section className="popular-pokemon">
        <h2>Popular Pokémon</h2>
        <div className="pokemon-grid">{/* Pokemon items */}</div>
      </section>

      <footer>
        <p>&copy; 2026 Pokopia Portal</p>
      </footer>
    </main>
  )
}
