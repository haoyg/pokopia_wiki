import type { Metadata } from 'next'
import Link from 'next/link'
import { DataStatus } from '@/components/content/DataStatus'
import { canonicalUrl, BASE_URL } from '@/lib/site'
import { BreadcrumbJsonLd, JsonLd, WebPageJsonLd } from '@/components/seo/JsonLd'

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
    description: 'Independent gaming content site for Pokopia players with source notes, guides, wiki data, news, and planning tools.',
    email: 'hello@pokopia.cloud',
    sameAs: [],
  }

  return (
    <>
      <JsonLd data={orgJsonLd} />
      <main className="topic-page page-shell">
        <WebPageJsonLd
          type="AboutPage"
          name="About Pokopia Portal"
          description="About Pokopia Portal, an independent source-aware guide site with editorial policies, source standards, and correction process."
          url="/about"
          dateModified="2026-07-11"
        />
        <BreadcrumbJsonLd
          items={[
            { name: 'Home', url: '/' },
            { name: 'About', url: '/about' },
          ]}
        />
        <article>
          <header className="topic-hero">
            <Link href="/" className="back-link">Back to Home</Link>
            <div style={{ marginTop: '1rem' }}>
              <span className="badge source-roundup">About</span>
            </div>
            <h1>About Pokopia Portal</h1>
            <p>
              Pokopia Portal is an independent gaming content site built to help players understand Pokopia through source notes, practical guides, wiki-style data, news updates, and planning tools.
            </p>
          </header>

          <DataStatus
            status="Independent fan resource"
            note="The site separates official source roundups, reviewed guide pages, tools, and future drafts so readers can see how each page should be used."
            updatedAt="July 11, 2026"
          />

          <section className="guide-content-section">
            <h2>Our Goal</h2>
            <p>
              The goal is to answer practical player questions clearly: where to check a source, how to read a guide, which tool to use, and which route to check next.
            </p>
          </section>

          <section className="guide-content-section">
            <h2>Editorial Approach</h2>
            <p>
              We separate confirmed source information from route advice. Official announcements and product information are linked from source-backed pages, while guides and tools explain how a player can use that information in a route, recipe, or team plan.
            </p>
          </section>

          <section className="guide-content-section">
            <h2>Review Process</h2>
            <p>
              Pages are reviewed for source clarity, internal links, image attribution, and update dates. When information is uncertain or based on site data, the page labels that context instead of presenting it as an official claim.
            </p>
          </section>

          <section className="guide-content-section">
            <h2>Trust Policies</h2>
            <p>
              The editorial policy explains how pages are reviewed and when weak pages are kept out of search. The source policy explains which sources are preferred. The corrections page explains how readers can report errors.
            </p>
            <div className="topic-hero-actions">
              <a href="/editorial-policy">Editorial policy</a>
              <a href="/source-policy">Source policy</a>
              <a href="/corrections">Corrections</a>
            </div>
          </section>

          <section className="guide-content-section">
            <h2>Independence</h2>
            <p>
              Pokopia Portal is a fan-oriented information website. Unless explicitly stated, it is not officially affiliated with, endorsed by, or sponsored by any game publisher or rights holder. All game-related names and marks belong to their respective owners.
            </p>
          </section>

          <section className="guide-content-section">
            <h2>Unofficial Fan Resource</h2>
            <p>
              This site is not an official Nintendo, The Pokemon Company, Game Freak, or Creatures Inc. website. We publish source summaries, guide notes, and planning tools to help players research routes, teams, recipes, and habitats.
            </p>
          </section>

          <section className="guide-content-section">
            <h2>Image and Source Policy</h2>
            <p>
              We label images with their source near the image or on the related page. If a source needs correction or a rights holder requests removal, please contact us through the copyright removal process.
            </p>
          </section>

          <section className="guide-content-section">
            <h2>Contact</h2>
            <p>
              To suggest a correction, request a new guide, or report a rights concern, contact <a href="mailto:hello@pokopia.cloud">hello@pokopia.cloud</a>. You can also read our <a href="/disclaimer">disclaimer</a> and <a href="/copyright">copyright removal policy</a>.
            </p>
          </section>
        </article>
      </main>
    </>
  )
}
