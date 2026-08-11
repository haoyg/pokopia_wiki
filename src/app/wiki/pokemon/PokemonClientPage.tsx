'use client'

import { useState, useMemo, useEffect } from 'react'
import pokemonData from '@/data/pokemon.json'
import habitatsData from '@/data/habitats.json'
import { CreditedImage } from '@/components/media/CreditedImage'
import { DataStatus } from '@/components/content/DataStatus'
import { pokemonImage } from '@/lib/localImages'

const habitatNames = Object.fromEntries(habitatsData.map((h) => [h.id, h.name]))
const ALL_TYPES = [...new Set(pokemonData.flatMap((p) => p.type.split('/')))].sort()
const ALL_RARITIES = [...new Set(pokemonData.map((p) => p.rarity))].sort()
const ALL_SPECIALTIES = [...new Set(pokemonData.map((p) => p.specialty))].sort()

function shortText(text: string, length = 150) {
  if (text.length <= length) return text
  return `${text.slice(0, length).trim()}...`
}

type ViewMode = 'grid' | 'collection'
type SortKey = 'id' | 'name' | 'rarity' | 'specialty' | 'type'

interface FilterState {
  search: string
  type: string
  rarity: string
  specialty: string
  habitat: string
  sort: SortKey
}

const RARITY_ORDER: Record<string, number> = { common: 1, uncommon: 2, rare: 3, legendary: 4 }
const STORAGE_KEY = 'pokopia-collection-checked'

