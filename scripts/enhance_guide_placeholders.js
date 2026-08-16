import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const guides = JSON.parse(readFileSync('src/data/guides.json', 'utf-8'));
const outputDir = 'public/images/guides';

mkdirSync(outputDir, { recursive: true });

// Category-based icon paths (simple SVG paths)
const categoryIcons = {
  story: '<path d="M100 100 L300 100 L300 200 L100 200 Z" fill="rgba(255,255,255,0.3)"/><path d="M150 150 L250 150 L250 250 L150 250 Z" fill="rgba(255,255,255,0.2)"/>',
  farming: '<circle cx="200" cy="200" r="80" fill="rgba(255,255,255,0.2)"/><circle cx="200" cy="200" r="50" fill="rgba(255,255,255,0.3)"/>',
  guide: '<rect x="120" y="120" width="160" height="160" rx="20" fill="rgba(255,255,255,0.2)"/><rect x="150" y="160" width="100" height="20" rx="5" fill="rgba(255,255,255,0.4)"/><rect x="150" y="200" width="80" height="15" rx="5" fill="rgba(255,255,255,0.3)"/><rect x="150" y="230" width="60" height="15" rx="5" fill="rgba(255,255,255,0.3)"/>',
  catch: '<circle cx="200" cy="180" r="60" fill="rgba(255,255,255,0.2)"/><circle cx="200" cy="180" r="40" fill="rgba(255,255,255,0.3)"/><circle cx="200" cy="180" r="20" fill="rgba(255,255,255,0.4)"/>',
  default: '<circle cx="200" cy="200" r="100" fill="rgba(255,255,255,0.1)"/><circle cx="200" cy="200" r="70" fill="rgba(255,255,255,0.15)"/><circle cx="200" cy="200" r="40" fill="rgba(255,255,255,0.2)"/>'
};

function getCategoryIcon(slug) {
  const s = slug.toLowerCase();
  if (s.includes('story')) return categoryIcons.story;
  if (s.includes('farming') || s.includes('crop') || s.includes('harvest')) return categoryIcons.farming;
  if (s.includes('catch') || s.includes('guide')) return categoryIcons.catch;
  if (s.includes('how-to') || s.includes('tutorial')) return categoryIcons.guide;
  return categoryIcons.default;
}

function generateEnhancedSvgPlaceholder(title, slug) {
  // Clean title for display
  const cleanTitle = title.length > 35 ? title.substring(0, 35) + '...' : title;
  const words = cleanTitle.split(' ');
  const line1 = words.slice(0, 3).join(' ');
  const line2 = words.slice(3, 6).join(' ');
  const line3 = words.slice(6).join(' ');

  // Generate a consistent color based on slug
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue1 = Math.abs(hash % 360);
  const hue2 = (hue1 + 30) % 360;
  const hue3 = (hue1 + 60) % 360;

  const icon = getCategoryIcon(slug);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="450" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:hsl(${hue1},75%,50%);stop-opacity:1" />
      <stop offset="50%" style="stop-color:hsl(${hue2},65%,40%);stop-opacity:1" />
      <stop offset="100%" style="stop-color:hsl(${hue3},55%,35%);stop-opacity:1" />
    </linearGradient>
    <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.15)"/>
    </pattern>
    <pattern id="lines" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="20" y2="20" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="800" height="450" fill="url(#bg)"/>

  <!-- Patterns for texture -->
  <rect width="800" height="450" fill="url(#dots)"/>
  <rect width="800" height="450" fill="url(#lines)"/>

  <!-- Decorative shapes -->
  <circle cx="50" cy="50" r="100" fill="rgba(255,255,255,0.05)"/>
  <circle cx="750" cy="400" r="150" fill="rgba(255,255,255,0.05)"/>
  <circle cx="700" cy="50" r="80" fill="rgba(255,255,255,0.03)"/>

  <!-- Category icon -->
  <g transform="translate(0, 30)">
    ${icon}
  </g>

  <!-- Title text -->
  <text x="400" y="165" font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle" style="text-shadow: 0 2px 8px rgba(0,0,0,0.3)">
    ${line1}
  </text>
  ${line2 ? `<text x="400" y="210" font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle" style="text-shadow: 0 2px 8px rgba(0,0,0,0.3)" opacity="0.9">
    ${line2}
  </text>` : ''}
  ${line3 ? `<text x="400" y="250" font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" font-size="24" fill="rgba(255,255,255,0.8)" text-anchor="middle" dominant-baseline="middle" style="text-shadow: 0 2px 4px rgba(0,0,0,0.2)">
    ${line3}
  </text>` : ''}

  <!-- Bottom decoration -->
  <rect x="300" y="290" width="200" height="3" rx="1.5" fill="rgba(255,255,255,0.4)"/>

  <!-- Pokopia badge -->
  <rect x="340" y="330" width="120" height="36" rx="18" fill="rgba(255,255,255,0.2)"/>
  <text x="400" y="353" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="white" text-anchor="middle" dominant-baseline="middle" letter-spacing="1">
    POKOPIA GUIDE
  </text>

  <!-- Corner accents -->
  <path d="M0 0 L60 0 L0 60 Z" fill="rgba(255,255,255,0.1)"/>
  <path d="M800 450 L740 450 L800 390 Z" fill="rgba(255,255,255,0.1)"/>
</svg>`;
}

let count = 0;
const existingFiles = new Set();

for (const g of guides) {
  if (g.image_url && g.image_url.endsWith('.svg')) {
    const svg = generateEnhancedSvgPlaceholder(g.title, g.slug);
    const filepath = join(outputDir, `${g.slug}.svg`);
    writeFileSync(filepath, svg);
    count++;
  }
}

console.log(`Enhanced ${count} SVG placeholders`);
