#!/usr/bin/env node
/**
 * Editorial + SEO auditor for guide pages.
 *
 * Complements the existing check:site scripts. Those verify rendered HTML,
 * metadata plumbing, media rights, and ad-policy compliance. This one reads
 * src/data/guides.json and audits the writing itself: provenance gating,
 * search-intent fit, answer quality, keyword placement, internal linking,
 * cannibalization, and mechanical-prose clusters.
 *
 * Advisory by default (always exits 0) so it can be run on a work in progress.
 * Pass --strict to fail on critical/high findings, e.g. in a pre-publish gate.
 *
 *   node scripts/check-guide-editorial.js
 *   node scripts/check-guide-editorial.js --slug=best-starter-pokemon
 *   node scripts/check-guide-editorial.js --json
 *   node scripts/check-guide-editorial.js --strict --min=high
 */

const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')

const PRIORITIES = ['critical', 'high', 'medium', 'low']

const args = process.argv.slice(2)
const options = {
  slug: (args.find((arg) => arg.startsWith('--slug=')) || '').replace('--slug=', ''),
  json: args.includes('--json'),
  strict: args.includes('--strict'),
  min: (args.find((arg) => arg.startsWith('--min=')) || '--min=low').replace('--min=', ''),
}

if (!PRIORITIES.includes(options.min)) {
  console.error(`Unknown --min value: ${options.min}. Use one of ${PRIORITIES.join(', ')}.`)
  process.exit(2)
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^﻿/, ''))
}

const guides = readJson('src/data/guides.json')
const official = readJson('src/data/official.json')
const pokemon = readJson('src/data/pokemon.json')
const habitats = readJson('src/data/habitats.json')
const recipes = readJson('src/data/recipes.json')
const items = readJson('src/data/items.json')
const materials = readJson('src/data/materials.json')

const pokemonIds = new Set(pokemon.map((entry) => entry.id))
const habitatIds = new Set(habitats.map((entry) => entry.id))
const itemLikeIds = new Set([...recipes, ...items, ...materials].map((entry) => entry.id))

const officialFactText = official
  .flatMap((page) => [page.summary || '', ...(page.facts || []), ...(page.analysis || [])])
  .join(' ')
  .toLowerCase()

const findings = []

function report(priority, area, guide, evidence, why, fix) {
  findings.push({ priority, area, slug: guide.slug || guide.id || '(unknown)', evidence, why, fix })
}

// ---------------------------------------------------------------- text helpers

