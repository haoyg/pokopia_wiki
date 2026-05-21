import { Metadata } from 'next'
import { SpawnTracker } from '@/components/tools/SpawnTracker'

export const metadata: Metadata = {
  title: 'Spawn Tracker | Pokopia Portal',
  description: 'Track Pokopia Pokemon spawn conditions by habitat, weather, time, rarity, food, and drops.',
  openGraph: {
    title: 'Spawn Tracker | Pokopia Portal',
    description: 'Track Pokemon spawn conditions by habitat, weather, time, rarity, food, and drops.',
    images: ['/og-image.svg'],
  },
}

export default function SpawnTrackerPage() {
  return (
    <main className="page-shell">
      <section className="page-hero">
        <h1>Spawn Tracker</h1>
        <p>Filter current database entries by habitat, weather, time, rarity, food, drops, and type.</p>
      </section>

      <SpawnTracker />
    </main>
  )
}
