import { Metadata } from 'next'
import Link from 'next/link'
import pokemonData from '@/data/pokemon.json'
import habitatsData from '@/data/habitats.json'
import { BreadcrumbJsonLd, FAQJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'
import { DataStatus } from '@/components/content/DataStatus'
import { canonicalUrl } from '@/lib/site'
import { noIndexMetadata } from '@/lib/indexing'

const updatedAt = '2026-08-10'

const builderFriendlySpecialties = ['Support', 'Defender', 'Tank', 'Speedster']

const builderPokemon = pokemonData.filter((p) =>
  builderFriendlySpecialties.includes(p.specialty)
)

const builderFaqs = [
  {
    question: 'What is Builder Mode in Pokopia?',
    answer: 'Builder Mode is a construction and resource-management focused gameplay mode where players use Pokemon to gather materials, maintain structures, and expand their base. Unlike combat-focused gameplay, Builder Mode rewards stable, low-activity Pokemon that can generate resources reliably without constant attention.',
  },
  {
    question: 'Which Pokemon are best for Builder Mode?',
    answer: 'Pokemon with Support, Defender, Tank, and Speedster specialties are generally the most builder-friendly. Support Pokemon provide stable material generation, Defenders offer defensive stability for base protection, Tanks absorb damage during construction tasks, and Speedsters can quickly scout and retrieve resources across multiple points.',
  },
  {
    question: 'What is the activity cost difference for builder Pokemon?',
    answer: 'Builder-friendly Pokemon typically have lower activity demands compared to Attacker-role Pokemon. Support and Tank roles are designed to operate with minimal food expenditure, making them ideal for long construction sessions where constant feeding would otherwise drain resources.',
  },
  {
    question: 'How do I farm materials effectively in Builder Mode?',
    answer: 'Use Support-role Pokemon to generate materials passively during construction. Match your Pokemon weather preferences to the current conditions for increased spawn rates. Focus on one habitat at a time and exit once the target material is collected rather than extending runs unnecessarily.',
  },
]

const roleExamples: Record<string, string[]> = {
  Support: builderPokemon.filter((p) => p.specialty === 'Support').slice(0, 2).map((p) => p.id),
  Defender: builderPokemon.filter((p) => p.specialty === 'Defender').slice(0, 2).map((p) => p.id),
  Tank: builderPokemon.filter((p) => p.specialty === 'Tank').slice(0, 2).map((p) => p.id),
  Speedster: builderPokemon.filter((p) => p.specialty === 'Speedster').slice(0, 2).map((p) => p.id),
}

function byId<T extends { id: string }>(items: T[], ids: string[]) {
  return ids
    .map((id) => items.find((item) => item.id === id))
    .filter(Boolean) as T[]
}

export const metadata: Metadata = {
  title: 'Pokopia Builder Pokemon List – Complete Builder Mode Roster | Pokopia Cloud',
  description: 'A complete list of builder-friendly Pokemon in Pokopia, filtered by Support, Defender, Tank, and Speedster roles for stable material generation and construction gameplay.',
  keywords: [
    'pokopia builder pokemon list',
    'pokopia builder mode',
    'pokopia builder pokemon',
    'pokopia construction pokemon',
    'pokopia support pokemon',
    'pokopia defender pokemon',
    'pokopia tank pokemon',
    'pokopia speedster pokemon',
    'pokopia builder guide',
    'pokopia material farming',
  ],
  openGraph: {
    title: 'Pokopia Builder Pokemon List – Complete Builder Mode Roster',
    description: 'A complete list of builder-friendly Pokemon in Pokopia filtered by Support, Defender, Tank, and Speedster roles.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Builder Pokemon List – Complete Builder Mode Roster',
    description: 'A complete list of builder-friendly Pokemon in Pokopia filtered by Support, Defender, Tank, and Speedster roles.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/guides/builder-pokemon-list'),
  },
  robots: noIndexMetadata,
}

