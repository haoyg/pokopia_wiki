const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const sources = [
  { label: 'Pokemon Pokopia: Create - Life in Town', url: 'https://pokopia.pokemon.com/en-us/create/' },
  { label: 'Pokemon Pokopia: Discover - A Few Friendly Faces', url: 'https://pokopia.pokemon.com/en-us/discover/' },
]

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, ''))
}

function writeJson(file, data) {
  fs.writeFileSync(path.join(root, file), `${JSON.stringify(data, null, 2)}\n`)
}

function guide(id, details) {
  return {
    id,
    category: 'guides',
    related_pokemon: '',
    related_items: '',
    related_habitats: '',
    published_at: '2026-07-16',
    updated_at: '2026-07-16',
    data_status: 'Source-backed guide',
    data_status_note: 'This source-backed guide uses the official Pokemon Pokopia Create and Discover pages reviewed on July 16, 2026. It limits factual claims to the features and character descriptions published there, without inventing unlock methods, item lists, or move statistics.',
    source_notes: [
      'Primary evidence comes from Pokemon Pokopia’s official Create and Discover pages.',
      'The route advice translates published examples into player-friendly checklists while leaving undisclosed requirements explicitly open.',
    ],
    sources,
    index_status: 'indexable',
    ...details,
  }
}

