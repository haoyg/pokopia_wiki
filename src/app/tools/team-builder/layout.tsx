import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Team Builder',
  description: 'Build Pokopia teams by goal, role, type, recipe support, habitat routes, and guide links.',
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
