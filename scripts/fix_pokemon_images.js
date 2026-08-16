import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('src/data/pokemon.json', 'utf-8'));

// Fix Pokemon missing image metadata
for (const p of data) {
  const num = parseInt(p.id.slice(3));
  if (num >= 51 && num <= 56) {
    // Remove local image reference (no file exists) - use empty string
    p.image_url = '';
    // Use rights-review-required which is an allowed status
    p.image_rights_status = 'rights-review-required';
    p.image_usage_basis = '';
    p.image_rights_reviewed_at = '';
    p.image_original_media = '';
    p.image_license_note = '';
    p.image_source_url = '';
    console.log(`Fixed ${p.id}: ${p.name}`);
  }
}

writeFileSync('src/data/pokemon.json', JSON.stringify(data, null, 2));
console.log('\nUpdated pokemon.json');
