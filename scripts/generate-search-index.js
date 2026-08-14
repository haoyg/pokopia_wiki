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
  const filePath = path.join(root, file)
  const nextContent = `${JSON.stringify(data, null, 2)}\n`
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf8') === nextContent) return
  fs.writeFileSync(filePath, nextContent)
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
  return `${normalized.slice(0, maxLength - 3).trim()}...`
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

function entry({
  id,
  type,
  title,
  href,
  description,
  meta,
  status,
  source = null,
  updatedAt = '2026-08-04',
  priority = 50,
  keywords = '',
}) {
  return {
    id,
    type,
    title,
    href,
    description: text(description, 220),
    meta,
    status,
    source,
    updatedAt,
    priority,
    keywords: [title, description, meta, status, keywords].filter(Boolean).join(' '),
  }
}

const guides = readJson('src/data/guides.json')
const habitats = readJson('src/data/habitats.json')
const news = readJson('src/data/news.json')
const pokemon = readJson('src/data/pokemon.json')
const recipes = readJson('src/data/recipes.json')
const official = readJson('src/data/official.json')

const habitatById = new Map(habitats.map((item) => [item.id, item]))
const redirectedNewsSlugs = new Set([
  'pokemon-pokopia-multiplayer-gameshare-details',
  'pokemon-pokopia-switch-2-online-local-gameshare',
])

const staticEntries = [
  entry({
    id: 'official-hub',
    type: 'Official',
    title: 'Pokopia Official Info Hub',
    href: '/official',
    description: 'Confirmed Pokopia release, gameplay, multiplayer, beginner tips, and official source context pages.',
    meta: 'Official hub',
    status: 'Official source hub',
    priority: 96,
    keywords: 'release gameplay multiplayer beginner tips source roundup',
  }),
  entry({
    id: 'news-hub',
    type: 'News',
    title: 'Pokopia News and Source Updates',
    href: '/news',
    description: 'Official source roundups, trailer notes, update tracking, and site transparency posts for Pokopia.',
    meta: 'News hub',
    status: 'Source update hub',
    priority: 88,
    keywords: 'news source updates event tracker',
  }),
  entry({
    id: 'guides-hub',
    type: 'Guide',
    title: 'Pokopia Guides Hub',
    href: '/guides',
    description: 'Published Pokopia route guides, official context, walkthroughs, and planning links.',
    meta: 'Guide hub',
    status: 'Source-backed guide hub',
    priority: 88,
    keywords: 'guides routes walkthroughs source backed editorial guide',
  }),
  entry({
    id: 'features-hub',
    type: 'Feature',
    title: 'Pokopia Features and Official Context',
    href: '/features',
    description: 'Source-aware features for cozy players, creative play, friendship requests, and system analysis.',
    meta: 'Feature hub',
    status: 'Source-aware feature hub',
    priority: 84,
    keywords: 'features animal crossing creative play friendship requests',
  }),
  entry({
    id: 'pokemon-database-hub',
    type: 'Pokemon',
    title: 'Pokopia Pokemon Database',
    href: '/wiki/pokemon',
    description: 'Browse Pokopia Pokemon entries by type, rarity, habitat, favorite food, drops, specialty, and route role.',
    meta: 'Pokemon database hub',
    status: 'Reviewed database hub',
    priority: 82,
  }),
  entry({
    id: 'habitat-database-hub',
    type: 'Habitat',
    title: 'Pokopia Habitat Maps and Route Notes',
    href: '/wiki/habitat',
    description: 'Explore Pokopia habitats by unlock condition, weather, difficulty, resource bonus, spawn route, and route risk.',
    meta: 'Habitat database hub',
    status: 'Reviewed database hub',
    priority: 80,
  }),
  entry({
    id: 'recipe-database-hub',
    type: 'Recipe',
    title: 'Pokopia Recipe Cookbook and Buff Notes',
    href: '/wiki/recipe',
    description: 'Compare Pokopia recipes by ingredients, buff effect, duration, rarity, route timing, and best use.',
    meta: 'Recipe database hub',
    status: 'Reviewed database hub',
    priority: 78,
  }),
  entry({
    id: 'tools',
    type: 'Tool',
    title: 'Pokopia Tools and Route Planners',
    href: '/tools',
    description: 'Planning hub for Pokopia recipe comparison, habitat routes, team drafts, and spawn tracking.',
    meta: 'Planning hub',
    status: 'Interactive planning tool',
    priority: 82,
  }),
  ...[
    ['recipe-calculator', 'Pokopia Recipe Calculator', '/tools/recipe-calculator', 'Compare recipes by route goal, rarity, buff timing, common mistakes, related Pokemon, and habitat support.'],
    ['habitat-planner', 'Pokopia Habitat Planner', '/tools/habitat-planner', 'Plan habitat routes by goal, player level, difficulty, weather, recipe support, Pokemon spawns, and guide links.'],
    ['team-builder', 'Pokopia Team Builder', '/tools/team-builder', 'Build team drafts by goal, role, type coverage, recipe support, habitat routes, Pokemon links, and related guides.'],
    ['spawn-tracker', 'Pokopia Spawn Tracker', '/tools/spawn-tracker', 'Track Pokemon spawn conditions by habitat, weather, time, rarity, food, drops, type, and related route pages.'],
  ].map(([id, title, href, description]) => entry({
    id,
    type: 'Tool',
    title,
    href,
    description,
    meta: 'Planning tool',
    status: 'Interactive planning tool',
    priority: 86,
  })),
  ...[
    ['creative-play-ideas', 'Pokopia Creative Play Ideas', '/features/creative-play-ideas', 'Safe Pokopia creative play ideas for building challenges, recipe workshops, habitat themes, and community-friendly routes.'],
    ['friendship-requests-tracker', 'Pokopia Friendship and Requests Tracker', '/features/friendship-requests-tracker', 'A source-aware tracker for Pokopia befriended Pokemon, requests, visits, and relationship mechanics.'],
    ['weekly-event-tracker', 'Pokopia Weekly Event Tracker', '/news/weekly-event-tracker', 'A source-aware Pokopia weekly event tracker that separates confirmed official updates, topics to recheck, and archived information.'],
    ['pokopia-animal-crossing', 'Pokopia vs Animal Crossing', '/features/pokopia-animal-crossing', 'A source-aware comparison for cozy game players, separating confirmed Pokopia systems from broader life-sim expectations.'],
    ['meta-analysis', 'Pokemon Pokopia Confirmed Systems Analysis', '/features/meta-analysis', 'Editorial analysis of officially confirmed Pokemon Pokopia systems, including Ditto, moves, crafting, food, multiplayer, and beginner routines.'],
  ].map(([id, title, href, description]) => entry({
    id,
    type: 'Feature',
    title,
    href,
    description,
    meta: 'Source-aware feature',
    status: 'Source-aware feature',
    priority: 84,
  })),
  ...[
    ['editorial-policy', 'Editorial Policy', '/editorial-policy', 'How Pokopia Portal reviews source-backed pages, guide advice, AI drafts, and corrections.'],
    ['source-policy', 'Source Policy', '/source-policy', 'How Pokopia Portal ranks official sources, third-party references, screenshots, submissions, and unsupported claims.'],
    ['corrections', 'Corrections', '/corrections', 'How to report outdated Pokopia Portal information, source issues, image attribution problems, and unclear guide advice.'],
  ].map(([id, title, href, description]) => entry({
    id,
    type: 'Trust',
    title,
    href,
    description,
    meta: 'Trust policy',
    status: 'Review process page',
    priority: 58,
  })),
]

