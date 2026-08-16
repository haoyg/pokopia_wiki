import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('src/data/habitats.json', 'utf-8'));

for (const h of data) {
  if (!h.overview) {
    h.overview = h.description || `Habitat ${h.id}`;
  }
}

writeFileSync('src/data/habitats.json', JSON.stringify(data, null, 2));
console.log('Fixed habitats.json');
