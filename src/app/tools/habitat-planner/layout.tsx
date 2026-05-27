import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Pokopia Habitat Planner - Routes, Unlocks, Weather, and Spawns',
  description: 'Plan Pokopia habitat routes by goal, player level, difficulty, weather, recipe support, Pokemon spawns, and related guide links.',
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