export default function BuilderPokemonListPage() {
  const habitatMap = Object.fromEntries(habitatsData.map((h) => [h.id, h]))
  const allRoleExamples = [
    ...roleExamples.Support,
    ...roleExamples.Defender,
    ...roleExamples.Tank,
    ...roleExamples.Speedster,
  ]
  const roleExamplePokemon = byId(pokemonData, allRoleExamples.filter(Boolean) as string[])

  return (
    <main className="page-shell guide-detail-page">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Guides', url: '/guides' },
          { name: 'Builder Pokemon List', url: '/guides/builder-pokemon-list' },
        ]}
      />
      <ItemListJsonLd
        name="Pokopia Builder Pokemon List"
        description="A complete list of builder-friendly Pokemon in Pokopia filtered by Support, Defender, Tank, and Speedster roles."
        url="/guides/builder-pokemon-list"
        items={[
          ...builderPokemon.map((p) => ({ name: p.name, url: `/wiki/pokemon/${p.id}` })),
          { name: 'Full Pokemon Database', url: '/wiki/pokemon' },
          { name: 'Habitat Planner', url: '/tools/habitat-planner' },
          { name: 'Team Builder', url: '/tools/team-builder' },
        ]}
      />
      <FAQJsonLd title="Pokopia Builder Mode FAQ" faqs={builderFaqs} />

      <section className="guide-detail-hero topic-hero">
        <span className="panel-kicker">Builder Mode Guide</span>
        <h1>Pokopia Builder Pokemon List</h1>
        <p>
          A complete roster of Pokemon suited for Builder Mode, filtered by Support, Defender, Tank,
          and Speedster specialties. These roles offer stable material generation, low activity demands,
          and reliable performance during construction-focused gameplay.
        </p>
        <div className="topic-hero-actions">
          <Link href="/wiki/pokemon">Full Pokemon database</Link>
          <Link href="/tools/habitat-planner">Plan a habitat</Link>
          <Link href="/tools/team-builder">Build a team</Link>
        </div>
      </section>

      <DataStatus
        status="Unverified editorial builder guide"
        note="This page organizes unverified Pokopia Portal planning data for builder-mode Pokemon selection. It is not an official or confirmed game guide. All Pokemon roles, activity costs, and material generation claims require independent in-game verification."
        updatedAt={updatedAt}
        showPolicyLink
      />

      <section className="guide-content-section topic-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Builder Mode</span>
            <h2>What is Builder Mode in Pokopia?</h2>
          </div>
        </div>
        <div className="guide-answer-panel">
          <p>
            Builder Mode is a construction and resource-management focused gameplay mode in Pokopia.
            Players deploy Pokemon to gather materials, maintain structures, and expand their base.
            Unlike combat-focused routes that demand high activity and frequent food expenditure,
            Builder Mode rewards Pokemon that can operate stably over extended sessions with minimal
            intervention. Choosing the right Pokemon for this mode means less time managing resources
            and more time progressing through construction goals.
          </p>
        </div>
      </section>

      <section className="guide-content-section topic-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Role Selection</span>
            <h2>Why Some Pokemon Are Better for Builder Mode</h2>
          </div>
        </div>
        <div className="guide-answer-panel">
          <p>
            Not every Pokemon is suited for the sustained, low-activity demands of construction
            gameplay. Attacker-role Pokemon often require frequent food and active management to
            maintain their damage output, making them costly for long builder sessions. In contrast,
            Support, Defender, Tank, and Speedster roles are designed around stability, durability,
            and efficiency — qualities that translate directly to better builder performance.
          </p>
          <ul>
            <li>
              <strong>Lower activity demands</strong> — Support and Tank roles consume fewer
              resources during extended sessions, reducing the need for constant food management.
            </li>
            <li>
              <strong>Support roles generate materials</strong> — Support Pokemon are naturally
              oriented toward resource generation, making them ideal for material farming within
              Builder Mode.
            </li>
            <li>
              <strong>Stable material generation</strong> — Defender and Tank roles provide
              consistent performance without the volatility of high-damage attackers, supporting
              predictable resource loops.
            </li>
            <li>
              <strong>Weather-matched passive spawns</strong> — Matching a Pokemon preferred
              weather condition increases spawn reliability, which is critical when building
              requires consistent material input over time.
            </li>
          </ul>
        </div>
      </section>

      <section className="guide-content-section topic-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Complete Roster</span>
            <h2>The Builder-Friendly Roster</h2>
          </div>
          <span>{builderPokemon.length} builder-friendly Pokemon</span>
        </div>
        <div className="guide-route-section">
          {builderPokemon.map((pokemon) => {
            const habitat = habitatMap[pokemon.habitat]
            return (
              <Link
                key={pokemon.id}
                href={`/wiki/pokemon/${pokemon.id}`}
                className="related-content-card"
              >
                <span>{pokemon.specialty}</span>
                <strong>{pokemon.name}</strong>
                <p>
                  {pokemon.type} · {pokemon.favorite_food}
                </p>
                <small>
                  {habitat?.name || pokemon.habitat} · {pokemon.weather} · {pokemon.spawn_time}
                </small>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="guide-content-section topic-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Role Breakdown</span>
            <h2>Best Builder Pokemon by Role</h2>
          </div>
        </div>
        <div className="guide-answer-panel">
          {(['Support', 'Defender', 'Tank', 'Speedster'] as const).map((role) => {
            const examples = roleExamplePokemon.filter((p) => p.specialty === role)
            if (examples.length === 0) return null
            return (
              <div key={role}>
                <h3>{role} Picks</h3>
                <div className="topic-resource-grid">
                  {examples.map((pokemon) => {
                    const habitat = habitatMap[pokemon.habitat]
                    return (
                      <Link
                        key={pokemon.id}
                        href={`/wiki/pokemon/${pokemon.id}`}
                        className="related-content-card"
                      >
                        <span>{pokemon.rarity}</span>
                        <strong>{pokemon.name}</strong>
                        <p>
                          {pokemon.type} · {pokemon.favorite_food}
                        </p>
                        <small>
                          {habitat?.name || pokemon.habitat} · {pokemon.weather}
                        </small>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="guide-content-section topic-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Strategy</span>
            <h2>Builder Mode Tips</h2>
          </div>
        </div>
        <div className="guide-answer-panel">
          <ul>
            <li>
              <strong>Keep activity costs low</strong> — Choose Support or Tank roles that
              require minimal food over the session duration. Avoid high-maintenance attackers
              unless the run has a specific damage goal.
            </li>
            <li>
              <strong>Use Support for material generation</strong> — Support-role Pokemon
              are naturally suited for resource farming. Deploy them in habitats matching
              their weather preference to maximize spawn rates.
            </li>
            <li>
              <strong>Match weather for passive spawns</strong> — Each Pokemon has a preferred
              weather condition. Running a Pokemon in its preferred weather increases spawn
              reliability, which directly improves material output during builder sessions.
            </li>
            <li>
              <strong>Exit once the target material is collected</strong> — Do not extend
              runs beyond the material goal. Continuing a run after the target is met increases
              food costs without proportional benefit.
            </li>
            <li>
              <strong>Plan habitat sequences around resource needs</strong> — Use the Habitat
              Planner to sequence habitats so that each run collects materials that feed into
              the next construction step.
            </li>
          </ul>
        </div>
      </section>

      <section className="guide-content-section topic-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Related Content</span>
            <h2>Continue Exploring</h2>
          </div>
        </div>
        <div className="related-content-grid">
          <Link href="/wiki/pokemon" className="related-content-card">
            <span>Database</span>
            <strong>Full Pokemon Database</strong>
            <p>Browse all Pokemon entries with detailed stats, skills, and habitat information.</p>
          </Link>
          <Link href="/tools/habitat-planner" className="related-content-card">
            <span>Tool</span>
            <strong>Habitat Planner</strong>
            <p>Plan habitat sequences to optimize material collection and construction progression.</p>
          </Link>
          <Link href="/tools/team-builder" className="related-content-card">
            <span>Tool</span>
            <strong>Team Builder</strong>
            <p>Assemble Pokemon teams tailored to your current construction and farming goals.</p>
          </Link>
        </div>
      </section>

      <section className="guide-content-section topic-faq">
        <h2>Builder Mode FAQ</h2>
        <div>
          {builderFaqs.map((faq) => (
            <article key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
