import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Recipe Calculator',
  description: 'Plan Pokopia recipes by route goal, rarity, timing, related Pokemon, and habitat links.',
  alternates: {
    canonical: canonicalUrl('/tools/recipe-calculator'),
  },
}

export default function RecipeCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
