const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const sourcePath = path.join(root, 'src/data/pokemon.json')
const publicPath = path.join(root, 'public/data/pokemon.json')
const pokemon = JSON.parse(fs.readFileSync(sourcePath, 'utf8').replace(/^\uFEFF/, ''))
const habitats = JSON.parse(fs.readFileSync(path.join(root, 'src/data/habitats.json'), 'utf8').replace(/^\uFEFF/, ''))
const habitatsById = new Map(habitats.map((habitat) => [habitat.id, habitat.name]))

function splitList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function naturalList(items) {
  if (items.length === 0) return 'no drops'
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`
}

function sentenceCase(value) {
  const cleaned = String(value || '').trim().replace(/[.]+$/, '')
  return cleaned ? `${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}` : ''
}

function habitatLabel(entry) {
  return habitatsById.get(entry.habitat) || entry.habitat || 'the listed habitat'
}

function foodAnswer(entry, index) {
  const food = entry.favorite_food || 'the listed food'
  const habitat = habitatLabel(entry)
  const variations = [
    `${entry.name}'s current reference entry lists ${food} as its preferred food. Use that detail to plan a ${habitat} visit, then confirm the page's time and weather notes before spending limited resources.`,
    `This page records ${food} as ${entry.name}'s preferred food. Treat it as a route-planning note rather than a guaranteed result, and recheck the habitat conditions after any game update.`,
    `For the route documented here, ${food} is listed as ${entry.name}'s preferred food. Match it with the ${habitat} conditions shown above instead of committing items during a first scouting run.`,
  ]
  return variations[index % variations.length]
}

function dropsAnswer(entry, index) {
  const drops = naturalList(splitList(entry.drops))
  const habitat = habitatLabel(entry)
  const variations = [
    `The current reference entry lists ${drops} as ${entry.name}'s drops. Farm ${habitat} only when those materials support a named upgrade, recipe, or team goal.`,
    `${entry.name}'s listed drops are ${drops}. It is usually more efficient to stop once the material you need is secured than to turn the run into an unfocused full clear.`,
    `This page records ${drops} as the materials associated with ${entry.name}. Check the route conditions before repeating a farm, because drop and spawn details can change after balance updates.`,
  ]
  return variations[index % variations.length]
}

function mistakesAnswer(entry, index) {
  const mistakes = splitList(entry.common_mistakes)
  const selected = mistakes.slice(0, 3).map(sentenceCase).filter(Boolean)
  const summary = naturalList(selected)
  const habitat = habitatLabel(entry)
  const endings = [
    `Keep the ${habitat} run focused on one goal, then leave when that goal is met.`,
    `A short route plan and a clear exit rule prevent most wasted resources.`,
    `Before repeating the route, identify which of those decisions caused the previous run to fail.`,
  ]
  return `Players most often lose value by ${summary}. ${endings[index % endings.length]}`
}

let changed = 0
pokemon.forEach((entry, entryIndex) => {
  entry.faqs = (entry.faqs || []).map((faq) => {
    let answer = faq.answer
    if (faq.question === `What food attracts ${entry.name}?`) answer = foodAnswer(entry, entryIndex)
    if (faq.question === `What does ${entry.name} drop?`) answer = dropsAnswer(entry, entryIndex)
    if (faq.question === `What mistakes do players make with ${entry.name}?`) answer = mistakesAnswer(entry, entryIndex)

    if (answer !== faq.answer) changed += 1
    return { ...faq, answer }
  })
})

const output = `${JSON.stringify(pokemon, null, 2)}\n`
fs.writeFileSync(sourcePath, output)
fs.writeFileSync(publicPath, output)
console.log(`Polished ${changed} Pokemon FAQ answers across ${pokemon.length} entries.`)
