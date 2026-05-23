import { Metadata } from 'next'
import guidesData from '@/data/guides.json'
import habitatsData from '@/data/habitats.json'
import pokemonData from '@/data/pokemon.json'
import recipesData from '@/data/recipes.json'
import { ArticleJsonLd, FAQJsonLd } from '@/components/seo/JsonLd'
import { canonicalUrl } from '@/lib/site'
import { CreditedImage } from '@/components/media/CreditedImage'
import { DataStatus } from '@/components/content/DataStatus'
import { OfficialContext } from '@/components/content/OfficialContext'

interface Props {
  params: Promise<{ slug: string }>
}

function metaDescription(text: string) {
  if (text.length <= 155) return text
  return `${text.slice(0, 152).trim()}...`
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
  const description = metaDescription(guide.answer || guide.seo_keyword)

  return {
    title: guide.title,
    description,
    openGraph: {
      title: guide.title,
      description,
      images: guide.image_source ? [guide.image_url] : ['/og-image.svg'],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description,
      images: guide.image_source ? [guide.image_url] : ['/og-image.svg'],
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

  const recipeIds = (guide.related_items || '').split(',').filter(Boolean)
  const relatedRecipes = recipesData.filter((r) => recipeIds.includes(r.id))
  const contentParagraphs = (guide.content || '').split('\n\n').filter(Boolean)
  const publishedAt = guide.published_at || guide.updated_at || new Date().toISOString()
  const updatedAt = guide.updated_at || guide.published_at || publishedAt

  return (
    <>
      <ArticleJsonLd
        title={guide.title}
        description={guide.answer || guide.seo_keyword}
        url={`/guides/${guide.slug}`}
        publishedAt={new Date(publishedAt).toISOString()}
        modifiedAt={new Date(updatedAt).toISOString()}
        type="Article"
      />
      {guide.faqs?.length > 0 && <FAQJsonLd title={guide.title} faqs={guide.faqs} />}
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <article>
          <span className={`badge ${guide.category}`}>{guide.category}</span>
          <h1 style={{ marginTop: '1rem' }}>{guide.title}</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>{guide.seo_keyword}</p>
          <p style={{ color: '#777', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Updated {new Date(updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <DataStatus
            status={guide.data_status}
            note={guide.data_status_note}
            updatedAt={new Date(updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          />
          <OfficialContext
            title="Official Baseline for This Guide"
            description="This guide contains editorial route advice. For confirmed Pokémon Pokopia systems, check the official-source pages first."
          />
          <CreditedImage src={guide.image_url} alt={guide.image_alt} source={guide.image_source} sourceUrl={guide.image_source_url} licenseNote={guide.image_license_note} className="article-cover" sizes="(max-width: 768px) 100vw, 800px" priority />

          <section style={{ marginTop: '2rem', lineHeight: '1.8' }}>
            <h2>Quick Answer</h2>
            <p>{guide.answer}</p>
          </section>

          <section style={{ marginTop: '2rem', lineHeight: '1.8' }}>
            <h2>Guide Overview</h2>
            {contentParagraphs.map((paragraph) => (
              <p key={paragraph} style={{ marginTop: '1rem' }}>{paragraph}</p>
            ))}
          </section>

          <section style={{ marginTop: '2rem', lineHeight: '1.8' }}>
            <h2>Step-by-Step Route</h2>
            <ol style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
              {guide.steps?.map((step) => (
                <li key={step} style={{ marginBottom: '0.75rem' }}>{step}</li>
              ))}
            </ol>
          </section>

          <section style={{ marginTop: '2rem', lineHeight: '1.8' }}>
            <h2>Recommended Setup</h2>
            <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
              {guide.recommended_setup?.map((item) => (
                <li key={item} style={{ marginBottom: '0.75rem' }}>{item}</li>
              ))}
            </ul>
          </section>

          <section style={{ marginTop: '2rem', lineHeight: '1.8' }}>
            <h2>Common Mistakes</h2>
            <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
              {guide.common_mistakes?.map((mistake) => (
                <li key={mistake} style={{ marginBottom: '0.75rem' }}>{mistake}</li>
              ))}
            </ul>
          </section>

          {guide.faqs?.length > 0 && (
            <section style={{ marginTop: '2rem', lineHeight: '1.8' }}>
              <h2>FAQ</h2>
              {guide.faqs.map((faq) => (
                <div key={faq.question} style={{ marginTop: '1rem' }}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </section>
          )}
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

          <h3 style={{ marginTop: '1.5rem' }}>Related Recipes</h3>
          {relatedRecipes.length > 0 ? (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {relatedRecipes.map((recipe) => (
                <a key={recipe.id} href={`/wiki/recipe/${recipe.id}`} className="card" style={{ padding: '0.5rem' }}>
                  {recipe.name}
                </a>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666' }}>No related recipes.</p>
          )}
        </aside>
      </main>
    </>
  )
}