function words(text) {
  return String(text || '').match(/[\p{L}\p{N}'’-]+/gu) || []
}

function sentences(text) {
  return String(text || '')
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

function list(value) {
  if (Array.isArray(value)) return value.filter((entry) => String(entry || '').trim())
  return []
}

function ids(value) {
  return String(value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function occurrences(haystack, needle) {
  if (!needle) return 0
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return (String(haystack).match(new RegExp(escaped, 'gi')) || []).length
}

function guideProse(guide) {
  return [
    guide.answer,
    guide.content,
    ...list(guide.steps),
    ...list(guide.recommended_setup),
    ...list(guide.common_mistakes),
    ...list(guide.faqs).map((faq) => `${faq.question} ${faq.answer}`),
  ]
    .filter(Boolean)
    .join('\n')
}

// ------------------------------------------------------ provenance and honesty

const SOURCE_BACKED = 'source-backed guide'
const UNVERIFIED = 'unverified editorial guide'

function auditProvenance(guide) {
  const status = String(guide.data_status || '').trim().toLowerCase()

  if (!status) {
    report('critical', 'Provenance', guide, 'data_status is missing',
      'Every guide must declare whether its claims are source-backed or editorial. Missing status lets speculation reach an ad-supported indexable page.',
      `Set data_status to "Source-backed guide" or "Unverified editorial guide".`)
    return
  }

  if (status !== SOURCE_BACKED && status !== UNVERIFIED) {
    report('high', 'Provenance', guide, `unrecognized data_status: "${guide.data_status}"`,
      'Downstream checks and page templates branch on the two known values; a third value silently skips those gates.',
      'Use one of the two established data_status values, or update the templates and checkers together.')
  }

  const sources = list(guide.sources)
  const indexable = String(guide.index_status || '').trim().toLowerCase() === 'indexable'

  if (status === SOURCE_BACKED) {
    if (sources.length === 0) {
      report('critical', 'Provenance', guide, 'data_status is "Source-backed guide" but sources is empty',
        'A source-backed label with no sources is a false trust signal to both readers and reviewers.',
        'Add the primary sources the guide rests on, or relabel it as an unverified editorial guide.')
    }
    if (!String(guide.confirmed_context || '').trim()) {
      report('medium', 'Provenance', guide, 'confirmed_context is missing on a source-backed guide',
        'Readers cannot tell which parts are confirmed by the source and which are inference.',
        'Summarize what the sources actually confirm, separately from the guide’s own recommendations.')
    }
  }

  if (status === UNVERIFIED) {
    if (indexable) {
      report('critical', 'Provenance', guide, 'index_status is "indexable" on an unverified editorial guide',
        'Indexing unverified game facts is the exact pattern that triggers thin/low-value content and ad-policy problems for this site.',
        'Set index_status to "review" until the claims are source-backed, or promote the guide by adding sources.')
    }
    if (!String(guide.editorial_limits || '').trim()) {
      report('high', 'Provenance', guide, 'editorial_limits is missing on an unverified editorial guide',
        'Without a stated limit, speculative mechanics read as confirmed fact.',
        'State plainly what is not yet confirmed and what the reader should verify in game.')
    }
    if (String(guide.data_status_note || '').trim().length < 60) {
      report('high', 'Provenance', guide, `data_status_note is ${String(guide.data_status_note || '').trim().length} chars (checkers require 60+)`,
        'check-content-quality.js fails the build on this; a short note also fails to explain the limitation to readers.',
        'Explain what is unverified, why, and what the reader should do about it.')
    }
  }

  if (indexable && sources.length === 0) {
    report('critical', 'Provenance', guide, 'indexable page with no sources',
      'An indexable page with no sourcing cannot survive a manual quality review.',
      'Add sources before flipping index_status to indexable.')
  }
}

// Hard numbers are the highest-risk claims for an unreleased/新 game.
const NUMERIC_CLAIM = /(?<![\w$])(?:\$\d[\d,.]*|\d[\d,.]*\s?(?:%|GB|MB|hours?|minutes?|days?|weeks?|yen|USD)|\b(?:19|20)\d{2}\b)/gi

function auditClaimRisk(guide) {
  const prose = guideProse(guide)
  const claims = [...new Set((prose.match(NUMERIC_CLAIM) || []).map((claim) => claim.trim()))]
  if (claims.length === 0) return

  const unsupported = claims.filter((claim) => !officialFactText.includes(claim.toLowerCase()))
  const sourced = list(guide.sources).length > 0

  if (unsupported.length > 0 && !sourced) {
    report('high', 'Claim risk', guide, `${unsupported.length} numeric/date claim(s) with no source: ${unsupported.slice(0, 6).join(', ')}`,
      'Prices, dates, percentages, and durations are the claims readers act on and reviewers spot-check first. None of these appear in official.json.',
      'Verify each against an official source and add it to sources, soften to conditional wording, or remove the number.')
  } else if (unsupported.length > 3) {
    report('medium', 'Claim risk', guide, `${unsupported.length} numeric/date claim(s) not found in official.json: ${unsupported.slice(0, 6).join(', ')}`,
      'The guide is sourced, but these specific figures are not traceable to a confirmed fact.',
      'Attribute each figure to a listed source, or mark it as an editorial estimate in editorial_limits.')
  }
}

// --------------------------------------------------------------- SEO mechanics

function auditMetadata(guide) {
  const seoTitle = String(guide.seo_title || guide.title || '').trim()
  const seoDescription = String(guide.seo_description || '').trim()
  const keyword = String(guide.seo_keyword || '').trim()

  if (!String(guide.title || '').trim()) {
    report('critical', 'Title', guide, 'title is missing',
      'The page has no H1 and no usable search result headline.',
      'Write a title that names the specific question the page answers.')
  }

  if (!keyword) {
    report('high', 'Keyword', guide, 'seo_keyword is missing',
      'Without a target query the page has no defined search intent and cannot be checked for cannibalization.',
      'Pick one long-tail query, e.g. "pokopia best habitat for berries" rather than "pokopia".')
  }

  if (seoTitle.length > 70) {
    report('medium', 'Title', guide, `SEO title is ${seoTitle.length} chars`,
      'Titles beyond ~70 chars get truncated in results, cutting off the part that earns the click.',
      'Trim to 45-70 chars, keeping the keyword and the specific benefit.')
  } else if (seoTitle && seoTitle.length < 25) {
    report('low', 'Title', guide, `SEO title is only ${seoTitle.length} chars`,
      'Very short titles waste available result space and usually omit the qualifier that matches intent.',
      'Add the audience, situation, or qualifier that distinguishes this page.')
  }

  if (/^(complete|ultimate|full)\s+guide/i.test(seoTitle) || /\b(complete|ultimate)\s+guide\b/i.test(seoTitle)) {
    report('low', 'Title', guide, `generic title pattern: "${seoTitle}"`,
      'Generic "complete guide" titles compete poorly against titles that state the actual answer.',
      'Replace with the specific outcome or question, unless the page really is comprehensive.')
  }

  if (!seoDescription) {
    report('medium', 'Metadata', guide, 'seo_description is missing',
      'The search snippet falls back to scraped body text, losing control of the click decision.',
      'Write a 55-160 char description naming the value of the page.')
  } else if (seoDescription.length < 55 || seoDescription.length > 160) {
    report('low', 'Metadata', guide, `seo_description is ${seoDescription.length} chars (target 55-160)`,
      'Out-of-range descriptions get truncated or padded by the search engine.',
      'Rewrite to 55-160 chars.')
  }

  if (keyword) {
    const inTitle = occurrences(`${guide.title} ${seoTitle}`, keyword) > 0
    const keywordHead = words(keyword).slice(0, 2).join(' ')
    const inTitleLoose = inTitle || occurrences(`${guide.title} ${seoTitle}`, keywordHead) > 0
    if (!inTitleLoose) {
      report('high', 'Keyword', guide, `keyword "${keyword}" does not appear in the title`,
        'The strongest relevance signal for the target query is missing from the headline.',
        'Work the keyword into the title naturally, or change the keyword to match what the page actually answers.')
    }

    const opening = words(`${guide.answer || ''} ${guide.content || ''}`).slice(0, 100).join(' ')
    if (occurrences(opening, keywordHead) === 0) {
      report('medium', 'Keyword', guide, `keyword "${keyword}" is absent from the first 100 words`,
        'Early keyword placement is what confirms to a reader and a crawler that the page matches the query they arrived on.',
        'Mention the target phrase once in the answer or opening paragraph.')
    }

    const prose = guideProse(guide)
    const total = words(prose).length
    const density = total > 0 ? (occurrences(prose, keyword) * words(keyword).length) / total : 0
    if (density > 0.03) {
      report('medium', 'Keyword', guide, `exact-match keyword density is ${(density * 100).toFixed(1)}%`,
        'Repeating the exact phrase reads as stuffing and displaces the synonyms that actually widen the page’s reach.',
        'Keep 2-4 exact placements and vary the rest with synonyms and related in-game terms.')
    }
  }
}

// --------------------------------------------------------------- answer, depth

function auditAnswerAndDepth(guide) {
  const answerWords = words(guide.answer).length
  if (answerWords === 0) {
    report('high', 'Answer', guide, 'answer is empty',
      'The page has no direct answer block, which is what serves both the impatient reader and the featured snippet.',
      'Add a 30-80 word answer that resolves the title question in the first sentence.')
  } else if (answerWords < 25) {
    report('medium', 'Answer', guide, `answer is ${answerWords} words`,
      'Too short to state the recommendation and its condition, so the reader still has to hunt.',
      'Expand to 30-80 words: the recommendation, who it suits, and the main trade-off.')
  } else if (answerWords > 110) {
    report('low', 'Answer', guide, `answer is ${answerWords} words`,
      'A long answer block stops being a snippet and duplicates the body.',
      'Cut to 30-80 words and move the detail into the body sections.')
  }

  const contentWords = words(guide.content).length
  if (contentWords < 250) {
    report('high', 'Depth', guide, `content is ${contentWords} words`,
      'Thin pages are the main risk at scale: they dilute the site quality signal and struggle to rank for anything.',
      'Add the concrete detail a player needs: prerequisites, the actual route, what varies, and what to do when it fails.')
  }

  const steps = list(guide.steps)
  const mistakes = list(guide.common_mistakes)
  const setup = list(guide.recommended_setup)
  const isProcedural = /^(guides|farming|team)$/i.test(String(guide.category || '')) || /\bhow to\b|\bbest\b/i.test(String(guide.title || ''))

  if (isProcedural && steps.length < 3) {
    report('medium', 'Depth', guide, `${steps.length} step(s) on a procedural guide`,
      'How-to and best-X intent expects an ordered path the reader can follow.',
      'Break the recommendation into at least 3 ordered, checkable steps.')
  }
  if (steps.length > 0 && mistakes.length === 0) {
    report('low', 'Depth', guide, 'steps present but common_mistakes is empty',
      'Failure modes are the part players actually search for after a first attempt fails.',
      'Add 2-3 concrete mistakes and their symptom.')
  }
  if (setup.length === 0 && /^(team|farming|tier)$/i.test(String(guide.category || ''))) {
    report('medium', 'Depth', guide, `recommended_setup is empty on a ${guide.category} guide`,
      'Team, farming, and tier intent is fundamentally "what should I run" — the setup block is the payload.',
      'Add at least one named setup with the reason it works.')
  }

  const faqs = list(guide.faqs)
  if (faqs.length < 3) {
    report('high', 'FAQ', guide, `${faqs.length} FAQ(s)`,
      'check-content-quality.js fails the build below 3, and FAQs are what capture the follow-up long-tail queries.',
      'Add questions covering cost, timing, difficulty, alternatives, and limitations.')
  }
  faqs.forEach((faq, index) => {
    const answer = String(faq.answer || '')
    if (words(answer).length < 15) {
      report('low', 'FAQ', guide, `FAQ ${index + 1} answer is ${words(answer).length} words`,
        'One-line FAQ answers add page length without adding usable information.',
        'Answer in 2-3 sentences: the answer, the condition, the consequence.')
    }
    if (guide.answer && answer && answer.trim() === String(guide.answer).trim()) {
      report('medium', 'FAQ', guide, `FAQ ${index + 1} duplicates the answer block verbatim`,
        'Duplicated text inflates the page without serving a new query.',
        'Rewrite the FAQ to address a genuinely different follow-up question.')
    }
  })
}

// ------------------------------------------------------------ internal linking

function auditInternalLinks(guide) {
  const related = {
    related_pokemon: { values: ids(guide.related_pokemon), known: pokemonIds, label: 'pokemon' },
    related_habitats: { values: ids(guide.related_habitats), known: habitatIds, label: 'habitat' },
    related_items: { values: ids(guide.related_items), known: itemLikeIds, label: 'item/recipe/material' },
  }

  const populated = Object.values(related).filter((entry) => entry.values.length > 0).length
  if (populated === 0) {
    report('high', 'Internal links', guide, 'no related pokemon, habitats, or items',
      'The internal linking rule is the site’s main SEO mechanism; an unlinked guide is a dead end for both crawlers and readers.',
      'Link every entity the guide actually names.')
  } else if (populated < 2) {
    report('medium', 'Internal links', guide, `only ${populated} of 3 related-entity fields populated`,
      'Sparse linking limits how much authority flows between the guide and the wiki entries it depends on.',
      'Add the other entity types the guide references.')
  }

  for (const [field, entry] of Object.entries(related)) {
    const dangling = entry.values.filter((id) => !entry.known.has(id))
    if (dangling.length > 0) {
      report('high', 'Internal links', guide, `${field} references unknown ${entry.label} id(s): ${dangling.join(', ')}`,
        'Dangling ids render as broken or empty related-content links.',
        `Fix the id or remove it from ${field}.`)
    }
  }

  const prose = guideProse(guide)
  const namedPokemon = pokemon.filter((entry) => entry.name && occurrences(prose, entry.name) > 0)
  const linkedPokemon = new Set(ids(guide.related_pokemon))
  const unlinked = namedPokemon.filter((entry) => !linkedPokemon.has(entry.id))
  if (unlinked.length > 2) {
    report('medium', 'Internal links', guide, `names ${unlinked.length} unlinked pokemon: ${unlinked.slice(0, 6).map((entry) => entry.name).join(', ')}`,
      'Entities mentioned in the body but missing from related_pokemon lose the link that would carry the reader to the wiki entry.',
      'Add the mentioned pokemon to related_pokemon, or drop the passing mention.')
  }
}

// -------------------------------------------------- mechanical-prose detection
// Cluster-based on purpose: a single hit is style, a cluster is a template.

const MECHANICAL_PATTERNS = [
  { name: 'significance inflation', re: /\b(?:marks? a (?:major|significant) (?:shift|milestone)|represents? a (?:major|significant)|game[- ]chang(?:er|ing)|revolutioni[sz]|paradigm shift|in the (?:ever[- ]evolving|fast[- ]paced) world of|when it comes to)\b/gi },
  { name: 'unsupported superlative', re: /\b(?:best[- ]in[- ]class|world[- ]class|cutting[- ]edge|state[- ]of[- ]the[- ]art|unparalleled|seamlessly|effortlessly|truly (?:unique|remarkable))\b/gi },
  { name: 'vague attribution', re: /\b(?:experts? (?:say|agree|believe)|(?:industry|community) (?:reports?|consensus) (?:show|suggest)|many players (?:agree|report)|it is widely (?:known|believed))\b/gi },
  { name: 'not-just-X-but-Y', re: /\bnot (?:just|only) [^.,;]{2,40}(?:,? but (?:also )?)/gi },
  { name: 'ceremonial transition', re: /\b(?:moreover|furthermore|additionally|in conclusion|to sum up|that said|at the end of the day|it(?:'|’)s worth noting that|delve into)\b/gi },
  { name: 'generic future close', re: /\b(?:exciting possibilit|bright future|changing landscape|only time will tell|the possibilities are endless|whatever your playstyle)\b/gi },
  { name: 'chatbot artifact', re: /\b(?:i hope this helps|let me know if|feel free to|as an ai|happy (?:gaming|hunting|farming))\b/gi },
]

function auditProse(guide) {
  const prose = guideProse(guide)
  if (!prose.trim()) return

  const hits = MECHANICAL_PATTERNS
    .map((pattern) => ({ name: pattern.name, matches: [...new Set((prose.match(pattern.re) || []).map((match) => match.trim()))] }))
    .filter((hit) => hit.matches.length > 0)

  const totalHits = hits.reduce((sum, hit) => sum + hit.matches.length, 0)
  const distinctClusters = hits.length

  if (distinctClusters >= 3 || totalHits >= 5) {
    const detail = hits.map((hit) => `${hit.name} (${hit.matches.slice(0, 3).join('; ')})`).join(' | ')
    report('medium', 'Prose', guide, `${totalHits} mechanical-phrase hits across ${distinctClusters} pattern(s): ${detail}`,
      'Clustered template phrasing is what makes a page read as generated rather than written for a player, and it displaces concrete detail.',
      'Run the humanization pass in references/humanization.md: state the concrete fact, drop the ceremony, keep every verified claim.')
  }

  const openings = sentences(prose).map((sentence) => words(sentence).slice(0, 2).join(' ').toLowerCase()).filter(Boolean)
  const openingCounts = openings.reduce((accumulator, opening) => {
    accumulator[opening] = (accumulator[opening] || 0) + 1
    return accumulator
  }, {})
  const repeated = Object.entries(openingCounts).filter(([, count]) => count >= 4)
  if (repeated.length > 0) {
    report('low', 'Prose', guide, `repeated sentence openings: ${repeated.map(([opening, count]) => `"${opening}" x${count}`).join(', ')}`,
      'Uniform sentence openings flatten the rhythm and signal templated generation.',
      'Vary the openings; lead some sentences with the concrete noun or the condition.')
  }

  const bulletGroups = [list(guide.steps).length, list(guide.recommended_setup).length, list(guide.common_mistakes).length].filter(Boolean)
  if (bulletGroups.length >= 3 && bulletGroups.every((count) => count === 3)) {
    report('low', 'Prose', guide, 'every list has exactly 3 items',
      'Forced symmetry across every list is a generation artifact; real guidance has uneven amounts to say.',
      'Use the number of items the subject warrants.')
  }
}

// ------------------------------------------------------- cross-guide conflicts

function auditCorpus(scoped) {
  const byKeyword = new Map()
  for (const guide of guides) {
    const keyword = String(guide.seo_keyword || '').trim().toLowerCase()
    if (!keyword) continue
    if (!byKeyword.has(keyword)) byKeyword.set(keyword, [])
    byKeyword.get(keyword).push(guide)
  }

  const scopedSlugs = new Set(scoped.map((guide) => guide.slug))
  for (const [keyword, group] of byKeyword) {
    if (group.length < 2) continue
    for (const guide of group) {
      if (!scopedSlugs.has(guide.slug)) continue
      report('high', 'Cannibalization', guide, `seo_keyword "${keyword}" is shared with: ${group.filter((other) => other.slug !== guide.slug).map((other) => other.slug).join(', ')}`,
        'Two pages targeting one query split their own signals and neither wins it. This compounds as the page count grows.',
        'Give each page a distinct long-tail query, or consolidate them into one page and redirect.')
    }
  }

  const seenTitles = new Map()
  for (const guide of guides) {
    const normalized = words(guide.title).join(' ').toLowerCase()
    if (!normalized) continue
    if (!seenTitles.has(normalized)) seenTitles.set(normalized, [])
    seenTitles.get(normalized).push(guide.slug)
  }
  for (const [title, slugs] of seenTitles) {
    if (slugs.length < 2) continue
    for (const slug of slugs) {
      if (!scopedSlugs.has(slug)) continue
      report('high', 'Duplication', { slug }, `duplicate title "${title}" also used by: ${slugs.filter((other) => other !== slug).join(', ')}`,
        'Identical titles are treated as duplicate pages and confuse readers scanning a category listing.',
        'Differentiate the titles or merge the pages.')
    }
  }
}

// ------------------------------------------------------------------------- run

const scoped = options.slug ? guides.filter((guide) => guide.slug === options.slug) : guides

if (options.slug && scoped.length === 0) {
  console.error(`No guide found with slug "${options.slug}".`)
  process.exit(2)
}

for (const guide of scoped) {
  auditProvenance(guide)
  auditClaimRisk(guide)
  auditMetadata(guide)
  auditAnswerAndDepth(guide)
  auditInternalLinks(guide)
  auditProse(guide)
}
auditCorpus(scoped)

const minIndex = PRIORITIES.indexOf(options.min)
const filtered = findings
  .filter((finding) => PRIORITIES.indexOf(finding.priority) <= minIndex)
  .sort((a, b) => PRIORITIES.indexOf(a.priority) - PRIORITIES.indexOf(b.priority) || a.slug.localeCompare(b.slug))

const counts = PRIORITIES.reduce((accumulator, priority) => {
  accumulator[priority] = filtered.filter((finding) => finding.priority === priority).length
  return accumulator
}, {})

if (options.json) {
  console.log(JSON.stringify({ audited: scoped.length, counts, findings: filtered }, null, 2))
} else {
  console.log(`Guide editorial audit — ${scoped.length} guide(s) audited, ${filtered.length} finding(s).`)
  console.log(PRIORITIES.map((priority) => `${priority}: ${counts[priority]}`).join('  |  '))

  let currentSlug = null
  for (const finding of filtered) {
    if (finding.slug !== currentSlug) {
      currentSlug = finding.slug
      console.log(`\n## ${currentSlug}`)
    }
    console.log(`- [${finding.priority.toUpperCase()}] ${finding.area}: ${finding.evidence}`)
    console.log(`  why: ${finding.why}`)
    console.log(`  fix: ${finding.fix}`)
  }

  if (filtered.length === 0) console.log('\nNo findings at or above the requested priority.')
}

const blocking = counts.critical + counts.high
if (options.strict && blocking > 0) {
  console.error(`\nStrict mode: ${blocking} critical/high finding(s) must be resolved before publishing.`)
  process.exit(1)
}
