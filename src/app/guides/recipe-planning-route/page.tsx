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
    title: 'Name the route problem first',
    text: 'Do not start by asking which recipe is strongest. Start by naming the problem: rare checks, boss damage, route speed, survival, or emergency recovery.',
    links: [
      { label: 'Recipe Calculator', href: '/tools/recipe-calculator' },
      { label: 'Complete Recipe List', href: '/guides/complete-recipe-list' },
      { label: 'All Recipes', href: '/wiki/recipe' },
    ],
  },
  {
    title: 'Use cheap support while scouting',
    text: 'Honey Cake, Grass Heal, Speed Potion, and Water Shield make sense before expensive recipes because they help test repeatability without spending legendary value.',
    links: [
      { label: 'Honey Cake', href: '/wiki/recipe/rec001' },
      { label: 'Grass Heal', href: '/wiki/recipe/rec009' },
      { label: 'Speed Potion', href: '/wiki/recipe/rec003' },
    ],
  },
  {
    title: 'Spend rare recipes on known windows',
    text: 'Fire Boost, Ice Armor, Steel Shell, and Dragon’s Fury are stronger when the dangerous room or boss window is already identified.',
    links: [
      { label: 'Fire Boost', href: '/wiki/recipe/rec002' },
      { label: 'Ice Armor', href: '/wiki/recipe/rec008' },
      { label: 'Steel Shell', href: '/wiki/recipe/rec012' },
    ],
  },
  {
    title: 'Reserve legendary recipes for repeatable payoffs',
    text: 'Lucky Charm, Ghost Veil, and Mega Restore should protect a high-value route, not a guess. Use them after the habitat, team, and target are already locked in.',
    links: [
      { label: 'Lucky Charm', href: '/wiki/recipe/rec005' },
      { label: 'Ghost Veil', href: '/wiki/recipe/rec010' },
      { label: 'Mega Restore', href: '/wiki/recipe/rec015' },
    ],
  },
]

const recipeFaqs = [
  {
    question: 'How do I choose the best recipe in Pokopia?',
    answer: 'Choose the recipe that solves the next route problem. Rare farming, boss damage, speed, survival, and emergency recovery each need different recipe support.',
  },
  {
    question: 'When should I save a rare or legendary recipe?',
    answer: 'Save rare or legendary recipes until the route is mapped, the target window is known, and the team can repeat the useful part of the route.',
  },
  {
    question: 'What is the biggest recipe planning mistake?',
    answer: 'The biggest mistake is using a strong recipe while scouting. Scout cheaply first, then spend the valuable recipe when the route has a clear payoff.',
  },
]

const guideSlugs = [
  'complete-recipe-list',
  'fast-farming-rare-pokemon',
  'speed-run-leveling-route',
  'best-defense-team-pokopia',
  'how-to-unlock-volcanic-cave',
]

const recipeIds = ['rec001', 'rec009', 'rec003', 'rec002', 'rec008', 'rec012', 'rec005', 'rec010', 'rec015']
const habitatIds = ['hab002', 'hab003', 'hab004', 'hab005', 'hab001', 'hab006', 'hab018']
const pokemonIds = ['pkm002', 'pkm004', 'pkm005', 'pkm008', 'pkm001', 'pkm007', 'pkm030']

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
  title: 'Pokopia Recipe Planning Route - Buff Timing, Habitats, and Tools',
  description: 'Plan Pokopia recipes by route objective, buff timing, rarity cost, habitat risk, Pokemon targets, and tool workflow.',
  openGraph: {
    title: 'Pokopia Recipe Planning Route - Buff Timing, Habitats, and Tools',
    description: 'Plan Pokopia recipes by route objective, buff timing, rarity cost, habitat risk, Pokemon targets, and tools.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokopia Recipe Planning Route - Buff Timing, Habitats, and Tools',
    description: 'Plan Pokopia recipes by route objective, buff timing, rarity cost, habitat risk, Pokemon targets, and tools.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/guides/recipe-planning-route'),
  },
  robots: noIndexMetadata,
}

