import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Habitat Planner',
  description: 'Plan Pokopia habitat routes by goal, level, difficulty, weather, recipes, Pokemon spawns, and guide links.',
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
