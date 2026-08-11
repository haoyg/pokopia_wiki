import type { Metadata } from 'next'
import Link from 'next/link'
import { canonicalUrl } from '@/lib/site'
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/JsonLd'
import { BASE_URL } from '@/lib/site'
import { DataStatus } from '@/components/content/DataStatus'
import RoommateMatchmakerClient from './RoommateMatchmakerClient'

const PAGE_URL = '/features/roommate-matchmaker'
const REVIEWED_AT = '2026-08-11'

const faqs = [
  {
    question: 'What makes a good roommate pair in Pokopia?',
    answer: 'A good roommate pair covers different roles, types, habitats, weather conditions, and time windows. The Roommate Matchmaker scores candidates across all five dimensions so you can quickly identify pairs that broaden your daily routine without leaving gaps.',
  },
  {
    question: 'Does a high score guarantee a good team?',
    answer: 'A score of 6 or above indicates strong complementary coverage, but team quality also depends on your current route goals, recipe support, and specific habitat difficulty. Use the Team Builder to validate full four-slot drafts before committing rare resources.',
  },
  {
    question: 'Can I use the matchmaker for legendary Pokemon?',
    answer: 'Yes. Legendary Pokemon work in the matchmaker the same as any other entry. Because legendary Pokemon often have restrictive habitat or weather conditions, finding a roommate from a different habitat or weather set can be especially valuable for keeping your routine flexible.',
  },
  {
    question: 'Why do different habitats matter for roommates?',
    answer: 'Pokemon from different habitats can be farmed in separate sessions without retracing the same ground. A roommate pair from different habitats effectively doubles the material drop tables you can access in a given play session.',
  },
]

const relatedPages = [
  { name: 'Team Builder', url: '/tools/team-builder' },
  { name: 'Spawn Tracker', url: '/tools/spawn-tracker' },
  { name: 'Habitat Planner', url: '/tools/habitat-planner' },
  { name: 'Pokemon Database', url: '/wiki/pokemon' },
  { name: 'Pokemon Compatibility Checker', url: '/wiki/pokemon/compatibility' },
]

export const metadata: Metadata = {
  title: 'Pokopia Roommate Matchmaker – Best Roommate Pairs | Pokopia Cloud',
  description:
    'Use the Pokopia Roommate Matchmaker to find the best roommate Pokemon for any team member. Scores role coverage, type complement, defensive synergy, habitat variety, and time-of-day balance.',
  keywords: [
    'pokopia roommate matchmaker',
    'pokopia roommate pairs',
    'pokopia best roommate',
    'pokopia social feature',
    'pokopia pokemon roommate',
    'pokopia team synergy',
  ],
  openGraph: {
    title: 'Pokopia Roommate Matchmaker – Best Roommate Pairs',
    description:
      'Find the best roommate Pokemon for any team member. Scores role coverage, type complement, defensive synergy, habitat variety, and time-of-day balance.',
    images: ['/og-image.svg'],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Roommate Matchmaker – Best Roommate Pairs',
    description:
      'Find the best roommate Pokemon for any team member. Scores role coverage, type complement, defensive synergy, habitat variety, and time-of-day balance.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl(PAGE_URL),
  },
}

export default function RoommateMatchmakerPage() {
  return (
    <main className="topic-page page-shell">
      <ArticleJsonLd
        title="Pokopia Roommate Matchmaker – Best Roommate Pairs"
        description="Use the Pokopia Roommate Matchmaker to find the best roommate Pokemon for any team member. Scores role coverage, type complement, defensive synergy, habitat variety, and time-of-day balance."
        url={PAGE_URL}
        publishedAt={REVIEWED_AT}
        modifiedAt={REVIEWED_AT}
        image={`${BASE_URL}/og-image.svg`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Features', url: '/features' },
          { name: 'Roommate Matchmaker', url: PAGE_URL },
        ]}
      />
      <FAQJsonLd title="Pokopia Roommate Matchmaker FAQ" faqs={faqs} />

      <header className="topic-hero">
        <Link href="/features" style={{ fontSize: '0.875rem', color: '#637083' }}>
          Back to Features
        </Link>
        <div style={{ marginTop: '1rem' }}>
          <span style={{
            display: 'inline-flex',
            padding: '0.3rem 0.7rem',
            borderRadius: '999px',
            background: 'rgba(47, 132, 216, 0.12)',
            color: '#2f84d8',
            fontSize: '0.78rem',
            fontWeight: 900,
            textTransform: 'uppercase',
          }}>
            Interactive Tool + Guide
          </span>
        </div>
        <h1>Pokopia Roommate Matchmaker</h1>
        <p>
          Find the best roommate Pokemon for any team member. The matchmaker scores every candidate
          by role coverage, type complement, defensive synergy, habitat variety, and time-of-day balance
          — so you can build roommate pairs that keep your daily routine flexible across weather,
          habitats, and spawn windows.
        </p>
        <div className="topic-hero-actions">
          <a href="/wiki/pokemon">Browse Pokemon</a>
          <a href="/tools/team-builder">Open Team Builder</a>
          <a href="/wiki/pokemon/compatibility">Check Compatibility</a>
        </div>
      </header>

      <DataStatus
        status="Editorial tool — scores are planning guidance"
        note="Roommate match scores reflect editorial planning criteria (role balance, type coverage, habitat variety, weather complement, time-of-day balance). They are not confirmed game balance data or official roommate rankings."
        updatedAt="August 11, 2026"
        showPolicyLink
      />

      <RoommateMatchmakerClient />

      {/* Related pages */}
      <section className="topic-section">
        <span className="panel-kicker">Continue Planning</span>
        <h2>Related Tools and Pages</h2>
        <div className="topic-resource-grid">
          {relatedPages.map((page) => (
            <a key={page.url} href={page.url} className="card">
              <span style={{ color: '#2f84d8', fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase' }}>Tool</span>
              <h3 style={{ marginTop: '0.35rem', fontSize: '0.95rem' }}>{page.name}</h3>
              <p style={{ fontSize: '0.82rem', marginTop: '0.35rem' }}>
                Continue your team planning workflow with related tools and database pages.
              </p>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
