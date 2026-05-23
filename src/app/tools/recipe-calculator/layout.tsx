import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Recipe Calculator | Pokopia Portal',
  description: 'Calculate Pokopia recipe buffs and find the best recipes for your build.',
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
