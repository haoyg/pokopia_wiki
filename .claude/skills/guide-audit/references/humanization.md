# Humanization pass

Runs **after** provenance and content are settled. It is an editorial pass, not AI-detector evasion. Do not optimize for a detector score, insert deliberate errors, or make the prose less accurate to sound more human.

The goal: replace generic prose with the specific thing a player needs to know. Most text that reads as machine-written reads that way because it says nothing — the style is a symptom.

## Preserve without exception

Do not change, during this pass:

- verified claims, numbers, dates, prices, or their level of certainty
- `sources`, `confirmed_context`, `editorial_limits`, `data_status_note`
- Pokémon, habitat, item, and recipe names (they are also link keys)
- the target keyword's presence in the title and opening
- related-entity ids, image paths, slugs

Do not introduce, during this pass:

- personal experience or playtesting the site did not do
- named players, quotes, anecdotes, or measurements
- a stronger claim than the verified draft made
- certainty that was not there before

If humanizing conflicts with accuracy, accuracy wins.

## Voice target

Write a one-line brief before editing. For this site: *practical guidance for a player who is mid-session and wants the answer; direct, willing to recommend, no invented first-person play, no hype.*

Guides may commit to a recommendation. They may not claim to have tested it.

## Look for clusters, not words

A single formal sentence is not a tell. A paragraph of them is. Look for:

- **significance inflation** — an ordinary mechanic described as a major shift
- **promotional adjectives** — seamless, effortless, game-changing, unparalleled
- **vague attribution** — "many players agree", "the community has found", with nothing behind it
- **ceremonial transitions** — moreover, furthermore, in conclusion, it's worth noting that
- **not-just-X-but-Y** and other manufactured contrasts
- **forced symmetry** — every list at exactly three items, every section the same length
- **synonym cycling** — the same habitat renamed in every sentence to avoid repetition
- **headings restated** — a section opening by paraphrasing its own heading
- **generic closes** — "whatever your playstyle", "the possibilities are endless"
- **chatbot residue** — "I hope this helps", "happy farming"

Legitimate repetition is fine. Collectible tables, spawn lists, and step sequences are supposed to be uniform; leave them alone.

## Rewrite for the reader

Smallest change that improves the passage:

- state the concrete fact before interpreting it
- prefer plain verbs where a grander construction adds nothing
- replace vague authority with the actual source, or cut the attribution
- merge setup sentences; delete signposting that announces the next section
- use as many examples as the subject needs, not as many as symmetry wants
- let section lengths be uneven when the information is uneven
- end on a specific next action, not a summary of what the reader just read

Weak: *"There are many great habitats in Pokopia, and choosing the right one can make a big difference in your farming efficiency. It's worth noting that each habitat has its own unique advantages."*

Stronger: *"Pick the habitat by what you are short of. Forest Valley keeps early routes stable when you are still losing runs to food; Crystal Lake is slower per trip but recovers faster from a failed capture."*

Then ask once: **what still makes this read as generated rather than written for this player?** Fix only what you can name. Do not put this critique in the page.

## Integrity check afterwards

Humanization runs last, so it is the pass most likely to break something already fixed:

- intent and the title's promise still match
- keyword still in the title and the first 100 words, still sounding natural
- effective meta description still within length (remember `answer` is the fallback)
- numbers, dates, and sourced statements unchanged
- no absolute reintroduced where the draft had a condition
- no new claim that the sources do not support
- entity names intact and still matching the related-id fields

Re-run `node scripts/check-guide-editorial.js --slug=<slug>` to confirm.

## Record the pass

```markdown
## Humanization
- Voice target: ...
- Clusters revised: ...
- Claims and sources preserved: yes / no + notes
- Keyword and metadata rechecked: yes / no + notes
- Remaining style risk: ...
```

Never claim the result is undetectable or "100% human". The defensible outcome is a more specific, more useful page.

---

Adapted from `writer/references/humanization.md` in [flaqai/backlink_skills](https://github.com/flaqai/backlink_skills) (MIT), which credits [blader/humanizer](https://github.com/blader/humanizer) (MIT) and Wikipedia's "Signs of AI writing".
