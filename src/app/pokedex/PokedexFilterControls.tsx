'use client'

import { useDeferredValue, useEffect, useId, useState } from 'react'

const INITIAL_VISIBLE_COUNT = 48
const LOAD_MORE_COUNT = 48

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
  const [visibleCount, setVisibleCount] = useState(Math.min(total, INITIAL_VISIBLE_COUNT))
  const [visibleLimit, setVisibleLimit] = useState(INITIAL_VISIBLE_COUNT)
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
      setVisibleLimit(INITIAL_VISIBLE_COUNT)
      setUrlStateReady(true)
    }

    restoreFilters()
    window.addEventListener('popstate', restoreFilters)
    return () => window.removeEventListener('popstate', restoreFilters)
  }, [types])

  useEffect(() => {
    const loadMoreButton = document.querySelector<HTMLButtonElement>('#pokedex-load-more button')
    if (!loadMoreButton) return

    const showMore = () => setVisibleLimit((currentLimit) => currentLimit + LOAD_MORE_COUNT)
    loadMoreButton.addEventListener('click', showMore)
    return () => loadMoreButton.removeEventListener('click', showMore)
  }, [])

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('#pokedex-results .pokedex-card')
    const results = document.querySelector<HTMLElement>('#pokedex-results')
    const loadMore = document.querySelector<HTMLElement>('#pokedex-load-more')
    const loadMoreButton = loadMore?.querySelector<HTMLButtonElement>('button')
    const loadMoreStatus = loadMore?.querySelector<HTMLElement>('[data-load-more-status]')
    const hasActiveFilters = deferredQuery.length > 0 || type !== 'all'

    const rankedCards = Array.from(cards).map((card) => {
      const matchReason = card.querySelector<HTMLElement>('.pokedex-match-reason')
      const name = card.dataset.name || ''
      const numbers = card.dataset.numbers?.split('|') || []
      const specialties = card.dataset.specialties?.split('|') || []
      const habitats = card.dataset.habitats?.split('|') || []
      const matchesName = name.includes(deferredQuery)
      const matchesNumber = numbers.some((number) => number.includes(deferredQuery))
      const matchesSpecialty = specialties.some((specialty) => specialty.includes(deferredQuery))
      const matchesHabitat = habitats.some((habitat) => habitat.includes(deferredQuery))
      const matchesQuery = deferredQuery.length === 0 || matchesName || matchesNumber || matchesSpecialty || matchesHabitat
      const matchesType = type === 'all' || card.dataset.types?.split('|').includes(type)
      const matches = Boolean(matchesQuery && matchesType)

      let rank = Number(card.dataset.index || Number.MAX_SAFE_INTEGER)
      let reason = ''
      if (deferredQuery) {
        if (name === deferredQuery) {
          rank = 0
          reason = 'Exact name match'
        } else if (name.startsWith(deferredQuery)) {
          rank = 1
          reason = 'Name match'
        } else if (matchesName) {
          rank = 2
          reason = 'Name match'
        } else if (matchesNumber) {
          rank = 3
          reason = 'Pokédex number match'
        } else if (matchesSpecialty) {
          rank = 4
          reason = 'Specialty match'
        } else if (matchesHabitat) {
          rank = 5
          reason = 'Habitat match'
        }
      }

      if (matchReason) {
        matchReason.textContent = reason
        matchReason.hidden = !matches || !reason
      }

      return { card, matches, rank, originalIndex: Number(card.dataset.index || Number.MAX_SAFE_INTEGER) }
    })

    const sortedCards = rankedCards.sort((a, b) => a.rank - b.rank || a.originalIndex - b.originalIndex)
    const matchedCount = sortedCards.reduce((count, item) => count + Number(item.matches), 0)
    const displayLimit = hasActiveFilters ? matchedCount : visibleLimit
    let shownCount = 0

    if (results) {
      const fragment = document.createDocumentFragment()
      sortedCards.forEach(({ card, matches }) => {
        const shouldShow = matches && shownCount < displayLimit
        card.hidden = !shouldShow
        if (shouldShow) shownCount += 1
        fragment.append(card)
      })
      results.append(fragment)
    }

    if (loadMore && loadMoreButton && loadMoreStatus) {
      const remaining = Math.max(0, matchedCount - shownCount)
      loadMore.hidden = hasActiveFilters || remaining === 0
      loadMoreButton.textContent = `Show ${Math.min(LOAD_MORE_COUNT, remaining)} more Pokémon`
      loadMoreStatus.textContent = `${shownCount} of ${matchedCount} Pokémon shown`
    }

    setResultCount(matchedCount)
    setVisibleCount(shownCount)
  }, [deferredQuery, type, visibleLimit])

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
  const countLabel = hasFilters ? String(resultCount) : `${visibleCount} / ${resultCount}`

  return (
    <section className="pokedex-filters" aria-label="Filter Pokopia Pokédex">
      <div className="pokedex-filter-field pokedex-filter-search">
        <label htmlFor={searchId}>Search Pokémon</label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setVisibleLimit(INITIAL_VISIBLE_COUNT)
          }}
          placeholder="Name, number, specialty, or habitat"
          autoComplete="off"
        />
      </div>
      <div className="pokedex-filter-field">
        <label htmlFor={typeId}>Type</label>
        <select
          id={typeId}
          value={type}
          onChange={(event) => {
            setType(event.target.value)
            setVisibleLimit(INITIAL_VISIBLE_COUNT)
          }}
        >
          <option value="all">All types</option>
          {types.map((pokemonType) => (
            <option key={pokemonType} value={pokemonType.toLocaleLowerCase()}>{pokemonType}</option>
          ))}
        </select>
      </div>
      <div className="pokedex-filter-summary" aria-live="polite" aria-atomic="true">
        <strong>{countLabel}</strong>
        <span>Pokémon shown</span>
      </div>
      <button
        type="button"
        className="pokedex-filter-reset"
        onClick={() => {
          setQuery('')
          setType('all')
          setVisibleLimit(INITIAL_VISIBLE_COUNT)
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
