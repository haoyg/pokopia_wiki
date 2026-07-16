const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const sourcePath = path.join(root, 'src/data/news.json')
const publicPath = path.join(root, 'public/data/news.json')
const news = JSON.parse(fs.readFileSync(sourcePath, 'utf8').replace(/^\uFEFF/, ''))

const coreUpdates = {
  'pokopia-dive-update-how-to-unlock-dive': {
    confirmed_facts: [
      'The official Pokémon Pokopia update page lists the underwater exploration update for August 2026.',
      'The update is available to everyone who owns Pokémon Pokopia.',
      'Dive lets Ditto move underwater.',
      'Learning Dive requires the “Raise the environment level!” request in Bleak Beach, the ability to jump, and Surf.',
    ],
    reader_takeaways: [
      'Treat August 2026 as a release window, not a confirmed day, until the official page provides one.',
      'Keep the free Dive update separate from the paid Bubbly Basin Expansion Pass when planning a purchase.',
      'Do not rely on this page for underwater spawn, reward, or route details until an official source or documented testing supports them.',
    ],
    data_status_note: 'This is a reviewed official-source update. Confirmed facts are limited to the linked Pokémon page; route advice and future underwater details remain outside its scope.',
  },
  'pokopia-expansion-pass-bubbly-basin-bonuses': {
    confirmed_facts: [
      'Pokémon Pokopia Expansion Pass is paid DLC available through Nintendo eShop.',
      'Part 1, Bubbly Basin, is listed for August 2026.',
      'Starting Bubbly Basin requires the “Raise the environment level!” request in Bleak Beach and the Dive move from the free update.',
      'The Expansion Pass includes a recipe for dynamic Ditto print blocks and wallpaper.',
      'The official page lists Part 2 for late 2026 and Part 3 for 2027.',
    ],
    reader_takeaways: [
      'Free Dive access is a prerequisite for this paid DLC, but the update itself is not DLC.',
      'Check your regional Nintendo eShop before treating bonus eligibility or availability as universal.',
      'Use Nintendo’s claim instructions for bonus recipes and codes instead of relying on screenshots or reposts.',
    ],
    data_status_note: 'This is a reviewed official-source DLC summary. Dates, purchase bonuses, claim steps, and regional availability must be rechecked against Nintendo before purchase.',
  },
  'pokemon-pokopia-wish-upon-a-jirachi-event': {
    title: 'Pokémon Pokopia Wish Upon a Jirachi Event: Archived Official Details',
    seo_title: 'Pokémon Pokopia Jirachi Event: Archived Details',
    seo_description: 'Archived official details for Pokémon Pokopia’s Wish Upon a Jirachi event, including its June 23 to July 8, 2026 schedule, requirements, and limitations.',
    excerpt: 'This official Wish Upon a Jirachi event ran from June 23 through July 8, 2026. This page preserves the confirmed requirements, rewards context, and multiplayer limitations.',
    content: 'Nintendo’s Wish Upon a Jirachi event ran from June 23 at 5:00 a.m. through July 8, 2026 at 4:59 a.m., based on the Nintendo Switch 2 system clock. The event is now archived on Pokopia Portal; this page should not be used as a current event listing.\n\nDuring the event, Nintendo said players could befriend Jirachi, receive a wish note recipe, fulfill Pokémon requests, and exchange shining wish notes for star-themed furniture and other event items. It required Pokémon Pokopia Version 1.1.0 or later, an internet connection on first start, and completion of important town requests through rebuilding the Pokémon Center.\n\nThe official announcement also limited the event to towns and Palette Town. It did not occur on Cloud Islands, and Palette Town multiplayer required Spectator Mode to be off. Keep those limits attached to the archived event rather than using them as a general rule for every future event.',
    verified_status: 'Archived official event announcement',
    confirmed_facts: [
      'Nintendo listed the event from June 23 at 5:00 a.m. through July 8, 2026 at 4:59 a.m., based on the system clock.',
      'Nintendo required Version 1.1.0 or later, internet access on first start, and progression through rebuilding the Pokémon Center.',
      'The event did not occur on Cloud Islands.',
      'Palette Town multiplayer participation required Spectator Mode to be off.',
    ],
    reader_takeaways: [
      'The scheduled period has ended, so do not plan a current route around this event without a new official announcement.',
      'Use this page as a record of Nintendo’s event requirements and limitations, not as a prediction of a rerun.',
      'Future event pages should be updated to archived status as soon as their official end time has passed.',
    ],
    data_status_note: 'Archived after the official July 8, 2026 end time. The article preserves source-backed historical details and does not claim that the event is currently available.',
  },
  'nintendo-switch-2-pokemon-pokopia-bundle-singapore': {
    confirmed_facts: [
      'Nintendo Singapore lists a Nintendo Switch 2 + Pokémon Pokopia bundle for July 23, 2026.',
      'The regional bundle includes a full-game download of Pokémon Pokopia.',
      'Nintendo Account and internet access are required to download the included game.',
      'Nintendo says the Expansion Pass is not included with the hardware bundle.',
    ],
    reader_takeaways: [
      'This is a Singapore-specific announcement; do not apply its date, stock, price, or contents to another region.',
      'Check whether a local retailer is selling a hardware bundle or a separate software-and-DLC bundle before buying.',
      'Use the source link for the current package list because hardware offers can change without affecting game content.',
    ],
    data_status_note: 'This is a reviewed regional product announcement. It is not a global availability page and must not be used to infer another territory’s bundle, price, or stock.',
  },
  'pokemon-pokopia-pc-requests-daily-challenges': {
    confirmed_facts: [
      'Nintendo recommends checking the Pokémon Center PC for daily challenges, a shop, recipes, and stamps exchangeable for Life Coins.',
      'Nintendo says talking to befriended Pokémon can lead to additional requests.',
      'Nintendo’s tips describe building a home for Ditto as a way to unlock quick travel back to a town from the main menu.',
      'Nintendo recommends using Pokédex and Habitat Dex filters to identify specialties, local Pokémon, and habitat-building targets.',
    ],
    reader_takeaways: [
      'This page supports a practical daily check-in routine without inventing reward rates or optimal shop schedules.',
      'Use the official tips as a baseline, then record personal route preferences separately as editorial notes.',
      'Check current in-game menus after updates because daily challenges, shop inventory, and requests can change.',
    ],
    data_status_note: 'This is a reviewed official-source tips summary. It distinguishes Nintendo’s stated systems from player-specific route and resource recommendations.',
  },
  'pokemon-pokopia-confirmed-moves-leafage-surf-glide': {
    confirmed_facts: [
      'Nintendo identifies Bulbasaur’s Leafage, Lapras’s Surf, and Dragonite’s Glide as examples of moves that change how Ditto explores or builds.',
      'Nintendo describes Pokémon Pokopia as a game where Pokémon moves can expand traversal and building options.',
      'The official Pokémon site frames screenshots and game footage as development material that is not final.',
    ],
    reader_takeaways: [
      'Use the official examples as a starting point for exploration and building questions, not as a complete move list.',
      'Do not turn a trailer example into a claim about exact stamina, damage, unlock order, or every Pokémon’s move set.',
      'Route pages should link to this update when they need confirmed move context, then separate any personal testing from official facts.',
    ],
    data_status_note: 'This is a reviewed official-source system summary. It intentionally stays narrow: confirmed move examples are separated from unverified move lists, balance claims, and route advice.',
  },
}

let updated = 0
for (const item of news) {
  const update = coreUpdates[item.slug]
  if (!update) continue
  Object.assign(item, update, { updated_at: '2026-07-16' })
  updated += 1
}

if (updated !== Object.keys(coreUpdates).length) {
  throw new Error(`Expected ${Object.keys(coreUpdates).length} source updates, updated ${updated}.`)
}

const output = `${JSON.stringify(news, null, 2)}\n`
fs.writeFileSync(sourcePath, output)
fs.writeFileSync(publicPath, output)
console.log(`Enriched ${updated} core official-source updates.`)
