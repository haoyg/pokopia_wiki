const fs = require('fs')
const path = require('path')
const {
  isIndexableDatabaseEntry,
  isIndexableGuide,
} = require('./lib/indexing')

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
const redirectedNewsSlugs = new Set([
  'pokemon-pokopia-multiplayer-gameshare-details',
  'pokemon-pokopia-switch-2-online-local-gameshare',
])

const habitatById = new Map(habitats.map((item) => [item.id, item]))

const hubPages = [
  {
    id: 'official-hub',
    type: 'Official',
    title: 'Pokopia Official Info Hub',
    href: '/official',
    description: 'Source-backed hub for confirmed Pokopia release, gameplay, multiplayer, beginner tips, and official context pages.',
    meta: 'Official hub',
    status: 'Official source hub',
    updatedAt: '2026-05-28',
    priority: 96,
    keywords: 'official hub source roundup release gameplay multiplayer beginner tips confirmed information nintendo pokemon',
  },
  {
    id: 'news-hub',
    type: 'News',
    title: 'Pokopia News and Source Updates',
    href: '/news',
    description: 'Official source roundups, trailer notes, update tracking, and site transparency posts for Pokopia.',
    meta: 'News hub',
    status: 'Source update hub',
    updatedAt: '2026-05-28',
    priority: 88,
    keywords: 'news source updates official roundup trailer event tracker weekly updates transparency',
  },
  {
    id: 'guides-hub',
    type: 'Guide',
    title: 'Pokopia Guides Hub',
    href: '/guides',
    description: 'Source-backed route guides, official context, and planning tools separated from broader editorial guide drafts.',
    meta: 'Guide hub',
    status: 'Source-backed guide hub',
    updatedAt: '2026-07-11',
    priority: 88,
    keywords: 'guides source backed route official context planning tools thunder arena frost peak legendary locations',
  },
  {
    id: 'features-hub',
    type: 'Feature',
    title: 'Pokopia Features and Official Context',
    href: '/features',
    description: 'Source-aware features for cozy players, creative play, friendship requests, and confirmed system analysis.',
    meta: 'Feature hub',
    status: 'Source-aware feature hub',
    updatedAt: '2026-05-28',
    priority: 84,
    keywords: 'features official context animal crossing creative play friendship requests system analysis',
  },
  {
    id: 'pokemon-database-hub',
    type: 'Pokemon',
    title: 'Pokopia Pokemon Database',
    href: '/wiki/pokemon',
    description: 'Browse Pokopia Pokemon entries by type, rarity, habitat, favorite food, drops, specialty, and route role.',
    meta: 'Pokemon database hub',
    status: 'Reviewed database hub',
    updatedAt: '2026-07-16',
    priority: 82,
    keywords: 'pokemon database pokedex type rarity habitat favorite food drops specialty route role team builder',
  },
  {
    id: 'habitat-database-hub',
    type: 'Habitat',
    title: 'Pokopia Habitat Maps and Route Notes',
    href: '/wiki/habitat',
    description: 'Explore Pokopia habitats by unlock condition, weather, difficulty, resource bonus, spawn route, and route risk.',
    meta: 'Habitat database hub',
    status: 'Reviewed database hub',
    updatedAt: '2026-07-16',
    priority: 80,
    keywords: 'habitat map route notes unlock condition weather difficulty resource bonus spawn route habitat planner',
  },
  {
    id: 'recipe-database-hub',
    type: 'Recipe',
    title: 'Pokopia Recipe Cookbook and Buff Notes',
    href: '/wiki/recipe',
    description: 'Compare Pokopia recipes by ingredients, buff effect, duration, rarity, route timing, and best use.',
    meta: 'Recipe database hub',
    status: 'Reviewed database hub',
    updatedAt: '2026-07-16',
    priority: 78,
    keywords: 'recipe cookbook buff notes ingredients duration rarity route timing best use recipe calculator',
  },
  {
    id: 'pokemon-priority-index',
    type: 'Pokemon',
    title: 'Pokopia Pokemon Priority Index',
    href: '/tier-list',
    description: 'Use the editorial Pokemon priority index as a route planning aid based on rarity, specialty, and route role.',
    meta: 'Priority index',
    status: 'Reviewed database index',
    updatedAt: '2026-07-16',
    priority: 76,
    keywords: 'pokemon priority index tier list route planning rarity specialty role progression rare farming hard routes',
  },
]

const trustPages = [
  {
    id: 'editorial-policy',
    title: 'Editorial Policy',
    href: '/editorial-policy',
    description: 'How Pokopia Portal reviews source-backed pages, guide advice, future content, AI drafts, and corrections.',
    meta: 'Trust policy',
    status: 'Review process page',
    updatedAt: '2026-07-11',
    priority: 58,
    keywords: 'editorial policy review process noindex sitemap source backed guide advice ai drafts corrections low value content quality',
  },
  {
    id: 'source-policy',
    title: 'Source Policy',
    href: '/source-policy',
    description: 'How Pokopia Portal ranks official sources, third-party references, screenshots, submissions, and unsupported claims.',
    meta: 'Trust policy',
    status: 'Source standards page',
    updatedAt: '2026-07-11',
    priority: 58,
    keywords: 'source policy official sources primary source screenshots attribution submissions unsupported claims trust standards',
  },
  {
    id: 'corrections',
    title: 'Corrections',
    href: '/corrections',
    description: 'How to report outdated Pokopia Portal information, source issues, image attribution problems, and unclear guide advice.',
    meta: 'Trust policy',
    status: 'Correction process page',
    updatedAt: '2026-07-11',
    priority: 58,
    keywords: 'corrections report issue outdated information source issue image attribution guide advice copyright contact',
  },
]

