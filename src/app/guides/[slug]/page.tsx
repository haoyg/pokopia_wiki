'use client'

import { useEffect, useState } from 'react'

interface Guide {
  id: string
  title: string
  slug: string
  category: string
  seo_keyword: string
  content: string
  related_pokemon: string
  related_items: string
  related_habitats: string
}

interface RelatedItem {
  id: string
  name: string
  type?: string
}

export default function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const [guide, setGuide] = useState<Guide | null>(null)
  const [relatedPokemon, setRelatedPokemon] = useState<RelatedItem[]>([])
  const [relatedHabitats, setRelatedHabitats] = useState<RelatedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string>('')

  useEffect(() => {
    params.then((p) => setSlug(p.slug))
  }, [params])

  useEffect(() => {
    if (!slug) return

    Promise.all([
      fetch(`/api/guides/${slug}`),
      fetch('/api/pokemon'),
      fetch('/api/habitats'),
    ])
      .then(([guideRes, pokeRes, habRes]) =>
        Promise.all([guideRes.json(), pokeRes.json(), habRes.json()])
      )
      .then(([guideData, pokeData, habData]) => {
        setGuide(guideData)
        if (guideData.title) document.title = `${guideData.title} | Pokopia Portal`
        // Related Pokemon
        const pokeIds = (guideData.related_pokemon || '').split(',').filter(Boolean)
        const relatedPoke = pokeData.filter((p: any) => pokeIds.includes(p.id))
        setRelatedPokemon(relatedPoke)
        // Related Habitats
        const habIds = (guideData.related_habitats || '').split(',').filter(Boolean)
        const relatedHab = habData.filter((h: any) => habIds.includes(h.id))
        setRelatedHabitats(relatedHab)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) return <p>Loading...</p>
  if (!guide) return <p>Guide not found</p>

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header>
        <nav>
          <a href="/">Home</a>
          <a href="/guides">Guides</a>
        </nav>
      </header>

      <article style={{ marginTop: '2rem' }}>
        <span className={`badge ${guide.category}`}>{guide.category}</span>
        <h1 style={{ marginTop: '1rem' }}>{guide.title}</h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>{guide.seo_keyword}</p>
        <div style={{ marginTop: '2rem', lineHeight: '1.8' }}>{guide.content}</div>
      </article>

      <aside style={{ marginTop: '3rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Related Pokémon</h3>
        {relatedPokemon.length > 0 ? (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {relatedPokemon.map((p) => (
              <a key={p.id} href={`/wiki/pokemon/${p.id}`} className="card" style={{ padding: '0.5rem' }}>
                {p.name}
              </a>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666' }}>No related Pokémon.</p>
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
  )
}
