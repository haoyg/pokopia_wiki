import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import imageManifest from '@/data/pokedex-image-manifest.json'
import pokedex from '@/data/pokedex-verified.json'
import { BreadcrumbJsonLd, WikiPageJsonLd } from '@/components/seo/JsonLd'
import { canonicalUrl } from '@/lib/site'
import { publishedPokedexDetails } from '@/lib/pokedexPublishing'

type PageProps = { params: Promise<{ slug: string }> }

const imageBySlug = new Map(imageManifest.images.map((image) => [image.slug, image]))

export function generateStaticParams() {
  return publishedPokedexDetails.map((pokemon) => ({ slug: pokemon.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const pokemon = publishedPokedexDetails.find((entry) => entry.slug === slug)
  if (!pokemon) return { robots: { index: false, follow: false } }

  const description = 'acquisition' in pokemon
    ? `How to get ${pokemon.name} in Pokopia, with its Pokopia Pokédex number, type, specialty, acquisition method, and source notes.`
    : `${pokemon.name} in Pokopia: Pokédex number, type, specialty, habitat requirements, variants, and reviewed source notes.`

  return {
    title: `${pokemon.name} in Pokopia — How to Get, Type & Specialty`,
    description,
    alternates: { canonical: canonicalUrl(`/pokedex/${pokemon.slug}`) },
    openGraph: {
      title: `${pokemon.name} in Pokopia`,
      description,
      type: 'article',
      images: [`/images/pokedex/${pokemon.slug}.webp`],
    },
  }
}

export default async function PokedexDetailPage({ params }: PageProps) {
  const { slug } = await params
  const detailIndex = publishedPokedexDetails.findIndex((entry) => entry.slug === slug)
  if (detailIndex < 0) notFound()

  const pokemon = publishedPokedexDetails[detailIndex]
  const image = imageBySlug.get(pokemon.slug)
  const previous = publishedPokedexDetails[detailIndex - 1]
  const next = publishedPokedexDetails[detailIndex + 1]
  const typeText = pokemon.types.join(' / ')
  const specialtyText = pokemon.specialties.length > 0 ? pokemon.specialties.join(', ') : 'No specialty listed'
  const habitatText = pokemon.habitats.length > 0 ? pokemon.habitats.join('; ') : 'No habitat requirement'
  const description = 'acquisition' in pokemon
    ? `${pokemon.name} is Pokopia Pokédex #${String(pokemon.number).padStart(3, '0')}. This reviewed record documents its ${typeText} typing, ${specialtyText.toLocaleLowerCase()} specialty status, and confirmed acquisition route.`
    : `${pokemon.name} is Pokopia Pokédex #${String(pokemon.number).padStart(3, '0')}. This reviewed record documents its ${typeText} typing, ${specialtyText.toLocaleLowerCase()} specialty status, habitat requirements, and named variants.`

  return (
    <main className="pokedex-detail-page">
      <WikiPageJsonLd
        name={`${pokemon.name} in Pokopia`}
        description={description}
        url={`/pokedex/${pokemon.slug}`}
        pageType="Pokemon"
        image={image?.image_url}
        dateModified={pokedex.reviewed_at}
        properties={[
          { name: 'Pokopia Pokédex number', value: String(pokemon.number) },
          { name: 'National Pokédex number', value: String(pokemon.national_dex) },
          { name: 'Type', value: typeText },
          { name: 'Specialty', value: specialtyText },
        ]}
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: '/' },
        { name: 'Pokopia Pokédex', url: '/pokedex' },
        { name: pokemon.name, url: `/pokedex/${pokemon.slug}` },
      ]} />

      <nav className="pokedex-detail-breadcrumb" aria-label="Breadcrumb">
        <Link href="/pokedex">Pokopia Pokédex</Link>
        <span aria-hidden="true">/</span>
        <span>{pokemon.name}</span>
      </nav>

      <header className="pokedex-detail-hero">
        <div className="pokedex-detail-art">
          {image ? <img src={image.image_url} alt={image.image_alt} width={image.width} height={image.height} /> : null}
        </div>
        <div>
          <span className="hero-kicker">Verified Pokopia record</span>
          <h1>{pokemon.name} in Pokopia</h1>
          <p>{description}</p>
          <div className="pokedex-detail-numbers">
            <span>Pokopia #{String(pokemon.number).padStart(3, '0')}</span>
            <span>National #{String(pokemon.national_dex).padStart(4, '0')}</span>
          </div>
        </div>
      </header>

      <div className="pokedex-detail-layout">
        <article className="pokedex-detail-content">
          <section>
            <h2>{'acquisition' in pokemon ? `How to get ${pokemon.name}` : `${pokemon.name} habitat requirements`}</h2>
            <p>{'acquisition' in pokemon ? pokemon.acquisition : habitatText}</p>
            <p>
              This entry separates acquisition instructions from ordinary habitat arrivals. It only publishes the
              condition recorded by the reviewed references and does not add an unverified spawn window, food preference,
              weather rule, or encounter rate.
            </p>
          </section>

          <section>
            <h2>Type and specialty</h2>
            <dl className="pokedex-detail-facts">
              <div><dt>Type</dt><dd>{typeText}</dd></div>
              <div><dt>Specialty</dt><dd>{specialtyText}</dd></div>
              <div><dt>Habitat</dt><dd>{habitatText}</dd></div>
            </dl>
          </section>

          {'variants' in pokemon && pokemon.variants ? (
            <section>
              <h2>{pokemon.name} variants in Pokopia</h2>
              <div className="pokedex-detail-variants">
                {pokemon.variants.map((variant) => (
                  <div key={variant.name}>
                    <h3>{variant.name}</h3>
                    <p><strong>Specialty:</strong> {variant.specialties.join(', ')}</p>
                    <p><strong>Habitat:</strong> {variant.habitats.join('; ')}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {'field_notes' in pokemon && pokemon.field_notes ? (
            <section className="pokedex-detail-review-note">
              <h2>Review notes</h2>
              {Object.values(pokemon.field_notes).map((note) => <p key={note}>{note}</p>)}
            </section>
          ) : null}

          <section>
            <h2>Sources and verification</h2>
            <p>
              This record was reviewed on {pokedex.reviewed_at}. The listed fields were cross-checked against the
              community references below. They are independent references, not official Nintendo or Pokémon databases.
            </p>
            <ul>
              {pokedex.sources.map((source) => (
                <li key={source.id}><a href={source.url} rel="nofollow noopener noreferrer">{source.name}</a></li>
              ))}
            </ul>
            <p><Link href="/source-policy">Read the source policy</Link> or <Link href="/corrections">report a correction</Link>.</p>
          </section>
        </article>

        <aside className="pokedex-detail-related" aria-label="Related Pokédex entries">
          <h2>Continue browsing</h2>
          {previous ? <Link href={`/pokedex/${previous.slug}`}>← {previous.name}</Link> : null}
          {next ? <Link href={`/pokedex/${next.slug}`}>{next.name} →</Link> : null}
          <Link href={`/pokedex#${pokemon.slug}`}>View in the complete Pokédex</Link>
        </aside>
      </div>
    </main>
  )
}
