import { Metadata } from 'next'
import Link from 'next/link'
import guidesData from '@/data/guides.json'
import habitatsData from '@/data/habitats.json'
import pokemonData from '@/data/pokemon.json'
import recipesData from '@/data/recipes.json'
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'
import { DataStatus } from '@/components/content/DataStatus'
import { OfficialContext } from '@/components/content/OfficialContext'
import { canonicalUrl } from '@/lib/site'
import { noIndexMetadata } from '@/lib/indexing'

const updatedAt = '2026-05-27'

const routeSteps = [
  {
    title: 'Start with a repeatable rare check',
    text: 'Rare farming starts when the route is already known. Use Honey Cake or a low-cost setup for routine rare checks before spending legendary-tier recipe value.',
    links: [
      { label: 'Fast Rare Farming', href: '/guides/fast-farming-rare-pokemon' },
      { label: 'Honey Cake', href: '/wiki/recipe/rec001' },
      { label: 'Spawn Tracker', href: '/tools/spawn-tracker' },
    ],
  },
  {
    title: 'Save Lucky Charm for the tightest window',
    text: 'Lucky Charm should support a target with a clear habitat, food cost, time window, and weather condition. Do not spend it while still learning the route.',
    links: [
      { label: 'Lucky Charm', href: '/wiki/recipe/rec005' },
      { label: 'Legendary Guide', href: '/guides/how-to-get-legendary-pokemon' },
      { label: 'Recipe Calculator', href: '/tools/recipe-calculator' },
    ],
  },
  {
    title: 'Pick the habitat by failure risk',
    text: 'Frost Peak is a cleaner mid-route rare farm, while Shadow Marsh and Volcanic Cave need tighter planning. Choose the route that your team can repeat without burning recovery resources.',
    links: [
      { label: 'Frost Peak', href: '/wiki/habitat/hab005' },
      { label: 'Shadow Marsh', href: '/wiki/habitat/hab006' },
      { label: 'Volcanic Cave', href: '/wiki/habitat/hab001' },
    ],
  },
  {
    title: 'Stop when the target check is finished',
    text: 'A rare route is not a full clear by default. Exit after the target spawn and material checks are done, then adjust the team or recipe before the next attempt.',
    links: [
      { label: 'Habitat Planner', href: '/tools/habitat-planner' },
      { label: 'Team Builder', href: '/tools/team-builder' },
      { label: 'Shadow Marsh Guide', href: '/guides/shadow-marsh-guide' },
    ],
  },
]

const rareFaqs = [
  {
    question: 'When should I start rare farming in Pokopia?',
    answer: 'Start rare farming after the route is mapped and the target Pokemon has a clear habitat, food, weather, and time condition.',
  },
  {
    question: 'Should I use Lucky Charm on every rare route?',
    answer: 'No. Use Lucky Charm for high-value legendary or rare checks after the route is repeatable. Use cheaper recipe support for scouting or routine farming.',
  },
  {
    question: 'What is the biggest rare farming mistake?',
    answer: 'The biggest mistake is turning a short rare check into a full clear and wasting the recipe duration after the target window has already passed.',
  },
]

const guideSlugs = [
  'fast-farming-rare-pokemon',
  'how-to-get-legendary-pokemon',
  'shadow-marsh-guide',
  'frost-peak-guide',
  'legendary-locations-guide',
]

const pokemonIds = ['pkm009', 'pkm030', 'pkm029', 'pkm007', 'pkm015', 'pkm044', 'pkm050']
const habitatIds = ['hab006', 'hab005', 'hab001', 'hab012', 'hab018']
const recipeIds = ['rec005', 'rec001', 'rec010', 'rec008', 'rec002', 'rec011']

function byId<T extends { id: string }>(items: T[], ids: string[]) {
  return ids
    .map((id) => items.find((item) => item.id === id))
    .filter(Boolean) as T[]
}

function bySlug<T extends { slug: string }>(items: T[], slugs: string[]) {
  return slugs
    .map((slug) => items.find((item) => item.slug === slug))
    .filter(Boolean) as T[]
}

export const metadata: Metadata = {
  title: 'Pokopia Rare Farming Route - Lucky Charm, Habitats, and Rare Pokemon',
  description: 'Plan a Pokopia rare farming route with Lucky Charm timing, rare Pokemon targets, high-value habitats, recipe support, and tool workflows.',
  robots: noIndexMetadata,
  openGraph: {
    title: 'Pokopia Rare Farming Route - Lucky Charm, Habitats, and Rare Pokemon',
    description: 'Plan a Pokopia rare farming route with Lucky Charm timing, rare Pokemon targets, habitats, recipe support, and tools.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Rare Farming Route - Lucky Charm, Habitats, and Rare Pokemon',
    description: 'Plan a Pokopia rare farming route with Lucky Charm timing, rare Pokemon targets, habitats, recipe support, and tools.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/guides/rare-farming-route'),
  },
}

