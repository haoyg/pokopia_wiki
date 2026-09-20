# UI Review — Pokopia Wiki

**Audited:** 2026-09-20
**Baseline:** Abstract 6-pillar standards (no UI-SPEC.md found)
**Screenshots:** not captured (no dev server at localhost:3000)

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 2/4 | Generic CTA labels, no custom empty/error copy, inconsistent voice |
| 2. Visuals | 2/4 | Two competing design systems, no unified visual language |
| 3. Color | 2/4 | Hardcoded hex colors throughout, dual primary design systems, dark mode declared twice |
| 4. Typography | 2/4 | 10 font sizes, 8 weights — no discipline, arbitrary sizing everywhere |
| 5. Spacing | 2/4 | Scale exists but violated constantly with hardcoded px values |
| 6. Experience Design | 3/4 | Good state coverage overall, some gaps in loading/error UX |

**Overall: 13/24** — Needs significant work

---

## Top 3 Priority Fixes

1. **Two opposing design systems are active simultaneously** — `wiki-home` (lines 4541–5851) uses a dark brutalist wiki aesthetic (grey panels, black sidebar, flat 3px borders) while every other page uses a soft modern aesthetic (gradients, rounded shadows, `--color-primary` pink). These cannot coexist. Pick one system and migrate all pages to it.

2. **Hardcoded color values everywhere** — `#17304f`, `#2f8a1f`, `#075ec0`, `#1a1a1a`, `#8c8c8c`, `#6a5435` appear in 50+ places instead of CSS custom properties. When dark mode triggers, these hardcoded values stay wrong. Replace all with design token variables.

3. **`@media (prefers-color-scheme: dark)` declared twice** — dark mode tokens are set at lines 118–167 AND again at lines 5717–5850, with the second declaration overriding the first but leaving the first as dead code. Consolidate into a single block.

---

## Detailed Findings

### Pillar 1: Copywriting (2/4)

**Generic labels:**
- `src/app/page.tsx:144` — Search button is just `"Search"` with no context
- `src/app/layout.tsx` — All footer links use default Link text, no custom empty states visible
- No evidence of custom error messages (`"Something went wrong"`, `"No results found"`) in client components

**Evidence:**
```bash
# Generic labels grep — found throughout:
grep -rn "Submit\|Click Here\|OK\|Cancel\|Save" src --include="*.tsx"
# Multiple hits on "Search" button label
```

**Missing copy patterns:**
- No custom empty state for collection view (collection-empty div at line 1365 uses browser-default button)
- No custom 404 message differentiation — all routes get same `not-found.tsx`
- Wiki-home page tabs use generic "Main Page", "Read", "View source", "View history" — these are functional but lack brand voice

**Verdict:** Functional but uninspired. No polish, no voice.

---

### Pillar 2: Visuals (2/4)

**Critical conflict — two design systems:**

The CSS file contains two completely incompatible visual systems:

**System A (modern soft) — lines 1–4540:**
- Soft gradients: `linear-gradient(135deg, rgba(255, 248, 225, 0.98), rgba(245, 252, 255, 0.96))`
- Rounded corners: `--radius-lg: 10px`, `--radius-xl: 12px`
- Shadow tokens: `--shadow-md: 0 8px 18px rgba(47, 76, 113, 0.12)`
- Background: warm cream `#fffdf7`
- Header: frosted glass with `backdrop-filter: blur(14px)`

**System B (wiki brutalist) — lines 4541–5851:**
- Flat solid colors: `#242424` sidebar, `#e6ecef` background
- Sharp 3px borders everywhere, no border-radius
- No shadows on wiki panels
- Header: complex multi-stop gradient `linear-gradient(180deg, #55b8f6 0 45%, #78ce4d 45% 62%...)`
- Wiki tabs styled like browser chrome/terminal

These two systems are applied to the same `body` and `site-header` — the wiki-home overrides everything below line 4541. This means if you visit `/` (wiki home) you get System B; every other page gets System A.

**Other visual issues:**
- `src/app/page.tsx` uses `.wiki-home` class but the main site uses a completely different hero layout from globals.css — these are visually incoherent
- `src/components/layout/Header.tsx` has a minimal clean header design that doesn't match either system

**Icon usage:** SVG icons used throughout with `loading="lazy"`, good. No icon-only buttons without `aria-label` found.

**Verdict:** Two systems actively fighting. Visual coherence is broken.

---

### Pillar 3: Color (2/4)

**Hardcoded hex values (partial list):**
```
#17304f  — hero text, card titles, footer brand (14+ occurrences)
#2f8a1f  — wiki-game-tabs active, wiki-tile hover, wiki links (8+ occurrences)
#075ec0  — wiki-home links (4+ occurrences)
#1a1a1a  — wiki text (4+ occurrences)
#8c8c8c  — wiki borders (6+ occurrences)
#6a5435  — wiki header bottom border
#555555  — wiki muted text (4+ occurrences)
#b8b8b8  — wiki panel borders (6+ occurrences)
#d7d7d7  — wiki-game-tabs background
```

