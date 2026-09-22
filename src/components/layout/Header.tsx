'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/wiki/pokemon', label: 'Pokemon' },
  { href: '/wiki/habitat', label: 'Habitats' },
  { href: '/wiki/recipe', label: 'Recipes' },
  { href: '/guides', label: 'Guides' },
  { href: '/tier-list', label: 'Tier List' },
  { href: '/news', label: 'News' },
  { href: '/tools', label: 'Tools' },
  { href: '/builds', label: 'Builds' },
]

export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-brand">
          <img
            className="site-brand-logo"
            src="/logo.svg"
            alt="Pokopia Portal logo"
            width={40}
            height={40}
          />
          <span>
            <strong>Pokopia Portal</strong>
            <small>Source-aware wiki and tools</small>
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

        <button
          className="site-menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">{menuOpen ? 'Close' : 'Menu'}</span>
          <span className="sr-only">{menuOpen ? 'Close main navigation' : 'Open main navigation'}</span>
        </button>
      </div>

      <nav id="site-navigation" className="site-nav" aria-label="Main navigation" data-open={menuOpen}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`)) ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
