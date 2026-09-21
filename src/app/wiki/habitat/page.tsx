import { Metadata } from 'next'
import habitatsData from '@/data/habitats.json'
import { canonicalUrl } from '@/lib/site'
import { noIndexMetadata } from '@/lib/indexing'
import { CreditedImage } from '@/components/media/CreditedImage'
import { DataStatus } from '@/components/content/DataStatus'
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'
import { habitatImage } from '@/lib/localImages'

const habitatRouteGroups = [
  {
    title: 'First farming loop',
    text: 'Use these areas when you need lower failure cost, clear resource goals, and simple spawn checks.',
    ids: ['hab002', 'hab003', 'hab020'],
  },
  {
    title: 'Weather practice',
    text: 'Use these routes to learn how weather changes route timing before moving into hard areas.',
    ids: ['hab004', 'hab005', 'hab008'],
  },
  {
    title: 'High-risk farming',
    text: 'Scout these habitats once your team, recipe timing, and retreat plan are already stable.',
    ids: ['hab001', 'hab006', 'hab012'],
  },
]

function shortText(text: string, length = 160) {
  if (text.length <= length) return text
  return `${text.slice(0, length).trim()}...`
}

export const metadata: Metadata = {
  title: 'Habitat Maps and Route Notes',
  description: 'Explore Pokopia habitats with unlock conditions, weather, difficulty, resource bonuses, spawn lists, and editorial route notes.',
  keywords: [
    'Pokopia habitats',
    'Pokopia habitat map',
    'Pokopia habitat list',
    'Pokopia best habitat',
    'Pokopia habitat route',
    'Pokopia habitat difficulty',
    'Pokopia unlock habitat',
  ],
  openGraph: {
    title: 'Habitat Maps and Route Notes',
    description: 'Explore Pokopia habitats with unlocks, weather, difficulty, resources, and spawns.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Habitat Maps and Route Notes',
    description: 'Explore Pokopia habitats with unlocks, weather, difficulty, resources, and spawns.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/wiki/habitat'),
  },
  robots: noIndexMetadata,
}

