'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import habitatsData from '@/data/habitats.json'
import pokemonData from '@/data/pokemon.json'

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b))
}

function habitatName(id: string) {
  return habitatsData.find((habitat) => habitat.id === id)?.name || id
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

  const filteredPokemon = pokemonData.filter((pokemon) => {
    const normalizedQuery = query.trim().toLowerCase()
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
    if (weather !== 'all' && !pokemon.weather.toLowerCase().includes(weather.toLowerCase())) return false
    if (spawnTime !== 'all' && pokemon.spawn_time !== spawnTime) return false
    if (rarity !== 'all' && pokemon.rarity !== rarity) return false
    return true
  })

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
