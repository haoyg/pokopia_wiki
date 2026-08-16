/**
 * Pokopia Content Scraper
 * Scrapes data from pokopiaguide.com and pokopiawiki.com
 * Output: JSON files for manual review before import
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const BASE_URL_GUIDE = 'https://pokopiaguide.com';
const BASE_URL_WIKI = 'https://pokopiawiki.com';
const OUTPUT_DIR = './scraped_data';

// Delay between requests to be respectful
const DELAY = 500;

async function fetchPage(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    clearTimeout(timeout);
    return await response.text();
  } catch (error) {
    clearTimeout(timeout);
    console.error(`Failed to fetch ${url}: ${error.message}`);
    return null;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Extract Pokemon data from page HTML
function parsePokemonPageGuide(html, slug) {
  const data = { source: 'pokopiaguide', slug, url: `${BASE_URL_GUIDE}/pokedex/${slug}` };

  // Extract number
  const noMatch = html.match(/No\.(\d+)/);
  if (noMatch) data.no = parseInt(noMatch[1]);

  // Extract types
  const typeMatch = html.match(/((?:Grass|Fire|Water|Electric|Psychic|Fighting|Poison|Normal|Ghost|Fairy|Dragon|Steel|Ice|Bug|Rock|Ground|Dark){1,2}(?:\s*\/\s*(?:Grass|Fire|Water|Electric|Psychic|Fighting|Poison|Normal|Ghost|Fairy|Dragon|Steel|Ice|Bug|Rock|Ground|Dark))?)/);
  if (typeMatch) data.types = typeMatch[1].split('/').map(t => t.trim());

  // Extract specialty
  const specialtyMatch = html.match(/Specialty\s+(\w+)/i);
  if (specialtyMatch) data.specialty = specialtyMatch[1];

  // Extract time of day
  const times = [];
  if (html.includes('Dawn') || html.includes('Morning')) times.push('Morning');
  if (html.includes('Daytime') || html.includes('Day')) times.push('Day');
  if (html.includes('Dusk') || html.includes('Evening')) times.push('Evening');
  if (html.includes('Nighttime') || html.includes('Night')) times.push('Night');
  if (times.length) data.activeTime = times;

  // Extract weather
  const weatherMatch = html.match(/Weather\s+((?:Sunny|Cloudy|Rainy|Snowy|Windy)+)/i);
  if (weatherMatch) data.weather = weatherMatch[1];

  // Extract favorite environment
  const envMatch = html.match(/Preferred Environment\s+([A-Za-z\s]+?)(?:\s+Favorites|$)/i);
  if (envMatch) data.preferredEnvironment = envMatch[1].trim();

  // Extract favorites
  const favorites = [];
  const favPatterns = [
    'Lots of nature', 'Soft Stuff', 'Cute Stuff', 'Lots of Water',
    'Group Activities', 'Sweet Flavors', 'Rough Stuff', 'Spicy Flavors',
    'Solitary', 'Quiet Place', 'Cozy Spot', 'Watery Area'
  ];
  favPatterns.forEach(fav => {
    if (html.includes(fav)) favorites.push(fav);
  });
  if (favorites.length) data.favorites = favorites;

  // Extract habitats
  const habitats = [];
  const habitatRegex = /href="\/habitat\/([^"]+)"[^>]*>([^<]+)<\/a>\s*(?:Common|Rare|Legendary)/g;
  let match;
  while ((match = habitatRegex.exec(html)) !== null) {
    habitats.push({ slug: match[1], name: match[2].trim(), rarity: 'Common' });
  }
  if (habitats.length) data.habitats = habitats;

  // Extract related pokemon
  const related = [];
  const relatedRegex = /href="\/pokedex\/([^"]+)"[^>]*>.*?#(\d+)\s+(\w+)/g;
  while ((match = relatedRegex.exec(html)) !== null) {
    related.push({ slug: match[1], no: parseInt(match[2]), name: match[3] });
  }
  if (related.length) data.relatedPokemon = related;

  return data;
}

function parsePokemonPageWiki(html, slug) {
  const data = { source: 'pokopiawiki', slug, url: `${BASE_URL_WIKI}/pokedex/${slug}` };

  // Extract number
  const noMatch = slug.match(/(\d+)-/);
  if (noMatch) data.no = parseInt(noMatch[1]);

  // Extract name from slug
  const nameMatch = slug.match(/\d+-(\w+)/);
  if (nameMatch) data.name = nameMatch[1];

  // Extract types from meta or content
  const typeMatch = html.match(/"@type":"[^"]*","name":"([^"]+)"[^}]*(?:type|types)[^}]*}/);
  if (!typeMatch) {
    const altMatch = html.match(/(Grass|Fire|Water|Electric|Psychic|Fighting|Poison|Normal|Ghost|Fairy|Dragon|Steel|Ice|Bug|Rock|Ground|Dark)/g);
    if (altMatch) data.types = [...new Set(altMatch)];
  }

  // Extract specialty
  const specialtyMatch = html.match(/Specialty\s*([^"<]+)/i);
  if (specialtyMatch) data.specialty = specialtyMatch[1].trim();

  // Extract weaknesses
  const weaknessMatch = html.match(/Weaknesses?\s*((?:Fire|Ice|Poison|Flying|Bug|Ground|Psychic|Ghost|Dragon|Fairy|Steel|Dark|Normal|Rock|Water|Electric|Grass){1,})/i);
  if (weaknessMatch) data.weaknesses = weaknessMatch[1].split(' ');

  // Extract height/weight
  const heightMatch = html.match(/Height\s*([\d.]+m)/);
  if (heightMatch) data.height = heightMatch[1];
  const weightMatch = html.match(/Weight\s*([\d.]+kg)/);
  if (weightMatch) data.weight = weightMatch[1];

  // Extract locations
  const locations = [];
  const locRegex = /Locations?\s*([^"<]+?)(?:\s*Time|Weather|$)/gi;
  let match;
  while ((match = locRegex.exec(html)) !== null) {
    const loc = match[1].trim();
    if (loc && loc.length > 2 && loc.length < 50) locations.push(loc);
  }
  if (locations.length) data.locations = locations;

  // Extract time of day
  const times = [];
  if (html.includes('Morning')) times.push('Morning');
  if (html.includes('Day')) times.push('Day');
  if (html.includes('Evening') || html.includes('Dusk')) times.push('Evening');
  if (html.includes('Night')) times.push('Night');
  if (times.length) data.activeTime = times;

  // Extract weather
  const weatherMatch = html.match(/Weather\s+((?:Sun|Cloud|Rain|Natural)+)/i);
  if (weatherMatch) data.weather = weatherMatch[1];

  return data;
}

// Extract Guide data from page HTML
function parseGuidePage(html, slug, baseUrl) {
  const data = {
    source: baseUrl.includes('guide') ? 'pokopiaguide' : 'pokopiawiki',
    slug,
    url: `${baseUrl}/guides/${slug}`
  };

  // Extract title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch) data.title = titleMatch[1].replace(/\s*\|\s*Pokopia/i, '').trim();

  // Extract meta description
  const descMatch = html.match(/name="description"\s+content="([^"]+)"/i);
  if (descMatch) data.description = descMatch[1];

  // Extract keywords
  const keywordsMatch = html.match(/name="keywords"\s+content="([^"]+)"/i);
  if (keywordsMatch) data.keywords = keywordsMatch[1].split(',').map(k => k.trim());

  // Extract published date
  const dateMatch = html.match(/(?:Published|Updated)?\s*(\w+\s+\d{1,2},?\s+\d{4})/i);
  if (dateMatch) data.date = dateMatch[1];

  // Extract author
  const authorMatch = html.match(/Author\s+([A-Za-z\s]+?)(?:\s*\|\s*$|\s*<)/i);
  if (authorMatch) data.author = authorMatch[1].trim();

  // Extract main content - get text between paragraphs
  const contentMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (contentMatch) {
    // Strip HTML tags but preserve structure
    const text = contentMatch[1]
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (text.length > 100) data.content = text;
  }

  // Extract headings for structure
  const headings = [];
  const headingRegex = /<h[23][^>]*>([^<]+)<\/h[23]>/gi;
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    headings.push(match[1].trim());
  }
  if (headings.length) data.headings = headings;

  return data;
}

// Extract Habitat data
function parseHabitatPage(html, slug, baseUrl) {
  const data = {
    source: baseUrl.includes('guide') ? 'pokopiaguide' : 'pokopiawiki',
    slug,
    url: `${baseUrl}/habitat/${slug}`
  };

  // Extract title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch) data.title = titleMatch[1].replace(/\s*\|\s*Pokopia/i, '').trim();

  // Extract description
  const descMatch = html.match(/name="description"\s+content="([^"]+)"/i);
  if (descMatch) data.description = descMatch[1];

  // Extract unlock condition
  const unlockMatch = html.match(/(?:Unlock|How to (?:get|obtain))[^\n]*([^\n<]+)/i);
  if (unlockMatch) data.unlockCondition = unlockMatch[1].trim();

  // Extract related pokemon
  const pokemon = [];
  const pokeRegex = /href="\/pokedex\/([^"]+)"[^>]*>([^<]+)<\/a>/gi;
  let match;
  while ((match = pokeRegex.exec(html)) !== null) {
    pokemon.push({ slug: match[1], name: match[2].trim() });
  }
  if (pokemon.length) data.spawnList = pokemon;

  // Extract materials needed
  const materials = [];
  const matRegex = /href="\/habitat\/materials\/([^"]+)"[^>]*>([^<]+)<\/a>/gi;
  while ((match = matRegex.exec(html)) !== null) {
    materials.push({ slug: match[1], name: match[2].trim() });
  }
  if (materials.length) data.materials = materials;

  return data;
}

// Extract Event data
function parseEventPage(html, slug, baseUrl) {
  const data = {
    source: baseUrl.includes('guide') ? 'pokopiaguide' : 'pokopiawiki',
    slug,
    url: `${baseUrl}/events/${slug}`
  };

  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch) data.title = titleMatch[1].replace(/\s*\|\s*Pokopia/i, '').trim();

  const descMatch = html.match(/name="description"\s+content="([^"]+)"/i);
  if (descMatch) data.description = descMatch[1];

  // Extract event duration
  const durationMatch = html.match(/(?:Duration|Event Period)\s*[:\-]?\s*([^\n<]+)/i);
  if (durationMatch) data.duration = durationMatch[1].trim();

  // Extract rewards
  const rewards = [];
  const rewardRegex = /(?:Reward|Prize|Items?)\s*[:\-]?\s*([^\n<]+)/gi;
  let match;
  while ((match = rewardRegex.exec(html)) !== null) {
    const reward = match[1].trim();
    if (reward && reward.length < 100) rewards.push(reward);
  }
  if (rewards.length) data.rewards = rewards;

  return data;
}

// Main scraping functions
async function scrapePokemonGuide() {
  console.log('Scraping pokopiaguide Pokemon...');
  const pages = [
    'bulbasaur', 'ivysaur', 'venusaur', 'charmander', 'charmeleon', 'charizard',
    'squirtle', 'wartortle', 'blastoise', 'pidgey', 'pidgeotto', 'pidgeot',
    'oddish', 'gloom', 'vileplume', 'bellossom', 'venusaur', 'bellsprout',
    'weepinbell', 'victreebel', 'paras', 'parasect', 'venonat', 'venomoth',
    'slowpoke', 'dlc'
  ];

  const results = [];
  for (const slug of pages) {
    const html = await fetchPage(`${BASE_URL_GUIDE}/pokedex/${slug}`);
    if (html) {
      results.push(parsePokemonPageGuide(html, slug));
      console.log(`  ✓ ${slug}`);
    }
    await delay(DELAY);
  }
  return results;
}

async function scrapePokemonWiki() {
  console.log('Scraping pokopiawiki Pokemon...');
  // This would need to be populated from the sitemap or index page
  return [];
}

async function scrapeGuides(baseUrl, guideList) {
  console.log(`Scraping ${baseUrl} Guides...`);
  const results = [];
  for (const slug of guideList) {
    const html = await fetchPage(`${baseUrl}/guides/${slug}`);
    if (html) {
      results.push(parseGuidePage(html, slug, baseUrl));
      console.log(`  ✓ ${slug}`);
    }
    await delay(DELAY);
  }
  return results;
}

async function scrapeHabitats() {
  console.log('Scraping pokopiawiki Habitats...');
  const pages = [
    '001-tall-grass', '002-tree-shaded-tall-grass', '003-boulder-shaded-tall-grass',
    '004-hydrated-tall-grass', '005-seaside-tall-grass', '006-elevated-tall-grass',
    '007-illuminated-tall-grass', '008-pretty-flower-bed', '009-tree-shaded-flower-bed',
    '010-hydrated-flower-bed', '011-field-of-flowers', '012-elevated-flower-bed',
    '013-grave-with-flowers', '014-flower-garden', '015-fresh-veggie-field',
    '016-riding-warm-updrafts', '017-campsite', '018-training-waterfall',
    '019-tantalizing-dining-set', '020-picnic-set', '021-flowery-table',
    '022-bench-with-greenery', '023-illuminated-bench', '024-exercise-resting-spot',
    '025-urgent-care', '026-gym-first-aid', '027-road-sign', '028-large-luggage-carrier',
    '029-lumberjacks-workplace', '030-bed-with-a-plush', '031-gently-lit-bed',
    '032-grave-offering', '033-creepy-grave-offering', '034-chansey-resting-area',
    '035-irresistible-scent-and-glow', '036-floating-in-the-shade', '037-smooth-tall-grass',
    '038-factory-storage', '039-luxury-chirp-chirp-meal', '040-berry-feast-campsite',
    '041-rain-dance-site', '042-sunny-day-site', '043-professors-treasure-trove',
    '044-crazy-log-handicrafts', '045-very-berry-space', '046-garden-terrace',
    '047-tree-shaded-snoozing-snorlax', '048-good-old-fashioned-antiques',
    '049-nothin-but-poke-balls', '050-yellow-tall-grass'
  ];
  const results = [];
  for (const slug of pages) {
    const html = await fetchPage(`${BASE_URL_WIKI}/habitats/${slug}`);
    if (html) {
      results.push(parseHabitatPage(html, slug, BASE_URL_WIKI));
      console.log(`  ✓ ${slug}`);
    }
    await delay(DELAY);
  }
  return results;
}

async function scrapeHabitatMaterials() {
  console.log('Scraping pokopiaguide Habitat Materials...');
  const results = [];
  const materials = POKOPIAGUIDE_URLS.habitatMaterials;
  for (const slug of materials) {
    const html = await fetchPage(`${BASE_URL_GUIDE}/habitat/materials/${slug}`);
    if (html) {
      const data = {
        source: 'pokopiaguide',
        slug,
        url: `${BASE_URL_GUIDE}/habitat/materials/${slug}`
      };
      // Extract title
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      if (titleMatch) data.title = titleMatch[1].replace(/\s*\|\s*Pokopia/i, '').trim();
      // Extract description
      const descMatch = html.match(/name="description"\s+content="([^"]+)"/i);
      if (descMatch) data.description = descMatch[1];
      // Extract category
      if (html.includes('Furniture') || html.includes('Bed') || html.includes('Chair') || html.includes('Table') || html.includes('Sofa') || html.includes('Desk') || html.includes('Dresser') || html.includes('Chest') || html.includes('Closet')) data.category = 'furniture';
      if (html.includes('Decor') || html.includes('Plant') || html.includes('Lamp') || html.includes('Painting') || html.includes('Statue')) data.category = 'decor';
      if (html.includes('Fossil')) data.category = 'fossil';
      if (html.includes('Recipe') || html.includes('Cooking') || html.includes('Food')) data.category = 'food';
      if (html.includes('Toy') || html.includes('Game')) data.category = 'toys';
      if (!data.category) data.category = 'misc';
      results.push(data);
      console.log(`  ✓ ${slug}`);
    }
    await delay(DELAY);
  }
  return results;
}

async function scrapeItemsWiki() {
  console.log('Scraping pokopiawiki Items...');
  const pages = [
    'abandoned-power-plant-kit', 'ability-shield', 'acrylic-poster', 'adorable-hedge',
    'adorable-hedge-blue', 'adorable-hedge-orange', 'adorable-hedge-purple',
    'adorable-hedge-red', 'adorable-hedge-sapling', 'adorable-hedge-sapling-grow',
    'adorable-hedge-seeds', 'adrenaline-orb', 'aether-paradise', 'afternoon-tea-set',
    'aged-stone-flooring', 'aged-stone-flooring-wallpaper', 'aged-stone-wall',
    'aged-stone-wall-wallpaper', 'air-conditioner', 'alarm-clock', 'alpine-grass',
    'altar-of-flame-kit', 'altar-of-the-flame-kit', 'antique-bed', 'antique-chair',
    'antique-chandelier', 'antique-chest', 'antique-clock', 'antique-closet',
    'antique-dresser', 'antique-sofa', 'antique-table', 'antique-wall-lower',
    'antique-wall-middle', 'antique-wall-upper', 'arcade-machine', 'arcanine-doll',
    'arch-bridge', 'arched-barrier', 'arched-barrier-leaf-pattern', 'arched-tiling',
    'arched-tiling-fragments', 'arched-tiling-wallpaper', 'area-zero', 'argyle-print',
    'armor-fossil', 'armor-fragment', 'arrow-sign'
  ];
  const results = [];
  for (const slug of pages) {
    const html = await fetchPage(`${BASE_URL_WIKI}/items/${slug}`);
    if (html) {
      const data = {
        source: 'pokopiawiki',
        slug,
        url: `${BASE_URL_WIKI}/items/${slug}`
      };
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      if (titleMatch) data.title = titleMatch[1].replace(/\s*\|\s*Pokopia/i, '').trim();
      const descMatch = html.match(/name="description"\s+content="([^"]+)"/i);
      if (descMatch) data.description = descMatch[1];
      results.push(data);
      console.log(`  ✓ ${slug}`);
    }
    await delay(DELAY);
  }
  return results;
}

async function scrapeEvents(baseUrl, eventList) {
  console.log(`Scraping ${baseUrl} Events...`);
  const results = [];
  for (const slug of eventList) {
    const html = await fetchPage(`${baseUrl}/events/${slug}`);
    if (html) {
      results.push(parseEventPage(html, slug, baseUrl));
      console.log(`  ✓ ${slug}`);
    }
    await delay(DELAY);
  }
  return results;
}

// URL Lists (extracted from site crawls)
const POKOPIAGUIDE_URLS = {
  pokemon: [
    'bulbasaur', 'ivysaur', 'venusaur', 'charmander', 'charmeleon', 'charizard',
    'squirtle', 'wartortle', 'blastoise', 'pidgey', 'pidgeotto', 'pidgeot',
    'oddish', 'gloom', 'vileplume', 'bellossom', 'bellsprout', 'weepinbell',
    'victreebel', 'paras', 'parasect', 'venonat', 'venomoth', 'slowpoke', 'dlc'
  ],
  guides: [
    'ancient-items-guide', 'block-float-underwater-building-guide',
    'how-to-craft-all-recipes', 'how-to-get-all-pokemon', 'multiplayer-guide',
    'mystery-gift-codes', 'pokopia-dlc-faq', 'smoothie-guide',
    'story-donyori', 'story-gotsugotsu', 'story-pasapasa', 'underwater-farming-guide',
    'update-history', 'how-to-get-copper-ore', 'how-to-get-ice', 'how-to-make-concrete'
  ],
  habitatMaterials: [
    'afternoon-tea-set', 'alarm-clock', 'antique-bed', 'antique-chair', 'antique-chest',
    'antique-closet', 'antique-dresser', 'arcade-machine', 'arcanine-doll', 'armor-fossil',
    'arrow-sign', 'auspicious-armor', 'balloon', 'barrel', 'bath-set', 'bathtub', 'bathub',
    'beach-chair', 'beach-parasol', 'beach-volleyball-set', 'bed-any', 'berry-basket',
    'berry-bed', 'berry-chair', 'berry-table', 'berry-table-lamp', 'berry-tree-any',
    'bicycle', 'big-drum', 'big-swim-ring', 'bonfire', 'boo-in-the-box', 'bookcase',
    'bottle-ship', 'bread-oven', 'bubble-machine', 'campfire', 'cannon', 'canoe', 'canvas',
    'cardboard-boxes', 'cart', 'cash-register', 'castform-weather-charm-rain',
    'castform-weather-charm-sun', 'cd-player', 'cd-rack', 'chansey-plant', 'chic-chair',
    'chic-sofa', 'chic-table', 'chimney-rock', 'chocolate-cookies', 'cleaning-set',
    'closet-any', 'colorful-coral', 'computer', 'concrete-pipe', 'control-unit',
    'cooking-stove', 'cool-electric-bass', 'cool-electric-guitar', 'cooler', 'counter',
    'crossing-gate', 'crystal-ball', 'cushion-bed', 'cute-bed', 'cute-dresser', 'cute-lamp',
    'cute-sofa', 'cute-table', 'cutting-board', 'desk-light', 'despot-fossil-body',
    'despot-fossil-head', 'despot-fossil-legs', 'despot-fossil-tail', 'display-stand',
    'dive-ball-ornament', 'doll-any', 'dragonite-doll', 'dresser-any', 'dry-tall-grass',
    'duckweed', 'eerie-candle', 'eevee-doll', 'excavation-tools', 'face-cutout-board',
    'firepit', 'first-aid-kit', 'fishing-rod', 'floating-inkay', 'floor-switch',
    'flower-backpack', 'flower-cushion', 'flower-tableware-set', 'food-counter',
    'fried-potatoes', 'frying-pan-any', 'furnace', 'gaming-bed', 'gaming-chair',
    'gaming-fridge', 'gaming-pc', 'garbage-bags', 'garbage-bin', 'garden-chair',
    'garden-light', 'garden-table', 'gold-teeth', 'gorgeous-bed', 'gorgeous-lamp',
    'gorgeous-sofa', 'gorgeous-table', 'gravestone', 'great-ball-ornament',
    'gyarados-fountain', 'handcart', 'hanging-scroll', 'harp', 'headbutt-fossil-body',
    'headbutt-fossil-head', 'headbutt-fossil-tail', 'heal-ball-ornament', 'hedge-any',
    'high-up-location', 'hoppip-water-bottle', 'hot-rock', 'hot-spring-spout',
    'hot-spring-water', 'humidifier', 'industrial-bed', 'industrial-chair',
    'industrial-desk', 'inflatable-boat', 'iron-beam-or-column', 'iron-bed', 'iron-chair',
    'iron-pipes', 'iron-scaffold', 'iron-table', 'jaw-fossil', 'jumbled-cords',
    'kitchen-table', 'knitting-supplies', 'lantern', 'laptop', 'large-boulder',
    'large-palm-tree', 'large-treasure-chest', 'large-tree-any', 'lava', 'light-any',
    'lighting-any', 'log-bed', 'log-chair', 'log-table', 'long-seaweed',
    'lost-relic-large', 'lunch-box', 'lure-ball-ornament', 'luxury-sofa', 'magazine-rack',
    'malicious-armor', 'manhole-cover', 'marine-chair', 'marine-chest', 'marine-dresser',
    'marine-sofa', 'marine-wardrobe', 'menu-board', 'metal-drum', 'microphone-stand',
    'microscope', 'microwave', 'mirror-large', 'mixer', 'modern-sink', 'molten-rock',
    'moonlight-dance-statue', 'moss', 'mossy-boulder', 'mountain-flowers', 'muddy-water',
    'mug', 'mushroom-lamp', 'music-box', 'music-mat-any', 'naptime-bed', 'net',
    'net-ball-ornament', 'newspaper', 'ocean-water', 'office-chair', 'office-desk',
    'office-locker', 'office-shelf', 'oriental-bed', 'oriental-partition', 'oriental-stand',
    'paper-party-cups', 'partition-any', 'party-plate', 'peaceful-flowers',
    'pedestal-exhibition-stand', 'pencil-holder', 'perch', 'photo-frame', 'picnic-basket',
    'pikachu-doll', 'pikachu-sofa', 'pink-tall-grass', 'pipe-chair', 'pitcher-plant-pot',
    'pizza', 'plain-bed', 'plain-chest', 'plain-lamp', 'plain-sofa', 'plain-table',
    'plated-food', 'pointy-tree', 'poke-ball-bed', 'poke-ball-light', 'poke-ball-sofa',
    'poke-ball-table', 'pole-traffic-cone', 'pop-bed', 'pop-sofa', 'pop-table',
    'potted-plant-any', 'professor-s-treasure', 'punching-bag', 'punching-game', 'push-cart',
    'quick-ball-ornament', 'raichu-sign', 'railway-track', 'red-tall-grass',
    'research-paper', 'resort-hammock', 'resort-light', 'resort-sofa', 'resort-table',
    'ribbon-cake', 'sail-fossil', 'sand-bed', 'sand-hill', 'sand-pile', 'sand-play-set',
    'sandbags', 'sandwiches', 'science-experiment', 'sea-moss', 'seafloor-grass',
    'seashore-flowers', 'seat-any', 'seat-long', 'seat-wide', 'shaved-ice', 'shell-cushion',
    'shell-lamp', 'shield-fossil-body', 'shield-fossil-head', 'shield-fossil-tail',
    'ship-s-wheel', 'shower', 'side-table', 'sign', 'sign-any', 'simple-cushion',
    'skull-fossil', 'skyland-flowers', 'slender-candle', 'slide', 'small-coral',
    'small-stage', 'small-vase', 'smelting-furnace', 'smooth-rock', 'soda-float',
    'sparkling-accessory', 'speaker', 'spotlight', 'stalagmites', 'stand-any',
    'standing-mic', 'step-stool', 'stepping-stones', 'stone-fireplace', 'straw-bed',
    'straw-stool', 'straw-table', 'streetlight-any', 'strength-rock', 'stylish-cooking-pot',
    'stylish-hedge', 'swim-ring', 'table-any', 'table-large', 'tablet',
    'tabletop-microphone', 'tall-coral', 'tall-grass', 'tall-grass-any', 'tea-set-any',
    'team-rocket-wall-hanging', 'television', 'tire-toy', 'tires', 'torch', 'towel-rack',
    'traffic-cone', 'trash-bag', 'trash-can-any', 'tree-stump-any', 'tundra-fossil-body',
    'tundra-fossil-head', 'tundra-fossil-tail', 'utility-pole', 'vending-machine', 'wagon',
    'walkway', 'wall-mirror', 'wall-mounted-towel', 'washstand', 'waste-bin-any', 'water',
    'water-bucket', 'waterfall', 'waterwheel', 'wheelbarrow', 'whiteboard', 'wildflowers',
    'windmill', 'wing-fossil-body', 'wing-fossil-head', 'wing-fossil-left-wing',
    'wing-fossil-right-wing', 'wing-fossil-tail', 'wireless-power-transmitter',
    'wooden-birdhouse', 'wooden-crate', 'wooden-path', 'yellow-tall-grass'
  ],
  events: [
    'april-fools-day', 'bulbasaur-jump-rope', 'feebas-beautiful-scale-collection',
    'jirachi-event', 'more-spores-for-hoppip', 'sableye-event', 'zorua-hide-and-sneak-event'
  ]
};

const POKOPIAWIKI_URLS = {
  pokemon: [
    '001-bulbasaur', '002-ivysaur', '003-venusaur', '004-charmander', '005-charmeleon',
    '006-charizard', '007-squirtle', '008-wartortle', '009-blastoise', '010-pidgey',
    '011-pidgeotto', '012-pidgeot', '013-oddish', '014-gloom', '015-vileplume',
    '016-bellossom', '017-paras', '018-parasect', '019-venonat', '020-venomoth',
    '021-bellsprout', '022-weepinbell', '023-victreebel', '024-slowpoke', '025-slowbro',
    '026-slowking', '027-magnemite', '028-magneton', '029-magnezone', '030-onix',
    '031-steelix', '032-cubone', '033-marowak', '034-tyrogue', '035-hitmonlee',
    '036-hitmonchan', '037-hitmontop', '038-koffing', '039-weezing', '040-tangela'
  ],
  guides: [
    '3d-printer-best-items-duplicate', '3d-printer-guide', 'all-hidden-furniture-guide',
    'all-human-records-locations-guide', 'all-new-habitats-and-pokemon-spawns',
    'all-new-pokemon-and-specialties', 'all-pokemon-in-bubbly-basin-dlc',
    'all-treasure-map-locations-and-solutions', 'berry-tree-sprinkler-crop-automation-layouts',
    'best-automatic-honey-farm-setups', 'best-builds-guide', 'best-dolls-dream-islands',
    'best-settings', 'bleak-beach-guide', 'bubbly-basin-dlc-guide',
    'bubbly-basin-how-to-find-the-starmie-doll', 'bubbly-basin-how-to-get-ocean-doors',
    'bulldoze-pokemon', 'camera-placement-afk-monitoring-harvest-timing',
    'cloud-islands-secret-developer-island-exploration', 'co-op-palette-town-trading',
    'cooking-guide', 'daily-activities-guide', 'dlc-wave-1-bubbly-basin-release-date',
    'dream-islands-guide', 'dry-flavors-guide', 'expansion-pass-price', 'game-length',
    'game-length-estimate', 'gimmighoul-trading-framed-items-rare-rewards',
    'habitats-building', 'habitats-dex-list', 'hoppip-event',
    'how-to-befriend-mew-and-mewtwo', 'how-to-befriend-the-kanto-legendary-birds',
    'how-to-befriend-with-ho-oh-and-lugia', 'how-to-befriend-with-raikou-entei-and-suicune',
    'how-to-break-and-move-large-boulder-rocks', 'how-to-find-the-windup-inkay',
    'how-to-fix-the-water-wheels', 'how-to-get-concrete', 'how-to-get-glass',
    'how-to-get-gold-teeth', 'how-to-get-gyarados', 'how-to-get-hoppip-skiploom-and-jumpluff',
    'how-to-get-ice', 'how-to-get-inflatable-sudowoodo', 'how-to-get-lumber',
    'how-to-get-paint', 'how-to-get-paper', 'how-to-get-phione', 'how-to-get-pokemetal',
    'how-to-get-portal-pods', 'how-to-get-porygon', 'how-to-get-shiny-pearls-in-bubbly-basin',
    'how-to-learn-suck-and-move-water', 'how-to-make-a-bubbly-basin-habitat-warmer',
    'how-to-make-a-hot-spring-shower-and-get-psyduck', 'how-to-make-a-pikachu-corner',
    'how-to-make-duckweed', 'how-to-make-lava-pools-and-streams',
    'how-to-unlock-bubbly-basin', 'how-to-unlock-dive-ability', 'how-to-unlock-magnet-rise',
    'how-to-use-security-cameras', 'how-to-win-hide-and-sneak', 'jumpluff-habitat',
    'lumber-farming', 'mosslax-location-wake-up-guide', 'photo-ops-guide',
    'rocky-ridges-guide', 'shiny-hunting', 'smooth-rock', 'squishy-clay',
    'stardust-guide', 'team-initiation-challenge', 'team-initiation-guide',
    'version-2-0-0-patch-notes', 'where-to-find-cotton-spores',
    'zorua-hide-and-sneak-event-release-date', 'zorua-hide-and-sneak-contest-guide'
  ],
  events: [
    'bulbasaur-s-jump-rope-contest', 'chansey-plan', 'copycat-challenge', 'crafting-set',
    'crafting-set-2', 'daily-support-set', 'ditto-rug', 'feebas-event', 'flat-top-tree',
    'furniture-set', 'hoppip-event'
  ]
};

// Run scraper
async function main() {
  console.log('Starting Pokopia content scraper...\n');

  // Create output directory
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Scrape Pokemon
  console.log('=== Pokemon ===');
  const pokemonGuide = await scrapePokemonGuide();
  writeFileSync(
    join(OUTPUT_DIR, 'pokemon_pokopiaguide.json'),
    JSON.stringify(pokemonGuide, null, 2)
  );
  console.log(`Saved ${pokemonGuide.length} Pokemon from pokopiaguide\n`);

  // Scrape Guides
  console.log('=== Guides ===');
  const guidesGuide = await scrapeGuides(BASE_URL_GUIDE, POKOPIAGUIDE_URLS.guides);
  writeFileSync(
    join(OUTPUT_DIR, 'guides_pokopiaguide.json'),
    JSON.stringify(guidesGuide, null, 2)
  );
  console.log(`Saved ${guidesGuide.length} guides from pokopiaguide`);

  const guidesWiki = await scrapeGuides(BASE_URL_WIKI, POKOPIAWIKI_URLS.guides);
  writeFileSync(
    join(OUTPUT_DIR, 'guides_pokopiawiki.json'),
    JSON.stringify(guidesWiki, null, 2)
  );
  console.log(`Saved ${guidesWiki.length} guides from pokopiawiki\n`);

  // Scrape Habitats
  console.log('=== Habitats ===');
  const habitats = await scrapeHabitats();
  writeFileSync(
    join(OUTPUT_DIR, 'habitats_pokopiawiki.json'),
    JSON.stringify(habitats, null, 2)
  );
  console.log(`Saved ${habitats.length} habitats from pokopiawiki\n`);

  // Scrape Habitat Materials
  console.log('=== Habitat Materials ===');
  const materials = await scrapeHabitatMaterials();
  writeFileSync(
    join(OUTPUT_DIR, 'habitat_materials_pokopiaguide.json'),
    JSON.stringify(materials, null, 2)
  );
  console.log(`Saved ${materials.length} habitat materials from pokopiaguide\n`);

  // Scrape Items (pokopiawiki)
  console.log('=== Items (pokopiawiki) ===');
  const itemsWiki = await scrapeItemsWiki();
  writeFileSync(
    join(OUTPUT_DIR, 'items_pokopiawiki.json'),
    JSON.stringify(itemsWiki, null, 2)
  );
  console.log(`Saved ${itemsWiki.length} items from pokopiawiki\n`);

  // Scrape Events
  console.log('=== Events ===');
  const eventsGuide = await scrapeEvents(BASE_URL_GUIDE, POKOPIAGUIDE_URLS.events);
  writeFileSync(
    join(OUTPUT_DIR, 'events_pokopiaguide.json'),
    JSON.stringify(eventsGuide, null, 2)
  );
  console.log(`Saved ${eventsGuide.length} events from pokopiaguide`);

  const eventsWiki = await scrapeEvents(BASE_URL_WIKI, POKOPIAWIKI_URLS.events);
  writeFileSync(
    join(OUTPUT_DIR, 'events_pokopiawiki.json'),
    JSON.stringify(eventsWiki, null, 2)
  );
  console.log(`Saved ${eventsWiki.length} events from pokopiawiki\n`);

  console.log('Scraping complete!');
  console.log(`Data saved to ./${OUTPUT_DIR}/`);
  console.log('\nNext steps:');
  console.log('1. Review the JSON files');
  console.log('2. Rewrite content as needed');
  console.log('3. Run import script to add to database');
}

main().catch(console.error);
