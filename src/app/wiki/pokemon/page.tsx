import type { Metadata } from 'next'
import pokemonData from '@/data/pokemon.json'
import { canonicalUrl } from '@/lib/site'
import { BreadcrumbJsonLd, ItemListJsonLd, FAQJsonLd } from '@/components/seo/JsonLd'
import PokemonClientPage from './PokemonClientPage'

const collectionFaqs = [
  {
    question: 'How many Pokemon are in Pokopia?',
    answer: `There are currently ${pokemonData.length} Pokemon across all habitats, types, and rarity tiers in the game.`,
  },
  {
    question: 'Does the collection checklist save my progress?',
    answer:
      'Yes — checked entries are stored in your browser\'s localStorage and will persist between sessions. Clearing browser data will reset the checklist.',
  },
  {
    question: 'Can I filter the collection list?',
    answer:
      'Yes. Use the filter row above the table to narrow down by type, rarity, specialty role, or habitat. You can also search by name or sort the list by any column.',
  },
  {
    question: 'How do I find legendary Pokemon?',
    answer:
      'Legendary Pokemon are marked in the rarity column. Each legendary entry links to its habitat page, where you can find the specific spawn conditions, time windows, and weather requirements.',
  },
]

export const metadata: Metadata = {
  title: 'Pokopia Collection List - All Pokemon Checklist | Pokopia Cloud',
  description:
    `Track your Pokopia collection with this complete Pokemon checklist. Check off all ${pokemonData.length} entries, filter by type, rarity, habitat, and specialty, and link directly to each habitat guide.`,
  keywords: [
    'pokopia collection list',
    'pokopia collection checklist',
    'pokopia all pokemon',
    'pokopia complete pokemon list',
    'pokopia pokemon database',
    'pokopia checklist',
    'pokemon collection list pokopia',
  ],
  openGraph: {
    title: 'Pokopia Collection List - All Pokemon Checklist',
    description:
      `Browse the complete ${pokemonData.length}-Pokemon Pokopia checklist. Track your collection, filter by type/rarity/habitat, and find where to catch each one.`,
    images: ['/og-image.svg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Collection List - All Pokemon Checklist',
    description:
      `Complete ${pokemonData.length}-Pokemon checklist for Pokopia. Filter by type, rarity, habitat. Progress saved automatically.`,
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
        name="Pokopia Collection List"
        description={`Complete checklist of all ${pokemonData.length} Pokemon in Pokopia — track your collection by type, rarity, habitat, and specialty.`}
        url="/wiki/pokemon"
        items={pokemonData.map((pokemon) => ({
          name: pokemon.name,
          url: `/wiki/pokemon/${pokemon.id}`,
        }))}
      />
      <FAQJsonLd title="Pokopia Collection List FAQ" faqs={collectionFaqs} />
      <PokemonClientPage />
    </main>
  )
}
