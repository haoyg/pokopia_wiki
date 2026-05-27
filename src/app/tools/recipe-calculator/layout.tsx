import type { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Pokopia Recipe Calculator - Recipe Buffs, Timing, and Route Planning',
  description: 'Compare Pokopia recipes by route goal, rarity, buff timing, common mistakes, related Pokemon, and habitat support before spending ingredients.',
  openGraph: {
    title: 'Pokopia Recipe Calculator - Recipe Buffs, Timing, and Route Planning',
    description: 'Compare Pokopia recipes by route goal, rarity, buff timing, common mistakes, related Pokemon, and habitat support before spending ingredients.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Recipe Calculator - Recipe Buffs, Timing, and Route Planning',
    description: 'Compare Pokopia recipes by route goal, rarity, buff timing, common mistakes, related Pokemon, and habitat support before spending ingredients.',
    images: ['/og-image.svg'],
  },
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
