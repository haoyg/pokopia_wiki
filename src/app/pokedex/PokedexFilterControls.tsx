'use client'

import { useDeferredValue, useEffect, useId, useState } from 'react'

type PokedexFilterControlsProps = {
  total: number
  types: string[]
}

export function PokedexFilterControls({ total, types }: PokedexFilterControlsProps) {
  const searchId = useId()
  const typeId = useId()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [resultCount, setResultCount] = useState(total)
  const [urlStateReady, setUrlStateReady] = useState(false)
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase())

  useEffect(() => {
    const validTypes = new Set(types.map((pokemonType) => pokemonType.toLocaleLowerCase()))

    const restoreFilters = () => {
      const params = new URLSearchParams(window.location.search)
      const nextQuery = (params.get('q') || '').slice(0, 80)
      const requestedType = (params.get('type') || '').toLocaleLowerCase()
      setQuery(nextQuery)
      setType(validTypes.has(requestedType) ? requestedType : 'all')
      setUrlStateReady(true)
    }

    restoreFilters()
    window.addEventListener('popstate', restoreFilters)
    return () => window.removeEventListener('popstate', restoreFilters)
  }, [types])

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('#pokedex-results .pokedex-card')
    let visible = 0

    cards.forEach((card) => {
      const matchesQuery = deferredQuery.length === 0 || card.dataset.search?.includes(deferredQuery)
      const matchesType = type === 'all' || card.dataset.types?.split('|').includes(type)
      const matches = Boolean(matchesQuery && matchesType)
      card.hidden = !matches
      if (matches) visible += 1
    })

    setResultCount(visible)
  }, [deferredQuery, type])

  useEffect(() => {
    if (!urlStateReady) return

    const url = new URL(window.location.href)
    const trimmedQuery = query.trim()
    if (trimmedQuery) url.searchParams.set('q', trimmedQuery)
    else url.searchParams.delete('q')
    if (type !== 'all') url.searchParams.set('type', type)
    else url.searchParams.delete('type')

    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
  }, [query, type, urlStateReady])

  const hasFilters = query.length > 0 || type !== 'all'

  return (
    <section className="pokedex-filters" aria-label="Filter Pokopia Pokédex">
      <div className="pokedex-filter-field pokedex-filter-search">
        <label htmlFor={searchId}>Search Pokémon</label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name, number, specialty, or habitat"
          autoComplete="off"
        />
      </div>
      <div className="pokedex-filter-field">
        <label htmlFor={typeId}>Type</label>
        <select id={typeId} value={type} onChange={(event) => setType(event.target.value)}>
          <option value="all">All types</option>
          {types.map((pokemonType) => (
            <option key={pokemonType} value={pokemonType.toLocaleLowerCase()}>{pokemonType}</option>
          ))}
        </select>
      </div>
      <div className="pokedex-filter-summary" aria-live="polite" aria-atomic="true">
        <strong>{resultCount}</strong>
        <span>Pokémon shown</span>
      </div>
      <button
        type="button"
        className="pokedex-filter-reset"
        onClick={() => {
          setQuery('')
          setType('all')
        }}
        disabled={!hasFilters}
      >
        Clear filters
      </button>
      <p className="pokedex-filter-empty" hidden={resultCount !== 0}>
        No reviewed Pokémon match those filters. Try another name, number, or type.
      </p>
    </section>
  )
}
