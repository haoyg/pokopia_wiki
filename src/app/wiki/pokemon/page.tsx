import type { Metadata } from 'next'
import pokemonData from '@/data/pokemon.json'
import { canonicalUrl } from '@/lib/site'
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'
import PokemonClientPage from './PokemonClientPage'

export const metadata: Metadata = {
  title: 'Pokopia Collection List - Complete Pokémon Checklist | Pokopia Cloud',
  description:
    'Browse and filter the complete Pokopia Pokemon collection list. Track your progress, filter by type, rarity, habitat, and specialty. Every Pokemon with how-to-get instructions.',
  keywords: [
    'pokopia collection list',
    'pokopia collection checklist',
    'pokopia all pokemon',
    'pokopia complete pokemon list',
    'pokopia pokemon database',
  ],
  openGraph: {
    title: 'Pokopia Collection List - Complete Pokémon Checklist',
    description:
      'Browse and filter the complete Pokopia Pokemon collection list. Track your progress with filters by type, rarity, and habitat.',
    images: ['/og-image.svg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Collection List - Complete Pokémon Checklist',
    description:
      'Browse and filter the complete Pokopia Pokemon collection list. Track your progress with filters by type, rarity, and habitat.',
    images: ['/og-image.svg'],
  },
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
      <ItemListJsonLd
        name="Pokemon Database"
        description="Browse Pokopia Pokemon by type, rarity, habitat, favorite food, drops, and route role."
        url="/wiki/pokemon"
        items={pokemonData.map((pokemon) => ({
          name: pokemon.name,
          url: `/wiki/pokemon/${pokemon.id}`,
        }))}
      />
      <PokemonClientPage />
    </main>
  )
}
