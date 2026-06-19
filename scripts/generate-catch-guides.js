const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^﻿/, ''))
}

const p = readJson('src/data/pokemon.json')
const h = readJson('src/data/habitats.json')
const guides = readJson('src/data/guides.json')

const pokemonById = new Map(p.map(item => [item.id, item]))
const habitatById = new Map(h.map(item => [item.id, item]))

// Find missing catch guide slugs
const existingCatchSlugs = new Set(guides.filter(g => g.slug.includes('catch-guide')).map(g => g.slug))

const missing = p.filter(pk => {
  const slug = pk.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-catch-guide'
  return !existingCatchSlugs.has(slug)
})

console.log(`Generating catch guides for ${missing.length} Pokemon...`)

let nextId = Math.max(...guides.map(g => parseInt(g.id.replace('guid', '')))) + 1

function buildCatchGuide(pk, id) {
  const hab = habitatById.get(pk.habitat)
  const habitatName = hab ? hab.name : pk.habitat
  const difficulty = hab ? hab.difficulty : 'medium'
  const weather = pk.weather || 'any'
  const spawnTime = pk.spawn_time || 'Any'
  const rarity = pk.rarity
  const type = pk.type
  const specialty = pk.specialty
  const food = pk.favorite_food || 'its preferred bait'
  const drops = pk.drops && pk.drops !== 'None' ? pk.drops : 'no notable material drops'

  const slug = pk.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-catch-guide'

  // Build content based on rarity and difficulty
  const isStarter = rarity === 'common' && difficulty === 'easy'
  const isUncommon = rarity === 'uncommon'
  const isRare = rarity === 'rare'

  const contentIntro = isStarter
    ? `${pk.name} is a ${rarity} ${type} ${specialty} found in ${habitatName}, one of the first areas accessible in Pokopia. ${habitatName} is a ${difficulty} habitat with predictable weather, making ${pk.name} one of the most reliable early captures for players building their first team. Unlike rare or legendary spawns, ${pk.name} appears consistently and does not require specific weather windows to find.\n\n${pk.name} is worth catching early because ${type} typing gives your starter team immediate coverage. Its ${specialty} role means it contributes to ${type.toLowerCase().includes('support') ? 'team stability and support functions' : type.toLowerCase().includes('defender') || type.toLowerCase().includes('tank') ? 'route survival and defensive positioning' : 'offensive pressure and early game damage'} during the first hours of gameplay.`
    : isUncommon
    ? `${pk.name} is an ${rarity} ${type} ${specialty} found in ${habitatName}, a ${difficulty} habitat that most players encounter in the early-to-mid progression. ${habitatName} requires ${weather} weather for optimal spawns, which is ${weather === 'Rain' || weather === 'Clear' || weather === 'Sunny' ? 'a common condition' : weather === 'Cloudy' ? 'moderately common' : 'less predictable'} and can be monitored on the weather forecast.\n\n${pk.name} is worth targeting because ${type} typing is useful in ${specialty.toLowerCase()} builds and the ${rarity} rarity means it appears reliably without excessive farming sessions. It fills a specific role in team composition that common Pokemon cannot match as efficiently.`
    : `${pk.name} is a ${rarity} ${type} ${specialty} found in ${habitatName}, a ${difficulty} habitat that requires careful planning to access efficiently. ${habitatName} requires ${weather} weather and players typically reach it after completing easier areas first.\n\n${pk.name} is worth the extra farming effort because ${type} typing provides coverage that ${rarity} Pokemon cannot match. Its ${specialty} role makes it a strong candidate for endgame build planning, and catching it early sets up your account for more efficient progression through harder habitats.`

  const answerSuffix = isStarter
    ? 'It is one of the most accessible Pokemon to farm and a reliable early-game pick.'
    : isUncommon
    ? 'Monitor the weather forecast and enter ' + habitatName + ' during ' + weather + ' for best results. It appears more reliably than rare spawns.'
    : 'Enter during ' + weather + ' and bring the correct bait. The ' + rarity + ' rarity makes it a valuable catch for ' + type + ' builds.'

  const answer = pk.name + ' is a ' + rarity + ' ' + type + ' ' + specialty + ' that spawns during ' + spawnTime + ' in ' + weather + ' weather at ' + habitatName + '. ' + answerSuffix

  const steps = [
    `Check the weather forecast and confirm ${weather} is active before heading to ${habitatName}.`,
    `Enter ${habitatName} and navigate toward the ${pk.name} spawn zone.`,
    `Use ${food} at the ${pk.name} branch to improve attraction chances.`,
    `${pk.name} appears as a ${rarity} encounter — ${isStarter ? 'it should appear within the first few runs' : 'multiple runs may be needed to find it consistently'}.`,
    `Catch ${pk.name} and exit once the weather window remains favorable.`,
    `${habitatName} is ${difficulty} difficulty — ${isStarter ? 'bring basic healing items for the short route' : difficulty === 'medium' ? 'bring healing items for a moderate-length route' : 'come prepared with full supplies for a demanding habitat'}.`
  ]

  const recommended_setup = [
    `Weather: ${weather} — enter only when this weather is confirmed active.`,
    `Bait: ${food} — this is the primary attraction bait for ${pk.name}.`,
    `Habitat: ${habitatName} (${difficulty}) — ${isStarter ? 'easy and fast to clear' : difficulty === 'medium' ? 'moderate difficulty, plan around weather windows' : 'demanding habitat, bring full supplies'}.`,
    `Role: ${specialty} — build around ${pk.name}'s ${specialty.toLowerCase()} role rather than expecting it to fill a different position.`
  ]

  const common_mistakes = [
    `Entering ${habitatName} without ${weather} weather — ${pk.name} spawns are significantly reduced outside optimal conditions.`,
    `Using the wrong bait — ${food} is specific to ${pk.name}'s attraction profile.`,
    `${isStarter ? 'Using rare recipes on early farming runs instead of saving them for harder content.' : isUncommon ? 'Staying past the weather window and expecting spawns to continue.' : 'Attempting this ${rarity} catch without checking difficulty and preparation requirements.'}`
  ]

  const faqs = [
    {
      question: `Where does ${pk.name} spawn?`,
      answer: `${pk.name} spawns in ${habitatName} during ${spawnTime} in ${weather} weather. ${isStarter ? 'It is the most accessible spawn in the area and appears near the start of the route.' : `Check the habitat page for the exact route section where ${pk.name} appears.`}`
    },
    {
      question: `What bait attracts ${pk.name}?`,
      answer: `${pk.name} is attracted by ${food}. Bring enough for multiple attempts since ${rarity} encounters may require several runs.`
    },
    {
      question: `What is ${pk.name} used for?`,
      answer: `${pk.name} is a ${specialty} with ${type} typing. It is best used for ${specialty.toLowerCase()} builds and provides ${type} type coverage that complements early and mid-game team compositions.`
    },
    {
      question: `Is ${pk.name} better than other ${type} Pokemon?`,
      answer: `${pk.name} is a ${rarity} ${type} ${specialty}. It is ${isStarter ? 'the most accessible ${type} option and ideal for early progression' : rarity === 'uncommon' ? 'a reliable ${type} option with good accessibility' : `a strong ${type} choice with ${rarity} status, worth prioritizing in build planning`}. Compare it against other ${type} Pokemon on the wiki page before committing to a farming schedule.`
    }
  ]

  return {
    id: 'guid' + String(nextId).padStart(3, '0'),
    title: 'How to Catch ' + pk.name + ' in Pokopia',
    slug: slug,
    category: 'guides',
    seo_keyword: 'how to catch ' + pk.name.toLowerCase() + ' pokopia',
    content: contentIntro,
    related_pokemon: pk.id,
    related_items: '',
    related_habitats: pk.habitat || '',
    image_url: pk.image_url,
    image_alt: pk.image_alt,
    answer: answer,
    steps: steps,
    recommended_setup: recommended_setup,
    common_mistakes: common_mistakes,
    faqs: faqs,
    published_at: '2026-05-15',
    updated_at: '2026-05-23',
    image_source: pk.image_source || '',
    image_source_url: pk.image_source_url || '',
    data_status: 'Editorial',
    data_status_note: 'Catching tips based on habitat data and published gameplay observations. Confirm spawn windows with official Nintendo sources before the game launches.',
    image_license_note: pk.image_license_note || '',
    image_original_media: pk.image_original_media || ''
  }
}

const newGuides = []

missing.forEach(pk => {
  const guide = buildCatchGuide(pk, nextId)
  newGuides.push(guide)
  guides.push(guide)
  existingCatchSlugs.add(guide.slug)
  nextId++
  console.log(`Created: ${guide.slug}`)
})

fs.writeFileSync(path.join(root, 'src/data/guides.json'), JSON.stringify(guides, null, 2))
fs.writeFileSync(path.join(root, 'public/data/guides.json'), JSON.stringify(guides, null, 2))

console.log(`\nDone. Added ${newGuides.length} new catch guides. Total guides: ${guides.length}`)
