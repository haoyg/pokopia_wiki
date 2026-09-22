import Link from 'next/link'

const footerGroups = [
  {
    title: 'Start',
    links: [
      { href: '/', label: 'Home' },
      { href: '/official', label: 'Official Source Roundups' },
      { href: '/news', label: 'News Hub' },
      { href: '/official/gameplay-overview', label: 'Gameplay Overview' },
      { href: '/news/weekly-event-tracker', label: 'Event Tracker' },
    ],
  },
  {
    title: 'Official Info',
    links: [
      { href: '/official', label: 'Official Info Hub' },
      { href: '/official/release-date-platform-price', label: 'Release and Platform' },
      { href: '/official/gameplay-overview', label: 'Gameplay Overview' },
      { href: '/official/official-beginner-tips', label: 'Official Beginner Tips' },
      { href: '/official/multiplayer-gameshare-cloud-island', label: 'Multiplayer Rules' },
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
    title: 'Trust',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/editorial-policy', label: 'Editorial Policy' },
      { href: '/source-policy', label: 'Source Policy' },
      { href: '/corrections', label: 'Corrections' },
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
          <p>&copy; 2026 Pokopia Portal. Independent source-checked information, news roundups, and editorial features.</p>
          <p>Unofficial fan resource. Not affiliated with, endorsed by, or sponsored by Nintendo, The Pokémon Company, Game Freak, Creatures Inc., or other rights holders.</p>
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
