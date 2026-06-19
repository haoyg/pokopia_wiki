import type { Metadata } from 'next'
import { canonicalUrl, BASE_URL } from '@/lib/site'
import { JsonLd } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'About Pokopia Portal',
  description: 'Learn about Pokopia Portal, an independent gaming wiki and guide site for Pokopia players.',
  alternates: {
    canonical: canonicalUrl('/about'),
  },
}

export default function AboutPage() {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Pokopia Portal',
    url: BASE_URL,
    description: 'Independent gaming content site for Pokopia players — guides, wiki data, tools, news, tier lists, and build recommendations.',
    email: 'hello@pokopia.cloud',
    sameAs: [],
  }

  return (
    <>
      <JsonLd data={orgJsonLd} />
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', lineHeight: 1.8 }}>
        <article>
          <h1>About Pokopia Portal</h1>
          <p style={{ marginTop: '1rem' }}>
            Pokopia Portal is an independent gaming content site built to help players understand Pokopia through structured guides, wiki data, tools, news, tier lists, and build recommendations.
          </p>

          <h2 style={{ marginTop: '2rem' }}>Our Goal</h2>
          <p>
            The goal is to make every important player question easy to answer: where to farm a Pokemon, how to unlock a habitat, which recipe to use, how to build a team, and what content to prioritize next.
          </p>

          <h2 style={{ marginTop: '2rem' }}>Editorial Approach</h2>
          <p>
            We organize content around structured data first. Pokemon, habitats, recipes, guides, news, and tools are connected through internal links so players can move from one answer to the next without losing context.
          </p>

          <h2 style={{ marginTop: '2rem' }}>Independence</h2>
          <p>
            Pokopia Portal is a fan-oriented information website. Unless explicitly stated, it is not officially affiliated with, endorsed by, or sponsored by any game publisher or rights holder. All game-related names and marks belong to their respective owners.
          </p>

          <h2 style={{ marginTop: '2rem' }}>Unofficial Fan Resource</h2>
          <p>
            This site is not an official Nintendo, The Pokemon Company, Game Freak, or Creatures Inc. website. We publish guides, data summaries, and editorial notes to help players research routes, teams, recipes, and habitats.
          </p>

          <h2 style={{ marginTop: '2rem' }}>Image and Source Policy</h2>
          <p>
            We try to label images with their source near the image or on the related page. If a source needs correction or a rights holder requests removal, please contact us through the copyright removal process.
          </p>

          <h2 style={{ marginTop: '2rem' }}>Contact</h2>
          <p>
            To suggest a correction, request a new guide, or report a rights concern, contact <a href="mailto:hello@pokopia.cloud">hello@pokopia.cloud</a>. You can also read our <a href="/disclaimer">disclaimer</a> and <a href="/copyright">copyright removal policy</a>.
          </p>
        </article>
      </main>
    </>
  )
}