export default function HabitatPage() {
  const difficultyCounts = habitatsData.reduce<Record<string, number>>((counts, habitat) => {
    counts[habitat.difficulty] = (counts[habitat.difficulty] || 0) + 1
    return counts
  }, {})
  const starterHabitats = habitatsData
    .filter((habitat) => habitat.difficulty === 'easy')
    .slice(0, 4)
  const hardHabitats = habitatsData
    .filter((habitat) => habitat.difficulty === 'hard')
    .slice(0, 4)
  const findHabitat = (id: string) => habitatsData.find((habitat) => habitat.id === id)

  return (
    <main className="page-shell">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Habitats', url: '/wiki/habitat' },
        ]}
      />
      <ItemListJsonLd
        name="Habitat Maps and Route Notes"
        description="Explore Pokopia habitats by unlock condition, weather, difficulty, resource bonus, and spawn route."
        url="/wiki/habitat"
        items={habitatsData.map((habitat) => ({
          name: habitat.name,
          url: `/wiki/habitat/${habitat.id}`,
        }))}
      />
      <section className="page-hero">
        <h1>Habitat Maps and Route Notes</h1>
        <p>Explore Pokopia habitats by unlock condition, weather, difficulty, resource bonus, and spawn route.</p>
      </section>

      <DataStatus
        status="Unverified editorial habitat data"
        note="These habitat records are editorial planning data, not official or confirmed Pokopia locations. Credited promotional images identify their media sources only and do not depict or verify the named habitats or their gameplay claims."
        updatedAt="July 21, 2026"
        showPolicyLink
      />

      {/* Featured habitats strip */}
      <section style={{ padding: 'var(--space-5) 0', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 var(--space-4)' }}>
          <div style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'var(--color-secondary)', fontWeight: 800, textTransform: 'uppercase', fontSize: 'var(--font-size-xs)', margin: 0 }}>Route Highlights</p>
              <h2 style={{ margin: '4px 0 0', fontSize: 'var(--font-size-xl)', fontWeight: 900 }}>Featured Habitats</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            {habitatsData.slice(0, 6).map((hab) => (
              <a key={hab.id} href={`/wiki/habitat/${hab.id}`} className="card" style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', textDecoration: 'none', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 110, overflow: 'hidden', background: 'var(--color-bg-alt)' }}>
                  <img
                    src={hab.image_url && !hab.image_url.startsWith('http') ? hab.image_url : habitatImage(hab.id, hab.name)}
                    alt={hab.name}
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: 'var(--space-2) var(--space-3)', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '4px' }}>
                    <span className={`badge ${hab.difficulty}`}>{hab.difficulty}</span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{hab.weather}</span>
                  </div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' }}>{hab.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{hab.resource_bonus}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="index-guide-panel">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Route Index</span>
            <h2>Pick a Habitat by Risk and Reward</h2>
          </div>
          <a href="/tools/habitat-planner">Open Habitat Planner</a>
        </div>
        <div className="index-guide-grid">
          <div className="index-guide-card">
            <strong>Starter-safe areas</strong>
            <p>Use easy habitats for route learning, food checks, and low-cost farming before spending rare recipes.</p>
            <div>
              {starterHabitats.map((habitat) => (
                <a key={habitat.id} href={`/wiki/habitat/${habitat.id}`}>{habitat.name}</a>
              ))}
            </div>
          </div>
          <div className="index-guide-card">
            <strong>Hard route targets</strong>
            <p>Hard habitats should be scouted first, then repeated only when your team, recipe, and weather plan are stable.</p>
            <div>
              {hardHabitats.map((habitat) => (
                <a key={habitat.id} href={`/wiki/habitat/${habitat.id}`}>{habitat.name}</a>
              ))}
            </div>
          </div>
          <div className="index-guide-card">
            <strong>Difficulty spread</strong>
            <p>Use this spread to decide whether the next session should focus on progression, farming, or safer daily loops.</p>
            <div>
              {Object.entries(difficultyCounts).map(([difficulty, count]) => (
                <span key={difficulty}>{difficulty}: {count}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="index-guide-panel">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Route Planner</span>
            <h2>Choose a Habitat for This Session</h2>
          </div>
          <a href="/guides/beginner-route">Open beginner route</a>
        </div>
        <div className="index-guide-grid">
          {habitatRouteGroups.map((group) => (
            <div key={group.title} className="index-guide-card">
              <strong>{group.title}</strong>
              <p>{group.text}</p>
              <div>
                {group.ids.map((id) => {
                  const habitat = findHabitat(id)
                  if (!habitat) return null
                  return (
                    <a key={id} href={`/wiki/habitat/${habitat.id}`}>
                      {habitat.name} · {habitat.difficulty}
                    </a>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="pokemon-grid">
        {habitatsData.map((h) => (
          <a key={h.id} href={`/wiki/habitat/${h.id}`} className="card">
            <CreditedImage src={h.image_url} alt={h.image_alt || h.name} source={h.image_source} sourceUrl={h.image_source_url} licenseNote={h.image_license_note} originalMedia={h.image_original_media} rightsStatus={h.image_rights_status} creditLink={false} fallbackSrc={habitatImage(h.id, h.name)} fallbackAlt={`${h.name} habitat illustration`} />
            <h3 className="index-card-title index-card-title-center">{h.name}</h3>
            <p className="index-card-meta">{h.unlock_condition}</p>
            <p className="index-card-submeta">{h.weather} · {h.resource_bonus}</p>
            <p className="index-card-summary">{shortText(h.overview, 145)}</p>
            <dl className="index-card-facts">
              <div>
                <dt>Build</dt>
                <dd>{h.recommended_build}</dd>
              </div>
              <div>
                <dt>Route</dt>
                <dd>{h.farming_route && h.farming_route[1] ? shortText(h.farming_route[1], 72) : 'N/A'}</dd>
              </div>
            </dl>
            <div className="index-card-badges index-card-badges-center">
              <span className={`badge ${h.difficulty}`}>{h.difficulty}</span>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
