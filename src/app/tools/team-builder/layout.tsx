import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Team Builder | Pokopia Portal',
  description: 'Build and compare Pokopia teams by role, type, and recommended team templates.',
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
