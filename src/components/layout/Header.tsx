import Link from 'next/link'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/official', label: 'Official' },
  { href: '/news', label: 'News' },
  { href: '/guides', label: 'Guides' },
  { href: '/wiki/pokemon', label: 'Pokemon' },
  { href: '/wiki/habitat', label: 'Habitats' },
  { href: '/wiki/recipe', label: 'Recipes' },
  { href: '/tier-list', label: 'Tier List' },
  { href: '/tools', label: 'Tools' },
  { href: '/features', label: 'Features' },
  { href: '/builds', label: 'Builds' },
  { href: '/community', label: 'Community' },
]

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-brand" aria-label="Pokopia Portal home">
          <img
            className="site-brand-logo"
            src="/logo.svg"
            alt="Pokopia Portal logo"
            width={40}
            height={40}
          />
          <span>
            <strong>Pokopia Portal</strong>
            <small>Guides, news, wiki, tools</small>
          </span>
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
