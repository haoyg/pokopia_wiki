import type { Metadata } from 'next'
import Link from 'next/link'
import { DataStatus } from '@/components/content/DataStatus'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { BASE_URL, canonicalUrl } from '@/lib/site'

const pageUrl = '/editorial-policy'
const reviewedAt = '2026-07-11'

export const metadata: Metadata = {
  title: 'Editorial Policy',
  description: 'How Pokopia Portal reviews source-backed pages, guide advice, future content, AI drafts, and corrections.',
  alternates: {
    canonical: canonicalUrl(pageUrl),
  },
  openGraph: {
    title: 'Editorial Policy',
    description: 'How Pokopia Portal reviews source-backed pages, guide advice, future content, AI drafts, and corrections.',
    images: ['/og-image.svg'],
    type: 'article',
  },
}

export default function EditorialPolicyPage() {
  return (
    <main className="topic-page page-shell">
      <ArticleJsonLd
        title="Editorial Policy"
        description="How Pokopia Portal reviews source-backed pages, guide advice, future content, AI drafts, and corrections."
        url={pageUrl}
        publishedAt={reviewedAt}
        modifiedAt={reviewedAt}
        image={`${BASE_URL}/og-image.svg`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' },
          { name: 'Editorial Policy', url: pageUrl },
        ]}
      />

      <header className="topic-hero">
        <Link href="/about" className="back-link">Back to About</Link>
        <div style={{ marginTop: '1rem' }}>
          <span className="badge source-roundup">Trust Policy</span>
        </div>
        <h1>Editorial Policy</h1>
        <p>
          Pokopia Portal separates confirmed source information from player advice, database notes, and future content drafts so readers can understand what each page is based on.
        </p>
      </header>

      <DataStatus
        status="Review process page"
        note="This policy explains how pages are selected, reviewed, labeled, updated, and corrected before they are treated as public search pages."
        updatedAt="July 11, 2026"
      />

      <section className="guide-content-section">
        <h2>Content Types</h2>
        <p>
          Official info pages summarize confirmed details from publisher, platform, and official game sources. News pages track source updates and time-sensitive changes. Guides explain routes and decisions using source-backed facts where available. Tools help readers compare routes, recipes, teams, and spawn conditions without presenting unverified data as official information.
        </p>
      </section>

      <section className="guide-content-section">
        <h2>Indexing Rules</h2>
        <p>
          Pages are eligible for indexing only when they provide a clear purpose, source context, internal links, review dates, and useful original structure. Placeholder pages, broad topic drafts, speculative database entries, and pages with weak source support are kept out of the sitemap and marked noindex until they are improved.
        </p>
      </section>

      <section className="guide-content-section">
        <h2>AI Draft Use</h2>
        <p>
          AI tools may help organize notes, draft outlines, and compare structured data, but pages still need editorial review before publication. Reviews check source labels, unsupported claims, route logic, duplicate wording, image attribution, and whether the page should be indexed.
        </p>
      </section>

      <section className="guide-content-section">
        <h2>Review and Updates</h2>
        <p>
          Source-backed pages are revisited when official information changes. Pages that include route advice are reviewed for clarity, internal links, and uncertainty labels. If a page can no longer be maintained at a useful standard, it can be removed from search until the page is rewritten.
        </p>
      </section>

      <section className="guide-content-section">
        <h2>Related Policies</h2>
        <div className="topic-hero-actions">
          <a href="/source-policy">Source policy</a>
          <a href="/corrections">Corrections</a>
          <a href="/copyright">Copyright</a>
        </div>
      </section>
    </main>
  )
}
