import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'
import { DataStatus } from '@/components/content/DataStatus'
import { OfficialContext } from '@/components/content/OfficialContext'

export const metadata: Metadata = {
  title: 'Community Guidelines | Pokopia Portal',
  description: 'Read Pokopia Portal community contribution guidelines, source rules, and future submission standards.',
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
    </main>
  )
}
