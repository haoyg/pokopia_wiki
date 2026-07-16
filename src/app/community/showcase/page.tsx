import type { Metadata } from 'next'
import Link from 'next/link'
import { DataStatus } from '@/components/content/DataStatus'
import { OfficialContext } from '@/components/content/OfficialContext'
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'
import { BASE_URL, canonicalUrl } from '@/lib/site'
import { noIndexMetadata } from '@/lib/indexing'

const pageUrl = '/community/showcase'
const reviewedAt = '2026-05-27'

const futureCategories = [
  {
    title: 'Home Design Showcase',
    summary: 'Verified player home layouts, cozy base ideas, and building notes with screenshot permission and source credit.',
    href: '/builds/home-design-ideas',
  },
  {
    title: 'Habitat Route Notes',
    summary: 'Player-tested route observations that include habitat, weather, target Pokemon, repeat count, and review date.',
    href: '/wiki/habitat',
  },
  {
    title: 'Recipe and Farming Reports',
    summary: 'Recipe timing notes, farming loops, and material routes that clearly separate observation from confirmed official data.',
    href: '/guides/recipe-planning-route',
  },
  {
    title: 'Multiplayer Build Sessions',
    summary: 'Community notes for visits, Palette Town, Cloud Island, and shared creative spaces with correct permission wording.',
    href: '/official/multiplayer-gameshare-cloud-island',
  },
]

const reviewChecklist = [
  'Contributor permission is recorded before publishing screenshots, quotes, or route notes.',
  'Every image has a visible source label and, when possible, a source URL.',
  'Gameplay claims include conditions such as habitat, weather, route goal, version or review date.',
  'No fake player names, fake rankings, invented contests, or unsourced event claims.',
  'Submissions link to related Pokemon, habitats, recipes, guides, or official context pages.',
]

const relatedPages = [
  { name: 'Community Guidelines', url: '/community' },
  { name: 'Copyright and Image Sources', url: '/copyright' },
  { name: 'Home Design Ideas', url: '/builds/home-design-ideas' },
  { name: 'Weekly Event Tracker', url: '/news/weekly-event-tracker' },
]

const faqs = [
  {
    question: 'Does this page publish live player submissions now?',
    answer: 'No. This is a future showcase index and review standard. It does not invent player submissions, quotes, rankings, screenshots, or contest results.',
  },
  {
    question: 'What will be required before a showcase entry is published?',
    answer: 'A future showcase entry should include permission, source credit, capture context, review date, and related site links so readers can understand and verify the content.',
  },
  {
    question: 'Why create a community showcase page before submissions exist?',
    answer: 'It gives the site a clear editorial standard and prevents low-quality community pages from being added later without permission, image credits, or useful context.',
  },
]

export const metadata: Metadata = {
  title: 'Pokopia Community Showcase Index',
  description: 'Future Pokopia community showcase index with submission standards for verified screenshots, home designs, route notes, and player-tested reports.',
  robots: noIndexMetadata,
  alternates: {
    canonical: canonicalUrl(pageUrl),
  },
  openGraph: {
    title: 'Pokopia Community Showcase Index',
    description: 'Submission standards and future index structure for verified Pokopia community content.',
    images: ['/og-image.svg'],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Community Showcase Index',
    description: 'Future community showcase standards for Pokopia screenshots, builds, and route notes.',
    images: ['/og-image.svg'],
  },
}

