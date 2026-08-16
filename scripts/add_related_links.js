import { readFileSync, writeFileSync } from 'fs';

const guides = JSON.parse(readFileSync('src/data/guides.json', 'utf-8'));
const pokemon = JSON.parse(readFileSync('src/data/pokemon.json', 'utf-8'));
const habitats = JSON.parse(readFileSync('src/data/habitats.json', 'utf-8'));

// Build name->id maps
const pokemonMap = {};
for (const p of pokemon) {
  pokemonMap[p.name.toLowerCase()] = p.id;
  // Also add variations
  pokemonMap[p.name.toLowerCase().replace(/[^a-z]/g, '')] = p.id;
}

const habitatMap = {};
for (const h of habitats) {
  habitatMap[h.name.toLowerCase()] = h.id;
}

let updated = 0;

for (const g of guides) {
  if (!g.related_pokemon && g.content) {
    const content = g.content.toLowerCase();
    const foundPokemon = [];
    
    // Match Pokemon names
    for (const p of pokemon) {
      const name = p.name.toLowerCase();
      if (content.includes(name) && !foundPokemon.includes(p.id)) {
        foundPokemon.push(p.id);
        if (foundPokemon.length >= 5) break; // Max 5
      }
    }
    
    if (foundPokemon.length > 0) {
      g.related_pokemon = foundPokemon.join(',');
      updated++;
    }
  }
}

writeFileSync('src/data/guides.json', JSON.stringify(guides, null, 2));
console.log(`Updated ${updated} guides with related_pokemon`);
// Add related_habitats too
const guides2 = JSON.parse(readFileSync('src/data/guides.json', 'utf-8'));
const habitats2 = JSON.parse(readFileSync('src/data/habitats.json', 'utf-8'));

const habitatMap2 = {};
for (const h of habitats2) {
  habitatMap2[h.name.toLowerCase()] = h.id;
}

let updated2 = 0;

for (const g of guides2) {
  if (!g.related_habitats && g.content) {
    const content = g.content.toLowerCase();
    const foundHabitats = [];
    
    for (const h of habitats2) {
      const name = h.name.toLowerCase();
      if (content.includes(name) && !foundHabitats.includes(h.id)) {
        foundHabitats.push(h.id);
        if (foundHabitats.length >= 3) break;
      }
    }
    
    if (foundHabitats.length > 0) {
      g.related_habitats = foundHabitats.join(',');
      updated2++;
    }
  }
}

writeFileSync('src/data/guides.json', JSON.stringify(guides2, null, 2));
console.log(`Updated ${updated2} guides with related_habitats`);
