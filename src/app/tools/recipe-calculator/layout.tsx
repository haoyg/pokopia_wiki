import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Recipe Calculator',
  description: 'Compare Pokopia recipe buffs, ingredients, duration, and database-based timing notes.',
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
