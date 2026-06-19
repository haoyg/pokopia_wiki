const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^﻿/, ''))
}

const h = readJson('src/data/habitats.json')
const p = readJson('src/data/pokemon.json')
const g = readJson('src/data/guides.json')

const existingUnlock = new Set(g.filter(x => x.slug.includes('how-to-unlock')).map(x => x.related_habitats || ''))
const pokemonByHabitat = {}
p.forEach(pk => {
  if (!pokemonByHabitat[pk.habitat]) pokemonByHabitat[pk.habitat] = []
  pokemonByHabitat[pk.habitat].push(pk)
})

const uncovered = h.filter(ht => !existingUnlock.has(ht.id))
console.log(`Generating habitat unlock guides for ${uncovered.length} habitats...`)

let nextId = Math.max(...g.map(x => parseInt(x.id.replace('guid', '')))) + 1

uncovered.forEach(ht => {
  const spawns = pokemonByHabitat[ht.id] || []
  const slug = 'how-to-unlock-' + ht.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const difficulty = ht.difficulty || 'medium'
  const weather = ht.weather || 'any'
  const unlock = ht.unlock_condition || 'Reach the required level'
  const resource = ht.resource_bonus || 'none'
  const difficultyDesc = difficulty === 'easy' ? 'an accessible starting area with short routes and forgiving encounters' : difficulty === 'medium' ? 'a mid-game area with longer routes and moderate challenge' : 'a demanding late-game area requiring full preparation'

  const content = `${ht.name} is a ${difficulty} difficulty habitat unlocked when you ${unlock}. It is ${difficultyDesc}. The primary weather condition for optimal spawns is ${weather}.\n\n${ht.name} is worth unlocking ${difficulty === 'easy' ? 'early in your Pokopia progression as a starting area that introduces core gameplay loops' : difficulty === 'medium' ? 'during your mid-game progression when you need new Pokemon types and material farming routes' : 'as a late-game objective when you are building toward endgame team compositions'}. It provides access to ${spawns.length > 0 ? spawns.map(pk => pk.name).slice(0, 4).join(', ') + ' and other ' + ht.name + ' spawns' : 'specific Pokemon types not found in earlier habitats'}.\n\nThe habitat resource bonus is ${resource}, making it additionally valuable for farming specific materials alongside Pokemon encounters.`

  const answer = ht.name + ' unlocks when you ' + unlock + '. It is a ' + difficulty + ' habitat with ' + weather + ' weather. ' + (spawns.length > 0 ? 'Primary spawns include ' + spawns.map(pk => pk.name).slice(0, 3).join(', ') + '.' : 'Check the habitat page for full spawn details.') + ' Resource bonus: ' + resource + '.'

  const steps = [
    unlock + '. This is the primary gate for entering ' + ht.name + '.',
    'Check the weather forecast — ' + weather + ' is the optimal condition for ' + ht.name + '.',
    difficulty === 'easy' ? 'Enter with your starter team. Routes are short and forgiving.' : difficulty === 'medium' ? 'Enter with 3-4 Pokemon and basic healing items. Learn the route layout on the first clear.' : 'Enter with a full team of 4-5 Pokemon and full healing supplies. This is a hard habitat.',
    'Focus on the early spawn section first to learn where ' + (spawns.length > 0 ? spawns[0].name : 'your target Pokemon') + ' appears.',
    'Return during ' + weather + ' weather to farm ' + ht.name + ' efficiently.',
    'Use the resource bonus — ' + resource + ' — to plan material farming alongside Pokemon catching.'
  ]

  const recommended_setup = [
    'Unlock: ' + unlock + '.',
    'Weather: ' + weather + ' — check forecast before every run.',
    'Difficulty: ' + difficulty + ' — adjust team strength accordingly.',
    'Resource bonus: ' + resource + '.',
    'Spawn targets: ' + (spawns.length > 0 ? spawns.slice(0, 3).map(pk => pk.name + ' (' + pk.rarity + ' ' + pk.type + ')').join(', ') : 'see habitat page.')
  ]

  const common_mistakes = [
    'Entering before meeting the unlock requirement — the habitat will not be accessible.',
    difficulty === 'easy' ? 'Using rare recipes on early runs instead of saving them for harder content.' : difficulty === 'medium' ? 'Not checking weather before entering — spawn rates are significantly reduced outside optimal conditions.' : 'Attempting without full preparation — hard habitats punish incomplete teams.',
    'Staying past the weather window expecting spawns to continue.',
    'Ignoring the resource bonus — ' + resource + ' is a significant farming multiplier.'
  ]

  const faqs = [
    { question: 'How do I unlock ' + ht.name + '?', answer: ht.name + ' unlocks when you ' + unlock + '.' },
    { question: 'What Pokemon spawn in ' + ht.name + '?', answer: (spawns.length > 0 ? 'Common spawns include ' + spawns.slice(0, 3).map(pk => pk.name).join(', ') + '. See the habitat page for the full list.' : 'See the habitat page for spawn list.') },
    { question: 'What is the best weather for ' + ht.name + '?', answer: weather + ' is the optimal weather condition for ' + ht.name + '. Plan farming sessions around this weather.' }
  ]

  const guide = {
    id: 'guid' + String(nextId).padStart(3, '0'),
    title: 'How to Unlock ' + ht.name + ' in Pokopia',
    slug: slug,
    category: 'guides',
    seo_keyword: 'how to unlock ' + ht.name.toLowerCase().replace(/[^a-z0-9]+/g, ' ') + ' pokopia',
    content: content,
    related_pokemon: spawns.slice(0, 4).map(pk => pk.id).join(','),
    related_items: '',
    related_habitats: ht.id,
    image_url: 'https://www.gematsu.com/wp-content/uploads/2025/11/Pokemon-Pokopia_2025_11-13-25_003.jpg',
    image_alt: 'Pokémon Pokopia screenshot for ' + ht.name,
    answer: answer,
    steps: steps,
    recommended_setup: recommended_setup,
    common_mistakes: common_mistakes,
    faqs: faqs,
    published_at: '2026-05-15',
    updated_at: '2026-05-23',
    image_source: 'Gematsu - official Pokopia screenshot repost',
    image_source_url: 'https://www.gematsu.com/2025/11/pokemon-pokopia-extended-trailer-new-details-and-screenshots',
    data_status: 'Editorial',
    data_status_note: 'Habitat unlock requirements based on published gameplay information. Confirm level requirements with official Nintendo sources.',
    image_license_note: 'Image: Gematsu official Pokopia screenshot repost.',
    image_original_media: 'Nintendo / The Pokemon Company'
  }

  g.push(guide)
  existingUnlock.add(ht.id)
  nextId++
  console.log('Created: ' + slug)
})

fs.writeFileSync(path.join(root, 'src/data/guides.json'), JSON.stringify(g, null, 2))
fs.writeFileSync(path.join(root, 'public/data/guides.json'), JSON.stringify(g, null, 2))

console.log('\nDone. Total guides: ' + g.length)
