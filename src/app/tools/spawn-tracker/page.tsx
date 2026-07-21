import { Metadata } from 'next'
import { SpawnTracker } from '@/components/tools/SpawnTracker'
import { BreadcrumbJsonLd, FAQJsonLd, ToolJsonLd } from '@/components/seo/JsonLd'
import { canonicalUrl } from '@/lib/site'
import { DataStatus } from '@/components/content/DataStatus'

export const metadata: Metadata = {
  title: 'Pokopia Spawn Tracker: Locations and Weather',
  description: 'Find Pokopia Pokemon spawns by habitat, weather, time, rarity, type, food, drops, and related route pages.',
  keywords: [
    'Pokopia spawn tracker',
    'Pokopia spawn time',
    'Pokopia Pokemon spawn',
    'Pokopia weather spawn',
    'Pokopia habitat spawn',
    'Pokopia rare spawn',
    'Pokopia spawn food',
    'Pokopia Pokemon drops',
  ],
  openGraph: {
    title: 'Pokopia Spawn Tracker: Locations and Weather',
    description: 'Find Pokemon spawns by habitat, weather, time, rarity, type, food, drops, and related route pages.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Spawn Tracker: Locations and Weather',
    description: 'Find Pokemon spawns by habitat, weather, time, rarity, type, food, drops, and related route pages.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/tools/spawn-tracker'),
  },
}

const spawnUseCases = [
  {
    title: 'Find a target route',
    text: 'Search by Pokemon name, type, food, or drop, then open the linked habitat page to check weather and route difficulty.',
  },
  {
    title: 'Compare rare targets',
    text: 'Filter by rarity before choosing a recipe or farming loop. This helps avoid spending a rare buff on a route with too few useful checks.',
  },
  {
    title: 'Check weather timing',
    text: 'Use the weather and time filters together when a route only makes sense under specific spawn conditions.',
  },
]

const spawnTrackerFaqs = [
  {
    question: 'What can I search in the Pokopia Spawn Tracker?',
    answer: 'You can search by Pokemon name, type, description, favorite food, skills, drops, or habitat name, then combine the search with habitat, weather, time, and rarity filters.',
  },
  {
    question: 'Why does the tracker show broad results?',
    answer: 'Broad results mean the current filters are still exploratory. Add one more filter, such as weather or rarity, before treating the list as a farming route.',
  },
  {
    question: 'What should I check after finding a spawn target?',
    answer: 'Open the Pokemon page for food, drops, and role notes, then open the habitat page to confirm route difficulty, weather, and recipe timing.',
  },
]

const sourceReviewNotes = [
  'Uses Pokopia Portal Pokemon and habitat datasets as spawn lookup inputs.',
  'Filters records by text fields such as habitat, weather, time, rarity, food, drops, type, and role notes.',
  'Links results to supporting Pokemon and habitat pages so route context can be checked before farming.',
]

const toolLimits = [
  'Do not treat tracker results as live official spawn rates, guaranteed encounter tables, or event-specific availability.',
  'Broad results are shortlists; add weather, time, habitat, or rarity filters before planning a farming route.',
  'Spawn records should be reviewed after official updates, source-backed guide changes, or database corrections.',
]

export default function SpawnTrackerPage() {
  return (
    <main className="page-shell">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Spawn Tracker', url: '/tools/spawn-tracker' },
        ]}
      />
      <FAQJsonLd title="Spawn Tracker FAQ" faqs={spawnTrackerFaqs} />
      <ToolJsonLd
        name="Pokopia Spawn Tracker"
        description="Interactive Pokopia spawn tracking tool for filtering Pokemon by habitat, weather, time, rarity, food, drops, and type."
        url="/tools/spawn-tracker"
        featureList={[
          'Search Pokemon spawn records',
          'Filter by habitat, weather, time, and rarity',
          'Review food and drop data',
          'Open related Pokemon and habitat pages',
        ]}
      />
      <section className="page-hero">
        <h1>Spawn Tracker</h1>
        <p>Filter current database entries by habitat, weather, time, rarity, food, drops, and type.</p>
      </section>

      <DataStatus
        status="Tool using unverified editorial spawn data"
        note="Results are generated from Pokopia Portal planning records, not official or confirmed game data. They do not verify Pokémon names, habitats, weather, time, food, drops, rarity, or spawn conditions."
        updatedAt="July 21, 2026"
        showPolicyLink
      />

      <SpawnTracker />

      <section className="tool-next-steps">
        <h2>Source Review Notes</h2>
        <div className="tool-guide-grid" aria-label="Spawn tracker source review">
          <div className="tool-guide-card">
            <strong>Data basis</strong>
            <ul>
              {sourceReviewNotes.map((note) => <li key={note}>{note}</li>)}
            </ul>
          </div>
          <div className="tool-guide-card">
            <strong>Use limits</strong>
            <ul>
              {toolLimits.map((limit) => <li key={limit}>{limit}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="tool-guide-grid" aria-label="Spawn tracker use cases">
        {spawnUseCases.map((item) => (
          <div key={item.title} className="tool-guide-card">
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </div>
        ))}
      </section>

      <section className="tool-next-steps">
        <h2>Spawn Tracker FAQ</h2>
        <div className="tool-faq-stack">
          {spawnTrackerFaqs.map((faq) => (
            <div key={faq.question}>
              <strong>{faq.question}</strong>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="tool-next-steps">
        <h2>How to use spawn results</h2>
        <p>
          Treat the table as a shortlist. Open the Pokemon page for food, drops, and role context,
          then open the habitat page to confirm whether the route fits your team and recipe timing.
        </p>
        <div>
          <a href="/official/gameplay-overview">Check gameplay context</a>
          <a href="/official/official-beginner-tips">Read official tips</a>
          <a href="/tools/habitat-planner">Plan habitat route</a>
          <a href="/tools/recipe-calculator">Compare recipe support</a>
        </div>
      </section>
    </main>
  )
}
