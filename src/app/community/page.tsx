import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Community | Pokopia Portal',
  description: 'Join the Pokopia community for guides, builds, and strategy discussion.',
  alternates: {
    canonical: canonicalUrl('/community'),
  },
}

export default function CommunityPage() {
  return (
    <main>
      <h1>Community</h1>
      <p>Join the Pokopia community</p>
    </main>
  )
}
