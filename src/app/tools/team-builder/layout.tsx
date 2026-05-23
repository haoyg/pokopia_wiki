import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Team Builder',
  description: 'Draft Pokopia teams by role, type, rarity, and database-based planning notes.',
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
