import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'
import { DataStatus } from '@/components/content/DataStatus'
import { OfficialContext } from '@/components/content/OfficialContext'

export const metadata: Metadata = {
  title: 'Community Guidelines',
  description: 'Read Pokopia Portal community contribution guidelines, source rules, and future submission standards.',
  keywords: [
    'Pokopia community',
    'Pokopia community guidelines',
    'Pokopia contribute',
    'Pokopia build submission',
    'Pokopia screenshot guidelines',
    'Pokopia source rules',
  ],
  alternates: {
    canonical: canonicalUrl('/community'),
  },
}

export default function CommunityPage() {
  return (
    <main className="page-shell">
      <section className="page-hero">
        <h1>Community Guidelines</h1>
        <p>Submission rules for future screenshots, build notes, route testing, and source-backed corrections.</p>
      </section>

      <DataStatus
        status="Guidelines page"
        note="Pokopia Portal is not currently hosting a public forum or live player-submission feed. This page defines the verification standard for future community content."
        updatedAt="2026-05-23"
      />

      <OfficialContext
        title="Community Content Must Stay Verifiable"
        description="Community notes should support the official-source baseline instead of replacing it. Claims about updates, events, or multiplayer rules need a clear source."
        links={[
          { href: '/official/gameplay-overview', label: 'Gameplay overview' },
          { href: '/official/multiplayer-gameshare-cloud-island', label: 'Multiplayer rules' },
          { href: '/contact', label: 'Contact' },
        ]}
      />

      <section className="index-guide-panel">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Contribution Paths</span>
            <h2>What Community Notes Should Support</h2>
          </div>
          <a href="/community/showcase">Open showcase index</a>
        </div>
        <div className="index-guide-grid">
          <div className="index-guide-card">
            <strong>Community showcase</strong>
            <p>Future showcase entries need permission, source credit, review dates, and links to related site pages.</p>
            <div>
              <a href="/community/showcase">Showcase index</a>
              <a href="/builds/home-design-ideas">Home designs</a>
              <a href="/copyright">Image rules</a>
            </div>
          </div>
          <div className="index-guide-card">
            <strong>Image corrections</strong>
            <p>Use this path for better official media, licensed screenshots, clearer source labels, or removal requests.</p>
            <div>
              <a href="/copyright">Copyright</a>
              <a href="/contact">Contact</a>
              <a href="/official">Official hub</a>
            </div>
          </div>
          <div className="index-guide-card">
            <strong>Route observations</strong>
            <p>Useful route notes should include habitat, weather, target Pokemon, repeated attempts, and a review date.</p>
            <div>
              <a href="/wiki/habitat">Habitats</a>
              <a href="/tools/spawn-tracker">Spawn Tracker</a>
              <a href="/tools/habitat-planner">Habitat Planner</a>
            </div>
          </div>
          <div className="index-guide-card">
            <strong>Build feedback</strong>
            <p>Build feedback should explain role coverage, recipe timing, and the specific route where the team was tested.</p>
            <div>
              <a href="/builds">Build standards</a>
              <a href="/tools/team-builder">Team Builder</a>
              <a href="/tools/recipe-calculator">Recipe Calculator</a>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <h2>Accepted Contribution Types</h2>
        <div className="grid-3">
          <article className="card">
            <span className="badge source-roundup">Screenshot</span>
            <h3>Player Screenshots</h3>
            <p>Screenshots should include the capture context, page or location shown, and permission to display the image with source credit.</p>
          </article>
          <article className="card">
            <span className="badge guides">Route Test</span>
            <h3>Habitat Notes</h3>
            <p>Route notes should list the habitat, weather, Pokemon involved, repeated observations, and whether the result is confirmed or still tentative.</p>
          </article>
          <article className="card">
            <span className="badge official">Correction</span>
            <h3>Source Corrections</h3>
            <p>Corrections should include the official page, article, screenshot, or tested evidence that supports the change.</p>
          </article>
        </div>
      </section>

      <section className="content-section">
        <h2>Content Rules</h2>
        <ul className="check-list">
          <li>No fake player quotes, fake ranked tables, fake event dates, or invented patch notes.</li>
          <li>Images need a source label such as official media, player screenshot, or open-license image.</li>
          <li>Advice based on player testing must include conditions, repeated observations, and a review date.</li>
          <li>Official claims should link to Nintendo, The Pokemon Company, or other clearly identified primary sources.</li>
        </ul>
      </section>

      <section className="content-section">
        <h2>Review Priority</h2>
        <div className="grid-3">
          <article className="card">
            <span className="badge official">Highest</span>
            <h3>Official Source Updates</h3>
            <p>New Nintendo or Pokemon source pages, release details, feature descriptions, and correction requests should be reviewed first.</p>
          </article>
          <article className="card">
            <span className="badge source-roundup">High</span>
            <h3>Media Source Fixes</h3>
            <p>Image ownership, attribution, source clarity, and takedown requests take priority over normal guide expansion.</p>
          </article>
          <article className="card">
            <span className="badge guides">Normal</span>
            <h3>Editorial Suggestions</h3>
            <p>Route tips, build ideas, and recipe suggestions are useful when they include conditions and avoid unverifiable ranking claims.</p>
          </article>
        </div>
      </section>
    </main>
  )
}
