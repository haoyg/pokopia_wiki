import type { Metadata } from 'next'
import Link from 'next/link'
import newsData from '@/data/news.json'
import { DataStatus } from '@/components/content/DataStatus'
import { OfficialContext } from '@/components/content/OfficialContext'
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'
import { BASE_URL, canonicalUrl } from '@/lib/site'

const pageUrl = '/news/weekly-event-tracker'
const reviewedAt = '2026-07-11'

const officialUpdates = newsData
  .filter((item) => item.verified_status === 'Official source roundup')
  .slice(0, 6)

const trackerSections = [
  {
    status: 'Confirmed',
    title: 'Official source updates',
    summary: 'Use this section only for Nintendo, The Pokémon Company, official store pages, official trailers, or clearly identified primary sources.',
  },
  {
    status: 'Watching',
    title: 'Topics to recheck',
    summary: 'Track event-related topics that may change later, such as release bonuses, multiplayer rules, daily challenges, or official beginner tips.',
  },
  {
    status: 'Archived',
    title: 'Old or replaced information',
    summary: 'Move outdated details here when a newer source changes the wording, date, bonus, platform note, or feature explanation.',
  },
]

const recheckTopics = [
  'Release date, platform, price, file size, and store page wording',
  'Early purchase bonus availability and redemption wording',
  'Daily challenges, PC requests, and beginner-tip terminology',
  'Multiplayer, GameShare, Cloud Island, and Palette Town permissions',
]

const sourceReviewNotes = [
  'Uses official Nintendo, Pokemon, store, trailer, support, or clearly identified primary sources for confirmed event-related updates.',
  'Keeps monitoring topics separate from active events so readers can see what is confirmed and what only needs rechecking.',
  'Links recent source-backed pages instead of creating unsupported event schedules, reward lists, or countdown pages.',
]

const claimLimits = [
  'Do not publish an active event unless the source confirms timing, reward, eligibility, and participation rules.',
  'Do not add event names, dates, reward quantities, or reset schedules from guesses or genre expectations.',
  'Do not treat archived or regional information as globally current unless the source supports that wording.',
]

const faqs = [
  {
    question: 'Does Pokopia Portal publish weekly events without official confirmation?',
    answer: 'No. This tracker separates confirmed official updates from topics that need rechecking. It should not invent weekly events, rewards, countdowns, or limited-time schedules.',
  },
  {
    question: 'What counts as a confirmed Pokopia event update?',
    answer: 'A confirmed update should come from an official Nintendo page, official Pokémon page, official store page, official trailer, or another clearly identified primary source.',
  },
  {
    question: 'Why keep a tracker if there are no confirmed weekly events?',
    answer: 'A tracker is still useful because it shows readers what has been checked, what needs rechecking, and where source-backed updates will appear without filling the site with fake news.',
  },
]

export const metadata: Metadata = {
  title: 'Pokopia Weekly Event Tracker',
  description: 'A source-aware Pokopia weekly event tracker that separates confirmed official updates, topics to recheck, and archived event information.',
  alternates: {
    canonical: canonicalUrl(pageUrl),
  },
  openGraph: {
    title: 'Pokopia Weekly Event Tracker',
    description: 'Track confirmed Pokopia event-related updates without inventing unverified schedules or rewards.',
    images: ['/og-image.svg'],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Weekly Event Tracker',
    description: 'Confirmed, watching, and archived event update tracking for Pokopia.',
    images: ['/og-image.svg'],
  },
}

