import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const guides = JSON.parse(readFileSync('src/data/guides.json', 'utf-8'));
const outputDir = 'public/images/guides';

mkdirSync(outputDir, { recursive: true });

function generateSvgPlaceholder(title, slug) {
  // Clean title for display
  const cleanTitle = title.length > 40 ? title.substring(0, 40) + '...' : title;
  const words = cleanTitle.split(' ');

  // Generate a consistent color based on slug
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue1 = Math.abs(hash % 360);
  const hue2 = (hue1 + 40) % 360;

  const bg = `linear-gradient(135deg, hsl(${hue1}, 70%, 45%) 0%, hsl(${hue2}, 60%, 35%) 100%)`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="450" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:hsl(${hue1},70%,50%);stop-opacity:1" />
      <stop offset="100%" style="stop-color:hsl(${hue2},60%,40%);stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#bg)"/>
  <text x="400" y="180" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">
    ${words.slice(0, 4).join(' ')}
  </text>
  <text x="400" y="230" font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="rgba(255,255,255,0.9)" text-anchor="middle" dominant-baseline="middle">
    ${words.slice(4).join(' ')}
  </text>
  <text x="400" y="350" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="rgba(255,255,255,0.7)" text-anchor="middle">
    Pokopia Guide
  </text>
  <rect x="350" y="380" width="100" height="4" rx="2" fill="rgba(255,255,255,0.5)"/>
</svg>`;
}

let count = 0;

for (const g of guides) {
  if (g.id && g.id.startsWith('guid') && !g.image_url) {
    const title = g.title || g.slug;
    const slug = g.slug;

    const svg = generateSvgPlaceholder(title, slug);
    const filename = `${slug}.svg`;
    const filepath = join(outputDir, filename);

    // Add PNG-like header to make it valid
    // Actually SVG is fine as-is
    writeFileSync(filepath, svg);

    g.image_url = `/images/guides/${filename}`;
    g.image_alt = `${title} guide image`;

    count++;
    process.stdout.write(`Created: ${filename}\n`);
  }
}

writeFileSync('src/data/guides.json', JSON.stringify(guides, null, 2));
console.log(`\nCreated ${count} placeholder images`);
