import type { Metadata } from 'next'
import './globals.css'
import { WebsiteJsonLd } from '@/components/seo/JsonLd'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BASE_URL } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Pokopia Portal',
    template: '%s | Pokopia Portal',
  },
  description: 'Independent Pokopia wiki with official source roundups, guides, Pokemon database pages, habitat notes, recipes, and planning tools.',
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
  icons: {
    icon: [{ url: '/logo.png', sizes: '512x512', type: 'image/png' }],
    shortcut: ['/logo.png'],
    apple: [{ url: '/logo.png', sizes: '512x512', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Pokopia Portal',
    title: 'Pokopia Portal - Pokopia Wiki, Guides, and Source Notes',
    description: 'Official source roundups, guides, Pokemon database pages, habitat notes, recipes, and tools for Pokopia.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Pokopia Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Portal',
    description: 'Pokopia wiki with official source notes, guides, Pokemon database pages, recipes, and tools.',
    images: ['/og-image.svg'],
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
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3274781156049995" crossOrigin="anonymous" />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
