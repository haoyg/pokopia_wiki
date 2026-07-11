const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')

const colors = {
  update: ['#0f3460', '#4cc9f0', '#e94560'],
  patch: ['#1f2937', '#f97316', '#fde68a'],
  event: ['#14532d', '#22c55e', '#fef08a'],
  announcement: ['#312e81', '#a855f7', '#f472b6'],
  tier: ['#581c87', '#eab308', '#fef3c7'],
  guides: ['#064e3b', '#14b8a6', '#ccfbf1'],
  farming: ['#713f12', '#84cc16', '#fef9c3'],
  team: ['#7f1d1d', '#ef4444', '#fee2e2'],
  Fire: ['#7f1d1d', '#ef4444', '#fed7aa'],
  Water: ['#0c4a6e', '#38bdf8', '#dbeafe'],
  Grass: ['#14532d', '#22c55e', '#dcfce7'],
  Electric: ['#713f12', '#facc15', '#fef9c3'],
  Ice: ['#164e63', '#67e8f9', '#ecfeff'],
  Ghost: ['#312e81', '#8b5cf6', '#ede9fe'],
  Dark: ['#111827', '#64748b', '#e5e7eb'],
  Dragon: ['#581c87', '#a855f7', '#fae8ff'],
  Steel: ['#334155', '#94a3b8', '#f1f5f9'],
  Rock: ['#44403c', '#a8a29e', '#fafaf9'],
  Ground: ['#78350f', '#d97706', '#ffedd5'],
  Flying: ['#075985', '#60a5fa', '#eff6ff'],
  Normal: ['#3f3f46', '#a1a1aa', '#f4f4f5'],
  Poison: ['#581c87', '#c084fc', '#f3e8ff'],
  Fairy: ['#831843', '#f9a8d4', '#fdf2f8'],
  Crystal: ['#155e75', '#22d3ee', '#cffafe'],
  habitat: ['#0f3460', '#2dd4bf', '#dcfce7'],
  recipe: ['#7c2d12', '#f97316', '#ffedd5'],
}

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''))
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
}

function shortTitle(title, max = 34) {
  if (title.length <= max) return title
  return `${title.slice(0, max - 1).trim()}...`
}

function writeSvg(file, svg) {
  ensureDir(file)
  fs.writeFileSync(file, svg, 'utf8')
}

function coverSvg({ title, kicker, palette, motif = 'spark' }) {
  const [dark, main, light] = palette
  const displayTitle = escapeXml(shortTitle(title))
  const displayKicker = escapeXml(kicker.toUpperCase())
  const motifMarkup = motif === 'map'
    ? `<path d="M770 90 C880 150 850 280 980 340 C1090 392 1050 510 930 540 C760 582 705 450 560 470 C402 492 340 615 190 530 C58 455 120 305 248 285 C375 266 394 95 548 80 C620 74 688 55 770 90Z" fill="${light}" opacity=".34"/>`
    : `<circle cx="930" cy="170" r="112" fill="${light}" opacity=".32"/><circle cx="820" cy="430" r="190" fill="${main}" opacity=".18"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-label="${displayTitle}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${dark}"/>
      <stop offset=".55" stop-color="${main}"/>
      <stop offset="1" stop-color="${light}"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000" flood-opacity=".22"/>
    </filter>
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <path d="M0 518 C170 458 278 594 455 530 C658 456 760 535 928 494 C1040 466 1120 398 1200 420 L1200 675 L0 675Z" fill="#ffffff" opacity=".16"/>
  ${motifMarkup}
  <g filter="url(#soft)">
    <rect x="78" y="88" width="1044" height="499" rx="34" fill="#ffffff" opacity=".13"/>
    <path d="M152 470 L274 302 L390 420 L500 240 L648 470Z" fill="#ffffff" opacity=".26"/>
    <circle cx="785" cy="236" r="72" fill="#ffffff" opacity=".28"/>
  </g>
  <text x="112" y="145" fill="#fff" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="28" font-weight="800" letter-spacing="4">${displayKicker}</text>
  <text x="112" y="540" fill="#fff" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="64" font-weight="900">${displayTitle}</text>
  <text x="112" y="596" fill="#fff" opacity=".82" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="28">Pokopia Portal</text>
</svg>`
}

