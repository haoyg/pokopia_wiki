import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('src/data/pokemon.json', 'utf-8'));

// Fix Pokemon missing image metadata
for (const p of data) {
  const num = parseInt(p.id.slice(3));
  if (num >= 51 && num <= 56) {
    // Add missing image metadata
    p.image_original_media = '';
    p.image_license_note = 'Image pending verification';
    p.image_rights_status = 'unknown';
    p.image_usage_basis = 'unknown';
    p.image_rights_reviewed_at = '';
    console.log(`Fixed ${p.id}: ${p.name}`);
  }
}

writeFileSync('src/data/pokemon.json', JSON.stringify(data, null, 2));
console.log('\nUpdated pokemon.json');
