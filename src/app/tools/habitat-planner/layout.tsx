import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Habitat Planner',
  description: 'Plan Pokopia habitat progression by player level, difficulty, and weather.',
  alternates: {
    canonical: canonicalUrl('/tools/habitat-planner'),
  },
}

export default function HabitatPlannerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
