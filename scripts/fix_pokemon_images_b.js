import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('src/data/pokemon.json', 'utf-8'));

// PokemonDB image URL mapping
const pokemonDbImages = {
  'paras': 'https://img.pokemondb.net/artwork/large/paras.jpg',
  'parasect': 'https://img.pokemondb.net/artwork/large/parasect.jpg',
  'venonat': 'https://img.pokemondb.net/artwork/large/venonat.jpg',
  'venomoth': 'https://img.pokemondb.net/artwork/large/venomoth.jpg',
  'slowpoke': 'https://img.pokemondb.net/artwork/large/slowpoke.jpg',
};

for (const p of data) {
  const num = parseInt(p.id.slice(3));
  if (num >= 51 && num <= 56) {
    const slug = p.name.toLowerCase();
    
    if (pokemonDbImages[slug]) {
      p.image_url = pokemonDbImages[slug];
      p.image_source_url = pokemonDbImages[slug];
      p.image_source = 'PokemonDB';
      p.image_rights_status = 'fair_use_editorial';
      p.image_license_note = 'PokemonDB.net artwork used under fair use for educational/editorial purposes.';
      p.image_original_media = pokemonDbImages[slug];
      p.image_rights_reviewed_at = '2026-08-16';
      console.log(`Updated ${p.id}: ${p.name} -> ${p.image_url}`);
    } else {
      console.log(`No image mapping for ${p.id}: ${p.name}`);
    }
  }
}

writeFileSync('src/data/pokemon.json', JSON.stringify(data, null, 2));
console.log('\nDone!');