export default function PokemonClientPage() {
  const [view, setView] = useState<ViewMode>('collection')
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: '',
    rarity: '',
    specialty: '',
    habitat: '',
    sort: 'id',
  })
  const [checked, setChecked] = useState<Set<string>>(new Set())

  // Persist checked state to localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setChecked(new Set(JSON.parse(stored)))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]))
    } catch {}
  }, [checked])

  const toggleCheck = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = useMemo(() => {
    let list = [...pokemonData]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.specialty.toLowerCase().includes(q) ||
          p.rarity.toLowerCase().includes(q)
      )
    }
    if (filters.type) {
      list = list.filter((p) => p.type.split('/').includes(filters.type))
    }
    if (filters.rarity) {
      list = list.filter((p) => p.rarity === filters.rarity)
    }
    if (filters.specialty) {
      list = list.filter((p) => p.specialty === filters.specialty)
    }
    if (filters.habitat) {
      list = list.filter((p) => p.habitat === filters.habitat)
    }
    list.sort((a, b) => {
      switch (filters.sort) {
        case 'name': return a.name.localeCompare(b.name)
        case 'rarity': return (RARITY_ORDER[a.rarity] ?? 0) - (RARITY_ORDER[b.rarity] ?? 0)
        case 'specialty': return a.specialty.localeCompare(b.specialty)
        case 'type': return a.type.localeCompare(b.type)
        default: return a.id.localeCompare(b.id)
      }
    })
    return list
  }, [filters])

  const progress = {
    total: pokemonData.length,
    collected: checked.size,
    percent: Math.round((checked.size / pokemonData.length) * 100),
  }

  const setFilter = (key: keyof FilterState, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }))

  const resetFilters = () =>
    setFilters({ search: '', type: '', rarity: '', specialty: '', habitat: '', sort: 'id' })

  return (
    <>
      <section className="page-hero">
        <h1>Pokopia Collection List: Complete Pokemon Checklist</h1>
        <p>
          This page lists all {pokemonData.length} Pokemon available in Pokopia. Each entry shows type, rarity, role, habitat, and exactly how to find it — favorite food, spawn time window, and weather conditions. Use the checkboxes below to track which Pokemon you have collected; progress is saved in your browser. Filter by any attribute or sort the list to plan your next habitat session.
        </p>
      </section>

      <DataStatus
        status="Unverified editorial database"
        note="These entries are editorial planning data, not official or confirmed Pokémon records. Credited promotional images identify their media sources only and do not depict or verify the named entries or their gameplay claims."
        updatedAt="July 21, 2026"
        showPolicyLink
      />

      {/* View toggle + metadata */}
      <div className="pokemon-list-header">
        <div className="pokemon-list-meta">
          <span>
            Showing <strong>{filtered.length}</strong> of {pokemonData.length} Pokemon
          </span>
          {view === 'collection' && (
            <span className="collection-progress">
              Collected: <strong>{progress.collected}</strong> / {progress.total} ({progress.percent}%)
            </span>
          )}
        </div>
        <div className="pokemon-view-toggle" role="group" aria-label="View mode">
          <button
            onClick={() => setView('grid')}
            className={view === 'grid' ? 'is-active' : ''}
            aria-pressed={view === 'grid'}
          >
            Grid
          </button>
          <button
            onClick={() => setView('collection')}
            className={view === 'collection' ? 'is-active' : ''}
            aria-pressed={view === 'collection'}
          >
            Collection List
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="pokemon-filters">
        <div className="filter-row">
          <div className="filter-group filter-group-search">
            <label htmlFor="pokemon-search">Search</label>
            <input
              id="pokemon-search"
              type="search"
              placeholder="Name, type, specialty..."
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="filter-type">Type</label>
            <select
              id="filter-type"
              value={filters.type}
              onChange={(e) => setFilter('type', e.target.value)}
            >
              <option value="">All types</option>
              {ALL_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="filter-rarity">Rarity</label>
            <select
              id="filter-rarity"
              value={filters.rarity}
              onChange={(e) => setFilter('rarity', e.target.value)}
            >
              <option value="">All rarities</option>
              {ALL_RARITIES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="filter-specialty">Specialty</label>
            <select
              id="filter-specialty"
              value={filters.specialty}
              onChange={(e) => setFilter('specialty', e.target.value)}
            >
              <option value="">All roles</option>
              {ALL_SPECIALTIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="filter-habitat">Habitat</label>
            <select
              id="filter-habitat"
              value={filters.habitat}
              onChange={(e) => setFilter('habitat', e.target.value)}
            >
              <option value="">All habitats</option>
              {[...new Set(pokemonData.map((p) => p.habitat))].map((h) => (
                <option key={h} value={h}>{habitatNames[h] || h}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="filter-sort">Sort by</label>
            <select
              id="filter-sort"
              value={filters.sort}
              onChange={(e) => setFilter('sort', e.target.value as SortKey)}
            >
              <option value="id">ID</option>
              <option value="name">Name</option>
              <option value="rarity">Rarity</option>
              <option value="type">Type</option>
              <option value="specialty">Specialty</option>
            </select>
          </div>
          <button className="filter-reset" onClick={resetFilters}>Reset</button>
        </div>
      </div>

      {/* Grid view */}
      {view === 'grid' && (
        <>
          <section className="index-guide-panel">
            <div className="section-title-row">
              <div>
                <span className="panel-kicker">Pokedex Routes</span>
                <h2>Use Pokemon Pages as Small Route Guides</h2>
              </div>
              <a href="/tools/team-builder">Open Team Builder</a>
            </div>
            <div className="index-guide-grid">
              <div className="index-guide-card">
                <strong>Best first checks</strong>
                <p>Start with flexible Pokemon that explain early route roles, then move into rare or legendary targets after the habitat is stable.</p>
                <div>
                  {['pkm001', 'pkm002', 'pkm007', 'pkm030'].map((id) => {
                    const p = pokemonData.find((pk) => pk.id === id)
                    if (!p) return null
                    return <a key={id} href={`/wiki/pokemon/${p.id}`}>{p.name}</a>
                  })}
                </div>
              </div>
              <div className="index-guide-card">
                <strong>Rarity spread</strong>
                <p>Rarity is useful for farming priority, but route fit matters more than chasing the highest label.</p>
                <div>
                  {Object.entries(
                    pokemonData.reduce<Record<string, number>>((counts, p) => {
                      counts[p.rarity] = (counts[p.rarity] || 0) + 1
                      return counts
                    }, {})
                  ).map(([rarity, count]) => (
                    <span key={rarity}>{rarity}: {count}</span>
                  ))}
                </div>
              </div>
              <div className="index-guide-card">
                <strong>Role planning</strong>
                <p>Use specialty roles to avoid building teams with too many attackers and not enough support or survival coverage.</p>
                <div>
                  {Object.entries(
                    pokemonData.reduce<Record<string, number>>((counts, p) => {
                      counts[p.specialty] = (counts[p.specialty] || 0) + 1
                      return counts
                    }, {})
                  ).slice(0, 6).map(([role, count]) => (
                    <span key={role}>{role}: {count}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="pokemon-grid">
            {filtered.map((p) => (
              <a key={p.id} href={`/wiki/pokemon/${p.id}`} className="card">
                <CreditedImage
                  src={p.image_url}
                  alt={p.image_alt || p.type}
                  source={p.image_source}
                  sourceUrl={p.image_source_url}
                  licenseNote={p.image_license_note}
                  originalMedia={p.image_original_media}
                  rightsStatus={p.image_rights_status}
                  className="card-cover pokemon-cover"
                  sizes="(max-width: 768px) 100px, 200px"
                  creditLink={false}
                  showCredit={false}
                  fallbackSrc={pokemonImage(p.name)}
                  fallbackAlt={`${p.name} Pokemon illustration`}
                />
                <h3 className="index-card-title index-card-title-center">{p.name}</h3>
                <p className="index-card-meta">{p.type}</p>
                <p className="index-card-submeta">{p.specialty} · {habitatNames[p.habitat] || p.habitat}</p>
                <p className="index-card-summary">{shortText(p.overview, 135)}</p>
                <dl className="index-card-facts">
                  <div>
                    <dt>Food</dt>
                    <dd>{p.favorite_food}</dd>
                  </div>
                  <div>
                    <dt>Window</dt>
                    <dd>{p.spawn_time} / {p.weather}</dd>
                  </div>
                  <div>
                    <dt>Drops</dt>
                    <dd>{p.drops}</dd>
                  </div>
                </dl>
                <div className="index-card-badges index-card-badges-center">
                  <span className={`rarity ${p.rarity}`}>{p.rarity}</span>
                </div>
              </a>
            ))}
          </div>
        </>
      )}

      {/* Collection list view */}
      {view === 'collection' && (
        <div className="collection-view">
          {/* Progress bar */}
          <div className="collection-progress-bar-wrap">
            <div className="collection-progress-bar">
              <div
                className="collection-progress-fill"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <span className="collection-progress-label">
              {progress.collected} / {progress.total} Pokemon collected ({progress.percent}%)
            </span>
          </div>

          {/* Collection table */}
          <div className="collection-table-scroll">
          <div className="collection-table" role="table" aria-label="Pokopia Pokemon collection checklist">
            <div className="collection-table-head" role="row">
              <span role="columnheader">&#x2713;</span>
              <span role="columnheader">Pokemon</span>
              <span role="columnheader">Type</span>
              <span role="columnheader">Rarity</span>
              <span role="columnheader">Role</span>
              <span role="columnheader">Habitat</span>
              <span role="columnheader">How to Get</span>
            </div>
            {filtered.map((p) => (
              <div
                key={p.id}
                className={`collection-row${checked.has(p.id) ? ' is-collected' : ''}`}
                role="row"
              >
                <span className="collection-check" role="cell">
                  <input
                    type="checkbox"
                    id={`check-${p.id}`}
                    checked={checked.has(p.id)}
                    onChange={() => toggleCheck(p.id)}
                    aria-label={`Mark ${p.name} as collected`}
                  />
                </span>
                <span className="collection-name" role="cell">
                  <a href={`/wiki/pokemon/${p.id}`}>{p.name}</a>
                  <span className={`rarity ${p.rarity}`}>{p.rarity}</span>
                </span>
                <span className="collection-type" role="cell">{p.type}</span>
                <span className="collection-rarity" role="cell">{p.rarity}</span>
                <span className="collection-specialty" role="cell">{p.specialty}</span>
                <span className="collection-habitat" role="cell">
                  <a href={`/wiki/habitat/${p.habitat}`}>{habitatNames[p.habitat] || p.habitat}</a>
                </span>
                <span className="collection-howto" role="cell">
                  <span className="howto-food">{p.favorite_food}</span>
                  <span className="howto-conditions">{p.spawn_time} / {p.weather}</span>
                  <a href={`/wiki/habitat/${p.habitat}`} className="howto-link">→ Habitat guide</a>
                </span>
              </div>
            ))}
          </div>
          </div>

          {filtered.length === 0 && (
            <div className="collection-empty">
              <p>No Pokemon match the current filters. Try adjusting your search criteria.</p>
              <button onClick={resetFilters}>Reset filters</button>
            </div>
          )}

          {/* SEO content block */}
          <div className="collection-seo-content">
            <h2>How to Use This Pokopia Collection List</h2>
            <p>
              This complete Pokopia Pokemon checklist covers all {pokemonData.length} entries across every habitat, rarity tier, and specialty role in the game. The checklist below is your primary tracking tool: check each Pokemon as you capture it and your browser will remember your progress automatically. Filter by type, rarity, specialty, or habitat to find exactly which Pokemon you still need and where to find them.
            </p>

            <h3>Complete Pokopia Pokemon Checklist by Rarity</h3>
            <p>
              Rarity tiers in Pokopia range from common to legendary. Common Pokemon appear frequently in their associated habitat, while legendary Pokemon require specific weather conditions, spawn time windows, and rare material drops. Use this collection checklist to mark off each rarity tier as you complete it — legendary entries are especially worth tracking since each one requires habitat-specific farming runs.
            </p>

            <h3>Where to Find Each Pokemon</h3>
            <p>
              Every entry in this Pokopia collection list includes the habitat name, favorite food, spawn time, and weather conditions needed to encounter that Pokemon. Clicking the habitat link in each row opens the full habitat guide page, which covers unlock conditions, recommended team builds, resource bonuses, and the complete spawn list for that location. Linking each Pokemon directly to its habitat page creates a natural navigation path from the collection checklist to detailed habitat strategy guides.
            </p>

            <h3>Pokopia Collection List FAQ</h3>
            <p>
              <strong>How many Pokemon are in Pokopia?</strong> There are currently {pokemonData.length} Pokemon across all habitats, types, and rarity tiers in the game.
            </p>
            <p>
              <strong>Does the checklist save my progress?</strong> Yes — checked entries are stored in your browser's localStorage and will persist between sessions. Clearing browser data will reset the checklist.
            </p>
            <p>
              <strong>Can I filter the checklist?</strong> Yes. Use the filter row above the table to narrow down by type, rarity, specialty role, or habitat. You can also search by name or sort the list by any column.
            </p>
            <p>
              <strong>How do I find legendary Pokemon?</strong> Legendary Pokemon are marked in the rarity column. Each legendary entry links to its habitat page, where you can find the specific spawn conditions, time windows, and weather requirements needed to encounter it.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
