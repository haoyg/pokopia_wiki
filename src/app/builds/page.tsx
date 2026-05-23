import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'
import { DataStatus } from '@/components/content/DataStatus'
import { OfficialContext } from '@/components/content/OfficialContext'

export const metadata: Metadata = {
  title: 'Build Planning Notes | Pokopia Portal',
  description: 'Read Pokopia build planning notes and submission standards for future verified community builds.',
  alternates: {
    canonical: canonicalUrl('/builds'),
  },
}

export default function BuildsPage() {
  return (
    <main className="page-shell">
      <section className="page-hero">
        <h1>Build Planning Notes</h1>
        <p>Editorial build framework for Pokemon roles, habitats, recipes, and future verified submissions.</p>
      </section>

      <DataStatus
        status="Editorial planning page"
        note="Pokopia Portal is not currently publishing user-submitted build rankings. Future community builds should include source notes, tested conditions, and the game version or review date."
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
    </main>
  )
}
