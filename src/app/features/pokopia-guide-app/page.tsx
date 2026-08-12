import type { Metadata } from 'next'
import Link from 'next/link'
import { DataStatus } from '@/components/content/DataStatus'
import { BreadcrumbJsonLd, FAQJsonLd, ArticleJsonLd } from '@/components/seo/JsonLd'
import { BASE_URL, canonicalUrl } from '@/lib/site'

const pageUrl = '/features/pokopia-guide-app'
const reviewedAt = '2026-08-11'

const faqs = [
  {
    question: 'Is Pokopia Cloud free to use?',
    answer: 'Yes. Pokopia Cloud is a free, browser-based wiki and planning tool. No download, no account required, no premium tier for core features.',
  },
  {
    question: 'Do I need to download an app to use Pokopia Cloud?',
    answer: 'No. Pokopia Cloud runs entirely in your browser. Bookmark the site on any device and use it like an app — no app store, no installation.',
  },
  {
    question: 'Is Pokopia Cloud better than Reddit or Discord for Pokopia guides?',
    answer: 'Pokopia Cloud is structured differently. Reddit and Discord are community forums where information gets lost in threads. Pokopia Cloud organizes every guide, database entry, and tool in one searchable place. No digging through pages of comments to find what you need.',
  },
  {
    question: 'Does Pokopia Cloud work on a phone?',
    answer: 'Yes. The site is responsive and works on mobile browsers. The Spawn Tracker, Team Builder, Habitat Planner, and Recipe Calculator are all mobile-friendly — no install needed.',
  },
  {
    question: 'Is the information on Pokopia Cloud accurate?',
    answer: 'Pokopia Cloud uses a combination of officially confirmed Nintendo and Pokemon information, editorial review, and community-sourced guides that are reviewed before publication. DataStatus notes flag information that is still being verified.',
  },
]

const keyFeatures = [
  {
    title: 'Spawn Tracker',
    description: 'Check spawn conditions, weather effects, and recommended habitats for every Pokemon. Work from the wiki database rather than guessing from forums.',
    href: '/tools',
  },
  {
    title: 'Team Builder',
    description: 'Plan your Pokemon team with type coverage, rarity balance, and habitat synergy. Compare builds without scrolling through Reddit threads.',
    href: '/tools',
  },
  {
    title: 'Habitat Planner',
    description: 'Map out habitat routes, unlock conditions, and resource bonuses. Get structured recommendations instead of scattered Discord tips.',
    href: '/tools',
  },
  {
    title: 'Recipe Calculator',
    description: 'Find the best recipes by rarity, buff type, and effect duration. No need to search through guide comments to figure out what to craft.',
    href: '/tools',
  },
]

const relatedPages = [
  { name: 'Beginner Route Guide', url: '/guides/beginner-route' },
  { name: 'Pokemon Database', url: '/wiki/pokemon' },
  { name: 'Planning Tools', url: '/tools' },
  { name: 'Roommate Matchmaker', url: '/features/roommate-matchmaker' },
]

export const metadata: Metadata = {
  title: 'Pokopia Guide App – The Best Pokopia Wiki and Planning Tools | Pokopia Cloud',
  description: 'Pokopia Cloud is a structured free guide app for Pokopia players. Browse the Pokemon database, habitat routes, recipes, and planning tools in any browser on phone or desktop.',
  keywords: [
    'pokopia guide app',
    'pokopia wiki app',
    'best pokopia guide',
    'pokopia app',
    'pokopia planning tools',
    'pokopia cloud',
    'pokopia wiki',
    'pokopia database',
    'pokopia spawn tracker',
    'pokopia team builder',
  ],
  alternates: {
    canonical: canonicalUrl(pageUrl),
  },
  openGraph: {
    title: 'Pokopia Guide App – The Best Pokopia Wiki and Planning Tools',
    description: 'Pokopia Cloud is a structured free guide app for Pokopia players. No download or install is required.',
    images: ['/og-image.svg'],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Guide App – The Best Pokopia Wiki and Planning Tools',
    description: 'Pokopia Cloud is a structured free guide app for Pokopia players. No download or install is required.',
    images: ['/og-image.svg'],
  },
}

