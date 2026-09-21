const fs = require('fs');
const g = require('../src/data/guides.json');
const p = require('../src/data/pokemon.json');
const h = require('../src/data/habitats.json');

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const pokemonNames = p.map(pk => ({
  id: pk.id,
  name: pk.name,
  regex: new RegExp('\\b' + escapeRegex(pk.name) + '\\b', 'i')
}));

const habitatNames = h.map(hb => ({
  id: hb.id,
  name: hb.name,
  regex: new RegExp('\\b' + escapeRegex(hb.name) + '\\b', 'i')
}));

let updatedCount = 0;
let skippedCount = 0;

g.forEach(guide => {
  // Skip if already has all link types
  if (guide.related_pokemon || guide.related_items || guide.related_habitats) {
    skippedCount++;
    return;
  }

  const content = guide.content || '';

  const foundPokemon = pokemonNames
    .filter(pk => pk.regex.test(content))
    .map(pk => pk.id)
    .slice(0, 6);

  const foundHabitats = habitatNames
    .filter(hb => hb.regex.test(content))
    .map(hb => hb.id)
    .slice(0, 4);

  if (foundPokemon.length === 0 && foundHabitats.length === 0) {
    return; // can't auto-link
  }

  guide.related_pokemon = foundPokemon.join(',') || undefined;
  guide.related_habitats = foundHabitats.join(',') || undefined;
  updatedCount++;
});

console.log('Updated:', updatedCount, 'guides');
console.log('Skipped (already had links):', skippedCount);

fs.writeFileSync('src/data/guides.json', JSON.stringify(g, null, 2));
console.log('Saved to src/data/guides.json');