export default function RecipePlanningRoutePage() {
  const guides = bySlug(guidesData, guideSlugs)
  const recipes = byId(recipesData, recipeIds)
  const habitats = byId(habitatsData, habitatIds)
  const pokemon = byId(pokemonData, pokemonIds)

  return (
    <main className="page-shell topic-page">
      <ArticleJsonLd
        title="Pokopia Recipe Planning Route"
        description="Plan Pokopia recipes by route objective, buff timing, rarity cost, habitat risk, Pokemon targets, and tool workflow."
        url="/guides/recipe-planning-route"
        publishedAt={updatedAt}
        modifiedAt={updatedAt}
        type="Guide"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Guides', url: '/guides' },
          { name: 'Recipe Planning Route', url: '/guides/recipe-planning-route' },
        ]}
      />
      <ItemListJsonLd
        name="Pokopia Recipe Planning Route Resources"
        description="Recipes, habitats, Pokemon targets, guides, and tools for planning Pokopia recipe use."
        url="/guides/recipe-planning-route"
        items={[
          ...guides.map((guide) => ({ name: guide.title, url: `/guides/${guide.slug}` })),
          ...recipes.map((item) => ({ name: item.name, url: `/wiki/recipe/${item.id}` })),
          ...habitats.map((item) => ({ name: item.name, url: `/wiki/habitat/${item.id}` })),
          ...pokemon.map((item) => ({ name: item.name, url: `/wiki/pokemon/${item.id}` })),
        ]}
      />
      <FAQJsonLd title="Pokopia Recipe Planning Route FAQ" faqs={recipeFaqs} />

      <section className="topic-hero">
        <span className="panel-kicker">Recipe Topic Route</span>
        <h1>Pokopia Recipe Planning Route</h1>
        <p>
          Recipes are route tools, not collectibles to spend on cooldown. Use this path to decide when a buff is worth
          crafting, when to save rare ingredients, and which tool should confirm the plan.
        </p>
        <div className="topic-hero-actions">
          <Link href="/tools/recipe-calculator">Compare recipes</Link>
          <Link href="/tools/habitat-planner">Check route risk</Link>
          <Link href="/tools/team-builder">Match the team</Link>
        </div>
      </section>

      <DataStatus
        status="Unverified editorial recipe planning route"
        note="This page organizes unverified Pokopia Portal planning data. It is not an official or confirmed recipe workflow, and its ingredient, buff, duration, rarity, habitat, and Pokémon claims require independent verification."
        updatedAt={updatedAt}
        showPolicyLink
      />

      <OfficialContext
        title="Official Food and Move Context"
        description="Official sources explain food-powered moves and beginner systems. This route adds editorial planning around recipe timing and resource spending."
        links={[
          { href: '/official/official-beginner-tips', label: 'Official beginner tips' },
          { href: '/official/gameplay-overview', label: 'Gameplay overview' },
        ]}
      />

      <section className="topic-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Recipe Logic</span>
            <h2>The Four Recipe Decisions</h2>
          </div>
          <Link href="/wiki/recipe">Recipe database</Link>
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
            <span className="panel-kicker">Recipe Shortlist</span>
            <h2>Recipes to Choose by Route Objective</h2>
          </div>
          <Link href="/tools/recipe-calculator">Use Recipe Calculator</Link>
        </div>
        <div className="topic-resource-grid">
          {recipes.map((item) => (
            <Link key={item.id} href={`/wiki/recipe/${item.id}`} className="related-content-card">
              <span>{item.rarity}</span>
              <strong>{item.name}</strong>
              <p>{item.buff}</p>
              <small>{item.best_use} · {item.effect_duration}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="topic-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Route Fit</span>
            <h2>Habitats and Pokemon That Change Recipe Value</h2>
          </div>
          <Link href="/tools/habitat-planner">Habitat Planner</Link>
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
            <h3>Pokemon</h3>
            {pokemon.map((item) => (
              <Link key={item.id} href={`/wiki/pokemon/${item.id}`}>
                <strong>{item.name}</strong>
                <span>{item.type} · {item.rarity} · {item.favorite_food}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="topic-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Read Next</span>
            <h2>Guides That Support Recipe Planning</h2>
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
        <h2>Recipe Planning Route FAQ</h2>
        <div>
          {recipeFaqs.map((faq) => (
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