function pokemonSvg({ name, type, rarity, specialty, palette }) {
  const [dark, main, light] = palette
  const title = escapeXml(name)
  const meta = escapeXml(`${type} / ${rarity} / ${specialty}`)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800" role="img" aria-label="${title}">
  <defs>
    <radialGradient id="bg" cx=".4" cy=".28" r=".8">
      <stop offset="0" stop-color="${light}"/>
      <stop offset=".52" stop-color="${main}"/>
      <stop offset="1" stop-color="${dark}"/>
    </radialGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="24" stdDeviation="24" flood-color="#000" flood-opacity=".25"/>
    </filter>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  <circle cx="625" cy="155" r="120" fill="#fff" opacity=".18"/>
  <circle cx="180" cy="625" r="180" fill="#fff" opacity=".12"/>
  <g filter="url(#shadow)">
    <path d="M240 424 C240 290 320 205 405 205 C505 205 574 300 566 432 C560 548 492 628 398 628 C304 628 240 540 240 424Z" fill="#fff" opacity=".88"/>
    <path d="M296 250 L252 152 L360 206Z" fill="#fff" opacity=".88"/>
    <path d="M504 252 L562 152 L448 205Z" fill="#fff" opacity=".88"/>
    <circle cx="355" cy="386" r="24" fill="${dark}"/>
    <circle cx="455" cy="386" r="24" fill="${dark}"/>
    <path d="M356 478 C388 506 427 506 456 478" fill="none" stroke="${dark}" stroke-width="18" stroke-linecap="round"/>
    <path d="M258 524 C178 555 144 616 152 688" fill="none" stroke="#fff" stroke-width="32" stroke-linecap="round" opacity=".78"/>
    <path d="M548 522 C642 556 675 614 664 688" fill="none" stroke="#fff" stroke-width="32" stroke-linecap="round" opacity=".78"/>
  </g>
  <text x="48" y="74" fill="#fff" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="34" font-weight="900">${title}</text>
  <text x="48" y="122" fill="#fff" opacity=".85" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="24" font-weight="700">${meta}</text>
</svg>`
}

function habitatSvg({ name, weather, difficulty, resourceBonus, palette }) {
  const [dark, main, light] = palette
  const title = escapeXml(name)
  const meta = escapeXml(`${weather} / ${difficulty}`)
  const bonus = escapeXml(resourceBonus)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${light}"/>
      <stop offset=".45" stop-color="${main}"/>
      <stop offset="1" stop-color="${dark}"/>
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000" flood-opacity=".18"/>
    </filter>
  </defs>
  <rect width="1200" height="675" fill="url(#sky)"/>
  <circle cx="930" cy="135" r="88" fill="#fff" opacity=".42"/>
  <path d="M0 448 C145 330 248 412 374 308 C515 191 680 305 790 214 C927 100 1042 235 1200 172 L1200 675 L0 675Z" fill="#fff" opacity=".22"/>
  <path d="M0 526 C176 458 318 544 470 458 C638 364 771 492 948 417 C1070 365 1136 394 1200 360 L1200 675 L0 675Z" fill="${dark}" opacity=".42"/>
  <g filter="url(#shadow)" opacity=".92">
    <path d="M176 478 L302 280 L426 478Z" fill="#fff" opacity=".78"/>
    <path d="M382 500 L545 244 L724 500Z" fill="#fff" opacity=".72"/>
    <path d="M668 490 L810 302 L950 490Z" fill="#fff" opacity=".68"/>
  </g>
  <rect x="72" y="74" width="620" height="162" rx="26" fill="#0f172a" opacity=".36"/>
  <text x="112" y="134" fill="#fff" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="28" font-weight="800" letter-spacing="3">HABITAT</text>
  <text x="112" y="194" fill="#fff" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="58" font-weight="900">${title}</text>
  <text x="112" y="575" fill="#fff" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="28" font-weight="800">${meta}</text>
  <text x="112" y="620" fill="#fff" opacity=".86" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="24">${bonus}</text>
</svg>`
}

