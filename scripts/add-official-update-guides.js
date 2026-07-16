const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const sources = [
  {
    label: 'Pokemon Pokopia: Free Update and Dive',
    url: 'https://pokopia.pokemon.com/en-us/update/',
  },
  {
    label: 'Pokemon Pokopia: Expansion Pass and Bubbly Basin',
    url: 'https://pokopia.pokemon.com/en-us/expansion/',
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
    data_status_note: 'This guide reflects official update and Expansion Pass pages reviewed on July 16, 2026. The official pages describe August 2026 content, so availability, requirements, and bonus terms must be rechecked once the update releases or a regional store page changes.',
    source_notes: [
      'Primary evidence comes from the official Pokemon Pokopia update and Expansion Pass pages.',
      'This guide distinguishes the free Dive update from paid Bubbly Basin DLC and does not infer release-day behavior beyond the published information.',
    ],
    sources,
    index_status: 'indexable',
    ...details,
  }
}

const additions = [
  guide('guid060', {
    title: 'How to Prepare to Unlock Dive in Pokemon Pokopia',
    seo_title: 'Pokemon Pokopia Dive Unlock Requirements',
    seo_description: 'Prepare for the Pokemon Pokopia Dive update by completing the Bleak Beach request and confirming Jump and Surf before the official August 2026 release.',
    slug: 'dive-unlock-requirements-guide',
    seo_keyword: 'pokemon pokopia how to unlock dive bleak beach',
    answer: 'The official update page says Dive requires completing the “Raise the environment level!” request in Bleak Beach, plus the ability to jump and the move Surf. The page lists the free update for August 2026, so prepare these prerequisites before it arrives.',
    content: 'Dive is presented as a free underwater-exploration update, but the official page also gives three prerequisites. Before the update is available, complete the Bleak Beach request called “Raise the environment level!”, confirm that you can jump, and make sure Ditto knows Surf. That is the complete requirement set published on the current update page.\n\nTreat this as a preparation checklist, not a promise that all new underwater content is part of the base game. The official page says Dive lets Ditto move freely underwater and links it to Bubbly Basin in the paid Expansion Pass. Finish the listed prerequisites now, then check the official page again once the August 2026 update goes live for any changed wording or release notes.',
    steps: [
      'Open the official update page and confirm the current availability wording for your region.',
      'Complete the “Raise the environment level!” request in Bleak Beach.',
      'Confirm that the jump ability is available in your game.',
      'Confirm that Ditto knows Surf.',
      'After the free update releases, learn Dive and test underwater movement.',
      'Keep paid Bubbly Basin access separate from the free Dive preparation checklist.',
    ],
    recommended_setup: [
      'Bleak Beach progress sufficient to complete the named request.',
      'Jump and Surf confirmed before the update arrives.',
      'A final check of the official update page on release day.',
    ],
    common_mistakes: [
      'Assuming Dive is usable before the listed August 2026 update window.',
      'Forgetting that Surf and jumping are separate prerequisites.',
      'Treating Bubbly Basin DLC access as a free-update feature.',
    ],
    confirmed_context: [
      'The official update page lists a free underwater-exploration update for August 2026.',
      'The official page says Dive requires the Bleak Beach “Raise the environment level!” request, jumping, and Surf.',
      'The official page says Dive lets Ditto move freely underwater.',
    ],
    editorial_limits: [
      'The published page does not list an exact update-day time, file size, or regional rollout schedule.',
      'The checklist order is editorial planning advice; only the named requirements are official.',
    ],
    faqs: [
      { question: 'Is Dive part of a free update?', answer: 'Yes. The official update page describes Dive as part of a free update listed for August 2026.' },
      { question: 'What do I need before learning Dive?', answer: 'Nintendo and Pokemon official guidance lists the Bleak Beach request, the ability to jump, and Surf.' },
      { question: 'Does unlocking Dive give Bubbly Basin access?', answer: 'No. Bubbly Basin is described separately as paid Expansion Pass DLC with additional requirements.' },
    ],
  }),
  guide('guid061', {
    title: 'Bubbly Basin Expansion Pass Access Guide for Pokemon Pokopia',
    seo_title: 'Pokemon Pokopia Bubbly Basin Access Guide',
    seo_description: 'Understand Bubbly Basin Expansion Pass access in Pokemon Pokopia: paid DLC, the Bleak Beach request, Dive, and the official August 2026 window.',
    slug: 'bubbly-basin-expansion-access-guide',
    seo_keyword: 'pokemon pokopia bubbly basin expansion pass requirements',
    answer: 'Bubbly Basin is part 1 of the paid Pokemon Pokopia Expansion Pass, listed for August 2026. The official Expansion Pass page says you need to complete “Raise the environment level!” in Bleak Beach and learn Dive from the free update before starting it.',
    content: 'Bubbly Basin should be planned as paid DLC, not as an ordinary new area from the free update. The official Expansion Pass page identifies it as Part 1 of the paid Expansion Pass and lists an August 2026 release window. It also repeats the Bleak Beach request requirement and adds Dive as the prerequisite that comes from the free update.\n\nThe practical order is therefore simple: verify the paid DLC for your region, finish the Bleak Beach request, complete the free-update Dive requirements, and only then start Bubbly Basin. The current page describes the area as an underwater town to develop. It does not publish a full quest list, resource table, or completion time, so keep expectations limited to what is officially stated until more release information is available.',
    steps: [
      'Confirm that the Pokemon Pokopia Expansion Pass is available for your region and account.',
      'Complete the Bleak Beach “Raise the environment level!” request.',
      'Install the free update when it becomes available and learn Dive.',
      'Open the Expansion Pass content only after those requirements are met.',
      'Check the official Expansion Pass page again for release timing and any revised terms.',
      'Treat Bubbly Basin as a separate underwater development project from the base-game town.',
    ],
    recommended_setup: [
      'A verified Expansion Pass purchase for the intended Nintendo Account and region.',
      'Dive already learned through the free update.',
      'A short first-session goal rather than assumptions about the complete DLC scope.',
    ],
    common_mistakes: [
      'Confusing the free Dive update with the paid Bubbly Basin DLC.',
      'Buying or opening DLC before completing the named base-game prerequisites.',
      'Assuming the official page confirms all upcoming areas or Part 2 and Part 3 details.',
    ],
    confirmed_context: [
      'The official Expansion Pass page describes Bubbly Basin as Part 1 of paid DLC, listed for August 2026.',
      'The official page requires the Bleak Beach “Raise the environment level!” request and Dive before the DLC can begin.',
      'The official page describes Bubbly Basin as an underwater town to develop.',
    ],
    editorial_limits: [
      'Regional price, availability, and account conditions should be confirmed through the relevant official store before purchase.',
      'The page does not publish a full DLC quest list, item table, or completion estimate.',
    ],
    faqs: [
      { question: 'Is Bubbly Basin free?', answer: 'No. The official Expansion Pass page describes Bubbly Basin as paid DLC.' },
      { question: 'Do I need Dive for Bubbly Basin?', answer: 'Yes. The official page says you need Dive, in addition to the named Bleak Beach request.' },
      { question: 'When is Bubbly Basin listed to release?', answer: 'The official Expansion Pass page lists Part 1: Bubbly Basin for August 2026. Check the page again for current regional availability.' },
    ],
  }),
  guide('guid062', {
    title: 'Pokemon Pokopia Expansion Pass Bonus Claim Guide',
    seo_title: 'Pokemon Pokopia Expansion Pass Bonus Guide',
    seo_description: 'Claim Pokemon Pokopia Expansion Pass bonuses using the Downloadable Content menu and track the official Pokemetal ingot purchase window and code deadline.',
    slug: 'expansion-pass-bonus-claim-guide',
    seo_keyword: 'pokemon pokopia expansion pass bonus claim recipe pokemetal',
    answer: 'The official Expansion Pass page says purchasers can claim a dynamic Ditto print blocks and wallpaper recipe through Main Menu > Downloadable Content > Check Items > Receive. It also lists a separate 30 rare Pokemetal ingot code offer with purchase and redemption deadlines.',
    content: 'Keep the two published Expansion Pass bonuses separate because they are claimed differently. The official page gives a direct in-game path for the recipe: press + for the main menu, select Downloadable Content, choose Check Items, then Receive. The recipe is for dynamic Ditto print blocks and wallpaper.\n\nThe 30 rare Pokemetal ingot offer has additional terms. The official page says an Expansion Pass purchase by August 31, 2027 sends a code to the Nintendo Account email address; the code is valid through September 30, 2027 and is redeemed through the in-game Mystery Gift feature. An internet connection is required to claim the bonus. Recheck the official page and your regional purchase record before relying on any promotion, because bonuses and dates can change.',
    steps: [
      'Confirm that the Expansion Pass purchase is attached to the intended Nintendo Account.',
      'Press + to open the main menu.',
      'Select Downloadable Content, then Check Items.',
      'Select Receive to claim the dynamic Ditto print blocks and wallpaper recipe.',
      'For the Pokemetal offer, check the Nintendo Account email associated with the purchase for the code.',
      'Redeem the code through Mystery Gift before the official code deadline and while connected to the internet.',
    ],
    recommended_setup: [
      'Access to the Nintendo Account email used for the Expansion Pass purchase.',
      'An internet-connected Nintendo Switch 2 for online bonus redemption.',
      'A saved record of the purchase date and code deadline.',
    ],
    common_mistakes: [
      'Looking for the recipe in Mystery Gift instead of the Downloadable Content menu.',
      'Assuming the Pokemetal code arrives in-game rather than at the purchase email address.',
      'Missing the purchase or redemption deadline because the two dates are different.',
    ],
    confirmed_context: [
      'The official page gives the menu path Downloadable Content, Check Items, then Receive for the dynamic Ditto print blocks and wallpaper recipe.',
      'The official page lists a 30 rare Pokemetal ingot code for eligible Expansion Pass purchases by August 31, 2027.',
      'The official page says that code is valid through September 30, 2027 and requires an internet connection to claim the bonus.',
    ],
    editorial_limits: [
      'Bonus eligibility, store availability, regional terms, and delivery timing should be verified on the official page and purchase record.',
      'This page does not replace Nintendo Account support for missing codes or redemption errors.',
    ],
    faqs: [
      { question: 'Where do I claim the Expansion Pass recipe?', answer: 'Nintendo lists this path: Main Menu, Downloadable Content, Check Items, then Receive.' },
      { question: 'How do I get the Pokemetal code?', answer: 'The official page says the code is emailed to the Nintendo Account email address used for an eligible Expansion Pass purchase.' },
      { question: 'What are the published Pokemetal offer dates?', answer: 'The official page lists purchase by August 31, 2027 and code validity through September 30, 2027. Recheck the current official terms before purchase.' },
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
console.log(`Added ${additions.length} source-backed update guides.`)
