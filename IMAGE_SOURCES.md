# Pokopia Image Source Candidates

Use this file to review image candidates before adding them to the site. Prefer official assets first. When an image is added to data JSON, also add `image_source` and `image_source_url` so the site can show attribution.

Last checked: 2026-05-23

## Current Site Behavior

- The site intentionally hides images when `image_source` is empty.
- This prevents generated or uncredited placeholders from appearing during AdSense review.
- To make an image appear, set both `image_url` and `image_source` in the matching data JSON entry.

## Preferred Attribution Labels

- Official site screenshots: `图片来源：游戏官方`
- Official press/news assets: `图片来源：The Pokémon Company 官方新闻素材`
- Official Nintendo news assets: `图片来源：Nintendo 官方新闻素材`
- Player screenshots: `图片来源：玩家实机截图`
- Open-license images: `图片来源：<license/source/author>`

## Official Pokémon Pokopia Site

Source page: https://pokopia.pokemon.com/en-us/

Notes:
- The official page contains screenshots and game footage.
- The page itself states that screenshots/game footage are from a product in development and not final.
- These are the best first candidates for homepage, guide covers, news covers, and habitat/overview pages.
- The direct asset URLs may return `403 Forbidden` to automated fetchers. If so, download manually from the browser or use the press site download button, then host locally in `public/images/official/`.

Candidate direct asset URLs discovered from the official page:

```text
https://pokopia.pokemon.com/assets/en-us/pages/index/img-trailer.jpg
https://pokopia.pokemon.com/assets/en-us/pages/index/gallery-2_1.jpg
https://pokopia.pokemon.com/assets/en-us/pages/index/gallery-2_2.jpg
https://pokopia.pokemon.com/assets/en-us/pages/index/gallery-2_5.jpg
https://pokopia.pokemon.com/assets/en-us/pages/index/gallery-2_6.jpg
https://pokopia.pokemon.com/assets/en-us/pages/index/gallery-2_7.jpg
https://pokopia.pokemon.com/assets/en-us/pages/index/gallery-2_8.jpg
https://pokopia.pokemon.com/assets/en-us/pages/index/gallery-3_4.jpg
https://pokopia.pokemon.com/assets/en-us/pages/index/gallery-3_6.jpg
https://pokopia.pokemon.com/assets/en-us/pages/index/gallery-3_7.jpg
https://pokopia.pokemon.com/assets/en-us/pages/index/gallery-3_8.jpg
https://pokopia.pokemon.com/_astro/character-tangrowth.Cw-cmRqf_Z1Y5rC0.webp
https://pokopia.pokemon.com/_astro/group-1.DugJP6N1_wDlCf.webp
https://pokopia.pokemon.com/_astro/group-2.DU_8rPlU_Z1uITcq.webp
```

Recommended mapping:

- Homepage hero/news/feature: `img-trailer.jpg`, `gallery-2_1.jpg`
- General guide covers: `gallery-2_2.jpg`, `gallery-2_5.jpg`, `gallery-2_6.jpg`
- Habitat pages: `gallery-3_4.jpg`, `gallery-3_6.jpg`, `gallery-3_7.jpg`, `gallery-3_8.jpg`
- Character/Pokémon overview pages: `character-tangrowth...webp`, `group-1...webp`, `group-2...webp`

First batch page assignment:

```text
/                         -> img-trailer.jpg or gallery-2_1.jpg
/news                     -> gallery-2_1.jpg, gallery-2_2.jpg
/guides                   -> gallery-2_5.jpg, gallery-2_6.jpg
/wiki/habitat             -> gallery-3_4.jpg, gallery-3_6.jpg
/wiki/pokemon             -> group-1.DugJP6N1_wDlCf.webp, group-2.DU_8rPlU_Z1uITcq.webp
/features/meta-analysis   -> gallery-2_8.jpg or gallery-3_8.jpg
```

Suggested JSON pattern:

```json
{
  "image_url": "/images/official/pokopia-official-01.jpg",
  "image_alt": "Official Pokémon Pokopia gameplay screenshot",
  "image_source": "游戏官方",
  "image_source_url": "https://pokopia.pokemon.com/en-us/"
}
```

## The Pokémon Company Official Press Site

Source page:

```text
https://press.pokemon.com/en/products/Pokemon-Pokopia
https://press.pokemon.com/en/releases/Pokemon-Reveals-Two-New-Video-Game-Experiences-Pokemon-Pokopia-and-Pok
```

Notes:
- The public product page lists official asset categories: `logos`, `screenshots`, and `artwork`.
- The public crawler can read the product page, but some release/download pages may return login/unauthorized responses.
- If your browser account can access/download press images, use these as highest-trust assets.

Recommended attribution:

```text
图片来源：The Pokémon Company 官方新闻素材
```

Recommended local folders:

```text
public/images/official/press/screenshots/
public/images/official/press/artwork/
public/images/official/press/logos/
```

## Official Pokémon News

Source pages:

