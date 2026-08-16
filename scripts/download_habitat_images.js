import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const habitats = JSON.parse(readFileSync('src/data/habitats.json', 'utf-8'));
const outputDir = 'public/images/habitats';

mkdirSync(outputDir, { recursive: true });

async function fetchPage(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
  });
  return await response.text();
}

async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = await response.arrayBuffer();
    await writeFile(filepath, Buffer.from(buffer));
    return true;
  } catch (e) {
    console.error(`  Failed: ${e.message}`);
    return false;
  }
}

function extractImageUrls(html) {
  const urls = [];
  // Match habitat images
  const regex = /(?:https:\/\/)?assets\.pokopiawiki\.com\/habitats\/[^"']+\.(jpg|jpeg|png|webp)/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    let url = match[0];
    if (!url.startsWith('https://')) url = 'https://' + url;
    urls.push(url);
  }
  return [...new Set(urls)];
}

async function main() {
  console.log(`Processing ${habitats.length} habitats...\n`);

  let success = 0;
  let failed = 0;

  for (const h of habitats) {
    process.stdout.write(`${h.slug}... `);

    try {
      const html = await fetchPage(`https://pokopiawiki.com/habitats/${h.slug}`);
      const imageUrls = extractImageUrls(html);

      if (imageUrls.length > 0) {
        // Extract number from slug like "001-tall-grass"
        const num = h.slug.split('-')[0];
        const ext = imageUrls[0].split('.').pop();
        const filename = `${num}.${ext}`;
        const filepath = join(outputDir, filename);

        const ok = await downloadImage(imageUrls[0], filepath);
        if (ok) {
          h.image_url = `/images/habitats/${filename}`;
          h.image_alt = `${h.name} habitat image`;
          success++;
          console.log(`✓ -> ${filename}`);
        } else {
          failed++;
          console.log(`✗`);
        }
      } else {
        console.log(`no image found`);
        failed++;
      }

      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      console.error(`Error: ${e.message}`);
      failed++;
    }
  }

  writeFileSync('src/data/habitats.json', JSON.stringify(habitats, null, 2));

  console.log(`\n=== Results ===`);
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
}

main().catch(console.error);
