import Link from 'next/link'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/official', label: 'Official' },
  { href: '/news', label: 'News' },
  { href: '/guides', label: 'Guides' },
  { href: '/tools', label: 'Tools' },
  { href: '/features', label: 'Features' },
  { href: '/about', label: 'About' },
]

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-brand" aria-label="Pokopia Portal home">
          <img
            className="site-brand-logo"
            src="/logo.png"
            alt="Pokopia Portal logo"
            width={180}
            height={90}
          />
        </Link>

        <form className="site-search" action="/search" role="search">
          <input
            type="search"
            name="q"
            placeholder="Search Pokemon, guides, habitats..."
            aria-label="Search Pokopia Portal"
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <nav className="site-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