function recipeSvg({ name, rarity, buff, palette }) {
  const [dark, main, light] = palette
  const title = escapeXml(shortTitle(name, 32))
  const meta = escapeXml(`${rarity} recipe`)
  const effect = escapeXml(shortTitle(buff, 46))

  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900" role="img" aria-label="${title}">
  <defs>
    <radialGradient id="bg" cx=".38" cy=".24" r=".85">
      <stop offset="0" stop-color="${light}"/>
      <stop offset=".5" stop-color="${main}"/>
      <stop offset="1" stop-color="${dark}"/>
    </radialGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="22" stdDeviation="22" flood-color="#000" flood-opacity=".24"/>
    </filter>
  </defs>
  <rect width="900" height="900" fill="url(#bg)"/>
  <circle cx="720" cy="170" r="118" fill="#fff" opacity=".18"/>
  <circle cx="160" cy="720" r="180" fill="#fff" opacity=".12"/>
  <g filter="url(#shadow)">
    <path d="M260 500 C260 390 350 330 450 330 C550 330 640 390 640 500 C640 622 555 700 450 700 C345 700 260 622 260 500Z" fill="#fff" opacity=".9"/>
    <path d="M308 470 C400 510 504 510 592 470" fill="none" stroke="${dark}" stroke-width="24" stroke-linecap="round" opacity=".55"/>
    <path d="M360 318 C346 230 390 188 450 182 C510 188 554 230 540 318" fill="none" stroke="#fff" stroke-width="42" stroke-linecap="round" opacity=".82"/>
    <circle cx="370" cy="532" r="22" fill="${main}" opacity=".78"/>
    <circle cx="462" cy="575" r="18" fill="${main}" opacity=".72"/>
    <circle cx="522" cy="512" r="24" fill="${main}" opacity=".68"/>
  </g>
  <text x="70" y="92" fill="#fff" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="30" font-weight="900" letter-spacing="3">RECIPE</text>
  <text x="70" y="152" fill="#fff" opacity=".88" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="26" font-weight="800">${meta}</text>
  <text x="70" y="790" fill="#fff" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="54" font-weight="900">${title}</text>
  <text x="70" y="840" fill="#fff" opacity=".84" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="24">${effect}</text>
</svg>`
}

function main() {
  const datasets = ['src/data', 'public/data']
  for (const folder of datasets) {
    for (const file of ['news.json', 'guides.json', 'pokemon.json', 'habitats.json', 'recipes.json']) {
      const full = path.join(ROOT, folder, file)
      const text = fs.readFileSync(full, 'utf8').replace(/Pok\u8305mon/g, 'Pokémon')
      fs.writeFileSync(full, text, 'utf8')
    }
  }

  const news = readJson(path.join(ROOT, 'src/data/news.json'))
  const guides = readJson(path.join(ROOT, 'src/data/guides.json'))
  const pokemon = readJson(path.join(ROOT, 'src/data/pokemon.json'))
  const habitats = readJson(path.join(ROOT, 'src/data/habitats.json'))
  const recipes = readJson(path.join(ROOT, 'src/data/recipes.json'))

  const newsTargets = news
  const guideTargets = guides
  const pokemonTargets = pokemon
  const habitatTargets = habitats
  const recipeTargets = recipes

  for (const item of newsTargets) {
    const imageUrl = `/images/news/${item.slug}.svg`
    writeSvg(
      path.join(ROOT, 'public', imageUrl),
      coverSvg({
        title: item.title,
        kicker: item.category,
        palette: colors[item.category] || colors.announcement,
        motif: item.category === 'event' ? 'map' : 'spark',
      })
    )
    item.image_url = imageUrl
    item.image_alt = `${item.title} illustrated news cover`
  }

  for (const item of guideTargets) {
    const imageUrl = `/images/guides/${item.slug}.svg`
    writeSvg(
      path.join(ROOT, 'public', imageUrl),
      coverSvg({
        title: item.title,
        kicker: item.category,
        palette: colors[item.category] || colors.guides,
        motif: item.category === 'guides' || item.category === 'farming' ? 'map' : 'spark',
      })
    )
    item.image_url = imageUrl
    item.image_alt = `${item.title} illustrated guide cover`
  }

  for (const item of pokemonTargets) {
    const primaryType = String(item.type).split('/')[0]
    const imageUrl = `/images/pokemon/${slugify(item.name)}.svg`
    writeSvg(
      path.join(ROOT, 'public', imageUrl),
      pokemonSvg({
        name: item.name,
        type: item.type,
        rarity: item.rarity,
        specialty: item.specialty,
        palette: colors[primaryType] || colors.Normal,
      })
    )
    item.image_url = imageUrl
    item.image_alt = `${item.name} illustrated Pokemon portrait`
  }

  for (const item of habitatTargets) {
    const imageUrl = `/images/habitats/${item.id}-${slugify(item.name)}.svg`
    writeSvg(
      path.join(ROOT, 'public', imageUrl),
      habitatSvg({
        name: item.name,
        weather: item.weather,
        difficulty: item.difficulty,
        resourceBonus: item.resource_bonus,
        palette: colors[item.difficulty] || colors.habitat,
      })
    )
    item.image_url = imageUrl
    item.image_alt = `${item.name} habitat landscape`
  }

  for (const item of recipeTargets) {
    const imageUrl = `/images/recipes/${item.id}-${slugify(item.name)}.svg`
    writeSvg(
      path.join(ROOT, 'public', imageUrl),
      recipeSvg({
        name: item.name,
        rarity: item.rarity,
        buff: item.buff,
        palette: colors[item.rarity] || colors.recipe,
      })
    )
    item.image_url = imageUrl
    item.image_alt = `${item.name} recipe illustration`
  }

  for (const folder of datasets) {
    const newsData = readJson(path.join(ROOT, folder, 'news.json')).map((item) => {
      const updated = newsTargets.find((target) => target.id === item.id)
      return updated ? { ...item, image_url: updated.image_url, image_alt: updated.image_alt } : item
    })
    const guideData = readJson(path.join(ROOT, folder, 'guides.json')).map((item) => {
      const updated = guideTargets.find((target) => target.id === item.id)
      return updated ? { ...item, image_url: updated.image_url, image_alt: updated.image_alt } : item
    })
    const pokemonData = readJson(path.join(ROOT, folder, 'pokemon.json')).map((item) => {
      const updated = pokemonTargets.find((target) => target.id === item.id)
      return updated ? { ...item, image_url: updated.image_url, image_alt: updated.image_alt } : item
    })
    const habitatData = readJson(path.join(ROOT, folder, 'habitats.json')).map((item) => {
      const updated = habitatTargets.find((target) => target.id === item.id)
      return updated ? { ...item, image_url: updated.image_url, image_alt: updated.image_alt } : item
    })
    const recipeData = readJson(path.join(ROOT, folder, 'recipes.json')).map((item) => {
      const updated = recipeTargets.find((target) => target.id === item.id)
      return updated ? { ...item, image_url: updated.image_url, image_alt: updated.image_alt } : item
    })
    writeJson(path.join(ROOT, folder, 'news.json'), newsData)
    writeJson(path.join(ROOT, folder, 'guides.json'), guideData)
    writeJson(path.join(ROOT, folder, 'pokemon.json'), pokemonData)
    writeJson(path.join(ROOT, folder, 'habitats.json'), habitatData)
    writeJson(path.join(ROOT, folder, 'recipes.json'), recipeData)
  }
}

main()
