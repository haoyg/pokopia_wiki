import { Metadata } from 'next'
import { SpawnTracker } from '@/components/tools/SpawnTracker'
import { ToolJsonLd } from '@/components/seo/JsonLd'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Pokopia Spawn Tracker - Habitat, Weather, Time, Food, and Drops',
  description: 'Track Pokopia Pokemon spawn conditions by habitat, weather, time, rarity, food, drops, type, and related route pages.',
  openGraph: {
    title: 'Pokopia Spawn Tracker - Habitat, Weather, Time, Food, and Drops',
    description: 'Track Pokopia Pokemon spawn conditions by habitat, weather, time, rarity, food, drops, type, and related route pages.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/tools/spawn-tracker'),
  },
}

const spawnUseCases = [
  {
    title: 'Find a target route',
    text: 'Search by Pokemon name, type, food, or drop, then open the linked habitat page to check weather and route difficulty.',
  },
  {
    title: 'Compare rare targets',
    text: 'Filter by rarity before choosing a recipe or farming loop. This helps avoid spending a rare buff on a route with too few useful checks.',
  },
  {
    title: 'Check weather timing',
    text: 'Use the weather and time filters together when a route only makes sense under specific spawn conditions.',
  },
]

export default function SpawnTrackerPage() {
  return (
    <main className="page-shell">
      <ToolJsonLd
        name="Pokopia Spawn Tracker"
        description="Interactive Pokopia spawn tracking tool for filtering Pokemon by habitat, weather, time, rarity, food, drops, and type."
        url="/tools/spawn-tracker"
        featureList={[
          'Search Pokemon spawn records',
          'Filter by habitat, weather, time, and rarity',
          'Review food and drop data',
          'Open related Pokemon and habitat pages',
        ]}
      />
      <section className="page-hero">
        <h1>Spawn Tracker</h1>
        <p>Filter current database entries by habitat, weather, time, rarity, food, drops, and type.</p>
      </section>

      <SpawnTracker />

      <section className="tool-guide-grid" aria-label="Spawn tracker use cases">
        {spawnUseCases.map((item) => (
          <div key={item.title} className="tool-guide-card">
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </div>
        ))}
      </section>

      <section className="tool-next-steps">
        <h2>How to use spawn results</h2>
        <p>
          Treat the table as a shortlist. Open the Pokemon page for food, drops, and role context,
          then open the habitat page to confirm whether the route fits your team and recipe timing.
        </p>
        <div>
          <a href="/wiki/pokemon">Browse Pokemon</a>
          <a href="/wiki/habitat">Browse habitats</a>
          <a href="/tools/habitat-planner">Plan habitat route</a>
          <a href="/tools/recipe-calculator">Compare recipe support</a>
        </div>
      </section>
    </main>
  )
}
