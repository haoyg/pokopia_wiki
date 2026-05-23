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

const guides = readJson('src/data/guides.json')
const habitats = readJson('src/data/habitats.json')
const news = readJson('src/data/news.json')
const pokemon = readJson('src/data/pokemon.json')
const recipes = readJson('src/data/recipes.json')
const official = readJson('src/data/official.json')

const habitatById = new Map(habitats.map((item) => [item.id, item]))

const index = [
  ...news.map((item) => ({
    id: item.id,
    type: 'News',
    title: item.title,
    href: `/news/${item.slug}`,
    description: text(item.excerpt),
    meta: item.category,
    keywords: [item.title, item.category, item.excerpt].join(' '),
  })),
  ...guides.map((item) => ({
    id: item.id,
    type: 'Guide',
    title: item.title,
    href: `/guides/${item.slug}`,
    description: text(item.answer || item.content),
    meta: item.category,
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
