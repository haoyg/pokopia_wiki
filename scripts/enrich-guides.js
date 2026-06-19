const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^﻿/, ''))
}

const guides = readJson('src/data/guides.json')
const pokemon = readJson('src/data/pokemon.json')
const habitats = readJson('src/data/habitats.json')

const pokemonById = new Map(pokemon.map((item) => [item.id, item]))
const habitatById = new Map(habitats.map((item) => [item.id, item]))

function csv(value) {
  return String(value || '').split(',').map((item) => item.trim()).filter(Boolean)
}

const catchContent = {
  'voltscale-catch-guide': {
    content: 'Voltscale is the Electric/Dragon legendary at the end of Windmill Plains. Windmill Plains is a medium-difficulty habitat unlocked around level 10, and Voltscale requires a Thunderstorm weather window to appear. The route branches toward Voltscale after the Zaprat and Mechabit sections. Players who do not bring Lightning Bug tend to waste multiple runs scouting the wrong branch.\n\nVoltscale is worth targeting because it covers the rare Dragon typing for team diversity and drops materials relevant to Electric and Dragon build paths. It is not a necessity for early progression, but players who want a strong late-game Electric attacker need to commit to farming it properly.',
    answer: 'Voltscale is a legendary Electric/Dragon Attacker that spawns during Night in Thunderstorm weather at Windmill Plains. Bring Lightning Bug and wait for Thunderstorm before entering. It rewards players who plan around weather windows over quick-grab runs.',
    steps: [
      'Check the weather forecast and confirm Thunderstorm is active before heading to Windmill Plains.',
      'Enter Windmill Plains and clear the early Zaprat and Mechabit sections to reach the Voltscale branch.',
      'Use Lightning Bug at the Voltscale branch only after confirming Thunderstorm is still active.',
      'Voltscale appears as a rare branch encounter — do not spend Lightning Bug on scout runs.',
      'Catch Voltscale during the Thunderstorm window and exit before the weather shifts.',
      'If Thunderstorm ends mid-route, leave and wait for the next weather cycle rather than continuing.'
    ],
    recommended_setup: [
      'Recipe: Lightning Bug — increases Electric spawn rate, essential for Voltscale.',
      'Weather: Thunderstorm — non-negotiable. Only enter during Thunderstorm.',
      'Route note: Skip the metal branch detour unless you specifically need Mechabit drops.',
      'Backup: Bring a second Lightning Bug in case the first run fails and weather resets.'
    ],
    common_mistakes: [
      'Entering Windmill Plains during Windy instead of waiting for Thunderstorm — Voltscale does not spawn in Windy weather.',
      'Using Lightning Bug on the first scout run instead of saving it for a confirmed encounter.',
      'Continuing the route after Thunderstorm ends, expecting Voltscale to still appear.'
    ]
  },
  'shadowclaw-catch-guide': {
    content: 'Shadowclaw is the Dark/Ghost legendary found in Shadow Marsh, one of the hardest habitats in Pokopia. Most players encounter Shadow Marsh around level 25, which is also when Shadowclaw becomes relevant for endgame builds. Shadow Marsh is hard not because of individual fights but because the route is long and the Stormy weather requirement makes timing unpredictable.\n\nShadowclaw is a Ghost/Dark Assassin that rewards players who plan exits carefully. The route has multiple Ghost and Dark spawns, and wasting Void Fruit on the wrong branch is the most common mistake. Shadowclaw competes with Shados, which is easier to farm but lower in material value.',
    answer: 'Shadowclaw is a legendary Dark/Ghost Assassin that spawns during Night in Stormy weather at Shadow Marsh. Enter only during Night and Stormy, spend Void Fruit only at the Shadowclaw branch, and have a clear exit condition before committing.',
    steps: [
      'Confirm Night and Stormy are both active — Shadowclaw needs both conditions simultaneously.',
      'Enter Shadow Marsh and move past the early Shados section without spending Void Fruit.',
      'Reach the Shadowclaw branch deep in the route and use Void Fruit only when confirmed.',
      'Shadowclaw is aggressive — catch quickly and exit to avoid route pressure.',
      'Leave immediately after catching Shadowclaw unless you specifically need Shadow Stone or Kings Rock.',
      'Do not attempt Shadowclaw runs during Foggy weather — it triggers the wrong branch.'
    ],
    recommended_setup: [
      'Recipe: Ghost Veil — supports Ghost type pressure but does not replace Void Fruit for attraction.',
      'Weather: Night + Stormy — both required. Check forecast before every attempt.',
      'Route note: Shados appears earlier in the same habitat — do not confuse the two spawn windows.',
      'Exit rule: Leave after catching Shadowclaw or when Stormy weather ends.'
    ],
    common_mistakes: [
      'Spending Void Fruit on the Shados branch instead of saving it for Shadowclaw.',
      'Entering Shadow Marsh during Night but in Foggy or Clear weather — Shadowclaw needs Stormy.',
      'Continuing the route after catching Shadowclaw without a specific material goal.'
    ]
  },
  'primordion-catch-guide': {
    content: 'Primordion is the Dragon/Ground Tank legendary found in Muddy River, an easy habitat accessible from level 8. Unlike most legendaries that require hard habitats and specific weather, Muddy River is forgiving and Rain is a common weather state. This makes Primordion the most accessible legendary for players building their first endgame team.\n\nPrimordion is a Tank, not a farmer. Players who use it for cheap material farming misunderstand its role. It is worth catching because Dragon/Ground typing covers both offensive and defensive build paths, and the Rain weather for Muddy River is easy to find.',
    answer: 'Primordion is a legendary Dragon/Ground Tank that spawns during Any time in Rain weather at Muddy River. Rain is common — check the forecast and enter whenever Rain is active. It is the easiest legendary to plan around.',
    steps: [
      'Check weather — enter Muddy River whenever Rain is active, no specific time needed.',
      'Clear the early Mudkipz section to reach the Primordion branch.',
      'Use Golden Fish at the Primordion branch — it is the key attraction bait for this route.',
      'Primordion appears as a rare route encounter — be prepared for a longer farming session.',
      'Exit after catching Primordion or when Rain weather ends.',
      'Muddy River is easy difficulty — focus on route efficiency over survival.'
    ],
    recommended_setup: [
      'Recipe: Muddy Swirl — increases ground and water spawn rate, useful for the full route.',
      'Weather: Rain — the most common weather state, making this the easiest legendary to plan.',
      'Route note: Mudkipz and Stealthfin appear in the same habitat — Primordion comes from the deeper branch.',
      'Exit: Rain weather is predictable — set a clear material goal before entering.'
    ],
    common_mistakes: [
      'Treating Primordion as a cheap farmer instead of a Tank — it is most useful for Dragon Scale runs.',
      'Using Golden Fish during the Mudkipz branch instead of waiting for the Primordion branch.',
      'Entering Muddy River during Clear or Sunny weather — Rain is needed for Primordion.'
    ]
  },
  'flamexor-catch-guide': {
    content: 'Flamexor is the Fire/Steel Tank legendary found in Volcanic Cave, a hard habitat typically reached around level 15. Volcanic Cave is challenging because it combines long routes, dangerous encounters, and a specific Clear weather requirement at Night. Most players encounter Flamexor while farming cheaper Fire Pokemon like Pikafire or Emberal.\n\nFlamexor is worth the extra effort because Fire/Steel typing provides resistance to common attack types and the Legendary Scale material is one of the most valuable late-game crafting items. The tradeoff is that Volcanic Cave at Night in Clear weather is a serious commitment.',
    answer: 'Flamexor is a legendary Fire/Steel Tank that spawns during Night in Clear weather at Volcanic Cave. It is the hardest legendary to plan around due to habitat difficulty and strict weather requirements, but Legendary Scale makes it essential for endgame builds.',
    steps: [
      'Confirm Night and Clear weather before entering Volcanic Cave — both are required.',
      'Navigate past the Pikafire and Emberal sections to reach the Flamexor branch.',
      'Use Iron Ore at the Flamexor branch — Fire Steel Pokemon are attracted to mineral bait.',
      'Volcanic Cave is hard difficulty — come prepared with healing items for a long route.',
      'Catch Flamexor and exit — the route is too long to combine with other goals.',
      'Do not attempt this during the day — Flamexor only appears at Night in Clear weather.'
    ],
    recommended_setup: [
      'Recipe: Fire Boost — increases Fire damage but does not affect spawn rate; Iron Ore is the key bait.',
      'Weather: Night + Clear — both non-negotiable.',
      'Route note: Pikafire and Emberal appear in the same habitat — do not confuse their spawn branches.',
      'Exit: Have a clear material goal — Legendary Scale or exit after catching Flamexor.'
    ],
    common_mistakes: [
      'Entering Volcanic Cave during Day in Clear weather — Flamexor is Night-only.',
      'Using Iron Ore on the Pikafire or Emberal branch instead of saving it for the legendary section.',
      'Attempting Volcanic Cave without enough healing items — the route is too long for improvisation.'
    ]
  },
  'lunaflare-catch-guide': {
    content: 'Lunaflare is the Ghost/Fire legendary also found in Shadow Marsh. Unlike Shadowclaw, which is a pure Assassin, Lunaflare is an Attacker that combines Ghost pressure with Fire coverage. Both legendaries share the same habitat and weather requirements, so players pursuing one often scout the other by accident.\n\nLunaflare is worth targeting when your build needs Ghost type control with Fire type burst. It is less common than Shadowclaw in the route rotation, so players specifically farming Lunaflare need to be prepared for longer sessions.',
    answer: 'Lunaflare is a legendary Ghost/Fire Attacker that spawns during Night in Stormy weather at Shadow Marsh, sharing habitat and weather with Shadowclaw. Use Soul Dust for attraction and plan around its deeper route position.',
    steps: [
      'Confirm Night and Stormy are both active before entering Shadow Marsh.',
      'Move past the Shados section and the Shadowclaw branch without spending Soul Dust.',
      'Reach the Lunaflare branch — it appears deeper in Shadow Marsh than Shadowclaw.',
      'Use Soul Dust at the Lunaflare branch only after the route is confirmed.',
      'Lunaflare is aggressive — exit after catching rather than continuing the deep route.',
      'If Shadowclaw appears instead, decide whether to catch it or reset for Lunaflare.'
    ],
    recommended_setup: [
      'Recipe: Ghost Veil — supports Ghost type attraction but Soul Dust is the primary bait.',
      'Weather: Night + Stormy — both required.',
      'Route note: Shadowclaw and Lunaflare share the same habitat but appear at different route positions.',
      'Decision: If both appear, Shadowclaw is higher priority for material value unless you specifically need Lunaflare.'
    ],
    common_mistakes: [
      'Spending Soul Dust on the Shadowclaw branch instead of waiting for Lunaflare deeper in the route.',
      'Confusing Lunaflare and Shadowclaw spawn positions and wasting bait on the wrong encounter.',
      'Entering Shadow Marsh during Night but in Foggy or Clear weather — Stormy is required.'
    ]
  },
  'leafon-catch-guide': {
    content: 'Leafon is a rare Grass/Poison Assassin found in Forest Valley, the easiest habitat in the game and the starting area for most players. Forest Valley has Cloudy and Foggy weather windows, and Leafon appears as a rare branch in the later section at Night during Foggy weather. Leafon is the most accessible rare Pokemon for attentive players who monitor weather carefully.\n\nLeafon is worth catching because Grass/Poison gives it excellent coverage for early and mid-game route planning. Players who grab Leafon early have an easier time with Forest Valley and can use it as a lead for Poison-type content later.',
    answer: 'Leafon is a rare Grass/Poison Assassin that spawns during Night in Foggy weather at Forest Valley. Forest Valley is easy — focus on weather timing rather than survival. Leafon is the most accessible rare Pokemon in the game.',
    steps: [
      'Check weather — Leafon appears in Forest Valley during Foggy weather at Night.',
      'Enter Forest Valley and move past the early Bulbin and Thornvine sections.',
      'Use Grass type bait for Leafon attraction — specific food listed on the Pokemon page.',
      'Leafon appears as a rare branch encounter — multiple runs may be needed.',
      'Exit after catching or when Foggy weather ends.',
      'Forest Valley is easy difficulty — bring Honey Cake for capture rate rather than survival items.'
    ],
    recommended_setup: [
      'Recipe: Grass Heal — useful for the full Forest Valley route but does not replace attraction bait.',
      'Weather: Foggy at Night — Cloudy weather will not trigger Leafon.',
      'Route note: Thornvine appears earlier in Forest Valley — do not confuse it with the Leafon branch.',
      'Exit: Weather-based — exit when Foggy period ends.'
    ],
    common_mistakes: [
      'Entering Forest Valley during Cloudy weather — Leafon requires Foggy.',
      'Confusing Thornvine (common) with Leafon (rare) and wasting bait on the wrong branch.',
      'Using capture items meant for Pikafire or other Fire Pokemon — Leafon needs Grass-type bait.'
    ]
  },
  'shados-catch-guide': {
    content: 'Shados is a rare Ghost Assassin found in Shadow Marsh. Unlike Shadowclaw which is legendary, Shados is the accessible Ghost type entry point for players building Ghost teams. Shadow Marsh is hard to navigate, but Shados appears earlier in the route than Shadowclaw, making it a realistic target before committing to full legendary farming.\n\nShados is worth catching early because Ghost type Pokemon are rare in most builds and having one opens up route planning options for Shadow Marsh, Dark Cavern, and Nightmare Forest.',
    answer: 'Shados is a rare Ghost Assassin that spawns during Night in Stormy weather at Shadow Marsh. It appears earlier in the route than Shadowclaw and is the practical entry point for Ghost type builds.',
    steps: [
      'Confirm Night and Stormy weather are both active — Shadow Marsh demands specific conditions.',
      'Enter Shadow Marsh and clear toward the Shados section, which appears before the Shadowclaw branch.',
      'Use Void Fruit for Shados attraction — it is the primary Ghost type bait for this habitat.',
      'Shados appears as a route encounter — the route is hard, so prepare healing items.',
      'Catch Shados and decide whether to continue for Shadowclaw or exit.',
      'Shadow Marsh is hard — do not combine Shados farming with other goals on first attempts.'
    ],
    recommended_setup: [
      'Recipe: Ghost Veil — supports Ghost spawn rate in Shadow Marsh.',
      'Weather: Night + Stormy — required for Shados.',
      'Route note: Shados appears before the Shadowclaw branch — do not go too deep expecting legendary spawns early.',
      'Exit: Exit after Shados catch unless you have enough items to continue safely.'
    ],
    common_mistakes: [
      'Entering Shadow Marsh without Stormy weather — Shados does not appear in Foggy or Clear.',
      'Confusing the Shados branch with the Shadowclaw branch and wasting Void Fruit.',
      'Attempting Shadow Marsh without healing items — the route is long and hard.'
    ]
  },
  'crystion-catch-guide': {
    content: 'Crystion is a rare Crystal/Fairy Attacker found in Gemstone Canyon, a medium difficulty habitat unlocked around level 12. Gemstone Canyon requires Clear weather, one of the most common weather states, making Crystion relatively easy to farm compared to Pokemon requiring rarer weather conditions.\n\nCrystion is worth targeting because Crystal/Fairy typing is rare in most starter teams and gives players access to Fairy type route options. The Gemstone Canyon route also yields valuable mining materials alongside Crystal Pokemon encounters.',
    answer: 'Crystion is a rare Crystal/Fairy Attacker that spawns during Night in Clear weather at Gemstone Canyon. Clear weather is common — plan around the Night window for best results.',
    steps: [
      'Confirm Clear weather and Night time before entering Gemstone Canyon.',
      'Navigate the Gemstone Canyon route toward the Crystalwing and Crystion section.',
      'Use Crystal bait for Crystion attraction — specific food listed on the Pokemon page.',
      'Crystion appears as a rare route encounter in the crystal section of Gemstone Canyon.',
      'Exit after catching or when Clear weather period ends.',
      'Gemstone Canyon is medium difficulty — bring healing items for the longer route.'
    ],
    recommended_setup: [
      'Recipe: Lucky Charm — increases rare spawn chance in Gemstone Canyon.',
      'Weather: Night + Clear — both required.',
      'Route note: Crystalwing appears in the same section as Crystion — both are worth targeting.',
      'Exit: Clear weather is predictable — exit after material goals are met.'
    ],
    common_mistakes: [
      'Entering Gemstone Canyon during Cloudy or Rain weather — Crystion requires Clear.',
      'Confusing Crystalwing spawn with Crystion — bring the right bait for each.',
      'Staying past Clear weather without catching — the window will close.'
    ]
  },
  'bronzorm-catch-guide': {
    content: 'Bronzorm is a rare Steel/Psychic Support found in Ancient Ruins, a hard habitat unlocked around level 30. Ancient Ruins is one of the last habitats players encounter, making Bronzorm a late-game catch rather than an early acquisition. The Steel/Psychic combination gives it excellent defensive utility in team builds focused on coverage and resistance.\n\nBronzorm is worth targeting when you are building a Steel type team or need Psychic coverage for hard late-game routes. Ancient Ruins is demanding — players should not attempt it without significant route planning and a full team.',
    answer: 'Bronzorm is a rare Steel/Psychic Support that spawns during Day in Cloudy weather at Ancient Ruins. Ancient Ruins is hard and unlocked at level 30 — plan this catch as a late-game milestone.',
    steps: [
      'Confirm Day and Cloudy weather before entering Ancient Ruins — both required.',
      'Ancient Ruins is hard difficulty — come prepared with full healing items and route knowledge.',
      'Navigate to the Bronzorm section, which appears in the mid-to-deep portion of the route.',
      'Use Steel type bait for Bronzorm attraction — specific food listed on the Pokemon page.',
      'Catch Bronzorm and exit — Ancient Ruins is too long to combine multiple goals.',
      'Do not attempt Ancient Ruins without meeting the level 30 unlock requirement.'
    ],
    recommended_setup: [
      'Recipe: Steel Shell — supports defense route planning but is not the attraction bait.',
      'Weather: Day + Cloudy — both required.',
      'Route note: Ancient Ruins has multiple branches — Bronzorm appears in the support section.',
      'Exit: Leave after catching or when Cloudy weather ends.'
    ],
    common_mistakes: [
      'Entering Ancient Ruins below level 30 — the habitat is locked until level requirement is met.',
      'Confusing Bronzorm spawn timing with Ironclaw — they share Steel typing but different route positions.',
      'Not bringing enough healing items — Ancient Ruins is hard and long.'
    ]
  },
  'stealthfin-catch-guide': {
    content: 'Stealthfin is a rare Water/Dark Assassin found in Muddy River, the same easy habitat as Primordion and Mudkipz. Despite sharing habitat with some of the most accessible Pokemon in the game, Stealthfin appears in the deeper route section and requires Rain weather, making it slightly harder to farm than early Mudkipz encounters.\n\nStealthfin is worth catching because Water/Dark gives it excellent coverage for routes that require both offensive water pressure and dark type utility. It is easier to farm than legendary competitors and serves as a strong mid-game Assassin.',
    answer: 'Stealthfin is a rare Water/Dark Assassin that spawns during Night in Rain weather at Muddy River. Rain is common — plan around the Night window for best Stealthfin encounters.',
    steps: [
      'Confirm Night and Rain weather before entering Muddy River.',
      'Navigate past the Mudkipz section to reach the Stealthfin branch deeper in the route.',
      'Use Dark type bait for Stealthfin attraction — specific food listed on the Pokemon page.',
      'Stealthfin appears as a rare route encounter — multiple runs may be needed.',
      'Exit after catching or when Rain weather ends.',
      'Muddy River is easy — focus on weather timing rather than survival.'
    ],
    recommended_setup: [
      'Recipe: Muddy Swirl — increases Water and Ground spawn rate for the full Muddy River route.',
      'Weather: Night + Rain — both required.',
      'Route note: Mudkipz appears earlier — do not confuse the two spawn branches.',
      'Exit: Rain weather is predictable — set a material goal before entering.'
    ],
    common_mistakes: [
      'Entering Muddy River during Day instead of Night — Stealthfin requires Night spawn window.',
      'Confusing Stealthfin with Mudkipz and wasting bait on the wrong branch.',
      'Staying in the route after Rain ends — the spawn window will have closed.'
    ]
  },
  'frostbite-catch-guide': {
    content: 'Frostbite is a rare Ice/Ghost Assassin found in Frost Peak, a medium difficulty habitat unlocked around level 20. Frost Peak requires Snow weather, which is less common than Rain or Clear, making Frostbite a Pokemon that requires active weather monitoring rather than casual route planning.\n\nFrostbite is worth targeting for Ice/Ghost Assassin coverage in late-game builds. The Ice/Ghost combination is strong against Dragon, Flying, and Grass types, and Frostbite serves as the practical alternative to legendary Frost Peak encounters.',
    answer: 'Frostbite is a rare Ice/Ghost Assassin that spawns during Night in Snow weather at Frost Peak. Snow weather is less common — monitor the forecast actively and plan Frost Peak sessions around confirmed Snow windows.',
    steps: [
      'Confirm Snow weather before planning a Frost Peak run — this is the gate for Frostbite.',
      'Enter Frost Peak and navigate past the early Tidlet and Glacior sections.',
      'Use Ice type bait for Frostbite attraction — specific food listed on the Pokemon page.',
      'Frostbite appears as a rare route encounter in the deep section of Frost Peak.',
      'Frost Peak is medium difficulty but cold routes can be long — bring appropriate supplies.',
      'Exit after catching or when Snow weather ends.'
    ],
    recommended_setup: [
      'Recipe: Ice Armor — supports cold route survival but is not the attraction bait.',
      'Weather: Night + Snow — both required.',
      'Route note: Tidlet and Glacior appear earlier in Frost Peak — Frostbite is deeper.',
      'Exit: Snow weather is less predictable than Rain or Clear — exit when window closes.'
    ],
    common_mistakes: [
      'Entering Frost Peak during Snow but in Day — Frostbite requires Night.',
      'Not monitoring Snow weather before planning the run — Snow windows are shorter.',
      'Confusing the Frostbite branch with the Glacior branch and wasting bait.'
    ]
  },
  'snorizard-catch-guide': {
    content: 'Snorizard is a rare Dragon/Ice Attacker found in Frost Peak, sharing habitat with Tidlet, Glacior, and Frostbite. Frost Peak requires Snow weather, and Snorizard appears in the deep route section alongside Ice type encounters. Dragon/Ice is a powerful offensive combination that covers Flying, Grass, Ground, and Dragon matchups effectively.\n\nSnorizard is worth catching because Dragon/Ice is an uncommon combination that gives teams strong neutral coverage. It is the practical alternative to Primordion for players who want Dragon type without committing to Muddy River Rain farming.',
    answer: 'Snorizard is a rare Dragon/Ice Attacker that spawns during Any time in Snow weather at Frost Peak. Snow weather is the gate — enter whenever Snow is active. Dragon/Ice coverage makes it worth the cold route commitment.',
    steps: [
      'Confirm Snow weather before entering Frost Peak — non-negotiable for Snorizard.',
      'Navigate the full Frost Peak route toward the deep section where Snorizard appears.',
      'Use Dragon type bait for Snorizard attraction — specific food on the Pokemon page.',
      'Snorizard appears alongside Frostbite in the deep section — bring bait for both.',
      'Frost Peak is medium difficulty — healing items are needed for the long cold route.',
      'Exit after catching both target Pokemon or when Snow weather ends.'
    ],
    recommended_setup: [
      'Recipe: Ice Armor — supports the cold route but Dragon Bait is the key attraction.',
      'Weather: Snow — required. Any time of day is acceptable.',
      'Route note: Snorizard and Frostbite share the deep section of Frost Peak — both can be targeted in one run.',
      'Exit: Snow weather windows are shorter — set priorities before entering.'
    ],
    common_mistakes: [
      'Entering Frost Peak without Snow weather — Snorizard does not appear in Clear or Cloudy.',
      'Confusing Snorizard with Glacior or Tidlet spawn branches — each has a different bait.',
      'Not bringing enough healing items for a long Frost Peak route.'
    ]
  },
  'mysticat-catch-guide': {
    content: 'Mysticat is a rare Psychic/Fairy Support found in Fairy Glen, a medium difficulty habitat unlocked around level 18. Fairy Glen requires Clear weather, which is common, making Mysticat one of the more accessible rare Pokemon for mid-game players. Fairy Glen is a smaller habitat with good spawn predictability, and Mysticat appears in the main route section rather than a hidden branch.\n\nMysticat is worth catching because Psychic/Fairy gives it excellent support utility with strong defensive typing. It is the practical support option for teams that want Fairy coverage without committing to harder late-game habitats.',
    answer: 'Mysticat is a rare Psychic/Fairy Support that spawns during Night in Clear weather at Fairy Glen. Clear weather is common — monitor the Night window. Fairy Glen is medium difficulty and relatively compact.',
    steps: [
      'Confirm Clear weather and Night time before entering Fairy Glen.',
      'Navigate Fairy Glen toward the Mysticat section — it appears in the main route.',
      'Use Fairy type bait for Mysticat attraction — specific food on the Pokemon page.',
      'Mysticat is a Support — plan your team around its support role rather than expecting damage.',
      'Exit after catching or when Clear weather period ends.',
      'Fairy Glen is medium difficulty — bring healing items for the route.'
    ],
    recommended_setup: [
      'Recipe: Lucky Charm — increases rare spawn chance in Fairy Glen.',
      'Weather: Night + Clear — both required.',
      'Route note: Fairy Glen is compact — Mysticat appears in the main route, not a hidden branch.',
      'Exit: Clear weather is predictable — exit when material goals are met.'
    ],
    common_mistakes: [
      'Entering Fairy Glen during Cloudy or Rain — Mysticat requires Clear.',
      'Using the wrong Fairy bait — Mysticat has a specific food preference different from other Fairy Glen Pokemon.',
      'Not building a team around Mysticat as a Support — it is not an attacker.'
    ]
  }
}

