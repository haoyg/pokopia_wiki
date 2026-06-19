import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Pokopia Team Builder - Roles, Type Coverage, Recipes, and Routes',
  description: 'Build Pokopia team drafts by goal, role, type coverage, recipe support, habitat routes, Pokemon links, and related guides.',
  keywords: [
    'Pokopia team builder',
    'Pokopia best team',
    'Pokopia team build',
    'Pokopia team composition',
    'Pokopia role team',
    'Pokopia type coverage',
    'Pokopia balanced team',
    'Pokopia boss team',
  ],
  openGraph: {
    title: 'Pokopia Team Builder - Roles, Type Coverage, Recipes, and Routes',
    description: 'Build Pokopia team drafts by goal, role, type coverage, recipe support, habitat routes, Pokemon links, and related guides.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Team Builder - Roles, Type Coverage, Recipes, and Routes',
    description: 'Build Pokopia team drafts by goal, role, type coverage, recipe support, habitat routes, Pokemon links, and related guides.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/tools/team-builder'),
  },
}

export default function TeamBuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
