export default function PokemonDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <main>
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/wiki/pokemon">Pokémon</a>
        </nav>
      </header>

      <article>
        <h1>Pokémon Detail</h1>
        <p>ID: {params.id}</p>
        {/* Pokemon details will go here */}
      </article>

      <aside>
        <h3>Related Pokémon</h3>
        <h3>Related Guides</h3>
        <h3>Related News</h3>
        <h3>Related Builds</h3>
      </aside>
    </main>
  )
}
