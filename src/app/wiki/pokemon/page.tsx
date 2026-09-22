import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { noIndexMetadata } from '@/lib/indexing'

export const metadata: Metadata = {
  title: 'Pokopia Pokemon Database — Verification in Progress',
  description: 'Pokopia Pokemon records are being rebuilt from cited official and community evidence.',
  keywords: [
    'pokopia collection list',
    'pokopia collection checklist',
    'pokopia all pokemon',
    'pokopia complete pokemon list',
    'pokopia pokemon database',
    'pokopia checklist',
    'pokemon collection list pokopia',
  ],
  robots: noIndexMetadata,
  alternates: {
    canonical: canonicalUrl('/wiki/pokemon'),
  },
}

export default function PokemonPage() {
  return (
    <main className="page-shell">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Pokemon Database', url: '/wiki/pokemon' },
        ]}
      />
      <section className="page-hero">
        <h1>Pokopia Pokemon Database</h1>
        <p>The previous records have been removed from search while each name, habitat, food, spawn window, and drop is re-verified against cited evidence.</p>
      </section>
      <section className="wiki-panel">
        <div className="wiki-panel-title"><h2>Verification in progress</h2></div>
        <p>No database entry will return to the public index until it has an explicit verification status, a review date, and at least one accessible source URL.</p>
        <p><a href="/official">Browse confirmed official information</a> or <a href="/source-policy">read the source policy</a>.</p>
      </section>
    </main>
  )
}
