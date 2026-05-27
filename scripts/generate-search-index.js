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
