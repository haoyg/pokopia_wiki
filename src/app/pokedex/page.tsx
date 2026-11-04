import type { Metadata } from 'next'
import Link from 'next/link'
import pokedex from '@/data/pokedex-verified.json'
import { BreadcrumbJsonLd, ItemListJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Pokopia Pokédex — Verified Pokémon, Habitats & Specialties',
  description:
    'A source-checked Pokopia Pokédex. Browse the first 50 reviewed Pokémon with types, specialties, and in-game habitat requirements.',
  alternates: { canonical: canonicalUrl('/pokedex') },
  openGraph: {
    title: 'Pokopia Pokédex — Verified Pokémon, Habitats & Specialties',
    description: 'Source-checked Pokémon, specialties, and habitat requirements for Pokémon Pokopia.',
    type: 'website',
    images: ['/og-image.svg'],
  },
}

const itemList = pokedex.pokemon.map((pokemon) => ({
  name: `#${String(pokemon.number).padStart(3, '0')} ${pokemon.name}`,
  url: `/pokedex#${pokemon.slug}`,
}))

export default function PokedexPage() {
  return (
    <main className="pokedex-page">
      <WebPageJsonLd
        type="CollectionPage"
        name="Pokopia Pokédex"
        description="A source-checked list of Pokémon, specialties, and habitat requirements in Pokémon Pokopia."
        url="/pokedex"
        dateModified={pokedex.reviewed_at}
      />
      <BreadcrumbJsonLd items={[{ name: 'Home', url: '/' }, { name: 'Pokopia Pokédex', url: '/pokedex' }]} />
      <ItemListJsonLd
        name="Reviewed Pokopia Pokédex entries"
        description="The first independently cross-checked batch of Pokémon Pokopia Pokédex entries."
        url="/pokedex"
        items={itemList}
      />

      <header className="pokedex-hero">
        <div>
          <span className="hero-kicker">Source-checked database</span>
          <h1>Pokopia Pokédex</h1>
          <p>
            Real Pokémon names, types, specialties, and habitat requirements—published only after cross-checking
            multiple references. The reviewed database currently covers Pokédex #001–#050.
          </p>
        </div>
        <aside className="pokedex-scope" aria-label="Pokédex coverage">
          <strong>{pokedex.scope.reviewed_here}</strong>
          <span>reviewed entries live</span>
          <small>{pokedex.scope.base_game} base-game entries documented by the current references</small>
        </aside>
      </header>

      <section className="pokedex-notice" aria-labelledby="coverage-heading">
        <div>
          <h2 id="coverage-heading">Coverage, not guesswork</h2>
          <p>
            Community references currently separate {pokedex.scope.base_game} base-game Pokédex entries,
            {' '}{pokedex.scope.bubbly_basin} Bubbly Basin entries, and {pokedex.scope.event} event entries in
            version {pokedex.current_game_version}. Only the {pokedex.scope.reviewed_here} rows checked for this
            release appear below. Missing rows are still under review—not invented or silently filled.
          </p>
        </div>
        <Link href="/source-policy">Read the source policy →</Link>
      </section>

      <section className="pokedex-grid" aria-label="Reviewed Pokopia Pokédex entries">
        {pokedex.pokemon.map((pokemon) => (
          <article id={pokemon.slug} key={pokemon.slug} className="pokedex-card">
            <div className="pokedex-card-heading">
              <span>#{String(pokemon.number).padStart(3, '0')}</span>
              <h2>{pokemon.name}</h2>
              <small>National #{String(pokemon.national_dex).padStart(4, '0')}</small>
            </div>
            <dl>
              <div>
                <dt>Type</dt>
                <dd>{pokemon.types.join(' / ')}</dd>
              </div>
              <div>
                <dt>Specialty</dt>
                <dd>{pokemon.specialties.length > 0 ? pokemon.specialties.join(', ') : 'None listed'}</dd>
              </div>
              <div>
                <dt>Habitat requirements</dt>
                <dd>{pokemon.habitats.join('; ')}</dd>
              </div>
            </dl>
            {'field_conflicts' in pokemon && pokemon.field_conflicts ? (
              <p className="pokedex-field-note"><strong>Under review:</strong> {Object.values(pokemon.field_conflicts).join(' ')}</p>
            ) : null}
            {'field_notes' in pokemon && pokemon.field_notes ? (
              <p className="pokedex-field-note">{Object.values(pokemon.field_notes).join(' ')}</p>
            ) : null}
          </article>
        ))}
      </section>

      <section className="pokedex-sources" aria-labelledby="sources-heading">
        <div>
          <span className="hero-kicker">Evidence</span>
          <h2 id="sources-heading">References used for this reviewed batch</h2>
          <p>
            These are independent community references, not official Nintendo or Pokémon databases. Conflicts are
            withheld until they can be resolved, and corrections are logged through our editorial workflow.
          </p>
        </div>
        <ul>
          {pokedex.sources.map((source) => (
            <li key={source.id}>
              <a href={source.url} rel="nofollow noopener noreferrer">{source.name}</a>
            </li>
          ))}
        </ul>
        <Link href="/corrections">Report a correction →</Link>
      </section>
    </main>
  )
}
