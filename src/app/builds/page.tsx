import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Community Builds | Pokopia Portal',
  description: 'Browse player-submitted Pokopia builds and strategies.',
  alternates: {
    canonical: canonicalUrl('/builds'),
  },
}

export default function BuildsPage() {
  return (
    <main>
      <h1>Community Builds</h1>
      <p>Player-submitted builds and strategies</p>
    </main>
  )
}
