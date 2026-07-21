import { Metadata } from 'next'
import habitatsData from '@/data/habitats.json'
import { canonicalUrl } from '@/lib/site'
import { noIndexMetadata } from '@/lib/indexing'
import { CreditedImage } from '@/components/media/CreditedImage'
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'

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
            <CreditedImage src={h.image_url} alt={h.image_alt || h.name} source={h.image_source} sourceUrl={h.image_source_url} licenseNote={h.image_license_note} originalMedia={h.image_original_media} creditLink={false} />
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
                <dd>{shortText(h.farming_route[1], 72)}</dd>
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