const additions = [
  guide('guid066', {
    title: 'Pokemon Pokopia Movement and Terrain Moves Guide',
    seo_title: 'Pokemon Pokopia Leafage, Rock Smash, Surf, and Glide Guide',
    seo_description: 'Use official Pokemon Pokopia move examples for terrain and travel: Leafage, Rock Smash, Surf, and Glide, with clear limits on unconfirmed unlock details.',
    slug: 'movement-and-terrain-moves-guide',
    seo_keyword: 'pokemon pokopia leafage rock smash surf glide',
    answer: 'The official Create page identifies four useful move examples: Leafage grows plants, Rock Smash breaks walls, Surf crosses open seas, and Glide travels between mountains. Use each move for its published terrain or travel role, then verify its in-game availability rather than relying on an assumed unlock order.',
    content: 'Pokemon Pokopia’s official Create page frames moves as tools for changing the land and traveling further. Its published examples are clear: use Leafage to grow plants, Rock Smash to break walls, Surf on open seas, and Glide between mountains. These are useful planning anchors because each one answers a different route problem instead of being just a combat label.\n\nStart by identifying the obstacle rather than searching for every move at once. Need to make an area greener? Use the Leafage example. Facing a breakable wall? Consider Rock Smash. Planning water travel or a mountain crossing? The official page points to Surf and Glide. It does not publish a complete move list, learning order, cost, or universal terrain chart, so keep this page as an official-baseline reference and verify the current state in your own game.',
    steps: [
      'Identify whether your next obstacle is vegetation, a wall, open water, or a mountain route.',
      'Match the obstacle to the official example: Leafage, Rock Smash, Surf, or Glide.',
      'Confirm that the relevant move is available in your current save.',
      'Use the move on the terrain type described by the official page.',
      'Return to the official page or in-game guidance if the route requires a move not listed here.',
    ],
    recommended_setup: [
      'One clear travel or terrain goal before choosing a move.',
      'A route with an obvious obstacle instead of a broad exploration session.',
      'A note that official examples are not a complete move catalog.',
    ],
    common_mistakes: [
      'Assuming the four published examples are the only moves in the game.',
      'Claiming an exact unlock order not stated by the source.',
      'Using a movement plan without checking whether the relevant move is available.',
    ],
    confirmed_context: [
      'The official Create page says Leafage can grow plants.',
      'The official Create page says Rock Smash can break walls, Surf can travel on open seas, and Glide can move between mountains.',
      'The official page describes learning useful moves from other Pokemon as part of town life and exploration.',
    ],
    editorial_limits: [
      'The official page does not give a complete move list, learning sequence, costs, or interaction table.',
      'Obstacle-first route planning is editorial advice, not an official requirement.',
    ],
    faqs: [
      { question: 'What does Leafage do in Pokemon Pokopia?', answer: 'The official Create page says Leafage grows plants.' },
      { question: 'Which move breaks walls?', answer: 'The official Create page uses Rock Smash as its wall-breaking example.' },
      { question: 'Which moves help with travel?', answer: 'Nintendo and Pokemon official guidance gives Surf for open seas and Glide for travel between mountains.' },
    ],
  }),
  guide('guid067', {
    title: 'DJ Rotom Music Guide for Pokemon Pokopia',
    seo_title: 'Pokemon Pokopia DJ Rotom Music Guide',
    seo_description: 'Understand DJ Rotom in Pokemon Pokopia: the official character description says CDs can be given to this mini-stereo Rotom for a variety of music.',
    slug: 'dj-rotom-music-guide',
    seo_keyword: 'pokemon pokopia dj rotom cds music',
    answer: 'The official Discover page says DJ Rotom inhabits a mini stereo and can liven things up with a variety of music when you give it CDs. Use it as a music-focused town feature, while checking in game for the available CDs and placement options.',
    content: 'DJ Rotom is one of the official character details that gives a town more personality without needing a large construction project. Pokemon’s Discover page describes DJ Rotom as a Rotom living in a mini stereo, and says that giving it CDs lets it liven things up with a variety of music. That is the confirmed baseline.\n\nFor a practical setup, decide where music belongs before collecting or using CDs: a social corner, a decorated home, or a shared creative area. The official description does not list every CD, track, item source, playback condition, or range. Avoid treating community lists as official confirmation. Instead, use DJ Rotom as a focused theme element and update this page when official material adds more detail.',
    steps: [
      'Choose a town or home area where music will support the atmosphere.',
      'Find DJ Rotom and confirm the available CD interaction in your game.',
      'Give DJ Rotom a CD when you want to change or add music to the space.',
      'Keep the music area clear enough that it still serves its intended gathering or decoration purpose.',
      'Record only the CDs and options you can verify in game or through an official source.',
    ],
    recommended_setup: [
      'A small social or showcase area with room for DJ Rotom.',
      'One intentional music theme instead of scattered audio features.',
      'A verified CD before making claims about a specific track.',
    ],
    common_mistakes: [
      'Inventing a complete CD or song list from an official character description.',
      'Assuming DJ Rotom changes music without providing a CD.',
      'Treating a decoration suggestion as a confirmed gameplay requirement.',
    ],
    confirmed_context: [
      'The official Discover page says DJ Rotom is a Rotom that inhabits a mini stereo.',
      'The official page says giving DJ Rotom CDs lets it play a variety of music.',
    ],
    editorial_limits: [
      'The source does not publish a full CD list, track list, acquisition guide, or placement rule.',
      'Music-area design suggestions are editorial advice.',
    ],
    faqs: [
      { question: 'What is DJ Rotom?', answer: 'The official Discover page describes DJ Rotom as a Rotom that inhabits a mini stereo.' },
      { question: 'How does DJ Rotom play music?', answer: 'The official page says to give it CDs so it can liven things up with a variety of music.' },
      { question: 'Which CDs can I use?', answer: 'The cited source does not provide a complete CD list, so check the game or future official details.' },
    ],
  }),
  guide('guid068', {
    title: 'Official Pokemon Pokopia Characters Guide',
    seo_title: 'Pokemon Pokopia Characters: Official Guide',
    seo_description: 'Meet confirmed Pokemon Pokopia characters including Professor Tangrowth, Peakychu, Mosslax, Smearguru, DJ Rotom, and Chef Dente using official descriptions.',
    slug: 'official-pokopia-characters-guide',
    seo_keyword: 'pokemon pokopia characters professor tangrowth peakychu mosslax',
    answer: 'The official Discover page identifies Professor Tangrowth as a guide, and introduces Peakychu, Mosslax, Smearguru, DJ Rotom, and Chef Dente. This page collects those confirmed roles without inventing their request chains, rewards, or unlock conditions.',
    content: 'The official Discover page introduces several distinctive Pokemon Pokopia characters, but its descriptions are deliberately brief. Professor Tangrowth is identified as a vital guide to the player and the Pokemon they meet. Peakychu is an unusually pale Pikachu, while Mosslax is a Snorlax covered in moss with a flower on its head.\n\nThe same source describes Smearguru as a prolific painter, DJ Rotom as a mini-stereo-dwelling Rotom that responds to CDs, and Chef Dente as a Greedent with kitchen tools that treats everyone to dishes. These details are useful for recognizing official characters and building a themed town around them. They are not proof of full story routes, item rewards, or mechanics beyond what the official source explicitly says.',
    steps: [
      'Use the official names when identifying a character in a guide or community post.',
      'Treat Professor Tangrowth as a confirmed guidance figure in the world.',
      'Use the official visual descriptions to distinguish Peakychu and Mosslax from their familiar species.',
      'Connect Smearguru, DJ Rotom, and Chef Dente only to their published creative, music, and cooking descriptions.',
      'Check official sources or in-game information before publishing a claimed quest, reward, or unlock condition.',
    ],
    recommended_setup: [
      'Official character names and roles used consistently across site content.',
      'A separate note for anything observed in game but not yet confirmed by an official source.',
      'Links to the official Discover page for readers who want the original character introductions.',
    ],
    common_mistakes: [
      'Treating a character’s visual description as proof of a mechanical specialty.',
      'Inventing named quest chains or rewards for an official character.',
      'Mixing official Pokopia characters with unverified database entries.',
    ],
    confirmed_context: [
      'The official page identifies Professor Tangrowth as a vital guide to the player and other Pokemon.',
      'The official page introduces Peakychu, Mosslax, Smearguru, DJ Rotom, and Chef Dente with short character descriptions.',
      'The official page specifically links DJ Rotom to CDs and music, and Chef Dente to dishes and kitchen tools.',
    ],
    editorial_limits: [
      'The cited page does not publish complete quest chains, friendship requirements, rewards, or unlock conditions for these characters.',
      'Theme and recognition advice on this page is editorial interpretation of the official descriptions.',
    ],
    faqs: [
      { question: 'Who is Professor Tangrowth?', answer: 'The official Discover page describes Professor Tangrowth as a vital guide to you and the Pokemon you meet.' },
      { question: 'What is Mosslax?', answer: 'The official page describes Mosslax as a Snorlax covered in moss with a flower on its head.' },
      { question: 'Who is Chef Dente?', answer: 'The official page describes Chef Dente as a Greedent with kitchen tools that treats everyone to dishes.' },
    ],
  }),
]

const guides = readJson('src/data/guides.json')
const existingSlugs = new Set(guides.map((item) => item.slug))
const duplicate = additions.find((item) => existingSlugs.has(item.slug))

if (duplicate) throw new Error(`Guide slug already exists: ${duplicate.slug}`)

const updated = [...guides, ...additions]
writeJson('src/data/guides.json', updated)
writeJson('public/data/guides.json', updated)
console.log(`Added ${additions.length} source-backed Create and Discover guides.`)
