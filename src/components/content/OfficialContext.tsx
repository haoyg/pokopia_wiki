interface OfficialContextLink {
  href: string
  label: string
}

interface OfficialContextProps {
  title?: string
  description?: string
  links?: OfficialContextLink[]
}

const defaultLinks: OfficialContextLink[] = [
  { href: '/official/gameplay-overview', label: 'Gameplay overview' },
  { href: '/official/release-date-platform-price', label: 'Release details' },
  { href: '/official/official-beginner-tips', label: 'Beginner tips' },
]

export function OfficialContext({
  title = 'Official Context',
  description = 'Use these official-source pages to separate confirmed Pokémon Pokopia information from editorial route advice and database notes.',
  links = defaultLinks,
}: OfficialContextProps) {
  return (
    <aside className="official-context" aria-label="Official Pokopia context">
      <div>
        <span className="official-context-label">Official Source Roundup</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="official-context-links">
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </aside>
  )
}
