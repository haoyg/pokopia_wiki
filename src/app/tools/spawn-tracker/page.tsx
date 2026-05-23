import { Metadata } from 'next'
import { SpawnTracker } from '@/components/tools/SpawnTracker'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Spawn Tracker',
  description: 'Track Pokopia Pokemon spawn conditions by habitat, weather, time, rarity, food, and drops.',
  openGraph: {
    title: 'Spawn Tracker',
    description: 'Track Pokemon spawn conditions by habitat, weather, time, rarity, food, and drops.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/tools/spawn-tracker'),
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