export default function RareFarmingRoutePage() {
  const guides = bySlug(guidesData, guideSlugs)
  const pokemon = byId(pokemonData, pokemonIds)
  const habitats = byId(habitatsData, habitatIds)
  const recipes = byId(recipesData, recipeIds)

  return (
    <main className="page-shell topic-page">
      <ArticleJsonLd
        title="Pokopia Rare Farming Route"
        description="Plan a Pokopia rare farming route with Lucky Charm timing, rare Pokemon targets, high-value habitats, recipe support, and tool workflows."
        url="/guides/rare-farming-route"
        publishedAt={updatedAt}
        modifiedAt={updatedAt}
        type="Guide"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Guides', url: '/guides' },
          { name: 'Rare Farming Route', url: '/guides/rare-farming-route' },
        ]}
      />
      <ItemListJsonLd
        name="Pokopia Rare Farming Route Resources"
        description="Rare Pokemon targets, high-value habitats, recipes, and planning tools for Pokopia rare farming."
        url="/guides/rare-farming-route"
        items={[
          ...guides.map((guide) => ({ name: guide.title, url: `/guides/${guide.slug}` })),
          ...pokemon.map((item) => ({ name: item.name, url: `/wiki/pokemon/${item.id}` })),
          ...habitats.map((item) => ({ name: item.name, url: `/wiki/habitat/${item.id}` })),
          ...recipes.map((item) => ({ name: item.name, url: `/wiki/recipe/${item.id}` })),
        ]}
      />
      <FAQJsonLd title="Pokopia Rare Farming Route FAQ" faqs={rareFaqs} />

      <section className="topic-hero">
        <span className="panel-kicker">Rare Farming Topic Route</span>
        <h1>Pokopia Rare Farming Route</h1>
        <p>
          Use this route when the goal is a rare or legendary target, not a full habitat clear.
          Pick the target first, confirm the weather and time window, then decide whether the recipe cost is justified.
        </p>
        <div className="topic-hero-actions">
          <Link href="/tools/spawn-tracker">Check spawn windows</Link>
          <Link href="/tools/recipe-calculator">Compare recipes</Link>
          <Link href="/tools/habitat-planner">Plan the habitat</Link>
        </div>
      </section>

      <DataStatus
        status="Editorial rare farming route"
        note="This topic page organizes site guides, rare Pokemon entries, habitats, recipes, and planning tools into a route framework. Recheck details after launch or balance updates."
        updatedAt={updatedAt}
      />

      <OfficialContext
        title="Official Context Before Rare Farming"
        description="Official sources confirm the broader Pokopia building, food, and exploration loop. Rare farming recommendations here are editorial planning based on site data."
        links={[
          { href: '/official/gameplay-overview', label: 'Gameplay overview' },
          { href: '/official/official-beginner-tips', label: 'Official beginner tips' },
        ]}
      />

      <section className="topic-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Route Logic</span>
            <h2>The Rare Farming Loop</h2>
          </div>
          <Link href="/tools">Open tools</Link>
        </div>
        <div className="topic-step-grid">
          {routeSteps.map((step, index) => (
            <article key={step.title} className="topic-step-card">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <div>
                {step.links.map((link) => (
                  <Link key={link.href} href={link.href}>{link.label}</Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="topic-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Targets</span>
            <h2>Rare and Legendary Pokemon to Check</h2>
          </div>
          <Link href="/tools/spawn-tracker">Use Spawn Tracker</Link>
        </div>
        <div className="topic-resource-grid">
          {pokemon.map((item) => (
            <Link key={item.id} href={`/wiki/pokemon/${item.id}`} className="related-content-card">
              <span>{item.rarity}</span>
              <strong>{item.name}</strong>
              <p>{item.type} · {item.favorite_food}</p>
              <small>{item.spawn_time} / {item.weather} · {item.drops}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="topic-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Route Support</span>
            <h2>Habitats and Recipes for Rare Checks</h2>
          </div>
          <Link href="/tools/recipe-calculator">Recipe Calculator</Link>
        </div>
        <div className="topic-two-column">
          <div className="topic-link-list">
            <h3>Habitats</h3>
            {habitats.map((item) => (
              <Link key={item.id} href={`/wiki/habitat/${item.id}`}>
                <strong>{item.name}</strong>
                <span>{item.difficulty} · {item.weather} · {item.resource_bonus}</span>
              </Link>
            ))}
          </div>
          <div className="topic-link-list">
            <h3>Recipes</h3>
            {recipes.map((item) => (
              <Link key={item.id} href={`/wiki/recipe/${item.id}`}>
                <strong>{item.name}</strong>
                <span>{item.rarity} · {item.buff} · {item.best_use}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="topic-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Read Next</span>
            <h2>Guides That Support Rare Farming</h2>
          </div>
        </div>
        <div className="related-content-grid">
          {guides.map((guide) => (
            <Link key={guide.id} href={`/guides/${guide.slug}`} className="related-content-card">
              <span>{guide.category}</span>
              <strong>{guide.title}</strong>
              <p>{guide.answer || guide.seo_keyword}</p>
              <small>{guide.steps?.length || 0} route checks</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="topic-section topic-faq">
        <h2>Rare Farming Route FAQ</h2>
        <div>
          {rareFaqs.map((faq) => (
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
