import type { Metadata } from 'next'
import Link from 'next/link'
import { DataStatus } from '@/components/content/DataStatus'
import { OfficialContext } from '@/components/content/OfficialContext'
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'
import { BASE_URL, canonicalUrl } from '@/lib/site'

const pageUrl = '/features/friendship-requests-tracker'
const reviewedAt = '2026-07-11'

const confirmedSignals = [
  {
    title: 'Befriended Pokemon can matter',
    summary: 'Official beginner tips mention talking to befriended Pokemon, especially when they seem to be thinking about something.',
  },
  {
    title: 'Requests are confirmed as a concept',
    summary: 'Nintendo-sourced tips connect talking to befriended Pokemon with requests, giving the site a verified basis for routine-planning coverage.',
  },
  {
    title: 'Visits are part of the social layer',
    summary: 'Official materials discuss inviting Pokemon or friends to visit, plus multiplayer town visits with clearly defined permissions.',
  },
]

const unconfirmedBoundaries = [
  'Exact NPC relationship levels, gift values, romance systems, or villager-style friendship ranks.',
  'A complete list of request rewards, cooldowns, request chains, or weekly reset rules.',
  'Hidden affection formulas, best gifts, or guaranteed request triggers.',
  'Any named NPC schedule unless it is directly supported by an official source.',
]

const sourceReviewNotes = [
  'Uses official beginner tips as the primary basis for talking about befriended Pokemon and requests.',
  'Uses official gameplay and multiplayer pages only for broad visit and social-context framing.',
  'Keeps exact request rewards, cooldowns, and relationship values out of indexed content until they can be sourced or reviewed.',
]

const recheckTriggers = [
  'Nintendo publishes new beginner tips, request examples, support notes, or launch guidance.',
  'Official sources clarify request rewards, timing, friendship behavior, or NPC schedules.',
  'A future database page needs this tracker to support a more specific claim.',
]

const relatedPages = [
  { name: 'Official Beginner Tips', url: '/official/official-beginner-tips' },
  { name: 'PC, Requests, and Daily Challenges', url: '/news/pokemon-pokopia-pc-requests-daily-challenges' },
  { name: 'Official Gameplay Overview', url: '/official/gameplay-overview' },
  { name: 'Multiplayer and Cloud Island', url: '/official/multiplayer-gameshare-cloud-island' },
]

const faqs = [
  {
    question: 'Does Pokopia Portal have a confirmed NPC relationship database?',
    answer: 'No. This page does not claim a complete NPC relationship system. It tracks official signals around befriended Pokemon, requests, visits, and routine planning.',
  },
  {
    question: 'Are Pokemon requests confirmed?',
    answer: 'Yes, Nintendo-sourced beginner tips mention talking to befriended Pokemon because it can lead to requests. Exact request lists, rewards, and cooldowns still need source confirmation.',
  },
  {
    question: 'Why create this page before every detail is known?',
    answer: 'A tracker page lets the site collect confirmed facts, show what is still unknown, and avoid publishing fake NPC guides or invented gift tables.',
  },
]

export const metadata: Metadata = {
  title: 'Pokopia Friendship and Requests Tracker',
  description: 'A source-aware tracker for Pokopia befriended Pokémon, requests, visits, and unconfirmed NPC relationship mechanics.',
  alternates: {
    canonical: canonicalUrl(pageUrl),
  },
  openGraph: {
    title: 'Pokopia Friendship and Requests Tracker',
    description: 'Confirmed friendship and request signals for Pokémon Pokopia, with clear boundaries around unconfirmed NPC systems.',
    images: ['/og-image.svg'],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Friendship and Requests Tracker',
    description: 'Track confirmed Pokopia request and friendship signals without inventing NPC mechanics.',
    images: ['/og-image.svg'],
  },
}

