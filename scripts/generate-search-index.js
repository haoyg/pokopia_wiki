const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, ''))
}

function writeJson(file, data) {
  fs.writeFileSync(path.join(root, file), `${JSON.stringify(data, null, 2)}\n`)
}

function csv(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function text(value, maxLength = 180) {
  const normalized = String(value || '').replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength - 1).trim()}…`
}

function dateOnly(value) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString().slice(0, 10)
}

function unixDate(value) {
  if (!value) return null
  const date = new Date(value * 1000)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString().slice(0, 10)
}

const guides = readJson('src/data/guides.json')
const habitats = readJson('src/data/habitats.json')
const news = readJson('src/data/news.json')
const pokemon = readJson('src/data/pokemon.json')
const recipes = readJson('src/data/recipes.json')
const official = readJson('src/data/official.json')

const habitatById = new Map(habitats.map((item) => [item.id, item]))

const topicPages = [
  {
    id: 'beginner-route',
    title: 'Pokopia Beginner Route',
    href: '/guides/beginner-route',
    description: 'A beginner route that connects starter choices, easy habitats, recipe timing, Pokemon pages, and planning tools.',
    meta: 'Beginner topic route',
    status: 'Editorial topic guide',
    updatedAt: '2026-05-27',
    priority: 90,
    keywords: 'beginner route starter pokemon easy habitat recipe timing tools first path forest valley crystal lake training grounds',
  },
  {
    id: 'rare-farming-route',
    title: 'Pokopia Rare Farming Route',
    href: '/guides/rare-farming-route',
    description: 'A rare farming route that connects Lucky Charm timing, rare Pokemon targets, high-value habitats, recipes, and tools.',
    meta: 'Rare farming topic route',
    status: 'Editorial topic guide',
    updatedAt: '2026-05-27',
    priority: 90,
    keywords: 'rare farming route lucky charm legendary pokemon shadow marsh frost peak volcanic cave spawn tracker recipe calculator habitat planner',
  },
  {
    id: 'recipe-planning-route',
    title: 'Pokopia Recipe Planning Route',
    href: '/guides/recipe-planning-route',
    description: 'A recipe planning route that connects buff timing, rarity cost, habitat risk, Pokemon targets, and tools.',
    meta: 'Recipe topic route',
    status: 'Editorial topic guide',
    updatedAt: '2026-05-27',
    priority: 88,
    keywords: 'recipe planning route buff timing rarity ingredients habitat risk pokemon targets recipe calculator honey cake lucky charm fire boost grass heal',
  },
]

const featurePages = [
  {
    id: 'creative-play-ideas',
    title: 'Pokopia Creative Play Ideas',
    href: '/features/creative-play-ideas',
    description: 'Safe Pokopia creative play ideas for building challenges, recipe workshops, habitat themes, and community-friendly routes without mod downloads.',
    meta: 'Creative play',
    status: 'Editorial feature',
    updatedAt: '2026-05-28',
    priority: 84,
    keywords: 'creative play ideas mod alternatives building challenge habitat theme recipe workshop community challenge no downloads safe gameplay',
  },
  {
    id: 'community-showcase',
    title: 'Pokopia Community Showcase Index',
    href: '/community/showcase',
    description: 'Future Pokopia community showcase index with submission standards for verified screenshots, home designs, route notes, and player-tested reports.',
    meta: 'Community index',
    status: 'Future showcase standard',
    updatedAt: '2026-05-27',
    priority: 82,
    keywords: 'community showcase index player screenshots home design route notes verified submissions source credit permission community content aggregation',
  },
  {
    id: 'friendship-requests-tracker',
    title: 'Pokopia Friendship and Requests Tracker',
    href: '/features/friendship-requests-tracker',
    description: 'A source-aware tracker for Pokopia befriended Pokemon, requests, visits, and unconfirmed NPC relationship mechanics.',
    meta: 'System tracker',
    status: 'Source-aware tracker',
    updatedAt: '2026-05-27',
    priority: 86,
    keywords: 'friendship requests tracker befriended pokemon npc relationship visits daily challenges pc requests social systems official tips',
  },
  {
    id: 'weekly-event-tracker',
    title: 'Pokopia Weekly Event Tracker',
    href: '/news/weekly-event-tracker',
    description: 'A source-aware Pokopia weekly event tracker that separates confirmed official updates, topics to recheck, and archived event information.',
    meta: 'Event tracker',
    status: 'Source-aware tracker',
    updatedAt: '2026-05-27',
    priority: 88,
    keywords: 'weekly event tracker confirmed updates official source roundup active events archived events daily challenges early purchase bonus rewards schedule',
  },
  {
    id: 'home-design-ideas',
    title: 'Pokopia Home Design Ideas and Building Showcase',
    href: '/builds/home-design-ideas',
    description: 'Text-based Pokopia home design ideas for cozy bases, recipe workshops, visitor courtyards, and future community showcases.',
    meta: 'Building showcase',
    status: 'Editorial feature',
    updatedAt: '2026-05-27',
    priority: 84,
    keywords: 'home design ideas building showcase cozy base recipe workshop visitor courtyard habitat research camp decoration layout screenshots community',
  },
  {
    id: 'pokopia-animal-crossing',
    title: 'Pokopia vs Animal Crossing: Cozy Life Sim Comparison',
    href: '/features/pokopia-animal-crossing',
    description: 'A source-aware comparison for cozy game players, separating confirmed Pokopia systems from broader life-sim expectations.',
    meta: 'Editorial comparison',
    status: 'Editorial feature',
    updatedAt: '2026-05-27',
    priority: 86,
    keywords: 'pokopia animal crossing comparison cozy life sim building decorating pokemon habitats recipes creative world rebuilding',
  },
  {
    id: 'meta-analysis',
    title: 'Pokémon Pokopia Confirmed Systems Analysis',
    href: '/features/meta-analysis',
    description: 'Editorial analysis of officially confirmed Pokémon Pokopia systems, including Ditto, moves, crafting, food, multiplayer, and beginner routines.',
    meta: 'Official context',
    status: 'Editorial feature',
    updatedAt: '2026-05-23',
    priority: 84,
    keywords: 'confirmed systems analysis ditto moves crafting food multiplayer beginner routines official context',
  },
]

const tools = [
  {
    id: 'tools',
    title: 'Pokopia Tools and Route Planners',
    href: '/tools',
    description: 'Planning hub for Pokopia recipe comparison, habitat routes, team drafts, and spawn tracking.',
    meta: 'Planning hub',
    keywords: 'tools planner route recipes habitats teams spawns calculator tracker builder',
    priority: 82,
  },
  {
    id: 'recipe-calculator',
    title: 'Pokopia Recipe Calculator',
    href: '/tools/recipe-calculator',
    description: 'Compare recipes by route goal, rarity, buff timing, common mistakes, related Pokemon, and habitat support.',
    meta: 'Recipe planner',
    keywords: 'recipe calculator recipes buffs timing ingredients rare farming boss survival daily habitat pokemon',
    priority: 88,
  },
  {
    id: 'habitat-planner',
    title: 'Pokopia Habitat Planner',
    href: '/tools/habitat-planner',
    description: 'Plan habitat routes by goal, player level, difficulty, weather, recipe support, Pokemon spawns, and guide links.',
    meta: 'Habitat route planner',
    keywords: 'habitat planner route unlock level difficulty weather spawns recipe pokemon guide farming',
    priority: 88,
  },
  {
    id: 'team-builder',
    title: 'Pokopia Team Builder',
    href: '/tools/team-builder',
    description: 'Build team drafts by goal, role, type coverage, recipe support, habitat routes, Pokemon links, and related guides.',
    meta: 'Team planner',
    keywords: 'team builder pokemon roles type coverage recipe habitat guide boss rare farming speed route',
    priority: 86,
  },
  {
    id: 'spawn-tracker',
    title: 'Pokopia Spawn Tracker',
    href: '/tools/spawn-tracker',
    description: 'Track Pokemon spawn conditions by habitat, weather, time, rarity, food, drops, type, and related route pages.',
    meta: 'Spawn lookup tool',
    keywords: 'spawn tracker pokemon habitat weather time rarity food drops type search farming route',
    priority: 84,
  },
]

const index = [
  ...featurePages.map((item) => ({
    id: item.id,
    type: 'Feature',
    title: item.title,
    href: item.href,
    description: item.description,
    meta: item.meta,
    status: item.status,
    source: null,
    updatedAt: item.updatedAt,
    priority: item.priority,
    keywords: [
      item.title,
      item.description,
      item.meta,
      item.keywords,
    ].join(' '),
  })),
  ...topicPages.map((item) => ({
    id: item.id,
    type: 'Guide',
    title: item.title,
    href: item.href,
    description: item.description,
    meta: item.meta,
    status: item.status,
    source: null,
    updatedAt: item.updatedAt,
    priority: item.priority,
    keywords: [
      item.title,
      item.description,
      item.meta,
      item.keywords,
    ].join(' '),
  })),
  ...tools.map((item) => ({
    id: item.id,
    type: 'Tool',
    title: item.title,
    href: item.href,
    description: item.description,
    meta: item.meta,
    status: 'Interactive planning tool',
    source: null,
    updatedAt: '2026-05-27',
    priority: item.priority,
    keywords: [
      item.title,
      item.description,
      item.meta,
      item.keywords,
    ].join(' '),
  })),
  ...news.map((item) => ({
    id: item.id,
    type: 'News',
    title: item.title,
    href: `/news/${item.slug}`,
    description: text(item.excerpt),
    meta: item.verified_status || item.category,
    status: item.verified_status || 'Source update',
    source: item.source_label || null,
    updatedAt: unixDate(item.published_at),
    priority: 95,
    keywords: [
      item.title,
      item.category,
      item.excerpt,
      item.verified_status,
      item.source_label,
      item.source_type,
    ].join(' '),
  })),
  ...guides.map((item) => ({
    id: item.id,
    type: 'Guide',
    title: item.title,
    href: `/guides/${item.slug}`,
    description: text(item.answer || item.content),
    meta: item.category,
    status: item.data_status || 'Editorial guide',
    source: item.image_source || null,
    updatedAt: dateOnly(item.updated_at || item.published_at),
    priority: 85,
    keywords: [
      item.title,
      item.category,
      item.seo_keyword,
      csv(item.related_pokemon).join(' '),
      csv(item.related_habitats).join(' '),
      csv(item.related_items).join(' '),
    ].join(' '),
  })),
  ...official.map((item) => ({
    id: item.id,
    type: 'Official',
    title: item.title,
    href: `/official/${item.slug}`,
    description: text(item.summary),
    meta: item.category,
    status: 'Official source roundup',
    source: item.sources?.[0]?.label || null,
    updatedAt: dateOnly(item.updated_at),
    priority: 100,
    keywords: [
      item.title,
      item.category,
      item.summary,
      item.facts,
      item.analysis,
      item.sources?.map((source) => source.label).join(' '),
    ].join(' '),
  })),
  ...pokemon.map((item) => ({
    id: item.id,
    type: 'Pokemon',
    title: item.name,
    href: `/wiki/pokemon/${item.id}`,
    description: text(item.overview || item.description),
    meta: `${item.type} / ${item.rarity}`,
    status: item.data_status || 'Editorial database entry',
    source: item.image_source || null,
    updatedAt: dateOnly(item.updated_at),
    priority: 75,
    keywords: [
      item.name,
      item.type,
      item.rarity,
      item.specialty,
      item.favorite_food,
      item.spawn_time,
      item.weather,
      item.habitat,
      habitatById.get(item.habitat)?.name,
      item.drops,
      item.skills,
    ].join(' '),
  })),
  ...habitats.map((item) => ({
    id: item.id,
    type: 'Habitat',
    title: item.name,
    href: `/wiki/habitat/${item.id}`,
    description: text(item.overview || `${item.unlock_condition}. ${item.resource_bonus}`),
    meta: `${item.weather} / ${item.difficulty}`,
    status: item.data_status || 'Editorial habitat reference',
    source: item.image_source || null,
    updatedAt: dateOnly(item.updated_at),
    priority: 70,
    keywords: [
      item.name,
      item.unlock_condition,
      item.recommended_build,
      item.weather,
      item.difficulty,
      item.resource_bonus,
      item.spawn_list,
      item.recommended_recipe,
    ].join(' '),
  })),
  ...recipes.map((item) => ({
    id: item.id,
    type: 'Recipe',
    title: item.name,
    href: `/wiki/recipe/${item.id}`,
    description: text(item.overview || item.buff),
    meta: `${item.rarity} / ${item.effect_duration}`,
    status: item.data_status || 'Editorial recipe reference',
    source: item.image_source || null,
    updatedAt: dateOnly(item.updated_at),
    priority: 65,
    keywords: [
      item.name,
      item.ingredients,
      item.buff,
      item.effect_duration,
      item.rarity,
      item.best_use,
      item.related_pokemon,
      item.related_habitats,
    ].join(' '),
  })),
]

writeJson('src/data/search-index.json', index)
writeJson('public/data/search-index.json', index)

console.log(`Generated ${index.length} search index entries.`)
