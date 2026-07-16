const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const source = {
  label: 'Nintendo News: Helpful tips for Pokemon Pokopia',
  url: 'https://www.nintendo.com/us/whatsnew/get-the-most-out-of-pokemon-pokopia-with-these-helpful-tips/',
}

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
    data_status_note: 'This source-backed guide summarizes a Nintendo-published gameplay tip and keeps its practical checklist separate from information the official article does not confirm. Recheck it when Nintendo updates the game or its guidance.',
    source_notes: [
      'Primary evidence comes from Nintendo News, which describes the relevant in-game system in its helpful-tips article.',
      'The route checklist below turns that published tip into a short player workflow without adding unverified unlock values or hidden mechanics.',
    ],
    sources: [source],
    index_status: 'indexable',
    ...details,
  }
}

const additions = [
  guide('guid049', {
    title: 'How to Build Your First House in Pokemon Pokopia',
    seo_title: 'Pokemon Pokopia First House Guide',
    seo_description: 'Build a first house in Pokemon Pokopia with four walls, a door, three furnishings, and a practical construction checklist based on Nintendo guidance.',
    slug: 'how-to-build-first-house',
    seo_keyword: 'pokemon pokopia how to build a house',
    answer: 'To build a house from scratch, make four walls at least one block high, add a door, and place at least three furnishings inside. Nintendo also notes that building kits can simplify the process.',
    content: 'Your first house is a useful place to learn the game\'s construction logic without turning the project into a huge decoration session. Nintendo\'s published tip gives a concrete baseline: build four walls that are at least one block high, add a door, then place three or more furnishings inside. Start with that complete shell before trying to make it elaborate.\n\nIf you already have a building kit, use it to reduce the setup work. Once the basic structure counts as a home, expand one detail at a time: adjust the entrance, group furnishings by purpose, and only then add decorative pieces. This approach keeps an early build readable and avoids spending time moving objects before the house itself is finished.',
    steps: [
      'Pick a clear, flat spot where you can see all four sides of the planned room.',
      'Build four connected walls, keeping each wall at least one block high.',
      'Add a door so the enclosed structure has an entrance.',
      'Place at least three furnishings inside the room.',
      'Check the completed shell before adding decorative extensions.',
      'Use a building kit for later structures when you want a faster construction start.',
    ],
    recommended_setup: [
      'A small square footprint that is easy to inspect from every side.',
      'Three furnishings chosen for function first, then decoration.',
      'A building kit for repeat builds or larger projects.',
    ],
    common_mistakes: [
      'Decorating before all four walls and the door are in place.',
      'Leaving one wall too short or disconnected from the room.',
      'Assuming a room is complete without placing the minimum furnishings.',
    ],
    confirmed_context: [
      'Nintendo states that a house made from scratch needs four walls at least one block high, a door, and at least three furnishings.',
      'Nintendo also identifies building kits as a way to make structure building easier.',
    ],
    editorial_limits: [
      'This page does not claim a specific material cost, size requirement, or reward because the cited tip does not list them.',
      'Decoration order is practical advice, not an official construction rule.',
    ],
    faqs: [
      { question: 'How many walls does a first house need?', answer: 'Nintendo describes a basic house as four walls, with each wall at least one block high.' },
      { question: 'Do I need a door for a house?', answer: 'Yes. The published construction tip includes adding a door after building the walls.' },
      { question: 'How many furnishings should I place?', answer: 'Place at least three furnishings inside the completed structure.' },
    ],
  }),
  guide('guid050', {
    title: 'How to Use Fast Travel with Your Ditto Home in Pokemon Pokopia',
    seo_title: 'Pokemon Pokopia Ditto Home Fast Travel Guide',
    seo_description: 'Use the Ditto home in Pokemon Pokopia as a quick return point from the main menu, with a simple routine based on Nintendo guidance.',
    slug: 'ditto-home-fast-travel-guide',
    seo_keyword: 'pokemon pokopia ditto home fast travel',
    answer: 'Once you have a Ditto home, Nintendo says you can use the main menu to travel back to a town quickly. Treat it as a return point when you need to reset your plan rather than retracing a long route.',
    content: 'Fast travel is most useful when it closes a loop. Nintendo explains that players can create a home for Ditto and use the main menu to travel back to a town quickly. Use that return option when you have finished a request, gathered what you needed, or want to change your next task.\n\nThe official tip does not give a detailed menu path or a list of every destination, so keep the routine simple: establish the Ditto home, finish the current objective, then use the main menu when returning to town will save time. Avoid treating it as a replacement for exploring a new area; it is a reset tool for a route you have already completed.',
    steps: [
      'Create a home for Ditto before planning it as part of your route.',
      'Finish the nearby request, gathering task, or construction job.',
      'Open the main menu when returning to town is more useful than walking back.',
      'Travel back to town, then sort your next task before leaving again.',
      'Use the return point to keep multi-step errands from becoming a long backtrack.',
    ],
    recommended_setup: [
      'A clear home base for Ditto before starting longer errands.',
      'A short task list so each return to town has a purpose.',
      'Storage and crafting stops planned around your return loop.',
    ],
    common_mistakes: [
      'Opening the menu without first completing the nearby task.',
      'Assuming the cited article confirms every possible destination.',
      'Using a return trip without deciding what to do after reaching town.',
    ],
    confirmed_context: [
      'Nintendo says that creating a home for Ditto lets players travel back to a town quickly from the main menu.',
      'The cited guidance presents this as a way to return to town more easily.',
    ],
    editorial_limits: [
      'The article does not provide a full fast-travel destination list or exact unlock sequence.',
      'Route-planning suggestions on this page are editorial workflow advice.',
    ],
    faqs: [
      { question: 'What does the Ditto home help with?', answer: 'Nintendo describes it as a way to travel back to a town quickly from the main menu.' },
      { question: 'Can I use it before making a Ditto home?', answer: 'The official tip ties the quick return feature to creating a home for Ditto.' },
      { question: 'Should I use it after every small task?', answer: 'Use it when returning to town helps your next plan. That scheduling choice is editorial advice.' },
    ],
  }),
  guide('guid051', {
    title: 'Pokemon Center PC Daily Routine in Pokemon Pokopia',
    seo_title: 'Pokemon Pokopia Pokemon Center PC Guide',
    seo_description: 'Use the Pokemon Center PC in Pokemon Pokopia for daily challenges, shopping, recipes, stamps, and a reliable daily check-in routine.',
    slug: 'pokemon-center-pc-daily-routine',
    seo_keyword: 'pokemon pokopia pokemon center pc daily challenges',
    answer: 'Nintendo identifies the Pokemon Center PC as the place to check daily challenges, browse shop items and recipes, and exchange stamps for Life Coins. A short daily PC check keeps these systems from being forgotten.',
    content: 'The Pokemon Center PC is a practical planning stop, not just a menu to open once. Nintendo says it provides daily challenges, items and recipes in the shop, and stamps that can be exchanged for Life Coins. Make it the first stop before setting out, then decide which task is worth pursuing that day.\n\nKeep the routine small. Check the daily challenge, scan the shop for an item or recipe that matches your current goal, then review your stamps before leaving town. The border of a stamp indicates its rarity according to Nintendo, so it is useful context when deciding whether to exchange it now or wait.',
    steps: [
      'Visit the Pokemon Center PC before starting a longer play session.',
      'Check the daily challenge and decide whether it fits your current plan.',
      'Review shop items and recipes for a useful next purchase.',
      'Look over your stamps and their rarity borders.',
      'Exchange stamps for Life Coins only after you know what you need next.',
    ],
    recommended_setup: [
      'A daily PC check before leaving town.',
      'One active challenge instead of a scattered list of errands.',
      'A note of the recipe or item you are saving Life Coins toward.',
    ],
    common_mistakes: [
      'Ignoring daily challenges until they no longer match the current plan.',
      'Spending stamps before checking available items and recipes.',
      'Treating stamp rarity as a value guarantee rather than useful context.',
    ],
    confirmed_context: [
      'Nintendo says the Pokemon Center PC offers daily challenges, shop items and recipes, and stamp exchanges for Life Coins.',
      'Nintendo notes that a stamp border indicates its rarity.',
    ],
    editorial_limits: [
      'The cited article does not publish a complete shop rotation, price list, or reset schedule.',
      'The suggested order for checking PC features is an editorial routine.',
    ],
    faqs: [
      { question: 'What can I check at the Pokemon Center PC?', answer: 'Nintendo lists daily challenges, items and recipes in the shop, and stamp exchanges for Life Coins.' },
      { question: 'What do stamps do?', answer: 'Nintendo says stamps can be exchanged for Life Coins.' },
      { question: 'What does a stamp border mean?', answer: 'The published tip says the border tells you the stamp rarity.' },
    ],
  }),
  guide('guid052', {
    title: 'How to Organize Storage and Craft Faster in Pokemon Pokopia',
    seo_title: 'Pokemon Pokopia Storage and Crafting Guide',
    seo_description: 'Organize storage in Pokemon Pokopia, sort items with X, and craft from a nearby storage box using Nintendo-published guidance.',
    slug: 'storage-and-crafting-guide',
    seo_keyword: 'pokemon pokopia storage crafting workbench',
    answer: 'Group similar items in storage, use X to sort your bag or storage box, and place storage near a workbench when possible. Nintendo says a nearby storage box can supply crafting materials directly.',
    content: 'Inventory friction turns a short building session into a long search. Nintendo recommends separating similar items into storage boxes and says that pressing X sorts both the bag and a storage box. Start with a few simple categories instead of creating a complicated catalog you will not maintain.\n\nFor crafting areas, put a storage box near the workbench. Nintendo explains that when a storage box is nearby, you can craft with materials kept inside it. That makes a small workshop more useful than a scattered set of containers: bring materials back, sort them, then craft without repeatedly moving items into the bag.',
    steps: [
      'Choose a small set of storage categories, such as building materials and furnishings.',
      'Move similar items into the same storage box.',
      'Use X to sort the bag or the open storage box when it becomes messy.',
      'Place a storage box near your workbench.',
      'Keep common crafting materials in that nearby box.',
      'Craft from the workbench and restock the box after a project.',
    ],
    recommended_setup: [
      'One nearby storage box for frequently used crafting materials.',
      'A separate storage box for furnishings and decoration pieces.',
      'A quick X-sort before starting a large build.',
    ],
    common_mistakes: [
      'Keeping every item in one unsorted storage box.',
      'Putting useful materials far away from the workbench.',
      'Sorting only the bag while leaving storage boxes disorganized.',
    ],
    confirmed_context: [
      'Nintendo says players can press X to sort the bag and storage boxes.',
      'Nintendo says a storage box near a workbench lets players craft with materials inside that box.',
    ],
    editorial_limits: [
      'The cited tip does not define the exact distance needed for a storage box to count as nearby.',
      'Storage categories are editorial suggestions and can be adapted to each player.',
    ],
    faqs: [
      { question: 'How do I sort items?', answer: 'Nintendo says pressing X sorts your bag and storage boxes.' },
      { question: 'Can I craft from stored materials?', answer: 'Nintendo says a storage box near a workbench can provide materials for crafting.' },
      { question: 'What should I store near the workbench?', answer: 'Keep the materials you use most often there. The exact organization is your own planning choice.' },
    ],
  }),
  guide('guid053', {
    title: 'How to Find Pokemon with the Pokedex and Habitat Dex in Pokemon Pokopia',
    seo_title: 'Pokemon Pokopia Pokedex and Habitat Dex Guide',
    seo_description: 'Find Pokemon in Pokemon Pokopia using the Pokedex, Habitat Dex, filters, search functions, and official tips for locating a target.',
    slug: 'pokedex-and-habitat-dex-guide',
    seo_keyword: 'pokemon pokopia pokedex habitat dex find pokemon',
    answer: 'Nintendo recommends using the Pokedex and Habitat Dex filters to identify Pokemon, habitats, specialties, and current-area information. From the Pokedex, select a Pokemon and press + to search for it.',
    content: 'Looking for a specific Pokemon is easier when you use the reference tools before walking around. Nintendo says the Pokedex and Habitat Dex can be filtered with Y to identify specialties, Pokemon or habitats in the current area, and more. Use those filters to narrow the question before spending time on a broad search.\n\nWhen you already know the target, open the Pokedex, select that Pokemon, and press + to search. Nintendo also notes several other leads: talk to local Pokemon, use a Pokemon with Fly or Teleport if available, or put honey on a Pokemon home to encourage it to return. These are complementary options rather than one guaranteed method.',
    steps: [
      'Open the Pokedex or Habitat Dex before beginning a broad search.',
      'Use Y filters to narrow the current area, habitat, or specialty information.',
      'Select the target Pokemon in the Pokedex.',
      'Press + to search for the selected Pokemon.',
      'Talk to nearby Pokemon for additional clues.',
      'Consider Fly, Teleport, or honey at a Pokemon home when those options fit your situation.',
    ],
    recommended_setup: [
      'A specific target selected before leaving town.',
      'Pokedex and Habitat Dex filters used to reduce unnecessary searching.',
      'A backup clue source, such as local Pokemon or a relevant move.',
    ],
    common_mistakes: [
      'Searching an entire area before checking the Pokedex filters.',
      'Treating one search method as a confirmed guarantee.',
      'Ignoring local Pokemon that may provide a lead.',
    ],
    confirmed_context: [
      'Nintendo says the Pokedex and Habitat Dex can use Y filters for specialty, current-area, and related information.',
      'Nintendo says players can select a Pokemon in the Pokedex and press + to search for it.',
    ],
    editorial_limits: [
      'The cited tip does not publish encounter rates, full location tables, or a guarantee that every method will work in every situation.',
      'Choosing which lead to try first is editorial route advice.',
    ],
    faqs: [
      { question: 'How do I search for a selected Pokemon?', answer: 'Nintendo says to select the Pokemon in the Pokedex and press +.' },
      { question: 'What can I filter in the dex tools?', answer: 'Nintendo mentions specialty, Pokemon or habitats in the current area, and related information.' },
      { question: 'Are there other ways to locate a Pokemon?', answer: 'Nintendo suggests talking to Pokemon, using Fly or Teleport, or putting honey on a Pokemon home.' },
    ],
  }),
  guide('guid054', {
    title: 'How to Power Up Ditto Moves with Food in Pokemon Pokopia',
    seo_title: 'Pokemon Pokopia Food Powered Moves Guide',
    seo_description: 'Power up Ditto moves with food in Pokemon Pokopia, including Nintendo guidance on Leafage and terrain-dependent effects.',
    slug: 'food-powered-moves-guide',
    seo_keyword: 'pokemon pokopia food power up ditto moves leafage',
    answer: 'Nintendo says food can power up Ditto moves. The result can depend on the move and the surface, such as using Leafage to create moss on stones or vines on walls.',
    content: 'Food is more than a recovery item in the official beginner tips. Nintendo explains that it can power up Ditto moves, changing what those moves can do in the world. This makes preparation useful: bring food when you expect to work on terrain, construction, or a specific environmental task.\n\nLeafage is the clearest published example. Nintendo says it can create moss on stones and vines on walls when powered up with food. Test the move on the right surface and keep the outcome in mind for future builds. The official article gives examples rather than a full interaction catalog, so do not assume every terrain or move combination behaves the same way.',
    steps: [
      'Bring food before starting a terrain or building task.',
      'Choose the Ditto move that matches the work you want to do.',
      'Use food to power up the move.',
      'Try the powered move on the relevant surface.',
      'For Leafage, compare stone and wall surfaces to the published moss and vine examples.',
      'Keep notes on useful results rather than assuming all surfaces react the same way.',
    ],
    recommended_setup: [
      'Food available before a terrain-focused build session.',
      'A small test area for trying powered move effects.',
      'A clear goal such as adding moss or vines before spending materials.',
    ],
    common_mistakes: [
      'Saving food only for unrelated tasks and overlooking its move effect.',
      'Assuming a powered move creates the same effect on every surface.',
      'Treating the Leafage examples as a complete list of interactions.',
    ],
    confirmed_context: [
      'Nintendo says food can power up Ditto moves.',
      'Nintendo gives Leafage examples: moss on stones and vines on walls.',
    ],
    editorial_limits: [
      'The cited article does not provide a full list of foods, moves, terrain interactions, or numerical effects.',
      'Testing recommendations are editorial practice advice, not an official guarantee.',
    ],
    faqs: [
      { question: 'What does food do for Ditto moves?', answer: 'Nintendo says food can power up Ditto moves.' },
      { question: 'What can powered Leafage do?', answer: 'Nintendo gives examples of creating moss on stones and vines on walls.' },
      { question: 'Will every surface react the same way?', answer: 'The official tip gives examples, not a complete interaction list, so that should not be assumed.' },
    ],
  }),
  guide('guid055', {
    title: 'How to Use Strength for Decoration in Pokemon Pokopia',
    seo_title: 'Pokemon Pokopia Strength Decoration Guide',
    seo_description: 'Use Strength in Pokemon Pokopia to push and pull compatible objects while decorating, based on Nintendo-published beginner tips.',
    slug: 'strength-decoration-guide',
    seo_keyword: 'pokemon pokopia strength push pull decorations',
    answer: 'Nintendo says that holding A while using Strength lets you push or pull certain objects. Use it when adjusting the placement of compatible decoration pieces rather than rebuilding the entire area.',
    content: 'Small placement changes make a home or outdoor build feel intentional. Nintendo notes that when you use Strength, holding A allows you to push or pull certain objects. That makes it a useful adjustment tool for compatible pieces that are close to the right position.\n\nUse Strength after the larger layout is in place. First set the room shape and primary furnishings, then use push and pull adjustments to refine spacing. The official tip does not say that every object can move this way, so treat compatibility as something to check in the game rather than a promise for every decoration.',
    steps: [
      'Finish the broad layout before refining individual object positions.',
      'Use Strength on an object you want to adjust.',
      'Hold A to push or pull the object when it is compatible.',
      'Check the surrounding spacing before making another adjustment.',
      'Use the technique for small layout corrections instead of rebuilding the whole section.',
    ],
    recommended_setup: [
      'A completed rough layout before doing fine adjustments.',
      'Clear walking space around objects you plan to move.',
      'A simple before-and-after check so small changes serve the design.',
    ],
    common_mistakes: [
      'Trying to refine objects before the basic room layout exists.',
      'Assuming every object can be pushed or pulled.',
      'Moving items repeatedly without checking the overall spacing.',
    ],
    confirmed_context: [
      'Nintendo says holding A while using Strength lets players push or pull certain objects.',
      'Nintendo presents this as a helpful tool for decoration.',
    ],
    editorial_limits: [
      'The cited article does not list every compatible object or movement restriction.',
      'The suggested design workflow is editorial advice rather than a required order.',
    ],
    faqs: [
      { question: 'How do I push or pull objects?', answer: 'Nintendo says to hold A while using Strength.' },
      { question: 'Does Strength work on every object?', answer: 'Nintendo says it works on certain objects, so compatibility should be checked in game.' },
      { question: 'When should I use Strength in a build?', answer: 'Use it for small placement refinements after the larger layout is ready.' },
    ],
  }),
  guide('guid056', {
    title: 'How to Customize Items with Berries, Crush, and Smearguru in Pokemon Pokopia',
    seo_title: 'Pokemon Pokopia Item Customization Guide',
    seo_description: 'Customize items in Pokemon Pokopia with berries, a Pokemon with Crush, paint, Smearguru, and official Nintendo guidance.',
    slug: 'item-customization-guide',
    seo_keyword: 'pokemon pokopia item customization berries crush smearguru',
    answer: 'Nintendo says berries can become paint when given to a Pokemon with the Crush specialty. Bring that paint to Smearguru to change item colors or patterns, and learn patterns from the items you find.',
    content: 'Customization works best when you separate collecting from applying. Nintendo says a berry given to a Pokemon with the Crush specialty can be turned into paint. Bring the paint to Smearguru to change the color or pattern of items, then save the combinations that fit your home or build theme.\n\nNintendo also explains that you can learn a pattern by finding an item with it. That gives a clear collection loop: notice a pattern, obtain the item, then use that knowledge when customizing later. The official tip does not set out every berry, paint result, or compatibility rule, so use it as a starting point and verify available options in your own game.',
    steps: [
      'Collect berries you are willing to use for customization.',
      'Find a Pokemon with the Crush specialty.',
      'Give the berry to that Pokemon to turn it into paint.',
      'Bring the paint to Smearguru.',
      'Choose a color or pattern change for the item you want to customize.',
      'Look for patterned items to learn additional patterns over time.',
    ],
    recommended_setup: [
      'A small supply of berries set aside for paint rather than general use.',
      'Access to a Pokemon with the Crush specialty.',
      'A focused color or pattern theme for the items you are updating.',
    ],
    common_mistakes: [
      'Using every berry before deciding which items you want to customize.',
      'Assuming all patterns are available without finding a matching item.',
      'Treating one paint result as proof of every possible color outcome.',
    ],
    confirmed_context: [
      'Nintendo says giving a berry to a Pokemon with the Crush specialty turns it into paint.',
      'Nintendo says Smearguru can change item colors or patterns, and patterns can be learned from items that have them.',
    ],
    editorial_limits: [
      'The cited article does not publish a complete berry-to-paint chart or an item compatibility list.',
      'Theme and resource-planning suggestions are editorial advice.',
    ],
    faqs: [
      { question: 'How do berries become paint?', answer: 'Nintendo says to give a berry to a Pokemon with the Crush specialty.' },
      { question: 'Who changes item colors and patterns?', answer: 'Nintendo identifies Smearguru as the character who can change colors or patterns.' },
      { question: 'How do I learn patterns?', answer: 'Nintendo says you can learn a pattern by finding an item that has it.' },
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
console.log(`Added ${additions.length} source-backed beginner guides.`)
