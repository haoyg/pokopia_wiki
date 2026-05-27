import type { Metadata } from 'next'
import Link from 'next/link'
import { DataStatus } from '@/components/content/DataStatus'
import { OfficialContext } from '@/components/content/OfficialContext'
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'
import { BASE_URL, canonicalUrl } from '@/lib/site'

const pageUrl = '/builds/home-design-ideas'
const reviewedAt = '2026-05-27'

const designIdeas = [
  {
    title: 'Starter Garden Home',
    goal: 'A compact base for new players who want food, crafting, and storage close together.',
    layout: 'Place the home entrance, crop beds, cooking area, and storage in a short loop so every daily task can be finished without crossing the whole town.',
    bestFor: 'Beginner routes, recipe testing, early habitat unlocks',
  },
  {
    title: 'Pokemon Visitor Courtyard',
    goal: 'A social space built around Pokemon visits, photos, and clear movement paths.',
    layout: 'Keep the center open, place decorations around the edge, and leave two wide paths that connect the entrance, gathering point, and display area.',
    bestFor: 'Cozy screenshots, multiplayer visits, community showcase submissions',
  },
  {
    title: 'Recipe Workshop Corner',
    goal: 'A functional build for players who test food buffs before leaving for a habitat route.',
    layout: 'Group cooking, ingredient storage, route notes, and the exit path together. Put decorative pieces behind the work area so they do not block movement.',
    bestFor: 'Recipe planning, farming preparation, rare Pokemon routes',
  },
  {
    title: 'Habitat Research Camp',
    goal: 'A field-base concept for players who care more about scouting, spawns, and route planning than decoration density.',
    layout: 'Use clear sections for weather notes, target Pokemon, food preparation, and return storage. Keep the camp readable from a single camera angle.',
    bestFor: 'Habitat Planner users, Spawn Tracker checks, rare farming loops',
  },
]

const showcaseRules = [
  'Use only official images, your own screenshots, or screenshots with explicit permission.',
  'Credit the image source near the image or at the end of the page.',
  'Describe the design goal, not just the decoration list.',
  'Explain what makes the build useful for routes, recipes, Pokemon visits, or multiplayer.',
]

const relatedPages = [
  { name: 'Pokopia Beginner Route', url: '/guides/beginner-route' },
  { name: 'Recipe Planning Route', url: '/guides/recipe-planning-route' },
  { name: 'Habitat Planner', url: '/tools/habitat-planner' },
  { name: 'Community Guidelines', url: '/community' },
]

const faqs = [
  {
    question: 'Does this page use player screenshots?',
    answer: 'No. This version uses text-based design concepts only. Player screenshots should be added only when they are owned by the site, submitted with permission, or clearly licensed for use.',
  },
  {
    question: 'What makes a good Pokopia home design page?',
    answer: 'A strong page explains the goal, movement path, useful stations, Pokemon or habitat connection, and source of any image. It should not be only a gallery with thin captions.',
  },
  {
    question: 'Can these ideas become real community showcase pages later?',
    answer: 'Yes. The structure is designed to support future verified screenshots, source labels, player notes, and editorial review dates without changing the URL strategy.',
  },
]

export const metadata: Metadata = {
  title: 'Pokopia Home Design Ideas and Building Showcase',
  description: 'Text-based Pokopia home design ideas for cozy bases, recipe workshops, visitor courtyards, and habitat research camps, with source rules for future screenshots.',
  alternates: {
    canonical: canonicalUrl(pageUrl),
  },
  openGraph: {
    title: 'Pokopia Home Design Ideas and Building Showcase',
    description: 'Cozy and practical Pokopia building concepts that can later support verified community screenshots.',
    images: ['/og-image.svg'],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Home Design Ideas and Building Showcase',
    description: 'Design ideas for Pokopia homes, bases, workshops, and future community showcases.',
    images: ['/og-image.svg'],
  },
}

