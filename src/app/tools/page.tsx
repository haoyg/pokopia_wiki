import { Metadata } from 'next'
import { canonicalUrl } from '@/lib/site'
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Pokopia Tools and Route Planners',
  description: 'Use Pokopia planning tools for recipes, habitats, teams, spawn checks, Pokemon pages, and guide routes.',
  keywords: [
    'Pokopia tools',
    'Pokopia route planner',
    'Pokopia planning tools',
    'Pokopia calculator',
    'Pokopia tracker',
    'Pokopia builder',
    'Pokopia game tools',
  ],
  openGraph: {
    title: 'Pokopia Tools and Route Planners',
    description: 'Use Pokopia planning tools for recipes, habitats, teams, spawn checks, Pokemon pages, and guide routes.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: canonicalUrl('/tools'),
  },
}

const primaryTools = [
  {
    href: '/tools/habitat-planner',
    label: 'Habitat Planner',
    status: 'Route planner',
    summary: 'Choose a goal, level, difficulty, and weather window, then get habitat routes with recipe, Pokemon, and guide links.',
    outputs: ['Route match', 'Recommended recipe', 'Pokemon spawns', 'Related guides'],
    connects: ['Habitats', 'Recipes', 'Pokemon', 'Guides'],
  },
  {
    href: '/tools/recipe-calculator',
    label: 'Recipe Calculator',
    status: 'Recipe planner',
    summary: 'Compare recipes by route goal, rarity, timing, and ingredient value before spending rare materials.',
    outputs: ['Goal match', 'Use timing', 'Common mistakes', 'Planning links'],
    connects: ['Recipes', 'Pokemon', 'Habitats'],
  },
  {
    href: '/tools/team-builder',
    label: 'Team Builder',
    status: 'Team planner',
    summary: 'Build a four-role team draft for progression, bosses, rare farming, daily routes, or speed routing.',
    outputs: ['Lead role', 'Damage role', 'Support role', 'Survival role'],
    connects: ['Pokemon', 'Recipes', 'Habitats', 'Guides'],
  },
]

const supportTools = [
  {
    href: '/tools/spawn-tracker',
    label: 'Spawn Tracker',
    status: 'Basic tracker',
    summary: 'Filter Pokemon spawn records by habitat, weather, time, rarity, and type while checking database pages.',
    connects: ['Pokemon', 'Habitats'],
  },
]

export default function ToolsPage() {
  const allTools = [...primaryTools, ...supportTools]

  return (
    <main className="page-shell tools-hub">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
        ]}
      />
      <ItemListJsonLd
        name="Pokopia Tools"
        description="Planning tools for recipes, habitats, teams, spawn checks, Pokemon pages, and guide routes."
        url="/tools"
        items={allTools.map((tool) => ({
          name: tool.label,
          url: tool.href,
        }))}
      />
      <section className="tools-hub-hero">
        <div>
          <span className="tools-hub-kicker">Planning Tools</span>
          <h1>Pokopia Tools</h1>
          <p>
            Pick a route goal, compare the supporting data, then move into the exact Recipe,
            Habitat, Pokemon, and Guide pages that make the plan usable.
          </p>
        </div>
        <div className="tools-hub-panel" aria-label="Tools summary">
          <strong>Core planning loop</strong>
          <ol>
            <li>Choose the route or team goal.</li>
            <li>Compare recommendations and risks.</li>
            <li>Open the linked detail pages before spending resources.</li>
          </ol>
        </div>
      </section>

      <section className="tools-hub-section">
        <div className="tools-section-heading">
          <span>Core Tools</span>
          <h2>Interactive Planners</h2>
        </div>

        <div className="tools-feature-grid">
          {primaryTools.map((tool) => (
            <a key={tool.href} href={tool.href} className="tool-feature-card">
              <div className="tool-feature-topline">
                <span>{tool.status}</span>
                <strong>{tool.label}</strong>
              </div>
              <p>{tool.summary}</p>
              <div className="tool-chip-row" aria-label={`${tool.label} outputs`}>
                {tool.outputs.map((output) => (
                  <span key={output}>{output}</span>
                ))}
              </div>
              <div className="tool-connects">
                <small>Connects</small>
                <div>
                  {tool.connects.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="tools-hub-section tools-support-section">
        <div className="tools-section-heading">
          <span>Support Tool</span>
          <h2>Lookup and Tracking</h2>
        </div>

        <div className="tools-support-grid">
          {supportTools.map((tool) => (
            <a key={tool.href} href={tool.href} className="tool-support-card">
              <div>
                <span>{tool.status}</span>
                <h3>{tool.label}</h3>
                <p>{tool.summary}</p>
              </div>
              <div className="tool-chip-row">
                {tool.connects.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="tools-hub-section tools-workflow">
        <div className="tools-section-heading">
          <span>Workflow</span>
          <h2>Best Starting Points</h2>
        </div>
        <div className="tools-workflow-grid">
          <div>
            <strong>Planning a new area</strong>
            <p>Start with Habitat Planner, then open the recommended recipe and spawn pages.</p>
          </div>
          <div>
            <strong>Preparing a hard fight</strong>
            <p>Start with Team Builder, confirm the route habitat, then choose the recipe window.</p>
          </div>
          <div>
            <strong>Farming rare targets</strong>
            <p>Start with Recipe Calculator, then verify the habitat and Pokemon spawn conditions.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
