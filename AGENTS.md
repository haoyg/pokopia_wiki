# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

Pokopia Portal is an AI-driven gaming content platform (GameWith + IGN + Pokédex hybrid) built on Cloudflare's edge infrastructure. The goal is SEO-driven content at scale with AI-assisted content generation.

**Tech Stack**: Cloudflare Pages + Next.js (frontend) | Cloudflare Workers (API/AI layer) | Cloudflare D1 (database) | Cloudflare R2 (media storage) | Cloudflare KV (caching) | Cloudflare Vectorize (future AI search)

**Content Priority**: Content > Data > SEO > Tools > Community

---

## Architecture

```
Users → Cloudflare CDN → Cloudflare Pages (Next.js)
                              ↓
                      Cloudflare Workers API
                              ↓
              D1 (DB) | R2 (storage) | KV (cache)
```

---

## Database Schema (Cloudflare D1)

Core tables require structured data as AI generation depends on it:
- `pokemon`: id, name, type, rarity, habitat, favorite_food, spawn_time, weather, specialty, skills, drops, description
- `habitats`: id, name, unlock_condition, spawn_list, recommended_build, weather, difficulty, resource_bonus
- `recipes`: id, name, ingredients, buff, effect_duration, rarity, best_use
- `guides`: id, title, slug, category, seo_keyword, related_pokemon, related_items, related_habitats
- `news`, `items`, `events`, `builds`, `users`

---

## Site Structure

```
/                  - Portal homepage (Hero, Latest News, Trending, Events, Tier List)
/news              - News articles (fast-moving, SEO lifecycle短)
/guides            -攻略 (SEO core, one question per page)
/wiki/pokemon/:id  - Pokemon database pages
/wiki/habitat/:id  - Habitat database pages
/wiki/recipe/:id   - Recipe database pages
/wiki/item/:id     - Item database pages
/features          - IGN-style deep features
/tools             - Habitat Planner, Recipe Calculator, Spawn Tracker, Team Builder
/builds            - User-submitted builds
/tier-list         - Meta tier rankings
/community         - Community hub
```

**Internal Linking Rule**: Every page must link Related Pokémon, Guides, Builds, and News.

---

## Content System

AI content generation workflow:
```
Database → AI生成初稿 → 人工审核 → SEO优化 → 发布
```

AI generates: Pokémon intros, Best Builds, Farming suggestions, Guide drafts, Patch analysis.

---

## SEO Strategy

- Target long-tail keywords first (not "pokopia", but "pokopia best habitat", "pokopia farming guide")
- Scale: 100 → 1000 → 10000 pages
- One question per guide page (GameWith model)
- All pages must have Related Content sections

---

## Development

```bash
# Local development with Cloudflare
npm run dev          # Start Next.js dev server
npx wrangler dev     # Run Workers locally
npx wrangler d1 execute DB --local   # Run D1 migrations locally

# Deployment
npm run deploy        # Deploy to Cloudflare Pages
npx wrangler deploy   # Deploy Workers
```

---

## Key Principles

1. **Everything structured** - AI generation depends on structured database data
2. **Page scale matters** - Gaming SEO is a page quantity game
3. **Internal linking** - Every page links to related pages (SEO network effect)
4. **MVP first** - Launch with: 1 homepage + News + 30 guides + 50 Pokémon + 20 habitats + basic search
5. **Media on R2** - No egress fees, critical for media-heavy site
