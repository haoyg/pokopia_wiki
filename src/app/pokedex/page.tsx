import type { Metadata } from 'next'
import Link from 'next/link'
import pokedex from '@/data/pokedex-verified.json'
import imageManifest from '@/data/pokedex-image-manifest.json'
import { BreadcrumbJsonLd, ItemListJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd'
import { canonicalUrl } from '@/lib/site'
import { PokedexFilterControls } from './PokedexFilterControls'
import { publishedPokedexDetailSlugs } from '@/lib/pokedexPublishing'

export const metadata: Metadata = {
  title: 'Pokopia Pokédex — Verified Pokémon, Habitats & Specialties',
  description:
    'A source-checked Pokopia Pokédex covering all 300 base-game Pokémon with types, specialties, forms, habitats, and unlock methods.',
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
  url: publishedPokedexDetailSlugs.has(pokemon.slug) ? `/pokedex/${pokemon.slug}` : `/pokedex#${pokemon.slug}`,
}))

const imageBySlug = new Map(imageManifest.images.map((image) => [image.slug, image]))
const pokemonTypes = [...new Set(pokedex.pokemon.flatMap((pokemon) => pokemon.types))].sort()

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
            multiple references. The reviewed database now covers the complete base-game Pokédex, #001–#300.
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

      <PokedexFilterControls total={pokedex.pokemon.length} types={pokemonTypes} />

      <section id="pokedex-results" className="pokedex-grid" aria-label="Reviewed Pokopia Pokédex entries">
        {pokedex.pokemon.map((pokemon) => {
          const image = imageBySlug.get(pokemon.slug)
          const searchText = [
            pokemon.name,
            String(pokemon.number),
            String(pokemon.number).padStart(3, '0'),
            String(pokemon.national_dex),
            String(pokemon.national_dex).padStart(4, '0'),
            ...pokemon.types,
            ...pokemon.specialties,
            ...pokemon.habitats,
          ].join(' ').toLocaleLowerCase()
          return (
          <article
            id={pokemon.slug}
            key={pokemon.slug}
            className="pokedex-card"
            data-search={searchText}
            data-types={pokemon.types.map((type) => type.toLocaleLowerCase()).join('|')}
          >
            {image ? (
              <div className="pokedex-card-media">
                <img
                  src={image.image_url}
                  alt={image.image_alt}
                  width={image.width}
                  height={image.height}
                  loading={pokemon.number <= 3 ? 'eager' : 'lazy'}
                  fetchPriority={pokemon.number === 1 ? 'high' : 'auto'}
                  decoding="async"
                />
              </div>
            ) : null}
            <div className="pokedex-card-heading">
              <span>#{String(pokemon.number).padStart(3, '0')}</span>
              <h2>{publishedPokedexDetailSlugs.has(pokemon.slug) ? <Link href={`/pokedex/${pokemon.slug}`}>{pokemon.name}</Link> : pokemon.name}</h2>
              <small>National #{String(pokemon.national_dex).padStart(4, '0')}</small>
            </div>
            <dl>
              {'forms' in pokemon && pokemon.forms ? (
                <div>
                  <dt>Forms</dt>
                  <dd>{pokemon.forms.join(', ')}</dd>
                </div>
              ) : null}
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
                <dd>{pokemon.habitats.length > 0 ? pokemon.habitats.join('; ') : ('acquisition' in pokemon ? 'Not applicable' : 'Under review')}</dd>
              </div>
              {'acquisition' in pokemon && pokemon.acquisition ? (
                <div>
                  <dt>Acquisition</dt>
                  <dd>{pokemon.acquisition}</dd>
                </div>
              ) : null}
            </dl>
            {'variants' in pokemon && pokemon.variants ? (
              <div className="pokedex-variants">
                {pokemon.variants.map((variant) => (
                  <div key={variant.name}>
                    <strong>{variant.name}</strong>
                    <span>Specialty: {variant.specialties.join(', ')}</span>
                    <span>Habitat: {variant.habitats.join('; ')}</span>
                  </div>
                ))}
              </div>
            ) : null}
            {'field_conflicts' in pokemon && pokemon.field_conflicts ? (
              <p className="pokedex-field-note"><strong>Under review:</strong> {Object.values(pokemon.field_conflicts).join(' ')}</p>
            ) : null}
            {'field_notes' in pokemon && pokemon.field_notes ? (
              <p className="pokedex-field-note">{Object.values(pokemon.field_notes).join(' ')}</p>
            ) : null}
          </article>
          )
        })}
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
        <p className="pokedex-image-credit">
          Pokémon identification artwork is served locally at reduced resolution from the {imageManifest.source.name}.
          Pokémon characters and artwork belong to their respective rights holders. See our{' '}
          <Link href="/source-policy">source policy</Link> for how media provenance is recorded.
        </p>
        <Link href="/corrections">Report a correction →</Link>
      </section>
    </main>
  )
}
