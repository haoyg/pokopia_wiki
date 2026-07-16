const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const sources = [
  {
    label: 'Nintendo News: Shape the world in Pokemon Pokopia',
    url: 'https://www.nintendo.com/us/whatsnew/shape-the-world-and-build-a-cozy-new-life-in-pokemon-pokopia-available-now/',
  },
  {
    label: 'Pokemon Pokopia official site',
    url: 'https://pokopia.pokemon.com/en-us/',
  },
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
    data_status_note: 'This source-backed guide uses official descriptions of town rebuilding, Pokemon requests, crafting, farming, and habitat creation reviewed on July 16, 2026. It does not invent numerical progression thresholds, request rewards, or hidden habitat conditions that the official sources do not publish.',
    source_notes: [
      'Primary evidence comes from Nintendo\'s launch article and the official Pokemon Pokopia site.',
      'The guides turn confirmed feature descriptions into lightweight planning routines while keeping unpublished progression details out of the claims.',
    ],
    sources,
    index_status: 'indexable',
    ...details,
  }
}

const additions = [
  guide('guid063', {
    title: 'Pokemon Request Planning Guide for Pokemon Pokopia',
    seo_title: 'Pokemon Pokopia Requests Guide',
    seo_description: 'Plan Pokemon requests in Pokemon Pokopia with a simple town-development loop based on Nintendo\'s official description of requests and comfortable living spaces.',
    slug: 'pokemon-request-planning-guide',
    seo_keyword: 'pokemon pokopia requests guide',
    answer: 'Nintendo says that as the town develops, Pokemon may bring requests to solve problems or make the town more comfortable. Treat each request as a focused project: identify the need, gather only what helps, complete it, then reassess the town before taking on another.',
    content: 'Requests give town building a human, or rather Pokemon, reason to exist. Nintendo says that as your town develops, fellow Pokemon may come to you with requests that solve their problems or make the town a more comfortable place to live. The official source does not publish a universal request list, so the most useful approach is to keep each request small and observable.\n\nWhen a request appears, first decide whether it asks for exploration, materials, construction, or a comfort improvement. Finish the immediate need before beginning a large unrelated build. Afterward, walk through the area again and note what changed: a new resident need, a more useful work area, or simply a better place for Pokemon to spend time. This keeps the town moving forward without turning every request into a sprawling checklist.',
    steps: [
      'Talk to Pokemon and note the specific request or problem they raise.',
      'Classify the next action as exploration, materials, construction, or a comfort improvement.',
      'Gather only the materials or information needed for that one task.',
      'Complete the request before starting an unrelated large project.',
      'Revisit the nearby area and look for the next practical improvement.',
      'Use the result to choose one clear follow-up task for the town.',
    ],
    recommended_setup: [
      'One active request at a time during an early town-building session.',
      'A nearby storage and work area for requests that need crafted items.',
      'A short note of the request goal before leaving the area.',
    ],
    common_mistakes: [
      'Assuming every Pokemon request has the same reward or requirement.',
      'Collecting large amounts of unrelated materials before understanding the request.',
      'Starting a major decoration project before resolving the nearby problem.',
    ],
    confirmed_context: [
      'Nintendo says Pokemon may come to the player with requests as the town develops.',
      'Nintendo says requests can solve Pokemon problems or make the town more comfortable to live in.',
      'Nintendo describes rebuilding a town with Pokemon as part of the game\'s core loop.',
    ],
    editorial_limits: [
      'The cited sources do not list every request, reward, unlock condition, or completion order.',
      'The one-request workflow is editorial planning advice rather than an official system rule.',
    ],
    faqs: [
      { question: 'What are Pokemon requests for?', answer: 'Nintendo says requests can solve Pokemon problems or make the town more comfortable.' },
      { question: 'When do Pokemon requests appear?', answer: 'Nintendo says Pokemon may bring requests as the town develops, without publishing a complete trigger list.' },
      { question: 'Should I complete several requests at once?', answer: 'The official sources do not prescribe an order. Handling one clear task at a time is a practical planning suggestion.' },
    ],
  }),
  guide('guid064', {
    title: 'Materials, Crops, and Cooking Loop Guide for Pokemon Pokopia',
    seo_title: 'Pokemon Pokopia Materials Crops and Cooking Guide',
    seo_description: 'Build a practical materials, crops, crafting, and cooking loop in Pokemon Pokopia using confirmed Nintendo gameplay features without unsupported recipe claims.',
    slug: 'materials-crops-cooking-guide',
    seo_keyword: 'pokemon pokopia gather materials grow crops cook',
    answer: 'Nintendo confirms that you can gather materials to craft items and furniture, till fields to grow crops, and cook those crops into meals. Use a simple loop: collect for one project, grow what you plan to cook, then turn the result into a useful next action.',
    content: 'The official gameplay loop connects gathering, crafting, farming, and cooking instead of treating them as isolated chores. Nintendo says players can gather materials to craft items and furniture, till fields to grow crops, and cook crops into meals. Begin with one purpose such as furnishing a home, improving a workspace, or preparing food for a planned activity.\n\nDo not assume every material or crop has the same value; the official article presents the systems broadly and does not publish a complete recipe or yield table. Keep your routine narrow: collect what the current project needs, plant a manageable crop patch, cook when you have a use for the result, and return leftover materials to storage. This creates a stable building rhythm without relying on unsupported optimization claims.',
    steps: [
      'Choose one immediate project that needs materials, furniture, food, or all three.',
      'Gather the materials that directly support that project.',
      'Craft the needed item or furniture at your work area.',
      'Till a small field and grow crops alongside the project.',
      'Cook crops into meals when they support the next task.',
      'Store leftovers by category before beginning another loop.',
    ],
    recommended_setup: [
      'A small work area with storage near the crafting point.',
      'A manageable crop patch instead of an unplanned large farm.',
      'One active furniture or construction target to guide material collection.',
    ],
    common_mistakes: [
      'Gathering every material without a current use.',
      'Planting more crops than you can track or cook purposefully.',
      'Treating unverified recipe effects as confirmed benefits.',
    ],
    confirmed_context: [
      'Nintendo says players can gather materials to craft items and furniture.',
      'Nintendo says players can till fields to grow crops and cook them into meals.',
      'The official site describes crafting, building, and gardening as connected parts of building a Pokemon paradise.',
    ],
    editorial_limits: [
      'The sources do not publish complete material locations, crop timings, recipe effects, or yield values.',
      'The recommended project loop is editorial organization advice.',
    ],
    faqs: [
      { question: 'Can I craft furniture in Pokemon Pokopia?', answer: 'Yes. Nintendo says players can gather materials to craft items and furniture.' },
      { question: 'Can I grow and cook crops?', answer: 'Yes. Nintendo says players can till fields to grow crops and cook them into meals.' },
      { question: 'Which crop is best to grow?', answer: 'The cited official sources do not provide a complete crop comparison, so this guide does not rank them.' },
    ],
  }),
  guide('guid065', {
    title: 'How to Build Comfortable Pokemon Spaces in Pokemon Pokopia',
    seo_title: 'Pokemon Pokopia Comfortable Spaces Guide',
    seo_description: 'Build comfortable Pokemon spaces in Pokemon Pokopia using official guidance on habitats, furniture, town development, visitors, and player-led creativity.',
    slug: 'comfortable-pokemon-spaces-guide',
    seo_keyword: 'pokemon pokopia build comfortable spaces habitats',
    answer: 'Nintendo confirms that players can create cozy habitats, craft furniture, rebuild the town, and invite Pokemon to visit a personal home. Start with one practical space, then improve it through the needs and requests you observe rather than copying an unsupported “perfect habitat” formula.',
    content: 'A comfortable Pokemon space does not need to start as a large showcase build. Nintendo describes creating cozy habitats, crafting furniture, rebuilding a town, and eventually inviting Pokemon to a personal home. That supports a simple design approach: make one clear area useful and welcoming, then improve it when a Pokemon request or the town layout gives you a reason.\n\nUse basic structure first, followed by furniture and small environmental details. The official sources do not publish a universal comfort score, mandatory furniture list, or formula for every Pokemon, so avoid treating fan-made layouts as official requirements. A good early target is a readable space with a purpose: a place to rest, an area to gather, or a home you would be comfortable inviting visitors into.',
    steps: [
      'Choose one small area and give it a single purpose.',
      'Add the structure or ground layout needed for that purpose.',
      'Craft and place furniture that makes the space usable or inviting.',
      'Use nearby Pokemon requests as a reason to make targeted improvements.',
      'Walk through the space and remove items that obstruct its intended use.',
      'Expand only after the first area feels complete and understandable.',
    ],
    recommended_setup: [
      'One focused build area instead of several unfinished habitats.',
      'Furniture selected for a visible purpose before purely decorative additions.',
      'A nearby storage and workbench for quick refinements.',
    ],
    common_mistakes: [
      'Assuming a universal comfort formula exists for every Pokemon.',
      'Adding decorations until the space no longer has a clear purpose.',
      'Ignoring requests that point to a practical town improvement.',
    ],
    confirmed_context: [
      'Nintendo describes creating cozy habitats for Pokemon as an activity in Pokemon Pokopia.',
      'Nintendo says players can craft furniture, rebuild the town, and eventually invite Pokemon to a personal home.',
      'The official site describes building, crafting, gardening, and inviting Pokemon or friends as part of creating a Pokemon paradise.',
    ],
    editorial_limits: [
      'The cited sources do not publish a complete habitat scoring system, furniture requirement list, or Pokemon-by-Pokemon preference table.',
      'Layout choices and expansion order are editorial design advice.',
    ],
    faqs: [
      { question: 'Can I make habitats for Pokemon?', answer: 'Yes. Nintendo describes creating cozy habitats for Pokemon as part of the game.' },
      { question: 'Can Pokemon visit my home?', answer: 'Nintendo says players can eventually build a personal home and invite Pokemon to visit.' },
      { question: 'What furniture does each Pokemon need?', answer: 'The cited official sources do not publish a complete requirement list, so this guide does not claim one.' },
    ],
  }),
]

const guides = readJson('src/data/guides.json')
const existingSlugs = new Set(guides.map((item) => item.slug))
const duplicate = additions.find((item) => existingSlugs.has(item.slug))

if (duplicate) {
  throw new Error(`Guide slug already exists: ${duplicate.slug}`)
}

const updated = [...guides, ...additions]
writeJson('src/data/guides.json', updated)
writeJson('public/data/guides.json', updated)
console.log(`Added ${additions.length} source-backed town-building guides.`)
