# Guide audit checklist

For the semantic judgments `scripts/check-guide-editorial.js` cannot make. Run it first; this file is for deciding whether the page is *right*, not whether its fields are the right length.

Guides are structured records, not markdown articles. The fields carry the weight:

| Field | Job on the page |
|---|---|
| `title` | The question, as a player would ask it. Becomes the H1. |
| `seo_keyword` | The one query this page owns. |
| `answer` | Direct resolution, 30-80 words. Serves the impatient reader and the snippet. |
| `content` | The reasoning, prose, split on blank lines into paragraphs. |
| `steps` | Ordered, checkable actions. |
| `recommended_setup` | The named build/route/loadout. |
| `common_mistakes` | Failure modes and their symptoms. |
| `faqs` | Follow-up queries. 3+ required by `check-content-quality.js`. |
| `related_pokemon` / `related_habitats` / `related_items` | The internal-link network. |

## Search intent

One page, one question. Name the intent explicitly before judging anything else:

- **learn** — how a mechanic works
- **decide** — which starter, habitat, team, recipe
- **execute** — how to reach a specific outcome
- **troubleshoot** — why something is not working
- **look up** — a specific value or list

Then check the fields serve it. Decide-intent needs `recommended_setup` and a trade-off, not a wall of lore. Execute-intent needs `steps` and prerequisites. Look-up intent needs completeness and does not need prose rhythm.

Mixed intent is the most common structural failure. The fix is a narrower page, not more sections.

## Title and keyword

- The title states the question or outcome, in the words a player would use. `Best Starter Pokemon in Pokopia` works. `Ancient Items Guide Guide` does not.
- The keyword is long-tail. CLAUDE.md is explicit: target `pokopia best habitat`, not `pokopia`. 63 guides currently share the bare keyword `pokopia` — when you touch one of them, give it a real query derived from its actual question.
- The keyword matches what the page answers. If the title drifted during editing, change the keyword rather than bending the title back.
- No `Complete Guide` / `Ultimate Guide` unless it genuinely is one.

## Answer block

The strongest single lever on a guide page. It should:

- resolve the title question in the first sentence,
- name who or what the recommendation suits,
- state the main trade-off or condition,
- stop at 30-80 words.

Weak: *"There are several good starters in Pokopia and the best one depends on your playstyle."* — restates the question.

Strong: *"Bulbin is the safest first pick because it stabilizes early routes with the fewest resource mistakes. Aquap suits slower Crystal Lake farming; Pikafire suits players who want faster unlock pressure and can absorb a failed run."*

## Depth

Each substantive part of `content` should carry a claim, the reason, a concrete example or value, and what it means for the reader. Judge by section, not by word count.

By intent:

- **Execute** — prerequisites, ordered steps, a way to check success, the failure case.
- **Decide** — the criteria first, then each option's best-fit, then conditional recommendations. `Choose X if…` / `Avoid Y when…` beats `X is better than Y`.
- **Learn** — definition, the misconception players actually hold, an example, the application.
- **Look up** — completeness and consistent formatting matter more than prose.

Thin pages are the compounding risk here. At 100 pages a thin page is a gap; at 10,000 it is a site-wide quality signal. Depth in the sense that matters is *specificity a player can act on* — a named habitat, a real sequence, an actual constraint — not more sentences.

## FAQ

Three minimum, and they must serve queries the body does not. Good sources of real follow-ups: cost, time required, difficulty, what to do when it fails, alternatives, whether it is worth it, what changes later, what unlocks next.

Two failures to watch for: an FAQ that restates the `answer` block, and an FAQ answered in five words. Both add page length and no value.

## Internal linking

CLAUDE.md makes this the core mechanism, and it is the audit's most mechanical high-value check.

- Every Pokémon, habitat, and recipe the guide names should be in the matching related field.
- `related_items` resolves against `recipes.json` only in the current template. Item and material ids render nothing.
- Prefer linking entities the guide actually reasons about. A passing mention that adds no link value should either become a real reference or be cut.
- Ask the reverse question too: which pages should link *to* this one? A guide nothing points at will not be found.

## Prose

The specifics live in `humanization.md`. The audit-level question: does each paragraph lead with its point, and does the page ever tell the reader something they could not have guessed?

Two patterns are worth flagging on sight because they are endemic to generated guide content:

- **Hedged non-advice** — "depends on your playstyle", "there are many viable options", "experiment to find what works". If the page cannot commit, it has no reason to exist.
- **Restated headings** — a section whose first sentence paraphrases its own heading.

## Verdict

- **BLOCKED** — an unverifiable high-risk claim, a `Source-backed guide` with no sources, or a wrong-intent page. Do not publish; do not polish.
- **NEEDS WORK** — thin sections, weak answer, missing internal links, keyword collision.
- **PASS** — claims traceable, intent clear and served, links resolve, prose specific.

State the verdict before the findings. Then give one top priority, not a ranked list of twelve.
