import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
}

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-hero">
        <div className="not-found-pokeball">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
            <circle cx="50" cy="50" r="45" fill="#ff5c7a"/>
            <rect x="5" y="47" width="90" height="6" fill="#1a1a2e"/>
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1a1a2e" stroke-width="4"/>
            <circle cx="50" cy="50" r="15" fill="#ffffff" stroke="#1a1a2e" stroke-width="4"/>
          </svg>
        </div>
        <h1>404</h1>
        <p className="not-found-subtitle">Page Not Found</p>
        <p className="not-found-desc">
          The page you are looking for has been moved, deleted, or never existed.
        </p>
      </div>

      <div className="not-found-links">
        <h2>You might be looking for</h2>
        <div className="not-found-grid">
          <Link href="/official/official-beginner-tips">
            <span className="badge guides">Guide</span>
            <strong>Official Beginner Tips</strong>
            <span>Start with confirmed guidance</span>
          </Link>
          <Link href="/guides">
            <span className="badge tier">Guides</span>
            <strong>Source-Backed Guides</strong>
            <span>Browse reviewed route pages</span>
          </Link>
          <Link href="/tools/habitat-planner">
            <span className="badge farming">Tool</span>
            <strong>Habitat Planner</strong>
            <span>Plan your farming routes</span>
          </Link>
          <Link href="/news">
            <span className="badge update">News</span>
            <strong>Latest News</strong>
            <span>Source roundups and updates</span>
          </Link>
        </div>
      </div>

      <div className="not-found-search">
        <p>Or search for something specific</p>
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

      <div className="not-found-home">
        <Link href="/">Back to Home</Link>
      </div>
    </main>
  )
}
