import Link from 'next/link'

const footerGroups = [
  {
    title: 'Start',
    links: [
      { href: '/', label: 'Home' },
      { href: '/official', label: 'Official Info' },
      { href: '/news', label: 'News Hub' },
      { href: '/guides/beginner-route', label: 'Beginner Route' },
      { href: '/news/weekly-event-tracker', label: 'Event Tracker' },
      { href: '/search', label: 'Search' },
    ],
  },
  {
    title: 'Guides',
    links: [
      { href: '/guides', label: 'Guides Hub' },
      { href: '/guides/legendary-locations-guide', label: 'Legendary Locations' },
      { href: '/guides/frost-peak-guide', label: 'Frost Peak Guide' },
      { href: '/guides/thunder-arena-guide', label: 'Thunder Arena Guide' },
      { href: '/guides/rare-farming-route', label: 'Rare Farming' },
      { href: '/guides/recipe-planning-route', label: 'Recipe Planning' },
    ],
  },
  {
    title: 'Features',
    links: [
      { href: '/features', label: 'Features Hub' },
      { href: '/features/pokopia-animal-crossing', label: 'Pokopia vs Animal Crossing' },
      { href: '/features/creative-play-ideas', label: 'Creative Play' },
      { href: '/features/friendship-requests-tracker', label: 'Friendship Requests' },
      { href: '/features/meta-analysis', label: 'Systems Analysis' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { href: '/tools', label: 'Tools Hub' },
      { href: '/tools/habitat-planner', label: 'Habitat Planner' },
      { href: '/tools/recipe-calculator', label: 'Recipe Calculator' },
      { href: '/tools/team-builder', label: 'Team Builder' },
      { href: '/tools/spawn-tracker', label: 'Spawn Tracker' },
    ],
  },
  {
    title: 'Trust',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/copyright', label: 'Copyright' },
      { href: '/disclaimer', label: 'Disclaimer' },
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <strong>Pokopia Portal</strong>
          <p>&copy; 2026 Pokopia Portal. Independent source-aware guides, wiki pages, planning tools, and editorial features.</p>
        </div>
        <nav className="site-footer-nav" aria-label="Footer navigation">
          {footerGroups.map((group) => (
            <section key={group.title} className="site-footer-group">
              <h2>{group.title}</h2>
              <div>
                {group.links.map((link) => (
                  <Link key={link.href} href={link.href}>{link.label}</Link>
                ))}
              </div>
            </section>
          ))}
        </nav>
      </div>
    </footer>
  )
}
