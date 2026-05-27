import { Metadata } from 'next'
import guidesData from '@/data/guides.json'
import habitatsData from '@/data/habitats.json'
import pokemonData from '@/data/pokemon.json'
import recipesData from '@/data/recipes.json'
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/JsonLd'
import { canonicalUrl } from '@/lib/site'
import { cleanDescription, cleanTitle } from '@/lib/seoText'
import { CreditedImage } from '@/components/media/CreditedImage'
import { DataStatus } from '@/components/content/DataStatus'
import { OfficialContext } from '@/components/content/OfficialContext'

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
  const title = cleanTitle(guide.title)
  const description = cleanDescription(guide.answer || guide.seo_keyword)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: guide.image_source ? [guide.image_url] : ['/og-image.svg'],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
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
        image={guide.image_source ? guide.image_url : undefined}
        type="Article"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Guides', url: '/guides' },
          { name: guide.title, url: `/guides/${guide.slug}` },
        ]}
      />
      {guide.faqs?.length > 0 && <FAQJsonLd title={guide.title} faqs={guide.faqs} />}
      <main>
        <article className="guide-detail-page">
          <div className="guide-detail-hero">
            <div className="guide-hero-copy">
              <div className="index-card-badges">
                <span className={`badge ${guide.category}`}>{guide.category}</span>
              </div>
              <h1>{guide.title}</h1>
              <p>{guide.answer}</p>
              <div className="guide-meta-row">
                <span>{guide.seo_keyword}</span>
                <span>{guide.steps?.length || 0} route checks</span>
                <span>Updated {new Date(updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <DataStatus
                status={guide.data_status}
                note={guide.data_status_note}
                updatedAt={new Date(updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              />
              <OfficialContext
                title="Official Baseline for This Guide"
                description="This guide contains editorial route advice. For confirmed Pokémon Pokopia systems, check the official-source pages first."
              />
            </div>
            <CreditedImage src={guide.image_url} alt={guide.image_alt} source={guide.image_source} sourceUrl={guide.image_source_url} licenseNote={guide.image_license_note} originalMedia={guide.image_original_media} className="guide-hero-cover" sizes="(max-width: 768px) 100vw, 420px" priority />
          </div>

          <section className="guide-answer-panel">
            <span className="panel-kicker">Quick Answer</span>
            <p>{guide.answer}</p>
          </section>

          <section className="guide-content-section">
            <h2>Guide Overview</h2>
            {contentParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          <section className="guide-route-section">
            <div className="section-title-row">
              <div>
                <span className="panel-kicker">Route Checklist</span>
                <h2>Step-by-Step Route</h2>
              </div>
            </div>
            <ol>
              {guide.steps?.map((step, index) => (
                <li key={step}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="guide-content-section">
            <h2>Recommended Setup</h2>
            <ul>
              {guide.recommended_setup?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="guide-content-section">
            <h2>Common Mistakes</h2>
            <ul>
              {guide.common_mistakes?.map((mistake) => (
                <li key={mistake}>{mistake}</li>
              ))}
            </ul>
          </section>

          {guide.faqs?.length > 0 && (
            <section className="guide-content-section pokemon-faq-list">
              <h2>FAQ</h2>
              {guide.faqs.map((faq) => (
                <div key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </section>
          )}
        </article>

        <aside className="related-content-panel">
          <div className="section-title-row">
            <div>
              <span className="panel-kicker">Continue Planning</span>
              <h2>Related Route Notes</h2>
            </div>
            <a href="/guides">All guides</a>
          </div>
          <div className="related-content-grid">
            {relatedPokemon.map((p) => (
              <a key={p.id} href={`/wiki/pokemon/${p.id}`} className="related-content-card">
                <span>Pokemon</span>
                <strong>{p.name}</strong>
                <p>{p.type} · {p.specialty} · {p.rarity}</p>
                <small>Food: {p.favorite_food}</small>
              </a>
            ))}
            {relatedHabitats.map((h) => (
              <a key={h.id} href={`/wiki/habitat/${h.id}`} className="related-content-card">
                <span>Habitat</span>
                <strong>{h.name}</strong>
                <p>{h.weather} · {h.resource_bonus}</p>
                <small>{h.difficulty} route</small>
              </a>
            ))}
            {relatedRecipes.map((recipe) => (
              <a key={recipe.id} href={`/wiki/recipe/${recipe.id}`} className="related-content-card">
                <span>Recipe</span>
                <strong>{recipe.name}</strong>
                <p>{recipe.buff} · {recipe.effect_duration}</p>
                <small>{recipe.best_use}</small>
              </a>
            ))}
          </div>
        </aside>
      </main>
    </>
  )
}