export default function WeeklyEventTrackerPage() {
  return (
    <main className="topic-page page-shell">
      <ArticleJsonLd
        title="Pokopia Weekly Event Tracker"
        description="A source-aware Pokopia weekly event tracker that separates confirmed official updates, topics to recheck, and archived event information."
        url={pageUrl}
        publishedAt={reviewedAt}
        modifiedAt={reviewedAt}
        image={`${BASE_URL}/og-image.svg`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'News', url: '/news' },
          { name: 'Weekly Event Tracker', url: pageUrl },
        ]}
      />
      <ItemListJsonLd
        name="Pokopia weekly event tracking sections"
        description="Confirmed, watching, and archived sections for Pokopia event-related updates."
        url={pageUrl}
        items={trackerSections.map((section) => ({ name: section.title, url: pageUrl }))}
      />
      <FAQJsonLd title="Pokopia Weekly Event Tracker FAQ" faqs={faqs} />

      <header className="topic-hero">
        <Link href="/news" className="back-link">Back to News</Link>
        <div style={{ marginTop: '1rem' }}>
          <span className="badge event">Event Tracker</span>
        </div>
        <h1>Pokopia Weekly Event Tracker</h1>
        <p>
          A source-aware tracker for Pokopia event-related updates. This page is designed to avoid fake event schedules by separating confirmed official information, topics that need rechecking, and archived notes.
        </p>
        <div className="topic-hero-actions">
          <a href="/official">Open official hub</a>
          <a href="/news">Read source updates</a>
        </div>
      </header>

      <DataStatus
        status="No unverified weekly event schedule is published"
        note="This tracker does not invent limited-time events, rewards, countdowns, or dates. It records what should be checked and links readers to source-backed updates."
        updatedAt="July 11, 2026"
      />

      <OfficialContext
        title="Event Tracking Requires Primary Sources"
        description="Use official pages for confirmed dates, bonuses, multiplayer rules, and feature names. Editorial notes should not be presented as live event data."
        links={[
          { href: '/official/release-date-platform-price', label: 'Release details' },
          { href: '/news/pokemon-pokopia-early-purchase-bonus-ditto-rug', label: 'Early purchase bonus' },
          { href: '/news/pokemon-pokopia-pc-requests-daily-challenges', label: 'Daily challenges context' },
        ]}
      />

      <section className="topic-section">
        <span className="panel-kicker">Tracker Policy</span>
        <h2>Confirmed First, No Invented Events</h2>
        <p>
          Weekly event pages can help readers return to the site, but they also create a quality risk if they publish guesses as facts. Pokopia Portal should only label an event as active when a primary source confirms the timing, reward, and participation rules.
        </p>
        <p>
          Until confirmed weekly events exist, this page works as a transparent monitoring hub. It tells readers what is confirmed, what should be rechecked, and where source-backed updates will be linked.
        </p>
      </section>

      <section className="topic-section">
        <span className="panel-kicker">Source Review</span>
        <h2>Event Claims Need Primary Sources</h2>
        <h3>Source basis</h3>
        <ul>
          {sourceReviewNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        <h3>Claim limits</h3>
        <ul>
          {claimLimits.map((limit) => (
            <li key={limit}>{limit}</li>
          ))}
        </ul>
      </section>

      <section className="topic-section">
        <span className="panel-kicker">Status Board</span>
        <h2>Current Event Tracking Sections</h2>
        <div className="topic-step-grid">
          {trackerSections.map((section) => (
            <article key={section.status} className="topic-step-card">
              <span className="badge source-roundup">{section.status}</span>
              <strong>{section.title}</strong>
              <p>{section.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="topic-two-column">
        <section className="topic-section">
          <span className="panel-kicker">Confirmed Updates</span>
          <h2>Recent Source-Backed Pages</h2>
          <div className="topic-link-list">
            {officialUpdates.map((item) => (
              <a key={item.id} href={`/news/${item.slug}`}>
                <strong>{item.title}</strong>
                <span>{item.source_label}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="topic-section">
          <span className="panel-kicker">Recheck Queue</span>
          <h2>Topics to Monitor</h2>
          <ul>
            {recheckTopics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </section>
      </section>

      <section className="topic-section">
        <span className="panel-kicker">Editorial Rules</span>
        <h2>How Future Event Entries Should Be Written</h2>
        <ul>
          <li>Include the official source link or clearly identify the primary source.</li>
          <li>Record the date checked and the page or trailer wording used.</li>
          <li>Separate active events, past events, and speculative topics.</li>
          <li>Do not add reward numbers, end dates, or event names unless the source confirms them.</li>
        </ul>
      </section>

      <section className="topic-faq">
        <span className="panel-kicker">FAQ</span>
        <h2>Weekly Event Tracker Questions</h2>
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
