'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import habitatsData from '@/data/habitat-links.json'
import pokemonData from '@/data/tool-spawn-pokemon.json'

const habitatNames = new Map(habitatsData.map((habitat) => [habitat.id, habitat.name]))

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b))
}

function habitatName(id: string) {
  return habitatNames.get(id) || id
}

function formatFilterValue(value: string) {
  return value === 'all' ? 'All' : value
}

function getTopHabitatNames(pokemon: typeof pokemonData) {
  const counts = pokemon.reduce<Record<string, number>>((totals, item) => {
    totals[item.habitat] = (totals[item.habitat] || 0) + 1
    return totals
  }, {})

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([id, count]) => `${habitatName(id)} (${count})`)
}

function getSpawnResultNotes(
  pokemon: typeof pokemonData,
  filters: { query: string; habitat: string; weather: string; spawnTime: string; rarity: string }
) {
  const activeFilters = [
    filters.query.trim() ? `Search: ${filters.query.trim()}` : '',
    filters.habitat !== 'all' ? `Habitat: ${habitatName(filters.habitat)}` : '',
    filters.weather !== 'all' ? `Weather: ${filters.weather}` : '',
    filters.spawnTime !== 'all' ? `Time: ${filters.spawnTime}` : '',
    filters.rarity !== 'all' ? `Rarity: ${filters.rarity}` : '',
  ].filter(Boolean)

  const rareTargets = pokemon.filter((item) => ['rare', 'legendary'].includes(item.rarity.toLowerCase()))
  const topHabitats = getTopHabitatNames(pokemon)
  const firstTarget = pokemon[0]

  return [
    {
      label: 'Filter scope',
      text: activeFilters.length > 0
        ? activeFilters.join(' · ')
        : 'No filters are active. Narrow by habitat, weather, time, or rarity before spending recipe buffs.',
    },
    {
      label: 'Best next check',
      text: topHabitats.length > 0
        ? `Most current matches are in ${topHabitats.join(' and ')}. Open the habitat page before choosing a farming loop.`
        : 'No matching habitat is available under the current filters.',
    },
    {
      label: 'Rare pressure',
      text: rareTargets.length > 0
        ? `${rareTargets.length} rare or legendary target${rareTargets.length === 1 ? '' : 's'} match. Save high-value recipes for the tightest weather and time window.`
        : 'No rare or legendary targets match. This filter set is better for routine materials or route scouting.',
    },
    {
      label: 'Route caution',
      text: pokemon.length > 12
        ? 'The list is still broad. Add one more filter before treating it as a farming plan.'
        : firstTarget
          ? `Start by checking ${firstTarget.name}: ${firstTarget.favorite_food}, ${firstTarget.spawn_time}, ${firstTarget.weather}, and ${firstTarget.drops}.`
          : 'Remove one filter or search by a broader type, food, drop, or habitat name.',
    },
  ]
}

export function SpawnTracker() {
  const [query, setQuery] = useState('')
  const [habitat, setHabitat] = useState('all')
  const [weather, setWeather] = useState('all')
  const [spawnTime, setSpawnTime] = useState('all')
  const [rarity, setRarity] = useState('all')

  const habitatOptions = useMemo(
    () => uniqueValues(pokemonData.map((pokemon) => pokemon.habitat)),
    []
  )
  const weatherOptions = useMemo(
    () => uniqueValues(pokemonData.flatMap((pokemon) => pokemon.weather.split('/').map((item) => item.trim()))),
    []
  )
  const timeOptions = useMemo(
    () => uniqueValues(pokemonData.map((pokemon) => pokemon.spawn_time)),
    []
  )
  const rarityOptions = useMemo(
    () => uniqueValues(pokemonData.map((pokemon) => pokemon.rarity)),
    []
  )

  const filteredPokemon = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const normalizedWeather = weather.toLowerCase()

    return pokemonData.filter((pokemon) => {
      if (
        normalizedQuery &&
        ![
          pokemon.name,
          pokemon.type,
          pokemon.description,
          pokemon.favorite_food,
          pokemon.skills,
          pokemon.drops,
          habitatName(pokemon.habitat),
        ].join(' ').toLowerCase().includes(normalizedQuery)
      ) {
        return false
      }

      if (habitat !== 'all' && pokemon.habitat !== habitat) return false
      if (weather !== 'all' && !pokemon.weather.toLowerCase().includes(normalizedWeather)) return false
      if (spawnTime !== 'all' && pokemon.spawn_time !== spawnTime) return false
      if (rarity !== 'all' && pokemon.rarity !== rarity) return false
      return true
    })
  }, [habitat, query, rarity, spawnTime, weather])
  const resultNotes = useMemo(
    () => getSpawnResultNotes(filteredPokemon, { query, habitat, weather, spawnTime, rarity }),
    [filteredPokemon, habitat, query, rarity, spawnTime, weather]
  )

  return (
    <>
      <div className="filter-panel" aria-label="Spawn filters">
        <div>
          <label htmlFor="spawn-query">Search</label>
          <input
            id="spawn-query"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, type, food, drops..."
          />
        </div>

        <div>
          <label htmlFor="spawn-habitat">Habitat</label>
          <select id="spawn-habitat" value={habitat} onChange={(event) => setHabitat(event.target.value)}>
            <option value="all">All habitats</option>
            {habitatOptions.map((id) => (
              <option key={id} value={id}>
                {habitatName(id)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="spawn-weather">Weather</label>
          <select id="spawn-weather" value={weather} onChange={(event) => setWeather(event.target.value)}>
            <option value="all">All weather</option>
            {weatherOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="spawn-time">Time</label>
          <select id="spawn-time" value={spawnTime} onChange={(event) => setSpawnTime(event.target.value)}>
            <option value="all">All times</option>
            {timeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="spawn-rarity">Rarity</label>
          <select id="spawn-rarity" value={rarity} onChange={(event) => setRarity(event.target.value)}>
            <option value="all">All rarity</option>
            {rarityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="content-section">
        <h2>{filteredPokemon.length} spawn target{filteredPokemon.length === 1 ? '' : 's'}</h2>
        <div className="spawn-insight-grid" aria-label="Spawn result guidance">
          {resultNotes.map((note) => (
            <div key={note.label} className="spawn-insight-card">
              <span>{note.label}</span>
              <p>{note.text}</p>
            </div>
          ))}
        </div>

        {filteredPokemon.length > 0 ? (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pokemon</th>
                  <th>Type</th>
                  <th>Rarity</th>
                  <th>Habitat</th>
                  <th>Time</th>
                  <th>Weather</th>
                  <th>Food</th>
                  <th>Drops</th>
                </tr>
              </thead>
              <tbody>
                {filteredPokemon.map((pokemon) => (
                  <tr key={pokemon.id}>
                    <td>
                      <Link href={`/wiki/pokemon/${pokemon.id}`}>{pokemon.name}</Link>
                    </td>
                    <td>{pokemon.type}</td>
                    <td>
                      <span className={`rarity ${pokemon.rarity}`}>{pokemon.rarity}</span>
                    </td>
                    <td>
                      <Link href={`/wiki/habitat/${pokemon.habitat}`}>{habitatName(pokemon.habitat)}</Link>
                    </td>
                    <td>{pokemon.spawn_time}</td>
                    <td>{pokemon.weather}</td>
                    <td>{pokemon.favorite_food}</td>
                    <td>{pokemon.drops}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <h3>No spawn matches</h3>
            <p>Try removing a filter or searching by a broader type, habitat, or rarity.</p>
          </div>
        )}
      </div>
    </>
  )
}
