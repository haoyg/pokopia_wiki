'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { popularSearches, searchContent } from '@/lib/search'

export function SearchClient() {
  const searchParams = useSearchParams()
  const query = (searchParams.get('q') || '').trim()
  const results = searchContent(query)

  return (
    <>
      <form className="search-page-form" action="/search">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Try legendary, fire team, Frost Peak..."
          aria-label="Search query"
        />
        <button type="submit">Search</button>
      </form>

      {!query ? (
        <section className="content-section">
          <h2>Popular Searches</h2>
          <div className="pill-list">
            {popularSearches.map((term) => (
              <Link key={term} href={`/search?q=${encodeURIComponent(term)}`}>
                {term}
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="content-section">
          <h2>
            {results.length} result{results.length === 1 ? '' : 's'} for "{query}"
          </h2>
          {results.length > 0 ? (
            <div className="result-list">
              {results.map((result) => (
                <Link key={`${result.type}-${result.id}`} href={result.href} className="result-card">
                  <span className="badge">{result.type}</span>
                  <h3>{result.title}</h3>
                  <p>{result.description}</p>
                  <small>{result.meta}</small>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No results found</h3>
              <p>Try a Pokemon name, habitat, recipe, team type, or guide keyword.</p>
            </div>
          )}
        </section>
      )}
    </>
  )
}
