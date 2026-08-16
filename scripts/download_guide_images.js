import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const guides = JSON.parse(readFileSync('src/data/guides.json', 'utf-8'));
const baseUrl = 'https://pokopiawiki.com';
const outputDir = 'public/images/guides';

mkdirSync(outputDir, { recursive: true });

async function fetchPage(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
  });
  return await response.text();
}

async function downloadImage(url, filename) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const buffer = await response.arrayBuffer();
    await writeFile(join(outputDir, filename), Buffer.from(buffer));
    return true;
  } catch (e) {
    console.error(`  Failed: ${e.message}`);
    return false;
  }
}

function extractImageUrls(html) {
  const urls = [];
  // Match both with and without https://
  const regex = /(?:https:\/\/)?assets\.pokopiawiki\.com\/guides\/[^"']+\.(jpg|jpeg|png|webp)/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    let url = match[0];
    if (!url.startsWith('https://')) {
      url = 'https://' + url;
    }
    urls.push(url);
  }
  return [...new Set(urls)];
}

async function main() {
  // Get pokopiawiki guides that need images (new ones: guid100+)
  const wikiGuides = guides.filter(g =>
    g.slug &&
    (!g.image_url || g.image_url === '') &&
    g.id.startsWith('guid1')
  );

  console.log(`Found ${wikiGuides.length} guides that need images\n`);
  console.log('Sample:', wikiGuides.slice(0, 3).map(g => g.id + ': ' + g.slug));

  let success = 0;
  let failed = 0;

  for (const guide of wikiGuides) {
    process.stdout.write(`Processing: ${guide.slug}... `);

    try {
      const html = await fetchPage(`${baseUrl}/guides/${guide.slug}`);
      const imageUrls = extractImageUrls(html);

      if (imageUrls.length > 0) {
        const ext = imageUrls[0].split('.').pop();
        const filename = `${guide.slug}.${ext}`;
        const ok = await downloadImage(imageUrls[0], filename);

        if (ok) {
          guide.image_url = `/images/guides/${filename}`;
          console.log(`✓`);
          success++;
        } else {
          console.log(`✗`);
          failed++;
        }
      } else {
        console.log(`no images found`);
        failed++;
      }

      await new Promise(r => setTimeout(r, 300));
    } catch (e) {
      console.error(`Error: ${e.message}`);
      failed++;
    }
  }

  writeFileSync('src/data/guides.json', JSON.stringify(guides, null, 2));

  console.log(`\n=== Results ===`);
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
  console.log(`\nUpdated guides.json`);
}

main().catch(console.error);
