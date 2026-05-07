export default function PokemonPage() {
  return (
    <main>
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/news">News</a>
          <a href="/guides">Guides</a>
          <a href="/wiki/pokemon">Pokémon</a>
        </nav>
      </header>

      <h1>Pokémon Database</h1>
      <p>Browse all Pokémon in Pokopia</p>

      <div className="pokemon-grid">
        {/* Pokemon cards will go here */}
      </div>
    </main>
  )
}
