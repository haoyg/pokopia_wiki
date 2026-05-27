import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Pokopia Team Builder - Roles, Type Coverage, Recipes, and Routes',
  description: 'Build Pokopia team drafts by goal, role, type coverage, recipe support, habitat routes, Pokemon links, and related guides.',
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