const unlockContent = {
  'how-to-unlock-frost-peak': {
    content: 'Frost Peak is a medium difficulty habitat unlocked at level 20 and the primary source of Ice type Pokemon in Pokopia. The unlock requirement of reaching level 20 is designed to ensure players have enough route knowledge and team strength to handle Snow weather conditions and longer cold routes. Most players reach Frost Peak while farming Forest Valley and Crystal Lake first.\n\nFrost Peak is worth unlocking early because it gives access to Tidlet, Glacior, Frostbite, and Snorizard — a strong set of Ice type Pokemon that cover Flying, Grass, Dragon, and Ground matchups. Ice type is one of the most versatile offensive typings in the game, and building an Ice team from Frost Peak is a common mid-game goal.',
    answer: 'Frost Peak unlocks at level 20 and is the primary Ice type habitat. Enter during Snow weather for best results. Recommended for players who have completed Forest Valley and Crystal Lake routes and are ready for medium difficulty content.',
    steps: [
      'Reach level 20 through Forest Valley and Crystal Lake farming.',
      'Confirm Snow weather is in the forecast before planning the first Frost Peak run.',
      'Enter Frost Peak with healing items for a medium difficulty habitat.',
      'Focus first on the early Tidlet section to learn the route layout.',
      'Return to Frost Peak during Snow weather to begin farming Ice type Pokemon.',
      'Frost Peak is compact — it can be cleared in one focused session once the route is known.'
    ],
    recommended_setup: [
      'Recommended level: 20 — do not attempt before reaching this level.',
      'Weather: Snow — check forecast before every run.',
      'First goal: Learn the Tidlet and Glacior route sections before attempting Frostbite or Snorizard.',
      'Recipe: Ice Armor — supports cold route survival.'
    ],
    common_mistakes: [
      'Entering Frost Peak before level 20 — the habitat is locked.',
      'Attempting Frost Peak during Clear or Cloudy weather instead of waiting for Snow.',
      'Not bringing healing items — the cold route is longer than early habitats.'
    ]
  },
  'how-to-unlock-shadow-marsh': {
    content: 'Shadow Marsh is a hard difficulty habitat unlocked at level 25 and the primary source of Ghost and Dark type Pokemon, including the legendary Shadowclaw. Shadow Marsh requires Night and Stormy weather, which makes it one of the most demanding habitats to plan around — both conditions must be active simultaneously.\n\nShadow Marsh is worth unlocking as a late-game objective because Ghost and Dark types provide coverage against some of the hardest Pokemon in the game. The route is long and dangerous, and players should not attempt it without a solid team and clear material goals.',
    answer: 'Shadow Marsh unlocks at level 25 and is the primary Ghost and Dark type habitat. It requires Night and Stormy weather — both non-negotiable. This is a late-game commitment. Come with a full team, healing items, and a clear exit plan.',
    steps: [
      'Reach level 25 through Frost Peak and Thunder Arena content.',
      'Monitor the weather forecast and wait for a Night + Stormy window.',
      'Enter Shadow Marsh with full healing items — the route is hard and long.',
      'Start with the Shados section to learn the early route before attempting Shadowclaw.',
      'Use Void Fruit only at confirmed spawn branches — do not waste bait on scout runs.',
      'Set a clear exit condition before entering — Shadow Marsh is too demanding for open-ended runs.'
    ],
    recommended_setup: [
      'Recommended level: 25 — the habitat is locked before this.',
      'Weather: Night + Stormy — both required simultaneously.',
      'Recipe: Ghost Veil — increases Ghost spawn rate.',
      'Bait: Void Fruit — primary Ghost and Dark attraction bait.',
      'Team: Minimum 4 Pokemon with healing items for a long hard route.'
    ],
    common_mistakes: [
      'Entering Shadow Marsh before level 25 — the habitat is locked.',
      'Waiting for Night but entering during Foggy or Clear weather — Stormy is required.',
      'Not having a clear exit plan — Shadow Marsh punishes indecision.',
      'Wasting Void Fruit on scout runs instead of confirmed encounters.'
    ]
  },
  'how-to-unlock-thunder-arena': {
    content: 'Thunder Arena is a hard difficulty habitat unlocked at level 22 and the primary source of Electric type Pokemon with high damage roles. Thunder Arena requires Thunderstorm weather, which is less common than Rain or Clear but more predictable than Snow or Stormy. Most players encounter Thunder Arena while farming Windmill Plains for Voltscale or Zaprat.\n\nThunder Arena is worth unlocking because Electric type Pokemon are strong early-to-mid game attackers and Speedsters. The habitat also connects to late-game Thunderstorm-based route planning for players building Electric or Dragon/Electric teams.',
    answer: 'Thunder Arena unlocks at level 22 and is the primary Electric type combat habitat. Enter during Thunderstorm weather for best results. Hard difficulty — come prepared with healing items and team coverage for Electric matchups.',
    steps: [
      'Reach level 22 through Frost Peak and Windmill Plains content.',
      'Confirm Thunderstorm weather before planning the first Thunder Arena run.',
      'Enter with a team prepared for Electric type combat and hard difficulty encounters.',
      'Learn the Zaprat and Voltscale sections before attempting the full Thunder Arena route.',
      'Use Lightning Bug during Thunderstorm for Electric spawn attraction.',
      'Exit after material goals are met — Thunder Arena is too demanding for extended sessions.'
    ],
    recommended_setup: [
      'Recommended level: 22 — do not attempt before reaching this level.',
      'Weather: Thunderstorm — required for Electric spawn attraction.',
      'Recipe: Thunder Strike — supports Electric damage route planning.',
      'Bait: Lightning Bug — primary Electric type attraction bait.',
      'Team: Electric attackers or Speedsters recommended.'
    ],
    common_mistakes: [
      'Entering Thunder Arena before level 22 — the habitat is locked.',
      'Attempting Thunder Arena during Windy or Rain instead of waiting for Thunderstorm.',
      'Not bringing enough healing items for hard difficulty Electric combat.'
    ]
  },
  'how-to-unlock-crystal-cave': {
    content: 'Crystal Cave is a medium difficulty habitat unlocked at level 16 and the primary source of Crystal type Pokemon. Crystal typing is rare in Pokopia and Crystal Cave is one of the few habitats where Crystal Pokemon appear consistently. The habitat requires Foggy weather, which is less common than Clear but more predictable than Stormy or Snow.\n\nCrystal Cave is worth unlocking because Crystal/Psychic and Crystal/Fairy combinations provide strong defensive and offensive coverage. Crystion and Crystalwing are the primary targets, and both are worth building around in mid-to-late game team compositions.',
    answer: 'Crystal Cave unlocks at level 16 and is the primary Crystal type habitat. Enter during Foggy weather. Medium difficulty — bring healing items and plan around Crystal and Psychic type spawns.',
    steps: [
      'Reach level 16 through Forest Valley, Crystal Lake, and Windmill Plains farming.',
      'Confirm Foggy weather before planning the Crystal Cave run.',
      'Enter with healing items for a medium difficulty habitat.',
      'Focus first on learning the Crystion spawn section.',
      'Return during Foggy weather to farm Crystal Pokemon.',
      'Crystal Cave is compact — the route can be cleared in one focused session.'
    ],
    recommended_setup: [
      'Recommended level: 16 — do not attempt before reaching this level.',
      'Weather: Foggy — required for Crystal spawns.',
      'Recipe: Lucky Charm — increases rare spawn chance.',
      'Bait: Crystal bait specific to target Pokemon — check Pokemon pages.',
      'First goal: Crystion and Crystalwing are the primary targets.'
    ],
    common_mistakes: [
      'Entering Crystal Cave before level 16 — the habitat is locked.',
      'Attempting Crystal Cave during Clear or Sunny weather instead of Foggy.',
      'Not bringing the correct Crystal type bait — each Crystal Pokemon has a specific preference.'
    ]
  },
  'how-to-unlock-sky-isles': {
    content: 'Sky Isles is a medium difficulty habitat unlocked at level 18 and the primary source of Flying type Pokemon. Sky Isles requires Windy weather, which is moderately common and predictable. The habitat is notable for its Breezel, Flamingo, and Tropius encounters — Flying types that provide strong neutral coverage and speed utility for team builds.\n\nSky Isles is worth unlocking because Flying type Pokemon are some of the best Speedsters and mid-game attackers in Pokopia. Sky Isles is also a prerequisite for players building Flying/Electric or Flying/Grass combinations, and the Flying High recipe is tied to Flying type route planning.',
    answer: 'Sky Isles unlocks at level 18 and is the primary Flying type habitat. Enter during Windy weather. Medium difficulty with moderate weather requirements — one of the more accessible medium habitats for Flying type builds.',
    steps: [
      'Reach level 18 through Frost Peak and Windmill Plains content.',
      'Confirm Windy weather before planning the Sky Isles run.',
      'Enter with a team prepared for Flying type encounters and medium difficulty routes.',
      'Learn the Breezel and Flamingo sections before attempting Tropius.',
      'Use Flying type bait for Sky Isles attraction — specific food on Pokemon pages.',
      'Exit after catching Flying type targets or when Windy weather ends.'
    ],
    recommended_setup: [
      'Recommended level: 18 — do not attempt before reaching this level.',
      'Weather: Windy — required for Flying spawn attraction.',
      'Recipe: Flying High — supports Flying damage route planning.',
      'Bait: Flying type bait specific to target Pokemon.',
      'First goal: Breezel is the most accessible target; Flamingo and Tropius are deeper.'
    ],
    common_mistakes: [
      'Entering Sky Isles before level 18 — the habitat is locked.',
      'Attempting Sky Isles during Calm or Cloudy weather instead of Windy.',
      'Confusing the Breezel section with the Tropius section and wasting bait.'
    ]
  }
}

