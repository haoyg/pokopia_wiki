import type { Metadata } from 'next'
import Link from 'next/link'
import pokemonData from '@/data/pokemon.json'
import habitatsData from '@/data/habitats.json'
import { canonicalUrl } from '@/lib/site'
import { noIndexMetadata } from '@/lib/indexing'
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'
import { CreditedImage } from '@/components/media/CreditedImage'
import { DataStatus } from '@/components/content/DataStatus'
import { pokemonImage } from '@/lib/localImages'

const ALL_TYPES = ['Bug', 'Crystal', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice', 'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water']
const ALL_SPECIALTIES = ['Assassin', 'Attacker', 'Defender', 'Speedster', 'Support', 'Tank']
const ALL_RARITIES = ['common', 'uncommon', 'rare', 'legendary']

const ALL_TAGS = [...ALL_TYPES, ...ALL_SPECIALTIES, ...ALL_RARITIES]

const habitatNames = Object.fromEntries(habitatsData.map((h) => [h.id, h.name]))

function shortText(text: string, length = 135) {
  if (text.length <= length) return text
  return `${text.slice(0, length).trim()}...`
}

type PageProps = {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  return ALL_TAGS.map((tag) => ({ tag }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params
  const title = `Pokopia ${tag} Pokemon – Complete ${tag} Type/Rarity/Role List | Pokopia Cloud`
  const description = `Browse all Pokopia ${tag} Pokemon with this complete reference. Filter by habitat, rarity, and specialty role.`
  const keywords = [tag, `pokopia ${tag}`, `pokopia ${tag.toLowerCase()} pokemon`]

  const isType = ALL_TYPES.includes(tag)
  const isSpecialty = ALL_SPECIALTIES.includes(tag)
  const isRarity = ALL_RARITIES.includes(tag)

  return {
    title,
    description,
    keywords,
    alternates: { canonical: canonicalUrl(`/tags/${tag}`) },
    ...(isType || isSpecialty || isRarity ? {} : noIndexMetadata),
  }
}

function filterPokemonByTag(tag: string) {
  if (ALL_TYPES.includes(tag)) {
    return pokemonData.filter((p) => p.type.split('/').includes(tag))
  }
  if (ALL_SPECIALTIES.includes(tag)) {
    return pokemonData.filter((p) => p.specialty === tag)
  }
  if (ALL_RARITIES.includes(tag)) {
    return pokemonData.filter((p) => p.rarity === tag)
  }
  return []
}

function getTagCategory(tag: string): string {
  if (ALL_TYPES.includes(tag)) return 'Type'
  if (ALL_SPECIALTIES.includes(tag)) return 'Specialty'
  if (ALL_RARITIES.includes(tag)) return 'Rarity'
  return 'Tag'
}

function getRelatedTags(tag: string) {
  const related: { tag: string; category: string }[] = []
  if (ALL_TYPES.includes(tag)) {
    ALL_TYPES.forEach((t) => { if (t !== tag) related.push({ tag: t, category: 'Type' }) })
  } else if (ALL_SPECIALTIES.includes(tag)) {
    ALL_SPECIALTIES.forEach((s) => { if (s !== tag) related.push({ tag: s, category: 'Specialty' }) })
  } else if (ALL_RARITIES.includes(tag)) {
    ALL_RARITIES.forEach((r) => { if (r !== tag) related.push({ tag: r, category: 'Rarity' }) })
  }
  return related.slice(0, 12)
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params
  const filtered = filterPokemonByTag(tag)
  const category = getTagCategory(tag)
  const relatedTags = getRelatedTags(tag)

  const validTag = ALL_TAGS.includes(tag)

  if (!validTag) {
    return (
      <main className="page-shell">
        <section className="page-hero">
          <h1>Tag Not Found</h1>
          <p>The tag "{tag}" is not a valid type, specialty, or rarity.</p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/wiki/pokemon">Browse all Pokemon</Link>
            <Link href="/tags">Browse all tags</Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tags', url: '/tags' },
          { name: tag, url: `/tags/${tag}` },
        ]}
      />

      <ItemListJsonLd
        name={`Pokopia ${tag} Pokemon`}
        description={`All Pokopia Pokemon tagged with ${tag} (${category.toLowerCase()})`}
        url={`/tags/${tag}`}
        items={filtered.map((p) => ({
          name: p.name,
          url: `/wiki/pokemon/${p.id}`,
        }))}
      />

      <section className="page-hero">
        <h1>Pokopia {tag} Pokemon</h1>
        <p>
          {filtered.length === 0
            ? `No Pokemon found for ${tag}.`
            : `Showing ${filtered.length} ${category.toLowerCase()} ${filtered.length === 1 ? 'Pokemon' : 'Pokemon'} tagged "${tag}" — browse by ${category.toLowerCase()}, filter by habitat, or explore related ${category.toLowerCase()} tags below.`}
        </p>
      </section>

      <DataStatus
        status="Unverified editorial database"
        note="These entries are editorial planning data, not official or confirmed Pokemon records. Credited promotional images identify their media sources only and do not depict or verify the named entries or their gameplay claims."
        updatedAt="July 21, 2026"
        showPolicyLink
      />

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            No Pokemon match the tag <strong>{tag}</strong>. This may be a placeholder tag in the database.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/wiki/pokemon">Browse all Pokemon</Link>
            <Link href="/tools/spawn-tracker">Open Spawn Tracker</Link>
            <Link href="/tags">Browse all tags</Link>
          </div>
        </div>
      ) : (
        <div className="pokemon-grid">
          {filtered.map((p) => (
            <Link key={p.id} href={`/wiki/pokemon/${p.id}`} className="card">
              <CreditedImage
                src={p.image_url}
                alt={p.image_alt || p.type}
                source={p.image_source}
                sourceUrl={p.image_source_url}
                licenseNote={p.image_license_note}
                originalMedia={p.image_original_media}
                rightsStatus={p.image_rights_status}
                className="card-cover pokemon-cover"
                sizes="(max-width: 768px) 100px, 200px"
                creditLink={false}
                fallbackSrc={pokemonImage(p.name)}
                fallbackAlt={`${p.name} Pokemon illustration`}
              />
              <h3 className="index-card-title index-card-title-center">{p.name}</h3>
              <p className="index-card-meta">{p.type}</p>
              <p className="index-card-submeta">{p.specialty} · {habitatNames[p.habitat] || p.habitat}</p>
              <p className="index-card-summary">{shortText(p.overview, 135)}</p>
              <dl className="index-card-facts">
                <div>
                  <dt>Food</dt>
                  <dd>{p.favorite_food}</dd>
                </div>
                <div>
                  <dt>Window</dt>
                  <dd>{p.spawn_time} / {p.weather}</dd>
                </div>
                <div>
                  <dt>Drops</dt>
                  <dd>{p.drops}</dd>
                </div>
              </dl>
              <div className="index-card-badges index-card-badges-center">
                <span className={`rarity ${p.rarity}`}>{p.rarity}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {relatedTags.length > 0 && (
        <section style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Related {category} Tags</h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {relatedTags.map((rt) => (
              <Link
                key={rt.tag}
                href={`/tags/${rt.tag}`}
                style={{
                  display: 'inline-block',
                  padding: '0.35rem 0.85rem',
                  background: '#f0f4f8',
                  borderRadius: '4px',
                  color: '#333',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                }}
              >
                {rt.tag}
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
