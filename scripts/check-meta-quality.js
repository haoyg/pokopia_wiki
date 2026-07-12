const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const issues = []

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, ''))
}

function cleanTitle(title, maxLength = 40) {
  const normalized = String(title || '')
    .replace(/\s+\|\s+Pokopia Portal$/i, '')
    .replace(/\bUltimate\b/gi, 'Complete')
    .replace(/\bDefinitive\b/gi, 'Source-Aware')
    .replace(/\bMeta Rankings?\b/gi, 'Priority Index')
    .replace(/\s+/g, ' ')
    .trim()

  if (normalized.length <= maxLength) return normalized
  const candidate = normalized.slice(0, maxLength + 1)
  const lastSpace = candidate.lastIndexOf(' ')
  const boundary = lastSpace >= Math.floor(maxLength * 0.65) ? lastSpace : maxLength
  return candidate.slice(0, boundary).replace(/[,:;|\-]+$/g, '').trim()
}

function cleanDescription(description, maxLength = 155) {
  const normalized = String(description || '')
    .replace(/\byour ultimate\b/gi, 'an independent')
    .replace(/\bultimate\b/gi, 'complete')
    .replace(/\bcomprehensive\b/gi, 'structured')
    .replace(/\bdefinitive\b/gi, 'source-aware')
    .replace(/\bbest builds?\b/gi, 'build notes')
    .replace(/\s+/g, ' ')
    .trim()

  return normalized.length <= maxLength ? normalized : `${normalized.slice(0, maxLength - 3).trim()}...`
}

function addMeta(kind, id, title, description) {
  const normalizedTitle = cleanTitle(title)
  const normalizedDescription = cleanDescription(description)

  if (normalizedTitle.length < 12) issues.push(`${kind}:${id} title is too short`)
  if (normalizedTitle.length > 60) issues.push(`${kind}:${id} title is too long (${normalizedTitle.length})`)
  if (normalizedDescription.length < 50) issues.push(`${kind}:${id} description is too short`)
  if (normalizedDescription.length > 160) issues.push(`${kind}:${id} description is too long (${normalizedDescription.length})`)

  return { kind, id, title: normalizedTitle, description: normalizedDescription }
}

const guides = readJson('src/data/guides.json')
const news = readJson('src/data/news.json')
const official = readJson('src/data/official.json')
const pokemon = readJson('src/data/pokemon.json')
const habitats = readJson('src/data/habitats.json')
const recipes = readJson('src/data/recipes.json')
const manifest = readJson('public/site.webmanifest')

const meta = [
  ...guides.map((item) => addMeta('guide', item.slug, item.title, item.answer || item.seo_keyword)),
  ...news.map((item) => addMeta('news', item.slug, item.title, item.excerpt)),
  ...official.map((item) => addMeta('official', item.slug, item.title, item.summary)),
  ...pokemon.map((item) => addMeta('pokemon', item.id, `${item.name}: ${item.type} ${item.specialty} Guide`, `${item.name} is a ${item.rarity} ${item.type} Pokemon. Check habitat, food, spawn time, weather, drops, and editorial planning notes.`)),
  ...habitats.map((item) => addMeta('habitat', item.id, `${item.name}: ${item.difficulty} Habitat Route`, `${item.name} habitat guide with unlock condition, ${item.weather} weather, ${item.resource_bonus}, spawn notes, recipe links, and route planning advice.`)),
  ...recipes.map((item) => addMeta('recipe', item.id, `${item.name}: Ingredients, Buff, and Timing`, `${item.name} recipe guide with ingredients, ${item.buff}, ${item.effect_duration} duration, timing notes, related Pokemon, and habitat planning links.`)),
]

const seenTitles = new Map()
for (const item of meta) {
  const existing = seenTitles.get(item.title.toLowerCase())
  if (existing) issues.push(`duplicate title: "${item.title}" used by ${existing} and ${item.kind}:${item.id}`)
  seenTitles.set(item.title.toLowerCase(), `${item.kind}:${item.id}`)
}

const sourceFiles = []
const textFiles = []
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      sourceFiles.push(full)
      textFiles.push(full)
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.json')) {
      textFiles.push(full)
    }
  }
}
walk(path.join(root, 'src'))
walk(path.join(root, 'scripts'))

for (const file of sourceFiles) {
  const rel = path.relative(root, file)
  const source = fs.readFileSync(file, 'utf8')
  const manualSuffix = source.match(/title:\s*['"`][^'"`]*\|\s*Pokopia Portal/g)
  if (manualSuffix) issues.push(`${rel} manually includes "| Pokopia Portal" in metadata title`)

  const riskyDescription = source.match(/description:\s*['"`][^'"`]*(ultimate|comprehensive|definitive|best builds?)/i)
  if (riskyDescription) issues.push(`${rel} has a risky static metadata description phrase`)
}

const mojibakePatterns = [
  /\uFFFD/u,
  /Pok\u8305mon/u,
  /[\u00C2\u00C3][\u0080-\u00BF]/u,
  /\u00E2\u0080[\u0080-\u00BF]/u,
]

if (manifest.name !== 'Pokopia Portal') issues.push('site.webmanifest name must be Pokopia Portal')
if (!manifest.short_name) issues.push('site.webmanifest short_name is missing')
if (manifest.start_url !== '/') issues.push('site.webmanifest start_url must be /')
if (manifest.display !== 'standalone') issues.push('site.webmanifest display must be standalone')
if (!/^#[0-9a-f]{6}$/i.test(manifest.theme_color || '')) {
  issues.push('site.webmanifest theme_color must be a hex color')
}
if (!Array.isArray(manifest.icons) || manifest.icons.length < 2) {
  issues.push('site.webmanifest must include at least two icons')
} else {
  for (const icon of manifest.icons) {
    if (!icon.src || !fs.existsSync(path.join(root, 'public', icon.src.replace(/^\//, '')))) {
      issues.push(`site.webmanifest icon is missing on disk: ${icon.src || '(empty)'}`)
    }
  }
}
for (const file of textFiles) {
  const rel = path.relative(root, file)
  const source = fs.readFileSync(file, 'utf8')
  for (const pattern of mojibakePatterns) {
    if (pattern.test(source)) issues.push(`${rel} contains mojibake text: ${pattern}`)
  }
}

if (issues.length > 0) {
  console.error('Meta quality check failed:')
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

console.log(`Meta quality check passed for ${meta.length} generated content pages.`)
