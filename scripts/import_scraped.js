/**
 * Import scraped data into the database
 * Transforms scraped JSON to match the existing data format
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCRAPED_DIR = join(__dirname, '..', 'scraped_data');
const DATA_DIR = join(__dirname, '..', 'src', 'data');

// Helper to generate unique ID
function generateId(prefix, name) {
  const normalized = name.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 20);
  return `${prefix}${normalized}`;
}

// Helper to determine category from slug
function guessCategory(slug) {
  if (slug.includes('how-to') || slug.includes('guide')) return 'guide';
  if (slug.includes('event')) return 'event';
  if (slug.includes('news') || slug.includes('update')) return 'news';
  if (slug.includes('tier') || slug.includes('best')) return 'tier';
  if (slug.includes('build')) return 'build';
  if (slug.includes('recipe') || slug.includes('cooking')) return 'guide';
  if (slug.includes('habitat')) return 'guide';
  return 'guide';
}

// Load existing data
function loadExistingData(filename) {
  const filepath = join(DATA_DIR, filename);
  if (existsSync(filepath)) {
    return JSON.parse(readFileSync(filepath, 'utf-8'));
  }
  return [];
}

// Load scraped data
function loadScrapedData(filename) {
  const filepath = join(SCRAPED_DIR, filename);
  if (existsSync(filepath)) {
    return JSON.parse(readFileSync(filepath, 'utf-8'));
  }
  return [];
}

// Transform Pokemon data from pokopiaguide
function transformPokemon(data) {
  return data.map((p, index) => {
    // Generate a proper ID
    const id = p.slug
      ? `pkm${String(index + 31).padStart(3, '0')}`
      : `pkm${String(index + 31).padStart(3, '0')}`;

    return {
      id,
      name: p.slug ? p.slug.charAt(0).toUpperCase() + p.slug.slice(1) : p.name || 'Unknown',
      type: Array.isArray(p.types) ? p.types.join('/') : (p.types || 'Normal'),
      rarity: 'common', // Default rarity, can be refined
      habitat: '', // Will be linked later
      favorite_food: Array.isArray(p.favorites) ? p.favorites[0] : '',
      spawn_time: Array.isArray(p.activeTime) ? p.activeTime.join(',') : (p.activeTime || 'Any'),
      weather: p.weather || 'Any',
      specialty: p.specialty || '',
      skills: '',
      drops: '',
      description: `A ${p.types?.join('/') || 'Normal'}-type Pokemon found in Pokopia.`,
      image_url: `/images/pokemon/${p.slug}.svg`,
      image_alt: `${p.name || p.slug} Pokemon artwork`,
      image_source: 'Scraped',
      image_source_url: p.url,
      overview: `This Pokemon appears during ${p.activeTime?.join(', ') || 'any time'} in ${p.weather || 'various'} weather.`,
      how_to_get: [
        `Found in ${p.habitats?.map(h => h.name).join(', ') || 'various habitats'}.`,
        `Preferred environment: ${p.preferredEnvironment || 'Unknown'}.`
      ],
      best_use: [
        `Specialty: ${p.specialty || 'Varied'}.`,
        `Can be found during ${p.activeTime?.join(', ') || 'any time'}.`
      ]
    };
  });
}

// Transform Guide data
function transformGuide(data, source) {
  return data.map((g, index) => {
    const id = `guid${String(index + 100).padStart(3, '0')}`;

    // Clean up content - decode HTML entities
    let content = g.content || g.description || '';
    content = content
      .replace(/&#x27;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"');

    // Extract answer from content if available
    let answer = '';
    if (content.length > 200) {
      answer = content.substring(0, 300) + '...';
    }

    return {
      id,
      title: g.title || g.slug,
      slug: g.slug,
      category: guessCategory(g.slug),
      seo_keyword: g.keywords?.[0] || g.slug.replace(/-/g, ' '),
      content,
      related_pokemon: '',
      related_items: '',
      related_habitats: '',
      image_url: '',
      image_alt: `${g.title || g.slug} guide image`,
      answer,
      steps: g.headings || [],
      recommended_setup: []
    };
  });
}

// Transform Habitat data
function transformHabitats(data) {
  return data.map((h, index) => {
    const id = `hab${String(index + 20).padStart(3, '0')}`;

    return {
      id,
      name: h.title?.replace(' Habitat Dex - Create the Perfect Home for Pokémon', '').replace(' Habitat Dex', '') || h.slug,
      slug: h.slug,
      unlock_condition: h.unlockCondition || '',
      description: h.description || '',
      weather: '',
      difficulty: 'medium',
      resource_bonus: '',
      spawn_list: h.spawnList?.map(p => p.name).join(',') || '',
      recommended_build: '',
      image_url: '',
      image_alt: '',
      features: [],
      materials_needed: h.materials?.map(m => m.name) || []
    };
  });
}

// Transform Habitat Materials
function transformHabitatMaterials(data) {
  return data.map((m, index) => {
    const id = `mat${String(index + 100).padStart(3, '0')}`;

    return {
      id,
      name: m.title?.replace(' — Habitat Materials Guide', '') || m.slug,
      slug: m.slug,
      category: m.category || 'misc',
      description: m.description || '',
      source: m.source,
      source_url: m.url,
      rarity: 'common',
      image_url: '',
      image_alt: ''
    };
  });
}

// Transform Items
function transformItems(data) {
  return data.map((i, index) => {
    const id = `item${String(index + 100).padStart(3, '0')}`;

    return {
      id,
      name: i.title?.replace(' | Pokopia Wiki', '').replace(' | Pokopia Guide', '') || i.slug,
      slug: i.slug,
      category: 'misc',
      description: i.description || '',
      source: i.source,
      source_url: i.url,
      rarity: 'common',
      image_url: '',
      image_alt: ''
    };
  });
}

// Transform Events
function transformEvents(data) {
  return data.map((e, index) => {
    const id = `event${String(index + 50).padStart(3, '0')}`;

    return {
      id,
      name: e.title?.replace(' | Pokopia Wiki', '').replace(' | Pokopia Guide', '') || e.slug,
      slug: e.slug,
      description: e.description || '',
      duration: e.duration || '',
      rewards: e.rewards || [],
      source: e.source,
      source_url: e.url,
      start_date: '',
      end_date: '',
      image_url: '',
      image_alt: ''
    };
  });
}

// Main import function
async function main() {
  console.log('Starting data import...\n');

  // Import Pokemon
  console.log('=== Importing Pokemon ===');
  const scrapedPokemon = loadScrapedData('pokemon_pokopiaguide.json');
  const existingPokemon = loadExistingData('pokemon.json');
  const newPokemon = transformPokemon(scrapedPokemon);

  // Check for duplicates and merge
  const existingSlugs = new Set(existingPokemon.map(p => p.id));
  const toAdd = newPokemon.filter(p => !existingSlugs.has(p.id));
  const mergedPokemon = [...existingPokemon, ...toAdd];

  writeFileSync(join(DATA_DIR, 'pokemon.json'), JSON.stringify(mergedPokemon, null, 2));
  console.log(`  Existing: ${existingPokemon.length}, New: ${toAdd.length}, Total: ${mergedPokemon.length}\n`);

  // Import Guides
  console.log('=== Importing Guides ===');

  // Guides from pokopiaguide
  const scrapedGuidesGuide = loadScrapedData('guides_pokopiaguide.json');
  const newGuidesGuide = transformGuide(scrapedGuidesGuide, 'pokopiaguide');

  // Guides from pokopiawiki
  const scrapedGuidesWiki = loadScrapedData('guides_pokopiawiki.json');
  const newGuidesWiki = transformGuide(scrapedGuidesWiki, 'pokopiawiki');

  const existingGuides = loadExistingData('guides.json');

  // Merge, avoiding duplicates by slug
  const existingGuideSlugs = new Set(existingGuides.map(g => g.slug));
  const toAddGuide = [...newGuidesGuide, ...newGuidesWiki].filter(g => !existingGuideSlugs.has(g.slug));
  const mergedGuides = [...existingGuides, ...toAddGuide];

  writeFileSync(join(DATA_DIR, 'guides.json'), JSON.stringify(mergedGuides, null, 2));
  console.log(`  From pokopiaguide: ${newGuidesGuide.length}`);
  console.log(`  From pokopiawiki: ${newGuidesWiki.length}`);
  console.log(`  Existing: ${existingGuides.length}, New: ${toAddGuide.length}, Total: ${mergedGuides.length}\n`);

  // Import Habitats
  console.log('=== Importing Habitats ===');
  const scrapedHabitats = loadScrapedData('habitats_pokopiawiki.json');
  const newHabitats = transformHabitats(scrapedHabitats);
  const existingHabitats = loadExistingData('habitats.json');

  const existingHabitatSlugs = new Set(existingHabitats.map(h => h.id));
  const toAddHabitat = newHabitats.filter(h => !existingHabitatSlugs.has(h.id));
  const mergedHabitats = [...existingHabitats, ...toAddHabitat];

  writeFileSync(join(DATA_DIR, 'habitats.json'), JSON.stringify(mergedHabitats, null, 2));
  console.log(`  Existing: ${existingHabitats.length}, New: ${toAddHabitat.length}, Total: ${mergedHabitats.length}\n`);

  // Import Habitat Materials
  console.log('=== Importing Habitat Materials ===');
  const scrapedMaterials = loadScrapedData('habitat_materials_pokopiaguide.json');
  const newMaterials = transformHabitatMaterials(scrapedMaterials);
  console.log(`  New materials: ${newMaterials.length}`);
  // Save to a separate file for materials (not in main schema but useful)
  writeFileSync(join(DATA_DIR, 'materials.json'), JSON.stringify(newMaterials, null, 2));
  console.log(`  Saved to materials.json\n`);

  // Import Items
  console.log('=== Importing Items ===');
  const scrapedItems = loadScrapedData('items_pokopiawiki.json');
  const newItems = transformItems(scrapedItems);
  console.log(`  New items: ${newItems.length}`);
  writeFileSync(join(DATA_DIR, 'items.json'), JSON.stringify(newItems, null, 2));
  console.log(`  Saved to items.json\n`);

  // Import Events
  console.log('=== Importing Events ===');
  const scrapedEventsGuide = loadScrapedData('events_pokopiaguide.json');
  const scrapedEventsWiki = loadScrapedData('events_pokopiawiki.json');
  const newEvents = [...transformEvents(scrapedEventsGuide), ...transformEvents(scrapedEventsWiki)];
  console.log(`  From pokopiaguide: ${scrapedEventsGuide.length}`);
  console.log(`  From pokopiawiki: ${scrapedEventsWiki.length}`);
  console.log(`  Total new events: ${newEvents.length}`);
  writeFileSync(join(DATA_DIR, 'events.json'), JSON.stringify(newEvents, null, 2));
  console.log(`  Saved to events.json\n`);

  // Summary
  console.log('=== Import Summary ===');
  console.log(`  Pokemon: ${mergedPokemon.length} total`);
  console.log(`  Guides: ${mergedGuides.length} total`);
  console.log(`  Habitats: ${mergedHabitats.length} total`);
  console.log(`  Materials: ${newMaterials.length}`);
  console.log(`  Items: ${newItems.length}`);
  console.log(`  Events: ${newEvents.length}`);

  console.log('\nImport complete!');
  console.log('Next steps:');
  console.log('1. Review the merged data files in src/data/');
  console.log('2. Run "npm run dev" to test the site');
  console.log('3. Deploy when ready');
}

main().catch(console.error);
