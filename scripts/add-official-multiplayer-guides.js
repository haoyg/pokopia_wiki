const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const sources = [
  {
    label: 'Nintendo News: How multiplayer works in Pokemon Pokopia',
    url: 'https://www.nintendo.com/us/whatsnew/heres-how-multiplayer-works-in-pokemon-pokopia/',
  },
  {
    label: 'Nintendo Store: Pokemon Pokopia product page',
    url: 'https://www.nintendo.com/us/store/products/pokemon-pokopia-switch-2/',
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
    data_status_note: 'This source-backed guide is limited to multiplayer details published by Nintendo as of July 16, 2026. Connection requirements, compatibility, unlock timing, and session behavior can change, so check Nintendo before arranging a session.',
    source_notes: [
      'Primary evidence comes from Nintendo News, which separates town visits, Palette Town, GameShare, Cloud Island, and Virtual Mode.',
      'Nintendo Store product information is included for current GameShare session and online-feature requirements.',
    ],
    sources,
    index_status: 'indexable',
    ...details,
  }
}

const additions = [
  guide('guid057', {
    title: 'How to Invite Friends to Visit Your Town in Pokemon Pokopia',
    seo_title: 'Pokemon Pokopia Town Visit Multiplayer Guide',
    seo_description: 'Invite up to three friends to visit a Pokemon Pokopia town through Link Play, understand Spectator Mode, and use the visit for discovery.',
    slug: 'town-visit-multiplayer-guide',
    seo_keyword: 'pokemon pokopia invite friends town visit link play',
    answer: 'Use the Pokemon Center PC, choose Link Play, then Invite Others to Visit and select an online or local connection. Nintendo says up to three friends can join, and standard town visits use Spectator Mode.',
    content: 'A town visit is for sharing and discovering, not for open-ended editing. Nintendo says to start from a town Pokemon Center PC: choose Link Play, then Invite Others to Visit, followed by an online or local connection. Online hosts create a Link Code, while local connections can use a Link Code or proceed without one.\n\nNintendo says the Link Play menu becomes available after approximately 30 minutes of play. Once visitors arrive, everyone is in Spectator Mode. That protects the host town from changes while still allowing visitors to see creations, collect daily items from the PC, and log Pokemon and habitat information into their Pokedex. If your goal is collaborative building, plan a Palette Town session instead of a normal town visit.',
    steps: [
      'Play until the Pokemon Center PC has access to the Link Play menu.',
      'At the town Pokemon Center PC, select Link Play.',
      'Choose Invite Others to Visit.',
      'Select an online or local connection.',
      'For online play, share the generated Link Code with up to three friends.',
      'Use the visit for showing the town, photos, discovery, and Pokedex progress.',
      'Switch to Palette Town when the group wants to build or craft together.',
    ],
    recommended_setup: [
      'A finished area worth showing before sending invitations.',
      'A shared goal such as Pokedex discovery or taking screenshots.',
      'A Link Code ready for an online session.',
    ],
    common_mistakes: [
      'Expecting standard town visitors to be able to edit the host town.',
      'Trying to open Link Play before its initial availability period.',
      'Using a town visit when the actual goal is collaborative construction.',
    ],
    confirmed_context: [
      'Nintendo says town invitations begin from the Pokemon Center PC through Link Play and Invite Others to Visit.',
      'Nintendo says online hosts can invite up to three other friends, and standard visits use Spectator Mode.',
      'Nintendo says the Link Play menu becomes accessible after approximately 30 minutes of play.',
    ],
    editorial_limits: [
      'The cited article does not guarantee network performance or availability in every region.',
      'Choosing a session goal and visit order is editorial planning advice.',
    ],
    faqs: [
      { question: 'How many friends can visit my town?', answer: 'Nintendo says an online host can invite up to three other friends.' },
      { question: 'Can visitors edit my town?', answer: 'Nintendo says town visits use Spectator Mode, which limits actions and protects creations.' },
      { question: 'When does Link Play unlock?', answer: 'Nintendo says the Pokemon Center PC Link Play menu is available after approximately 30 minutes of play.' },
    ],
  }),
  guide('guid058', {
    title: 'Palette Town and GameShare Guide for Pokemon Pokopia',
    seo_title: 'Pokemon Pokopia Palette Town GameShare Guide',
    seo_description: 'Build together in Pokemon Pokopia Palette Town, turn off Spectator Mode, and understand Nintendo-published GameShare compatibility boundaries.',
    slug: 'palette-town-gameshare-guide',
    seo_keyword: 'pokemon pokopia palette town gameshare multiplayer',
    answer: 'Palette Town is Nintendo\'s shared building area: invite friends through Link Play and turn off Spectator Mode at the Palette Town PC to build, craft, discover Pokemon, and make habitats together. GameShare can share Palette Town with people who do not own the game, subject to Nintendo\'s system and session requirements.',
    content: 'Palette Town is the official answer to “can we build together?” Nintendo describes it as a large sandbox area accessible from the Withered Wasteland after playing for a while. Friends are invited using the same general Link Play process, but the Palette Town Pokemon Center PC can turn Spectator Mode off. That is the key difference from a normal town visit: the group can build, craft, discover Pokemon, and make habitats together.\n\nNintendo also says GameShare can share Palette Town with people who do not own Pokemon Pokopia. Locally, Nintendo describes support for another Nintendo Switch 2 or Nintendo Switch system. Online GameShare is described for players with Nintendo Switch 2 systems. The current Nintendo notes also say that a Switch 2 must initiate a GameShare session, shared software ends with the session, and online GameShare has GameChat, internet, account, and Nintendo Switch Online requirements. Check the official pages immediately before organizing the session, especially when systems differ.',
    steps: [
      'Reach Palette Town from the Withered Wasteland after progressing far enough to access it.',
      'Use Link Play to invite the friends who will join the build session.',
      'At the Palette Town Pokemon Center PC, turn Spectator Mode off when the group is ready to collaborate.',
      'Agree on a small construction or habitat goal before everyone starts placing objects.',
      'Use GameShare only after checking which systems and connection type the session will use.',
      'Review Nintendo\'s current GameShare requirements again before an online session.',
    ],
    recommended_setup: [
      'One small shared build goal with a clear owner or area for each player.',
      'A host using Nintendo Switch 2 for any GameShare session.',
      'A systems-and-connection check before inviting people who do not own the game.',
    ],
    common_mistakes: [
      'Treating Palette Town as identical to a standard town visit.',
      'Turning off Spectator Mode before agreeing what the group will build.',
      'Assuming local and online GameShare have the same hardware requirements.',
      'Assuming shared GameShare software remains playable after the session ends.',
    ],
    confirmed_context: [
      'Nintendo says Palette Town can turn Spectator Mode off, enabling shared building, crafting, Pokemon discovery, and habitat creation.',
      'Nintendo says GameShare can share Palette Town with people who do not own the game.',
      'Nintendo distinguishes local GameShare support from online GameShare system requirements and says a Switch 2 initiates the session.',
    ],
    editorial_limits: [
      'Nintendo\'s availability, system, GameChat, account, and subscription terms can change and must be rechecked before play.',
      'Build-coordination suggestions are editorial advice, not game rules.',
    ],
    faqs: [
      { question: 'Can friends build together in Palette Town?', answer: 'Yes. Nintendo says Spectator Mode can be turned off in Palette Town so the group can build, craft, discover Pokemon, and make habitats together.' },
      { question: 'Can someone without the game join Palette Town?', answer: 'Nintendo says GameShare can share Palette Town with people who do not own the game, subject to current compatibility requirements.' },
      { question: 'Does online GameShare work the same as local GameShare?', answer: 'No. Nintendo distinguishes the supported systems and session requirements, so check the official guide before setting up either mode.' },
    ],
  }),
  guide('guid059', {
    title: 'Cloud Island and Virtual Mode Guide for Pokemon Pokopia',
    seo_title: 'Pokemon Pokopia Cloud Island Guide',
    seo_description: 'Create or visit a Pokemon Pokopia Cloud Island, understand shared progress and item limits, and use Virtual Mode to protect a published island.',
    slug: 'cloud-island-virtual-mode-guide',
    seo_keyword: 'pokemon pokopia cloud island virtual mode',
    answer: 'Cloud Island is Nintendo\'s persistent online shared area. Create or visit one from a Pokemon Center PC using its address; it has its own Pokedex, rewards, and challenges, and items do not transfer between a town and a Cloud Island. Virtual Mode lets others visit without changing it.',
    content: 'Cloud Island is different from an invitation-based visit because it stays online for people to visit even when the original host is away. Nintendo says it has its own Pokedex and shared Pokemon Center PC rewards and challenges. Create or visit one from a Pokemon Center PC, and use the Cloud Island address when joining an existing island.\n\nPlan it as a separate shared project. Nintendo explicitly says items in your town bag cannot move to Cloud Island or back, so do not arrive expecting a town inventory to carry over. When you want people to look around without changing the work, turn on Virtual Mode. Nintendo describes this as a virtual version of the island that visitors can enjoy while being unable to make changes.',
    steps: [
      'Decide whether the group needs a persistent shared area rather than a host-led visit.',
      'Use a Pokemon Center PC to create a Cloud Island or visit one by address.',
      'Confirm the group understands that Cloud Island has its own Pokedex, rewards, and challenges.',
      'Plan materials and tasks inside the island instead of relying on a town bag transfer.',
      'Turn off Spectator Mode only when the collaborators are ready to edit together.',
      'Use Virtual Mode when you want visitors to explore without changing the island.',
    ],
    recommended_setup: [
      'A written Cloud Island address shared only with intended visitors.',
      'A separate project plan that accounts for the island\'s independent item boundary.',
      'Virtual Mode enabled for showcase sessions where edits are not wanted.',
    ],
    common_mistakes: [
      'Treating a Cloud Island as if it shared the town bag inventory.',
      'Sharing an address without deciding whether visitors should be allowed to edit.',
      'Confusing Virtual Mode with a regular collaborative Cloud Island session.',
    ],
    confirmed_context: [
      'Nintendo says Cloud Island is a persistent online area with its own Pokedex, rewards, and challenges.',
      'Nintendo says Cloud Island creation and visits use a Pokemon Center PC and an address for visits.',
      'Nintendo says town bag items cannot transfer to or from a Cloud Island, and Virtual Mode blocks visitor changes.',
    ],
    editorial_limits: [
      'The cited article does not define every address-sharing, moderation, or availability scenario.',
      'Project-management recommendations are editorial advice, not official rules.',
    ],
    faqs: [
      { question: 'Does Cloud Island stay available when the host is away?', answer: 'Nintendo describes Cloud Island as a persistent online area that visitors can come and go from without the host being present.' },
      { question: 'Can I bring town items to Cloud Island?', answer: 'No. Nintendo says items in your town bag cannot be brought to Cloud Island or back.' },
      { question: 'What does Virtual Mode do?', answer: 'Nintendo says it lets people visit a virtual version of a Cloud Island without being able to change it.' },
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
console.log(`Added ${additions.length} source-backed multiplayer guides.`)