export default function PokopiaGuideAppPage() {
  return (
    <main className="topic-page page-shell">
      <ArticleJsonLd
        title="Pokopia Guide App – The Best Pokopia Wiki and Planning Tools"
        description="Pokopia Cloud is a structured free guide app for Pokopia players. Browse the Pokemon database, habitat routes, recipes, and planning tools with no download required."
        url={pageUrl}
        publishedAt={reviewedAt}
        modifiedAt={reviewedAt}
        image={`${BASE_URL}/og-image.svg`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Features', url: '/features' },
          { name: 'Pokopia Guide App', url: pageUrl },
        ]}
      />
      <FAQJsonLd title="Pokopia Guide App FAQ" faqs={faqs} />

      <header className="topic-hero">
        <Link href="/features" className="back-link">Back to Features</Link>
        <div style={{ marginTop: '1rem' }}>
          <span className="badge source-roundup">Guide App</span>
        </div>
        <h1>The Pokopia Guide App — Your All-in-One Pokopia Wiki in the Browser</h1>
        <p>
          Pokopia Cloud is a structured free guide app for Pokopia players. It brings together a Pokemon database, habitat routes, recipes, and planning tools in one place — no download, no install, no account. Open the browser and start using it.
        </p>
        <div className="topic-hero-actions">
          <a href="/wiki/pokemon">Browse Pokemon database</a>
          <a href="/tools">Open planning tools</a>
        </div>
      </header>

      <DataStatus
        status="Editorial database — community guides reviewed before publication"
        note="Pokopia Cloud combines officially confirmed information with editorial content. DataStatus notes flag any information still under review. Tools and calculators reflect current wiki data."
        updatedAt="August 11, 2026"
      />

      <section className="topic-section">
        <span className="panel-kicker">What You Get</span>
        <h2>Everything the Wiki Covers</h2>
        <p>
          Pokopia Cloud is built around a structured database that other fan communities lack. Instead of searching Reddit or Discord for a fragment of information, you browse organized pages:
        </p>
        <ul>
          <li><strong>Pokemon database</strong> — types, rarities, habitats, favorite foods, spawn times, weather conditions, specialty skills, and drops.</li>
          <li><strong>Habitat routes</strong> — unlock conditions, recommended builds, difficulty ratings, weather effects, and resource bonuses.</li>
          <li><strong>Recipe database</strong> — ingredients, buffs, effect duration, rarity, and best-use recommendations.</li>
          <li><strong>Planning tools</strong> — Spawn Tracker, Team Builder, Habitat Planner, Recipe Calculator.</li>
          <li><strong>Guides</strong> — beginner routes, farming strategies, tier lists, and editorial explainers.</li>
        </ul>
      </section>

      <section className="topic-section">
        <span className="panel-kicker">App-Like Features</span>
        <h2>Tools That Work Like a Dedicated App</h2>
        <p>
          Pokopia Cloud includes planning tools that rival dedicated apps — and none of them require an install:
        </p>
        <div className="topic-step-grid">
          {keyFeatures.map((feature) => (
            <article key={feature.title} className="topic-step-card">
              <strong>{feature.title}</strong>
              <p>{feature.description}</p>
              <Link href={feature.href} className="card-link">Use {feature.title.toLowerCase()}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="topic-section">
        <span className="panel-kicker">Compared to Other Options</span>
        <h2>Why Pokopia Cloud Beats Reddit and Discord</h2>
        <div className="topic-two-column">
          <div>
            <h3>Community Forums</h3>
            <ul className="topic-link-list">
              <li>Information is buried in threads and comments</li>
              <li>No guaranteed search accuracy — top answer may be outdated</li>
              <li>New players ask the same questions repeatedly</li>
              <li>No structured database for Pokemon, habitats, or recipes</li>
              <li>Signal lost in noise — helpful tips disappear fast</li>
            </ul>
          </div>
          <div>
            <h3>Pokopia Cloud</h3>
            <ul className="topic-link-list">
              <li>Organized, searchable database — every entry has a page</li>
              <li>Guides reviewed before publication, not upvoted from anecdote</li>
              <li>Always available — no signal lost in threads</li>
              <li>Planning tools work on mobile without install</li>
              <li>Internal linking connects related Pokemon, guides, and tools</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="topic-section">
        <span className="panel-kicker">Getting Started</span>
        <h2>How to Use Pokopia Cloud</h2>
        <div className="topic-step-grid">
          <article className="topic-step-card">
            <strong>1. Bookmark the site</strong>
            <p>Add pokopia.cloud to your bookmarks on phone and desktop. It works like an app from there.</p>
          </article>
          <article className="topic-step-card">
            <strong>2. Use the search bar</strong>
            <p>Search for any Pokemon, habitat, recipe, or guide topic. Results are structured pages, not comment threads.</p>
          </article>
          <article className="topic-step-card">
            <strong>3. Start with the beginner guide</strong>
            <p>New to Pokopia? The beginner route guide gives you a confirmed starting path without invented mechanics.</p>
            <Link href="/guides/beginner-route" className="card-link">Read beginner guide</Link>
          </article>
        </div>
      </section>

      <section className="topic-section">
        <span className="panel-kicker">Mobile Experience</span>
        <h2>Works on Your Phone Browser</h2>
        <p>
          Pokopia Cloud is built for mobile. Every page is responsive, and the planning tools are touch-friendly. Open the site on your phone, bookmark it, and use it the same way you would a downloaded app. There is no install step, no app store approval, and no update to manage.
        </p>
        <p>
          The Spawn Tracker, Team Builder, Habitat Planner, and Recipe Calculator all work on smaller screens. You get structured data and planning tools without filling your phone storage.
        </p>
      </section>

      <section className="topic-section">
        <span className="panel-kicker">Online vs Offline</span>
        <h2>Why Some Features Need a Connection</h2>
        <p>
          Pokopia Cloud is a web-based wiki. Core pages load and display cached content where possible, but some features require an active connection:
        </p>
        <ul>
          <li><strong>Search</strong> — live search queries the database directly.</li>
          <li><strong>Planning tools</strong> — calculators and planners use current wiki data.</li>
          <li><strong>Guide updates</strong> — editorial content is reviewed and updated regularly online.</li>
        </ul>
        <p>
          Pages you have previously visited will load quickly, but for the most accurate Pokemon data, recipe results, and habitat information, a connection ensures you see the latest reviewed content.
        </p>
      </section>

      <section className="topic-section">
        <span className="panel-kicker">Related Content</span>
        <h2>Keep Exploring Pokopia Cloud</h2>
        <div className="topic-resource-grid">
          {relatedPages.map((item) => (
            <Link key={item.url} href={item.url} className="card">
              <h3>{item.name}</h3>
              <p>Explore {item.name.toLowerCase()} on Pokopia Cloud.</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="topic-faq">
        <span className="panel-kicker">FAQ</span>
        <h2>Guide App Questions</h2>
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
