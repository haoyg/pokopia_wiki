---
name: guide-audit
description: Audit and improve Pokopia guide pages for provenance, search intent, depth, keyword targeting, internal linking, and mechanical AI prose. Use when reviewing a guide before publishing, when promoting a guide from review to indexable, when a batch of AI-generated guides needs an editorial pass, or when asked to audit/optimize/rewrite anything in src/data/guides.json.
---

# Guide editorial audit

The site already checks rendered output: `npm run check:site` covers metadata plumbing, HTML structure, media rights, indexing, and ad-policy compliance. None of it judges the writing. This skill covers that gap — whether a guide answers a real query, whether its claims are traceable, and whether it reads like it was written for a player.

Scope: guide pages in `src/data/guides.json`. `src/data/` is the source of truth; `public/data/` is a stale export and must not be edited directly.

## Order of operations

Provenance first, meaning second, style last. Reversing this wastes work — there is no point polishing a sentence that has to be deleted for making an unverifiable claim.

1. **Run the deterministic pass.** It finds everything countable and gives you the worklist.
2. **Fix provenance.** Every blocked claim is resolved before anything else changes.
3. **Judge intent and depth.** This is the part a script cannot do.
4. **Fix SEO mechanics.** Title, keyword placement, answer block, FAQ coverage.
5. **Humanize.** Only after the content is correct.
6. **Re-check.** The humanization pass can reintroduce problems.

## 1. Deterministic pass

```bash
node scripts/check-guide-editorial.js --slug=<slug>          # one guide
node scripts/check-guide-editorial.js --min=high             # corpus worklist
node scripts/check-guide-editorial.js --json                 # for further processing
node scripts/check-guide-editorial.js --slug=<slug> --strict  # exit 1 on critical/high
```

Advisory by default. `--strict` is the pre-publish gate — use it before flipping a guide to indexable.

The script is deliberately not wired into `npm run build`: the existing corpus has open findings, and blocking the build on them would only get the check disabled. Add it to `check:postbuild` once the critical count reaches zero.

It intentionally mirrors two pieces of app logic — `isIndexableGuide` from `src/lib/indexing.ts` and the `related_items`-resolves-to-recipes-only behaviour in `src/app/guides/[slug]/page.tsx`. If either changes, update the script in the same commit.

## 2. Provenance

Read `references/provenance-and-claims.md`. This is the highest-stakes part of the audit and the most project-specific: Pokopia guidance is a mix of officially confirmed mechanics and player inference, on an ad-supported site, and the labels have to tell the truth about which is which.

Never resolve a provenance finding by inventing a source, and never write a game fact you cannot trace. Blocked is an acceptable outcome; a confident guess is not.

## 3. Intent and depth

Read `references/audit-checklist.md`. Work through the semantic checks: does the title match one real query, does each section earn its place, does the guide answer the question a player arrived with, and does it cover the failure case they will hit next.

The judgment to apply throughout: **would a player who followed this page get the result it promised?** A page that reads well and cannot be acted on has failed.

## 4. SEO mechanics

Also in `references/audit-checklist.md`. The deterministic pass catches lengths, placements, and collisions; use the checklist for whether the keyword is the right one to target at all.

## 5. Humanization

Read `references/humanization.md`. Editorial pass, not detector evasion. It runs after facts are settled and preserves every verified claim, number, source, and required keyword.

## 6. Re-check

Re-run the deterministic pass. Then verify by hand that nothing regressed: claims unchanged, sources intact, keyword still in the title and opening, related-entity ids still resolve, no new absolutes introduced while smoothing sentences.

## Output format

Report findings before editing. Let the user see the diagnosis and choose the scope.

```markdown
## Audit: <slug>

- Verdict: PASS / NEEDS WORK / BLOCKED
- Intent fit: strong / partial / weak — <the query this page actually serves>
- Top priority: <the single most important fix>

| Priority | Area | Evidence | Fix |
|---|---|---|---|
| Critical | Provenance | ... | ... |

## Plan
1. <highest-impact change>
2. ...

## Blocked
- <claim that cannot be verified, and what would resolve it>
```

Then apply the fixes to `src/data/guides.json` and report what changed. When auditing a batch, lead with the pattern across guides rather than a per-guide dump — a systemic finding is one decision for the user, not fifty.

---

Adapted from the SEO writer references in [flaqai/backlink_skills](https://github.com/flaqai/backlink_skills) (MIT), reworked for structured game-guide records and this project's provenance model. The humanization lineage traces to [blader/humanizer](https://github.com/blader/humanizer) (MIT), based on Wikipedia's "Signs of AI writing".