const featurePages = [
  {
    id: 'creative-play-ideas',
    title: 'Pokopia Creative Play Ideas',
    href: '/features/creative-play-ideas',
    description: 'Safe Pokopia creative play ideas for building challenges, recipe workshops, habitat themes, and community-friendly routes without mod downloads.',
    meta: 'Creative play',
    status: 'Source-aware feature',
    updatedAt: '2026-05-28',
    priority: 84,
    keywords: 'creative play ideas mod alternatives building challenge habitat theme recipe workshop community challenge no downloads safe gameplay',
  },
  {
    id: 'friendship-requests-tracker',
    title: 'Pokopia Friendship and Requests Tracker',
    href: '/features/friendship-requests-tracker',
    description: 'A source-aware tracker for Pokopia befriended Pokemon, requests, visits, and unconfirmed NPC relationship mechanics.',
    meta: 'System tracker',
    status: 'Source-aware tracker',
    updatedAt: '2026-07-11',
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
    updatedAt: '2026-07-11',
    priority: 88,
    keywords: 'weekly event tracker confirmed updates official source roundup active events archived events daily challenges early purchase bonus rewards schedule',
  },
  {
    id: 'pokopia-animal-crossing',
    title: 'Pokopia vs Animal Crossing: Cozy Life Sim Comparison',
    href: '/features/pokopia-animal-crossing',
    description: 'A source-aware comparison for cozy game players, separating confirmed Pokopia systems from broader life-sim expectations.',
    meta: 'Source-aware comparison',
    status: 'Source-aware feature',
    updatedAt: '2026-07-11',
    priority: 86,
    keywords: 'pokopia animal crossing comparison cozy life sim building decorating pokemon habitats recipes creative world rebuilding',
  },
  {
    id: 'meta-analysis',
    title: 'Pokémon Pokopia Confirmed Systems Analysis',
    href: '/features/meta-analysis',
    description: 'Editorial analysis of officially confirmed Pokémon Pokopia systems, including Ditto, moves, crafting, food, multiplayer, and beginner routines.',
    meta: 'Official context',
    status: 'Source-aware feature',
    updatedAt: '2026-07-11',
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
  ...hubPages.map((item) => ({
    id: item.id,
    type: item.type,
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
  ...trustPages.map((item) => ({
    id: item.id,
    type: 'Trust',
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
  ...tools.map((item) => ({
    id: item.id,
    type: 'Tool',
    title: item.title,
    href: item.href,
    description: item.description,
    meta: item.meta,
    status: 'Interactive planning tool',
    source: null,
    updatedAt: '2026-07-11',
    priority: item.priority,
    keywords: [
      item.title,
      item.description,
      item.meta,
      item.keywords,
    ].join(' '),
  })),
  ...news.filter((item) => !redirectedNewsSlugs.has(item.slug)).map((item) => ({
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
  ...guides.filter(isIndexableGuide).map((item) => ({
    id: item.id,
    type: 'Guide',
    title: item.title,
    href: `/guides/${item.slug}`,
    description: text(item.answer || item.content),
    meta: item.category,
    status: item.data_status === 'Source-backed guide' ? 'Source-backed guide' : 'Reviewed guide',
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
  ...pokemon.filter(isIndexableDatabaseEntry).map((item) => ({
    id: item.id,
    type: 'Pokemon',
    title: item.name,
    href: `/wiki/pokemon/${item.id}`,
    description: text(item.overview || item.description),
    meta: `${item.type} / ${item.rarity}`,
    status: item.data_status === 'Source-backed database entry' ? 'Source-backed database entry' : 'Reviewed database entry',
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
  ...habitats.filter(isIndexableDatabaseEntry).map((item) => ({
    id: item.id,
    type: 'Habitat',
    title: item.name,
    href: `/wiki/habitat/${item.id}`,
    description: text(item.overview || `${item.unlock_condition}. ${item.resource_bonus}`),
    meta: `${item.weather} / ${item.difficulty}`,
    status: item.data_status === 'Source-backed database entry' ? 'Source-backed database entry' : 'Reviewed habitat guide',
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
  ...recipes.filter(isIndexableDatabaseEntry).map((item) => ({
    id: item.id,
    type: 'Recipe',
    title: item.name,
    href: `/wiki/recipe/${item.id}`,
    description: text(item.overview || item.buff),
    meta: `${item.rarity} / ${item.effect_duration}`,
    status: item.data_status === 'Source-backed database entry' ? 'Source-backed database entry' : 'Reviewed recipe reference',
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
