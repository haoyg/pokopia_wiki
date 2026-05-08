import type { Metadata } from 'next'
import './globals.css'
import { WebsiteJsonLd } from '@/components/seo/JsonLd'

const BASE_URL = 'https://pokopia.wiki'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Pokopia Portal',
    template: '%s | Pokopia Portal',
  },
  description: 'Your ultimate Pokopia wiki - guides, Pokemon database, habitat maps, recipes, and community builds.',
  keywords: [
    'Pokopia',
    'Pokopia wiki',
    'Pokopia guide',
    'Pokopia tips',
    'Pokopia Pokemon',
    'Pokopia habitat',
    'game guide',
    'Pokemon game',
    'gaming wiki',
  ],
  authors: [{ name: 'Pokopia Portal' }],
  creator: 'Pokopia Portal',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Pokopia Portal',
    title: 'Pokopia Portal - Your Ultimate Gaming Wiki',
    description: 'Guides, Pokemon database, habitat maps, recipes, and community builds for Pokopia.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pokopia Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Portal',
    description: 'Your ultimate Pokopia wiki - guides, Pokemon database, and more.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <WebsiteJsonLd />
      </head>
      <body>{children}</body>
    </html>
  )
}
