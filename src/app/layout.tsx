import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pokopia Portal',
  description: 'Your ultimate Pokopia wiki, guides, and community hub',
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
