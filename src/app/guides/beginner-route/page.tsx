import { Metadata } from 'next'
import Link from 'next/link'
import guidesData from '@/data/guides.json'
import habitatsData from '@/data/habitats.json'
import pokemonData from '@/data/pokemon.json'
import recipesData from '@/data/recipes.json'
import { ArticleJsonLd, BreadcrumbJsonLd, ItemListJsonLd, FAQJsonLd } from '@/components/seo/JsonLd'
import { OfficialContext } from '@/components/content/OfficialContext'
import { DataStatus } from '@/components/content/DataStatus'
import { canonicalUrl } from '@/lib/site'
import { noIndexMetadata } from '@/lib/indexing'

const updatedAt = '2026-05-27'

const routeSteps = [
  {
    title: 'Pick a forgiving starter role',
    text: 'Start with a Pokemon that makes the first route stable. Bulbin is the safe defender route, Aquap teaches support timing, and Pikafire is better saved for players who already know they want early fire pressure.',
    links: [
      { label: 'Best Starter Pokemon', href: '/guides/best-starter-pokemon' },
      { label: 'Bulbin', href: '/wiki/pokemon/pkm002' },
      { label: 'Aquap', href: '/wiki/pokemon/pkm004' },
    ],
  },
  {
    title: 'Use easy habitats before chasing hard routes',
    text: 'Forest Valley, Crystal Lake, and Training Grounds are better first planning targets than a hard habitat. Use them to learn food costs, weather checks, and when a run should end.',
    links: [
      { label: 'Forest Valley', href: '/wiki/habitat/hab002' },
      { label: 'Crystal Lake', href: '/wiki/habitat/hab003' },
      { label: 'Training Grounds', href: '/wiki/habitat/hab020' },
    ],
  },
  {
    title: 'Save recipes until the route has a job',
    text: 'A recipe should solve a named problem: safer daily farming, faster route movement, rare checks, or a hard fight. If the route is still being scouted, keep the ingredient cost low.',
    links: [
      { label: 'Recipe Calculator', href: '/tools/recipe-calculator' },
      { label: 'Honey Cake', href: '/wiki/recipe/rec001' },
      { label: 'Grass Heal', href: '/wiki/recipe/rec009' },
    ],
  },
  {
    title: 'Only push Volcanic Cave after the basics are stable',
    text: 'Volcanic Cave is useful, but it should not be the first serious test. Enter it when the team has a clear damage plan, a matching recipe, and a reason to farm its fire-side materials.',
    links: [
      { label: 'How to Unlock Volcanic Cave', href: '/guides/how-to-unlock-volcanic-cave' },
      { label: 'Volcanic Cave', href: '/wiki/habitat/hab001' },
      { label: 'Fire Boost', href: '/wiki/recipe/rec002' },
    ],
  },
]

const beginnerFaqs = [
  {
    question: 'What should a new Pokopia player do first?',
    answer: 'Start by choosing a forgiving starter role, then run an easy habitat until food costs, weather checks, and route exits feel predictable.',
  },
  {
    question: 'Should beginners use rare recipes immediately?',
    answer: 'No. Save rare or expensive recipes until the route has a clear goal, such as a rare spawn check, a boss room, or a repeated material loop.',
  },
  {
    question: 'When should a beginner try harder habitats?',
    answer: 'Try harder habitats after the team can clear easy routes consistently and the next habitat has a specific material, Pokemon, or unlock reason.',
  },
]

const guideSlugs = [
  'best-starter-pokemon',
  'training-grounds-beginners',
  'complete-recipe-list',
  'how-to-unlock-volcanic-cave',
  'speed-run-leveling-route',
]

const pokemonIds = ['pkm002', 'pkm004', 'pkm001', 'pkm008', 'pkm017']
const habitatIds = ['hab002', 'hab003', 'hab020', 'hab001']
const recipeIds = ['rec001', 'rec009', 'rec003', 'rec002']

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
  title: 'Pokopia Beginner Route - Starter, Habitat, Recipe, and Tool Path',
  description: 'A beginner Pokopia route that connects starter choices, easy habitats, recipe timing, Pokemon pages, and planning tools into one practical path.',
  openGraph: {
    title: 'Pokopia Beginner Route - Starter, Habitat, Recipe, and Tool Path',
    description: 'A beginner Pokopia route that connects starter choices, easy habitats, recipe timing, Pokemon pages, and planning tools.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Beginner Route - Starter, Habitat, Recipe, and Tool Path',
    description: 'A beginner Pokopia route that connects starter choices, easy habitats, recipe timing, Pokemon pages, and planning tools.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/guides/beginner-route'),
  },
  robots: noIndexMetadata,
}

