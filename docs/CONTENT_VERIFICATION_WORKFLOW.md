# Content verification and index recovery

Database pages are fail-closed. A Pokemon, habitat, or recipe record is publishable only when all of these are present:

- `verification_status`: `official-confirmed` or `community-confirmed`
- `verified_at`: a valid date
- `updated_at`: a valid review date
- `sources`: at least one accessible HTTP(S) evidence URL
- no draft, placeholder, unverified, editorial, or noindex flag

## Evidence entry example

```json
{
  "verification_status": "official-confirmed",
  "verified_at": "2026-09-22",
  "updated_at": "2026-09-22",
  "game_version": "1.0.0",
  "sources": [
    {
      "label": "Official announcement",
      "url": "https://example.com/source",
      "type": "official"
    }
  ]
}
```

Community-confirmed claims should include more than one independent source where practical. Record exact field-level disagreements in the editorial review, and use `disputed` until resolved.

Official facts that are not sufficient to populate a full database page belong in `src/data/verified-intake.json`. This intake file is evidence storage, not a publishable Pokédex: do not infer favorite food, spawn window, drops, rarity, habitat, or encounter availability from a trailer appearance or incidental official mention.

## Removal and migration rules

1. Keep unsafe URLs available with `noindex,follow` during evidence review.
2. Restore indexing only after the shared publishing gate passes and the rendered page is checked.
3. If a legacy URL maps cleanly to a verified replacement, add a 301 mapping.
4. If it has no replacement and the subject is fictional or invalid, return 410 after manual review.
5. Never redirect unrelated removed pages to the homepage.

Generate the working lists with `npm run audit:content`. Review `reports/content-inventory.json` and `reports/url-migration-manifest.json` before changing redirects or status codes.

Run `npm run validate:evidence` before publishing. The validator rejects future or invalid dates, missing game versions, self-referential citations, untyped sources, and records that claim a publishable status without passing the shared indexing gate.

## Search Console dependency

Grant the operating Google account access to the `pokopia.cloud` Search Console property. Export Page indexing counts and examples for:

- Crawled - currently not indexed
- Discovered - currently not indexed
- Duplicate/canonical exclusions
- Soft 404 and Not found (404)

Do not decide the final 301/410 batch from URL count alone. Join GSC examples to the migration manifest, prioritize URLs Google already crawls, then validate removals and resubmit the sitemap.
