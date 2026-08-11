'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import pokemonData from '@/data/pokemon.json'
import habitatsData from '@/data/habitats.json'
import { DataStatus } from '@/components/content/DataStatus'
import { pokemonImage } from '@/lib/localImages'

const ALL_TYPES = [...new Set(pokemonData.flatMap((p) => p.type.split('/')))].sort()
const habitatNames = Object.fromEntries(habitatsData.map((h) => [h.id, h.name]))

/* Type matchup matrix — effectiveness multiplier for target vs attacker type */
const TYPE_CHART: Record<string, Record<string, number>> = {
  Fire: { Grass: 2, Water: 0.5, Fire: 0.5, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
  Water: { Fire: 2, Grass: 0.5, Water: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Grass: { Water: 2, Fire: 0.5, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
  Electric: { Water: 2, Grass: 0.5, Electric: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
  Ice: { Grass: 2, Fire: 0.5, Water: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Dark: 2, Steel: 2, Fairy: 0.5 },
  Poison: { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Bug: 0.5, Fairy: 2 },
  Ground: { Fire: 2, Grass: 0.5, Electric: 2, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
  Flying: { Grass: 2, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5, Electric: 0.5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
  Bug: { Grass: 2, Fire: 0.5, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Dark: 2, Steel: 0.5, Fairy: 0.5 },
  Rock: { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
  Ghost: { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
  Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark: { Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
  Steel: { Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Rock: 2, Steel: 0.5, Fairy: 2 },
  Fairy: { Fire: 0.5, Fighting: 2, Dragon: 2, Dark: 2, Steel: 0.5 },
  Normal: { Rock: 0.5, Ghost: 0, Steel: 0.5 },
}

const ROLE_GROUPS: Record<string, string[]> = {
  Attacker: ['Attacker', 'Assassin'],
  Defender: ['Defender', 'Tank'],
  Support: ['Support'],
  Speedster: ['Speedster'],
}

const SYNERGY_RULES: Array<{ label: string; check: (a: typeof pokemonData[number], b: typeof pokemonData[number]) => boolean; detail: string }> = [
  {
    label: 'Role coverage',
    check: (a, b) => a.specialty !== b.specialty,
    detail: 'Different roles mean the team covers more situations.',
  },
  {
    label: 'Type coverage',
    check: (a, b) => {
      const typesA = a.type.split('/')
      const typesB = b.type.split('/')
      return !typesA.some((t) => typesB.includes(t))
    },
    detail: 'No shared types means the team is not doubly vulnerable to the same attack.',
  },
  {
    label: 'Defensive complement',
    check: (a, b) => {
      const typesA = a.type.split('/')
      const typesB = b.type.split('/')
      // b resists what a is weak to, or vice versa
      return typesA.some((tA) =>
        typesB.some((tB) => (TYPE_CHART[tB]?.[tA] ?? 1) >= 2)
      )
    },
    detail: 'One Pokemon resists the other\'s weaknesses, reducing team-wide vulnerability.',
  },
  {
    label: 'Habitat overlap',
    check: (a, b) => a.habitat !== b.habitat,
    detail: 'Different habitats mean the pair covers more ground without retreading the same route.',
  },
  {
    label: 'Weather synergy',
    check: (a, b) => a.weather !== b.weather,
    detail: 'Different weather preferences mean the pair stays useful across more conditions.',
  },
]

function getWeaknesses(types: string[]): string[] {
  const weak: string[] = []
  for (const type of types) {
    for (const [defType, mult] of Object.entries(TYPE_CHART[type] || {})) {
      if (mult >= 2) weak.push(defType)
    }
  }
  return [...new Set(weak)]
}

function getResistances(types: string[]): string[] {
  const res: string[] = []
  for (const type of types) {
    for (const [defType, mult] of Object.entries(TYPE_CHART[type] || {})) {
      if (mult <= 0.5) res.push(defType)
    }
  }
  return [...new Set(res)]
}

function calcSynergy(a: typeof pokemonData[number], b: typeof pokemonData[number]) {
  const results = SYNERGY_RULES.map((rule) => ({
    label: rule.label,
    pass: rule.check(a, b),
    detail: rule.detail,
  }))
  const score = results.filter((r) => r.pass).length
  const max = results.length
  const pct = Math.round((score / max) * 100)
  const label =
    pct >= 80 ? 'Strong synergy' :
    pct >= 50 ? 'Moderate synergy' :
    'Low synergy'
  return { score, max, pct, label, checks: results }
}

export default function CompatibilityPage() {
  const [slotA, setSlotA] = useState<string>('')
  const [slotB, setSlotB] = useState<string>('')

  const pokemonA = pokemonData.find((p) => p.id === slotA)
  const pokemonB = pokemonData.find((p) => p.id === slotB)

  const synergy = useMemo(
    () => (pokemonA && pokemonB ? calcSynergy(pokemonA, pokemonB) : null),
    [pokemonA, pokemonB]
  )

  const teamSuggestions = useMemo(() => {
    if (!pokemonA) return []
    const typesA = pokemonA.type.split('/')
    const weaknessA = getWeaknesses(typesA)
    const resistA = getResistances(typesA)
    return pokemonData
      .filter((p) => p.id !== slotA)
      .map((p) => {
        const typesB = p.type.split('/')
        const weaknessB = getWeaknesses(typesB)
        const resistB = getResistances(typesB)
        const coversWeakA = weaknessA.some((w) => resistB.includes(w))
        const coversWeakB = resistA.some((r) => weaknessB.includes(r))
        const roleDiff = p.specialty !== pokemonA.specialty
        const habitatDiff = p.habitat !== pokemonA.habitat
        const score = [coversWeakA, coversWeakB, roleDiff, habitatDiff].filter(Boolean).length
        return { pokemon: p, score, coversWeakA, coversWeakB, roleDiff, habitatDiff }
      })
      .filter((item) => item.score >= 2)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
  }, [pokemonA, slotA])

  return (
    <>

      <header style={{ marginBottom: '1.5rem' }}>
        <Link href="/wiki/pokemon" style={{ fontSize: '0.875rem', color: '#637083' }}>
          Back to Pokemon Database
        </Link>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginTop: '0.5rem', lineHeight: 1.1 }}>
          Pokemon Compatibility Checker
        </h1>
        <p style={{ color: '#637083', marginTop: '0.65rem', fontSize: '1.05rem', maxWidth: '780px', lineHeight: 1.65 }}>
          Pick two Pokemon to check team synergy — role coverage, type matchups, defensive complement,
          and habitat overlap. Then see which Pokemon best complement your first pick.
        </p>
      </header>

      <DataStatus
        status="Tool using unverified editorial data"
        note="Compatibility scores and synergy suggestions are editorial planning guidance, not confirmed game balance data. Do not treat pair recommendations as competitive rankings or official team requirements."
        updatedAt="August 11, 2026"
        showPolicyLink
      />

      {/* Selector */}
      <section
        style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          border: '2px solid rgba(220, 232, 220, 0.95)',
          borderRadius: '12px',
          background: 'rgba(255, 253, 247, 0.96)',
          boxShadow: '0 4px 0 rgba(47, 76, 113, 0.08)',
        }}
      >
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Select a Pair to Check</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label htmlFor="slot-a" style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.8rem', fontWeight: 900, color: '#637083', textTransform: 'uppercase' }}>
              First Pokemon
            </label>
            <select
              id="slot-a"
              value={slotA}
              onChange={(e) => setSlotA(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.75rem', border: '2px solid #dce8dc', borderRadius: '8px', font: 'inherit', background: 'rgba(255,255,255,0.92)' }}
            >
              <option value="">Choose Pokemon...</option>
              {pokemonData.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {p.type}</option>
              ))}
            </select>
          </div>
          <div style={{ textAlign: 'center', fontSize: '1.4rem', color: '#8b97a8', alignSelf: 'center', paddingBottom: '0.3rem' }}>
            +
          </div>
          <div>
            <label htmlFor="slot-b" style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.8rem', fontWeight: 900, color: '#637083', textTransform: 'uppercase' }}>
              Second Pokemon
            </label>
            <select
              id="slot-b"
              value={slotB}
              onChange={(e) => setSlotB(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.75rem', border: '2px solid #dce8dc', borderRadius: '8px', font: 'inherit', background: 'rgba(255,255,255,0.92)' }}
            >
              <option value="">Choose Pokemon...</option>
              {pokemonData.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {p.type}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Synergy result */}
      {synergy && (
        <section
          style={{
            marginTop: '1.25rem',
            padding: '1.5rem',
            border: `2px solid ${synergy.pct >= 80 ? 'rgba(89, 201, 130, 0.62)' : synergy.pct >= 50 ? 'rgba(255, 209, 102, 0.62)' : 'rgba(220, 232, 220, 0.95)'}`,
            borderRadius: '12px',
            background: 'rgba(255, 253, 247, 0.96)',
            boxShadow: '0 4px 0 rgba(47, 76, 113, 0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ color: '#637083', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
                Synergy Score
              </span>
              <h2 style={{ fontSize: '2rem', marginTop: '0.2rem', color: synergy.pct >= 80 ? '#237044' : synergy.pct >= 50 ? '#7a5a00' : '#555' }}>
                {synergy.label} — {synergy.score}/{synergy.max}
              </h2>
            </div>
            <div style={{ display: 'grid', placeItems: 'center', width: '72px', height: '72px', borderRadius: '50%', border: `4px solid ${synergy.pct >= 80 ? '#59c982' : synergy.pct >= 50 ? '#ffd166' : '#ccc'}`, background: 'white' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#20243a' }}>{synergy.pct}%</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem', marginTop: '1rem' }}>
            {synergy.checks.map((check) => (
              <div
                key={check.label}
                style={{
                  padding: '0.75rem 0.9rem',
                  borderRadius: '8px',
                  border: `1px solid ${check.pass ? 'rgba(89, 201, 130, 0.55)' : 'rgba(220, 232, 220, 0.95)'}`,
                  background: check.pass ? 'rgba(242, 251, 244, 0.88)' : 'rgba(255, 253, 247, 0.88)',
                }}
              >
                <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 900, color: check.pass ? '#237044' : '#aaa', textTransform: 'uppercase' }}>
                  {check.pass ? '✓' : '✗'} {check.label}
                </span>
                <p style={{ marginTop: '0.25rem', color: '#3d475c', fontSize: '0.85rem' }}>{check.detail}</p>
              </div>
            ))}
          </div>

          {/* Weakness/resistance breakdown */}
          {pokemonA && pokemonB && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
              {[
                { pokemon: pokemonA, other: pokemonB },
                { pokemon: pokemonB, other: pokemonA },
              ].map(({ pokemon, other }) => {
                const types = pokemon.type.split('/')
                const typesOther = other.type.split('/')
                const weak = getWeaknesses(types)
                const res = getResistances(types)
                const resFromOther = typesOther.flatMap((t) => getResistances([t]))
                const covered = weak.filter((w) => resFromOther.includes(w))
                const NOTcovered = weak.filter((w) => !resFromOther.includes(w))
                return (
                  <div
                    key={pokemon.id}
                    style={{ padding: '1rem', borderRadius: '8px', border: '1px solid rgba(220, 232, 220, 0.95)', background: 'rgba(255,255,255,0.88)' }}
                  >
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <img
                        src={pokemonImage(pokemon.name)}
                        alt={pokemon.name}
                        style={{ width: '48px', height: '48px', objectFit: 'contain', border: '2px solid #dce8dc', borderRadius: '8px', background: '#f2f8f2' }}
                        loading="lazy"
                      />
                      <div>
                        <Link href={`/wiki/pokemon/${pokemon.id}`} style={{ fontWeight: 900, fontSize: '0.95rem' }}>
                          {pokemon.name}
                        </Link>
                        <p style={{ color: '#637083', fontSize: '0.8rem' }}>{pokemon.type} · {pokemon.specialty}</p>
                      </div>
                    </div>
                    {NOTcovered.length > 0 && (
                      <div style={{ marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#c62828', textTransform: 'uppercase' }}>Weak to (not covered by {other.name})</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.25rem' }}>
                          {NOTcovered.map((w) => (
                            <span key={w} style={{ padding: '0.2rem 0.45rem', borderRadius: '999px', background: '#ffebee', color: '#c62828', fontSize: '0.75rem', fontWeight: 800 }}>{w}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {covered.length > 0 && (
                      <div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#237044', textTransform: 'uppercase' }}>Weaknesses covered by {other.name}</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.25rem' }}>
                          {covered.map((w) => (
                            <span key={w} style={{ padding: '0.2rem 0.45rem', borderRadius: '999px', background: '#e8f5e9', color: '#237044', fontSize: '0.75rem', fontWeight: 800 }}>{w}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {NOTcovered.length === 0 && (
                      <p style={{ color: '#237044', fontSize: '0.82rem', fontWeight: 800 }}>✓ {other.name} covers all of {pokemon.name}&apos;s weaknesses</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <div style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
            <Link href={`/wiki/pokemon/${pokemonA?.id}`} style={{ padding: '0.5rem 0.85rem', border: '1px solid #dce8dc', borderRadius: '999px', background: 'white', fontSize: '0.85rem', fontWeight: 800 }}>
              Open {pokemonA?.name} page
            </Link>
            <Link href={`/wiki/pokemon/${pokemonB?.id}`} style={{ padding: '0.5rem 0.85rem', border: '1px solid #dce8dc', borderRadius: '999px', background: 'white', fontSize: '0.85rem', fontWeight: 800 }}>
              Open {pokemonB?.name} page
            </Link>
            <Link href={`/wiki/habitat/${pokemonA?.habitat}`} style={{ padding: '0.5rem 0.85rem', border: '1px solid #dce8dc', borderRadius: '999px', background: 'white', fontSize: '0.85rem', fontWeight: 800 }}>
              {pokemonA && habitatNames[pokemonA.habitat]} habitat
            </Link>
          </div>
        </section>
      )}

      {/* Suggestions for slot A */}
      {teamSuggestions.length > 0 && slotA && (
        <section style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem' }}>
              Best Partners for {pokemonData.find((p) => p.id === slotA)?.name}
            </h2>
            <Link href="/tools/team-builder" style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2f84d8' }}>
              Open full Team Builder →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
            {teamSuggestions.map(({ pokemon, score, coversWeakA, coversWeakB, roleDiff, habitatDiff }) => (
              <div
                key={pokemon.id}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(220, 232, 220, 0.95)',
                  background: 'rgba(255, 253, 247, 0.96)',
                  boxShadow: '0 3px 0 rgba(47, 76, 113, 0.08)',
                }}
              >
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <img
                    src={pokemonImage(pokemon.name)}
                    alt={pokemon.name}
                    style={{ width: '52px', height: '52px', objectFit: 'contain', border: '2px solid #dce8dc', borderRadius: '8px', background: '#f2f8f2' }}
                    loading="lazy"
                  />
                  <div>
                    <Link href={`/wiki/pokemon/${pokemon.id}`} style={{ fontWeight: 900, fontSize: '0.95rem', display: 'block' }}>
                      {pokemon.name}
                    </Link>
                    <p style={{ color: '#637083', fontSize: '0.78rem' }}>{pokemon.type} · {pokemon.specialty}</p>
                    <span className={`rarity ${pokemon.rarity}`} style={{ fontSize: '0.7rem' }}>{pokemon.rarity}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {coversWeakA && <span style={{ padding: '0.2rem 0.4rem', borderRadius: '4px', background: '#e8f5e9', color: '#237044', fontSize: '0.72rem', fontWeight: 800 }}>Covers your weaknesses</span>}
                  {coversWeakB && <span style={{ padding: '0.2rem 0.4rem', borderRadius: '4px', background: '#e8f5e9', color: '#237044', fontSize: '0.72rem', fontWeight: 800 }}>You cover their weaknesses</span>}
                  {roleDiff && <span style={{ padding: '0.2rem 0.4rem', borderRadius: '4px', background: '#e3f2fd', color: '#1565c0', fontSize: '0.72rem', fontWeight: 800 }}>Different role</span>}
                  {habitatDiff && <span style={{ padding: '0.2rem 0.4rem', borderRadius: '4px', background: '#fff3e0', color: '#e65100', fontSize: '0.72rem', fontWeight: 800 }}>Different habitat</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Type matchup reference */}
      <section
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '2px solid rgba(220, 232, 220, 0.82)',
          background: 'rgba(255, 253, 247, 0.88)',
        }}
      >
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.85rem' }}>Type Matchup Reference</h2>
        <p style={{ color: '#637083', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Use this quick reference to understand type effectiveness. The compatibility tool uses
          these same relationships to compute defensive complement scores.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.65rem' }}>
          {ALL_TYPES.map((type) => {
            const strong = Object.entries(TYPE_CHART[type] || {}).filter(([, m]) => m >= 2).map(([t]) => t)
            const weak = Object.entries(TYPE_CHART[type] || {}).filter(([, m]) => m <= 0.5).map(([t]) => t)
            const immune = Object.entries(TYPE_CHART[type] || {}).filter(([, m]) => m === 0).map(([t]) => t)
            return (
              <div key={type} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(220, 232, 220, 0.95)', background: 'rgba(255,255,255,0.88)' }}>
                <strong style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.88rem' }}>{type}</strong>
                {strong.length > 0 && (
                  <div style={{ marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.68rem', color: '#c62828', fontWeight: 900 }}>Strong vs</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem', marginTop: '0.15rem' }}>
                      {strong.map((t) => <span key={t} style={{ padding: '0.1rem 0.3rem', borderRadius: '3px', background: '#ffebee', color: '#c62828', fontSize: '0.7rem', fontWeight: 800 }}>{t}</span>)}
                    </div>
                  </div>
                )}
                {weak.length > 0 && (
                  <div style={{ marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.68rem', color: '#237044', fontWeight: 900 }}>Weak vs</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem', marginTop: '0.15rem' }}>
                      {weak.map((t) => <span key={t} style={{ padding: '0.1rem 0.3rem', borderRadius: '3px', background: '#e8f5e9', color: '#237044', fontSize: '0.7rem', fontWeight: 800 }}>{t}</span>)}
                    </div>
                  </div>
                )}
                {immune.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.68rem', color: '#555', fontWeight: 900 }}>Immune vs</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem', marginTop: '0.15rem' }}>
                      {immune.map((t) => <span key={t} style={{ padding: '0.1rem 0.3rem', borderRadius: '3px', background: '#f5f5f5', color: '#555', fontSize: '0.7rem', fontWeight: 800 }}>{t}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
