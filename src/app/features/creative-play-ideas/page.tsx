import type { Metadata } from 'next'
import Link from 'next/link'
import { DataStatus } from '@/components/content/DataStatus'
import { OfficialContext } from '@/components/content/OfficialContext'
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'
import { BASE_URL, canonicalUrl } from '@/lib/site'

const pageUrl = '/features/creative-play-ideas'
const reviewedAt = '2026-05-28'

const playIdeas = [
  {
    title: 'One-Habitat Home Challenge',
    summary: 'Build a home or camp whose furniture, recipe planning, and Pokemon choices all come from one habitat theme.',
    route: '/wiki/habitat',
  },
  {
    title: 'Recipe Workshop Run',
    summary: 'Plan a session around cooking, storage placement, and route timing instead of only chasing rare spawns.',
    route: '/guides/recipe-planning-route',
  },
  {
    title: 'Visitor Courtyard Build',
    summary: 'Create a readable social space for Pokemon visits, screenshots, and future community showcase entries.',
    route: '/builds/home-design-ideas',
  },
  {
    title: 'Low-Rarity Route Draft',
    summary: 'Use common or easy-to-find Pokemon and recipes to make a route that feels stable without relying on rare options.',
    route: '/tools/team-builder',
  },
]

const unsafeBoundaries = [
  'No ROM hacks, cracked builds, bypass tools, or unauthorized downloads.',
  'No instructions for modifying protected game files or circumventing platform restrictions.',
  'No copied community mods, screenshots, or builds without permission and source credit.',
  'No fake player challenges, fake contest winners, or invented event rules.',
]

const relatedPages = [
  { name: 'Home Design Ideas', url: '/builds/home-design-ideas' },
  { name: 'Community Showcase Index', url: '/community/showcase' },
  { name: 'Recipe Planning Route', url: '/guides/recipe-planning-route' },
  { name: 'Habitat Planner', url: '/tools/habitat-planner' },
]

const faqs = [
  {
    question: 'Does this page provide Pokopia mods or downloads?',
    answer: 'No. This page does not provide mods, downloads, patches, ROM hacks, or instructions for modifying protected game files. It focuses on safe creative play ideas inside normal gameplay and site planning.',
  },
  {
    question: 'Can creative challenge ideas be submitted by players later?',
    answer: 'Yes, but future submissions should include permission, source credit for images, clear rules, review dates, and no misleading claims about official events or rewards.',
  },
  {
    question: 'Why use creative play ideas instead of a mod page?',
    answer: 'Creative play ideas are safer for readers, copyright, platform rules, and AdSense review because they avoid downloads and unauthorized modification while still serving players who want fresh ways to play.',
  },
]

export const metadata: Metadata = {
  title: 'Pokopia Creative Play Ideas and Builds',
  description: 'Try Pokopia creative play ideas for home builds, habitat themes, recipe workshops, route challenges, and community showcases.',
  alternates: {
    canonical: canonicalUrl(pageUrl),
  },
  openGraph: {
    title: 'Pokopia Creative Play Ideas and Builds',
    description: 'Home builds, habitat themes, recipe workshops, route challenges, and community showcase ideas for Pokopia.',
    images: ['/og-image.svg'],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Creative Play Ideas and Builds',
    description: 'Home builds, habitat themes, recipe workshops, route challenges, and community showcase ideas for Pokopia.',
    images: ['/og-image.svg'],
  },
}