export default function HomeDesignIdeasPage() {
  return (
    <main className="topic-page page-shell">
      <ArticleJsonLd
        title="Pokopia Home Design Ideas and Building Showcase"
        description="Text-based Pokopia home design ideas for cozy bases, recipe workshops, visitor courtyards, and habitat research camps."
        url={pageUrl}
        publishedAt={reviewedAt}
        modifiedAt={reviewedAt}
        image={`${BASE_URL}/og-image.svg`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Builds', url: '/builds' },
          { name: 'Home Design Ideas', url: pageUrl },
        ]}
      />
      <ItemListJsonLd
        name="Pokopia home design ideas"
        description="Design concepts for Pokopia homes, workshops, courtyards, and research camps."
        url={pageUrl}
        items={designIdeas.map((idea) => ({ name: idea.title, url: pageUrl }))}
      />
      <FAQJsonLd title="Pokopia Home Design Ideas FAQ" faqs={faqs} />

      <header className="topic-hero">
        <Link href="/builds" className="back-link">Back to Builds</Link>
        <div style={{ marginTop: '1rem' }}>
          <span className="badge team">Building Ideas</span>
        </div>
        <h1>Pokopia Home Design Ideas and Building Showcase</h1>
        <p>
          A practical starting point for Pokopia home layouts, cozy base concepts, and future community showcases. This page focuses on design goals and movement flow first, so it can stay useful even before verified screenshots are added.
        </p>
        <div className="topic-hero-actions">
          <a href="/tools/habitat-planner">Plan habitat routes</a>
          <a href="/community">Read submission rules</a>
        </div>
      </header>

      <DataStatus
        status="Editorial design ideas, no player screenshots yet"
        note="This page intentionally avoids unlicensed player images. Future showcase entries should include image permission, source credit, and a review date."
        updatedAt="May 27, 2026"
      />

      <OfficialContext
        title="Building Advice Should Stay Source-Aware"
        description="Official pages confirm Pokopia's building and cozy-life framing. Specific layouts here are editorial ideas, not official blueprint data."
        links={[
          { href: '/official/gameplay-overview', label: 'Gameplay overview' },
          { href: '/features/pokopia-animal-crossing', label: 'Cozy game comparison' },
          { href: '/copyright', label: 'Image source rules' },
        ]}
      />

      <section className="topic-section">
        <span className="panel-kicker">Design Principle</span>
        <h2>Build Around a Daily Loop, Not Decoration Density</h2>
        <p>
          The most useful Pokopia home design starts with a question: what should the player do here every day? A strong layout makes cooking, storage, crafting, Pokemon visits, and route preparation easy to read at a glance. Decoration still matters, but it should support movement instead of blocking it.
        </p>
        <p>
          For AdSense and SEO quality, building content should explain decisions. A page that only says “cute house idea” is thin. A page that explains task flow, station placement, Pokemon use, and route value gives readers something they can apply.
        </p>
      </section>

      <section className="topic-section">
        <span className="panel-kicker">Layout Ideas</span>
        <h2>Four Home Design Concepts to Start With</h2>
        <div className="topic-step-grid">
          {designIdeas.map((idea) => (
            <article key={idea.title} className="topic-step-card">
              <strong>{idea.title}</strong>
              <p>{idea.goal}</p>
              <p>{idea.layout}</p>
              <small>{idea.bestFor}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="topic-two-column">
        <section className="topic-section">
          <span className="panel-kicker">Practical Checklist</span>
          <h2>Before Publishing a Showcase</h2>
          <ul>
            {showcaseRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>

        <section className="topic-section">
          <span className="panel-kicker">What to Describe</span>
          <h2>Useful Details for Readers</h2>
          <ul>
            <li>Main design goal, such as cooking, visitors, farming, or screenshots.</li>
            <li>Movement path from entrance to the most-used stations.</li>
            <li>Related Pokemon, recipes, habitats, or multiplayer context.</li>
            <li>What you would change after more materials or space become available.</li>
          </ul>
        </section>
      </section>

      <section className="topic-section">
        <span className="panel-kicker">Related Planning Pages</span>
        <h2>Connect Design Ideas to Real Routes</h2>
        <div className="topic-resource-grid">
          {relatedPages.map((item) => (
            <a key={item.url} href={item.url} className="card">
              <span className="badge guides">Related</span>
              <h3>{item.name}</h3>
              <p>Use this page to connect home layouts with routes, recipes, tools, or community submission standards.</p>
            </a>
          ))}
        </div>
      </section>

      <section className="topic-faq">
        <span className="panel-kicker">FAQ</span>
        <h2>Home Design and Showcase Questions</h2>
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
