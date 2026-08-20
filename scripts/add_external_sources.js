import { readFileSync, writeFileSync } from 'fs';

const guides = JSON.parse(readFileSync('src/data/guides.json', 'utf-8'));

// Official source URLs mapped by relevance
const officialSources = [
  {
    url: 'https://www.nintendo.com/us/store/products/pokemon-pokopia-switch-2/',
    label: 'Nintendo Store - Pokémon Pokopia',
    keywords: ['release', 'price', 'platform', 'switch', 'download', 'buy', 'edition', 'bonus', 'file size']
  },
  {
    url: 'https://pokopia.pokemon.com/en-us/',
    label: 'Official Pokémon Pokopia website',
    keywords: ['official', 'pokemon.com', 'overview', 'premise', 'about']
  },
  {
    url: 'https://www.nintendo.com/us/whatsnew/shape-the-world-and-build-a-cozy-new-life-in-pokemon-pokopia-available-now/',
    label: 'Nintendo News - Pokémon Pokopia available now',
    keywords: ['launch', 'available', 'overview', 'exploration', 'crafting', 'multiplayer', 'beginner']
  },
  {
    url: 'https://www.nintendo.com/us/whatsnew/heres-how-multiplayer-works-in-pokemon-pokopia/',
    label: 'Nintendo News - How multiplayer works',
    keywords: ['multiplayer', 'online', 'local', 'wireless', 'gameshare', 'palette town', 'cloud island', 'spectator', 'visit', 'friends']
  },
  {
    url: 'https://www.nintendo.com/us/whatsnew/get-the-most-out-of-pokemon-pokopia-with-these-helpful-tips/',
    label: 'Nintendo News - Helpful hints for Pokémon Pokopia',
    keywords: ['beginner', 'tips', 'starter', 'pokemon center', 'pc', 'bag', 'storage', 'organize', 'pokedex', 'habitat dex', 'food', 'move']
  },
  {
    url: 'https://pokopia.pokemon.com/en-us/create/',
    label: 'Pokemon Pokopia: Create - Life in Town',
    keywords: ['create', 'build', 'craft', 'building', 'crafting', 'move', 'leafage', 'rock smash', 'surf', 'glide', 'terrain', 'plant']
  },
  {
    url: 'https://pokopia.pokemon.com/en-us/discover/',
    label: 'Pokemon Pokopia: Discover - A Few Friendly Faces',
    keywords: ['discover', 'character', 'professor', 'tangrowth', 'peakychu', 'mosslax', 'smearguru', 'dj rotom', 'chef dente', 'pokemon', 'friend']
  }
];

function getMatchingSources(guide) {
  const title = (guide.title || '').toLowerCase();
  const keyword = (guide.seo_keyword || '').toLowerCase();
  const category = (guide.category || '').toLowerCase();
  const text = `${title} ${keyword} ${category}`;

  const matches = [];
  for (const source of officialSources) {
    for (const kw of source.keywords) {
      if (text.includes(kw)) {
        matches.push({ url: source.url, label: source.label });
        break;
      }
    }
  }
  return matches;
}

let updated = 0;

for (const guide of guides) {
  const existingUrls = new Set((guide.sources || []).map(s => s.url));
  const newSources = getMatchingSources(guide).filter(s => !existingUrls.has(s.url));

  if (newSources.length > 0) {
    guide.sources = [...(guide.sources || []), ...newSources];
    updated++;
  }
}

writeFileSync('src/data/guides.json', JSON.stringify(guides, null, 2));

console.log(`Added external sources to ${updated} guides`);

// Show examples
console.log('\nExamples:');
const withSources = guides.filter(g => g.sources && g.sources.length > 0).slice(0, 3);
for (const g of withSources) {
  console.log(`\n${g.slug}:`);
  g.sources.forEach(s => console.log(`  - ${s.label}: ${s.url}`));
}
