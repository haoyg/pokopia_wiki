# Provenance and claim discipline

Pokopia guidance sits in an awkward place: some mechanics are confirmed on official Nintendo pages, most specifics are player inference, and the site runs ads. That combination means a mislabeled claim is not a style problem — it is the thing that gets pages pulled from the index or the account reviewed.

The rule this project already follows, and the audit enforces: **the label must describe the evidence, not the ambition.**

## The three-field contract

A guide's honesty lives in four fields that must agree with each other:

| Field | Holds |
|---|---|
| `data_status` | The claim about the evidence. Renders as a visible badge. |
| `data_status_note` | Prose explanation for the reader. Must be 60+ chars or `check-content-quality.js` fails the build. |
| `sources` | `[{label, url}]` — the actual evidence. |
| `confirmed_context` | What the sources literally state, in the source's own scope. |
| `editorial_limits` | What the page deliberately does *not* claim. |

`how-to-build-first-house` is the reference implementation. It cites one Nintendo News article, lists in `confirmed_context` exactly what Nintendo states (four walls, a door, three furnishings), and uses `editorial_limits` to disclaim material costs and decoration order because the source does not mention them. Copy that shape.

## Status values

- **`Source-backed guide`** — has `sources`. If `sources` is empty this is a false trust signal: the badge renders, the citation does not exist. Critical finding, no exceptions.
- **`Reference guide`** — states mechanics without citing them. Acceptable for stable, widely-observed mechanics, but the page must say so in `editorial_limits`.
- **`Unverified editorial guide`** — legacy label. Contains the word `unverified`, which `src/lib/indexing.ts` treats as a noindex flag.

Anything else inherits indexable by default. See below.

## Indexability is derived, not declared

`index_status` alone does not control indexing. `isIndexableGuide` in `src/lib/indexing.ts` noindexes a page only when `data_status` or `index_status` **contains** one of: `draft`, `placeholder`, `thin`, `ai draft`, `needs review`, `noindex`, `future`, `unverified`, `editorial`.

Consequences worth remembering:

- `index_status: "review"` does **not** noindex a page. Only `needs review` matches.
- A missing or unrecognized `data_status` ships as indexable.
- To hold a page back, use a value containing a flag word — `needs review`, not `review`.

Before promoting anything to indexable: it has sources, `confirmed_context` matches what those sources actually say, and `editorial_limits` marks the inference.

## Claim triage

Extract every claim before rewriting, then sort by what a wrong answer costs the reader.

**High risk — must be sourced or removed.** Release dates, prices, file sizes, platform and DLC availability, patch contents, region restrictions, anything with a number attached, anything a player would spend money on.

**Medium risk — source or soften.** Unlock requirements, spawn conditions, recipe effects, tier placements, "best" claims, weather and time-of-day behaviour, drop rates.

**Low risk — judgment, label it as such.** Route order, playstyle recommendations, decoration advice, what to prioritize first.

Actions, in order of preference:

1. **Cite** — attach the official page to `sources` and quote its scope in `confirmed_context`.
2. **Soften** — convert an absolute into a condition. "Bulbin is the best starter" → "Bulbin is the most forgiving start if your first goal is stable early routes."
3. **Scope** — keep the advice, name it as the site's recommendation rather than a game rule, and note the limit.
4. **Remove** — no source, no way to soften honestly, no loss to the reader.

Never invent a source, a version number, a patch date, or a percentage. `blocked — missing verified data` is a legitimate state to leave a field in.

## Source preference

1. Official Nintendo and Pokémon pages — product listings, news posts, support articles, update notes. `src/data/official.json` already holds the confirmed facts; check there first and reuse the wording's scope.
2. Reputable gaming press, when clearly attributed and dated.
3. Third-party wikis and community reports — useful for finding what to verify, never sufficient on their own. Several guides in this corpus were rewritten from `pokopiawiki.com` and are still labeled `Source-backed guide` with no `sources`; that is the largest open provenance debt in the corpus.
4. Datamines, leaks, and pre-release speculation — do not present as fact at all.

## Claim ledger

Use this when auditing a fact-heavy guide, so the user can see the reasoning rather than just the outcome:

```markdown
| Claim | Risk | Evidence | Action |
|---|---|---|---|
| Release date is March 5, 2026 | High | official.json / Nintendo Store listing | Cite |
| Dive unlocks after Bleak Beach request | Medium | update page confirms request, not order | Soften |
| Honey Cake is best saved for capture attempts | Low | site recommendation | Scope |
| Berry respawn is 24 hours | High | no source found | Remove |
```

## Cross-checks worth doing by hand

- Does `confirmed_context` overstate the source? A source saying building kits "make building easier" does not confirm a material cost.
- Does the guide contradict `src/data/official.json`? Official facts win.
- Does it contradict another guide? Two pages giving opposite advice is worse than either being wrong alone — reconcile both.
- Does the image credit imply verification it does not provide? The existing `image_license_note` wording exists precisely because a credited promotional screenshot verifies the image's origin and nothing about the page's claims.
