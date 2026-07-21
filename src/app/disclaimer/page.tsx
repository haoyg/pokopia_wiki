import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Disclaimer for Pokopia Portal, an unofficial fan guide and wiki site for Pokopia players.',
  alternates: {
    canonical: canonicalUrl('/disclaimer'),
  },
}

export default function DisclaimerPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', lineHeight: 1.8 }}>
      <article>
        <h1>Disclaimer</h1>
        <p style={{ marginTop: '1rem' }}>
          Pokopia Portal is an unofficial fan-made guide, wiki, and news resource for players. The site is created for informational and editorial purposes.
        </p>

        <h2 style={{ marginTop: '2rem' }}>No Official Affiliation</h2>
        <p>
          Pokopia Portal is not affiliated with, endorsed by, sponsored by, or officially connected to Nintendo, The Pokemon Company, Game Freak, Creatures Inc., or any other rights holder unless clearly stated.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Game Information</h2>
        <p>
          Guides, data, tier lists, tools, and recommendations may change as the game changes. We aim to keep content useful and updated, but we cannot guarantee that every stat, route, spawn note, or strategy is always current.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Trademarks</h2>
        <p>
          Pokemon, Pokopia, Nintendo, and related names, characters, logos, and marks are trademarks or property of their respective owners. All rights remain with those owners.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Images and Media</h2>
        <p>
          Source attribution does not grant permission to republish media. Pokopia Portal displays media only when its usage basis is documented as site-owned, licensed, openly licensed, or public domain. Assets awaiting rights review remain hidden.
        </p>
      </article>
    </main>
  )
}