const index = [
  ...staticEntries,
  ...news.filter((item) => !redirectedNewsSlugs.has(item.slug)).map((item) => entry({
    id: item.id,
    type: 'News',
    title: item.title,
    href: `/news/${item.slug}`,
    description: item.excerpt,
    meta: item.verified_status || item.category,
    status: item.verified_status || 'Source update',
    source: item.source_label || null,
    updatedAt: unixDate(item.published_at),
    priority: 95,
    keywords: [item.category, item.source_label, item.source_type].join(' '),
  })),
  ...guides.filter(isIndexableGuide).map((item) => entry({
    id: item.id,
    type: 'Guide',
    title: item.title,
    href: `/guides/${item.slug}`,
    description: item.answer || item.content,
    meta: item.category,
    status: item.data_status === 'Source-backed guide' ? 'Source-backed guide' : 'Reviewed guide',
    source: item.image_source || null,
    updatedAt: dateOnly(item.updated_at || item.published_at),
    priority: 85,
    keywords: [
      item.seo_keyword,
      csv(item.related_pokemon).join(' '),
      csv(item.related_habitats).join(' '),
      csv(item.related_items).join(' '),
    ].join(' '),
  })),
  ...official.map((item) => entry({
    id: item.id,
    type: 'Official',
    title: item.title,
    href: `/official/${item.slug}`,
    description: item.summary,
    meta: item.category,
    status: 'Official source roundup',
    source: item.sources?.[0]?.label || null,
    updatedAt: dateOnly(item.updated_at),
    priority: 100,
    keywords: [item.facts, item.analysis, item.sources?.map((source) => source.label).join(' ')].join(' '),
  })),
  ...pokemon.filter(isIndexableDatabaseEntry).map((item) => entry({
    id: item.id,
    type: 'Pokemon',
    title: item.name,
    href: `/wiki/pokemon/${item.id}`,
    description: item.overview || item.description,
    meta: `${item.type} / ${item.rarity}`,
    status: item.data_status || 'Reviewed database entry',
    source: item.image_source || null,
    updatedAt: dateOnly(item.updated_at),
    priority: 75,
    keywords: [
      item.type,
      item.rarity,
      item.specialty,
      item.favorite_food,
      item.spawn_time,
      item.weather,
      habitatById.get(item.habitat)?.name,
      item.drops,
      item.skills,
    ].join(' '),
  })),
  ...habitats.filter(isIndexableDatabaseEntry).map((item) => entry({
    id: item.id,
    type: 'Habitat',
    title: item.name,
    href: `/wiki/habitat/${item.id}`,
    description: item.overview || `${item.unlock_condition}. ${item.resource_bonus}`,
    meta: `${item.weather} / ${item.difficulty}`,
    status: item.data_status || 'Reviewed habitat guide',
    source: item.image_source || null,
    updatedAt: dateOnly(item.updated_at),
    priority: 70,
    keywords: [item.unlock_condition, item.recommended_build, item.resource_bonus, item.spawn_list].join(' '),
  })),
  ...recipes.filter(isIndexableDatabaseEntry).map((item) => entry({
    id: item.id,
    type: 'Recipe',
    title: item.name,
    href: `/wiki/recipe/${item.id}`,
    description: item.overview || item.buff,
    meta: `${item.rarity} / ${item.effect_duration}`,
    status: item.data_status || 'Reviewed recipe reference',
    source: item.image_source || null,
    updatedAt: dateOnly(item.updated_at),
    priority: 65,
    keywords: [item.ingredients, item.buff, item.best_use, item.related_pokemon, item.related_habitats].join(' '),
  })),
]

writeJson('src/data/search-index.json', index)
writeJson('public/data/search-index.json', index)

console.log(`Generated ${index.length} search index entries.`)
