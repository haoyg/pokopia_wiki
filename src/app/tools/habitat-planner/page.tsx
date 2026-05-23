'use client'

import { useState } from 'react'
import habitatsData from '@/data/habitats.json'
import Link from 'next/link'
import { DataStatus } from '@/components/content/DataStatus'

const difficultyOrder = { easy: 0, medium: 1, hard: 2 }

function getUnlockLevel(condition: string): number {
  const match = condition.match(/Reach Level (\d+)/)
  return match ? parseInt(match[1]) : 0
}

const typeEmoji: Record<string, string> = {
  'Clear': '☀️', 'Sunny': '☀️', 'Cloudy': '☁️', 'Foggy': '🌫️',
  'Rain': '🌧️', 'Snow': '❄️', 'Windy': '💨', 'Stormy': '⛈️',
  'Thunderstorm': '⚡', 'Dark': '🌑', 'Night': '🌙',
}

function getWeatherEmoji(weather: string): string {
  const conditions = weather.split('/')
  return conditions.map((w) => typeEmoji[w.trim()] || '❓').join(' ')
}

export default function HabitatPlanner() {
  const [playerLevel, setPlayerLevel] = useState<number>(1)
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [filterWeather, setFilterWeather] = useState<string>('all')

  const sortedHabitats = [...habitatsData].sort((a, b) => {
    return getUnlockLevel(a.unlock_condition) - getUnlockLevel(b.unlock_condition)
  })

  const filteredHabitats = sortedHabitats.filter((h) => {
    if (filterDifficulty !== 'all' && h.difficulty !== filterDifficulty) return false
    if (filterWeather !== 'all' && !h.weather.toLowerCase().includes(filterWeather.toLowerCase())) return false
    return true
  })

  const unlockedHabitats = filteredHabitats.filter((h) => getUnlockLevel(h.unlock_condition) <= playerLevel)
  const lockedHabitats = filteredHabitats.filter((h) => getUnlockLevel(h.unlock_condition) > playerLevel)

  return (
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/tools" style={{ fontSize: '0.875rem', color: '#666' }}>
          ← Back to Tools
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>
          Habitat Planner
        </h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Filter current habitat database entries by level, difficulty, weather, and resource goals.
        </p>
      </header>

      <DataStatus
        status="Database planning tool"
        note="Unlock levels, resource bonuses, spawns, and recommended builds come from Pokopia Portal database entries. Treat this as route planning data, not an official live tracker."
        updatedAt="2026-05-23"
      />

      {/* Controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
          padding: '1.5rem',
          background: '#f8f9fa',
          borderRadius: '12px',
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Your Level
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={playerLevel}
            onChange={(e) => setPlayerLevel(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '2px solid #e5e5e5',
              borderRadius: '8px',
              fontSize: '1.25rem',
              fontWeight: 700,
              textAlign: 'center',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Difficulty
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['all', 'easy', 'medium', 'hard'].map((d) => (
              <button
                key={d}
                onClick={() => setFilterDifficulty(d)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: filterDifficulty === d ? '#e94560' : '#ddd',
                  background: filterDifficulty === d ? '#e94560' : 'white',
                  color: filterDifficulty === d ? 'white' : '#666',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Weather
          </label>
          <select
            value={filterWeather}
            onChange={(e) => setFilterWeather(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '2px solid #e5e5e5',
              borderRadius: '8px',
              fontSize: '0.875rem',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Weather</option>
            <option value="clear">☀️ Clear/Sunny</option>
            <option value="cloudy">☁️ Cloudy</option>
            <option value="rain">🌧️ Rain</option>
            <option value="snow">❄️ Snow</option>
            <option value="windy">💨 Windy</option>
            <option value="stormy">⛈️ Stormy</option>
            <option value="foggy">🌫️ Foggy</option>
            <option value="dark">🌑 Dark</option>
          </select>
        </div>
      </div>

      {/* Summary */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            padding: '1rem 1.5rem',
            background: '#e8f5e9',
            borderRadius: '12px',
            flex: 1,
            minWidth: '150px',
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2e7d32' }}>
            {unlockedHabitats.length}
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2e7d32', textTransform: 'uppercase' }}>
            Available
          </div>
        </div>
        <div
          style={{
            padding: '1rem 1.5rem',
            background: '#ffebee',
            borderRadius: '12px',
            flex: 1,
            minWidth: '150px',
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c62828' }}>
            {lockedHabitats.length}
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#c62828', textTransform: 'uppercase' }}>
            Locked
          </div>
        </div>
        <div
          style={{
            padding: '1rem 1.5rem',
            background: '#e3f2fd',
            borderRadius: '12px',
            flex: 1,
            minWidth: '150px',
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1565c0' }}>
            {playerLevel}
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1565c0', textTransform: 'uppercase' }}>
            Your Level
          </div>
        </div>
      </div>

      {/* Habitat Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredHabitats.map((habitat) => {
          const unlockLevel = getUnlockLevel(habitat.unlock_condition)
          const isUnlocked = unlockLevel <= playerLevel
          const spawns = habitat.spawn_list.split(',')

          return (
            <div
              key={habitat.id}
              style={{
                padding: '1.25rem',
                border: '2px solid',
                borderColor: isUnlocked ? '#e5e5e5' : '#eee',
                borderRadius: '12px',
                background: isUnlocked ? 'white' : '#fafafa',
                opacity: isUnlocked ? 1 : 0.7,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                      {habitat.name}
                    </h3>
                    {isUnlocked ? (
                      <span style={{ fontSize: '0.7rem', padding: '0.125rem 0.5rem', background: '#d4edda', color: '#155724', borderRadius: '4px', fontWeight: 600 }}>
                        ✓ Unlocked
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.7rem', padding: '0.125rem 0.5rem', background: '#fff3cd', color: '#856404', borderRadius: '4px', fontWeight: 600 }}>
                        🔒 Lv.{unlockLevel}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                    {habitat.unlock_condition}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className={`badge ${habitat.difficulty}`}>
                    {habitat.difficulty}
                  </span>
                  <span style={{ fontSize: '1rem' }}>
                    {getWeatherEmoji(habitat.weather)}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#999', textTransform: 'uppercase' }}>Resource Bonus</span>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e94560', marginTop: '0.25rem' }}>
                    {habitat.resource_bonus}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#999', textTransform: 'uppercase' }}>Recommended Build</span>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, marginTop: '0.25rem' }}>
                    {habitat.recommended_build}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#999', textTransform: 'uppercase' }}>Weather</span>
                  <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {habitat.weather}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#999', textTransform: 'uppercase' }}>
                  Spawns ({spawns.length})
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {spawns.map((spawnId) => (
                    <Link
                      key={spawnId}
                      href={`/wiki/pokemon/${spawnId}`}
                      style={{
                        padding: '0.25rem 0.5rem',
                        background: '#f5f5f5',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        color: '#666',
                        textDecoration: 'none',
                      }}
                    >
                      {spawnId}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tips */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#fef2f4',
          borderRadius: '12px',
          border: '1px solid #fcc',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Planning Tips
        </h3>
        <ul style={{ fontSize: '0.875rem', color: '#666', paddingLeft: '1.25rem', margin: 0 }}>
          <li>Start with easier habitats when you need stable materials and short route checks.</li>
          <li>Use the level filter to find the next unlock before planning a resource route.</li>
          <li>Compare weather and resource bonuses before repeating a habitat for farming.</li>
          <li>Open the habitat page before relying on a spawn or route recommendation.</li>
        </ul>
      </div>
    </main>
  )
}
