import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'
import { DataStatus } from '@/components/content/DataStatus'
import { OfficialContext } from '@/components/content/OfficialContext'
import { noIndexMetadata } from '@/lib/indexing'

export const metadata: Metadata = {
  title: 'Pokopia Build Planning Standards',
  description: 'Read Pokopia build planning standards for team roles, habitat routes, recipe timing, evidence notes, and internal links.',
  robots: noIndexMetadata,
  keywords: [
    'Pokopia builds',
    'Pokopia build planning',
    'Pokopia team builds',
    'Pokopia community builds',
    'Pokopia build submission',
    'Pokopia best build',
    'Pokopia build guide',
  ],
  openGraph: {
    title: 'Pokopia Build Planning Standards',
    description: 'Team roles, habitat routes, recipe timing, evidence notes, and internal links for Pokopia build planning.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Build Planning Standards',
    description: 'Team roles, habitat routes, recipe timing, evidence notes, and internal links for Pokopia build planning.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/builds'),
  },
}

export default function BuildsPage() {
  return (
    <main className="page-shell">
      <section className="page-hero">
        <h1>Pokopia Build Planning Standards</h1>
        <p>A practical framework for team roles, habitats, recipes, route evidence, and internal links.</p>
      </section>

      <DataStatus
        status="Reviewed planning standards"
        note="This page explains the standards used before a build note is linked from guides or tools: route purpose, Pokemon roles, recipe timing, source context, and a review date."
        updatedAt="2026-05-23"
      />

      <OfficialContext
        title="Build Advice Needs Source Context"
        description="Use official pages for confirmed gameplay and multiplayer rules. Build notes on this site should be treated as editorial planning until they are backed by verified testing."
        links={[
          { href: '/official/gameplay-overview', label: 'Gameplay overview' },
          { href: '/official/multiplayer-gameshare-cloud-island', label: 'Multiplayer rules' },
          { href: '/features/meta-analysis', label: 'Systems analysis' },
        ]}
      />

      <section className="index-guide-panel">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Build Workflow</span>
            <h2>Start With a Route, Not a Ranking</h2>
          </div>
          <a href="/builds/home-design-ideas">Home design ideas</a>
        </div>
        <div className="index-guide-grid">
          <div className="index-guide-card">
            <strong>Home design ideas</strong>
            <p>Use text-based layout concepts for cozy bases, visitor courtyards, recipe workshops, and showcase-ready route notes.</p>
            <div>
              <a href="/builds/home-design-ideas">Open ideas</a>
              <a href="/features/pokopia-animal-crossing">Cozy comparison</a>
              <a href="/community">Submission rules</a>
            </div>
          </div>
          <div className="index-guide-card">
            <strong>Progression build</strong>
            <p>Use this path when the goal is safer unlocks, cleaner habitat scouting, and fewer wasted recipe attempts.</p>
            <div>
              <a href="/guides/best-starter-pokemon">Starter guide</a>
              <a href="/tools/team-builder">Team Builder</a>
              <a href="/wiki/pokemon">Pokemon database</a>
            </div>
          </div>
          <div className="index-guide-card">
            <strong>Farming build</strong>
            <p>Use this path when the route already works and the next question is how to repeat rare checks more efficiently.</p>
            <div>
              <a href="/guides/fast-farming-rare-pokemon">Rare farming</a>
              <a href="/tools/habitat-planner">Habitat Planner</a>
              <a href="/tools/recipe-calculator">Recipe Calculator</a>
            </div>
          </div>
          <div className="index-guide-card">
            <strong>Hard route build</strong>
            <p>Use this path when damage alone is not enough and the route needs survival, timing, and role coverage.</p>
            <div>
              <a href="/guides/best-defense-team-pokopia">Defense guide</a>
              <a href="/wiki/habitat">Habitat index</a>
              <a href="/tier-list">Priority index</a>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <h2>What a Build Page Should Include</h2>
        <div className="grid-3">
          <article className="card">
            <span className="badge guides">Role</span>
            <h3>Pokemon Job</h3>
            <p>Explain whether the Pokemon is used for gathering, movement, support, durability, or habitat setup. Avoid claiming it is the best unless there is verified evidence.</p>
          </article>
          <article className="card">
            <span className="badge habitat">Route</span>
            <h3>Habitat Match</h3>
            <p>List the habitats, weather notes, resource goals, and unlock assumptions that make the build useful.</p>
          </article>
          <article className="card">
            <span className="badge recipe">Food</span>
            <h3>Recipe Window</h3>
            <p>Describe when a recipe or buff is worth using, then link to the recipe page for ingredients and duration.</p>
          </article>
        </div>
      </section>

      <section className="content-section">
        <h2>Current Editorial Standards</h2>
        <ul className="check-list">
          <li>Do not publish fake player names, fake screenshots, fake performance numbers, or unverifiable ranked-table claims.</li>
          <li>Label database-based advice as editorial until it is confirmed by official sources or tested player evidence.</li>
          <li>Link every build note to related Pokemon, habitats, recipes, and official context pages.</li>
          <li>Record the review date so readers know whether the page may need rechecking after updates.</li>
        </ul>
      </section>

      <section className="content-section">
        <h2>Build Review Checklist</h2>
        <div className="grid-3">
          <article className="card">
            <span className="badge official">Evidence</span>
            <h3>Source or Test Basis</h3>
            <p>A build should say whether it comes from official information, site database planning, or repeated player testing.</p>
          </article>
          <article className="card">
            <span className="badge farming">Failure Case</span>
            <h3>When It Breaks</h3>
            <p>Strong build notes explain the matchups, weather, missing food, or route conditions that make the build unreliable.</p>
          </article>
          <article className="card">
            <span className="badge team">Next Page</span>
            <h3>Internal Links</h3>
            <p>Every build should point readers to Pokemon pages, habitat pages, recipe pages, and relevant guides for verification.</p>
          </article>
        </div>
      </section>
    </main>
  )
}
