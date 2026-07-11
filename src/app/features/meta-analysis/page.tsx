import type { Metadata } from 'next'
import Link from 'next/link'
import { BASE_URL, canonicalUrl } from '@/lib/site'
import { DataStatus } from '@/components/content/DataStatus'
import { OfficialContext } from '@/components/content/OfficialContext'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'

const pageUrl = '/features/meta-analysis'
const reviewedAt = '2026-07-11'

const sourceReviewNotes = [
  'Uses official gameplay, multiplayer, and beginner-tip pages as the source baseline before making site content recommendations.',
  'Treats database, guide, recipe, and habitat notes as editorial unless a specific official source supports the detail.',
  'Uses this page to define site content standards, not to publish final mechanics, rankings, or event rules.',
]

const recheckTriggers = [
  'Official pages add new gameplay systems, multiplayer rules, beginner guidance, or support details.',
  'A guide or database page cites this analysis to support a more specific claim.',
  'The site changes which pages are eligible for sitemap or search-index inclusion.',
]

export const metadata: Metadata = {
  title: 'Pokémon Pokopia Confirmed Systems Analysis',
  description: 'Editorial analysis of officially confirmed Pokémon Pokopia systems, including Ditto, moves, crafting, food, multiplayer, and beginner routines.',
  alternates: {
    canonical: canonicalUrl(pageUrl),
  },
  openGraph: {
    title: 'Pokémon Pokopia Confirmed Systems Analysis',
    description: 'A source-aware editorial explainer based on official Nintendo and Pokémon information.',
    images: ['/og-image.svg'],
    type: 'article',
  },
}

export default function MetaAnalysisPage() {
  return (
    <main style={{ maxWidth: '820px', margin: '0 auto', padding: '2rem 1rem' }}>
      <ArticleJsonLd
        title="Pokemon Pokopia Confirmed Systems Analysis"
        description="A source-aware editorial explainer based on official Nintendo and Pokemon information."
        url={pageUrl}
        publishedAt={reviewedAt}
        modifiedAt={reviewedAt}
        image={`${BASE_URL}/og-image.svg`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Features', url: '/features' },
          { name: 'Confirmed Systems Analysis', url: pageUrl },
        ]}
      />
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/features" style={{ fontSize: '0.875rem', color: '#666' }}>
          Back to Features
        </Link>
        <div style={{ marginTop: '1rem' }}>
          <span className="badge source-roundup">Editorial Explainer</span>
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '1rem', lineHeight: 1.2 }}>
          Pokémon Pokopia Confirmed Systems Analysis
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#666', marginTop: '1rem', lineHeight: 1.7 }}>
          A source-aware analysis of what official Nintendo and Pokémon pages confirm about Pokémon Pokopia, and how those systems should shape editorial guides on this site.
        </p>
        <DataStatus
          status="Editorial analysis based on official sources"
          note="This feature does not use competitive match data, player interviews, or unsourced rankings. It interprets confirmed information from official pages and links to the relevant source roundups."
          updatedAt="July 11, 2026"
        />
        <OfficialContext
          title="Official Sources Behind This Analysis"
          description="Read the official-source roundups before treating any strategy page as confirmed game data."
          links={[
            { href: '/official/gameplay-overview', label: 'Gameplay overview' },
            { href: '/official/multiplayer-gameshare-cloud-island', label: 'Multiplayer' },
            { href: '/official/official-beginner-tips', label: 'Official tips' },
          ]}
        />
      </header>

      <article style={{ lineHeight: 1.8, fontSize: '1.0625rem' }}>
        <h2>Executive Summary</h2>
        <p>
          Official materials position Pokémon Pokopia as a cozy creation and life-simulation game. The confirmed loop is not built around competitive ladders or patch-driven rankings; it is built around a human-like Ditto, Pokémon moves, gathering materials, crafting, growing crops, building habitats, and inviting Pokémon or friends into created spaces.
        </p>
        <p>
          For Pokopia Portal, that means the safest content model is clear: official pages should document confirmed systems, while guides should be labeled as editorial route planning. Database pages can help readers plan, but they should not imply that every spawn, drop, or tier claim is official.
        </p>

        <h2>Source Review Notes</h2>
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

        <h2>1. Ditto Is the Core Framing Device</h2>
        <p>
          Official sources describe the player character as a Ditto transformed to look like a human. This matters because the game is framed around learning from Pokémon and using those learned actions to reshape the world.
        </p>
        <p>
          Editorial guide implication: beginner content should focus on what Ditto can do, which systems unlock new options, and how players can organize tasks. It should not read like a traditional battle-first team optimization guide unless an official source supports that framing.
        </p>

        <h2>2. Moves Are Utility Systems, Not Just Combat Buttons</h2>
        <p>
          Nintendo examples such as Leafage, Surf, and Glide show that moves can affect exploration, traversal, or world-building. This changes how guide content should discuss moves.
        </p>
        <p>
          Editorial guide implication: when a page discusses a move, it should explain the practical job the move supports, such as crossing water, reaching areas, shaping terrain, or supporting habitat creation. Damage-only rankings are not the right default for confirmed Pokopia coverage.
        </p>

        <h2>3. Food and Recipes Need Careful Wording</h2>
        <p>
          Nintendo's beginner tips mention food powering up Ditto's moves. That gives a confirmed basis for recipe-related guides, but it does not confirm every recipe, duration, or best-use claim on this site.
        </p>
        <p>
          Editorial guide implication: recipe pages should be phrased as planning advice unless their exact effect is official or player-tested. Phrases such as "must use" or "best in the game" should be avoided unless there is real evidence.
        </p>

        <h2>4. Multiplayer Has Distinct Modes and Permissions</h2>
        <p>
          Nintendo separates town visits, Spectator Mode, Palette Town, GameShare, Cloud Island, and Virtual Mode. These are not interchangeable terms.
        </p>
        <p>
          Editorial guide implication: community and build pages should specify which mode they are discussing. A normal town visit should not be described as unrestricted co-building if Nintendo describes Spectator Mode limits for that context.
        </p>

        <h2>5. The Best SEO Content Should Answer Practical System Questions</h2>
        <p>
          The strongest source-aligned topics are practical questions: what Pokémon Pokopia is, how building works, how food affects moves, what GameShare allows, what Cloud Island is, and how official beginner tips shape early play.
        </p>
        <p>
          Editorial guide implication: the site should prioritize source-backed explainers and clearly marked planning guides over unsourced claims about rankings, player status, balance changes, or live events.
        </p>

        <h2>Recommended Content Standard</h2>
        <ul>
          <li>Use official pages for confirmed release, platform, gameplay, multiplayer, and beginner information.</li>
          <li>Label guide, Pokémon, habitat, and recipe advice as editorial unless it is directly sourced.</li>
          <li>Avoid invented competitive statistics, player interviews, top guilds, patch predictions, and event claims.</li>
          <li>When a page uses site database data, say so near the top through Content Status.</li>
          <li>Prefer practical system explanations over authority claims that cannot be verified.</li>
        </ul>
      </article>

      <aside style={{ marginTop: '3rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Related Source Pages</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/official/gameplay-overview" style={{ color: '#e94560', fontWeight: 600 }}>
            Official Gameplay Overview
          </Link>
          <Link href="/official/official-beginner-tips" style={{ color: '#e94560', fontWeight: 600 }}>
            Official Beginner Tips
          </Link>
          <Link href="/news/pokopia-portal-official-editorial-labels" style={{ color: '#e94560', fontWeight: 600 }}>
            How We Label Official and Editorial Content
          </Link>
        </div>
      </aside>
    </main>
  )
}
