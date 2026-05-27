import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Pokopia Recipe Calculator - Recipe Buffs, Timing, and Route Planning',
  description: 'Compare Pokopia recipes by route goal, rarity, buff timing, common mistakes, related Pokemon, and habitat support before spending ingredients.',
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
