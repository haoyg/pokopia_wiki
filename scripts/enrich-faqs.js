const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
function readJson(file) { return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^﻿/, '')) }

const guides = readJson('src/data/guides.json')
const pokemon = readJson('src/data/pokemon.json')
const habitats = readJson('src/data/habitats.json')
const recipes = readJson('src/data/recipes.json')

const pokemonById = new Map(pokemon.map(p => [p.id, p]))
const habitatById = new Map(habitats.map(h => [h.id, h]))

function addFaqs(guide, newFaqs) {
  const existingQuestions = new Set((guide.faqs || []).map(f => f.question))
  newFaqs.forEach(faq => {
    if (!existingQuestions.has(faq.question)) {
      guide.faqs.push(faq)
    }
  })
  // Move main question first
  const mainFaq = guide.faqs.find(f =>
    f.question.toLowerCase().includes('how to') ||
    f.question.toLowerCase().includes('what is') && f.question.length < 60
  )
  if (mainFaq && guide.faqs.indexOf(mainFaq) > 0) {
    guide.faqs = [mainFaq, ...guide.faqs.filter(f => f !== mainFaq)]
  }
}

// Process each guide
guides.forEach(guide => {
  const pkIds = (guide.related_pokemon || '').split(',').filter(Boolean)
  const habIds = (guide.related_habitats || '').split(',').filter(Boolean)
  const recIds = (guide.related_items || '').split(',').filter(Boolean)

  const relatedPokemon = pkIds.map(id => pokemonById.get(id)).filter(Boolean)
  const relatedHabitats = habIds.map(id => habitatById.get(id)).filter(Boolean)

  const pkName = relatedPokemon[0]?.name || guide.title.split(' ')[2] || 'this Pokemon'
  const habName = relatedHabitats[0]?.name || 'the target habitat'
  const difficulty = relatedHabitats[0]?.difficulty || 'medium'
  const weather = relatedHabitats[0]?.weather || 'any weather'
  const rarity = relatedPokemon[0]?.rarity || 'common'
  const type = relatedPokemon[0]?.type || 'the Pokemon type'
  const specialty = relatedPokemon[0]?.specialty || 'the role'
  const resource = relatedHabitats[0]?.resource_bonus || 'none'
  const food = relatedPokemon[0]?.favorite_food || 'its preferred bait'

  // ---- Catch guides ----
  if (guide.slug.includes('catch-guide')) {
    addFaqs(guide, [
      {
        question: `What team partners work best with ${pkName}?`,
        answer: `${pkName} is a ${rarity} ${type} ${specialty}. It pairs best with Pokemon that cover its type weaknesses. Check the ${habName} habitat page to see which Pokemon spawn alongside it and can fill complementary roles in your team.`
      },
      {
        question: `When is the best time to farm ${pkName}?`,
        answer: `${rarity === 'common' ? 'Farm ' + pkName + ' as soon as you access ' + habName : rarity === 'uncommon' ? 'Target ' + pkName + ' during mid-game once you have a stable team and can survive ' + habName : 'Commit to farming ' + pkName + ' only after reaching ' + habName + ' reliably with a full team'}. Use scout runs to learn the spawn location before spending ${food}.`
      },
      {
        question: `What recipes synergize with ${pkName} for ${specialty.toLowerCase()} builds?`,
        answer: `Recipes that boost ${type} spawn rates or ${specialty.toLowerCase()} effectiveness pair best with ${pkName}. Check the recipe page for buffs matching ${pkName}'s role. Save rare attraction bait for confirmed spawn encounters, not scout runs.`
      },
      {
        question: `How does ${pkName} compare to other ${type} Pokemon?`,
        answer: `${pkName} is a ${rarity} ${type} ${specialty}. ${rarity === 'legendary' ? 'As a legendary, it outperforms common and uncommon ' + type + ' options in stats and material drops.' : rarity === 'rare' ? 'As a rare, it is worth prioritizing over common ' + type + ' options for long-term build planning.' : 'As a common ' + type + ' option, it is most valuable early before upgrading to rarer alternatives.'} Compare it on the wiki page before committing to a farming schedule.`
      },
      {
        question: `What mistakes happen most often when catching ${pkName}?`,
        answer: `The most common mistakes are: entering ${habName} outside ${weather} weather, using the wrong bait for ${pkName}, and spending attraction items on scout runs instead of confirmed encounters. Set a weather check before every run and have a clear exit rule.`
      }
    ])
  }

  // ---- Unlock guides ----
  else if (guide.slug.includes('how-to-unlock')) {
    addFaqs(guide, [
      {
        question: `What is the fastest way to clear ${habName}?`,
        answer: `${habName} is ${difficulty} difficulty. Speed comes from knowing the route layout, matching weather to spawn conditions, and having a team built for the ${difficulty === 'easy' ? 'short forgiving routes' : difficulty === 'medium' ? 'moderate-length branching paths' : 'long demanding encounters'}. Run the habitat 2-3 times to learn the layout before optimizing.`
      },
      {
        question: `What Pokemon should I prioritize after unlocking ${habName}?`,
        answer: `Focus first on the Pokemon that appear most consistently in the early spawn section of ${habName}. Check the habitat page for the full spawn list and prioritize Pokemon that fill gaps in your current team. ${resource !== 'none' ? 'The resource bonus (' + resource + ') also makes specific farming runs more efficient — factor that into your priority list.' : ''}`
      },
      {
        question: `What is the biggest risk when first entering ${habName}?`,
        answer: `${difficulty === 'easy' ? 'Not checking the weather before entering — spawn rates drop significantly outside ' + weather + ' conditions.' : difficulty === 'medium' ? 'Underestimating route length and running out of healing items before completing the clear.' : 'Entering without a full team and proper preparation — hard habitats punish incomplete teams severely.'} Always confirm weather, bring appropriate supplies, and set an exit rule before entering.`
      },
      {
        question: `How does ${habName} compare to nearby habitats?`,
        answer: `${habName} is a ${difficulty} habitat with ${weather} weather and ${resource !== 'none' ? resource : 'no special resource bonus'}. Easier habitats offer less rarity but higher consistency. Harder habitats give better rewards but require more preparation. Use the habitat comparison on the wiki to decide which to prioritize based on your current goals.`
      }
    ])
  }

  // ---- Team guides ----
  else if (guide.category === 'team') {
    const teamType = relatedPokemon[0]?.type || 'the type'
    addFaqs(guide, [
      {
        question: `What is the biggest mistake in ${teamType} team builds?`,
        answer: `Filling every slot with ${teamType} type Pokemon instead of covering type weaknesses. A good ${teamType.toLowerCase()} team needs defensive backup, utility roles, and coverage for resistances that pure ${teamType} typing cannot handle. Check the related habitat pages for Pokemon that complement your core without breaking the type theme.`
      },
      {
        question: `What recipes work best with ${teamType} teams?`,
        answer: `${teamType} teams work best with recipes that boost the team's primary role. Damage-oriented ${teamType} teams benefit from burst or damage buff recipes. Defensive teams need sustain and armor recipes. Check the recipe page for buffs that align with your team's specific role composition.`
      },
      {
        question: `How many ${teamType} Pokemon do I need before starting this build?`,
        answer: `Start the build when you have 3 confirmed ${teamType} Pokemon with different roles (Tank, Attacker, Support or similar). The remaining slots should cover type weaknesses and provide utility. Commit to a full ${teamType.toLowerCase()} build only after the core is stable.`
      }
    ])
  }

  // ---- Farming guides ----
  else if (guide.category === 'farming') {
    addFaqs(guide, [
      {
        question: `How many runs before judging if a farming route is efficient?`,
        answer: `Judge a route over 5-10 runs minimum. Spawn variance and weather windows affect individual runs significantly. Track drops per hour across sessions — if it still feels inefficient after 10 runs with correct conditions, check whether a better habitat or weather window exists on the related habitat page.`
      },
      {
        question: `Should I use rare attraction bait on every run?`,
        answer: `No. Use rare bait only on confirmed spawn encounters. Run the habitat 1-2 times without bait first to verify the Pokemon is actually present in the current weather. Wasting rare bait on wrong branches or empty windows is the most common farming efficiency mistake.`
      },
      {
        question: `What is the correct exit rule for farming runs?`,
        answer: `Set a specific exit condition before entering: a number of runs, a material quantity, or a weather change. Never continue past your exit condition chasing a drop. Fatigue and sunk-cost thinking are the biggest farming traps — a clear rule prevents both.`
      }
    ])
  }

  // ---- Tier / top lists ----
  else if (guide.category === 'tier' || guide.title.toLowerCase().includes('top')) {
    addFaqs(guide, [
      {
        question: `Does ranking change as new Pokemon or updates release?`,
        answer: `Tier rankings reflect the current meta based on confirmed stats, spawn rates, and build viability. As new Pokemon, habitats, or balance updates release, rankings can shift. Check the last updated date on this page and cross-reference with the latest news for confirmed meta changes.`
      },
      {
        question: `Should I always pick the top-ranked option?`,
        answer: `No. Top rankings reflect overall strength in the current meta, but the best choice for your account depends on your team composition, available habitats, and progression stage. Use tier rankings as a guide for long-term investment, not a replacement for situational judgment.`
      },
      {
        question: `How do tier rankings relate to farming difficulty?`,
        answer: `Higher-ranked Pokemon are not always harder to farm — some of the strongest Pokemon appear in easy habitats with common spawn rates. Check each Pokemon's habitat page for actual spawn conditions. A legendary in an easy habitat may be faster to farm than a rare in a hard one.`
      }
    ])
  }

  // ---- General guides (all other types) ----
  else {
    addFaqs(guide, [
      {
        question: `What is the biggest trap in this guide's approach?`,
        answer: `Treating the advice as a rigid formula instead of a starting framework. Real progress requires adjusting based on your team strength, current level, and available resources. Use the related Pokemon and habitat links to fill in specifics that this guide can only generalize about.`
      },
      {
        question: `How long before this strategy shows results?`,
        answer: `Most strategies show measurable results within 5-10 runs when conditions are met (correct weather, appropriate team, right recipe timing). If results feel slow after 10 attempts, a key condition is usually being missed — recheck the related habitat pages for spawn window, bait timing, or team matchup details.`
      },
      {
        question: `What if this strategy stops working?`,
        answer: `Re-examine: weather pattern shifts, team level mismatch, or progression to harder content before mastering the current habitat. Revisit the related habitat and Pokemon data to find what changed. Do not force a broken strategy — reset the approach and rebuild from confirmed conditions.`
      }
    ])
  }
})

fs.writeFileSync(path.join(root, 'src/data/guides.json'), JSON.stringify(guides, null, 2))
fs.writeFileSync(path.join(root, 'public/data/guides.json'), JSON.stringify(guides, null, 2))

let totalFaqs = guides.reduce((s, g) => s + (g.faqs || []).length, 0)
let avg = (totalFaqs / guides.length).toFixed(1)
console.log(`Done. ${guides.length} guides. Total FAQs: ${totalFaqs}. Average: ${avg}/guide.`)
guides.forEach(g => console.log(g.faqs.length, '|', g.slug))