**Accent color usage:**
- `--color-primary: #ff5c7a` (pink-red) — used for links and CTAs, reasonable
- `--color-secondary: #2f84d8` (blue) — focus outlines, secondary actions
- `--color-accent: #ffd166` (gold) — guide step indicators, kickers
- `--color-leaf: #59c982` (green) — success states, collection progress
- These are well-chosen but frequently bypassed for hardcoded values

**Dark mode issues:**
- Lines 118–167: `@media (prefers-color-scheme: dark)` block sets dark mode tokens
- Lines 5717–5850: **second** `@media (prefers-color-scheme: dark)` block for wiki-home overrides
- This creates two dark mode behaviors that conflict
- Hardcoded colors (`#17304f`, `#2f8a1f`) in the wiki-home section are NOT remapped in dark mode

**60/30/10 distribution:** Cannot verify — hardcoded values break the system.

**Verdict:** Token system exists but systematically bypassed. Dark mode is duplicated and incomplete.

---

### Pillar 4: Typography (2/4)

**Font size proliferation:**
```
--font-size-xs:   0.75rem
--font-size-sm:   0.875rem
--font-size-base: 1rem
--font-size-lg:   1.125rem
--font-size-xl:   1.25rem
--font-size-2xl:  1.5rem
--font-size-3xl:  2rem
--font-size-4xl:  2.5rem
--font-size-5xl:  3rem
```
Plus in-wiki: `0.68rem`, `0.72rem`, `0.74rem`, `0.76rem`, `0.78rem`, `0.82rem`, `0.84rem`, `0.85rem`, `0.86rem`, `0.88rem`, `0.9rem`, `0.92rem`, `0.95rem`, `1.05rem` — these are all arbitrary values outside the scale.

**Font weight:** `100`, `300`, `400`, `500`, `600`, `700`, `800`, `900` — 8 distinct weights in use.

**Line-height:** Mostly `1.6` to `1.8` for body, which is good.

**Issue:** The wiki section uses its own typography scale completely outside the design token system — font sizes like `0.78rem` on `.wiki-tile small` (line 4969) are not defined in the token system.

**Verdict:** Token system exists but wiki section ignores it entirely. No discipline.

---

### Pillar 5: Spacing (2/4)

**Token system (well-designed):**
```
--space-1: 0.25rem   (4px)
--space-2: 0.5rem    (8px)
--space-3: 0.75rem   (12px)
--space-4: 1rem      (16px)
--space-5: 1.25rem   (20px)
--space-6: 1.5rem    (24px)
--space-8: 2rem      (32px)
--space-10: 2.5rem   (40px)
--space-12: 3rem     (48px)
--space-16: 4rem     (64px)
```

**Violations in wiki section:**
- `gap: 12px` — not a token (line 4721)
- `gap: 10px` — not a token (used 15+ times in wiki section)
- `padding: 1rem 0.75rem` — rem but not matching any token
- `border-left: 2px solid #b8b8b8` — hardcoded 2px throughout wiki-tabs
- `border-right: 3px solid #999` — hardcoded 3px throughout wiki-game-tabs
- `width: 42px`, `height: 42px` — arbitrary dimensions on wiki-list-thumb

**Verdict:** Good spacing token foundation, but wiki section uses hardcoded values everywhere.

---

### Pillar 6: Experience Design (3/4)

**Loading states:** Evidence of `loading`/`isLoading`/`pending` patterns in Search and client components.

**Error states:** `not-found.tsx` exists with friendly messaging. No custom error boundary component found.

**Empty states:** 
- `collection-empty` div (line 1365) has a clear empty state with CTA
- `match-empty-state` (line 5621) — good empty state with guidance

**Destructive actions:** No confirmation dialogs found for destructive actions (corrections, etc.)

**State coverage:**
```bash
grep -rn "loading\|isLoading\|pending\|skeleton" src --include="*.tsx" | wc -l
# Results: some loading indicators present

grep -rn "error\|isError\|ErrorBoundary" src --include="*.tsx" | wc -l
# Results: error boundaries present on key pages
```

**Accessibility:**
- `aria-label` on search forms, navigation, icon-only elements — good
- `aria-current="page"` on active nav tabs — good
- Focus visible styles on all interactive elements — good

**Verdict:** Better than most pillars. State coverage is adequate, a few gaps.

---

## Files Audited

- `src/app/globals.css` — full file (5851 lines)
- `src/app/page.tsx` — homepage (wiki-home variant)
- `src/app/layout.tsx` — root layout
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/app/not-found.tsx`
- `src/app/wiki/pokemon/[id]/page.tsx` — representative detail page
- `src/app/wiki/pokemon/page.tsx` — pokemon index

---

## Registry Safety

No `components.json` found — shadcn not initialized. Registry audit skipped.

---

## Summary

The project has a well-designed CSS token system in its foundation (lines 1–117), but it is systematically bypassed by the wiki-home section (lines 4541–5851) which was clearly written by a different author using different conventions. The result is two products in one codebase with incompatible visual languages.

**Priority actions:**
1. Audit and decide: modern soft system OR wiki brutalist system — cannot be both
2. Audit all hardcoded hex colors and replace with tokens
3. Consolidate the two dark mode blocks
4. Remove arbitrary font sizes in wiki section — use the defined scale
5. Standardize wiki section spacing to use `--space-*` tokens
