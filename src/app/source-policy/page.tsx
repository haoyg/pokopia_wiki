import type { Metadata } from 'next'
import Link from 'next/link'
import { DataStatus } from '@/components/content/DataStatus'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { BASE_URL, canonicalUrl } from '@/lib/site'

const pageUrl = '/source-policy'
const reviewedAt = '2026-07-21'

export const metadata: Metadata = {
  title: 'Source Policy',
  description: 'How Pokopia Portal ranks official sources, third-party references, screenshots, submissions, and unsupported claims.',
  alternates: {
    canonical: canonicalUrl(pageUrl),
  },
  openGraph: {
    title: 'Source Policy',
    description: 'How Pokopia Portal ranks official sources, third-party references, screenshots, submissions, and unsupported claims.',
    images: ['/og-image.svg'],
    type: 'article',
  },
}

export default function SourcePolicyPage() {
  return (
    <main className="topic-page page-shell">
      <ArticleJsonLd
        title="Source Policy"
        description="How Pokopia Portal ranks official sources, third-party references, screenshots, submissions, and unsupported claims."
        url={pageUrl}
        publishedAt={reviewedAt}
        modifiedAt={reviewedAt}
        image={`${BASE_URL}/og-image.svg`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
          { name: 'Source Policy', url: pageUrl },
        ]}
      />

      <header className="topic-hero">
        <Link href="/about" className="back-link">Back to About</Link>
        <div style={{ marginTop: '1rem' }}>
          <span className="badge source-roundup">Source Standards</span>
        </div>
        <h1>Source Policy</h1>
        <p>
          This policy explains which sources Pokopia Portal relies on first, how uncertain information is labeled, and what evidence is not enough for indexed pages.
        </p>
      </header>

      <DataStatus
        status="Source standards page"
        note="Source priority affects page labels, sitemap inclusion, search index inclusion, and how strongly a page can state a gameplay claim."
        updatedAt="July 21, 2026"
      />

      <section className="guide-content-section">
        <h2>Source Priority</h2>
        <p>
          Official publisher, platform, game site, press release, trailer, product page, and verified social sources are treated as primary references. Store pages and official support pages can support release, platform, price, language, and feature details. Third-party articles can add context, but they do not replace primary sources when a factual claim is available from an official source.
        </p>
      </section>

      <section className="guide-content-section">
        <h2>Unconfirmed Information</h2>
        <p>
          Rumors, leaks, unattributed reposts, forum speculation, and unsupported social posts are not used as confirmed facts. If a topic is useful but uncertain, the page must label the uncertainty and avoid presenting it as official gameplay data.
        </p>
      </section>

      <section className="guide-content-section">
        <h2>Images and Media</h2>
        <p>
          Source attribution and reuse permission are separate requirements. Every media record must identify its source and carry a reviewed rights status. A source URL alone is not evidence that an image may be republished on an ad-supported site.
        </p>
        <p>
          Media is rendered only when its usage basis is documented as site-owned original work, licensed use, an applicable open license, or public domain. Official publisher assets and third-party reposts remain withheld unless permission for this use is documented. Player screenshots require permission and should be labeled as player-submitted media. AI-generated images are not used as official news screenshots or official gameplay images.
        </p>
      </section>

      <section className="guide-content-section">
        <h2>Player Submissions</h2>
        <p>
          Community builds, screenshots, and route notes need permission, source credit, and enough context for readers to understand what is original player advice. Submissions are not treated as official information.
        </p>
      </section>

      <section className="guide-content-section">
        <h2>Related Policies</h2>
        <div className="topic-hero-actions">
          <a href="/official">Official info hub</a>
          <a href="/editorial-policy">Editorial policy</a>
          <a href="/corrections">Corrections</a>
        </div>
      </section>
    </main>
  )
}