let updated = 0

// Apply catch guide content
for (const slug of Object.keys(catchContent)) {
  const guide = guides.find(g => g.slug === slug)
  if (!guide) { console.log('NOT FOUND:', slug); continue }
  const data = catchContent[slug]
  guide.content = data.content
  guide.answer = data.answer
  guide.steps = data.steps
  guide.recommended_setup = data.recommended_setup
  guide.common_mistakes = data.common_mistakes
  updated++
  console.log(`Updated: ${slug} (content: ${data.content.length} chars)`)
}

// Apply unlock guide content
for (const slug of Object.keys(unlockContent)) {
  const guide = guides.find(g => g.slug === slug)
  if (!guide) { console.log('NOT FOUND:', slug); continue }
  const data = unlockContent[slug]
  guide.content = data.content
  guide.answer = data.answer
  guide.steps = data.steps
  guide.recommended_setup = data.recommended_setup
  guide.common_mistakes = data.common_mistakes
  updated++
  console.log(`Updated: ${slug} (content: ${data.content.length} chars)`)
}

fs.writeFileSync(path.join(root, 'src/data/guides.json'), JSON.stringify(guides, null, 2))
fs.writeFileSync(path.join(root, 'public/data/guides.json'), JSON.stringify(guides, null, 2))

console.log(`\nDone. Updated ${updated} guides. Total: ${guides.length}`)
