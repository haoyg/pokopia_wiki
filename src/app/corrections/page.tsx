import type { Metadata } from 'next'
import Link from 'next/link'
import { DataStatus } from '@/components/content/DataStatus'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { BASE_URL, canonicalUrl } from '@/lib/site'

const pageUrl = '/corrections'
const reviewedAt = '2026-07-11'

export const metadata: Metadata = {
  title: 'Corrections',
  description: 'How to report outdated Pokopia Portal information, source issues, image attribution problems, and unclear guide advice.',
  alternates: {
    canonical: canonicalUrl(pageUrl),
  },
  openGraph: {
    title: 'Corrections',
    description: 'How to report outdated Pokopia Portal information, source issues, image attribution problems, and unclear guide advice.',
    images: ['/og-image.svg'],
    type: 'article',
  },
}

export default function CorrectionsPage() {
  return (
    <main className="topic-page page-shell">
      <ArticleJsonLd
        title="Corrections"
        description="How to report outdated Pokopia Portal information, source issues, image attribution problems, and unclear guide advice."
        url={pageUrl}
        publishedAt={reviewedAt}
        modifiedAt={reviewedAt}
        image={`${BASE_URL}/og-image.svg`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
          { name: 'Corrections', url: pageUrl },
        ]}
      />

      <header className="topic-hero">
        <Link href="/about" className="back-link">Back to About</Link>
        <div style={{ marginTop: '1rem' }}>
          <span className="badge source-roundup">Corrections</span>
        </div>
        <h1>Corrections</h1>
        <p>
          Readers can report outdated information, missing source context, unclear guide wording, image attribution issues, and rights concerns for editorial review.
        </p>
      </header>

      <DataStatus
        status="Correction process page"
        note="Corrections that affect official facts, rights, image attribution, reader safety, or indexed page quality are reviewed first."
        updatedAt="July 11, 2026"
      />

      <section className="guide-content-section">
        <h2>How to Report an Issue</h2>
        <p>
          Email <a href="mailto:hello@pokopia.cloud">hello@pokopia.cloud</a> with the page URL, the sentence or image that needs review, the source or evidence you are using, and the correction you suggest. If the issue is about rights or attribution, include your relationship to the rights holder.
        </p>
      </section>

      <section className="guide-content-section">
        <h2>What We Prioritize</h2>
        <p>
          We review official fact errors, outdated release or platform details, misleading source labels, missing image credits, copyright concerns, and pages that should be noindex before minor wording requests or new guide ideas.
        </p>
      </section>

      <section className="guide-content-section">
        <h2>How Corrections Are Applied</h2>
        <p>
          A correction can update the page text, add a source note, change the page status, adjust internal links, remove media, add a noindex directive, or remove the page from the sitemap and search index until the page is ready for review again.
        </p>
      </section>

      <section className="guide-content-section">
        <h2>When Evidence Is Needed</h2>
        <p>
          Gameplay claims, source disputes, and image ownership requests need enough detail for review. For official claims, a primary source link is preferred. For player-created material, permission and attribution details are required.
        </p>
      </section>

      <section className="guide-content-section">
        <h2>Related Policies</h2>
        <div className="topic-hero-actions">
          <a href="/contact">Contact</a>
          <a href="/source-policy">Source policy</a>
          <a href="/editorial-policy">Editorial policy</a>
        </div>
      </section>
    </main>
  )
}
