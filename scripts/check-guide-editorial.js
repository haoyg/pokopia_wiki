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
// src/app/guides/[slug]/page.tsx resolves related_items against recipes only.
// item/material ids would silently render nothing, so they are treated as dangling.
const recipeIds = new Set(recipes.map((entry) => entry.id))
const otherEntityIds = new Set([...items, ...materials].map((entry) => entry.id))

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

// Mirrors src/lib/indexing.ts. Kept in sync deliberately: the auditor must judge
// pages by the indexability the site actually ships, not by index_status alone.
const NO_INDEX_FLAGS = ['draft', 'placeholder', 'thin', 'ai draft', 'needs review', 'noindex', 'future', 'unverified', 'editorial']

function isExplicitlyNoindex(guide) {
  const combined = `${guide.data_status || ''} ${guide.index_status || ''}`.toLowerCase()
  return NO_INDEX_FLAGS.some((flag) => combined.includes(flag))
}

function isIndexable(guide) {
  const status = String(guide.data_status || '')
  const hasGuideStatus = !status || /\bguide$/i.test(status)
  const reviewDate = guide.updated_at || guide.published_at
  const hasValidDate = Boolean(reviewDate) && !Number.isNaN(new Date(reviewDate).getTime())
  return hasGuideStatus && hasValidDate && !isExplicitlyNoindex(guide)
}

const KNOWN_STATUSES = ['source-backed guide', 'reference guide', 'unverified editorial guide']

function auditProvenance(guide) {
  const status = String(guide.data_status || '').trim().toLowerCase()
  const sources = list(guide.sources)
  const indexable = isIndexable(guide)

  if (!status) {
    report('critical', 'Provenance', guide, 'data_status is missing',
      'The page renders no DataStatus badge, and an empty status still passes isIndexableGuide — so an unlabeled page ships as indexable.',
      'Set data_status to "Source-backed guide", "Reference guide", or a status containing a noindex flag word.')
    return
  }

  if (!KNOWN_STATUSES.includes(status)) {
    report('high', 'Provenance', guide, `unrecognized data_status: "${guide.data_status}"`,
      'isIndexableGuide only holds a page back when the status contains a flag word from src/lib/indexing.ts. An unplanned status silently inherits indexable.',
      'Use an established status, or add its flag word to noIndexFlags if it is meant to stay out of the index.')
  }

  if (status === 'source-backed guide' && sources.length === 0) {
    report('critical', 'Provenance', guide, 'data_status claims "Source-backed guide" but sources is empty',
      'The page prints a source-backed badge with nothing to back it. On an ad-supported site this is the exact claim a manual reviewer checks first, and there is no citation to show them.',
      'Add the sources it actually rests on. If the source was a third-party wiki rather than an official page, relabel to "Reference guide" and record the real origin in data_status_note.')
  }

  if (status === 'reference guide' && sources.length === 0) {
    report('medium', 'Provenance', guide, '"Reference guide" with no sources',
      'Reference pages state mechanics as fact. Without a source the reader has no way to tell a confirmed mechanic from an inferred one.',
      'Cite the official page for the mechanic, or record in editorial_limits which parts are unconfirmed.')
  }

  if (indexable && sources.length === 0) {
    report('high', 'Provenance', guide, 'page is indexable (per isIndexableGuide) with no sources',
      'Indexable unsourced pages are what drove this site to build the review/quarantine workflow in the first place.',
      'Add sources, or move the page out of the index by using a data_status/index_status value containing a noIndexFlags word.')
  }

  if (sources.length > 0 && list(guide.confirmed_context).length === 0) {
    report('medium', 'Provenance', guide, 'sources present but confirmed_context is empty',
      'Readers cannot separate what the source actually confirms from what the guide infers around it.',
      'List the specific statements the sources confirm, in the source’s own scope.')
  }

  if (sources.length > 0 && list(guide.editorial_limits).length === 0) {
    report('medium', 'Provenance', guide, 'sources present but editorial_limits is empty',
      'Every sourced guide in this corpus adds practical advice beyond the source. Unmarked, that advice reads as officially confirmed.',
      'State what the page deliberately does not claim, as the existing sourced guides do.')
  }

  const note = String(guide.data_status_note || '').trim()
  if (/\bguide$/i.test(String(guide.data_status || '')) && note.length < 60) {
    report('high', 'Provenance', guide, `data_status_note is ${note.length} chars; check-content-quality.js requires 60+`,
      'This fails npm run build, and a one-line note does not actually explain the limitation to a reader.',
      'Explain what is and is not confirmed, and what the reader should verify in game.')
  }
}

// ------------------------------------------------------------- text hygiene

