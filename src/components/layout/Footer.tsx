import Link from 'next/link'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p>&copy; 2026 Pokopia Portal</p>
        <div>
          <Link href="/search">Search</Link>
          <Link href="/tools">Tools</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/wiki/pokemon">Pokemon Database</Link>
        </div>
      </div>
    </footer>
  )
}
