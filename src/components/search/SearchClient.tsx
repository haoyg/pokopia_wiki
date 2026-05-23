'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { SearchResult, popularSearches, searchContent } from '@/lib/search'

const typeOrder: SearchResult['type'][] = ['Official', 'News', 'Guide', 'Pokemon', 'Habitat', 'Recipe']

const typeLabels: Record<SearchResult['type'], string> = {
  Official: 'Official Info',
  News: 'News',
  Guide: 'Guides',
  Pokemon: 'Pokemon',
  Habitat: 'Habitats',
  Recipe: 'Recipes',
}

function groupResults(results: SearchResult[]) {
  return typeOrder
    .map((type) => ({
      type,
      results: results.filter((result) => result.type === type),
    }))
    .filter((group) => group.results.length > 0)
}

export function SearchClient() {
  const searchParams = useSearchParams()
  const query = (searchParams.get('q') || '').trim()
  const results = searchContent(query)
  const groupedResults = groupResults(results)

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
            <div className="search-results-grouped">
              {groupedResults.map((group) => (
                <div key={group.type} className="search-result-group">
                  <div className="section-heading-row">
                    <h3>{typeLabels[group.type]}</h3>
                    <span>{group.results.length}</span>
                  </div>
                  <div className="result-list">
                    {group.results.map((result) => (
                      <Link key={`${result.type}-${result.id}`} href={result.href} className="result-card">
                        <span className={`badge ${result.type.toLowerCase()}`}>{typeLabels[result.type]}</span>
                        <h3>{result.title}</h3>
                        <p>{result.description}</p>
                        <div className="result-meta-row">
                          <small>{result.meta}</small>
                          {result.status && <small>{result.status}</small>}
                          {result.updatedAt && <small>Updated {result.updatedAt}</small>}
                        </div>
                        {result.source && <small className="result-source">Source: {result.source}</small>}
                      </Link>
                    ))}
                  </div>
                </div>
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
