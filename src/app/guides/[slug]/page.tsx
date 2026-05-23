import { Metadata } from 'next'
import Image from 'next/image'
import guidesData from '@/data/guides.json'
import habitatsData from '@/data/habitats.json'
import pokemonData from '@/data/pokemon.json'
import { ArticleJsonLd } from '@/components/seo/JsonLd'
import { canonicalUrl } from '@/lib/site'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return guidesData.map((guide) => ({
    slug: guide.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guide = guidesData.find((g) => g.slug === slug)
  if (!guide) return { title: 'Guide Not Found' }

  return {
    title: `${guide.title} | Pokopia Portal`,
    description: guide.seo_keyword,
    openGraph: {
      title: guide.title,
      description: guide.seo_keyword,
      images: [guide.image_url],
      type: 'article',
    },
    alternates: {
      canonical: canonicalUrl(`/guides/${guide.slug}`),
    },
  }
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params
  const guide = guidesData.find((g) => g.slug === slug)

  if (!guide) {
    return <p>Guide not found</p>
  }

  const pokeIds = (guide.related_pokemon || '').split(',').filter(Boolean)
  const relatedPokemon = pokemonData.filter((p) => pokeIds.includes(p.id))

  const habIds = (guide.related_habitats || '').split(',').filter(Boolean)
  const relatedHabitats = habitatsData.filter((h) => habIds.includes(h.id))

  return (
    <>
      <ArticleJsonLd
        title={guide.title}
        description={guide.seo_keyword}
        url={`/guides/${guide.slug}`}
        publishedAt={new Date().toISOString()}
        type="Article"
      />
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <article>
          <span className={`badge ${guide.category}`}>{guide.category}</span>
          <h1 style={{ marginTop: '1rem' }}>{guide.title}</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>{guide.seo_keyword}</p>
          <div className="article-cover">
            <Image src={guide.image_url} alt={guide.image_alt} fill sizes="(max-width: 768px) 100vw, 800px" priority />
          </div>
          <div style={{ marginTop: '2rem', lineHeight: '1.8' }}>{guide.content}</div>
        </article>

        <aside style={{ marginTop: '3rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <h3>Related Pokemon</h3>
          {relatedPokemon.length > 0 ? (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {relatedPokemon.map((p) => (
                <a key={p.id} href={`/wiki/pokemon/${p.id}`} className="card" style={{ padding: '0.5rem' }}>
                  {p.name}
                </a>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666' }}>No related Pokemon.</p>
          )}

          <h3 style={{ marginTop: '1.5rem' }}>Related Habitats</h3>
          {relatedHabitats.length > 0 ? (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {relatedHabitats.map((h) => (
                <a key={h.id} href={`/wiki/habitat/${h.id}`} className="card" style={{ padding: '0.5rem' }}>
                  {h.name}
                </a>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666' }}>No related habitats.</p>
          )}
        </aside>
      </main>
    </>
  )
}
