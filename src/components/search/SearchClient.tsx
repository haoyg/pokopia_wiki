'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { SearchResult, popularSearches, searchContent } from '@/lib/search'

const typeOrder: SearchResult['type'][] = ['Official', 'News', 'Guide', 'Feature', 'Tool', 'Pokemon', 'Habitat', 'Recipe']

const typeLabels: Record<SearchResult['type'], string> = {
  Official: 'Official Source Roundups',
  News: 'News',
  Guide: 'Guides',
  Feature: 'Features',
  Tool: 'Tools',
  Pokemon: 'Pokemon',
  Habitat: 'Habitats',
  Recipe: 'Recipes',
}

const quickPaths = [
  {
    href: '/guides/beginner-route',
    title: 'Beginner Route',
    description: 'Start with starter choices, easy habitats, recipes, and tools.',
    label: 'Start',
  },
  {
    href: '/guides/rare-farming-route',
    title: 'Rare Farming Route',
    description: 'Plan Lucky Charm timing, rare targets, habitats, and recipes.',
    label: 'Guide',
  },
  {
    href: '/builds/home-design-ideas',
    title: 'Home Design Ideas',
    description: 'Use text-based building concepts for cozy layouts and route-friendly spaces.',
    label: 'Build',
  },
  {
    href: '/features/creative-play-ideas',
    title: 'Creative Play Ideas',
    description: 'Safe challenge ideas without downloads, patches, or fake events.',
    label: 'Feature',
  },
  {
    href: '/news/weekly-event-tracker',
    title: 'Weekly Event Tracker',
    description: 'Confirmed-first monitoring for event-related updates.',
    label: 'News',
  },
  {
    href: '/tools/team-builder',
    title: 'Team Builder',
    description: 'Draft a balanced team by role, type coverage, route goal, and supporting recipes.',
    label: 'Tool',
  },
]

const topicSearches = [
  { href: '/search?q=official%20gameplay', label: 'Official gameplay' },
  { href: '/search?q=recipe%20calculator', label: 'Recipe calculator' },
  { href: '/search?q=habitat%20planner', label: 'Habitat planner' },
  { href: '/search?q=pokemon%20database', label: 'Pokemon database' },
  { href: '/search?q=animal%20crossing', label: 'Animal Crossing' },
  { href: '/search?q=friendship%20requests', label: 'Friendship requests' },
]

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
        <>
          <section className="content-section search-quick-section">
            <div className="section-title-row">
              <div>
                <span className="panel-kicker">Quick Paths</span>
                <h2>Start With High-Value Pages</h2>
              </div>
            </div>
            <div className="search-quick-grid">
              {quickPaths.map((item) => (
                <Link key={item.href} href={item.href} className="search-quick-card">
                  <span className="badge source-roundup">{item.label}</span>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="content-section search-topic-section">
            <div className="search-topic-columns">
              <div>
                <h2>Popular Searches</h2>
                <div className="pill-list">
                  {popularSearches.map((term) => (
                    <Link key={term} href={`/search?q=${encodeURIComponent(term)}`}>
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h2>Search by Topic</h2>
                <div className="pill-list">
                  {topicSearches.map((item) => (
                    <Link key={item.href} href={item.href}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
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