export default function CommunityShowcasePage() {
  return (
    <main className="topic-page page-shell">
      <ArticleJsonLd
        title="Pokopia Community Showcase Index"
        description="Future Pokopia community showcase index with submission standards for verified screenshots, home designs, route notes, and player-tested reports."
        url={pageUrl}
        publishedAt={reviewedAt}
        modifiedAt={reviewedAt}
        image={`${BASE_URL}/og-image.svg`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Community', url: '/community' },
          { name: 'Showcase', url: pageUrl },
        ]}
      />
      <ItemListJsonLd
        name="Pokopia community showcase categories"
        description="Future verified community showcase categories for Pokopia Portal."
        url={pageUrl}
        items={futureCategories.map((item) => ({ name: item.title, url: item.href }))}
      />
      <FAQJsonLd title="Pokopia Community Showcase FAQ" faqs={faqs} />

      <header className="topic-hero">
        <Link href="/community" className="back-link">Back to Community</Link>
        <div style={{ marginTop: '1rem' }}>
          <span className="badge source-roundup">Community Index</span>
        </div>
        <h1>Pokopia Community Showcase Index</h1>
        <p>
          A future index for verified Pokopia community screenshots, home designs, route notes, and player-tested reports. This page defines what can be published before the site starts displaying community submissions.
        </p>
        <div className="topic-hero-actions">
          <a href="/community">Read contribution rules</a>
          <a href="/contact">Contact the site</a>
        </div>
      </header>

      <DataStatus
        status="Future showcase index, no live player feed yet"
        note="Pokopia Portal is not currently publishing live player submissions. This page defines the review standard for future verified community content."
        updatedAt="May 27, 2026"
      />

      <OfficialContext
        title="Community Content Needs Permission and Context"
        description="Community pages should support source-backed site content. Screenshots, route claims, and multiplayer notes need permission, source labels, and clear review dates."
        links={[
          { href: '/copyright', label: 'Image source rules' },
          { href: '/official/gameplay-overview', label: 'Official gameplay context' },
          { href: '/official/multiplayer-gameshare-cloud-island', label: 'Multiplayer rules' },
        ]}
      />

      <section className="topic-section">
        <span className="panel-kicker">Purpose</span>
        <h2>A Showcase Page Should Not Be a Thin Gallery</h2>
        <p>
          A useful community showcase needs more than screenshots. Each entry should explain what the player built or tested, why it matters, which systems it touches, and what evidence supports the claim. This keeps the page useful for readers and safer for AdSense quality review.
        </p>
        <p>
          Until verified submissions exist, this page acts as the publishing standard. It prevents the site from adding fake player names, fake rankings, or unattributed images just to look active.
        </p>
      </section>

      <section className="topic-section">
        <span className="panel-kicker">Future Categories</span>
        <h2>What the Showcase Can Include Later</h2>
        <div className="topic-step-grid">
          {futureCategories.map((category) => (
            <article key={category.title} className="topic-step-card">
              <strong>{category.title}</strong>
              <p>{category.summary}</p>
              <a href={category.href}>Related page</a>
            </article>
          ))}
        </div>
      </section>

      <section className="topic-two-column">
        <section className="topic-section">
          <span className="panel-kicker">Review Checklist</span>
          <h2>Before Publishing</h2>
          <ul>
            {reviewChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="topic-section">
          <span className="panel-kicker">Entry Template</span>
          <h2>Recommended Fields</h2>
          <ul>
            <li>Title and short description.</li>
            <li>Contributor permission and display name preference.</li>
            <li>Image source, screenshot context, and capture date.</li>
            <li>Related Pokemon, habitat, recipe, guide, or tool page.</li>
            <li>Editorial review date and any uncertainty notes.</li>
          </ul>
        </section>
      </section>

      <section className="topic-section">
        <span className="panel-kicker">Related Standards</span>
        <h2>Pages That Support Future Submissions</h2>
        <div className="topic-resource-grid">
          {relatedPages.map((item) => (
            <a key={item.url} href={item.url} className="card">
              <span className="badge official">Standard</span>
              <h3>{item.name}</h3>
              <p>Use this page to keep community content useful, credited, and connected to the rest of Pokopia Portal.</p>
            </a>
          ))}
        </div>
      </section>

      <section className="topic-faq">
        <span className="panel-kicker">FAQ</span>
        <h2>Community Showcase Questions</h2>
        {faqs.map((faq) => (
          <details key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </section>
    </main>
  )
}
