import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Pokopia Habitat Planner - Routes, Unlocks, Weather, and Spawns',
  description: 'Plan Pokopia habitat routes by goal, player level, difficulty, weather, recipe support, Pokemon spawns, and related guide links.',
  keywords: [
    'Pokopia habitat planner',
    'Pokopia habitat route',
    'best habitat Pokopia',
    'Pokopia unlock habitat',
    'Pokopia weather route',
    'Pokopia habitat difficulty',
    'Pokopia spawn route',
    'Pokopia resource farming',
  ],
  openGraph: {
    title: 'Pokopia Habitat Planner - Routes, Unlocks, Weather, and Spawns',
    description: 'Plan Pokopia habitat routes by goal, player level, difficulty, weather, recipe support, Pokemon spawns, and related guide links.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Habitat Planner - Routes, Unlocks, Weather, and Spawns',
    description: 'Plan Pokopia habitat routes by goal, player level, difficulty, weather, recipe support, Pokemon spawns, and related guide links.',
    images: ['/og-image.svg'],
  },
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
