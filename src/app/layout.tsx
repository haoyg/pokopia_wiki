import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Pokopia Portal',
    template: '%s | Pokopia Portal',
  },
  description: 'Your ultimate Pokopia wiki - guides, Pokemon database, habitat maps, recipes, and community builds.',
  keywords: ['Pokopia', 'Pokopia wiki', 'Pokopia guide', 'Pokopia tips', 'game guide'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Pokopia Portal',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
