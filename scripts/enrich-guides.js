const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, ''))
}

const guides = readJson('src/data/guides.json')
const pokemon = readJson('src/data/pokemon.json')
const habitats = readJson('src/data/habitats.json')
const recipes = readJson('src/data/recipes.json')

const pokemonById = new Map(pokemon.map((item) => [item.id, item]))
const habitatById = new Map(habitats.map((item) => [item.id, item]))
const recipeById = new Map(recipes.map((item) => [item.id, item]))

function csv(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function names(ids, lookup, fallback) {
  const values = ids.map((id) => lookup.get(id)?.name || id)
  if (values.length === 0) return fallback
  if (values.length === 1) return values[0]
  return `${values.slice(0, -1).join(', ')} and ${values.at(-1)}`
}

function first(ids, lookup, fallback) {
  return lookup.get(ids[0])?.name || fallback
}

function categoryIntent(category) {
  if (category === 'team') return 'build a reliable team around the core picks'
  if (category === 'farming') return 'repeat the route efficiently without wasting stamina or recipes'
  if (category === 'tier') return 'choose the strongest option for your current progression'
  return 'clear the unlock requirement and farm the area safely'
}

function mainQuestion(guide) {
  const title = guide.title.replace(/\?$/, '')
  if (guide.category === 'team') return `What is the best way to use ${title}?`
  if (guide.category === 'farming') return `What is the fastest route for ${title}?`
  if (guide.category === 'tier') return `What should you pick in ${title}?`
  return `How do you complete ${title}?`
}

function buildGuide(guide, index) {
  const pokemonIds = csv(guide.related_pokemon)
  const habitatIds = csv(guide.related_habitats)
  const recipeIds = csv(guide.related_items)
  const pokemonNames = names(pokemonIds, pokemonById, 'your strongest available Pokemon')
  const habitatNames = names(habitatIds, habitatById, 'the matching habitat')
  const recipeNames = names(recipeIds, recipeById, 'your best available recipe')
  const leadPokemon = first(pokemonIds, pokemonById, 'your lead Pokemon')
  const leadHabitat = first(habitatIds, habitatById, 'the target habitat')
  const leadRecipe = first(recipeIds, recipeById, 'a matching buff recipe')
  const intent = categoryIntent(guide.category)

  const answer = `${guide.title} is mainly about learning when to use ${pokemonNames}, where to focus your time in ${habitatNames}, and which recipe support matters most. The short answer: start with ${leadPokemon}, prepare ${leadRecipe}, then farm or clear ${leadHabitat} until your team can handle the next difficulty jump. This route keeps the guide focused on ${guide.seo_keyword} while giving new players a practical checklist instead of a loose tip.`

  const content = [
    guide.content,
    `Use this page as the working plan for ${guide.seo_keyword}. The goal is to ${intent}, then connect that progress back into the rest of your Pokopia account. For most players, the biggest mistake is rushing into a harder habitat before their core Pokemon, food buff, and weather condition are aligned.`,
    `Before you start, check the related Pokemon and habitat links below. If you already own ${pokemonNames}, prioritize upgrades and skill consistency. If you are missing one of them, spend a short farming session in ${habitatNames} first so the route does not collapse halfway through.`,
  ].join('\n\n')

  const steps = [
    `Confirm the unlock or farming target for ${leadHabitat}, then check whether the listed weather and spawn time match your current session.`,
    `Set ${leadPokemon} as the lead pick and bring backup coverage from ${pokemonNames} so you are not relying on one damage type.`,
    `Prepare ${leadRecipe} before entering the route. Save rare recipes for hard attempts, boss clears, or legendary checks rather than using them on low-value runs.`,
    `Run the route three to five times and track whether you are gaining the expected drops, XP, or rare spawn checks. If results are weak, switch habitat or wait for better weather.`,
    `After each successful run, update your team around the strongest drop or capture. Pokopia progression is faster when each guide page feeds the next build decision.`,
  ]

  const recommendedSetup = [
    `Lead Pokemon: ${leadPokemon} for the first clear or farming loop.`,
    `Backup Pokemon: ${pokemonNames} for type coverage and safer retries.`,
    `Target habitat: ${leadHabitat}, with extra attention to ${habitatNames}.`,
    `Recipe support: ${recipeNames}. Use the buff when the run has a real payoff, not while testing the route.`,
    `Best use case: players searching for "${guide.seo_keyword}" who want a direct route, recommended picks, and mistakes to avoid.`,
  ]

  const commonMistakes = [
    `Entering ${leadHabitat} without checking weather or spawn timing first.`,
    `Spending ${leadRecipe} on short test runs instead of saving it for serious farming windows.`,
    `Ignoring related Pokemon pages, which usually explain drops, food preference, and better habitats.`,
    `Trying to copy an endgame setup before your current team has enough levels, rarity, or role coverage.`,
  ]

  const faqs = [
    {
      question: mainQuestion(guide),
      answer: answer,
    },
    {
      question: `Which Pokemon should I focus on for ${guide.seo_keyword}?`,
      answer: `Start with ${leadPokemon}, then build around ${pokemonNames}. These picks are linked from the guide so you can check habitat, drops, skills, and food preferences before farming.`,
    },
    {
      question: `What is the biggest mistake in this route?`,
      answer: `The biggest mistake is rushing the route without matching your team, recipe, and habitat conditions. Check ${leadHabitat}, prepare ${leadRecipe}, and only spend rare buffs when the run has a clear goal.`,
    },
  ]

  return {
    ...guide,
    content,
    answer,
    steps,
    recommended_setup: recommendedSetup,
    common_mistakes: commonMistakes,
    faqs,
    published_at: `2026-05-${String(Math.min(22, index + 1)).padStart(2, '0')}`,
    updated_at: '2026-05-23',
  }
}

const enriched = guides.map(buildGuide)
const output = `${JSON.stringify(enriched, null, 2)}\n`

fs.writeFileSync(path.join(root, 'src/data/guides.json'), output)
fs.writeFileSync(path.join(root, 'public/data/guides.json'), output)

console.log(`Enriched ${enriched.length} guides.`)
