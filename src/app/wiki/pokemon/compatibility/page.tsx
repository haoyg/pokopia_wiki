import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/JsonLd'
import CompatibilityClient from './CompatibilityClient'

export const metadata: Metadata = {
  title: 'Pokopia Pokemon Compatibility - Team Synergy Checker | Pokopia Cloud',
  description:
    'Check Pokopia Pokemon compatibility and team synergy. Pick two Pokemon to see role coverage, type matchups, defensive complement, and partner suggestions.',
  keywords: [
    'pokopia pokemon compatibility',
    'pokopia team synergy',
    'pokopia team builder',
    'pokopia type matchup',
    'pokopia best partners',
  ],
  openGraph: {
    title: 'Pokopia Pokemon Compatibility - Team Synergy Checker',
    description:
      'Check Pokopia Pokemon compatibility and team synergy. Pick two Pokemon to see role coverage, type matchups, defensive complement, and partner suggestions.',
    images: ['/og-image.svg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Pokemon Compatibility - Team Synergy Checker',
    description:
      'Check Pokopia Pokemon compatibility and team synergy. Pick two Pokemon to see role coverage, type matchups, defensive complement, and partner suggestions.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/wiki/pokemon/compatibility'),
  },
}

export default function CompatibilityPage() {
  return (
    <main style={{ maxWidth: '1060px', margin: '0 auto', padding: '2rem 1rem 3rem' }}>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Pokemon', url: '/wiki/pokemon' },
          { name: 'Compatibility', url: '/wiki/pokemon/compatibility' },
        ]}
      />
      <FAQJsonLd
        title="Pokopia Pokemon Compatibility FAQ"
        faqs={[
          {
            question: 'How does the Pokemon Compatibility tool work?',
            answer: 'Pick two Pokemon to see a synergy score based on role coverage, type coverage, defensive complement, habitat overlap, and weather preference. The tool then suggests Pokemon that complement the first pick.',
          },
          {
            question: 'What does the synergy score mean?',
            answer: 'The score reflects how well two Pokemon cover each other\'s weaknesses. A score of 4/5 or higher indicates strong synergy — the pair shares few vulnerabilities and covers different roles and habitats.',
          },
          {
            question: 'Why does habitat overlap matter?',
            answer: 'Pokemon from different habitats mean you can farm and level both without spending extra sessions in the same environment. It also gives the pair access to more material drop tables.',
          },
        ]}
      />
      <CompatibilityClient />
    </main>
  )
}
