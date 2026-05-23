import { Suspense } from 'react'
import { Metadata } from 'next'
import { SearchClient } from '@/components/search/SearchClient'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search Pokopia news, guides, Pokemon, habitats, recipes, and tools.',
  alternates: {
    canonical: canonicalUrl('/search'),
  },
}

export default function SearchPage() {
  return (
    <main className="page-shell">
      <section className="page-hero">
        <h1>Search Pokopia Portal</h1>
        <p>Find guides, news, Pokemon data, habitats, recipes, and strategy references.</p>
      </section>

      <Suspense fallback={<div className="empty-state">Loading search...</div>}>
        <SearchClient />
      </Suspense>
    </main>
  )
}