```text
https://www.pokemon.com/us/pokemon-news/pokemon-pokopia-arriving-in-2026
```

Notes:
- Use article images only when they are clearly official Pokémon news assets.
- Good for announcement/news pages and the homepage latest-news section.

Recommended attribution:

```text
图片来源：The Pokémon Company 官方新闻
```

## Official Nintendo News

Source page:

```text
https://www.nintendo.com/en-gb/News/2025/September/Build-your-own-Pokemon-paradise-in-Pokemon-Pokopia-coming-in-2026-2891492.html
```

Notes:
- Use only screenshots or key art directly embedded in the Nintendo article.
- Good for announcement pages and general overview pages.

Recommended attribution:

```text
图片来源：Nintendo 官方新闻素材
```

## Gematsu Screenshot Articles

Source pages:

```text
https://www.gematsu.com/2025/11/pokemon-pokopia-extended-trailer-new-details-and-screenshots
https://www.gematsu.com/2025/11/pokemon-pokopia-launches-march-5-2026
```

Notes:
- Gematsu articles include official screenshots and mention that The Pokémon Company released new screenshots.
- Use only after you confirm you are comfortable with reposted official media.
- Prefer linking attribution to the source article or to the official Pokopia site.
- Treat these as secondary candidates when the official press download is unavailable.

Candidate direct thumbnail URLs:

```text
https://www.gematsu.com/wp-content/uploads/2025/11/Pokemon-Pokopia_2025_11-13-25_001-320x180.jpeg
https://www.gematsu.com/wp-content/uploads/2025/11/Pokemon-Pokopia_2025_11-13-25_002-320x180.jpg
https://www.gematsu.com/wp-content/uploads/2025/11/Pokemon-Pokopia_2025_11-13-25_003-320x180.jpg
https://www.gematsu.com/wp-content/uploads/2025/11/Pokemon-Pokopia_2025_11-13-25_004-320x180.jpg
https://www.gematsu.com/wp-content/uploads/2025/11/Pokemon-Pokopia_2025_11-13-25_005-320x180.jpg
```

Recommended mapping:

- `001`: cave/glow/exploration style image, good for unlock or discovery guides.
- `002`: grass/gathering style image, good for beginner, farming, or habitat pages.
- `003`: group of Pokémon near a building, good for homepage/news/general guide covers.

Suggested JSON pattern:

```json
{
  "image_url": "/images/official/pokopia-gematsu-003.jpg",
  "image_alt": "Pokémon Pokopia official screenshot showing multiple Pokémon near a building",
  "image_source": "Gematsu / 官方截图转载",
  "image_source_url": "https://www.gematsu.com/2025/11/pokemon-pokopia-extended-trailer-new-details-and-screenshots"
}
```

## Serebii Screenshot Gallery

Source page:

```text
https://www.serebii.net/pokemonpokopia/pics.shtml
```

Notes:
- This is a fan/news resource with pre-release screenshots.
- Use only after manual review, and prefer official sources when possible.

Recommended attribution:

```text
图片来源：Serebii / 官方预发布截图转载
```

## RPGFan Screenshot Gallery

Source page:

```text
https://www.rpgfan.com/gallery/pokemon-pokopia-screenshots/
```

Notes:
- The gallery lists many Pokopia screenshots.
- Treat this as a secondary screenshot index only. Prefer official source pages for final attribution when possible.

Recommended attribution:

```text
图片来源：RPGFan / 官方截图转载
```

## Player Screenshot Folder Plan

Put player screenshots here:

```text
public/images/screenshots/
```

Suggested file names:

```text
public/images/screenshots/player-habitat-volcanic-cave-01.jpg
public/images/screenshots/player-pokemon-pikafire-01.jpg
public/images/screenshots/player-recipe-cooking-01.jpg
```

Suggested JSON pattern:

```json
{
  "image_url": "/images/screenshots/player-habitat-volcanic-cave-01.jpg",
  "image_alt": "Player gameplay screenshot of Volcanic Cave",
  "image_source": "玩家实机截图",
  "image_source_url": ""
}
```

## Recommended Workflow

1. Pick 8-12 official screenshots first, enough to make homepage, news, guides, and main wiki index pages visually credible.
2. Download the files manually from official pages or press kit, then place them under `public/images/official/`.
3. Rename files descriptively, for example `pokopia-official-building-01.jpg`, `pokopia-official-habitat-forest-01.jpg`.
4. Fill `image_url`, `image_alt`, `image_source`, and `image_source_url` in both `src/data/*.json` and `public/data/*.json`.
5. Avoid using one image on too many pages. Reuse is fine for indexes, but detailed pages should eventually have more specific media.

## Safe First Targets

These pages give the highest visual/SEO impact with the fewest images:

```text
/                         homepage hero or first news image
/news                     latest news cards
/guides                   guide cards
/guides/best-starter-pokemon
/guides/how-to-unlock-volcanic-cave
/guides/fast-farming-rare-pokemon
/wiki/pokemon
/wiki/habitat
/wiki/recipe
```