function auditTextHygiene(guide) {
  const title = String(guide.title || '')
  const prose = guideProse(guide)

  const entityFields = [['title', title], ['content', String(guide.content || '')], ['answer', String(guide.answer || '')]]
  for (const [field, value] of entityFields) {
    const entities = [...new Set(value.match(/&(?:amp|lt|gt|quot|apos|nbsp|#\d+);/g) || [])]
    if (entities.length > 0) {
      report('high', 'Text hygiene', guide, `raw HTML entities in ${field}: ${entities.join(', ')}`,
        'React escapes these, so the reader sees the literal "&amp;" in the headline and the search snippet.',
        'Decode the entities to real characters in the source data.')
    }
  }

  if (/�/.test(prose + title)) {
    report('high', 'Text hygiene', guide, 'contains the U+FFFD replacement character',
      'A replacement character is a decoding failure that reached the page — usually a mangled é, —, or quote.',
      'Restore the intended character and re-save the JSON as UTF-8.')
  }

  const repeatedWord = title.match(/\b(\w{3,})\s+\1\b/i)
  if (repeatedWord) {
    report('medium', 'Text hygiene', guide, `title repeats a word: "…${repeatedWord[0]}…"`,
      'Usually a generation or concatenation artifact ("… CDs Guide Guide"), and it is the first thing a reader sees in results.',
      'Rewrite the title without the duplication.')
  }

  if (/\s{2,}|\s+[.,;:]/.test(title)) {
    report('low', 'Text hygiene', guide, 'title has doubled spaces or space-before-punctuation',
      'Small artifacts in a headline read as unedited output.',
      'Normalize the whitespace.')
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
  // Match the fallbacks in src/app/guides/[slug]/page.tsx generateMetadata.
  const seoTitle = String(guide.seo_title || guide.title || '').trim()
  const seoDescription = String(guide.seo_description || guide.answer || guide.seo_keyword || '').trim()
  const descriptionIsFallback = !String(guide.seo_description || '').trim()
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
    report('medium', 'Metadata', guide, 'no seo_description, and the answer/seo_keyword fallbacks are empty too',
      'The page ships with no meta description at all, so the snippet is whatever Google scrapes.',
      'Write a 55-160 char description naming the value of the page.')
  } else if (seoDescription.length > 160) {
    report('low', 'Metadata', guide, `effective meta description is ${seoDescription.length} chars${descriptionIsFallback ? ' (falling back to answer)' : ''}`,
      'Past ~160 chars the snippet is cut mid-sentence, often before the part that earns the click.',
      descriptionIsFallback ? 'Add an explicit seo_description instead of relying on the answer block.' : 'Trim to 55-160 chars.')
  } else if (seoDescription.length < 55) {
    report('low', 'Metadata', guide, `effective meta description is ${seoDescription.length} chars (target 55-160)`,
      'Very short descriptions waste snippet space and usually omit the qualifier that matches intent.',
      'Expand to 55-160 chars.')
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
  if (contentWords < 150) {
    report('high', 'Depth', guide, `content is ${contentWords} words`,
      'Below ~150 words the page cannot answer anything specific. Thin pages are the main risk at scale: they dilute the site-wide quality signal and rank for nothing.',
      'Add the concrete detail a player needs: prerequisites, the actual route, what varies, and what to do when it fails.')
  } else if (contentWords < 250) {
    report('medium', 'Depth', guide, `content is ${contentWords} words (corpus median is ~350)`,
      'Short of the depth needed to cover prerequisites, the route, and failure cases.',
      'Expand the section that currently only asserts the recommendation without showing it.')
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
    if (words(answer).length < 10) {
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
    related_items: { values: ids(guide.related_items), known: recipeIds, label: 'recipe' },
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
    if (dangling.length === 0) continue
    const wrongCollection = dangling.filter((id) => otherEntityIds.has(id))
    if (wrongCollection.length > 0) {
      report('high', 'Internal links', guide, `${field} references item/material id(s) the template cannot render: ${wrongCollection.join(', ')}`,
        'The guide template resolves related_items against recipes.json only, so these ids are dropped silently — the link block just comes out short.',
        'Move them to a recipe id, or extend the template to resolve items and materials.')
    }
    const unknown = dangling.filter((id) => !otherEntityIds.has(id))
    if (unknown.length > 0) {
      report('high', 'Internal links', guide, `${field} references unknown ${entry.label} id(s): ${unknown.join(', ')}`,
        'Dangling ids render as missing related-content links, breaking the internal-linking rule for this page.',
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

  // Rhythm checks only make sense on prose. Collectible/table dumps are legitimately
  // repetitive, so skip them rather than generate guaranteed false positives.
  const proseSentences = sentences(prose)
  const lengths = proseSentences.map((sentence) => words(sentence).length).sort((a, b) => a - b)
  const medianSentence = lengths.length > 0 ? lengths[Math.floor(lengths.length / 2)] : 0
  const isListingPage = proseSentences.length > 80 && medianSentence < 10
  if (isListingPage) return

  const openings = proseSentences.map((sentence) => words(sentence).slice(0, 2).join(' ').toLowerCase()).filter(Boolean)
  const openingCounts = openings.reduce((accumulator, opening) => {
    accumulator[opening] = (accumulator[opening] || 0) + 1
    return accumulator
  }, {})
  const repeated = Object.entries(openingCounts)
    .filter(([, count]) => count >= 4)
    .sort((a, b) => b[1] - a[1])
  if (repeated.length > 0) {
    const shown = repeated.slice(0, 5).map(([opening, count]) => `"${opening}" x${count}`).join(', ')
    const extra = repeated.length > 5 ? ` (+${repeated.length - 5} more)` : ''
    report('low', 'Prose', guide, `repeated sentence openings: ${shown}${extra}`,
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

    // A head term shared by dozens of pages is one strategic problem, not N page problems.
    if (group.length > 5) {
      const first = group.find((guide) => scopedSlugs.has(guide.slug))
      if (first) {
        report('critical', 'Cannibalization', first, `seo_keyword "${keyword}" is the target of ${group.length} guides (e.g. ${group.slice(0, 4).map((guide) => guide.slug).join(', ')}…)`,
          'CLAUDE.md sets long-tail-first as the SEO strategy for exactly this reason. Dozens of pages aimed at one head term compete with each other and none of them ranks.',
          'Assign each guide its own long-tail query derived from its actual question, e.g. "pokopia best habitat for berries" rather than "pokopia".')
      }
      continue
    }

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
  auditTextHygiene(guide)
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
