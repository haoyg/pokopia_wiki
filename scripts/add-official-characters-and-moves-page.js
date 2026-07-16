const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, ''))
}

function writeJson(file, data) {
  fs.writeFileSync(path.join(root, file), `${JSON.stringify(data, null, 2)}\n`)
}

const page = {
  id: 'official005',
  title: 'Pokemon Pokopia Official Characters and Moves',
  slug: 'official-characters-and-moves',
  category: 'Official Info',
  summary: 'A source-backed reference for Pokemon Pokopia characters and movement examples officially introduced by Pokemon: Professor Tangrowth, Peakychu, Mosslax, Smearguru, DJ Rotom, Chef Dente, Leafage, Rock Smash, Surf, and Glide.',
  seo_title: 'Pokemon Pokopia Official Characters and Moves',
  seo_description: 'Official Pokemon Pokopia character and move reference: Professor Tangrowth, Peakychu, Mosslax, Smearguru, DJ Rotom, Chef Dente, Leafage, Rock Smash, Surf, and Glide.',
  quick_answer: 'Pokemon’s official pages introduce Professor Tangrowth as a guide, name several distinctive town characters, and show movement or terrain examples including Leafage, Rock Smash, Surf, and Glide. They do not publish complete quest, item, or unlock tables for these characters and moves.',
  updated_at: '2026-07-16',
  facts: [
    'Pokemon’s official Discover page describes Professor Tangrowth as a vital guide to the player and the Pokemon they meet.',
    'The official page introduces Peakychu as an unusually pale Pikachu and Mosslax as a moss-covered Snorlax with a flower on its head.',
    'The official page describes Smearguru as a prolific painter, DJ Rotom as a mini-stereo-dwelling Rotom that can play music from CDs, and Chef Dente as a Greedent associated with kitchen tools and dishes.',
    'The official Create page says Leafage grows plants, Rock Smash breaks walls, Surf travels on open seas, and Glide moves between mountains.',
    'Pokemon’s official Create page says Pokemon neighbors can join adventures and help build houses to welcome more friends.',
    'The official page says that making the world greener leads to encounters with more Pokemon.',
  ],
  analysis: [
    'Use this page as the source-backed starting point for named-character and move queries, rather than mixing official names with speculative database entries.',
    'The official descriptions are deliberately brief. A useful guide must separate those facts from community observations about quests, rewards, move costs, or exact locations.',
    'When a new Nintendo or Pokemon source adds a direct character or move detail, update this reference first and then link relevant guides to it.',
  ],
  related_links: [
    { label: 'Official gameplay overview', href: '/official/gameplay-overview' },
    { label: 'Official beginner tips', href: '/official/official-beginner-tips' },
    { label: 'Official characters guide', href: '/guides/official-pokopia-characters-guide' },
    { label: 'Movement and terrain moves guide', href: '/guides/movement-and-terrain-moves-guide' },
  ],
  sources: [
    {
      label: 'Pokemon Pokopia: Create - Life in Town',
      url: 'https://pokopia.pokemon.com/en-us/create/',
      note: 'Official move examples, Pokemon neighbor context, building, and exploration information.',
    },
    {
      label: 'Pokemon Pokopia: Discover - A Few Friendly Faces',
      url: 'https://pokopia.pokemon.com/en-us/discover/',
      note: 'Official named-character introductions and descriptions.',
    },
  ],
  source_review_notes: [
    'Primary references are the official Pokemon Pokopia Create and Discover pages listed in the source section.',
    'Each fact is limited to a direct statement or a narrower paraphrase of the linked official pages.',
    'Character and move information should be updated from official Nintendo or Pokemon sources before being expanded into database-style claims.',
  ],
  claim_limits: [
    'Do not infer exact character quests, friendship requirements, item rewards, or story outcomes from the short official introductions.',
    'Do not treat the listed moves as a complete catalog or assign exact unlock order, resource cost, or every terrain interaction without a source.',
    'Do not use development screenshots as final proof of interface, balance, availability, or location details.',
  ],
  recheck_triggers: [
    'Nintendo or Pokemon publishes a character profile, trailer, support page, or update with more detailed move or quest information.',
    'Official pages add, remove, or rename named characters, CDs, moves, or movement examples.',
    'A guide needs to make a claim more specific than the current official wording.',
  ],
  faqs: [
    {
      question: 'Who is Professor Tangrowth in Pokemon Pokopia?',
      answer: 'Pokemon’s official Discover page describes Professor Tangrowth as a vital guide to the player and the Pokemon they meet.',
    },
    {
      question: 'Which Pokemon Pokopia moves are officially confirmed?',
      answer: 'The official Create page gives Leafage, Rock Smash, Surf, and Glide as examples, with uses for plants, walls, open seas, and mountains respectively.',
    },
    {
      question: 'What does DJ Rotom do?',
      answer: 'The official Discover page says DJ Rotom inhabits a mini stereo and can play a variety of music when given CDs.',
    },
    {
      question: 'Are character quest rewards officially listed?',
      answer: 'Not on the cited Create and Discover pages. This reference does not invent quest chains, rewards, or unlock conditions.',
    },
  ],
}

const official = readJson('src/data/official.json')
if (official.some((item) => item.slug === page.slug)) {
  throw new Error(`Official page slug already exists: ${page.slug}`)
}

const updated = [...official, page]
writeJson('src/data/official.json', updated)
writeJson('public/data/official.json', updated)
console.log('Added official characters and moves reference page.')