export default function BeginnerRoutePage() {
  const guides = bySlug(guidesData, guideSlugs)
  const pokemon = byId(pokemonData, pokemonIds)
  const habitats = byId(habitatsData, habitatIds)
  const recipes = byId(recipesData, recipeIds)

  return (
    <main className="page-shell topic-page">
      <ArticleJsonLd
        title="Pokopia Beginner Route"
        description="A beginner Pokopia route that connects starter choices, easy habitats, recipe timing, Pokemon pages, and planning tools into one practical path."
        url="/guides/beginner-route"
        publishedAt={updatedAt}
        modifiedAt={updatedAt}
        type="Guide"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Guides', url: '/guides' },
          { name: 'Beginner Route', url: '/guides/beginner-route' },
        ]}
      />
      <ItemListJsonLd
        name="Pokopia Beginner Route Resources"
        description="Starter guides, easy habitats, Pokemon picks, recipes, and tools for a beginner Pokopia route."
        url="/guides/beginner-route"
        items={[
          ...guides.map((guide) => ({ name: guide.title, url: `/guides/${guide.slug}` })),
          ...pokemon.map((item) => ({ name: item.name, url: `/wiki/pokemon/${item.id}` })),
          ...habitats.map((item) => ({ name: item.name, url: `/wiki/habitat/${item.id}` })),
          ...recipes.map((item) => ({ name: item.name, url: `/wiki/recipe/${item.id}` })),
        ]}
      />
      <FAQJsonLd title="Pokopia Beginner Route FAQ" faqs={beginnerFaqs} />

      <section className="topic-hero">
        <span className="panel-kicker">Beginner Topic Route</span>
        <h1>Pokopia Beginner Route</h1>
        <p>
          Start with a stable Pokemon role, learn easy habitats first, spend recipes only when the route has a job,
          then use the tools to decide when a harder route is worth the cost.
        </p>
        <div className="topic-hero-actions">
          <Link href="/tools/habitat-planner">Plan a habitat</Link>
          <Link href="/tools/recipe-calculator">Compare recipes</Link>
          <Link href="/tools/team-builder">Build a team</Link>
        </div>
      </section>

      <DataStatus
        status="Unverified editorial beginner route"
        note="This page organizes unverified Pokopia Portal planning data. It is not an official or confirmed game route, and its Pokémon, habitat, recipe, progression, and resource claims require independent verification."
        updatedAt={updatedAt}
        showPolicyLink
      />

      <OfficialContext
        title="Official Context Before Planning"
        description="Official sources explain the confirmed Pokopia premise, building loop, food-powered moves, and beginner systems. This route is editorial planning that links those concepts to site database pages."
        links={[
          { href: '/official/gameplay-overview', label: 'Gameplay overview' },
          { href: '/official/official-beginner-tips', label: 'Official beginner tips' },
        ]}
      />

      <section className="topic-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Route Logic</span>
            <h2>The First Four Decisions</h2>
          </div>
          <Link href="/guides">All guides</Link>
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
            <span className="panel-kicker">Starter Picks</span>
            <h2>Beginner Pokemon to Check First</h2>
          </div>
          <Link href="/wiki/pokemon">Pokemon database</Link>
        </div>
        <div className="topic-resource-grid">
          {pokemon.map((item) => (
            <Link key={item.id} href={`/wiki/pokemon/${item.id}`} className="related-content-card">
              <span>{item.rarity}</span>
              <strong>{item.name}</strong>
              <p>{item.type} · {item.specialty} · {item.favorite_food}</p>
              <small>{item.spawn_time} / {item.weather}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="topic-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Route Foundation</span>
            <h2>Habitats and Recipes That Teach the Basics</h2>
          </div>
          <Link href="/tools/spawn-tracker">Check spawns</Link>
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
                <span>{item.buff} · {item.best_use}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="topic-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Read Next</span>
            <h2>Guides That Support This Route</h2>
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
        <h2>Beginner Route FAQ</h2>
        <div>
          {beginnerFaqs.map((faq) => (
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
