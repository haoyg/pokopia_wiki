type VerificationPlan = {
  status: string
  method: string
  checks: string[]
}

const firstBatch: Record<string, VerificationPlan> = {
  'how-to-build-first-house': {
    status: 'Official source checked; in-game screenshot pending',
    method: 'Nintendo News source review plus one fresh gameplay capture.',
    checks: ['Four walls, a door, and three furnishings are visible in the completed house.'],
  },
  'ditto-home-fast-travel-guide': {
    status: 'Official source checked; in-game screenshot pending',
    method: 'Nintendo News source review plus a capture of the Ditto Home fast-travel flow.',
    checks: ['Capture the home menu route after building a Ditto home.'],
  },
  'pokemon-center-pc-daily-routine': {
    status: 'Official source checked; in-game screenshot pending',
    method: 'Nintendo News source review plus a same-day PC menu capture.',
    checks: ['Record the visible daily challenges, shop, recipes, and stamp exchange options.'],
  },
  'storage-and-crafting-guide': {
    status: 'Official source checked; in-game screenshot pending',
    method: 'Nintendo News source review plus a workbench and nearby storage capture.',
    checks: ['Confirm that materials in the nearby storage box can be used at the workbench.'],
  },
  'pokedex-and-habitat-dex-guide': {
    status: 'Official source checked; in-game screenshot pending',
    method: 'Nintendo News source review plus Pokedex and Habitat Dex menu captures.',
    checks: ['Capture the Y filters and the search action for a selected Pokemon.'],
  },
  'food-powered-moves-guide': {
    status: 'Official source checked; in-game screenshot pending',
    method: 'Nintendo News source review plus a before-and-after terrain capture.',
    checks: ['Record the food interaction and the resulting Leafage terrain effect.'],
  },
  'strength-decoration-guide': {
    status: 'Official source checked; in-game screenshot pending',
    method: 'Nintendo News source review plus a short Strength push/pull capture.',
    checks: ['Capture one supported decoration object being repositioned with Strength.'],
  },
  'item-customization-guide': {
    status: 'Official source checked; in-game screenshot pending',
    method: 'Nintendo News source review plus a berry, Crush, and Smearguru capture.',
    checks: ['Record one berry-to-paint conversion and one item pattern or color change.'],
  },
  'town-visit-multiplayer-guide': {
    status: 'Official source checked; gameplay verification pending',
    method: 'Nintendo News and Nintendo Support review plus a Link Play flow capture.',
    checks: ['Confirm the PC path, Link Code behavior, player limit, and Spectator Mode state.'],
  },
  'palette-town-gameshare-guide': {
    status: 'Official source checked; gameplay verification pending',
    method: 'Nintendo News and Nintendo Support review plus a Palette Town GameShare capture.',
    checks: ['Confirm Palette Town access, Spectator Mode, and local versus online GameShare steps.'],
  },
  'cloud-island-virtual-mode-guide': {
    status: 'Official source checked; gameplay verification pending',
    method: 'Nintendo News and Nintendo Support review plus a Cloud Island settings capture.',
    checks: ['Confirm the separate bag, shared Pokedex, address flow, and Virtual Mode restriction.'],
  },
  'dive-unlock-requirements-guide': {
    status: 'Official source checked; update-day verification pending',
    method: 'Official Pokemon Pokopia update pages plus a post-update requirement capture.',
    checks: ['Verify the Bleak Beach request, jumping, Surf, and the Dive interaction after the update.'],
  },
  'bubbly-basin-expansion-access-guide': {
    status: 'Official source checked; DLC-access verification pending',
    method: 'Official Pokemon Pokopia update and Expansion Pass pages plus an access-screen capture.',
    checks: ['Verify the Bleak Beach request, Dive requirement, and current regional access notice.'],
  },
  'pokemon-request-planning-guide': {
    status: 'Official source checked; gameplay verification pending',
    method: 'Nintendo News and official Pokemon Pokopia site review plus a request-log capture.',
    checks: ['Capture one request, its stated need, and the related town or habitat change.'],
  },
  'materials-crops-cooking-guide': {
    status: 'Official source checked; gameplay verification pending',
    method: 'Nintendo News and official Pokemon Pokopia site review plus one complete loop capture.',
    checks: ['Record gathering materials, growing a crop, and cooking the result without adding unsupported yields.'],
  },
}

export function guideVerification(slug: string) {
  return firstBatch[slug] || null
}