export default function FriendshipRequestsTrackerPage() {
  return (
    <main className="topic-page page-shell">
      <ArticleJsonLd
        title="Pokopia Friendship and Requests Tracker"
        description="A source-aware tracker for Pokopia befriended Pokémon, requests, visits, and unconfirmed NPC relationship mechanics."
        url={pageUrl}
        publishedAt={reviewedAt}
        modifiedAt={reviewedAt}
        image={`${BASE_URL}/og-image.svg`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Features', url: '/features' },
          { name: 'Friendship and Requests Tracker', url: pageUrl },
        ]}
      />
      <ItemListJsonLd
        name="Pokopia friendship and request source path"
        description="Source-backed pages related to Pokopia friendship, requests, visits, and social systems."
        url={pageUrl}
        items={relatedPages}
      />
      <FAQJsonLd title="Pokopia Friendship and Requests FAQ" faqs={faqs} />

      <header className="topic-hero">
        <Link href="/features" className="back-link">Back to Features</Link>
        <div style={{ marginTop: '1rem' }}>
          <span className="badge source-roundup">System Tracker</span>
        </div>
        <h1>Pokopia Friendship and Requests Tracker</h1>
        <p>
          A careful tracker for Pokopia&apos;s social and request-related systems. It covers confirmed signals around befriended Pokemon, requests, visits, and daily routines without pretending that a full NPC relationship database is already verified.
        </p>
        <div className="topic-hero-actions">
          <a href="/official/official-beginner-tips">Read official tips</a>
          <a href="/news/pokemon-pokopia-pc-requests-daily-challenges">Requests context</a>
        </div>
      </header>

      <DataStatus
        status="Confirmed signals only, no complete NPC database yet"
        note="This page should not be read as a confirmed NPC gift guide, relationship table, or request reward list. It tracks what official source pages currently support."
        updatedAt="July 11, 2026"
      />

      <OfficialContext
        title="Friendship Coverage Needs Source Boundaries"
        description="Official context supports befriended Pokemon, requests, and visits. Exact relationship formulas, NPC schedules, and reward tables need direct confirmation before becoming database content."
        links={[
          { href: '/official/official-beginner-tips', label: 'Official beginner tips' },
          { href: '/official/gameplay-overview', label: 'Gameplay overview' },
          { href: '/official/multiplayer-gameshare-cloud-island', label: 'Multiplayer context' },
        ]}
      />

      <section className="topic-section">
        <span className="panel-kicker">Quick Answer</span>
        <h2>Requests Are Confirmed, Full NPC Relationships Are Not</h2>
        <p>
          The site has enough source context to discuss befriended Pokemon, requests, visits, and routine planning. It does not yet have enough confirmed detail to publish a complete NPC relationship database, best-gift chart, friendship-rank table, or request reward spreadsheet.
        </p>
        <p>
          The useful editorial direction is a tracker: collect confirmed language first, explain what players should watch for, and hold back any exact mechanics until they can be sourced.
        </p>
      </section>

      <section className="topic-section">
        <span className="panel-kicker">Source Review</span>
        <h2>What This Tracker Can Support</h2>
        <h3>Source basis</h3>
        <ul>
          {sourceReviewNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        <h3>Recheck when</h3>
        <ul>
          {recheckTriggers.map((trigger) => (
            <li key={trigger}>{trigger}</li>
          ))}
        </ul>
      </section>

      <section className="topic-section">
        <span className="panel-kicker">Confirmed Signals</span>
        <h2>What the Site Can Safely Cover Now</h2>
        <div className="topic-step-grid">
          {confirmedSignals.map((signal) => (
            <article key={signal.title} className="topic-step-card">
              <strong>{signal.title}</strong>
              <p>{signal.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="topic-two-column">
        <section className="topic-section">
          <span className="panel-kicker">Do Not Invent</span>
          <h2>Unconfirmed Boundaries</h2>
          <ul>
            {unconfirmedBoundaries.map((boundary) => (
              <li key={boundary}>{boundary}</li>
            ))}
          </ul>
        </section>

        <section className="topic-section">
          <span className="panel-kicker">Future Database Shape</span>
          <h2>What to Add When Confirmed</h2>
          <ul>
            <li>Request name, requester, source page, and review date.</li>
            <li>Trigger condition, if officially stated or repeatedly tested.</li>
            <li>Reward or result, only when supported by source or verified testing.</li>
            <li>Related Pokemon, habitat, recipe, or multiplayer context.</li>
          </ul>
        </section>
      </section>

      <section className="topic-section">
        <span className="panel-kicker">Related Source Path</span>
        <h2>Read These Before Writing Request Guides</h2>
        <div className="topic-resource-grid">
          {relatedPages.map((item) => (
            <a key={item.url} href={item.url} className="card">
              <span className="badge official">Source</span>
              <h3>{item.name}</h3>
              <p>Use this source-aware page to keep request, friendship, and visit coverage grounded in confirmed information.</p>
            </a>
          ))}
        </div>
      </section>

      <section className="topic-faq">
        <span className="panel-kicker">FAQ</span>
        <h2>Friendship and Requests Questions</h2>
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