export default function CreativePlayIdeasPage() {
  return (
    <main className="topic-page page-shell">
      <ArticleJsonLd
        title="Pokopia Creative Play Ideas"
        description="Safe Pokopia creative play ideas for building challenges, recipe workshops, habitat themes, and community-friendly routes without mod downloads."
        url={pageUrl}
        publishedAt={reviewedAt}
        modifiedAt={reviewedAt}
        image={`${BASE_URL}/og-image.svg`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Features', url: '/features' },
          { name: 'Creative Play Ideas', url: pageUrl },
        ]}
      />
      <ItemListJsonLd
        name="Pokopia creative play ideas"
        description="Safe creative challenge ideas for Pokopia players."
        url={pageUrl}
        items={playIdeas.map((idea) => ({ name: idea.title, url: idea.route }))}
      />
      <FAQJsonLd title="Pokopia Creative Play Ideas FAQ" faqs={faqs} />

      <header className="topic-hero">
        <Link href="/features" className="back-link">Back to Features</Link>
        <div style={{ marginTop: '1rem' }}>
          <span className="badge source-roundup">Creative Play</span>
        </div>
        <h1>Pokopia Creative Play Ideas</h1>
        <p>
          Safe challenge ideas for players who want fresh ways to enjoy Pokopia without relying on unauthorized mods, downloads, patches, or fake community events.
        </p>
        <div className="topic-hero-actions">
          <a href="/builds/home-design-ideas">Home design ideas</a>
          <a href="/community/showcase">Showcase standards</a>
        </div>
      </header>

      <DataStatus
        status="Creative ideas only, no mod downloads"
        note="This page does not provide game modifications, files, patches, or bypass instructions. It covers safe editorial play ideas that can be used with normal site guides and tools."
        updatedAt="May 28, 2026"
      />

      <OfficialContext
        title="Creative Play Should Not Override Official Context"
        description="Use official pages for confirmed gameplay and multiplayer rules. Creative ideas here are optional editorial challenges, not official events or mod instructions."
        links={[
          { href: '/official/gameplay-overview', label: 'Gameplay overview' },
          { href: '/official/multiplayer-gameshare-cloud-island', label: 'Multiplayer rules' },
          { href: '/news/weekly-event-tracker', label: 'Event tracker' },
        ]}
      />

      <section className="topic-section">
        <span className="panel-kicker">Safe Scope</span>
        <h2>Creative Play, Not Mod Distribution</h2>
        <p>
          Players often search for mods when they really want new constraints, decorating goals, route rules, or community challenges. For this site, the safer and more useful angle is creative play: ideas that work inside normal gameplay and connect back to guides, tools, habitats, recipes, and community showcase standards.
        </p>
        <p>
          This keeps the page useful without creating security, copyright, platform-policy, or AdSense quality issues.
        </p>
      </section>

      <section className="topic-section">
        <span className="panel-kicker">Challenge Ideas</span>
        <h2>Four Creative Ways to Play</h2>
        <div className="topic-step-grid">
          {playIdeas.map((idea) => (
            <article key={idea.title} className="topic-step-card">
              <strong>{idea.title}</strong>
              <p>{idea.summary}</p>
              <a href={idea.route}>Related page</a>
            </article>
          ))}
        </div>
      </section>

      <section className="topic-two-column">
        <section className="topic-section">
          <span className="panel-kicker">Not Allowed</span>
          <h2>Boundaries for This Topic</h2>
          <ul>
            {unsafeBoundaries.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="topic-section">
          <span className="panel-kicker">Better Submission Format</span>
          <h2>How to Write a Challenge</h2>
          <ul>
            <li>Name the rule set in one sentence.</li>
            <li>Explain which habitats, recipes, Pokemon, or tools support it.</li>
            <li>State whether screenshots or route results are verified.</li>
            <li>Link to the relevant guide, tool, or community standard page.</li>
          </ul>
        </section>
      </section>

      <section className="topic-section">
        <span className="panel-kicker">Related Pages</span>
        <h2>Turn Ideas Into Useful Routes</h2>
        <div className="topic-resource-grid">
          {relatedPages.map((item) => (
            <a key={item.url} href={item.url} className="card">
              <span className="badge guides">Related</span>
              <h3>{item.name}</h3>
              <p>Use this page to connect a creative idea with practical Pokopia planning and source-aware site standards.</p>
            </a>
          ))}
        </div>
      </section>

      <section className="topic-faq">
        <span className="panel-kicker">FAQ</span>
        <h2>Creative Play Questions</h2>
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
