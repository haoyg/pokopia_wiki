import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Terms of Use | Pokopia Portal',
  description: 'Read the Pokopia Portal terms of use for site content, guides, tools, community submissions, and disclaimers.',
  alternates: {
    canonical: canonicalUrl('/terms'),
  },
}

export default function TermsPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', lineHeight: 1.8 }}>
      <article>
        <p style={{ color: '#666', fontSize: '0.875rem' }}>Last updated: May 23, 2026</p>
        <h1 style={{ marginTop: '0.5rem' }}>Terms of Use</h1>

        <p style={{ marginTop: '1.5rem' }}>
          By using Pokopia Portal, you agree to these terms. If you do not agree, please do not use the website.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Site Content</h2>
        <p>
          Pokopia Portal provides gaming guides, database pages, tools, news, and editorial content for informational and entertainment purposes. We try to keep information accurate, but game data, balance changes, events, and strategies may change over time.
        </p>

        <h2 style={{ marginTop: '2rem' }}>No Guaranteed Results</h2>
        <p>
          Guides, tier lists, farming routes, and team recommendations are based on available data and editorial judgment. Your in-game results may vary depending on account progress, updates, player choices, and future game changes.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Acceptable Use</h2>
        <p>
          Do not misuse the website, attempt to disrupt its operation, scrape content at abusive scale, submit harmful material, or use the site in a way that violates applicable laws or third-party rights.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Community Submissions</h2>
        <p>
          If community builds, comments, or submissions are enabled, you are responsible for the content you provide. We may edit, reject, or remove submissions for quality, safety, moderation, or legal reasons.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Intellectual Property</h2>
        <p>
          Pokopia Portal's original text, layouts, and site features are protected by applicable intellectual property laws. Game names, characters, and related marks belong to their respective owners. Pokopia Portal is an independent fan information site and is not officially affiliated with any game publisher unless stated otherwise.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Changes to These Terms</h2>
        <p>
          We may update these terms as the site grows. Continued use of the website after updates means you accept the revised terms.
        </p>

        <h2 style={{ marginTop: '2rem' }}>Contact</h2>
        <p>
          Questions about these terms can be sent to <a href="mailto:hello@pokopia.wiki">hello@pokopia.wiki</a>.
        </p>
      </article>
    </main>
  )
}
