const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, ''))
}

function writeJson(file, data) {
  fs.writeFileSync(path.join(root, file), `${JSON.stringify(data, null, 2)}\n`)
}

const additions = [
  {
    id: 'news014',
    title: 'Pokemon Pokopia Sableye Gem Hunt: Archived Official Details',
    seo_title: 'Pokemon Pokopia Sableye Gem Hunt: Archived Details',
    seo_description: 'Archived official details for Pokemon Pokopia’s Sableye Gem Hunt, including its April 29 to May 14, 2026 schedule, Dream Island route, and town-only limitation.',
    slug: 'pokemon-pokopia-sableye-gem-hunt-archived',
    category: 'event',
    excerpt: 'Sableye’s Gem Hunt ran from April 29 through May 14, 2026 in local time. This archived page preserves Nintendo’s confirmed event route, town requirement, and Cloud Island limitation.',
    content: 'Nintendo’s Sableye Gem Hunt ran from April 29 at 5:00 a.m. until May 14, 2026 at 4:59 a.m. local time. The event has ended, so this page is an archived record rather than a current event guide. Nintendo said that players could befriend Sableye, collect event-only red crystal fragments, and exchange them for gem-hunt-inspired furniture and other items.\n\nThe official route began by talking to Sableye near the Pokemon Center. Players then examined a doll so Drifloon could take them to a Dream Island, where red crystal fragments could be collected. The fragments could be traded at the Pokemon Center for items including building kits and furniture.\n\nNintendo limited the event to towns where the Pokemon Center had been repaired. It did not occur on Cloud Island. Nintendo also said that Pokemon befriended through this event remained in town after the event ended. Keep that as a historical event detail, not as a guarantee for a future rerun.',
    source_label: 'Nintendo: Join Sableye’s Gem Hunt in Pokemon Pokopia',
    source_url: 'https://www.nintendo.com/us/whatsnew/join-sableyes-gem-hunt-in-pokemon-pokopia/',
    source_type: 'Official',
    verified_status: 'Archived official event announcement',
    published_at: 1777420800,
    image_url: '',
    image_alt: '',
    image_source: '',
    image_source_url: '',
    related_pokemon: '',
    related_habitats: '',
    related_guides: 'pokemon-center-pc-daily-routine,comfortable-pokemon-spaces-guide',
    source_review_notes: [
      'Primary source: Nintendo’s official Sableye Gem Hunt announcement.',
      'The event schedule and route are preserved as historical details only because the official end date has passed.',
    ],
    claim_limits: [
      'Do not present this as a current event or infer that it will return.',
      'Do not add drop rates, reward quantities, or Dream Island rules not stated by Nintendo.',
    ],
    recheck_triggers: [
      'Nintendo announces a rerun, revised schedule, or new regional event page.',
      'Nintendo corrects the original event conditions or reward description.',
    ],
    confirmed_facts: [
      'Nintendo listed the event from April 29 at 5:00 a.m. through May 14, 2026 at 4:59 a.m. local time.',
      'Nintendo said players could befriend Sableye and collect event-only red crystal fragments on a Dream Island.',
      'Nintendo said fragments could be exchanged at the Pokemon Center for building kits, furniture, and other items.',
      'The event required a repaired Pokemon Center in a town and did not occur on Cloud Island.',
    ],
    reader_takeaways: [
      'The event has ended; do not plan a current route around its materials or rewards without a new official announcement.',
      'The archived route is useful for understanding how Nintendo scoped a town-only event and its Cloud Island restriction.',
      'Sableye befriended during the original event was stated to remain in town after the event ended.',
    ],
    data_status_note: 'Archived after Nintendo’s May 14, 2026 end time. This source-backed record preserves confirmed historical details and does not claim that the event or its red crystal fragments are currently available.',
    updated_at: '2026-07-16',
  },
  {
    id: 'news015',
    title: 'Pokemon Pokopia More Spores for Hoppip: Archived Official Details',
    seo_title: 'Pokemon Pokopia Hoppip Event: Archived Details',
    seo_description: 'Archived official details for Pokemon Pokopia’s More Spores for Hoppip event, including its March 2026 schedule, Pokemon Center requirement, and Cloud Island restriction.',
    slug: 'pokemon-pokopia-more-spores-for-hoppip-archived',
    category: 'event',
    excerpt: 'More Spores for Hoppip ran from March 9 through March 24, 2026. This archived record preserves Nintendo’s confirmed cotton spore objective, repaired Pokemon Center requirement, and Cloud Island limitation.',
    content: 'Nintendo’s More Spores for Hoppip event ran from March 9 at 1:00 p.m. PT through March 24, 2026 at 12:59 p.m. PT. The event has ended, and this page is retained as a source-backed archive rather than a current event listing. Nintendo said players could collect cotton spores during the event to become friends with Hoppip, Skiploom, and Jumpluff.\n\nThe official launch article also set two important boundaries: the event occurred only in towns where the Pokemon Center had been repaired, and it did not occur on Cloud Island. Those conditions describe this specific event and should not be generalized to every future event.\n\nUse this page as historical context for Nintendo’s early event structure, not as a prediction of a rerun or a live reward list. A new official announcement would be needed before treating cotton spores, the friendship targets, or the time window as currently available.',
    source_label: 'Nintendo: Pokemon Pokopia available now launch article',
    source_url: 'https://www.nintendo.com/us/whatsnew/shape-the-world-and-build-a-cozy-new-life-in-pokemon-pokopia-available-now/',
    source_type: 'Official',
    verified_status: 'Archived official event announcement',
    published_at: 1773010800,
    image_url: '',
    image_alt: '',
    image_source: '',
    image_source_url: '',
    related_pokemon: '',
    related_habitats: '',
    related_guides: 'pokemon-request-planning-guide,pokemon-center-pc-daily-routine',
    source_review_notes: [
      'Primary source: Nintendo’s official Pokemon Pokopia launch article.',
      'The event is archived because the source’s March 24, 2026 end time is in the past.',
    ],
    claim_limits: [
      'Do not claim that cotton spores, friendship targets, or rewards are currently obtainable.',
      'Do not apply this event’s repaired-Pokemon-Center and Cloud Island conditions to all future events.',
    ],
    recheck_triggers: [
      'Nintendo announces a rerun, replacement event, or revised participation rules.',
      'Nintendo updates the launch article with a correction to the event schedule or conditions.',
    ],
    confirmed_facts: [
      'Nintendo listed the event from March 9 at 1:00 p.m. PT through March 24, 2026 at 12:59 p.m. PT.',
      'Nintendo said players could collect cotton spores to become friends with Hoppip, Skiploom, and Jumpluff.',
      'Nintendo said the event occurred only in towns where the Pokemon Center had been repaired.',
      'Nintendo said the event did not occur on Cloud Island.',
    ],
    reader_takeaways: [
      'The scheduled event has ended, so it should not be used as a live event recommendation.',
      'This record clarifies the specific town and Cloud Island boundaries that applied to the Hoppip event.',
      'A current official event announcement is required before planning around cotton spores or these friendship targets.',
    ],
    data_status_note: 'Archived after Nintendo’s March 24, 2026 end time. This source-backed record preserves the announced schedule and participation limits without claiming that the event is currently active.',
    updated_at: '2026-07-16',
  },
]

const news = readJson('src/data/news.json')
const existingSlugs = new Set(news.map((item) => item.slug))
const duplicate = additions.find((item) => existingSlugs.has(item.slug))

if (duplicate) {
  throw new Error(`News slug already exists: ${duplicate.slug}`)
}

const updated = [...news, ...additions]
writeJson('src/data/news.json', updated)
writeJson('public/data/news.json', updated)
console.log(`Added ${additions.length} archived official event articles.`)
